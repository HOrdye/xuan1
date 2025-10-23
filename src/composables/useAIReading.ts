import { ref, computed } from 'vue'
import { useLLMConfigStore } from '../store/llmConfig'
import { LLMService } from '../services/LLMService'
import type { StoryTarotCard } from '../features/tarot/utils/storyTarotData'
import type { TarotSpread } from '../features/tarot/utils/tarotInterpretation'
import type { Hexagram } from '../features/dilemma/types'

export interface AIReadingParams {
  // 塔罗牌解读参数
  tarot?: {
    cards: StoryTarotCard[]
    spread: TarotSpread
    question: string
  }
  // 卦象解读参数
  hexagram?: {
    hexagram: Hexagram
    question?: string
  }
  // 运势解读参数
  fortune?: {
    date: Date
    birthDate?: Date
    question?: string
  }
  // 笅杯解读参数（新增）
  jiaoBei?: {
    results: string[]
    question: string
  }
}

export type ReadingType = 'tarot' | 'hexagram' | 'fortune' | 'jiaoBei'

export function useAIReading() {
  const store = useLLMConfigStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const canUseAI = computed(() => store.canUseAI)
  const configStatus = computed(() => store.configStatus)
  
  const getReading = async (type: ReadingType, params: AIReadingParams) => {
    // 增强配置检查和错误日志
    console.log('🔍 检查AI服务可用性:', {
      canUseAI: canUseAI.value,
      configStatus: configStatus.value,
      hasApiKey: store.hasApiKey,
      provider: store.providerName,
      type
    })
    
    if (!canUseAI.value) {
      const errorMsg = `AI服务未配置完整：缺少${!store.config.apiKey ? 'API密钥' : ''}${!store.config.provider ? '服务提供商' : ''}`
      console.error('❌', errorMsg)
      throw new Error(errorMsg)
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      let result
      
      console.log(`🚀 开始${type}类型AI解读...`)
      
      switch (type) {
        case 'tarot':
          if (!params.tarot) throw new Error('缺少塔罗牌参数')
          console.log('🃏 调用塔罗牌解读服务:', {
            cardCount: params.tarot.cards.length,
            spread: params.tarot.spread.name,
            hasQuestion: !!params.tarot.question
          })
          // 确保cards包含orientation属性
          const cardsWithOrientation = params.tarot.cards.map(card => ({
            ...card,
            orientation: (card as any).orientation || 'upright' as 'upright' | 'reversed'
          }))
          result = await LLMService.getTarotInterpretation(
            cardsWithOrientation,
            params.tarot.spread,
            params.tarot.question
          )
          break
          
        case 'hexagram':
          if (!params.hexagram) throw new Error('缺少卦象参数')
          console.log('☯️ 调用卦象解读服务:', {
            hexagram: params.hexagram.hexagram.chineseName,
            hasQuestion: !!params.hexagram.question
          })
          result = await LLMService.getHexagramInterpretation(
            params.hexagram.hexagram,
            Array.isArray(params.hexagram.question) ? params.hexagram.question : []
          )
          break
          
        case 'fortune':
          if (!params.fortune) throw new Error('缺少运势参数')
          console.log('🌟 调用运势解读服务:', {
            date: params.fortune.date.toDateString(),
            hasBirthDate: !!params.fortune.birthDate
          })
          // TODO: 实现运势解读功能
          result = `运势解读功能开发中，敬请期待。\n日期：${params.fortune.date.toLocaleDateString('zh-CN')}`
          break
          
        case 'jiaoBei':
          if (!params.jiaoBei) throw new Error('缺少笅杯参数')
          console.log('🥄 调用笅杯解读服务:', {
            results: params.jiaoBei.results,
            question: params.jiaoBei.question
          })
          // 为笅杯占卜创建自定义prompt
          const jiaoBeiPrompt = buildJiaoBeiPrompt(params.jiaoBei.results, params.jiaoBei.question)
          result = await callCustomReading(jiaoBeiPrompt)
          break
          
        default:
          throw new Error(`不支持的解读类型: ${type}`)
      }
      
      console.log(`✅ ${type}类型AI解读完成`)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '解读失败'
      error.value = errorMessage
      console.error(`❌ ${type}类型AI解读失败:`, err)
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }
  
  // 获取本地解读（降级策略）
  const getLocalReading = (type: ReadingType, params: AIReadingParams) => {
    console.log(`🏠 使用本地${type}解读`)
    switch (type) {
      case 'jiaoBei':
        if (!params.jiaoBei) return '笅杯解读参数缺失'
        return generateLocalJiaoBeiReading(params.jiaoBei.results, params.jiaoBei.question)
      default:
        return '本地解读功能正在开发中'
    }
  }
  
  // 智能解读（AI优先，本地降级）
  const getSmartReading = async (type: ReadingType, params: AIReadingParams) => {
    if (canUseAI.value) {
      try {
        return await getReading(type, params)
      } catch (err) {
        console.warn(`⚠️ ${type} AI解读失败，使用本地解读:`, err)
        return getLocalReading(type, params)
      }
    } else {
      console.log(`📝 AI服务不可用，直接使用本地${type}解读`)
      return getLocalReading(type, params)
    }
  }
  
  return {
    isLoading,
    error,
    canUseAI,
    configStatus,
    getReading,
    getLocalReading,
    getSmartReading
  }
}

// 构建笅杯占卜的prompt
function buildJiaoBeiPrompt(results: string[], question: string): string {
  const resultText = results.join('、')
  
  return `作为专业的笅杯占卜师，请为以下笅杯占卜结果提供深度解读：

**问题**: ${question}
**投掷结果**: ${resultText}

请从以下角度提供解读：
1. **结果解读**: 根据笅杯的正反面组合，解释神明的回应
2. **指导建议**: 基于结果给出具体的行动建议
3. **注意事项**: 提醒需要关注的重点和可能的风险
4. **时机分析**: 分析当前时机是否合适采取行动

解读要温暖有力量，给人希望和方向。`
}

// 调用自定义解读
async function callCustomReading(prompt: string): Promise<string> {
  try {
    console.log('🔮 调用自定义解读服务...')
    
    // 使用LLMService的公共方法
    return await LLMService.getCustomInterpretation(prompt)
  } catch (error) {
    console.error('❌ 自定义解读调用失败:', error)
    // 回退到本地解读
    return generateLocalJiaoBeiReading(['圣杯', '笑杯'], '请提供您的问题')
  }
}

// 生成本地笅杯解读
function generateLocalJiaoBeiReading(results: string[], question: string): string {
  const resultText = results.join('、')
  
  // 简单的本地解读逻辑
  const interpretations = {
    '圣杯、圣杯': '双圣杯表示非常吉利，神明给予明确的肯定回应。',
    '圣杯、笑杯': '一圣一笑表示基本吉利，但需要保持谨慎乐观的态度。',
    '圣杯、阴杯': '一圣一阴表示情况复杂，需要更多耐心和智慧。',
    '笑杯、笑杯': '双笑杯表示神明带着善意的提醒，事情会有转机。',
    '笑杯、阴杯': '一笑一阴表示情况尚未明朗，建议再次祈求指引。',
    '阴杯、阴杯': '双阴杯表示时机未到，建议暂缓行动，多做准备。'
  }
  
  const interpretation = interpretations[resultText as keyof typeof interpretations] || '请根据具体情况灵活理解笅杯的指引。'
  
  return `## 笅杯占卜解读

**您的问题**: ${question}
**投掷结果**: ${resultText}

**解读**: ${interpretation}

**建议**: 笅杯占卜体现了与神明的对话，请以虔诚的心态理解指引，并结合自己的智慧做出决策。

愿您得到最好的指引！🙏`
} 
const fs = require('fs');
const path = require('path');

// 正确的LLMService.ts文件内容
const correctLLMServiceContent = `import type { Hexagram } from '../features/dilemma/types';
import type { StoryTarotCard } from '../features/tarot/utils/storyTarotData';
import type { TarotSpread } from '../features/tarot/utils/tarotInterpretation';
import { EnvConfigManager } from '../utils/envConfig';

/**
 * 塔罗牌结构化解读结果接口
 */
export interface StructuredTarotInterpretation {
  overallInterpretation: {
    title: string;
    content: string;
  };
  cardInterpretations: Array<{
    position: string;
    cardName: string;
    interpretation: string;
  }>;
  guidance: {
    title: string;
    content: string;
  };
  summary: {
    title: string;
    content: string;
  };
}

/**
 * LLM配置接口
 */
export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'deepseek' | 'qwen' | 'zhipu' | 'moonshot';
  apiKey: string;
  baseURL?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * LLM响应接口
 */
export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * 加载状态接口
 */
export interface LLMLoadingState {
  isLoading: boolean;
  progress: string;
  stage: 'preparing' | 'calling' | 'processing' | 'completed' | 'error';
}

/**
 * 默认配置
 */
const DEFAULT_CONFIG: LLMConfig = {
  provider: 'deepseek',
  apiKey: EnvConfigManager.getLLMApiKey(),
  baseURL: EnvConfigManager.getLLMBaseURL(),
  model: 'deepseek-chat',
  temperature: 0.7,
  maxTokens: 4000
};

console.log('🔧 LLM Service 初始化配置:', {
  provider: DEFAULT_CONFIG.provider,
  hasApiKey: !!DEFAULT_CONFIG.apiKey,
  baseURL: DEFAULT_CONFIG.baseURL || '使用默认',
  model: DEFAULT_CONFIG.model
});

/**
 * LLM服务类 - 支持多个主流LLM提供商
 */
export class LLMService {
  private static config: LLMConfig = DEFAULT_CONFIG;
  private static loadingCallbacks: ((state: LLMLoadingState) => void)[] = [];
  
  /**
   * 设置LLM配置
   */
  static setConfig(config: Partial<LLMConfig>) {
    this.config = { ...this.config, ...config };
    console.log('🔧 LLM配置已更新:', {
      provider: this.config.provider,
      hasApiKey: !!this.config.apiKey,
      model: this.config.model
    });
  }
  
  /**
   * 获取当前配置
   */
  static getConfig(): LLMConfig {
    return { ...this.config };
  }
  
  /**
   * 注册加载状态回调
   */
  static onLoadingStateChange(callback: (state: LLMLoadingState) => void) {
    this.loadingCallbacks.push(callback);
  }
  
  /**
   * 移除加载状态回调
   */
  static offLoadingStateChange(callback: (state: LLMLoadingState) => void) {
    const index = this.loadingCallbacks.indexOf(callback);
    if (index > -1) {
      this.loadingCallbacks.splice(index, 1);
    }
  }
  
  /**
   * 更新加载状态
   */
  private static updateLoadingState(state: LLMLoadingState) {
    this.loadingCallbacks.forEach(callback => callback(state));
  }

  /**
   * 获取塔罗牌解读
   */
  static async getTarotInterpretation(
    cards: StoryTarotCard[],
    spread: TarotSpread,
    question: string = ''
  ): Promise<StructuredTarotInterpretation> {
    this.updateLoadingState({
      isLoading: true,
      progress: '正在准备塔罗牌解读...',
      stage: 'preparing'
    });

    try {
      console.log('🔮 开始塔罗牌解读...', {
        cardCount: cards.length,
        spread: spread.name,
        hasQuestion: !!question,
        provider: this.config.provider
      });

      if (!this.config.apiKey) {
        console.warn('⚠️ 未配置LLM API密钥，使用本地塔罗解读');
        
        this.updateLoadingState({
          isLoading: true,
          progress: '使用传统塔罗解读中...',
          stage: 'processing'
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const result = this.getLocalTarotInterpretation(cards, spread, question);
        
        this.updateLoadingState({
          isLoading: false,
          progress: '塔罗解读完成',
          stage: 'completed'
        });
        
        return result;
      }
      
      this.updateLoadingState({
        isLoading: true,
        progress: '正在构建解读参数...',
        stage: 'preparing'
      });
      
      const prompt = this.buildTarotPrompt(cards, spread, question);
      
      this.updateLoadingState({
        isLoading: true,
        progress: '正在调用AI塔罗解读...',
        stage: 'calling'
      });
      
      const response = await this.callLLMAPI(prompt);
      
      this.updateLoadingState({
        isLoading: true,
        progress: '正在生成个性化解读...',
        stage: 'processing'
      });
      
      if (response.content) {
        let result: StructuredTarotInterpretation;
        try {
          result = JSON.parse(response.content);
        } catch (e) {
          result = this.convertToStructuredInterpretation(response.content, cards, spread);
        }
        
        this.updateLoadingState({
          isLoading: false,
          progress: '塔罗解读完成',
          stage: 'completed'
        });
        
        return result;
      } else {
        throw new Error('AI返回空的塔罗解读');
      }
    } catch (error) {
      console.error('❌ 塔罗解读失败:', error);
      
      this.updateLoadingState({
        isLoading: false,
        progress: '解读失败，使用本地备用解读',
        stage: 'error'
      });
      
      return this.getLocalTarotInterpretation(cards, spread, question);
    }
  }

  private static getLocalTarotInterpretation(
    cards: StoryTarotCard[],
    spread: TarotSpread,
    question: string
  ): StructuredTarotInterpretation {
    console.log('🏠 使用本地塔罗解读');

    const cardInterpretations = cards.map((card, index) => {
      const position = spread.positions[index];
      const baseInterpretation = card.storyInterpretation;
      
      return {
        position: position.name,
        cardName: card.name,
        interpretation: \`在"\${position.name}"位置上，\${card.name}暗示\${baseInterpretation}。这张牌的能量提醒您要\${this.generateCardAdvice(card)}。\`
      };
    });

    const overallThemes = cards.map(card => card.keywords.join('、')).join('、');
    const overallInterpretation = {
      title: '整体能量解读',
      content: \`通过\${spread.name}，我们看到您当前的能量场围绕着\${overallThemes}等主题展开。\${this.generateOverallGuidance(cards, question)}\`
    };

    const guidance = {
      title: '智慧指引',
      content: this.generateTarotGuidance(cards, question)
    };

    const summary = {
      title: '核心启示',
      content: \`\${spread.name}为您揭示的核心信息是：\${this.generateCoreSummary(cards)}。相信自己的直觉，按照内心的指引前行。\`
    };

    return {
      overallInterpretation,
      cardInterpretations,
      guidance,
      summary
    };
  }

  private static generateCardAdvice(card: StoryTarotCard): string {
    const adviceMap: {[key: string]: string} = {
      'The Fool': '保持初心，勇敢踏出第一步',
      'The Magician': '发挥个人才能，主动创造机会',
      'The High Priestess': '倾听内心的声音，相信直觉'
    };

    return adviceMap[card.name] || '跟随心中的指引，做真实的自己';
  }

  private static generateOverallGuidance(cards: StoryTarotCard[], question: string): string {
    const themes = cards.map(card => card.keywords[0] || '成长').join('、');
    const questionContext = question ? \`针对您关于"\${question}"的疑问，\` : '';
    
    return \`\${questionContext}卡牌显示您正处在一个关于\${themes}的重要时期。这个阶段需要您保持耐心和智慧，相信生活的安排都有其深层的意义。\`;
  }

  private static generateTarotGuidance(cards: StoryTarotCard[], question: string): string {
    const cardCount = cards.length;
    const firstCard = cards[0];
    const lastCard = cards[cards.length - 1];
    
    let guidance = \`通过这\${cardCount}张牌，塔罗为您带来以下指引：\\n\\n\`;
    
    guidance += \`1. **当前状态**: \${firstCard.name}显示您现在\${firstCard.storyInterpretation}，这是您的起点。\\n\`;
    
    if (cardCount > 1) {
      guidance += \`2. **发展方向**: \${lastCard.name}指向\${lastCard.storyInterpretation}，这是您的目标方向。\\n\`;
    }
    
    guidance += '\\n建议您：保持开放的心态，相信内在的智慧，每一个挑战都是成长的机会。';
    
    return guidance;
  }

  private static generateCoreSummary(cards: StoryTarotCard[]): string {
    const mainThemes = cards.slice(0, 2).map(card => card.keywords[0] || card.name).join('与');
    return \`\${mainThemes}的能量将指引您走向更高的智慧和成长\`;
  }

  private static buildTarotPrompt(cards: StoryTarotCard[], spread: TarotSpread, question: string): string {
    const cardsInfo = cards.map((card, index) => {
      const position = spread.positions[index];
      return \`位置\${index + 1}: \${position.name} - \${card.name}\\n含义: \${position.meaning}\\n牌意: \${card.storyInterpretation}\\n关键词: \${card.keywords.join(', ')}\`;
    }).join('\\n\\n');

    const questionText = question ? \`\\n询问问题: \${question}\` : '';

    return \`请为以下塔罗牌解读提供深入的分析：

牌阵: \${spread.name}
牌阵描述: \${spread.description}\${questionText}

抽到的牌:
\${cardsInfo}

请以JSON格式返回结构化的解读结果。\`;
  }

  private static convertToStructuredInterpretation(
    content: string, 
    cards: StoryTarotCard[], 
    spread: TarotSpread
  ): StructuredTarotInterpretation {
    const cardInterpretations = cards.map((card, index) => ({
      position: spread.positions[index].name,
      cardName: card.name,
      interpretation: \`\${card.name}在\${spread.positions[index].name}位置的解读\`
    }));

    return {
      overallInterpretation: {
        title: '整体解读',
        content: content.substring(0, 500) + '...'
      },
      cardInterpretations,
      guidance: {
        title: '智慧指引',
        content: '根据牌面显示，建议您保持开放的心态...'
      },
      summary: {
        title: '核心启示',
        content: '这次解读的核心信息是成长与转变...'
      }
    };
  }
  
  /**
   * 获取卦象解读
   */
  static async getHexagramInterpretation(hexagram: Hexagram, question?: string): Promise<string> {
    this.updateLoadingState({
      isLoading: true,
      progress: '正在准备卦象解读...',
      stage: 'preparing'
    });

    try {
      if (!this.config.apiKey) {
        console.warn('⚠️ 未配置LLM API密钥，使用本地卦象解读');
        
        this.updateLoadingState({
          isLoading: true,
          progress: '使用传统卦象解读中...',
          stage: 'processing'
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const result = this.getLocalHexagramInterpretation(hexagram, question);
        
        this.updateLoadingState({
          isLoading: false,
          progress: '卦象解读完成',
          stage: 'completed'
        });
        
        return result;
      }
      
      const prompt = this.buildHexagramPrompt(hexagram, question);
      const response = await this.callLLMAPI(prompt);
      
      this.updateLoadingState({
        isLoading: false,
        progress: '卦象解读完成',
        stage: 'completed'
      });
      
      return response.content || this.getLocalHexagramInterpretation(hexagram, question);
    } catch (error) {
      console.error('❌ 卦象解读失败:', error);
      
      this.updateLoadingState({
        isLoading: false,
        progress: '解读失败，使用本地备用解读',
        stage: 'error'
      });
      
      return this.getLocalHexagramInterpretation(hexagram, question);
    }
  }

  private static getLocalHexagramInterpretation(hexagram: Hexagram, question?: string): string {
    const questionText = question ? \`\\n\\n**您的问题**: \${question}\` : '';
    
    return \`## \${hexagram.name} (\${hexagram.chineseName})

**卦象**: \${hexagram.symbol}
**卦辞**: \${hexagram.judgment}
**现代解读**: \${hexagram.modernInterpretation}
**核心含义**: \${hexagram.description}

**人生启示**: 
\${hexagram.lifeGuidance || '此卦提醒我们要顺应自然规律，以智慧和耐心面对人生的挑战与机遇。'}

**建议**: 
根据这一卦象，建议您保持内心的平静与智慧，相信事物的发展都有其规律。\${questionText}

愿这一卦象为您带来智慧与指引。🙏\`;
  }

  private static buildHexagramPrompt(hexagram: Hexagram, question?: string): string {
    const questionText = question ? \`\\n\\n用户问题: \${question}\` : '';
    
    return \`请为以下易经卦象提供深入的现代解读：

卦名: \${hexagram.name} (\${hexagram.chineseName})
卦象: \${hexagram.symbol}
卦辞: \${hexagram.judgment}
现代解读: \${hexagram.modernInterpretation}
核心含义: \${hexagram.description}\${questionText}

请提供深入分析和建议。\`;
  }
  
  /**
   * 获取运势解读
   */
  static async getFortuneInterpretation(
    date: Date,
    birthDate?: Date,
    question?: string
  ): Promise<string> {
    this.updateLoadingState({
      isLoading: true,
      progress: '正在准备运势解读...',
      stage: 'preparing'
    });

    try {
      if (!this.config.apiKey) {
        console.warn('⚠️ 未配置LLM API密钥，使用本地运势解读');
        
        const result = this.getLocalFortuneInterpretation(date, birthDate, question);
        
        this.updateLoadingState({
          isLoading: false,
          progress: '运势解读完成',
          stage: 'completed'
        });
        
        return result;
      }
      
      const prompt = this.buildFortunePrompt(date, birthDate, question);
      const response = await this.callLLMAPI(prompt);
      
      this.updateLoadingState({
        isLoading: false,
        progress: '运势解读完成',
        stage: 'completed'
      });
      
      return response.content || this.getLocalFortuneInterpretation(date, birthDate, question);
    } catch (error) {
      console.error('❌ 运势解读失败:', error);
      
      this.updateLoadingState({
        isLoading: false,
        progress: '解读失败，使用本地备用解读',
        stage: 'error'
      });
      
      return this.getLocalFortuneInterpretation(date, birthDate, question);
    }
  }

  private static getLocalFortuneInterpretation(
    date: Date,
    birthDate?: Date,
    question?: string
  ): string {
    const dateStr = date.toLocaleDateString('zh-CN');
    const constellation = birthDate ? this.getConstellation(birthDate) : null;
    const questionText = question ? \`\\n\\n**您的关注**: \${question}\` : '';
    
    const fortuneElements = [
      '今日宜保持积极乐观的心态',
      '适合与他人交流合作',
      '注意把握机遇，但要谨慎决策'
    ];
    
    const selectedElements = fortuneElements
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    const constellationText = constellation ? \`\\n\\n**星座运势** (\${constellation}): \${this.getConstellationTrait(constellation)}\` : '';
    
    return \`## \${dateStr} 运势解读

**整体运势**: ⭐⭐⭐⭐☆

**今日要点**:
\${selectedElements.map(element => \`• \${element}\`).join('\\n')}

**幸运色彩**: 蓝色、绿色
**幸运数字**: 3、7、9\${constellationText}\${questionText}

愿您今日顺心如意！🌟\`;
  }

  private static buildFortunePrompt(date: Date, birthDate?: Date, question?: string): string {
    const dateStr = date.toLocaleDateString('zh-CN');
    return \`请为\${dateStr}提供运势解读。\`;
  }
  
  private static getConstellation(birthDate: Date): string {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '白羊座';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '金牛座';
    // ... 其他星座判断逻辑
    
    return '白羊座';
  }
  
  private static getConstellationTrait(constellation: string): string {
    const traits: {[key: string]: string} = {
      '白羊座': '充满活力和冒险精神，适合主动出击',
      '金牛座': '稳重踏实，今日适合处理实际事务'
      // ... 其他星座特质
    };
    
    return traits[constellation] || traits['白羊座'];
  }
  
  /**
   * 调用LLM API
   */
  private static async callLLMAPI(prompt: string): Promise<LLMResponse> {
    const { provider, apiKey, baseURL, model, temperature, maxTokens } = this.config;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    let url = '';
    let body: any = {};
    
    switch (provider) {
      case 'openai':
        url = baseURL || 'https://api.openai.com/v1/chat/completions';
        headers['Authorization'] = \`Bearer \${apiKey}\`;
        body = {
          model: model || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature,
          max_tokens: maxTokens
        };
        break;
        
      case 'deepseek':
        url = baseURL || 'https://api.deepseek.com/v1/chat/completions';
        headers['Authorization'] = \`Bearer \${apiKey}\`;
        body = {
          model: model || 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          temperature,
          max_tokens: maxTokens
        };
        break;
        
      default:
        throw new Error(\`不支持的LLM提供商: \${provider}\`);
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(\`LLM API请求失败: \${response.status}\`);
    }
    
    const data = await response.json();
    
    let content = '';
    switch (provider) {
      case 'openai':
      case 'deepseek':
        content = data.choices?.[0]?.message?.content || '';
        break;
      default:
        content = data.content || data.text || '';
    }
    
    return { content, usage: data.usage };
  }
}
`;

// 修复函数
function fixLLMService() {
  const filePath = path.join(__dirname, 'src', 'services', 'LLMService.ts');
  
  try {
    // 备份原文件
    const backupPath = path.join(__dirname, 'LLMService.ts.backup');
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log('✅ 已备份原文件到:', backupPath);
    }
    
    // 写入正确的内容
    fs.writeFileSync(filePath, correctLLMServiceContent, 'utf8');
    console.log('✅ LLMService.ts 文件已修复');
    
    // 验证文件大小
    const stats = fs.statSync(filePath);
    const lines = correctLLMServiceContent.split('\\n').length;
    console.log(\`📊 修复后文件信息: \${lines} 行, \${(stats.size / 1024).toFixed(2)} KB\`);
    
  } catch (error) {
    console.error('❌ 修复失败:', error);
  }
}

// 执行修复
fixLLMService(); 
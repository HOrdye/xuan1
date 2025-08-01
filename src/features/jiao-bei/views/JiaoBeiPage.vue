<template>
  <div class="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-4">
    <div class="max-w-md mx-auto">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-amber-800 mb-2">🥤 笅杯占卜</h1>
        <p class="text-amber-600">虔诚祈问，神明指引</p>
      </div>

      <!-- 问题输入 -->
      <div v-if="!isThrowCompleted" class="mb-8">
        <label class="block text-lg font-semibold text-amber-800 mb-3">
          请诚心提出您的问题：
        </label>
        <textarea
          v-model="question"
          placeholder="请输入您想要询问神明的问题..."
          class="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 resize-none"
          rows="3"
        ></textarea>
      </div>

      <!-- 笅杯动画区域 -->
      <div class="mb-8">
        <JiaoBeiAnimation
          :is-throwing="isThrowing"
          :results="results"
          @throw-complete="handleThrowComplete"
        />
      </div>

      <!-- 操作按钮 -->
      <div v-if="!isThrowCompleted" class="text-center mb-8">
        <button
          @click="startThrow"
          :disabled="!question.trim() || isThrowing"
          class="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span v-if="isThrowing">🙏 投掷中...</span>
          <span v-else>🥤 投掷笅杯</span>
        </button>
      </div>

      <!-- 结果显示 -->
      <div v-if="isThrowCompleted" ref="jiaobeResultRef" class="mt-8 space-y-6">
        <!-- 投掷结果 -->
        <div class="bg-white rounded-xl p-6 shadow-lg border border-amber-200">
          <h3 class="text-xl font-bold text-amber-800 mb-4 flex items-center">
            🎯 占卜结果
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="(result, index) in results"
              :key="index"
              class="text-center p-4 rounded-lg"
              :class="getResultStyle(result)"
            >
              <div class="text-2xl mb-2">{{ getResultEmoji(result) }}</div>
              <div class="font-semibold">{{ result }}</div>
            </div>
          </div>
        </div>

        <!-- AI解读区域 -->
        <div class="bg-white rounded-xl p-6 shadow-lg border border-amber-200">
          <h3 class="text-xl font-bold text-amber-800 mb-4 flex items-center">
            🤖 智能解读
            <span v-if="!store.canUseAI" class="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              本地解读
            </span>
            <span v-else class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              AI增强
            </span>
          </h3>
          
          <!-- 加载状态 -->
          <div v-if="aiReading.isLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mb-4"></div>
            <p class="text-amber-600">正在解读神明的指引...</p>
          </div>
          
          <!-- 解读内容 -->
          <div v-else-if="interpretation" class="prose prose-amber max-w-none">
            <div v-html="formatInterpretation(interpretation)"></div>
          </div>
          
          <!-- 错误状态 -->
          <div v-else-if="aiReading.error" class="text-center py-4">
            <p class="text-red-600 mb-4">{{ aiReading.error }}</p>
            <button
              @click="getInterpretation"
              class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              重新解读
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="results.length > 0" class="mt-6 flex justify-center items-center space-x-4">
          <SaveButton
            :item="{ 
              type: 'jiaoBei', 
              question: question, 
              result: {
                results: results,
                interpretation: interpretation
              }
            }"
            :title="`笅杯占卜结果`"
          />
          <button
            @click="isSharePanelOpen = true"
            class="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-amber-600 hover:bg-white/20 transition-all"
            aria-label="分享笅杯结果"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>

        <!-- 重新占卜按钮 -->
        <div class="text-center">
          <button
            @click="resetDivination"
            class="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
          >
            🔄 重新占卜
          </button>
        </div>
      </div>

      <!-- AI配置提示 -->
      <div v-if="!store.canUseAI && !isThrowCompleted" class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div class="flex items-start">
          <span class="text-2xl mr-3">💡</span>
          <div>
            <p class="text-blue-800 font-semibold">获得更深度的解读</p>
            <p class="text-blue-600 text-sm mt-1">
              配置AI服务后，可获得个性化的笅杯解读和人生指引
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- SharePanel -->
    <SharePanel
      :is-open="isSharePanelOpen"
      :target-ref="jiaobeResultRef"
      :share-data="{
        title: '笅杯占卜结果',
        text: '我在天玄Web进行了笅杯占卜，获得了神明的指引！',
        hashtags: ['笅杯占卜', '天玄Web', '神明指引']
      }"
      @close="isSharePanelOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLLMConfigStore } from '../../../store/llmConfig'
import { useAIReading } from '../../../composables/useAIReading'
import JiaoBeiAnimation from '../components/JiaoBeiAnimation.vue'
import SaveButton from '../../../components/common/SaveButton.vue'
import SharePanel from '../../../components/common/SharePanel.vue'

// 全局状态
const store = useLLMConfigStore()
const aiReading = useAIReading()

// 组件状态
const results = ref<string[]>([])
const interpretation = ref('')
const question = ref('请神明指引我的方向') // 默认问题
const isThrowing = ref(false)
const isThrowCompleted = ref(false)
const isSharePanelOpen = ref(false) // 分享面板状态
const jiaobeResultRef = ref<HTMLElement | null>(null) // 笅杯结果容器引用

// 开始投掷
const startThrow = () => {
  if (!question.value.trim()) return
  
  isThrowing.value = true
  isThrowCompleted.value = false
  results.value = []
  interpretation.value = ''
}

// 投掷完成回调
const handleThrowComplete = (throwResults: string[]) => {
  results.value = throwResults
  isThrowing.value = false
  isThrowCompleted.value = true
  
  // 自动获取解读
  getInterpretation()
}

// 获取解读
const getInterpretation = async () => {
  try {
    const result = await aiReading.getSmartReading('jiaoBei', {
      jiaoBei: {
        results: results.value,
        question: question.value
      }
    })
    interpretation.value = result
  } catch (error) {
    console.error('获取笅杯解读失败:', error)
  }
}

// 重置占卜
const resetDivination = () => {
  question.value = ''
  isThrowing.value = false
  isThrowCompleted.value = false
  results.value = []
  interpretation.value = ''
}

// 工具函数
const getResultEmoji = (result: string) => {
  const emojiMap: { [key: string]: string } = {
    '圣杯': '😇',
    '笑杯': '😊', 
    '阴杯': '😐'
  }
  return emojiMap[result] || '🥤'
}

const getResultStyle = (result: string) => {
  const styleMap: { [key: string]: string } = {
    '圣杯': 'bg-green-50 border border-green-200 text-green-800',
    '笑杯': 'bg-yellow-50 border border-yellow-200 text-yellow-800',
    '阴杯': 'bg-gray-50 border border-gray-200 text-gray-800'
  }
  return styleMap[result] || 'bg-gray-50 border border-gray-200 text-gray-800'
}

const formatInterpretation = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-800">$1</strong>')
    .replace(/##\s*(.*?)$/gm, '<h3 class="text-xl font-bold text-amber-800 mt-6 mb-3">$1</h3>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/^(.*)$/gm, '<p class="mb-4">$1</p>')
    .replace(/🙏/g, '<span class="text-xl">🙏</span>')
}
</script>

<style scoped>
/* 确保解读内容的样式 */
:deep(.prose) {
  color: #92400e;
}

:deep(.prose p) {
  margin-bottom: 1rem;
}

:deep(.prose strong) {
  font-weight: 600;
}

:deep(.prose h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
</style> 
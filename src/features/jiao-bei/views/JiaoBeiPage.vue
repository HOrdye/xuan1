<template>
  <div class="jiaobei-page min-h-screen relative overflow-hidden">
    <!-- 动态背景 -->
    <div class="dynamic-background">
      <div class="energy-waves"></div>
      <div class="floating-elements"></div>
      <div class="gradient-overlay"></div>
    </div>
    
    <!-- 页面内容 -->
    <div class="relative z-50 p-6 pb-20 pt-24">
      <div class="max-w-4xl mx-auto">
        <!-- 页面标题 -->
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4 shadow-lg">
            <span class="text-3xl">🥤</span>
          </div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">神圣筊杯占卜</h1>
          <p class="text-gray-600 text-lg">传统神圣仪式，三次虔诚投掷，二十八签神谕解读</p>
          <p class="text-gray-500 text-sm mt-2">我与关圣帝君虔诚祈问，愿得神明指引</p>
          
          <!-- 投掷仪式说明 -->
          <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p class="text-blue-800 text-sm">
              <span class="font-semibold">📋 神圣投掷仪式：</span>
              在神圣场景中虔诚投掷筊杯，系统将为您控制投掷力度。请依次进行三次投掷，每次投掷后静心查看结果，三次投掷完成后将获得完整的神明指引。
            </p>
          </div>
        </div>

        <!-- 问题输入 -->
        <div v-if="!isThrowCompleted" class="mb-10">
          <!-- 传统礼仪说明 -->
          <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-xl border border-yellow-200 mb-6">
            <h3 class="text-lg font-bold text-yellow-800 mb-4 flex items-center">
              <span class="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-white text-xs mr-3">🙏</span>
              神圣筊杯礼仪
            </h3>
            
            <!-- 核心步骤 -->
            <div class="mb-4">
              <h4 class="font-semibold text-yellow-800 mb-2 text-sm">核心步骤：</h4>
              <div class="text-sm text-yellow-700 space-y-2">
                <p class="flex items-start">
                  <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span>执筊杯绕香炉三圈，虔诚跪拜神明</span>
                </p>
                <p class="flex items-start">
                  <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span>禀明姓名、生辰、住所及请示事项</span>
                </p>
                <p class="flex items-start">
                  <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span>合掌轻抛筊杯，观其落地结果</span>
                </p>
                <p class="flex items-start">
                  <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span>连续投掷三次，获得完整神谕</span>
                </p>
              </div>
            </div>
            
            <!-- 筊杯结果说明 -->
            <div class="p-4 bg-white/60 rounded-xl">
              <h4 class="font-semibold text-yellow-800 mb-3">筊杯结果含义：</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <span class="font-semibold text-red-700">圣杯</span>
                  <span class="text-sm text-red-600">一平一凸，神明应允</span>
                </div>
                <div class="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                  <span class="font-semibold text-yellow-700">笑杯</span>
                  <span class="text-sm text-yellow-600">两平朝上，神明笑答</span>
                </div>
                <div class="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <span class="font-semibold text-red-700">阴杯</span>
                  <span class="text-sm text-red-600">两凸朝上，神明否定</span>
                </div>
                <div class="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                  <span class="font-semibold text-purple-700">立杯</span>
                  <span class="text-sm text-purple-600">筊杯直立，神明显灵</span>
                </div>
                <div class="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <span class="font-semibold text-blue-700">叠杯</span>
                  <span class="text-sm text-blue-600">筊杯重叠，神明暗示</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 问题分类选择 -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 mb-6">
            <label class="block text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span class="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm mr-3">📋</span>
              问题类型
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="cat in questionCategories"
                :key="cat.value"
                @click="selectedCategory = cat.value as '事业' | '感情' | '健康' | '学业' | '财运' | '其他'"
                :class="[
                  'px-4 py-3 rounded-xl border-2 transition-all duration-300 font-medium',
                  selectedCategory === cat.value
                    ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                    : 'border-gray-200 bg-white/60 text-gray-700 hover:border-purple-300 hover:bg-white hover:shadow-md'
                ]"
              >
                {{ cat.label }}
              </button>
            </div>
          </div>

          <!-- 问题内容输入 -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <label class="block text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span class="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm mr-3">💭</span>
              请诚心提出您的问题
            </label>
            <textarea
              v-model="question"
              placeholder="请以虔诚之心，详细描述您想要询问神明的问题..."
              class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200/50 resize-none bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500"
              rows="4"
            ></textarea>
          </div>
        </div>

                 <!-- 神圣筊杯动画区域 -->
         <div class="mb-10 flex justify-center">
           <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/30 w-full max-w-5xl">
             <h3 class="text-2xl font-bold text-gray-800 mb-6 text-center">
               <span class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl inline-flex items-center justify-center text-white text-lg mr-3">🎮</span>
               神圣筊杯投掷场景
             </h3>
            <!-- 投掷进度显示 -->
            <div v-if="currentThrowIndex > 0 || isThrowing" class="text-center mb-6">
              <div class="flex items-center justify-center space-x-2 mb-3">
                <span class="text-sm text-gray-600">投掷进度</span>
                <span class="text-lg font-bold text-purple-600">{{ throwProgress.current }}/{{ throwProgress.total }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  :style="{ width: throwProgress.percentage + '%' }"
                ></div>
              </div>
            </div>
            
            <!-- 神圣动画容器 -->
            <div class="bg-gradient-to-br from-purple-50/50 to-blue-50/50 rounded-xl p-4 border border-purple-200/30">
              <JiaoBei3DAnimation
                :is-throwing="isThrowing"
                @throw-complete="handleThrowComplete"
              />
            </div>
          </div>
        </div>

        <!-- 中间投掷结果展示 -->
        <div v-if="throwResults.length > 0 && !isAllThrowsCompleted" class="mb-10">
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span class="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm mr-3">🎯</span>
              当前投掷结果
            </h3>
            <div class="grid grid-cols-3 gap-4">
              <div
                v-for="(result, index) in throwResults"
                :key="index"
                class="text-center p-4 rounded-2xl border-2 shadow-lg"
                :class="getJiaoBeiStyle(result as JiaoBeiResult)"
              >
                <div class="text-2xl mb-2">{{ getJiaoBeiEmoji(result as JiaoBeiResult) }}</div>
                <div class="font-bold text-sm">{{ result }}</div>
                <div class="text-xs text-gray-600 mt-1">第{{ index + 1 }}次</div>
              </div>
              <!-- 未投掷的占位 -->
              <div
                v-for="index in 3 - throwResults.length"
                :key="`placeholder-${index}`"
                class="text-center p-4 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50"
              >
                <div class="text-2xl mb-2 text-gray-400">🥤</div>
                <div class="font-bold text-sm text-gray-400">待投掷</div>
                <div class="text-xs text-gray-500 mt-1">第{{ throwResults.length + index }}次</div>
              </div>
            </div>
          </div>
        </div>

                 <!-- 操作按钮 -->
         <div v-if="!isAllThrowsCompleted" class="text-center mb-10">
           <div v-if="currentThrowIndex === 0 && !isThrowing" class="space-y-4">
             <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
               <p class="text-blue-800 text-sm">
                 <span class="font-semibold">🎯 神圣投掷说明：</span>
                 在神圣场景中虔诚投掷筊杯，系统将为您控制投掷力度
               </p>
             </div>
             <button
               @click="startThrow"
               :disabled="!question.trim()"
               class="px-12 py-5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-2xl"
             >
               <span class="flex items-center">
                 <span class="text-2xl mr-3">🥤</span>
                 开始神圣投掷
               </span>
             </button>
           </div>
           
           <div v-else-if="currentThrowIndex > 0 && !isThrowing" class="space-y-4">
             <div class="bg-green-50 border border-green-200 rounded-xl p-4">
               <p class="text-green-800 text-sm">
                 <span class="font-semibold">📋 投掷进度：</span>
                 已完成 {{ currentThrowIndex }} 次投掷，还需 {{ 3 - currentThrowIndex }} 次
               </p>
             </div>
             <button
               @click="continueThrow"
               class="px-12 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300"
             >
               <span class="flex items-center">
                 <span class="text-2xl mr-3">🥤</span>
                 继续投掷（第{{ currentThrowIndex + 1 }}次）
               </span>
             </button>
           </div>
           
           <div v-else-if="isThrowing" class="flex items-center justify-center">
             <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mr-3"></div>
             <span class="text-purple-600 font-semibold">投掷中...</span>
           </div>
         </div>

        <!-- 结果显示 -->
        <div v-if="isThrowCompleted" ref="jiaobeResultRef" class="space-y-8">
          <!-- 投掷结果 -->
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/30">
            <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-lg mr-4">🎯</span>
              筊杯结果
            </h3>
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div
                v-for="(result, index) in jiaoBeiResults"
                :key="index"
                class="text-center p-4 rounded-2xl border-2 shadow-lg transform hover:scale-105 transition-transform duration-300"
                :class="getJiaoBeiStyle(result)"
              >
                <div class="text-3xl mb-2">{{ getJiaoBeiEmoji(result) }}</div>
                <div class="font-bold text-sm">{{ result }}</div>
                <div class="text-xs text-gray-600 mt-1">第{{ index + 1 }}次</div>
              </div>
            </div>
            
            <!-- 传统签文 -->
            <div class="p-6 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 mb-6">
              <h4 class="font-bold text-yellow-800 mb-3 flex items-center">
                <span class="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-white text-xs mr-3">📜</span>
                传统签文：{{ jiaoBeiCombination?.traditionalSign }}
              </h4>
              <div class="text-yellow-700 leading-relaxed">
                <p class="font-semibold mb-2">{{ jiaoBeiCombination?.traditionalPoem }}</p>
                <p class="text-sm">{{ jiaoBeiCombination?.meaning }}</p>
              </div>
            </div>
            
            <!-- 组合含义 -->
            <div class="p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200/50">
              <h4 class="font-bold text-gray-800 mb-3 flex items-center">
                <span class="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs mr-3">💡</span>
                现代解读
              </h4>
              <p class="text-gray-700 leading-relaxed">{{ jiaoBeiCombination?.advice }}</p>
            </div>
          </div>

          <!-- 个性化解读 -->
          <div v-if="jiaoBeiInterpretation" class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/30">
            <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-lg mr-4">🙏</span>
              神明指引
            </h3>
            <div class="space-y-6">
              <!-- 个性化建议 -->
              <div class="p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200/50">
                <h4 class="font-bold text-purple-800 mb-3 flex items-center">
                  <span class="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs mr-3">💡</span>
                  神明指引
                </h4>
                <p class="text-purple-700 leading-relaxed whitespace-pre-line">{{ jiaoBeiInterpretation.personalizedAdvice }}</p>
              </div>
              
              <!-- 时机分析 -->
              <div class="p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50">
                <h4 class="font-bold text-green-800 mb-3 flex items-center">
                  <span class="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-xs mr-3">⏰</span>
                  时机分析
                </h4>
                <p class="text-green-700 leading-relaxed">{{ jiaoBeiInterpretation.timing }}</p>
              </div>
              
              <!-- 幸运元素 -->
              <div class="p-6 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50">
                <h4 class="font-bold text-yellow-800 mb-3 flex items-center">
                  <span class="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-white text-xs mr-3">🍀</span>
                  幸运元素
                </h4>
                <p class="text-yellow-700 leading-relaxed">{{ jiaoBeiInterpretation.luckyElements }}</p>
              </div>
              
              <!-- 注意事项 -->
              <div class="p-6 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50">
                <h4 class="font-bold text-red-800 mb-3 flex items-center">
                  <span class="w-6 h-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs mr-3">⚠️</span>
                  注意事项
                </h4>
                <p class="text-red-700 leading-relaxed">{{ jiaoBeiInterpretation.warnings }}</p>
              </div>
            </div>
          </div>

          <!-- AI解读区域 -->
          <div class="bg-white rounded-xl p-6 shadow-lg border border-purple-200">
            <h3 class="text-xl font-bold text-purple-800 mb-4 flex items-center">
              🤖 智能解读
              <span v-if="!store.canUseAI" class="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                需要配置AI
              </span>
            </h3>
            
            <!-- 加载状态 -->
            <div v-if="aiReading.isLoading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4"></div>
              <p class="text-purple-600 font-semibold">正在解读神明的指引...</p>
              <p class="text-purple-500 text-sm mt-2">请耐心等待，AI正在为您生成个性化解读</p>
              <div class="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div class="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse" style="width: 60%"></div>
              </div>
            </div>
            
            <!-- AI解读内容 -->
            <div v-else-if="jiaoBeiInterpretation" class="space-y-4">
              <button
                @click="getAIInterpretation"
                class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                重新解读
              </button>
            </div>
            
            <!-- 错误状态 -->
            <div v-if="aiReading.error" class="text-center py-6">
              <div class="text-red-500 text-2xl mb-2">⚠️</div>
              <p class="text-red-600 font-semibold">AI解读遇到问题</p>
              <p class="text-red-500 text-sm mt-1">{{ aiReading.error }}</p>
              <button
                @click="getAIInterpretation"
                class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                重试
              </button>
            </div>
            
            <!-- AI解读结果 -->
            <div v-if="aiInterpretation" class="mt-4 prose prose-purple max-w-none">
              <div v-html="formatInterpretation(aiInterpretation)"></div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-center space-x-4">
                         <SaveButton
               :item="{
                 type: 'jiaoBei',
                 question: question,
                 result: {
                   combination: jiaoBeiCombination,
                   interpretation: jiaoBeiInterpretation,
                   results: jiaoBeiResults
                 }
               }"
               title="笅杯占卜结果"
               class="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
             >
              💾 保存结果
            </SaveButton>
            
            <button
              @click="resetDivination"
              class="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
            >
              🔄 重新占卜
            </button>
          </div>
        </div>

        <!-- AI配置提示 -->
        <div v-if="!store.canUseAI && !isThrowCompleted" class="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <div class="flex items-start">
            <span class="text-2xl mr-3">💡</span>
            <div>
              <p class="text-purple-800 font-semibold">获得更深度的解读</p>
              <p class="text-purple-600 text-sm mt-1">
                配置AI服务后，可获得个性化的笅杯解读和人生指引
              </p>
            </div>
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
import JiaoBei3DAnimation from '../components/JiaoBei3DAnimation.vue'
import SaveButton from '../../../components/common/SaveButton.vue'
import SharePanel from '../../../components/common/SharePanel.vue'
import { 
  generateJiaoBeiResult, 
  generateJiaoBeiResultFromThrows,
  generateInterpretation, 
  getJiaoBeiEmoji, 
  getJiaoBeiStyle,
  type JiaoBeiQuestion,
  type JiaoBeiCombination,
  type JiaoBeiInterpretation,
  type JiaoBeiResult
} from '../utils/jiaoBeiGenerator'

// 全局状态
const store = useLLMConfigStore()
const aiReading = useAIReading()

// 问题分类选项
const questionCategories = [
  { label: '事业', value: '事业' },
  { label: '感情', value: '感情' },
  { label: '健康', value: '健康' },
  { label: '学业', value: '学业' },
  { label: '财运', value: '财运' },
  { label: '其他', value: '其他' }
]

// 组件状态
const selectedCategory = ref<'事业' | '感情' | '健康' | '学业' | '财运' | '其他'>('其他')
const question = ref('请神明指引我的方向') // 默认问题
const isThrowing = ref(false)
const isThrowCompleted = ref(false)
const isSharePanelOpen = ref(false) // 分享面板状态
const jiaobeResultRef = ref<HTMLElement | null>(null) // 笅杯结果容器引用

// 新增：连续投掷状态管理
const currentThrowIndex = ref(0) // 当前投掷次数 (0, 1, 2)
const throwResults = ref<string[]>([]) // 存储每次投掷的结果
const isAllThrowsCompleted = ref(false) // 是否完成所有投掷

// 笅杯结果状态
const jiaoBeiCombination = ref<JiaoBeiCombination | null>(null)
const jiaoBeiInterpretation = ref<JiaoBeiInterpretation | null>(null)
const aiInterpretation = ref('')

// 计算属性
const jiaoBeiResults = computed(() => {
  if (!jiaoBeiCombination.value) return []
  return [jiaoBeiCombination.value.first, jiaoBeiCombination.value.second, jiaoBeiCombination.value.third]
})

// 计算当前投掷进度
const throwProgress = computed(() => {
  return {
    current: currentThrowIndex.value + 1,
    total: 3,
    percentage: ((currentThrowIndex.value + 1) / 3) * 100
  }
})

// 移除预设结果驱动，改为真实物理模拟

// 开始投掷
const startThrow = () => {
  if (!question.value.trim()) return
  
  // 重置投掷状态
  currentThrowIndex.value = 0
  throwResults.value = []
  isAllThrowsCompleted.value = false
  isThrowing.value = true
  isThrowCompleted.value = false
  jiaoBeiCombination.value = null
  jiaoBeiInterpretation.value = null
  aiInterpretation.value = ''
  
  // 3D组件会自动处理投掷，这里只需要设置状态
}

// 投掷完成回调 - 修改为处理单次投掷
const handleThrowComplete = (throwResult: string) => {
  isThrowing.value = false
  
  // 保存当前投掷结果
  throwResults.value[currentThrowIndex.value] = throwResult
  
  // 检查是否完成所有投掷
  if (currentThrowIndex.value < 2) {
    // 还有投掷未完成，等待用户继续
    currentThrowIndex.value++
  } else {
    // 所有投掷完成，生成完整结果
    isAllThrowsCompleted.value = true
    isThrowCompleted.value = true
    
    // 生成笅杯结果
    const jiaoBeiQuestion: JiaoBeiQuestion = {
      content: question.value,
      category: selectedCategory.value,
      timestamp: Date.now()
    }
    
    try {
      // 使用三次投掷的结果生成组合
      jiaoBeiCombination.value = generateJiaoBeiResultFromThrows(jiaoBeiQuestion, throwResults.value)
      
      // 生成解读
      if (jiaoBeiCombination.value) {
        jiaoBeiInterpretation.value = generateInterpretation(jiaoBeiCombination.value, jiaoBeiQuestion)
      }
      
      // 获取AI增强解读
      if (store.canUseAI) {
        getAIInterpretation()
      }
    } catch (error) {
      console.error('生成笅杯结果失败:', error)
    }
  }
}

// 继续下一次投掷
const continueThrow = () => {
  if (currentThrowIndex.value < 3 && !isThrowing.value) {
    isThrowing.value = true
    // 3D组件会自动处理投掷
  }
}

// 重置占卜
const resetDivination = () => {
  question.value = ''
  selectedCategory.value = '其他'
  isThrowing.value = false
  isThrowCompleted.value = false
  currentThrowIndex.value = 0
  throwResults.value = []
  isAllThrowsCompleted.value = false
  jiaoBeiCombination.value = null
  jiaoBeiInterpretation.value = null
  aiInterpretation.value = ''
}

// 工具函数
const formatInterpretation = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-800">$1</strong>')
    .replace(/##\s*(.*?)$/gm, '<h3 class="text-xl font-bold text-blue-800 mt-6 mb-3">$1</h3>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/^(.*)$/gm, '<p class="mb-4">$1</p>')
    .replace(/🙏/g, '<span class="text-xl">🙏</span>')
}

// 获取AI解读
const getAIInterpretation = async () => {
  try {
    console.log('🚀 开始获取AI解读...', {
      results: jiaoBeiResults.value,
      question: question.value,
      canUseAI: store.canUseAI
    })
    
    // 添加超时控制
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('AI解读超时')), 30000) // 30秒超时
    })
    
    const result = await Promise.race([
      aiReading.getSmartReading('jiaoBei', {
        jiaoBei: {
          results: jiaoBeiResults.value,
          question: question.value
        }
      }),
      timeoutPromise
    ]) as string
    
    console.log('✅ AI解读完成:', result)
    aiInterpretation.value = result
  } catch (error) {
    console.error('❌ 获取AI解读失败:', error)
    // 提供用户友好的错误信息
    aiInterpretation.value = `AI解读暂时不可用，请稍后重试。\n\n错误信息: ${error instanceof Error ? error.message : '未知错误'}`
  }
}
</script>

<style scoped>
/* 动态背景样式 */
.dynamic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.energy-waves {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  opacity: 0.15;
  animation: wave 12s ease-in-out infinite;
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 60% 60%, rgba(16, 185, 129, 0.3) 0%, transparent 50%);
  animation: float 15s ease-in-out infinite;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.08) 50%, rgba(236, 72, 153, 0.08) 100%);
}

@keyframes wave {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(-10px) translateY(-10px); }
  50% { transform: translateX(10px) translateY(-5px); }
  75% { transform: translateX(-5px) translateY(10px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(120deg); }
  66% { transform: translateY(10px) rotate(240deg); }
}

/* 确保解读内容的样式 */
:deep(.prose) {
  color: #6b21a8;
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

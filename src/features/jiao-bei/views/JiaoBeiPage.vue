<template>
  <div class="jiaobei-page min-h-screen relative overflow-hidden">
    <!-- 静态背景 -->
    <div class="static-background">
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
          <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">筊杯占卜</h1>
          <p class="text-gray-600 text-lg">传统占卜仪式，三次投掷，获得神明指引</p>
          <p class="text-gray-500 text-sm mt-2">诚心祈问，愿得神明指引</p>
          
          <!-- 投掷仪式说明 -->
          <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p class="text-blue-800 text-sm">
              <span class="font-semibold">📋 投掷说明：</span>
              请依次进行三次投掷，每次投掷后查看结果，三次投掷完成后将获得完整的神明指引。                
            </p>
          </div>
        </div>

        <!-- 问题输入 -->
        <div v-if="!isThrowCompleted" class="mb-10">
          <!-- 传统礼仪说明 -->
          <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-xl border border-yellow-200 mb-6">                                    
            <h3 class="text-lg font-bold text-yellow-800 mb-4 flex items-center">                                                                               
              <span class="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-white text-xs mr-3">🙏</span>                                                                               
              筊杯礼仪
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

                 <!-- 筊杯动画区域 -->
         <div class="mb-4 flex justify-center">
           <div class="w-full max-w-5xl">                                        
            <!-- 投掷进度显示 -->
            <div v-if="isThrowing" class="text-center mb-3">                                                                           
              <div class="flex items-center justify-center space-x-2 mb-2">     
                <span class="text-sm text-gray-600">投掷中</span>
              </div>
            </div>
            
            <!-- 动画容器 - 无背景，直接展示视频 -->
            <div class="relative w-full" style="min-height: 400px;">                                          
              <!-- 动画播放器 -->
              <JiaoBeiAnimationPlayer
                :is-throwing="isThrowing"
                :animation-url="animationUrl"
                @throw-complete="handleThrowComplete"
              />
            </div>
          </div>
        </div>


                 <!-- 操作按钮 -->
         <div v-if="!isAllThrowsCompleted" class="text-center mb-4">
           <div v-if="!isThrowing" class="space-y-3">
             <button
               @click="startThrow"
               :disabled="!question.trim() || isThrowing"
               class="px-16 py-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-2xl"                      
             >
               <span class="flex items-center justify-center">
                 <span class="text-3xl mr-3">🥤</span>
                 开始投掷
               </span>
             </button>
             <p class="text-gray-500 text-sm mt-2">点击按钮开始投掷，将获得三次投掷结果</p>
           </div>

           <div v-else class="flex items-center justify-center">
             <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mr-3"></div>                                                            
             <span class="text-purple-600 font-semibold text-lg">投掷中...</span>       
           </div>
         </div>

        <!-- 结果显示 -->
        <div v-if="isThrowCompleted" ref="jiaobeResultRef" class="space-y-8">   
          <!-- 投掷结果 -->
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/30">                                                          
            <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-lg mr-4">🎯</span>                                                                               
              三次投掷结果
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
import { ref, computed, onMounted } from 'vue'
import JiaoBeiAnimationPlayer from '../components/JiaoBeiAnimationPlayer.vue'
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

// 问题分类选项
const questionCategories = [
  { label: '事业', value: '事业' },
  { label: '感情', value: '感情' },
  { label: '健康', value: '健康' },
  { label: '学业', value: '学业' },
  { label: '财运', value: '财运' },
  { label: '其他', value: '其他' }
]

// 投掷动画URL - 使用public目录下的jiaobei.mp4
const animationUrl = ref<string>('/jiaobei.mp4')

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

  console.log('开始投掷，重置状态')
  
  // 重置投掷状态
  currentThrowIndex.value = 0
  throwResults.value = []
  isAllThrowsCompleted.value = false
  isThrowing.value = true
  isThrowCompleted.value = false
  jiaoBeiCombination.value = null
  jiaoBeiInterpretation.value = null

  console.log('投掷状态已设置，isThrowing:', isThrowing.value)
  // 注意：视频会在动画播放器中自动开始播放
}

// 投掷完成回调 - 视频播放一次后，直接生成3次投掷结果
const handleThrowComplete = () => {
  console.log('视频播放完成，生成3次投掷结果')
  
  // 停止投掷状态
  isThrowing.value = false
  
  // 生成3次投掷结果
  const results: string[] = []
  for (let i = 0; i < 3; i++) {
    const rand = Math.random()
    let result: string
    if (rand < 0.005) result = '立杯'      // 0.5% 极端罕见
    else if (rand < 0.055) result = '叠杯'      // 5% 偶发
    else if (rand < 0.455) result = '圣杯'      // 40%
    else if (rand < 0.755) result = '笑杯'      // 30%
    else result = '阴杯'                        // 24.5%
    results.push(result)
  }
  
  throwResults.value = results
  currentThrowIndex.value = 2 // 设置为已完成3次
  console.log('生成的3次投掷结果:', results)

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
    console.log('生成的组合:', jiaoBeiCombination.value)

      // 生成解读
      if (jiaoBeiCombination.value) {
        jiaoBeiInterpretation.value = generateInterpretation(jiaoBeiCombination.value, jiaoBeiQuestion)                                                         
        console.log('生成的解读:', jiaoBeiInterpretation.value)
      }
  } catch (error) {
    console.error('生成笅杯结果失败:', error)
  }
}

// 继续下一次投掷（已废弃，现在自动连续投掷）

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
}

</script>

<style scoped>
/* 静态背景样式 */
.static-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.08) 50%, rgba(236, 72, 153, 0.08) 100%);                                
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

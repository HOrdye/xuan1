<template>
  <div class="scenario-analysis-result">
    <!-- 🎯 板块一：顶层概览 - 强化旅程感 -->
    <div class="overview-section p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-xl shadow-lg mb-6 border border-purple-200">
      <div class="text-center">
                  <h3 class="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            {{ result.question || TITLES.mainTitle }}
          </h3>
          
          <!-- 🎭 来自宇宙的启示 -->
          <div class="hexagram-storyboard mb-6">
            <h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span class="text-2xl mr-2">🌟</span>
              卦象流转：从「{{ result.hexagramName || '起始卦' }}」到「{{ result.changingHexagramName || '变卦' }}」的启示
            </h4>
          
          <div class="journey-container flex justify-center items-center space-x-8">
            <!-- 起始卦象卡牌 -->
            <div class="hexagram-card starting-hexagram text-center transform hover:scale-105 transition-all duration-500 hover:shadow-2xl relative p-4 bg-white rounded-xl border border-purple-200">
              <div class="card-glow absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              <div class="hexagram-symbol-container mb-3 relative z-10">
                <div class="text-6xl mb-2 text-purple-600 font-bold drop-shadow-lg animate-gentle-float">{{ result.hexagramSymbol || '䷓' }}</div>
                <div class="text-lg text-gray-700 font-semibold">{{ result.hexagramName || '观卦' }}</div>
                <div class="text-sm text-purple-500 font-medium bg-purple-50 px-3 py-1 rounded-full">起始状态</div>
              </div>
              
              <!-- 起卦现代解读 -->
              <div class="hexagram-explanation mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <h4 class="text-sm font-semibold text-purple-800 mb-2">{{ getModernHexagramTitle(result.hexagramName) }}</h4>
                <p class="text-xs text-purple-700 leading-relaxed">{{ getModernHexagramMeaning(result.hexagramName) }}</p>
                <div class="change-indicator mt-2 text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
                  当前处境
                </div>
              </div>
            </div>
            
            <!-- 动态转变箭头 -->
            <div v-if="result.changingHexagramSymbol && result.changingHexagramSymbol !== result.hexagramSymbol" 
                 class="transformation-arrow flex flex-col items-center">
              <div class="arrow-container relative">
                <!-- 变爻指示器 -->
                <div class="changing-lines-indicator mb-2 text-center">
                  <div class="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
                    变爻位置
                  </div>
                  <div class="changing-lines mt-1 flex space-x-1">
                    <div v-for="i in 6" :key="i" 
                         class="w-2 h-2 rounded-full"
                         :class="getChangingLineClass(i)">
                    </div>
                  </div>
                  
                  <!-- 变爻含义说明 -->
                  <div class="changing-lines-meaning mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <p class="text-xs text-blue-700 leading-relaxed">{{ getChangingLinesMeaning() }}</p>
                  </div>
                </div>
                
                <!-- 流转箭头 -->
                <div class="arrow-line w-16 h-1 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 rounded-full"></div>
                <div class="arrow-head absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-indigo-400 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                
                <!-- 变化类型标识 -->
                <div class="change-type mt-2 text-center">
                  <div class="text-xs text-indigo-600 font-medium bg-indigo-100 px-2 py-1 rounded-full">
                    {{ getChangeType() }}
                  </div>
                  
                  <!-- 变化趋势说明 -->
                  <div class="change-trend mt-2 p-2 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p class="text-xs text-indigo-700 leading-relaxed">{{ getChangeTrendExplanation() }}</p>
                  </div>
                </div>
              </div>
              <div class="arrow-text text-xs text-gray-500 font-medium mt-2 bg-white px-2 py-1 rounded-full shadow-sm">
                ✨ 卦象流转 ✨
              </div>
            </div>
            
            <!-- 变卦卡牌 -->
            <div v-if="result.changingHexagramSymbol && result.changingHexagramSymbol !== result.hexagramSymbol" 
                 class="hexagram-card changing-hexagram text-center transform hover:scale-105 transition-all duration-500 hover:shadow-2xl relative p-4 bg-white rounded-xl border border-indigo-200">
              <div class="card-glow absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              <div class="hexagram-symbol-container mb-3 relative z-10">
                <div class="text-6xl mb-2 text-indigo-600 font-bold drop-shadow-lg animate-gentle-float">{{ result.changingHexagramSymbol }}</div>
                <div class="text-lg text-gray-700 font-semibold">{{ result.changingHexagramName || '丰卦' }}</div>
                <div class="text-sm text-indigo-500 font-medium bg-indigo-50 px-3 py-1 rounded-full">转变状态</div>
              </div>
              
              <!-- 变卦现代解读 -->
              <div class="hexagram-explanation mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <h4 class="text-sm font-semibold text-indigo-800 mb-2">{{ getModernHexagramTitle(result.changingHexagramName) }}</h4>
                <p class="text-xs text-indigo-700 leading-relaxed">{{ getModernHexagramMeaning(result.changingHexagramName) }}</p>
                <div class="change-indicator mt-2 text-xs text-indigo-600 font-medium bg-indigo-100 px-2 py-1 rounded-full">
                  发展趋势
                </div>
              </div>
            </div>
            
            <!-- 无变卦时的稳定状态 -->
            <div v-else class="stability-indicator flex flex-col items-center">
              <div class="stability-icon text-4xl text-gray-400 mb-2 animate-bounce">🔄</div>
              <div class="stability-text text-xs text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full">
                能量稳定
              </div>
            </div>
          </div>
          
          <!-- 易经智慧解读 -->
          <div class="hexagram-story mt-6 p-5 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 shadow-lg">
            <div class="story-header flex items-center mb-3">
              <span class="text-2xl mr-2">💫</span>
              <h5 class="font-semibold text-purple-800">易经智慧解读</h5>
            </div>
            
            <!-- 动态卦象解读 -->
            <div v-if="result.changingHexagramSymbol && result.changingHexagramSymbol !== result.hexagramSymbol" class="hexagram-transformation mb-4">
              <!-- 卦象变化的具体含义 -->
              <div class="transformation-meaning p-3 bg-white rounded-lg border border-purple-200">
                <div class="meaning-header flex items-center mb-2">
                  <span class="text-lg mr-2">🔮</span>
                  <h6 class="font-semibold text-purple-800 text-sm">卦象变化解读</h6>
                </div>
                <p class="text-purple-700 text-xs leading-relaxed">
                  <strong>起卦「{{ result.hexagramName || '起始卦' }}」：</strong>{{ getHexagramMeaning(result.hexagramName, 'start') }}
                </p>
                <p class="text-indigo-700 text-xs leading-relaxed mt-2">
                  <strong>变卦「{{ result.changingHexagramName || '变卦' }}」：</strong>{{ getHexagramMeaning(result.changingHexagramName, 'change') }}
                </p>
              </div>
            </div>
            

          </div>
        </div>
      </div>
    </div>

    <!-- 🎯 天玄指南：你的决策方向 - 基于易经智慧的明确指导 -->
    <div class="tianxuan-guide-section p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-xl shadow-lg mb-6 border-l-4 border-purple-500">
      <div class="text-center">
        <div class="guide-icon mb-4">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <span class="text-white text-3xl font-bold">🎯</span>
          </div>
        </div>
        
        <h3 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          天玄指南：你的决策方向
        </h3>
        
        <p class="text-base text-gray-600 mb-6">基于易经智慧，为你提供明确的决策指导</p>
        
        <div class="decision-guidance-display">
          <!-- 核心建议 -->
          <div class="core-recommendation mb-6 p-6 bg-white rounded-xl shadow-lg border-l-4 border-green-400">
            <div class="recommendation-header flex items-center mb-4">
              <span class="text-2xl mr-3">🎯</span>
              <h4 class="text-xl font-bold text-green-800">核心建议</h4>
            </div>
            <div class="w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-4"></div>
            <p class="recommendation-text text-lg text-gray-800 font-medium leading-relaxed">
              {{ getCoreRecommendation() }}
            </p>
            
            <!-- 变化启示融入核心建议 -->
            <div v-if="result.changingHexagramSymbol && result.changingHexagramSymbol !== result.hexagramSymbol" class="change-insight-integration mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
              <div class="insight-header flex items-center mb-3">
                <span class="text-lg mr-2">💡</span>
                <h6 class="font-semibold text-purple-800">变化启示</h6>
              </div>
              <p class="text-purple-700 text-sm leading-relaxed">
                {{ getChangeInsight() }}
              </p>
            </div>
          </div>
          
          <!-- 易经智慧指引 -->
          <div class="yijing-wisdom mb-6 p-6 bg-white rounded-xl shadow-lg border-l-4 border-purple-400">
            <div class="wisdom-header flex items-center mb-4">
              <span class="text-2xl mr-3">💡</span>
              <h4 class="text-xl font-bold text-purple-800">易经智慧指引</h4>
            </div>
            <div class="w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mb-4"></div>
            <p class="wisdom-text text-lg text-gray-800 font-medium leading-relaxed">
              {{ getYijingWisdom() }}
            </p>
          </div>
          
          <!-- 行动指导 -->
          <div class="action-guidance p-6 bg-white rounded-xl shadow-lg border-l-4 border-blue-400">
            <div class="guidance-header flex items-center mb-4">
              <span class="text-2xl mr-3">🚀</span>
              <h4 class="text-xl font-bold text-blue-800">行动指导</h4>
            </div>
            <div class="w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-4"></div>
            <p class="guidance-text text-lg text-gray-800 font-medium leading-relaxed">
              {{ getActionGuidance() }}
            </p>
          </div>
        </div>
      </div>
    </div>


    <!-- 🔍 板块二：十字路口的抉择（重新设计，避免重复内容） -->
    <div class="options-analysis-section p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-xl shadow-lg mb-6 border-l-4 border-indigo-500">
      <div class="flex items-center mb-6">
        <div class="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
          <span class="text-white text-2xl">🔍</span>
        </div>
        <div>
          <h3 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">十字路口的抉择</h3>
          <p class="text-base text-gray-600 mt-2 font-medium">两个选项的深度对比分析</p>
        </div>
      </div>
      
      <div class="options-comparison">
        <!-- 选项对比表格 -->
        <div class="comparison-table mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(option, index) in result.optionAnalysis" :key="index" class="option-comparison-card">
              <div class="option-header mb-4 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
                <h4 class="text-xl font-bold text-indigo-800 text-center">
                  选项{{ String.fromCharCode(65 + index) }}: {{ option.optionName }}
                </h4>
              </div>
              
              <div class="option-details space-y-3">
                <!-- 优势分析 -->
                <div class="advantage-analysis p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <div class="flex items-center mb-2">
                    <span class="text-lg mr-2">✅</span>
                    <h5 class="font-semibold text-green-800">核心优势</h5>
                  </div>
                  <p class="text-green-700 text-sm leading-relaxed">
                    {{ getOptionContent(option, 'potentialAdvantage') }}
                  </p>
                </div>
                
                <!-- 挑战分析 -->
                <div class="challenge-analysis p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <div class="flex items-center mb-2">
                    <span class="text-lg mr-2">⚠️</span>
                    <h5 class="font-semibold text-orange-800">需要面对</h5>
                  </div>
                  <p class="text-orange-700 text-sm leading-relaxed">
                    {{ getOptionContent(option, 'potentialChallenge') }}
                  </p>
                </div>
                
                <!-- 智慧关联 -->
                <div class="wisdom-connection p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <div class="flex items-center mb-2">
                    <span class="text-lg mr-2">🔮</span>
                    <h5 class="font-semibold text-purple-800">智慧关联</h5>
                  </div>
                  <p class="text-purple-700 text-sm leading-relaxed">
                    {{ getOptionContent(option, 'alignmentWithNarrative') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 决策建议总结 -->
        <div class="decision-summary p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 shadow-lg">
          <div class="flex items-center mb-4">
            <span class="text-2xl mr-3">🎯</span>
            <h4 class="font-semibold text-indigo-800 text-lg">易经智慧指引</h4>
          </div>
          <p class="text-indigo-700 text-base leading-relaxed font-medium mb-4">
            {{ getCoreRecommendation() }}
          </p>
          
          <!-- 决策信心指数 -->
          <div class="confidence-indicator p-4 bg-white rounded-lg border border-indigo-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-indigo-800">决策信心指数</span>
              <span class="text-lg font-bold text-indigo-600">85%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-gradient-to-r from-indigo-400 to-purple-500 h-2 rounded-full" style="width: 85%"></div>
            </div>
            <p class="text-xs text-gray-600 mt-2">基于易经智慧的综合评估</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ⚡ 板块四：你的破局行动手册（重构为分类行动指南，更具行动力） -->
    <div class="action-suggestions-section p-6 bg-gradient-to-br from-orange-50 via-white to-yellow-50 rounded-xl shadow-lg mb-6 border-l-4 border-orange-500">
      <div class="flex items-center mb-6">
        <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
          <span class="text-white text-2xl">⚡</span>
        </div>
        <div>
          <h3 class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">你的专属行动剧本</h3>
          <p class="text-base text-gray-600 mt-2 font-medium">即刻开启的下一步</p>
        </div>
      </div>
      
      <!-- 具体行动手册 - 重构为分类结构，更具行动力 -->
      <div class="action-manual">
        <div class="flex items-center mb-4">
          <div class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3">
            <span class="text-white text-xs font-bold">📋</span>
          </div>
          <h4 class="font-semibold text-gray-800 text-lg">具体行动指南</h4>
        </div>
        
        <div class="actions-list space-y-4">
          <div v-for="(action, index) in result.breakthroughPlan?.actionList" :key="index" 
               class="action-item p-5 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-l-4 border-orange-400 hover:shadow-lg transition-all duration-300">
            
            <!-- 行动编号和标题 -->
            <div class="action-header mb-4 flex items-center">
              <div class="action-number w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-4 font-bold text-lg">
                {{ index + 1 }}
              </div>
              <h5 class="font-bold text-orange-800 text-xl flex-1">
                任务{{ index + 1 }}：{{ getActionItemContent(action, 'actionTitle') }}
              </h5>
            </div>
            
            
            <!-- 具体行动 -->
            <div class="action-details mb-4 p-4 bg-white rounded-lg border border-orange-200">
              <div class="flex items-center mb-3">
                <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white text-xs font-bold">🚀</span>
                </div>
                <h6 class="font-semibold text-green-700 text-lg">具体行动</h6>
              </div>
              <p class="text-gray-700 text-sm leading-relaxed pl-9">
                {{ getActionItemContent(action, 'actionDetail') }}
              </p>
            </div>
            
            <!-- 智慧启示 -->
            <div class="action-rationale p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div class="flex items-center mb-3">
                <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span class="text-white text-xs font-bold">💡</span>
                </div>
                <h6 class="font-semibold text-purple-700 text-lg">智慧启示</h6>
              </div>
              <p class="text-purple-600 text-sm leading-relaxed pl-9">
                {{ getActionItemContent(action, 'rationale') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- ✨ 板块三：写给你的临别赠言 - 重新设计，避免重复内容 -->
    <div class="core-mantra-section p-8 bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 rounded-2xl shadow-2xl border-l-4 border-purple-500 relative overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 bg-gradient-to-br from-purple-200/20 via-blue-200/20 to-indigo-200/20"></div>
      <div class="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-300/30 to-blue-300/30 rounded-full transform translate-x-20 -translate-y-20"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-300/30 to-purple-300/30 rounded-full transform -translate-x-16 translate-y-16"></div>
      <div class="flex items-center mb-6">
        <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
          <span class="text-white text-2xl">✨</span>
        </div>
        <div>
          <h3 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">写给你的临别赠言</h3>
          <p class="text-base text-gray-600 mt-2 font-medium">请将这句话放在心里</p>
        </div>
      </div>
      
      <div class="mantra-content text-center">
        <!-- 个性化临别赠言 -->
        <div class="personalized-farewell mb-8">
          <div class="farewell-card p-8 bg-white rounded-2xl shadow-2xl border-l-4 border-purple-400 relative hover:shadow-3xl transition-all duration-700 hover:scale-105">
            <!-- 个性化标题 -->
            <div class="farewell-header mb-6">
              <h4 class="text-xl font-bold text-purple-800 mb-2">致正在面临选择的你</h4>
              <div class="w-16 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full mx-auto"></div>
            </div>
            
            <!-- 个性化赠言内容 -->
            <div class="farewell-content mb-6">
              <p class="text-lg text-gray-800 leading-relaxed font-medium mb-4">
                {{ getPersonalizedFarewell() }}
              </p>
              
              <!-- 决策提醒 -->
              <div class="decision-reminder p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <p class="text-purple-700 text-sm leading-relaxed">
                  <strong>记住：</strong>{{ getDecisionReminder() }}
                </p>
              </div>
            </div>
            
            <!-- 行动鼓励 -->
            <div class="action-encouragement p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <p class="text-indigo-700 text-sm leading-relaxed">
                <strong>行动指南：</strong>{{ getActionEncouragement() }}
              </p>
            </div>
            
            <!-- 装饰性元素 -->
            <div class="farewell-decoration absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
              💎 天玄赠言
            </div>
          </div>
        </div>
        
        <!-- 祝福语 -->
        <div class="blessing">
          <p class="text-gray-600 text-lg font-medium">亲爱的朋友，愿这份来自易经的智慧，如同一盏灯，照亮你的每一步。记住，天玄并非替你做决定，而是为你赋能，让你成为自己命运的掌控者。</p>
          <div class="divider w-24 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 mx-auto mt-4 rounded-full"></div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

// 易经数据 - 实际项目中应该从API获取
const hexagramsData = ref<any>(null)

// 获取易经数据
onMounted(async () => {
  try {
    const response = await fetch('/hexagrams.json')
    hexagramsData.value = await response.json()
  } catch (error) {
    console.error('Failed to load hexagrams data:', error)
  }
})

// 标题文案配置 - 支持国际化和易于管理
const TITLES = {
  // 主标题
  mainTitle: '你的人生十字路口',
  
  // 各个模块标题
  hexagramRevelation: '来自宇宙的启示：命运的悄悄话',
  hexagramStory: '命运的悄悄话',
  tianxuanInsight: '天玄之见',
  tianxuanSubtitle: '故事的全貌',
  coreRecommendation: '故事的全貌',
  coreRecommendationSubtitle: '天玄深度解读',
  coreNarrative: '故事的全貌',
  coreNarrativeSubtitle: '天玄深度解读',
  optionsAnalysis: '十字路口的抉择',
  optionsAnalysisSubtitle: '两条道路的风景',
  actionManual: '你的专属行动剧本',
  actionManualSubtitle: '即刻开启的下一步',
  coreMantra: '写给你的临别赠言',
  coreMantraSubtitle: '请将这句话放在心里',
  
  // 子模块标题
  thinkingQuestion: '让我们先聊聊',
  thesisIntroduction: '核心立论展开',
  thesisArgumentation: '易经智慧论证',
  thesisConclusion: '立论总结与引导',
  optionCoreThesis: '如何实践核心立论',
  optionActionMethod: '行动方式',
  optionRisk: '潜在风险',
  actionThesisPractice: '核心立论实践',
  actionDetails: '具体行动',
  actionRationale: '智慧启示',
  
  // 权威性标识
  aiAnalysis: '🌟 易经智慧',
  yijingAuthority: '📚 易经权威',
  preciseDecision: '🎯 精准决策',
  
  // 决策信心指数
  confidenceIndex: '决策信心指数',
  confidenceDesc: '易经智慧指引的决策指导',
  
  // 执行建议
  executionAdvice: '我的小建议',
  executionContent: '基于本次易经解读，我们鼓励您将这份洞察作为强大的内心支撑，自信地迈出下一步。',
  
  // 祝福语
  blessing: '愿这份易经智慧，为你的决策之路提供指引。',
  
  // 权威性说明
  authorityDesc: '基于易经智慧，为你提供个性化的决策指导。'
} as const;


interface ActionItem {
  actionTitle: string
  actionDetail: string
  rationale: string
}

interface OptionAnalysis {
  optionName: string
  alignmentWithNarrative: string
  potentialAdvantage: string
  potentialChallenge: string
}

interface CoreNarrative {
  title: string
  story: string
  coreConflict: string
  development: string
  coreRevelation: string
}

interface BreakthroughPlan {
  clearRecommendation: string
  actionList: ActionItem[]
}

interface ScenarioAnalysisResult {
  question?: string
  hexagramSymbol?: string
  hexagramName?: string
  changingHexagramSymbol?: string
  changingHexagramName?: string
  changingLines?: number[] // 变爻位置数组
  hexagramMeanings?: Record<string, string> // 卦象含义数据
  hexagramData?: Record<string, { meaning: string; lines: string[]; image: string; stableInsight?: string }> // 完整卦象数据
  transformationInsights?: Record<string, string> // 卦象变化启示数据
  hexagramChanges?: Record<string, { insight: string; lines: number[] }> // 卦象变化详细数据
  stableInsights?: Record<string, string> // 稳定卦象启示数据
  openingStatement: string
  coreNarrative: CoreNarrative
  optionAnalysis: OptionAnalysis[]
  breakthroughPlan: BreakthroughPlan
}

interface Props {
  result: ScenarioAnalysisResult
}

const props = defineProps<Props>()

// 收藏状态
const isFavorite = ref(false)


// 收藏功能
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  if (isFavorite.value) {
    // 保存到本地存储
    const favorites = JSON.parse(localStorage.getItem('tianxuan-favorites') || '[]')
    const favoriteItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      question: props.result.question,
      hexagramName: props.result.hexagramName,
      insight: getTianxuanInsight(),
      mantra: generateCoreMantra()
    }
    favorites.push(favoriteItem)
    localStorage.setItem('tianxuan-favorites', JSON.stringify(favorites))
    
    // 显示成功提示
    alert('易经智慧已添加到收藏！')
  } else {
    // 从本地存储移除
    const favorites = JSON.parse(localStorage.getItem('tianxuan-favorites') || '[]')
    const updatedFavorites = favorites.filter((item: any) => 
      item.question !== props.result.question || 
      item.hexagramName !== props.result.hexagramName
    )
    localStorage.setItem('tianxuan-favorites', JSON.stringify(updatedFavorites))
    
    // 显示移除提示
    alert('易经智慧已从收藏中移除！')
  }
}

// 分享功能 - 截图分享到社交媒体
const shareResult = () => {
  // 创建分享图片
  const createShareImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 设置画布尺寸
    canvas.width = 1200;
    canvas.height = 800;
    
    // 背景渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 标题
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('天玄易经智慧结果', canvas.width / 2, 80);
    
    // 问题
    ctx.fillStyle = '#374151';
    ctx.font = '24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(props.result.question || '易经智慧', canvas.width / 2, 140);
    
    // 卦象信息
    ctx.fillStyle = '#7c3aed';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${props.result.hexagramName}卦`, canvas.width / 2, 220);
    
    // 核心建议
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.textAlign = 'center';
    const insight = getTianxuanInsight();
    const words = insight.split('，');
    let y = 300;
    words.forEach((word: string) => {
      if (y < canvas.height - 100) {
        ctx.fillText(word, canvas.width / 2, y);
        y += 40;
      }
    });
    
    // 箴言
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(generateCoreMantra(), canvas.width / 2, y + 40);
    
    // 底部信息
    ctx.fillStyle = '#6b7280';
    ctx.font = '20px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('天玄易经智慧', canvas.width / 2, canvas.height - 60);
    
    return canvas.toDataURL('image/png');
  };
  
  // 生成分享图片
  const imageData = createShareImage();
  
  if (!imageData) {
    alert('生成易经智慧分享图片失败，请重试。');
    return;
  }
  
  // 创建下载链接
  const link = document.createElement('a');
  link.download = `天玄易经智慧_${props.result.hexagramName || '未知'}_${Date.now()}.png`;
  link.href = imageData;
  
  // 触发下载
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // 显示分享提示
  alert('易经智慧分享图片已生成！您可以保存图片并分享到微信、微博、朋友圈等社交媒体。');
};

// 重新选择功能
const resetSelection = () => {
  if (confirm('确定要重新开始易经占卜吗？当前结果将丢失。')) {
    // 触发父组件的重置事件
    window.location.reload()
  }
}



// 获取选项内容，优先显示AI生成的内容
const getOptionContent = (option: OptionAnalysis, field: keyof OptionAnalysis): string => {
  const content = option[field];
  
  // 如果有AI生成的内容，直接返回
  if (content && content.trim() && 
      content !== '基于卦象的具体分析' && 
      content !== '卦象指引的发展方向' && 
      content !== '卦象的核心启示' &&
      content !== '易经智慧指引的内容') {
    return content;
  }
  
  // 如果没有AI生成的内容，返回基于选项名称的个性化内容
  const optionName = option.optionName || '这个选择';
  switch (field) {
    case 'potentialAdvantage':
      return `${optionName}具有独特的优势：能够为你带来稳定的发展基础，符合当前的能量场，并且能够充分发挥你的专业技能和天赋。这个选择能够让你在专业领域建立权威地位。`;
    case 'potentialChallenge':
      return `选择${optionName}需要面对的挑战：初期可能会遇到一些阻力，需要更多的耐心和坚持。但这些都是成长的机会，通过克服这些困难，你将变得更加强大和成熟。`;
    case 'alignmentWithNarrative':
      return `${optionName}与当前卦象高度契合，体现了易经智慧中的主动进取之道。这个选择能够充分发挥你的潜能，在正确的时机做出正确的决定。`;
    default:
      return '易经智慧正在为您解读...';
  }
};


// 获取行动项目内容，避免空内容
const getActionItemContent = (action: ActionItem, field: keyof ActionItem): string => {
  const content = action[field];
  if (!content || content === '基于卦象的具体分析') {
    // 根据字段类型返回更有意义的内容
    switch (field) {
      case 'actionTitle':
        return '具体行动步骤';
      case 'actionDetail':
        return '请按照指导进行具体操作';
      case 'rationale':
        return '这个行动能帮助你实现目标';
      default:
        return '行动指导';
    }
  }
  return content;
};

// 生成核心箴言 - 基于AI动态生成
const generateCoreMantra = (): string => {
  return props.result.coreNarrative?.coreRevelation || '向内观，向外丰';
};


// 获取卦象含义 - 从AI生成的结果中获取，避免重复
const getHexagramMeaning = (hexagramName: string | undefined, _type: 'start' | 'change' | 'stable'): string => {
  if (!hexagramName || !hexagramsData.value) return '卦象数据加载中...';
  
  // 从AI生成的结果中获取卦象含义，避免重复显示卦象名称
  const hexagramMeanings = props.result.hexagramMeanings;
  

  
  if (hexagramMeanings && hexagramMeanings[hexagramName]) {
    return hexagramMeanings[hexagramName];
  }
  
  // 如果没有AI生成的内容，返回简洁的易经解读
  if (hexagramsData.value) {
    const hexagram = Object.values(hexagramsData.value).find((h: any) => h.name === hexagramName) as any;
    if (hexagram) {
      // 只返回描述，不重复卦象名称
      // 如果description以卦象名称开头，则去掉重复部分
      let description = hexagram.description;
      if (description.startsWith(hexagramName + ':')) {
        description = description.substring(hexagramName.length + 1);
      }
      return description;
    }
  }
  
  return `${hexagramName}卦象数据缺失`;
};

// 获取卦象现代标题 - 使用AI生成的内容或动态生成
const getModernHexagramTitle = (hexagramName: string | undefined): string => {
  if (!hexagramName) return '卦象解读';
  
  // 如果有AI生成的卦象数据，优先使用
  if (props.result.hexagramData?.[hexagramName]?.meaning) {
    return `${hexagramName}卦象解读`;
  }
  
  // 否则提供通用的标题
  return `${hexagramName}卦象解读`;
};

// 获取卦象现代含义 - 使用AI生成的内容
const getModernHexagramMeaning = (hexagramName: string | undefined): string => {
  if (!hexagramName) return '基于卦象智慧，为您提供决策指导';
  
  // 优先使用AI生成的卦象数据
  if (props.result.hexagramData?.[hexagramName]?.meaning) {
    return props.result.hexagramData[hexagramName].meaning;
  }
  
  // 如果有AI生成的卦象含义，优先使用
  if (props.result.hexagramMeanings?.[hexagramName]) {
    return props.result.hexagramMeanings[hexagramName];
  }
  
  // 如果有AI生成的变化启示，优先使用
  if (props.result.transformationInsights) {
    const transformationKey = Object.keys(props.result.transformationInsights).find(key => 
      key.includes(hexagramName)
    );
    if (transformationKey && props.result.transformationInsights[transformationKey]) {
      return props.result.transformationInsights[transformationKey];
    }
  }
  
  // 如果有AI生成的稳定启示，优先使用
  if (props.result.stableInsights?.[hexagramName]) {
    return props.result.stableInsights[hexagramName];
  }
  
  // 如果都没有AI生成的内容，返回简洁提示
  return `基于${hexagramName}卦的智慧，为您提供决策指导`;
};

// 获取变爻含义说明 - 使用AI生成的内容或动态生成
const getChangingLinesMeaning = (): string => {
  const changingLines = props.result.changingLines || [];
  
  if (changingLines.length === 0) {
    return '当前无变爻，卦象保持稳定状态。';
  }
  
  // 如果有AI生成的变爻数据，优先使用
  if (props.result.hexagramChanges?.[`${props.result.hexagramName}-${props.result.changingHexagramName}`]?.insight) {
    const insight = props.result.hexagramChanges[`${props.result.hexagramName}-${props.result.changingHexagramName}`].insight;
    const positions = changingLines.map(i => i + 1).join('、');
    return `变爻位置：第${positions}爻。 ${insight}`;
  }
  
  // 如果没有AI生成的内容，提供简洁提示
  const positions = changingLines.map(i => i + 1).join('、');
  return `变爻位置：第${positions}爻。 变爻含义解读中...`;
};

// 获取变化趋势说明 - 使用AI生成的内容或基于真实卦象数据生成
const getChangeTrendExplanation = (): string => {
  const startHexagram = props.result.hexagramName;
  const changeHexagram = props.result.changingHexagramName;
  
  if (!startHexagram || !changeHexagram) {
    return '当前无变化趋势。';
  }
  
  // 如果有AI生成的变化趋势数据，优先使用
  if (props.result.transformationInsights?.[`${startHexagram}-${changeHexagram}`]) {
    return props.result.transformationInsights[`${startHexagram}-${changeHexagram}`];
  }
  
  // 基于真实卦象数据生成变化趋势说明
  const transformationTrends: Record<string, string> = {
    '需-震': '从等待到行动的变化。需卦提示耐心等待，震卦则表明时机已到，需要果断行动。这种变化象征着从准备阶段转向执行阶段，是积极的转变。',
    '观-丰': '从观察到收获的变化。观卦强调仔细观察，丰卦则代表收获的喜悦。这种变化表明通过仔细观察和思考，最终会获得丰硕的成果。',
    '夬-大壮': '从决断到力量的变化。夬卦强调做出决断，大壮卦则代表力量的展现。这种变化表明决断后的行动会带来强大的力量。',
    '革-中孚': '从变革到信任的变化。革卦强调变革的必要性，中孚卦则代表诚信和信任。这种变化表明通过变革会建立更深的信任关系。',
    '屯-临': '从困难到临近的变化。屯卦代表困难，临卦则代表机会的临近。这种变化表明困难过后会有新的机会出现。',
    '益-蹇': '从增益到阻碍的变化。益卦代表增益，蹇卦则代表阻碍。这种变化提醒我们在获得收益后要警惕可能出现的阻碍。',
    '随-升': '从随顺到上升的变化。随卦强调顺应形势，升卦则代表上升的趋势。这种变化表明顺应形势会带来上升的机会。'
  };
  
  const key = `${startHexagram}-${changeHexagram}`;
  return transformationTrends[key] || `从${startHexagram}到${changeHexagram}的变化趋势解读中...`;
};

// 获取变化启示 - 使用AI生成的核心启示内容或基于真实卦象数据生成
const getChangeInsight = (): string => {
  // 优先使用AI生成的核心启示
  if (props.result.coreNarrative?.coreRevelation && props.result.coreNarrative.coreRevelation.trim()) {
    return props.result.coreNarrative.coreRevelation;
  }
  
  // 基于真实卦象数据生成变化启示
  const startHexagram = props.result.hexagramName;
  const changeHexagram = props.result.changingHexagramName;
  
  if (startHexagram && changeHexagram) {
    const changeInsights: Record<string, string> = {
      '需-震': '真正的智慧不在于选择"前"或"后"，而在于根据你工作的实际节奏和个人需求，找到那个能让休假价值最大化的"恰到好处的时机"。需卦提醒你耐心等待，震卦则告诉你时机已到，需要果断行动。',
      '观-丰': '通过仔细观察和深入思考，你能够找到最适合自己的年假安排方式。观卦强调观察的重要性，丰卦则预示着通过正确的选择会获得丰硕的成果。',
      '夬-大壮': '当断则断，不断则乱。夬卦提醒你要果断做出决定，大壮卦则表明你的决定会带来强大的力量。在年假安排上，要相信自己的判断，勇敢地做出选择。',
      '革-中孚': '变革需要诚信和信任。革卦强调变革的必要性，中孚卦则提醒我们要以诚待人。在年假安排上，要诚实地面对自己的需求，相信自己的选择。',
      '屯-临': '困难过后必有转机。屯卦代表暂时的困难，临卦则代表机会的临近。在年假安排上，即使遇到阻碍，也要保持信心，机会很快就会到来。',
      '益-蹇': '收益与风险并存。益卦代表增益，蹇卦则提醒我们要警惕阻碍。在年假安排上，要权衡利弊，既要追求收益，也要防范风险。',
      '随-升': '顺应形势，顺势而为。随卦强调顺应，升卦则代表上升。在年假安排上，要根据实际情况灵活调整，顺应形势会带来上升的机会。'
    };
    
    const key = `${startHexagram}-${changeHexagram}`;
    return changeInsights[key] || `基于${startHexagram}到${changeHexagram}的变化，建议你根据实际情况灵活安排年假时间。`;
  }
  
  // 如果没有变化，提供基于单个卦象的启示
  if (startHexagram) {
    const singleInsights: Record<string, string> = {
      '需': '需卦提醒你耐心等待最佳时机。在年假安排上，不要急于做决定，要观察形势，等待最合适的时机。',
      '震': '震卦提醒你时机已到，需要果断行动。在年假安排上，如果条件成熟，就要勇敢地做出决定。',
      '观': '观卦提醒你要仔细观察当前形势。在年假安排上，要深入了解工作节奏和个人需求，做出明智的选择。',
      '丰': '丰卦代表收获的喜悦。在年假安排上，合理的安排会为你带来身心的恢复和工作的提升。',
      '夬': '夬卦提醒你要果断做出决定。在年假安排上，不要犹豫不决，要相信自己的判断。',
      '大壮': '大壮卦代表力量强大。在年假安排上，你有足够的能力做出正确的决定。',
      '革': '革卦提醒你要勇于变革。在年假安排上，可能需要打破常规，寻找创新的解决方案。',
      '中孚': '中孚卦提醒你要以诚待人。在年假安排上，要诚实地面对自己的需求。',
      '屯': '屯卦提醒你可能会遇到困难。在年假安排上，要有心理准备，但不要放弃。',
      '临': '临卦提醒你机会即将到来。在年假安排上，要密切关注时机，做好准备。',
      '益': '益卦代表增益和进步。在年假安排上，合理的安排会为你带来收益。',
      '蹇': '蹇卦提醒你要警惕阻碍。在年假安排上，要防范可能出现的困难。',
      '随': '随卦提醒你要顺应形势。在年假安排上，要根据实际情况灵活调整。'
    };
    
    return singleInsights[startHexagram] || `基于${startHexagram}卦的智慧，建议你根据实际情况灵活安排年假时间。`;
  }
  
  // 默认提示
  return '基于易经智慧，建议你根据实际情况灵活安排年假时间。';
};

// 获取变爻位置样式类 - 基于变爻数据
const getChangingLineClass = (lineIndex: number): string => {
  // 这里应该基于真实的变爻数据，而不是硬编码
  // 实际项目中应该从卦象变化数据获取
  const changingLines = props.result.changingLines || []; // 假设有changingLines字段
  
  if (changingLines.includes(lineIndex)) {
    return 'bg-red-500 animate-pulse'; // 变爻用红色表示
  } else {
    return 'bg-gray-300'; // 不变爻用灰色表示
  }
};

// 获取变化类型 - 基于AI生成的内容或动态分析
const getChangeType = (): string => {
  const startHexagram = props.result.hexagramName;
  const changeHexagram = props.result.changingHexagramName;
  
  if (!startHexagram || !changeHexagram) return '无变化';
  
  // 如果有AI生成的变化类型信息，优先使用
  if (props.result.transformationInsights?.[`${startHexagram}-${changeHexagram}`]) {
    return props.result.transformationInsights[`${startHexagram}-${changeHexagram}`];
  }
  
  // 否则提供通用的变化描述
  return `${startHexagram} → ${changeHexagram}`;
};

// 获取核心建议 - 使用AI生成的核心建议内容或基于真实卦象数据生成
const getCoreRecommendation = (): string => {
  // 优先使用AI生成的核心建议
  if (props.result.breakthroughPlan?.clearRecommendation) {
    return props.result.breakthroughPlan.clearRecommendation;
  }
  
  // 基于真实卦象数据生成核心建议
  const startHexagram = props.result.hexagramName;
  const changeHexagram = props.result.changingHexagramName;
  
  if (startHexagram && changeHexagram) {
    const recommendations: Record<string, string> = {
      '需-震': '建议你采用"观察-行动"的策略。先仔细观察工作节奏和个人状态，当条件成熟时果断安排年假。不要急于做决定，但也不要错过最佳时机。',
      '观-丰': '建议你通过深入观察和分析，找到最适合自己的年假安排方式。仔细观察工作安排、个人需求和外部环境，做出明智的选择。',
      '夬-大壮': '建议你果断做出决定，相信自己的判断。在年假安排上，不要犹豫不决，要勇敢地做出选择，你的决定会带来积极的结果。',
      '革-中孚': '建议你勇于变革，以诚待人。在年假安排上，要诚实地面对自己的需求，不要被传统观念束缚，寻找创新的解决方案。',
      '屯-临': '建议你保持耐心，等待机会的到来。在年假安排上，即使遇到困难也要保持信心，机会很快就会到来。',
      '益-蹇': '建议你权衡利弊，既要追求收益也要防范风险。在年假安排上，要综合考虑各种因素，做出平衡的选择。',
      '随-升': '建议你顺应形势，灵活调整。在年假安排上，要根据实际情况灵活调整，顺应形势会带来上升的机会。'
    };
    
    const key = `${startHexagram}-${changeHexagram}`;
    return recommendations[key] || `基于${startHexagram}到${changeHexagram}的变化，建议你根据实际情况灵活安排年假时间。`;
  }
  
  // 如果没有变化，提供基于单个卦象的建议
  if (startHexagram) {
    const singleRecommendations: Record<string, string> = {
      '需': '建议你耐心等待最佳时机。在年假安排上，不要急于做决定，要观察形势，等待最合适的时机。',
      '震': '建议你时机已到，需要果断行动。在年假安排上，如果条件成熟，就要勇敢地做出决定。',
      '观': '建议你仔细观察当前形势。在年假安排上，要深入了解工作节奏和个人需求，做出明智的选择。',
      '丰': '建议你合理安排年假时间。合理的安排会为你带来身心的恢复和工作的提升。',
      '夬': '建议你果断做出决定。在年假安排上，不要犹豫不决，要相信自己的判断。',
      '大壮': '建议你自信地做出决定。在年假安排上，你有足够的能力做出正确的选择。',
      '革': '建议你勇于变革。在年假安排上，可能需要打破常规，寻找创新的解决方案。',
      '中孚': '建议你以诚待人。在年假安排上，要诚实地面对自己的需求。',
      '屯': '建议你保持耐心。在年假安排上，要有心理准备，但不要放弃。',
      '临': '建议你密切关注时机。在年假安排上，要做好准备迎接机会的到来。',
      '益': '建议你合理安排年假。合理的安排会为你带来收益。',
      '蹇': '建议你防范可能出现的困难。在年假安排上，要警惕阻碍。',
      '随': '建议你顺应形势。在年假安排上，要根据实际情况灵活调整。'
    };
    
    return singleRecommendations[startHexagram] || `基于${startHexagram}卦的智慧，建议你根据实际情况灵活安排年假时间。`;
  }
  
  // 默认建议
  return '基于易经智慧，建议你根据实际情况灵活安排年假时间。';
};

// 获取易经智慧 - 使用AI生成的内容
const getYijingWisdom = (): string => {
  // 优先使用AI生成的核心叙事内容
  if (props.result.coreNarrative?.story) {
    // 从AI生成的故事中提取核心智慧
    const story = props.result.coreNarrative.story;
    return `《易经》原文："${story}"`;
  }
  
  // 如果没有AI生成的内容，提供基于卦象的智慧解读
  const startHexagram = props.result.hexagramName;
  const changeHexagram = props.result.changingHexagramName;
  
  if (startHexagram && changeHexagram) {
    return `《易经》原文："你现在的处境就像'云上于天'的景象——云彩已经升到天上，但雨水尚未降下，象征着收获的时机需要耐心等待。十一长假就像已经形成的云层，而你的年假则是等待降下的雨水。卦象提示'君子以饮食宴乐'，不是让你消极等待，而是要在准备充分的同时保持内心的愉悦和期待。当条件成熟时，雨水自然会降下，收获也会如期而至。"`;
  } else if (startHexagram) {
    return `《易经》原文："你现在的处境就像'云上于天'的景象——云彩已经升到天上，但雨水尚未降下，象征着收获的时机需要耐心等待。十一长假就像已经形成的云层，而你的年假则是等待降下的雨水。卦象提示'君子以饮食宴乐'，不是让你消极等待，而是要在准备充分的同时保持内心的愉悦和期待。"`;
  }
  
  // 默认提示
  return '《易经》原文："基于卦象智慧，为您提供决策指导"';
};

// 获取天玄洞察 - 用于分享和收藏
const getTianxuanInsight = (): string => {
  // 优先使用AI生成的核心建议
  if (props.result.breakthroughPlan?.clearRecommendation) {
    return props.result.breakthroughPlan.clearRecommendation;
  }
  
  // 如果没有AI生成的内容，提供基于卦象的洞察
  const startHexagram = props.result.hexagramName;
  const changeHexagram = props.result.changingHexagramName;
  
  if (startHexagram && changeHexagram) {
    return `真正的智慧不在于选择"前"或"后"，而在于根据你工作的实际节奏和个人需求，找到那个能让休假价值最大化的'恰到好处的时机'`;
  } else if (startHexagram) {
    return `基于${startHexagram}卦的智慧，建议你根据实际情况灵活安排年假时间`;
  }
  
  return '基于易经智慧，建议你根据实际情况灵活安排年假时间';
};

// 获取行动指导 - 使用AI生成的内容
const getActionGuidance = (): string => {
  // 优先使用AI生成的行动计划
  if (props.result.breakthroughPlan?.actionList && props.result.breakthroughPlan.actionList.length > 0) {
    const actions = props.result.breakthroughPlan.actionList;
    
    // 从行动描述中提取具体的关键词，生成更有价值的指导
    const extractKeyActions = (action: any) => {
      const detail = action.actionDetail || '';
      const title = action.actionTitle || '';
      
      // 优先使用AI生成的具体行动描述，而不是机械提取关键词
      if (detail && detail.length > 10) {
        // 如果AI生成了具体的行动描述，直接使用
        return detail;
      }
      
      // 如果标题本身就很具体，直接使用
      if (title && title.length > 4 && !title.includes('计划') && !title.includes('优化') && !title.includes('提升')) {
        return title;
      }
      
      // 如果标题包含抽象词汇，根据用户的具体问题生成相关行动
      const optionA = props.result.optionAnalysis?.[0]?.optionName || '';
      const optionB = props.result.optionAnalysis?.[1]?.optionName || '';
      
      // 根据用户的具体选择生成相关行动
      if (optionA.includes('值班') || optionB.includes('值班')) {
        if (title.includes('效率') || title.includes('工作')) {
          return '今天评估值班环境的工作效率';
        } else if (title.includes('沟通') || title.includes('联系')) {
          return '今天与值班同事确认工作安排';
        } else {
          return '今天评估值班室的工作条件';
        }
      } else if (optionA.includes('办公室') || optionB.includes('办公室')) {
        if (title.includes('效率') || title.includes('工作')) {
          return '今天评估办公室的工作环境';
        } else if (title.includes('沟通') || title.includes('联系')) {
          return '今天与办公室同事确认工作安排';
        } else {
          return '今天评估办公室的工作条件';
        }
      } else if (optionA.includes('休假') || optionB.includes('休假')) {
        if (title.includes('效率') || title.includes('工作')) {
          return '今天确认休假期间的工作安排';
        } else if (title.includes('沟通') || title.includes('联系')) {
          return '今天与领导确认休假时间';
        } else {
          return '今天制定休假计划';
        }
      } else {
        // 通用情况，根据标题生成相关行动
        if (title.includes('效率')) {
          return '今天评估当前工作环境';
        } else if (title.includes('沟通')) {
          return '今天联系相关人员';
        } else if (title.includes('准备')) {
          return '今天准备必要材料';
        } else {
          return '今天开始具体行动';
        }
      }
    };
    
    // 根据行动数量生成不同的时间安排
    if (actions.length === 1) {
      const keyAction = extractKeyActions(actions[0]);
      return `立即行动：${keyAction} | 今天内完成 | 明天评估效果`;
    } else if (actions.length === 2) {
      const action1 = extractKeyActions(actions[0]);
      const action2 = extractKeyActions(actions[1]);
      return `今天：${action1} | 明天：${action2} | 后天评估效果`;
    } else if (actions.length >= 3) {
      const action1 = extractKeyActions(actions[0]);
      const action2 = extractKeyActions(actions[1]);
      const action3 = extractKeyActions(actions[2]);
      return `今天：${action1} | 明天：${action2} | 后天：${action3} | 3天内评估效果`;
    }
  }
  
  // 如果没有AI生成的内容，提供基于卦象的个性化指导
  const startHexagram = props.result.hexagramName;
  const changeHexagram = props.result.changingHexagramName;
  
  if (startHexagram && changeHexagram) {
    return `基于${startHexagram}卦到${changeHexagram}卦的变化，建议今天开始行动，明天观察变化，后天评估效果`;
  } else if (startHexagram) {
    return `基于${startHexagram}卦的智慧，建议今天开始行动，明天观察变化，后天评估效果`;
  }
  
  return '今天开始行动，明天观察变化，后天评估效果';
};

// 获取太极卡片状态 - 现在/未来，每栏≤12字
const getTaijiCardStatus = (type: 'now' | 'future'): string => {
  const startHexagram = props.result.hexagramName;
  const changeHexagram = props.result.changingHexagramName;
  
  if (type === 'now') {
    const nowStatus: Record<string, string> = {
      '观': '观察思考',
      '丰': '收获期',
      '夬': '需要决断',
      '大壮': '力量强大',
      '革': '变革期',
      '中孚': '诚信为本',
      '屯': '困难期',
      '咸': '感应强烈',
      '升': '上升期',
      '临': '临近观察',
      '益': '可得帮助',
      '蹇': '面临阻碍',
      '随': '随顺适应'
    };
    return nowStatus[startHexagram || ''] || '当前状态';
  } else {
    if (changeHexagram && changeHexagram !== startHexagram) {
      const futureStatus: Record<string, string> = {
        '丰': '丰盛收获',
        '夬': '果断行动',
        '大壮': '强大成长',
        '中孚': '诚信信任',
        '屯': '困难新生',
        '临': '临近观察',
        '蹇': '困难阻碍',
        '升': '上升进步'
      };
      return futureStatus[changeHexagram] || '发展趋势';
    } else {
      return '保持稳定';
    }
  }
};

// 获取太极卡片预言 - 1句预言，≤12字
const getTaijiCardProphecy = (): string => {
  const startHexagram = props.result.hexagramName;
  const changeHexagram = props.result.changingHexagramName;
  const changingLines = props.result.changingLines || [];
  
  if (!startHexagram) {
    return '顺应自然，必有转机';
  }
  
  if (changeHexagram && changingLines.length > 0) {
    const prophecies: Record<string, Record<string, string>> = {
      '观': {
        '丰': '观察后行动',
        '夬': '观察后决断',
        '大壮': '观察后成长'
      },
      '革': {
        '中孚': '变革得信任',
        '屯': '变革后新生'
      },
      '升': {
        '屯': '上升遇困难',
        '临': '上升需观察'
      },
      '益': {
        '临': '得益需观察',
        '蹇': '得益遇阻碍'
      },
      '随': {
        '蹇': '随顺遇困难',
        '升': '随顺得上升'
      }
    };
    
    const prophecy = prophecies[startHexagram]?.[changeHexagram];
    if (prophecy) {
      return prophecy;
    }
    
    // 通用预言
    return changingLines.length <= 2 ? '微调见成效' : '大变迎新机';
  } else {
    // 无变化时的预言
    const stableProphecies: Record<string, string> = {
      '观': '观察得智慧',
      '丰': '收获在眼前',
      '夬': '决断正当时',
      '大壮': '力量可突破',
      '革': '变革正当时',
      '中孚': '诚信得信任',
      '屯': '困难后新生',
      '咸': '感应得和谐',
      '升': '上升正当时',
      '临': '观察得真相',
      '益': '得益正当时',
      '蹇': '困难后转机',
      '随': '随顺得适应'
    };
    
    return stableProphecies[startHexagram] || '顺应自然，必有转机';
  }
};

// 获取个性化临别赠言 - 基于用户的具体选择生成独特内容
const getPersonalizedFarewell = (): string => {
  const optionA = props.result.optionAnalysis?.[0]?.optionName || '第一个选择';
  const optionB = props.result.optionAnalysis?.[1]?.optionName || '第二个选择';
  const hexagramName = props.result.hexagramName || '观卦';
  
  // 基于卦象和选择生成个性化的临别赠言
  const farewellTemplates = [
    `在${optionA}与${optionB}之间，你站在人生的十字路口。${hexagramName}告诉我们，每一次选择都是成长的机会，每一次犹豫都是智慧的积累。`,
    `面对${optionA}和${optionB}的抉择，记住：真正的智慧不在于选择哪条路，而在于选择后的坚持与成长。${hexagramName}指引你找到内心的答案。`,
    `在${optionA}与${optionB}的权衡中，你正在书写自己的人生故事。${hexagramName}提醒我们，每一个决定都是命运交响乐中的一个音符。`,
    `选择${optionA}还是${optionB}？${hexagramName}告诉我们，答案不在远方，而在你心中。相信自己的直觉，勇敢地迈出那一步。`
  ];
  
  // 随机选择一个模板，或者基于卦象选择特定的模板
  const randomIndex = Math.floor(Math.random() * farewellTemplates.length);
  return farewellTemplates[randomIndex];
};

// 获取决策提醒 - 基于易经智慧的具体提醒
const getDecisionReminder = (): string => {
  const hexagramName = props.result.hexagramName || '观卦';
  
  const reminders: Record<string, string> = {
    '观': '观察是智慧的开始，但行动才是改变的关键',
    '丰': '收获需要耐心，但也要把握时机',
    '夬': '决断需要勇气，但也要考虑周全',
    '大壮': '力量强大时更要谨慎，避免过犹不及',
    '革': '变革是必要的，但要有计划有步骤',
    '中孚': '诚信是根本，但也要保护自己',
    '屯': '困难是成长的必经之路，坚持下去必有转机',
    '咸': '感应是双向的，用心感受他人的需求',
    '升': '上升需要基础，稳扎稳打才能持续',
    '临': '临近观察，细节决定成败',
    '益': '得益时要感恩，也要学会分享',
    '蹇': '困难时不要放弃，转机往往在坚持中到来',
    '随': '随顺不是盲从，要有自己的原则'
  };
  
  return reminders[hexagramName] || '每一个选择都是成长的机会，相信自己的判断';
};

// 获取行动鼓励 - 基于具体选择的行动指导
const getActionEncouragement = (): string => {
  const optionA = props.result.optionAnalysis?.[0]?.optionName || '第一个选择';
  const optionB = props.result.optionAnalysis?.[1]?.optionName || '第二个选择';
  
  return `无论你选择${optionA}还是${optionB}，都要记住：行动比完美更重要，开始比等待更有效。今天就开始，哪怕只是小小的一步。`;
};
</script>

<style scoped>
.scenario-analysis-result {
  @apply max-w-4xl mx-auto;
}

/* 🎭 卦象动态故事板样式 */
.hexagram-storyboard {
  @apply relative;
}

.storyboard-container {
  @apply relative;
}

.hexagram-card {
  @apply transition-all duration-500 ease-in-out;
  position: relative;
  overflow: hidden;
}

.hexagram-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease-in-out;
}

.hexagram-card:hover::before {
  left: 100%;
}

.card-glow {
  @apply transition-opacity duration-500;
}

.transformation-arrow {
  @apply relative;
}

.arrow-container {
  @apply relative;
}

.arrow-line {
  @apply animate-pulse;
  filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3));
}

.energy-flow {
  @apply animate-pulse;
  filter: drop-shadow(0 0 12px rgba(99, 102, 241, 0.4));
}

.stability-indicator {
  @apply relative;
}

.stability-icon {
  filter: drop-shadow(0 0 8px rgba(156, 163, 175, 0.3));
}

.hexagram-story {
  @apply backdrop-blur-sm;
  box-shadow: 0 4px 20px rgba(147, 51, 234, 0.1);
}

/* 思考引导样式 */
.thinking-question {
  @apply backdrop-blur-sm;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);
}

/* 品牌宣言样式 */
.brand-declaration {
  @apply backdrop-blur-sm;
  box-shadow: 0 4px 20px rgba(147, 51, 234, 0.1);
}

/* 箴言徽章样式 */
.mantra-badge {
  animation: gentle-float 3s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(147, 51, 234, 0.3));
}

/* 天玄之见样式 */
.tianxuan-insight-section {
  @apply backdrop-blur-sm;
  box-shadow: 0 8px 32px rgba(245, 158, 11, 0.15);
}

.insight-badge {
  animation: gentle-float 2s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.4));
}

/* 选项总结样式 */
.options-summary {
  @apply backdrop-blur-sm;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.15);
}

/* 增强的箴言样式 */
.mantra-display blockquote {
  box-shadow: 0 20px 60px rgba(147, 51, 234, 0.15);
}

.mantra-display:hover blockquote {
  box-shadow: 0 25px 80px rgba(147, 51, 234, 0.25);
}

/* 光晕效果 */
.mantra-display blockquote::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #8b5cf6, #3b82f6, #6366f1, #8b5cf6);
  border-radius: inherit;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.mantra-display:hover blockquote::before {
  opacity: 0.3;
}

/* 动画定义 */
@keyframes gentle-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
}

@keyframes flow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.animate-flow {
  animation: flow 2s ease-in-out infinite;
}

.animate-gentle-float {
  animation: gentle-float 3s ease-in-out infinite;
}

/* 选项分析样式 */
.options-analysis-section {
  @apply border-l-4 border-indigo-500;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
}

.option-card {
  @apply p-6 border border-gray-200 rounded-xl transition-all duration-300 bg-white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.option-card:hover {
  @apply transform -translate-y-2;
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
}

.content-item {
  @apply transition-all duration-300;
}

.content-item:hover {
  @apply transform scale-105;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.option-divider {
  @apply transition-all duration-300;
}

.option-card:hover .option-divider {
  @apply from-indigo-500 via-purple-500 to-indigo-500;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
}

/* 行动手册样式 */
.action-suggestions-section {
  @apply border-l-4 border-orange-500;
  box-shadow: 0 8px 32px rgba(245, 158, 11, 0.1);
}

.action-item {
  @apply border border-gray-200 transition-all duration-300;
}

.action-item:hover {
  @apply transform -translate-y-1;
  box-shadow: 0 12px 40px rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.3);
}

.action-number {
  @apply transition-all duration-300;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.action-item:hover .action-number {
  @apply transform scale-110;
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.clear-recommendation {
  @apply transition-all duration-300;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.1);
}

.clear-recommendation:hover {
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15);
}

/* 核心箴言样式 */
.core-mantra-section {
  @apply border-l-4 border-purple-500;
  box-shadow: 0 8px 32px rgba(147, 51, 234, 0.1);
}

.mantra-display {
  @apply relative;
}

.mantra-display blockquote {
  @apply transition-all duration-300;
  box-shadow: 0 8px 32px rgba(147, 51, 234, 0.1);
}

.mantra-display:hover blockquote {
  @apply transform scale-105;
  box-shadow: 0 12px 40px rgba(147, 51, 234, 0.15);
}

.quote-mark {
  @apply transition-all duration-300;
  filter: drop-shadow(0 0 8px rgba(147, 51, 234, 0.3));
}

.mantra-display:hover .quote-mark {
  @apply transform scale-110;
  filter: drop-shadow(0 0 12px rgba(147, 51, 234, 0.5));
}

.mantra-interpretation {
  @apply transition-all duration-300;
  box-shadow: 0 4px 16px rgba(147, 51, 234, 0.1);
}

.mantra-interpretation:hover {
  box-shadow: 0 8px 24px rgba(147, 51, 234, 0.15);
}

.divider {
  @apply transition-all duration-300;
  box-shadow: 0 2px 8px rgba(147, 51, 234, 0.3);
}

/* 核心建议样式 */
.core-recommendation-section {
  border-left: 4px solid #ef4444;
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.1);
}

.recommendation-content {
  padding: 1.25rem;
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.recommendation-content .flex {
  align-items: flex-start;
}

.recommendation-content .w-8 {
  width: 2rem;
  height: 2rem;
  background-color: #ef4444;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.recommendation-content .w-8 .text-lg {
  color: white;
  font-size: 1.125rem;
  font-weight: 700;
}

.recommendation-content .flex-1 h4 {
  font-weight: 700;
  color: #991b1b;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.recommendation-content .flex-1 p {
  color: #1f2937;
  font-size: 1.125rem;
  line-height: 1.75;
  font-weight: 500;
}

/* 通用增强样式 */
.overview-section {
  @apply border border-purple-200;
  box-shadow: 0 8px 32px rgba(147, 51, 234, 0.1);
}

.core-narrative-section {
  @apply border-l-4 border-blue-500;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .storyboard-container {
    @apply flex-col space-y-4;
  }
  
  .transformation-arrow {
    @apply transform rotate-90;
  }
  
  .hexagram-card {
    @apply p-3;
  }
  
  .option-card {
    @apply p-4;
  }
  
  .action-item {
    @apply p-4;
  }
  
  .mantra-display blockquote {
    @apply text-xl p-4;
  }
  
  .thinking-question {
    @apply p-4;
  }
  
  .brand-declaration {
    @apply p-4;
  }
}

/* 动画增强 */
@keyframes gentleFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
}

.hexagram-item:hover {
  animation: gentleFloat 2s ease-in-out infinite;
}

/* 品牌色彩统一 */
:root {
  --brand-primary: #8b5cf6;
  --brand-secondary: #ec4899;
  --brand-accent: #f59e0b;
  --brand-success: #10b981;
  --brand-warning: #f59e0b;
  --brand-error: #ef4444;
}

/* 微交互效果 */
.content-item,
.action-item,
.mantra-interpretation {
  @apply cursor-pointer;
}

.content-item:active,
.action-item:active,
.mantra-interpretation:active {
  @apply transform scale-95;
}

/* 加载状态 */
.loading {
  @apply animate-pulse;
}

/* 焦点状态 */
.option-card:focus-within,
.action-item:focus-within {
  @apply ring-2 ring-purple-400 ring-opacity-50;
  outline: none;
}
</style>

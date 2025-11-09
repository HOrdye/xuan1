<template>
  <div>
    <div v-if="result" class="divination-result bg-white shadow-xl rounded-lg p-6 animate-fadeIn">
      <!-- 页面头部 - 品牌标识 -->
      <div class="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg border border-blue-200">           
        <!-- 天玄品牌标识 -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">                                    
            <span class="text-white font-bold text-lg">天</span>
          </div>
          <div>
            <h3 class="font-bold text-xl text-blue-800">天玄易经</h3>
            <p class="text-sm text-blue-600">智慧决策助手</p>
          </div>
        </div>

      </div>

      <!-- 标题和问题回顾 -->
      <div class="mb-6 text-center">
        <h3 class="text-3xl font-semibold text-primary mb-2 vintage-text animate-slideInDown">占卜结果</h3>
        <p v-if="result.question" class="text-gray-600 text-lg animate-slideInDown" style="animation-delay: 0.1s;">
          针对问题: "<span class="font-medium">{{ result.question }}</span>"
        </p>
        
        <!-- 页面内导航 -->
        <div class="mt-4 flex flex-wrap justify-center gap-2">
          <button 
            @click="scrollToSection('core')"
            class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition-colors duration-200"
          >
            🎯 核心结论
          </button>
          <button 
            @click="scrollToSection('interpretation')"
            class="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full hover:bg-indigo-200 transition-colors duration-200"
          >
            📖 综合解读
          </button>
          <button 
            @click="scrollToSection('hexagram')"
            class="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full hover:bg-orange-200 transition-colors duration-200"
          >
            ☯ 卦象分析
          </button>
        </div>
      </div>

      <!-- 问题连接卡片 - 智能连接算法的核心展示 -->
      <div v-if="personalizedInsight" class="personalized-insight mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg border border-blue-100 animate-reveal">
        <div class="text-center mb-4">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-3">
            <span class="text-white text-xl">🔮</span>
          </div>
          <h4 class="text-xl font-semibold text-gray-800 mb-2">天玄智能解读</h4>
        </div>
        
          <!-- 核心结论 -->
          <div class="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-300 shadow-lg">
            <h5 class="font-bold text-green-800 mb-4 text-lg">核心结论</h5>
            <p class="text-2xl font-bold text-gray-900 leading-relaxed">{{ personalizedInsight.coreConclusion }}</p>
          </div>
      </div>

      <!-- ========== 卦象内容区域 ========== -->
      <div v-if="result.hexagram" class="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200 animate-reveal">
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-3">
            <span class="text-white text-xl">☯</span>
          </div>
          <h4 class="text-xl font-semibold text-gray-800 mb-2">卦象内容</h4>
          <p class="text-sm text-gray-600">完整的卦象信息展示</p>
        </div>

        <!-- 本卦完整信息 -->
        <div class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">                                                      
          <h4 class="font-bold text-gray-800 text-2xl mb-4 text-center">本卦: {{ result.hexagram.chineseName || result.hexagram.name }}</h4>                    

          <!-- 左右分栏布局：左侧卦象+卦辞象辞，右侧爻辞（上下齐平） -->        
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <!-- 左侧：卦象、卦辞、象辞 -->
            <div class="space-y-4 flex flex-col">
              <!-- 卦象展示（居中） -->
              <div class="hexagram-center-align flex justify-center items-center w-full">
                <HexagramDisplay
                  :hexagram="result.hexagram"
                  :show-description="false"
                  :show-xiang-text="false"
                  :show-overall="false"
                />
              </div>
              
              <!-- 卦辞 -->
              <div v-if="result.hexagram.judgment || result.hexagram.description" class="p-4 bg-blue-50 rounded-lg border border-blue-100">                     
                <h5 class="font-semibold text-blue-800 mb-2 flex items-center justify-center"> 
                  <span class="mr-2">📖</span>
                  卦辞
                </h5>
                <p class="text-gray-800 leading-relaxed text-center">{{ result.hexagram.judgment || result.hexagram.description }}</p>
              </div>

              <!-- 象辞 -->
              <div v-if="result.hexagram.image || result.hexagram.overall" class="p-4 bg-indigo-50 rounded-lg border border-indigo-100">                        
                <h5 class="font-semibold text-indigo-800 mb-2 flex items-center justify-center">                                                                               
                  <span class="mr-2">✨</span>
                  象辞
                </h5>
                <p class="text-gray-800 leading-relaxed text-center">{{ result.hexagram.image || result.hexagram.overall }}</p>
              </div>
            </div>

            <!-- 右侧：爻辞（放大字体，增大间距，与左侧等高） -->
            <div class="flex flex-col">
              <div v-if="result.hexagram.yao_texts && result.hexagram.yao_texts.length > 0" class="p-5 bg-green-50 rounded-lg border border-green-100 h-full flex flex-col">         
                <h5 class="font-semibold text-green-800 mb-4 flex items-center justify-center text-lg">
                  <span class="mr-2">🔮</span>
                  爻辞
                </h5>
                <div class="space-y-3 flex-1">
                  <div
                    v-for="(yao, index) in result.hexagram.yao_texts"
                    :key="index"
                    class="text-base text-gray-800 p-3 bg-white/70 rounded leading-relaxed text-center"
                  >
                    {{ yao }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 变卦完整信息（如果有动爻） -->
        <div v-if="result.changingLines && result.changingLines.length > 0 && result.relatedHexagram" class="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <h4 class="font-bold text-gray-800 text-2xl mb-4 text-center">变卦: {{ result.relatedHexagram.chineseName || result.relatedHexagram.name }}</h4>

          <!-- 左右分栏布局：左侧卦象+卦辞象辞，右侧爻辞（上下齐平） -->        
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">     
            <!-- 左侧：卦象、卦辞、象辞 -->
            <div class="space-y-4 flex flex-col">
              <!-- 卦象展示（居中） -->
              <div class="hexagram-center-align flex justify-center items-center w-full">                                                                       
                <HexagramDisplay
                  :hexagram="result.relatedHexagram"
                  :show-description="false"
                  :show-xiang-text="false"
                  :show-overall="false"
                />
              </div>

              <!-- 卦辞 -->
              <div v-if="result.relatedHexagram.judgment || result.relatedHexagram.description" class="p-4 bg-blue-50 rounded-lg border border-blue-100">                     
                <h5 class="font-semibold text-blue-800 mb-2 flex items-center justify-center">                                                                  
                  <span class="mr-2">📖</span>
                  卦辞
                </h5>
                <p class="text-gray-800 leading-relaxed text-center">{{ result.relatedHexagram.judgment || result.relatedHexagram.description }}</p>                          
              </div>

              <!-- 象辞 -->
              <div v-if="result.relatedHexagram.image || result.relatedHexagram.overall" class="p-4 bg-indigo-50 rounded-lg border border-indigo-100">                        
                <h5 class="font-semibold text-indigo-800 mb-2 flex items-center justify-center">                                                                
                  <span class="mr-2">✨</span>
                  象辞
                </h5>
                <p class="text-gray-800 leading-relaxed text-center">{{ result.relatedHexagram.image || result.relatedHexagram.overall }}</p>                                 
              </div>
            </div>

            <!-- 右侧：爻辞（如果有） -->
            <div class="flex flex-col">
              <div v-if="result.relatedHexagram.yao_texts && result.relatedHexagram.yao_texts.length > 0" class="p-5 bg-green-50 rounded-lg border border-green-100 h-full flex flex-col">                                                                    
                <h5 class="font-semibold text-green-800 mb-4 flex items-center justify-center text-lg">                                                         
                  <span class="mr-2">🔮</span>
                  爻辞
                </h5>
                <div class="space-y-3 flex-1">
                  <div
                    v-for="(yao, index) in result.relatedHexagram.yao_texts"
                    :key="index"
                    class="text-base text-gray-800 p-3 bg-white/70 rounded leading-relaxed text-center"                                                         
                  >
                    {{ yao }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 卦象变化过程（如果有动爻） -->
        <div v-if="result.changingLines && result.changingLines.length > 0 && result.relatedHexagram" class="mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
          <h5 class="font-semibold text-orange-800 mb-2 text-center">趋势总结</h5>
          <p class="text-gray-700 text-center mb-4">此事由<span class="font-medium text-orange-600">{{ result.hexagram.chineseName || result.hexagram.name }}</span>的状况，最终会发展为<span class="font-medium text-red-600">{{ result.relatedHexagram.chineseName || result.relatedHexagram.name }}</span>的结果。</p>

          <!-- 卦象变化动画展示 -->
          <div class="mt-4 p-4 bg-white/60 rounded-lg">
            <h6 class="font-semibold text-orange-700 mb-3 text-center">卦象变化过程</h6>    
            <div class="flex items-center justify-center space-x-4">
              <!-- 本卦 -->
              <div class="text-center">
                <div class="mb-2">
                  <HexagramDisplay
                    :hexagram="result.hexagram"
                    :highlight-lines="result.changingLines"
                    :is-changing="true"
                    class="transform transition-all duration-1000"
                  />
                </div>
                <p class="text-sm font-medium text-orange-600">本卦</p>
              </div>

              <!-- 变化箭头 -->
              <div class="flex flex-col items-center">
                <div class="w-8 h-0.5 bg-gradient-to-r from-orange-400 to-red-400 mb-2"></div>                                                                  
                <div class="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-400"></div>                                                
                <div class="text-xs text-gray-500 mt-2">变化</div>
              </div>

              <!-- 变卦 -->
              <div class="text-center">
                <div class="mb-2">
                  <HexagramDisplay
                    :hexagram="result.relatedHexagram"
                    class="transform transition-all duration-1000"
                  />
                </div>
                <p class="text-sm font-medium text-red-600">变卦</p>
              </div>
            </div>

            <!-- 动爻说明 -->
            <div class="mt-3 text-center">
              <p class="text-xs text-gray-600 mb-2">
                动爻：{{ result.changingLines.map(line => getYaoLabel(line)).join('、') }}                                                                    
              </p>

              <!-- 动画触发按钮 -->
              <button
                @click="startHexagramAnimation"
                :disabled="animationState !== 'idle'"
                class="px-3 py-1 bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs rounded-full hover:from-orange-500 hover:to-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"         
              >
                {{ animationState === 'idle' ? '🎬 观看变化过程' :
                   animationState === 'highlighting' ? '✨ 高亮动爻中...' :   
                   animationState === 'flipping' ? '🔄 卦象翻转中...' : '✅ 变化完成' }}                                                                      
              </button>
            </div>
          </div>
        </div>

        <!-- 卦象属性标签 -->
        <div v-if="personalizedInsight.hexagramAttributes" class="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
          <h5 class="font-semibold text-purple-800 mb-3">卦象特质分析</h5>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-purple-400 rounded-full"></span>
              <span class="text-gray-600">性质：</span>
              <span class="font-medium">{{ personalizedInsight.hexagramAttributes.nature }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-purple-400 rounded-full"></span>
              <span class="text-gray-600">五行：</span>
              <span class="font-medium">{{ personalizedInsight.hexagramAttributes.element }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-purple-400 rounded-full"></span>
              <span class="text-gray-600">行动：</span>
              <span class="font-medium">{{ personalizedInsight.hexagramAttributes.action }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-purple-400 rounded-full"></span>
              <span class="text-gray-600">吉凶：</span>
              <span class="font-medium">{{ personalizedInsight.hexagramAttributes.fortune }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-purple-400 rounded-full"></span>
              <span class="text-gray-600">时机：</span>
              <span class="font-medium">{{ personalizedInsight.hexagramAttributes.timing }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-purple-400 rounded-full"></span>
              <span class="text-gray-600">能量：</span>
              <span class="font-medium">{{ personalizedInsight.hexagramAttributes.energy }}</span>
            </div>
          </div>
        </div>
        
      </div>

      <!-- ========== 具体解读区域 ========== -->
      <div v-if="(result.analysis && result.method !== 'dilemma') || (result.changingLines && result.changingLines.length > 0)" class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-200 animate-reveal">
        <div class="text-center mb-4">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-3">
            <span class="text-white text-xl">📖</span>
          </div>
          <h4 class="text-xl font-semibold text-gray-800 mb-2">具体解读</h4>
          <p class="text-sm text-gray-600">基于传统易经智慧与现代解读的深度分析</p>
        </div>

        <!-- 综合解读 -->
        <div v-if="result.analysis && result.method !== 'dilemma'" class="mb-8">
          <h5 class="font-semibold text-gray-800 mb-3 text-lg">综合解读</h5>
          <div class="text-gray-700 whitespace-pre-wrap leading-relaxed">
            <!-- 使用v-html渲染带格式的文本 -->
            <div v-html="formatAnalysisText(typeof result.analysis === 'string' ? result.analysis : JSON.stringify(result.analysis))"></div>
          </div>
        </div>

        <!-- 动爻分析（如果有动爻） -->
        <div v-if="result.changingLines && result.changingLines.length > 0" class="space-y-4">
          <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h5 class="font-semibold text-yellow-800 mb-3">动爻分析</h5>
            <p class="text-gray-700 mb-3">共有 {{ result.changingLines.length }} 个爻发生变化，这预示着事情的关键转折点。</p>
            <ul class="space-y-3">
              <li v-for="(lineIndex, idx) in result.changingLines" :key="idx" class="p-3 bg-white rounded-lg border border-yellow-200">
                <div class="flex items-start space-x-3">
                  <span class="inline-flex items-center justify-center w-6 h-6 bg-yellow-500 text-white text-xs font-bold rounded-full">{{ getYaoLabel(lineIndex) }}</span>
                  <div class="flex-1">
                    <p class="font-medium text-gray-800 mb-1">{{ getYaoLabel(lineIndex) }}爻变化</p>
                    <p v-if="(result.hexagram as any).yao_texts && (result.hexagram as any).yao_texts[lineIndex]" class="text-sm text-gray-600 mb-2">
                      原文：{{ (result.hexagram as any).yao_texts[lineIndex] }}
                    </p>
                    <p v-if="result.relatedHexagram && (result.relatedHexagram as any).yao_texts && (result.relatedHexagram as any).yao_texts[lineIndex]" class="text-sm text-gray-600">
                      变爻：{{ (result.relatedHexagram as any).yao_texts[lineIndex] }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex justify-center items-center space-x-4">
        <div class="flex items-center space-x-2">
          <SaveButton
            v-if="result"
            :item="{
              type: 'divination',
              question: result?.question || '',
              result: result
            }"
            :title="`易经占卜 - ${result?.hexagram?.chineseName || result?.hexagram?.name || '未知卦象'}`"
          />
          <span class="text-sm text-gray-600 ml-1">保存结果</span>
        </div>
      </div>

      <!-- 用户反馈系统 -->
        <div class="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-lg border border-indigo-200 animate-reveal">
          <div class="text-center mb-4">
            <h4 class="text-lg font-semibold text-gray-800 mb-2">这个解读对你有帮助吗？</h4>
            <p class="text-sm text-gray-600">你的反馈帮助我们不断优化解读质量</p>
          </div>

          <div class="flex flex-wrap justify-center gap-3">
          <button 
            @click="submitFeedback('helpful')"
            class="px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>👍</span>
            <span>很有启发</span>
          </button>
          
          <button 
            @click="submitFeedback('confused')"
            class="px-4 py-2 bg-yellow-100 text-yellow-700 font-medium rounded-lg hover:bg-yellow-200 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>🤔</span>
            <span>有点困惑</span>
          </button>
          
          <button 
            @click="submitFeedback('accurate')"
            class="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-2"
          >
            <span>🎯</span>
            <span>很贴切</span>
          </button>
        </div>
        
        <div v-if="feedbackSubmitted" class="mt-4 text-center">
          <p class="text-green-600 font-medium">感谢你的反馈！我们会继续努力提升解读质量。</p>
        </div>
      </div>


      <!-- Dilemma (玄选两难) 特定分析 -->
      <div v-if="result.method === 'dilemma' && result.optionA && result.optionB" 
           class="dilemma-analysis mt-8 p-6 border-t border-gray-200 animate-reveal" style="animation-delay: 0.4s;">
        <h4 class="text-2xl font-semibold text-primary mb-4 text-center vintage-text">玄选两难分析</h4>
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div class="option-card bg-secondary/10 p-4 rounded-lg shadow">
            <h5 class="font-bold text-secondary text-lg mb-2">选项A: {{ result.optionA }}</h5>
            <p class="text-sm text-gray-700 mb-1">匹配度: <span class="font-semibold">{{ result.optionA_score }}%</span></p>
            <p v-if="result.optionA_analysis" class="text-xs text-gray-600">{{ result.optionA_analysis }}</p>
          </div>
          <div class="option-card bg-accent/10 p-4 rounded-lg shadow">
            <h5 class="font-bold text-accent text-lg mb-2">选项B: {{ result.optionB }}</h5>
            <p class="text-sm text-gray-700 mb-1">匹配度: <span class="font-semibold">{{ result.optionB_score }}%</span></p>
            <p v-if="result.optionB_analysis" class="text-xs text-gray-600">{{ result.optionB_analysis }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

  <script setup lang="ts">
import { defineProps, computed, ref, onMounted, watch } from 'vue';
import type { AnalysisResult } from '../types';
import HexagramDisplay from '../../../components/hexagram/HexagramDisplay.vue';
import {
  generatePersonalizedAdvice,
  getHexagramAttributes,
  calculateHexagramMatch
} from '../utils/hexagramAttributes';
import { LLMService } from '../../../services/LLMService';
import { formatContent as formatContentScheme1 } from '../../../utils/contentFormatter';
import SaveButton from '../../../components/common/SaveButton.vue';

const _props = defineProps<{
  result: AnalysisResult | null;
}>();

// 为了在模板中方便使用，创建一个计算属性
const result = computed(() => {
  console.log('🔍 DivinationResult - result computed:', _props.result);
  return _props.result;
});

// 标签页状态管理
const activeTab = ref('changing'); // 默认显示变卦分析，因为这是用户最关心的

// 行动指南状态
const actionGuide = ref<{
  advice: string;
  action: string;
} | null>(null);

// 用户反馈状态
const feedbackSubmitted = ref(false);

// 开发模式标识
const isDevelopment = ref(process.env.NODE_ENV === 'development');

// 卦象变化动画状态
const animationState = ref<'idle' | 'highlighting' | 'flipping' | 'complete'>('idle');
const currentAnimationStep = ref(0);

// LLM distilled core conclusion
const distilled = ref<{ summary: string; confidence: number; actions: string[]; evidence: string[] } | null>(null);
watch(
  () => _props.result?.analysis,
  async (val) => {
    try {
      if (!val) { distilled.value = null; return; }
      const text = typeof val === 'string' ? val : (() => { try { return JSON.stringify(val); } catch { return '' } })();
      if (!text) { distilled.value = null; return; }
      const res = await LLMService.distillCoreConclusion(text);
      distilled.value = res && res.summary ? res : null;
    } catch {
      distilled.value = null;
    }
  },
  { immediate: true }
);


// 智能连接算法：生成个性化开场白和核心结论
const personalizedInsight = computed(() => {
  console.log('🔍 personalizedInsight computed 被调用');
  console.log('🔍 _props.result:', _props.result);
  console.log('🔍 _props.result?.question:', _props.result?.question);
  console.log('🔍 _props.result?.hexagram:', _props.result?.hexagram);
  
  if (!_props.result?.question || !_props.result?.hexagram) {
    console.log('❌ personalizedInsight 返回 null，因为缺少 question 或 hexagram');
    return null;
  }
  
  const question = _props.result.question;
  const hexagram = _props.result.hexagram;
  
  console.log('🔍 question:', question);
  console.log('🔍 hexagram:', hexagram);
  
  try {
    // 问题类型识别
    const questionType = identifyQuestionType(question);
    console.log('🔍 questionType:', questionType);
    
    // 生成个性化解读
    const result = generatePersonalizedInsight(question, hexagram, questionType);
    console.log('🔍 generatePersonalizedInsight 结果:', result);
    return result;
  } catch (error) {
    console.error('❌ personalizedInsight 计算过程中出错:', error);
    // 返回安全的默认值
    const hexagramName = hexagram.chineseName || hexagram.name;
    return {
      opening: `从"${hexagramName}"这个卦象来看，关于你的"${question}"，建议保持开放和谨慎的态度。`,
      coreConclusion: `基于"${hexagramName}"的智慧，建议你保持平衡，既要有进取心，也要有耐心。`,
      confidenceLevel: 50,
      actionItems: ['保持开放心态', '谨慎决策', '寻求指导'],
      hexagramAttributes: null
    };
  }
});

// 问题类型识别 - 增强版，支持更多场景
function identifyQuestionType(question: string): string[] {
  const types = [];
  
  // 事业相关
  if (question.includes('跳槽') || question.includes('工作') || question.includes('事业') || 
      question.includes('升职') || question.includes('创业') || question.includes('投资') ||
      question.includes('合作') || question.includes('项目')) {
    types.push('事业');
  }
  
  // 感情相关
  if (question.includes('感情') || question.includes('表白') || question.includes('分手') || 
      question.includes('恋爱') || question.includes('婚姻') || question.includes('复合') ||
      question.includes('相亲') || question.includes('异地')) {
    types.push('感情');
  }
  
  // 健康相关
  if (question.includes('健康') || question.includes('身体') || question.includes('生病') ||
      question.includes('治疗') || question.includes('运动') || question.includes('饮食')) {
    types.push('健康');
  }
  
  // 决策辅助
  if (question.includes('该不该') || question.includes('要不要') || question.includes('选择') ||
      question.includes('决定') || question.includes('犹豫') || question.includes('纠结')) {
    types.push('决策辅助');
  }
  
  // 吉凶预测
  if (question.includes('顺利') || question.includes('成功') || question.includes('失败') ||
      question.includes('运气') || question.includes('时机') || question.includes('风险')) {
    types.push('吉凶预测');
  }
  
  // 学习成长
  if (question.includes('学习') || question.includes('考试') || question.includes('培训') ||
      question.includes('技能') || question.includes('成长') || question.includes('进步')) {
    types.push('学习成长');
  }
  
  // 人际关系
  if (question.includes('朋友') || question.includes('同事') || question.includes('家人') ||
      question.includes('社交') || question.includes('沟通') || question.includes('冲突')) {
    types.push('人际关系');
  }
  
  return types.length > 0 ? types : ['一般咨询'];
}

// 生成个性化解读 - 使用新的卦象属性系统
function generatePersonalizedInsight(question: string, hexagram: any, questionTypes: string[]): {
  opening: string;
  coreConclusion: string;
  confidenceLevel: number;
  actionItems: string[];
  hexagramAttributes: any;
} {
  try {
    const hexagramName = hexagram.chineseName || hexagram.name;
    
    // 使用新的卦象属性系统生成个性化建议
    const personalizedAdvice = generatePersonalizedAdvice(hexagramName, questionTypes, question);
    const hexagramAttributes = getHexagramAttributes(hexagramName);
    
    // 安全检查：确保personalizedAdvice有正确的结构
    if (!personalizedAdvice || typeof personalizedAdvice !== 'object') {
      console.error('generatePersonalizedAdvice返回无效数据:', personalizedAdvice);
      // 返回默认值
      return {
        opening: `从"${hexagramName}"这个卦象来看，关于你的"${question}"，建议保持开放和谨慎的态度。`,
        coreConclusion: `基于"${hexagramName}"的智慧，建议你保持平衡，既要有进取心，也要有耐心。`,
        confidenceLevel: 50,
        actionItems: ['保持开放心态', '谨慎决策', '寻求指导'],
        hexagramAttributes: hexagramAttributes || null
      };
    }
    
    // 生成开场白
    const opening = `从"${hexagramName}"这个卦象来看，关于你的"${question}"，`;
    
    // 生成独立的核心结论 - 不再简单重复建议内容
    const coreConclusion = generateCoreConclusion(hexagramName, questionTypes, personalizedAdvice);
    
    // 计算信心指数
    const confidenceLevel = Math.round((personalizedAdvice.confidence || 0.5) * 100);
    
    return {
      opening: opening + (personalizedAdvice.advice || '建议保持开放和谨慎的态度。'),
      coreConclusion,
      confidenceLevel,
      actionItems: personalizedAdvice.actionItems || ['保持开放心态', '谨慎决策', '寻求指导'],
      hexagramAttributes
    };
  } catch (error) {
    console.error('生成个性化解读时出错:', error);
    // 返回安全的默认值
    const hexagramName = hexagram?.chineseName || hexagram?.name || '卦象';
    return {
      opening: `从"${hexagramName}"这个卦象来看，关于你的"${question}"，建议保持开放和谨慎的态度。`,
      coreConclusion: `基于"${hexagramName}"的智慧，建议你保持平衡，既要有进取心，也要有耐心。`,
      confidenceLevel: 50,
      actionItems: ['保持开放心态', '谨慎决策', '寻求指导'],
      hexagramAttributes: null
    };
  }
}

  // 新增：生成独立的核心结论函数 - 基于传统逻辑分析
  function generateCoreConclusion(hexagramName: string, questionTypes: string[], personalizedAdvice: any): string {
    try {
      // 优先使用传统逻辑分析生成核心结论
      const traditionalAnalysis = _props.result?.traditionalAnalysis;
      console.log('🔍 generateCoreConclusion - traditionalAnalysis:', traditionalAnalysis);
      
      if (traditionalAnalysis && traditionalAnalysis.bodyUsage) {
        console.log('✅ 使用传统逻辑分析生成核心结论');
        const bodyUsage = traditionalAnalysis.bodyUsage;
        const hexagram = _props.result?.hexagram;
        const judgment = hexagram?.judgment || hexagram?.description || '';
        const changingLines = _props.result?.changingLines || [];
        const relatedHexagram = _props.result?.relatedHexagram;
        
        // 基于体用关系生成核心结论
        // 原则：重体用生克（本质），轻卦辞爻辞（参考）
        // 体用生克是核心结论，卦辞作为补充说明或专家提示
        
        let conclusion = '';
        
        // 第一步：确立核心分析框架（体用生克）
        // 体用关系解读 - 这是核心，不受卦辞影响
        const relationshipText = 
          bodyUsage.relationship === 'body-ke-usage' ? '体克用，您能够主动控制局面，有利于主动出击'
          : bodyUsage.relationship === 'usage-ke-body' ? '用克体，外部环境对您有一定压力，宜守不宜攻'
          : bodyUsage.relationship === 'body-sheng-usage' ? '体生用，需要付出较多，需要谨慎管理资源'
          : bodyUsage.relationship === 'usage-sheng-body' ? '用生体，外部环境对您有利，能够得到帮助和支持'
          : '体用比和，内外和谐统一，形势稳定';
        
        console.log('📊 体用关系（核心）:', bodyUsage.relationship, '->', relationshipText);
        
        // 第二步：参考卦辞爻辞（辅助与深化）
        // 检测卦辞的吉凶倾向，用于验证、强化或提供警示
        const positiveKeywords = ['元亨', '利', '吉', '贞', '亨', '无咎', '可', '宜'];
        const negativeKeywords = ['征凶', '无攸利', '不利', '凶', '勿用', '不可', '不宜', '咎'];
        const hasPositiveSign = positiveKeywords.some(keyword => judgment.includes(keyword));
        const hasNegativeWarning = negativeKeywords.some(keyword => judgment.includes(keyword));
        
        // 生成卦辞补充说明
        const judgmentCore = judgment.length > 50 ? judgment.substring(0, 50) + '...' : judgment;
        let judgmentSupplement = '';
        
        if (judgmentCore) {
          // 判断体用关系与卦辞是否一致
          const bodyUsageIsPositive = bodyUsage.relationship === 'body-ke-usage' || 
                                       bodyUsage.relationship === 'usage-sheng-body' || 
                                       bodyUsage.relationship === 'bihe';
          
          if (bodyUsageIsPositive && hasPositiveSign) {
            // 一致：体用吉，卦辞也吉，可以强化
            judgmentSupplement = `卦辞云"${judgmentCore}"，可作印证，内外皆吉。`;
          } else if (!bodyUsageIsPositive && hasNegativeWarning) {
            // 一致：体用不吉，卦辞也不吉，可以强化
            judgmentSupplement = `卦辞云"${judgmentCore}"，正应此象，需谨慎应对。`;
          } else if (bodyUsageIsPositive && hasNegativeWarning) {
            // 不一致：体用吉但卦辞不吉，卦辞作为过程警示
            judgmentSupplement = `然卦辞云"${judgmentCore}"，提示需防微杜渐，注意过程中的心态与细节。`;
          } else if (!bodyUsageIsPositive && hasPositiveSign) {
            // 不一致：体用不吉但卦辞吉，卦辞作为背景参考
            judgmentSupplement = `卦辞云"${judgmentCore}"，可为参考，但需以体用生克为主。`;
          } else {
            // 中立或无法判断
            judgmentSupplement = `卦辞云"${judgmentCore}"，可作参考。`;
          }
        }
        
        console.log('📊 卦辞检测:', { hasPositiveSign, hasNegativeWarning, judgmentSupplement });
        
        // 如果有动爻，结合动爻分析
        if (changingLines.length > 0 && traditionalAnalysis.changingLinesAnalysis) {
          const changingAnalysis = traditionalAnalysis.changingLinesAnalysis;
          const highImportanceChanges = changingAnalysis.filter((ch: any) => ch.importance === 'high');
          
          if (highImportanceChanges.length > 0) {
            const mainChange = highImportanceChanges[0];
            conclusion = `"${hexagramName}"卦显示：${relationshipText}。${mainChange.position + 1}爻（${mainChange.relative}）变动为关键，${mainChange.interpretation}`;
            if (judgmentSupplement) {
              conclusion += ` ${judgmentSupplement}`;
            }
            console.log('📝 核心结论（带动爻）:', conclusion);
          } else {
            const changeText = changingLines.map((pos: number) => `${pos + 1}爻`).join('、');
            conclusion = `"${hexagramName}"卦显示：${relationshipText}。${changeText}发生变动，局势正在变化中。`;
            if (judgmentSupplement) {
              conclusion += ` ${judgmentSupplement}`;
            }
            console.log('📝 核心结论（有动爻）:', conclusion);
          }
        } else if (changingLines.length === 0) {
          // 静卦
          conclusion = `"${hexagramName}"卦为静卦（无动爻），${relationshipText}。`;
          if (judgmentSupplement) {
            conclusion += ` ${judgmentSupplement}`;
          }
          console.log('📝 核心结论（静卦）:', conclusion);
        } else {
          // 有动爻但无详细分析
          const changeText = changingLines.map((pos: number) => `${pos + 1}爻`).join('、');
          conclusion = `"${hexagramName}"卦显示：${relationshipText}。${changeText}发生变动，需关注事态发展。`;
          if (judgmentSupplement) {
            conclusion += ` ${judgmentSupplement}`;
          }
          console.log('📝 核心结论（有动爻但无分析）:', conclusion);
        }
        
        // 如果有变卦，补充变卦信息
        if (relatedHexagram) {
          conclusion += ` 将变至"${relatedHexagram.chineseName || relatedHexagram.name}"卦。`;
        }
        
        return conclusion;
      } else {
        console.log('⚠️ 未找到传统逻辑分析，使用降级方案');
      }
      
      // 如果没有传统逻辑分析，使用原有逻辑（降级方案）
      const hexagram = _props.result?.hexagram;
      const changingLines = _props.result?.changingLines || [];
      const relatedHexagram = _props.result?.relatedHexagram;

      if (!hexagram) {
        return `"${hexagramName}"卦提示需要综合判断当前形势，谨慎决策。`;
      }

      // 基于卦辞和变卦进行推演
      const judgment = hexagram.judgment || hexagram.description || '';
      const relatedName = relatedHexagram?.chineseName || relatedHexagram?.name;
      const labels = ['初', '二', '三', '四', '五', '上'];

      // 如果有变卦，说明有动爻，需要综合分析本卦和变卦
      if (changingLines.length > 0 && relatedName) {
        const changingLinesText = changingLines.map(line => `${labels[line]}爻`).join('、');
        const judgmentCore = judgment.length > 40 ? judgment.substring(0, 40) + '...' : judgment;

        if (judgmentCore) {
          return `"${hexagramName}"卦显示：${judgmentCore}。动爻在${changingLinesText}，预示将变至"${relatedName}"卦，局势将发生转变。`;
        } else {
          return `"${hexagramName}"卦中${changingLinesText}发生变动，预示将变至"${relatedName}"卦，局势将发生转变。`;
        }
      } else if (changingLines.length === 0) {
        // 静卦：没有动爻，直接看本卦
        const judgmentCore = judgment.length > 50 ? judgment.substring(0, 50) + '...' : judgment;
        if (judgmentCore) {
          return `"${hexagramName}"卦为静卦（无动爻），卦辞云："${judgmentCore}"。`;
        } else {
          return `"${hexagramName}"卦为静卦，无动爻变化，当前态势保持稳定。`;
        }
      } else {
        // 有动爻但无变卦数据
        const changingLinesText = changingLines.map(line => `${labels[line]}爻`).join('、');
        const judgmentCore = judgment.length > 40 ? judgment.substring(0, 40) + '...' : judgment;
        if (judgmentCore) {
          return `"${hexagramName}"卦显示：${judgmentCore}。${changingLinesText}发生变动，需关注事态发展。`;
        } else {
          return `"${hexagramName}"卦中${changingLinesText}发生变动，局势正在变化中。`;
        }
      }
    } catch (error) {
      console.error('生成核心结论时出错:', error);
      return `基于"${hexagramName}"卦的智慧，建议您采取积极行动，把握当前机会。`;
    }
  }

// 生成行动指南 - 使用卦象属性系统
function generateActionGuide() {
  try {
    if (!_props.result?.hexagram) {
      console.warn('generateActionGuide: 没有卦象数据');
      return;
    }
    
    const hexagram = _props.result.hexagram;
    const hexagramName = hexagram.chineseName || hexagram.name;
    const question = _props.result.question || '';
    
    // 基于问题和卦象生成具体的行动建议
    if (question.includes('公务员') || question.includes('遴选') || question.includes('考试')) {
      actionGuide.value = {
        advice: `针对您的公务员遴选问题，"${hexagramName}"卦建议您系统性地准备考试。建议您制定详细的备考计划，包括行政职业能力测试、申论写作等各个科目的学习安排。同时，建议您多做一些模拟题，熟悉考试题型和答题技巧。`,
        action: `具体行动：1）制定3个月备考计划，每天固定学习时间；2）重点攻克薄弱环节，如行测中的数量关系、申论中的材料分析；3）参加模拟考试，熟悉考试节奏；4）关注时事政策，为申论写作积累素材。`
      };
    } else if (question.includes('工作') || question.includes('跳槽')) {
      actionGuide.value = {
        advice: `针对您的职场问题，"${hexagramName}"卦建议您综合分析当前情况。建议您评估当前工作的优劣势，包括薪资待遇、发展前景、工作环境等因素。同时，建议您明确自己的职业目标和期望，以便做出最适合的决定。`,
        action: `具体行动：1）制作一份优劣势对比表，客观评估当前工作；2）了解目标职位的具体要求和发展空间；3）与行业内的朋友或前辈交流，获取真实信息；4）做出决策后，制定详细的过渡计划。`
      };
    } else if (question.includes('感情') || question.includes('恋爱')) {
      actionGuide.value = {
        advice: `针对您的感情问题，"${hexagramName}"卦建议您真诚沟通。建议您主动表达自己的想法和感受，同时也要倾听对方的意见。建议您多做一些能增进感情的事情，如共同参加活动、真诚交流想法等。`,
        action: `具体行动：1）安排一次坦诚的对话，表达自己的想法；2）做一些能增进感情的活动，如约会、送礼物；3）如果面临困难，考虑寻求朋友的帮助或专业的建议；4）保持耐心，给关系发展的时间。`
      };
    } else {
      // 通用建议
      actionGuide.value = {
        advice: `基于"${hexagramName}"卦的智慧，建议您保持积极主动的态度。`,
        action: `具体行动：1）明确您的目标和期望；2）制定详细的计划；3）积极采取行动；4）保持信心和耐心。`
      };
    }
  } catch (error) {
    console.error('生成行动指南时出错:', error);
    // 返回安全的默认指南
    const hexagramName = _props.result?.hexagram?.chineseName || _props.result?.hexagram?.name || '卦象';
    actionGuide.value = {
      advice: `基于"${hexagramName}"的智慧，今天适合保持开放和谨慎的态度。`,
      action: "保持平衡，既要有进取心，也要有耐心。"
    };
  }
}

// 基于卦象属性生成具体行动
function generateActionBasedOnAttributes(attributes: any): string {
  if (attributes.action === '主动') {
    return '主动出击，把握机会，展现你的能力和魅力。';
  } else if (attributes.action === '顺从') {
    return '顺应时势，保持耐心，等待合适的时机。';
  } else if (attributes.action === '合作') {
    return '加强团队合作，寻求他人的支持和帮助。';
  } else if (attributes.action === '稳定') {
    return '稳扎稳打，循序渐进地推进目标。';
  } else {
    return '保持平衡，既要有进取心，也要有耐心。';
  }
}

// 基于时机生成行动建议
function generateTimingBasedAction(attributes: any): string {
  if (attributes.timing === '适合行动') {
    return '果断行动，把握当前的良好时机。';
  } else if (attributes.timing === '适合等待') {
    return '耐心等待，做好充分的准备。';
  } else if (attributes.timing === '适合合作') {
    return '寻求合作，与他人共同推进。';
  } else {
    return '谨慎决策，平衡各种因素。';
  }
}

// 基于适宜场景生成行动建议
function generateSuitableAction(attributes: any): string {
  if (attributes.suitableFor && attributes.suitableFor.length > 0) {
    const suitableAreas = attributes.suitableFor.slice(0, 2).join('、');
    return `在${suitableAreas}方面投入时间和精力，发挥你的优势。`;
  }
  return '在当前擅长的领域继续深耕，保持专注和耐心。';
}

// 保存行动指南
function saveActionGuide() {
  if (!actionGuide.value) return;
  
  // 这里可以添加保存到本地存储的逻辑
  localStorage.setItem('savedActionGuide', JSON.stringify({
    ...actionGuide.value,
    timestamp: new Date().toISOString(),
    hexagram: _props.result?.hexagram?.name
  }));
  
  // 显示保存成功提示
  alert('行动指南已保存！');
}

// 提交用户反馈
function submitFeedback(type: 'helpful' | 'confused' | 'accurate') {
  if (feedbackSubmitted.value) return;
  
  const feedbackData = {
    type,
    question: _props.result?.question || '',
    hexagram: _props.result?.hexagram?.name || '',
    timestamp: new Date().toISOString(),
    personalizedInsight: personalizedInsight.value,
    questionTypes: _props.result?.question ? identifyQuestionType(_props.result.question) : []
  };
  
  // 保存反馈到本地存储
  const existingFeedback = localStorage.getItem('divinationFeedback');
  let feedbackHistory = [];
  
  if (existingFeedback) {
    try {
      feedbackHistory = JSON.parse(existingFeedback);
      if (!Array.isArray(feedbackHistory)) {
        feedbackHistory = [feedbackHistory];
      }
    } catch (e) {
      feedbackHistory = [];
    }
  }
  
  feedbackHistory.push(feedbackData);
  
  // 只保留最近50条反馈
  if (feedbackHistory.length > 50) {
    feedbackHistory = feedbackHistory.slice(-50);
  }
  
  localStorage.setItem('divinationFeedback', JSON.stringify(feedbackHistory));
  feedbackSubmitted.value = true;
  
  // 分析反馈数据，优化算法
  analyzeFeedbackAndOptimize(feedbackData);
  
  // 开发模式下的反馈记录
  if (isDevelopment.value) {
    console.log(`用户反馈: ${type}`, feedbackData);
  }
}

// 反馈数据分析与算法优化
function analyzeFeedbackAndOptimize(feedbackData: any) {
  try {
    const allFeedback = localStorage.getItem('divinationFeedback');
    if (!allFeedback) return;
    
    const feedbackHistory = JSON.parse(allFeedback);
    if (!Array.isArray(feedbackHistory)) return;
    
    // 分析反馈类型分布
    const feedbackStats: Record<string, number> = {
      helpful: 0,
      confused: 0,
      accurate: 0,
      total: feedbackHistory.length
    };
    
    feedbackHistory.forEach((feedback: any) => {
      if (feedback.type in feedbackStats) {
        feedbackStats[feedback.type as keyof typeof feedbackStats]++;
      }
    });
    
    // 分析问题类型与卦象的匹配效果
    const questionTypeEffectiveness = analyzeQuestionTypeEffectiveness(feedbackHistory);
    
    // 保存分析结果
    localStorage.setItem('feedbackAnalysis', JSON.stringify({
      stats: feedbackStats,
      questionTypeEffectiveness,
      lastUpdated: new Date().toISOString()
    }));
    
    // 开发模式下显示分析结果
    if (isDevelopment.value) {
      console.log('反馈分析结果:', { stats: feedbackStats, questionTypeEffectiveness });
    }
    
  } catch (error) {
    console.error('反馈分析失败:', error);
  }
}

// 分析问题类型与卦象的匹配效果
function analyzeQuestionTypeEffectiveness(feedbackHistory: any[]) {
  const effectiveness: Record<string, { total: number; helpful: number; confused: number; accurate: number }> = {};
  
  feedbackHistory.forEach((feedback: any) => {
    if (feedback.questionTypes && feedback.hexagram) {
      feedback.questionTypes.forEach((questionType: string) => {
        if (!effectiveness[questionType]) {
          effectiveness[questionType] = {
            total: 0,
            helpful: 0,
            confused: 0,
            accurate: 0
          };
        }
        
        effectiveness[questionType].total++;
        if (feedback.type in effectiveness[questionType]) {
          effectiveness[questionType][feedback.type as keyof typeof effectiveness[typeof questionType]]++;
        }
      });
    }
  });
  
  return effectiveness;
}

// 卦象变化动画控制
function startHexagramAnimation() {
  if (!_props.result?.changingLines || _props.result.changingLines.length === 0) return;
  
  // 重置动画状态
  animationState.value = 'highlighting';
  currentAnimationStep.value = 0;
  
  // 第一步：高亮动爻 (2秒)
  setTimeout(() => {
    currentAnimationStep.value = 1;
    animationState.value = 'flipping';
    
    // 第二步：卦象翻转 (1.5秒)
    setTimeout(() => {
      currentAnimationStep.value = 2;
      animationState.value = 'complete';
      
      // 动画完成后的清理 (2秒后重置)
      setTimeout(() => {
        animationState.value = 'idle';
        currentAnimationStep.value = 0;
      }, 2000);
    }, 1500);
  }, 2000);
}

// 获取动画类名
function getAnimationClass() {
  switch (animationState.value) {
    case 'highlighting':
      return 'changing-line-highlight';
    case 'flipping':
      return 'hexagram-flip';
    case 'complete':
      return 'hexagram-transition';
    default:
      return '';
  }
}

// 获取动爻动画类名
function getChangingLineClass(lineIndex: number): string {
  if (animationState.value === 'highlighting' && 
      _props.result?.changingLines?.includes(lineIndex)) {
    return 'highlight';
  }
  return '';
}

// 页面内导航函数
function scrollToSection(section: string) {
  const sections = {
    core: '.personalized-insight',
    interpretation: '.interpretation-section',
    hexagram: '.hexagram-section',
    action: '.action-section'
  };
  
  const targetElement = document.querySelector(sections[section as keyof typeof sections]);
  if (targetElement) {
    targetElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}




function getYaoLabel(idx: number): string {
  const labels = ['初爻', '二爻', '三爻', '四爻', '上爻'];
  return labels[idx] || `${idx + 1}爻`;
}

// 组件挂载
onMounted(() => {
  // 组件初始化逻辑（如需要）
});

  // 格式化解读文本，添加HTML标签使其更易读（使用方案一：高亮标签 + 引用框）    
  function formatAnalysisText(text: string): string {
    if (!text) return '';

    try {
      // 先清理格式标记
      let cleaned = text;

      // 移除带引号的CSS类标记
      cleaned = cleaned.replace(/"([^"]*text-[^"]*|[^"]*block[^"]*|[^"]*pl-\d+[^"]*)"/g, '""');

      // 移除CSS类标记，如[text-primary text-lg block mt-4 mb-2]
      cleaned = cleaned.replace(/\[[^\]]+\]/g, '');

      // 移除英文括号及其内容
      cleaned = cleaned.replace(/\s*\([^)]*\)/g, '');

      // 使用方案一的格式化工具进行关键词句突出
      let formatted = formatContentScheme1(cleaned);

      // 如果格式化后没有段落标签，添加段落标签
      if (!formatted.includes('<p>') && !formatted.includes('<div class="interpretation-section-title">')) {
        // 将换行符转换为段落
        formatted = formatted
          .replace(/\n\n+/g, '</p><p>')
          .replace(/\n([^\n])/g, '<br>$1');

        if (!formatted.startsWith('<p>') && !formatted.startsWith('<div')) {
          formatted = '<p>' + formatted;
        }
        if (!formatted.endsWith('</p>') && !formatted.endsWith('</div>')) {
          formatted = formatted + '</p>';
        }
      }

      // 在每个部分（本卦分析、动爻推演、变卦趋势、综合结论）的最后一句加粗
      formatted = formatLastSentenceBold(formatted);

      return formatted;
    } catch (error) {
      console.error('格式化文本时出错:', error);
      // 发生错误时返回原始文本，但确保包含在段落标签中
      return `<p>${text.replace(/\n/g, '<br>')}</p>`;
    }
  }

  // 在每个部分的最后一句加粗
  function formatLastSentenceBold(html: string): string {
    // 识别各个部分的标题
    const sectionTitles = ['本卦分析', '动爻推演', '变卦趋势', '综合结论'];
    
    // 按部分分割内容
    let result = html;
    
    sectionTitles.forEach(title => {
      // 查找标题位置
      const titleRegex = new RegExp(`(${title}[^<]*</[^>]+>)`, 'gi');
      const matches = [...result.matchAll(titleRegex)];
      
      if (matches.length > 0) {
        // 从后往前处理每个匹配
        for (let i = matches.length - 1; i >= 0; i--) {
          const match = matches[i];
          const titleEnd = match.index! + match[0].length;
          
          // 查找下一个标题或文档结尾
          let sectionEnd = result.length;
          for (let j = i + 1; j < matches.length; j++) {
            if (matches[j].index! > titleEnd) {
              sectionEnd = matches[j].index!;
              break;
            }
          }
          
          // 提取该部分的内容
          const sectionContent = result.substring(titleEnd, sectionEnd);
          
          // 查找该部分中最后一个段落或最后一个句子
          // 先尝试找最后一个</p>标签
          const lastPIndex = sectionContent.lastIndexOf('</p>');
          if (lastPIndex !== -1) {
            // 找到最后一个段落
            const lastPStart = sectionContent.lastIndexOf('<p>', lastPIndex);
            if (lastPStart !== -1) {
              const paragraph = sectionContent.substring(lastPStart, lastPIndex + 4);
              // 提取段落中的文本（去除HTML标签）
              const textContent = paragraph.replace(/<[^>]+>/g, '');
              
              // 找到最后一个句子（以。！？结尾）
              const lastSentenceMatch = textContent.match(/[^。！？]*[。！？][^。！？]*$/);
              if (lastSentenceMatch) {
                const lastSentence = lastSentenceMatch[0].trim();
                if (lastSentence.length > 0) {
                  // 在段落中加粗最后一句
                  const boldedParagraph = paragraph.replace(
                    new RegExp(lastSentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                    `<strong style="font-weight: bold; font-size: 1.1em;">${lastSentence}</strong>`
                  );
                  result = result.substring(0, titleEnd + lastPStart) + 
                          boldedParagraph + 
                          result.substring(titleEnd + lastPIndex + 4);
                }
              }
            }
          }
        }
      }
    });
    
    return result;
  }

/**
 * 清理文本中的格式标记和英文内容
 * @param text 输入文本
 * @returns 清理后的文本
 */
function cleanFormatMarkers(text: string): string {
  if (!text) return '';
  
  let cleaned = text;
  
  // 移除带引号的CSS类标记
  cleaned = cleaned.replace(/"([^"]*text-[^"]*|[^"]*block[^"]*|[^"]*pl-\d+[^"]*)"/g, '""');
  
  // 移除CSS类标记，如[text-primary text-lg block mt-4 mb-2]
  cleaned = cleaned.replace(/\[[^\]]+\]/g, '');
  
  // 移除英文括号及其内容
  cleaned = cleaned.replace(/\s*\([^)]*\)/g, '');
  
  return cleaned;
}
</script>

<style scoped>
.highlight {
  /* 已通过Tailwind类实现高亮 */
}

.vintage-text {
  font-family: 'Kaiti', 'STKaiti', serif; 
}

/* 卦象信息样式 */
:deep(p) {
  margin-bottom: 0.75rem;
}

:deep(.text-primary) {
  color: var(--primary, #4C7EF3);
}

:deep(.text-primary-dark) {
  color: var(--primary-dark, #3060D0);
}

:deep(.text-accent) {
  color: var(--accent, #D0642A);
}

/* 添加一些动画类 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }

@keyframes slideInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slideInDown { animation: slideInDown 0.5s ease-out forwards; }

@keyframes reveal {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-reveal { animation: reveal 0.5s ease-out forwards; }

/* 标签页样式优化 */
.tab-content {
  min-height: 200px;
}

/* 强制卦象图居中对齐 */
.hexagram-center-align :deep(.hexagram-content) {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100%;
}

@media (min-width: 640px) {
  .hexagram-center-align :deep(.hexagram-content) {
    flex-direction: column !important;
    align-items: center !important;
  }
  
  .hexagram-center-align :deep(.hexagram-ink-container) {
    flex: none !important;
    width: 100% !important;
    max-width: 300px !important;
  }
  
  .hexagram-center-align :deep(.hexagram-info) {
    flex: none !important;
    width: 100% !important;
  }
}

.hexagram-center-align :deep(.hexagram-ink-container) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 0 auto !important;
  width: 100% !important;
}

.hexagram-center-align :deep(.static-hexagram) {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 0 auto !important;
}

.hexagram-center-align :deep(.hexagram-image-wrapper) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 0 auto !important;
}

.hexagram-center-align :deep(.hexagram-lines-container) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100%;
}

.hexagram-center-align :deep(.hexagram-info) {
  text-align: center !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  width: 100%;
}

.hexagram-center-align :deep(.hexagram-name),
.hexagram-center-align :deep(.hexagram-meta) {
  text-align: center !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100%;
}

.hexagram-center-align :deep(.hexagram-meta) {
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center !important;
}

.hexagram-center-align :deep(.hexagram-meta .meta-item) {
  text-align: center !important;
}


/* 按钮悬停效果 */
button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 卡片悬停效果 */
.divination-result > div:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-out;
}

/* 进度条动画 */
.progress-bar {
  transition: width 1s ease-out;
}

/* 卦象变化动画 */
.hexagram-transition {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.changing-line-highlight {
  animation: changingLinePulse 2s ease-in-out infinite;
}

@keyframes changingLinePulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% { 
    opacity: 0.8; 
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
}

/* 动爻高亮状态样式增强 */
.changing-line.highlight {
  animation: changingLinePulse 2s ease-in-out infinite;
  filter: brightness(1.2) contrast(1.1);
  z-index: 10;
}

.hexagram-flip {
  animation: hexagramFlip 1.5s ease-in-out;
  transform-style: preserve-3d;
}

@keyframes hexagramFlip {
  0% { 
    transform: rotateY(0deg) scale(1); 
    opacity: 1;
  }
  50% { 
    transform: rotateY(90deg) scale(1.1); 
    opacity: 0.8;
  }
  100% { 
    transform: rotateY(0deg) scale(1); 
    opacity: 1;
  }
}

/* 卦象变化完成状态 */
.hexagram-transition {
  animation: transitionComplete 0.5s ease-out;
}

@keyframes transitionComplete {
  0% { 
    transform: scale(1.05); 
    opacity: 0.9;
  }
  100% { 
    transform: scale(1); 
    opacity: 1;
  }
}



/* 响应式设计优化 */
@media (max-width: 768px) {
  .flex.space-x-1 {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .flex.space-x-1 > button {
    width: 100%;
  }
  
  .hexagram-display {
    transform: scale(0.8);
  }
  
  /* 移动端卡片间距优化 */
  .divination-result > div {
    margin-bottom: 1rem;
  }
  
  /* 移动端字体大小优化 */
  .text-3xl {
    font-size: 1.5rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  /* 移动端按钮优化 */
  button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  /* 移动端标签页优化 */
  .tab-content {
    min-height: 150px;
  }
}

/* 平板端优化 */
@media (min-width: 769px) and (max-width: 1024px) {
  .divination-result > div {
    margin-bottom: 1.5rem;
  }

  .hexagram-display {
    transform: scale(0.9);
  }
}

/* 方案一：高亮标签 + 引用框样式 */

/* 章节标题样式 */
:deep(.interpretation-section-title) {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #fbbf24;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.05) 100%);
  padding: 12px 16px;
  margin: 24px 0 16px 0;
  border-left: 4px solid #fbbf24;
  border-radius: 8px;
}

:deep(.section-icon) {
  font-size: 1.5rem;
}

:deep(.section-text) {
  flex: 1;
}

/* 易经引用样式 */
:deep(.yijing-quote) {
  color: #a78bfa;
  font-style: italic;
  background: rgba(167, 139, 250, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  border-left: 3px solid #a78bfa;
  margin: 0 2px;
  display: inline-block;
}

/* 关键建议样式 */
:deep(.key-advice) {
  background: linear-gradient(120deg, rgba(251, 191, 36, 0.3) 0%, rgba(251, 191, 36, 0.1) 100%);
  color: #fde047;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  margin: 0 2px;
}

/* 结论高亮样式 */
:deep(.conclusion-highlight) {
  background: rgba(34, 197, 94, 0.15);
  border-left: 4px solid #22c55e;
  padding: 12px 16px;
  margin: 16px 0;
  border-radius: 8px;
  font-weight: 500;
  color: #86efac;
}

/* 时间徽章样式 */
:deep(.time-badge) {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9em;
  display: inline-block;
  margin: 0 2px;
}

</style>

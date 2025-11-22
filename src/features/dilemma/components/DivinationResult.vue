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

      <!-- 升级提示 -->
      <UpgradePrompt
        v-if="showUpgradePrompt"
        title="解锁AI深度分析"
        description="升级会员可享受AI个性化深度分析、历史卦象对比、专家解读库等高级功能"
        :features="[
          'AI个性化深度分析',
          '历史卦象对比',
          '专家解读库',
          '无限次使用'
        ]"
        required-tier="basic"
        @dismiss="showUpgradePrompt = false"
        class="mb-6"
      />

      <!-- 问题连接卡片 - 智能连接算法的核心展示 -->
      <div v-if="personalizedInsight" class="personalized-insight mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg border border-blue-100 animate-reveal">
        <div class="text-center mb-4">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-3">
            <span class="text-white text-xl">🔮</span>
          </div>
          <h4 class="text-xl font-semibold text-gray-800 mb-2">天玄智能解读</h4>
        </div>
        
        <!-- 核心结论 -->
        <div class="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">                                                          
          <h5 class="font-semibold text-green-800 mb-2">核心结论</h5>       
          <p class="text-gray-700">{{ personalizedInsight.coreConclusion }}</p>                                                                             
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

      <!-- P1.1: 三维解读轻量级入口 -->
      <div v-if="shouldShowTripleAnalysisEntry" class="triple-analysis-entry mt-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-lg border border-purple-200 animate-reveal">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">💫</span>
              <h4 class="text-lg font-semibold text-gray-800">想结合命盘看这个问题？</h4>
            </div>
            <p class="text-sm text-gray-600 mb-3">
              基于你的星盘特质，从紫微或塔罗视角提供更精准的解读
            </p>
            <div class="flex gap-2">
              <button
                @click="openTripleAnalysisSidebar"
                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <span>🌟</span>
                <span>紫微视角</span>
              </button>
              <button
                @click="openTripleAnalysisSidebar"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <span>✨</span>
                <span>塔罗视角</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 三维解读侧边栏 -->
    <TripleAnalysisSidebar
      :question="result?.question || ''"
      :hexagram-name="result?.hexagram?.chineseName || result?.hexagram?.name"
      :is-visible="showTripleAnalysisSidebar"
      @close="closeTripleAnalysisSidebar"
    />
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
import { useZiweiStore } from '../../ziwei/store/ziweiStore';
import { 
  shouldShowTripleAnalysisEntry as checkShouldShowEntry,
  matchQuestionToPalaces
} from '../../cross-system/utils/questionMatcher';
import TripleAnalysisSidebar from '../../cross-system/components/TripleAnalysisSidebar.vue';
import UpgradePrompt from '../../../components/membership/UpgradePrompt.vue';
import { useMembershipGuard } from '../../../composables/useMembershipGuard';

const _props = defineProps<{
  result: AnalysisResult | null;
}>();

// 会员权限守卫
const { currentTier, getFeatureUsage } = useMembershipGuard();
const showUpgradePrompt = ref(false);

// 检查是否需要显示升级提示
onMounted(async () => {
  if (currentTier.value === 'free') {
    const usage = await getFeatureUsage('yijing');
    // 如果使用次数接近限制，显示升级提示
    if (!usage.isUnlimited && usage.remaining <= 1) {
      showUpgradePrompt.value = true;
    }
  }
});

// 标签页状态管理
const activeTab = ref('changing'); // 默认显示变卦分析，因为这是用户最关心的  

// 用户反馈状态
const feedbackSubmitted = ref(false);

// P1.1: 三维解读侧边栏状态
const showTripleAnalysisSidebar = ref(false);
const ziweiStore = useZiweiStore();

// 从 localStorage 恢复命盘数据（如果存在）
onMounted(() => {
  try {
    const savedChartStr = localStorage.getItem('ziwei_current_chart');
    if (savedChartStr && !ziweiStore.currentChart) {
      const savedChart = JSON.parse(savedChartStr);
      ziweiStore.currentChart = savedChart;
      console.log('✅ 从 localStorage 恢复命盘数据');
    }
  } catch (error) {
    console.warn('⚠️ 恢复命盘数据失败:', error);
  }
});

// 检查是否应该显示三维解读入口
const shouldShowTripleAnalysisEntry = computed(() => {
  if (!_props.result?.question) {
    return false;
  }
  
  // 检查用户是否有命盘（包括从 localStorage 恢复的）
  let hasChart = !!ziweiStore.currentChart;
  
  // 如果 store 中没有，尝试从 localStorage 读取
  if (!hasChart) {
    try {
      const savedChartStr = localStorage.getItem('ziwei_current_chart');
      if (savedChartStr) {
        const savedChart = JSON.parse(savedChartStr);
        if (savedChart && savedChart.birthInfo) {
          hasChart = true;
          // 同时更新 store
          ziweiStore.currentChart = savedChart;
        }
      }
    } catch (error) {
      console.warn('⚠️ 读取命盘数据失败:', error);
    }
  }
  
  // 使用问题匹配工具判断
  const shouldShow = checkShouldShowEntry(_props.result.question, hasChart);
  
  // 开发模式下输出调试信息
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 三维解读入口显示检查:', {
      question: _props.result.question,
      hasChart,
      shouldShow,
      matchedPalaces: matchQuestionToPalaces(_props.result.question)
    });
  }
  
  return shouldShow;
});

// 打开三维解读侧边栏
const openTripleAnalysisSidebar = () => {
  showTripleAnalysisSidebar.value = true;
};

// 关闭三维解读侧边栏
const closeTripleAnalysisSidebar = () => {
  showTripleAnalysisSidebar.value = false;
};

// 开发模式标识
const isDevelopment = ref(process.env.NODE_ENV === 'development');

// 卦象变化动画状态
const animationState = ref<'idle' | 'highlighting' | 'flipping' | 'complete'>('idle');
const currentAnimationStep = ref(0);

// LLM distilled core conclusion - 通过LLM总结具体解读，结合传统体用关系生成核心结论
const distilled = ref<{ summary: string; confidence: number; actions: string[]; evidence: string[] } | null>(null);
watch(
  () => [_props.result?.analysis, _props.result?.traditionalAnalysis, _props.result?.hexagram],
  async ([analysisVal, traditionalAnalysisVal, hexagramVal]: [any, any, any]) => {
    try {
      if (!analysisVal) { 
        distilled.value = null; 
        return; 
      }
      const text = typeof analysisVal === 'string' 
        ? analysisVal 
        : (() => { 
            try { 
              return JSON.stringify(analysisVal); 
            } catch { 
              return ''; 
            } 
          })();
      if (!text) { 
        distilled.value = null; 
        return; 
      }
      
      // 获取卦名
      const hexagramName = hexagramVal && typeof hexagramVal === 'object' && 'chineseName' in hexagramVal
        ? (hexagramVal.chineseName || hexagramVal.name || '')
        : '';
      
      // 调用LLM总结具体解读，结合传统体用关系生成核心结论
      const res = await LLMService.distillCoreConclusion(
        text, 
        traditionalAnalysisVal, 
        hexagramName
      );
      distilled.value = res && res.summary ? res : null;
    } catch (error) {
      console.error('❌ 生成核心结论总结失败:', error);
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
    
    // 生成独立的核心结论 - 优先使用LLM总结的结果，结合传统体用关系
    // 如果distilled存在（通过LLM总结具体解读生成），优先使用它
    // 否则使用传统逻辑生成
    const coreConclusion = distilled.value?.summary 
      ? distilled.value.summary 
      : generateCoreConclusion(hexagramName, questionTypes, personalizedAdvice);
    
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
        // 体用关系解读 - 需要结合卦象本身的含义来判断
        // 某些卦象（如蹇、困、否等）本身代表困难、险阻，即使体克用也不宜主动出击
        
        // 判断卦象本身的含义（困难卦、险阻卦）
        const difficultHexagrams = ['蹇', '困', '否', '剥', '明夷', '坎', '艮'];
        const isDifficultHexagram = difficultHexagrams.some(name => hexagramName.includes(name));
        
        let relationshipText = '';
        if (bodyUsage.relationship === 'body-ke-usage') {
          // 体克用：如果能控制局面
          if (isDifficultHexagram) {
            // 困难卦：即使体克用，也不宜主动出击，应该谨慎守成
            relationshipText = '体克用，虽能控制局面，但卦象显示当前存在困难险阻，宜守不宜攻';
          } else {
            relationshipText = '体克用，您能够主动控制局面，有利于主动出击';
          }
        } else if (bodyUsage.relationship === 'usage-ke-body') {
          relationshipText = '用克体，外部环境对您有一定压力，宜守不宜攻';
        } else if (bodyUsage.relationship === 'body-sheng-usage') {
          relationshipText = '体生用，需要付出较多，需要谨慎管理资源';
        } else if (bodyUsage.relationship === 'usage-sheng-body') {
          relationshipText = '用生体，外部环境对您有利，能够得到帮助和支持';
        } else {
          relationshipText = '体用比和，内外和谐统一，形势稳定';
        }
        
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
          
          // 对于困难卦，即使体用关系看起来积极，也要谨慎
          if (isDifficultHexagram) {
            // 困难卦：卦辞通常包含警示，需要谨慎对待
            if (hasNegativeWarning) {
              judgmentSupplement = `卦辞云"${judgmentCore}"，正应此象，需谨慎应对。`;
            } else if (hasPositiveSign) {
              // 即使有积极词汇，也要结合卦象本身的困难含义
              judgmentSupplement = `卦辞云"${judgmentCore}"，但卦象本身显示困难险阻，需谨慎行事。`;
            } else {
              judgmentSupplement = `卦辞云"${judgmentCore}"，需结合卦象困难本质谨慎判断。`;
            }
          } else {
            // 非困难卦：正常判断
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
      hexagram: '.hexagram-section'
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

// 格式化解读文本，添加HTML标签使其更易读
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
    
    // 使用 formatContentScheme1 来突出关键语句
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
    
    return formatted;
  } catch (error) {
    console.error('格式化文本时出错:', error);
    // 发生错误时返回原始文本，但确保包含在段落标签中
    return `<p>${text.replace(/\n/g, '<br>')}</p>`;
  }
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

/* 关键建议样式 - 简洁突出，不花哨，与前文平齐 */
:deep(.key-advice) {
  background: rgba(251, 191, 36, 0.2);
  color: #d97706;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline;
  margin: 0;
  line-height: inherit;
}

/* 结论高亮样式 - 简洁的框线突出 */
:deep(.conclusion-highlight) {
  background: rgba(34, 197, 94, 0.1);
  border-left: 4px solid #22c55e;
  padding: 12px 16px;
  margin: 16px 0;
  border-radius: 6px;
  font-weight: 500;
  line-height: 1.7;
}
</style>

<template>
  <div class="dilemma-page min-h-screen relative overflow-hidden">
    <!-- 动态背景 -->
    <div class="dynamic-background">
      <div class="energy-waves"></div>
      <div class="floating-elements"></div>
      <div class="gradient-overlay"></div>
    </div>
    
    <!-- 页面内容 -->
    <div class="relative z-50 p-4 pb-20 pt-20">
      <!-- 页面标题区域 -->
      <div class="hero-section mb-8">
        <div class="title-container">
          <h1 class="main-title mystical-glow">
            <span class="title-icon">⚯</span>
            <span class="title-text">To be or not to be</span>
          </h1>
          <p class="subtitle">选择困难症终极解决方案<br>输入你的困惑，让玄学给你点灵感</p>
          <div class="title-decoration">
            <div class="decoration-line"></div>
            <div class="decoration-symbol">⚖️</div>
            <div class="decoration-line"></div>
          </div>
        </div>
      </div>

      <!-- 功能入口导航 - 已移除测试模式 -->
      <!-- <div class="navigation-container">
        <div class="nav-content">
          <div class="nav-left">
          </div>
        </div>
      </div> -->

      <!-- 选项输入区 -->
      <div class="options-container">
        <div class="section-header">
          <h3 class="section-title">纠结时刻，玄学来救场</h3>
          <p class="section-description">把两个让你头大的选择丢进来，让古老的智慧给你指条明路</p>
        </div>
        
        <div class="options-grid">
          <!-- 选项A输入 -->
          <div class="option-card">
            <div class="option-header">
              <div class="option-icon">
                <span class="icon-text">A</span>
              </div>
              <h4 class="option-title">第一个选择</h4>
            </div>
            <div class="input-wrapper">
              <input 
                v-model="optionA" 
                type="text" 
                placeholder="比如：继续当社畜 vs 裸辞追梦" 
                class="option-input"
                :class="{'input-error': showError && !optionA}"
              >
              <div class="input-focus-border"></div>
            </div>
            <p v-if="showError && !optionA" class="error-message">别纠结了，先填第一个选择吧</p>
          </div>
          
          <!-- 选项B输入 -->
          <div class="option-card">
            <div class="option-header">
              <div class="option-icon">
                <span class="icon-text">B</span>
              </div>
              <h4 class="option-title">第二个选择</h4>
            </div>
            <div class="input-wrapper">
              <span class="vs-text">VS</span>
            </div>
            <div class="input-wrapper">
              <input 
                v-model="optionB" 
                type="text" 
                placeholder="比如：今晚吃火锅 vs 减肥健身" 
                class="option-input"
                :class="{'input-error': showError && !optionB}"
              >
              <div class="input-focus-border"></div>
            </div>
            <p v-if="showError && !optionB" class="error-message">第二个选择也别忘了哦</p>
          </div>
        </div>
        
        <!-- 问题输入 -->
        <div class="question-container mt-6">
          <div class="section-header">
            <h3 class="section-title">补充说明（可选）</h3>
            <p class="section-description">添加更多细节，让AI更好地理解你的情况</p>
          </div>
          <div class="input-wrapper">
            <textarea 
              v-model="question" 
              placeholder="比如：我最近工作压力很大，和伴侣的关系也有些紧张..." 
              class="question-input"
              rows="3"
            ></textarea>
            <div class="input-focus-border"></div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="action-section">
          <button 
            @click="startAnalysis" 
            class="analyze-button"
            :class="{'analyze-button-loading': isGenerating}"
          >
            <span v-if="isGenerating" class="loading-content">
              <span class="loading-spinner"></span>
              <span class="loading-text">分析中...</span>
            </span>
            <span v-else class="button-content">
              <span class="button-icon">🔮</span>
              <span class="button-text">让玄学给你答案</span>
            </span>
          </button>
        </div>
      </div>

      <!-- 分析结果 -->
      <div v-if="analysisResult" class="result-container" :class="{'result-visible': showResult}">
        <div class="result-header">
          <div class="result-title">
            <h3 class="result-question">{{ analysisResult.question }}</h3>
            <div class="result-method">
              <span class="method-badge">{{ analysisResult.method }}</span>
            </div>
          </div>
        </div>
        
        <div class="result-content">
          <!-- 天玄智慧解读 - 优雅的标题，不再暴露技术细节 -->
          <div v-if="analysisResult.analysis" class="scenario-analysis-section mb-8">
            <div class="section-header text-center mb-6">
              <h3 class="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ✨ 天玄智慧解读
              </h3>
              <p class="text-gray-600 text-lg">基于易经古老智慧，为您提供个性化的决策指导</p>
            </div>
            
            <!-- 使用重构后的场景化分析组件 -->
              <ScenarioAnalysisResult
                v-if="processedScenarioResult"
                :result="{
                  question: `${optionA} vs ${optionB}`,
                  hexagramSymbol: analysisResult.hexagram?.symbol,
                  hexagramName: analysisResult.hexagram?.chineseName,
                  changingHexagramSymbol: analysisResult.relatedHexagram?.symbol,
                  changingHexagramName: analysisResult.relatedHexagram?.chineseName,
                  changingLines: analysisResult.changingLines || [],
                  ...processedScenarioResult
                }"
              />
          </div>
          
        </div>
      </div>

      <!-- 历史记录 -->
      <div v-if="!analysisResult" class="history-container">
        <h3 class="history-title">历史决策</h3>
        <div class="history-list">
          <div v-for="(item, index) in historyItems" :key="index" class="history-card">
            <div class="history-header">
              <h4 class="history-question">{{ item.question }}</h4>
              <div class="history-date">{{ item.date }}</div>
            </div>
            <div class="history-content">
              <div class="history-result">
                <div class="result-icon" :class="item.iconBg">
                  <i :class="`${item.icon} ${item.iconColor}`"></i>
                </div>
                <div class="result-info">
                  <p class="result-text">建议选择：<span :class="item.resultColor" class="result-value">{{ item.result }}</span></p>
                  <p class="result-summary">{{ item.summary }}</p>
                </div>
              </div>
              <div class="history-actions">
                <button class="view-details-button">查看详情</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- LLM加载指示器 -->
      <LLMLoadingIndicator
        :isLoading="isGenerating"
        :progress="loadingProgress" 
        :stage="loadingStage"
      />

      <!-- SharePanel -->
      <SharePanel
        :is-open="isSharePanelOpen"
        :target-ref="dilemmaResultRef"
        :share-data="{
          title: `玄选两难 - ${analysisResult?.question || ''}`,
          text: '我在天玄Web进行了玄选两难分析，获得了易经的智慧指引！',
          hashtags: ['玄选两难', '天玄Web', '易经智慧']
        }"
        @close="isSharePanelOpen = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { generateHexagram, AnalysisResult } from '../utils/hexagramGenerator';
import { generateFortuneSeed } from '../utils/fortuneSeed';
import LLMLoadingIndicator from '../../../components/LLMLoadingIndicator.vue';
import SharePanel from '../../../components/common/SharePanel.vue';
import { LLMService } from '../../../services/LLMService';
import { ScenarioAnalyzer } from '../utils/scenarioAnalyzer';
import ScenarioAnalysisResult from '../components/ScenarioAnalysisResult.vue';
import { UserInfoSharingService } from '../../../services/UserInfoSharingService';
import { generateTraditionalAnalysisCoin } from '../utils/traditionalAnalysis';
import type { TraditionalAnalysis } from '../types';

// 表单数据
  const optionA = ref('');
  const optionB = ref('');
  const question = ref(''); // 添加问题输入
  // 始终启用AI解读模式（已删除Plus模式开关）
  const useMultipleAlgorithms = ref(true);
const showError = ref(false);
const showResult = ref(false);
const analysisResult = ref<AnalysisResult | null>(null);
const processedScenarioResult = ref<any>(null); // 场景化分析结果

// 场景化AI解读函数
async function getScenarioBasedAnalysis(hexagram: any, scenario: any, traditionalAnalysis?: TraditionalAnalysis): Promise<string> {
  try {
    // 准备卦象信息
    const hexagramInfo = {
      name: hexagram.name || hexagram.chineseName,
      chineseName: hexagram.chineseName || hexagram.name,
      symbol: hexagram.symbol || '',
      judgment: hexagram.judgment || '',
      image: hexagram.image || '',
      changingLines: hexagram.changingLines || [],
      // 添加变卦信息
      relatedHexagram: analysisResult.value?.relatedHexagram ? {
        name: analysisResult.value.relatedHexagram.name || analysisResult.value.relatedHexagram.chineseName,
        chineseName: analysisResult.value.relatedHexagram.chineseName || analysisResult.value.relatedHexagram.name,
        symbol: analysisResult.value.relatedHexagram.symbol || '',
        judgment: analysisResult.value.relatedHexagram.judgment || '',
        image: analysisResult.value.relatedHexagram.image || ''
      } : null
    };

    // 调用LLMService的场景化解读
    const aiResponse = await LLMService.getScenarioBasedDilemmaInterpretation(  
      optionA.value,
      optionB.value,
      scenario,
      hexagramInfo,
      traditionalAnalysis  // ⭐ 传递传统逻辑分析
    );

    console.log('🔍 [内容传递验证] AI原始响应:', aiResponse);

    // 🚨 重构后的AI内容处理流程
    try {
      // 尝试解析AI响应为JSON
      let aiContent;
      try {
        aiContent = JSON.parse(aiResponse);
        console.log('🔍 [内容传递验证] 解析后的AI内容:', aiContent);
      } catch (parseError) {
        console.log('🔍 [内容传递验证] AI响应不是JSON格式，使用基础备用方案');
        aiContent = createBasicFallback(aiResponse, optionA.value, optionB.value, hexagramInfo);
      }
      
      // 验证AI内容结构
      if (aiContent.coreNarrative && aiContent.optionAnalysis && aiContent.breakthroughPlan) {
        console.log('✅ [内容验证] AI内容结构完整，设置到processedScenarioResult');
        processedScenarioResult.value = aiContent;
        // 🚨 修复：返回完整的AI数据，而不是字符串
        return JSON.stringify(aiContent);
      } else {
        console.warn('⚠️ [内容验证] AI内容结构不完整，使用基础备用方案');
        // 使用基础备用方案，基于AI响应内容生成有意义的内容
        const basicFallback = createBasicFallback(aiResponse, optionA.value, optionB.value, hexagramInfo);
        processedScenarioResult.value = basicFallback;
        // 🚨 修复：返回完整的备用数据，而不是字符串
        return JSON.stringify(basicFallback);
      }
    } catch (error) {
      console.log('🔍 [内容传递验证] 所有解析方案失败，使用基础备用方案');
      
      // 基础备用方案：基于AI响应生成有意义的内容
      const fallbackContent = createBasicFallback(aiResponse, optionA.value, optionB.value, hexagramInfo);
      processedScenarioResult.value = fallbackContent;
      // 🚨 修复：返回完整的备用数据，而不是字符串
      return JSON.stringify(fallbackContent);
    }
  } catch (error) {
    console.error('场景化AI解读失败:', error);
    return 'AI解读生成失败，请稍后重试。';
  }
}
// 易经占卜下拉菜单状态 - 已移除
// const showDropdown = ref(false);

// 新增：分享功能相关
const isSharePanelOpen = ref(false);
const dilemmaResultRef = ref<HTMLElement | null>(null);

// 简化的备用方案：避免内容重复，基于卦象信息生成内容
const createBasicFallback = (aiResponse: string, optionA: string, optionB: string, hexagramInfo?: any) => {
  return {
    openingStatement: "", // 让AI真正生成开场白，不提供硬编码默认值
    coreNarrative: {
      title: "天玄智慧解读",
      story: aiResponse || "基于易经智慧，为您提供个性化的决策指导。",
      coreConflict: "基于卦象分析，当前存在核心冲突需要解决",
      development: "卦象指引着明确的发展方向",
      coreRevelation: "" // 让AI真正生成启示内容，不提供硬编码默认值
    },
    optionAnalysis: [
      {
        optionName: optionA,
        alignmentWithNarrative: `选择${optionA}与当前卦象高度契合，体现了易经智慧中的主动进取之道。这个选择能够充分发挥你的潜能，在正确的时机做出正确的决定。`,
        potentialAdvantage: `选择${optionA}具有独特的优势：能够为你带来稳定的发展基础，符合当前的能量场，并且能够充分发挥你的专业技能和天赋。这个选择能够让你在专业领域建立权威地位。`,
        potentialChallenge: `选择${optionA}需要面对的挑战：初期可能会遇到一些阻力，需要更多的耐心和坚持。但这些都是成长的机会，通过克服这些困难，你将变得更加强大和成熟。`
      },
      {
        optionName: optionB,
        alignmentWithNarrative: `选择${optionB}与核心叙事同样重要，展现了易经智慧中的变通之道。这个选择能够为你开辟新的发展路径，带来意想不到的机遇和可能性。`,
        potentialAdvantage: `选择${optionB}具有独特的优势：能够为你带来更广阔的发展空间，符合当前的市场趋势，并且能够让你接触到更多不同的人群和机会。这个选择能够让你在多个领域都有所建树。`,
        potentialChallenge: `选择${optionB}需要面对的挑战：需要更多的学习和适应，初期可能会比较辛苦。但这些都是突破的机会，通过不断学习和实践，你将获得更全面的能力。`
      }
    ],
    breakthroughPlan: {
      clearRecommendation: "", // 让AI真正生成建议内容，不提供硬编码默认值
      actionList: [
        {
          actionTitle: "深入思考",
          actionDetail: "仔细分析两个选项的利弊，结合易经智慧做出选择",
          rationale: "这能帮助您理清思路，找到最适合的解决方案"
        },
        {
          actionTitle: "寻求平衡",
          actionDetail: "在两个选项之间寻找平衡点，不要过于极端",
          rationale: "易经智慧告诉我们，平衡是解决冲突的关键"
        }
      ]
    },
    // 新增：卦象相关字段，确保数据结构完整
    hexagramMeanings: hexagramInfo ? {
      [hexagramInfo.chineseName]: `${hexagramInfo.judgment}。${hexagramInfo.image}`,
      ...(hexagramInfo.relatedHexagram ? {
        [hexagramInfo.relatedHexagram.chineseName]: `${hexagramInfo.relatedHexagram.judgment}。${hexagramInfo.relatedHexagram.image}`
      } : {})
    } : {},
    transformationInsights: hexagramInfo && hexagramInfo.relatedHexagram ? {
      [`${hexagramInfo.chineseName}-${hexagramInfo.relatedHexagram.chineseName}`]: `起卦「${hexagramInfo.chineseName}」：${hexagramInfo.judgment}。${hexagramInfo.image}。变卦「${hexagramInfo.relatedHexagram.chineseName}」：${hexagramInfo.relatedHexagram.judgment}。${hexagramInfo.relatedHexagram.image}。`
    } : {},
    stableInsights: hexagramInfo ? {
      [hexagramInfo.chineseName]: `「${hexagramInfo.chineseName}」：${hexagramInfo.judgment}。${hexagramInfo.image}。`,
      ...(hexagramInfo.relatedHexagram ? {
        [hexagramInfo.relatedHexagram.chineseName]: `「${hexagramInfo.relatedHexagram.chineseName}」：${hexagramInfo.relatedHexagram.judgment}。${hexagramInfo.relatedHexagram.image}。`
      } : {})
    } : {}
  };
};

// LLM加载状态
const isGenerating = ref(false);
const loadingProgress = ref('');
const loadingStage = ref<'preparing' | 'calling' | 'processing' | 'completed' | 'error'>('preparing');

// 订阅LLM服务的加载状态
let unsubscribeFromLLM: (() => void) | null = null;



onMounted(() => {
  console.log('🔧 DilemmaPage mounted，开始订阅LLM状态...');
  
  // 订阅LLMService的加载状态变化
  unsubscribeFromLLM = LLMService.onLoadingStateChange((state) => {
    console.log('🔄 收到LLM状态变化:', state);
    console.log('🔧 更新前isGenerating:', isGenerating.value);
    
    isGenerating.value = state.isLoading;
    loadingProgress.value = state.progress;
    loadingStage.value = state.stage;
    
    console.log('🔧 更新后isGenerating:', isGenerating.value);
    console.log('🔧 更新后loadingProgress:', loadingProgress.value);
    console.log('🔧 更新后loadingStage:', loadingStage.value);
  });
  
  console.log('🔧 LLM订阅设置完成，unsubscribeFromLLM:', !!unsubscribeFromLLM);
});

onUnmounted(() => {
  if (unsubscribeFromLLM) {
    unsubscribeFromLLM();
  }
});

// 历史记录数据
const historyItems = [
  {
    question: '接受现在的工作 vs 跳槽到新公司',
    date: '2023-06-25',
    result: '跳槽到新公司',
    summary: '根据你的八字和当前星象，新的开始将为你带来更大的发展空间',
    icon: 'fas fa-briefcase',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-500',
    resultColor: 'text-blue-600'
  },
  {
    question: '今天去健身 vs 在家休息',
    date: '2023-06-23',
    result: '在家休息',
    summary: '今日健康运势偏低，不适合剧烈运动，建议在家休息调整',
    icon: 'fas fa-home',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-500',
    resultColor: 'text-green-600'
  }
];

// 记录用户点击"开始分析"时的时间戳
const clickTimestamp = ref<number | null>(null);

// 开始分析
const startAnalysis = async () => {
  // 表单验证
  if (!optionA.value || !optionB.value) {
    showError.value = true;
    return;
  }
  showError.value = false;

  console.log('🎯 开始分析，检查LLM状态订阅...');
  console.log('🔧 当前isGenerating:', isGenerating.value);
  console.log('🔧 LLM订阅函数数量:', unsubscribeFromLLM ? '已订阅' : '未订阅');

  // 记录点击时间戳
  clickTimestamp.value = Date.now();

  // 构建种子输入
  const seedInput = {
    question: `${optionA.value} vs ${optionB.value}`,
    optionA: optionA.value,
    optionB: optionB.value,
    clickTimestamp: clickTimestamp.value || undefined
  };
  
  try {
    const seed = generateFortuneSeed(seedInput);

    console.log('🎲 生成种子:', seed);
    console.log('🔮 开始调用generateHexagram...');
    
      // 生成卦象并分析，传入种子（始终使用AI解读模式）
      const result = await generateHexagram(
        optionA.value,
        optionB.value,
        seed,
        true // 始终启用AI解读
      );
  
      console.log('✅ generateHexagram完成');
      console.log('🔧 完成后isGenerating:', isGenerating.value);

      // ⭐ 新增：生成传统逻辑分析
      if (!result.hexagram) {
        throw new Error('生成卦象失败，无法进行传统逻辑分析');
      }

      const traditionalAnalysis = generateTraditionalAnalysisCoin(
        result.hexagram,
        result.changingLines,
        result.relatedHexagram
      );
      console.log('✅ 传统逻辑分析已生成（两难抉择）:', traditionalAnalysis);

      // 收集用户信息到共享服务
      UserInfoSharingService.collectFromDilemma(optionA.value, optionB.value, question.value || '');
      console.log('📊 用户信息已收集到共享服务');
    
    // 进行场景分析
    const scenario = ScenarioAnalyzer.analyzeUserInput(
      optionA.value,
      optionB.value,
      question.value || undefined
    );
    
      console.log('🔍 场景分析结果:', scenario);

        // 获取场景化AI解读（始终启用）
        let aiAnalysis = '';
        let aiData = null;
        // 始终执行AI解读
        // 确保AI解读完成后再隐藏加载状态
        aiAnalysis = await getScenarioBasedAnalysis(result.hexagram, scenario, traditionalAnalysis);
      
      // 🚨 修复：解析AI返回的JSON数据
      try {
        aiData = JSON.parse(aiAnalysis);
        console.log('✅ 解析AI数据成功:', aiData);
      } catch (e) {
        console.warn('⚠️ AI数据不是JSON格式，使用原始字符串');
        aiData = null;
      }
    
      // 转换结果格式以适配现有界面
      analysisResult.value = {
          ...result,
          question: `${optionA.value} vs ${optionB.value}`,
          method: '综合分析', // 始终使用AI解读模式
          recommendation: result.recommendation || 'A',
          optionA_analysis: result.optionA_analysis || '',
          optionB_analysis: result.optionB_analysis || '',
          optionA_score: result.optionA_score || 50,
          optionB_score: result.optionB_score || 50,
          analysis: aiAnalysis, // 添加场景化AI解读
          traditionalAnalysis: traditionalAnalysis, // ⭐ 保存传统逻辑分析
        
      // 🚨 修复：添加AI生成的卦象解读字段
      ...(aiData && {
        hexagramData: aiData.hexagramData,
        transformationInsights: aiData.transformationInsights,
        hexagramChanges: aiData.hexagramChanges,
        coreNarrative: aiData.coreNarrative,
        breakthroughPlan: aiData.breakthroughPlan
      }),

      // 添加场景信息
      scenarioContext: {
        decisionType: scenario.decisionType,
        emotionalTone: scenario.emotionalTone,
        urgency: scenario.urgency,
        riskLevel: scenario.riskLevel
      }
    };
    
    // 显示结果(带动画) - 确保AI解读完成后再显示
    setTimeout(() => {
      showResult.value = true;
    }, 500);

    console.log('传给DivinationResult的analysisResult:', analysisResult.value);
    if (analysisResult.value && analysisResult.value.hexagram) {
      console.log('analysisResult.hexagram:', analysisResult.value.hexagram);
    }
  } catch (error) {
    console.error('卦象生成错误:', error);
    console.log('🔧 错误后isGenerating:', isGenerating.value);
    
    setTimeout(() => {
      fallbackToMockResult();
    }, 500);
  }
};

// 如果算法出错，使用模拟数据作为后备
const fallbackToMockResult = () => {
  analysisResult.value = {
    hexagram: {
      number: 4,
      name: 'Meng (Youthful Folly)',
      chineseName: '蒙',
      symbol: '䷃',
      lines: [0, 1, 0, 1, 0, 0],
      meaning: '山下出泉，蒙昧待启',
      judgment: '亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。',
      yao_texts: [],
      trigrams: { upper: '艮', lower: '坎' },
      sequence: 4,
      modernInterpretation: '蒙卦代表蒙昧待启，需要寻求指引和学习。',
      overall: '在事业上需要保持谦虚学习的态度，在感情中需要更多的沟通和理解，注意休息，保持规律的作息。'
    },
    changingLines: [],
    relatedHexagram: null,
      analysis: '根据易经卦象分析，选项A更符合当前的能量场，但选项B也有其优势。在这种情况下，建议你优先考虑自己内心的直觉和感受。',
      question: `${optionA.value} vs ${optionB.value}`,
      method: '综合分析', // 始终使用AI解读模式
    recommendation: Math.random() > 0.5 ? 'A' : 'B',
    optionA_analysis: '这个选择代表着稳定和熟悉的环境，有助于巩固已有成果。',
    optionB_analysis: '这个选择意味着冒险和新的可能性，有机会获得更大的发展。',
    optionA_score: Math.floor(Math.random() * 40 + 50),
    optionB_score: Math.floor(Math.random() * 40 + 50)
  };
  
  // 显示结果(带动画)
  setTimeout(() => {
    showResult.value = true;
  }, 100);
};

  // 重置表单
  const resetForm = () => {
    optionA.value = '';
    optionB.value = '';
    // useMultipleAlgorithms 始终为 true，不需要重置
    showResult.value = false;
  
  setTimeout(() => {
    analysisResult.value = null;
  }, 300);
};
</script>

<style scoped>
/* 动态背景 */
.dynamic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.energy-waves {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
  animation: waveFlow 20s ease-in-out infinite;
  pointer-events: none;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 2px, transparent 2px),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 100px 100px, 60px 60px;
  animation: elementFloat 25s linear infinite;
  pointer-events: none;
}

.gradient-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.9) 100%);
  pointer-events: none;
}

@keyframes waveFlow {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.3; }
  50% { transform: scale(1.1) rotate(180deg); opacity: 0.6; }
}

@keyframes elementFloat {
  0% { transform: translateY(0px) translateX(0px); }
  100% { transform: translateY(-100px) translateX(50px); }
}

/* 英雄区域 */
.hero-section {
  text-align: center;
  padding: 2rem 0;
}

.title-container {
  max-width: 600px;
  margin: 0 auto;
}

.main-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 1rem;
  color: #ffffff;
  text-shadow: 0 0 15px rgba(139, 92, 246, 0.6);
}

.title-icon {
  font-size: 1.2em;
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
}

.title-text {
  position: relative;
}

.title-text::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.decoration-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
}

.decoration-symbol {
  font-size: 1.5rem;
  color: #f59e0b;
  animation: symbolPulse 2s ease-in-out infinite;
}

@keyframes symbolPulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 1; }
}

/* 导航容器样式 - 已移除 */
/* .navigation-container { ... } */
/* .nav-content { ... } */

/* 易经占卜选择器样式 - 已移除 */
/* .method-selector { ... } */
/* .selector-trigger { ... } */
/* .dropdown-menu { ... } */
/* .dropdown-item { ... } */
/* .item-icon { ... } */

/* 测试模式链接样式 - 已移除 */
/* .test-mode-link { ... } */
/* .test-mode-link:hover { ... } */
/* .test-icon { ... } */

/* 选项容器 */
.options-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.section-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.option-card {
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.option-card:hover {
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
}

.option-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.option-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3);
}

.icon-text {
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.vs-text {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #8b5cf6;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
  margin: 1rem 0;
  animation: vsGlow 2s ease-in-out infinite;
}

@keyframes vsGlow {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.option-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
}

.input-wrapper {
  position: relative;
}

.option-input {
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.option-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.option-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  background: rgba(255, 255, 255, 0.15);
}

.input-error {
  border-color: #ef4444;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

.error-message {
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.input-focus-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px;
  border: 2px solid transparent;
  pointer-events: none;
  transition: all 0.3s ease;
}

.option-input:focus + .input-focus-border {
  border-color: #8b5cf6;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
}

.question-input {
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  resize: vertical;
  min-height: 80px;
}

.question-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.question-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  background: rgba(255, 255, 255, 0.15);
}

/* 操作区域 */
.action-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.analysis-toggle {
  display: flex;
  align-items: center;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
}

.toggle-input {
  display: none;
}

.toggle-slider {
  width: 48px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.toggle-input:checked + .toggle-slider {
  background: #8b5cf6;
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(24px);
}

.toggle-label {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.95rem;
}

.analyze-button {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border: none;
  border-radius: 16px;
  padding: 1rem 2.5rem;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-width: 180px;
}

.analyze-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.analyze-button:hover::before {
  left: 100%;
}

.analyze-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(139, 92, 246, 0.4);
}

.analyze-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-icon {
  font-size: 1.2rem;
}

.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 结果容器 */
.result-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.result-visible {
  opacity: 1;
  transform: translateY(0);
}

.result-header {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  padding: 1.5rem 2rem;
  color: white;
}

.result-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-question {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.result-method {
  display: flex;
  gap: 0.5rem;
}

.method-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.result-content {
  padding: 2rem;
}

/* 六爻显示 */
.hexagram-display {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.hexagram-header {
  margin-bottom: 1.5rem;
}

.hexagram-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.hexagram-symbol {
  font-size: 3rem;
  color: #8b5cf6;
  margin-bottom: 1rem;
}

.hexagram-lines {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.line-container {
  display: flex;
  justify-content: center;
}

.yang-line {
  width: 80px;
  height: 8px;
  background: #8b5cf6;
  border-radius: 4px;
}

.yin-line {
  display: flex;
  gap: 8px;
}

.yin-segment {
  width: 36px;
  height: 8px;
  background: #8b5cf6;
  border-radius: 4px;
}

.hexagram-meaning {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.changing-lines {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
}

.changing-header {
  margin-bottom: 0.5rem;
}

.changing-title {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.changing-line {
  color: #8b5cf6;
  font-weight: 500;
}

.related-hexagram {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.related-title {
  color: rgba(255, 255, 255, 0.7);
}

.related-name {
  color: #8b5cf6;
  font-weight: 500;
}

.related-meaning {
  color: rgba(255, 255, 255, 0.7);
}

/* 分析部分 */
.analysis-section {
  margin-bottom: 2rem;
}

.recommendation-card {
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
}

.recommendation-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.recommendation-icon {
  font-size: 1.5rem;
}

.recommendation-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.recommendation-content {
  margin-bottom: 1rem;
}

.recommended-option {
  color: #8b5cf6;
  font-weight: 600;
  font-size: 1.1rem;
}

.balanced-option {
  color: #f59e0b;
  font-weight: 600;
  font-size: 1.1rem;
}

.recommendation-analysis {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

/* 详细分析 */
.detailed-analysis {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.analysis-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.analysis-icon {
  width: 32px;
  height: 32px;
  background: #8b5cf6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
}

.analysis-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.hexagram-details {
  margin-bottom: 2rem;
}

.detail-item {
  margin-bottom: 1rem;
}

.detail-label {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.detail-content {
  color: rgba(255, 255, 255, 0.9);
}

.attributes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
}

.attribute-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
}

.attribute-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
}

.attribute-value {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

.judgment-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
}

.judgment-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
}

.judgment-content {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

/* 变爻分析 */
.changing-analysis {
  margin-bottom: 2rem;
}

.changing-analysis-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
}

.changing-analysis-content {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
}

.changing-summary {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.highlight {
  color: #8b5cf6;
  font-weight: 500;
}

.hexagram-name {
  color: #8b5cf6;
  font-weight: 500;
}

.changing-line-analysis {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
}

.changing-line-analysis:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.line-title {
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.line-interpretation {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

/* 🚨 旧UI组件的CSS样式已清除 */

/* 结果操作 */
.result-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.action-left,
.action-right {
  display: flex;
  gap: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.action-button.primary {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.4);
  color: #8b5cf6;
}

.action-button.primary:hover {
  background: rgba(139, 92, 246, 0.3);
  color: #8b5cf6;
}

.action-icon {
  font-size: 1rem;
}

/* 历史记录 */
.history-container {
  margin-top: 2rem;
}

.history-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1.5rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.history-card:hover {
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
}

.history-header {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  padding: 1rem 1.5rem;
  color: white;
}

.history-question {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.history-date {
  font-size: 0.9rem;
  opacity: 0.8;
}

.history-content {
  padding: 1.5rem;
}

.history-result {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.result-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.result-info {
  flex: 1;
}

.result-text {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
}

.result-value {
  font-weight: 600;
}

.result-summary {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.history-actions {
  display: flex;
  justify-content: flex-end;
}

.view-details-button {
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  color: #8b5cf6;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-details-button:hover {
  background: rgba(139, 92, 246, 0.3);
  color: #8b5cf6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .action-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .attributes-grid {
    grid-template-columns: 1fr;
  }
  
  .result-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-left,
  .action-right {
    justify-content: center;
  }
  
  .main-title {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .title-decoration {
    gap: 0.5rem;
  }
  
  .decoration-line {
    width: 40px;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style> 
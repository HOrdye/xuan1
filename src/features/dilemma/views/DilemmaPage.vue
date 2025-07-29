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
        
        <!-- 操作按钮 -->
        <div class="action-section">
          <div class="analysis-toggle">
            <label class="toggle-switch">
              <input v-model="useMultipleAlgorithms" type="checkbox" class="toggle-input">
              <span class="toggle-slider"></span>
              <span class="toggle-label">开启玄学Plus模式</span>
            </label>
          </div>
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
          <!-- 六爻图显示 -->
          <div v-if="analysisResult.hexagram" class="hexagram-display">
            <div class="hexagram-header">
              <h4 class="hexagram-name">{{ analysisResult.hexagram.chineseName }} - {{ analysisResult.hexagram.name }}</h4>
              <div class="hexagram-symbol">{{ analysisResult.hexagram.symbol }}</div>
            </div>
            
            <div class="hexagram-lines">
              <div v-for="(line, index) in analysisResult.hexagram.lines.slice().reverse()" :key="index" class="line-container">
                <div v-if="line === 1" class="yang-line"></div>
                <div v-else-if="line === 0" class="yin-line">
                  <div class="yin-segment"></div>
                  <div class="yin-segment"></div>
                </div>
              </div>
            </div>
            
            <div class="hexagram-meaning">{{ analysisResult.hexagram.meaning }}</div>
            
            <!-- 变爻显示 -->
            <div v-if="analysisResult.changingLines && analysisResult.changingLines.length > 0" class="changing-lines">
              <div class="changing-header">
                <span class="changing-title">变爻：</span>
                <span v-for="(line, index) in analysisResult.changingLines" :key="index" class="changing-line">
                  第{{ line + 1 }}爻{{ index < analysisResult.changingLines.length - 1 ? '、' : '' }}
                </span>
              </div>
              <div v-if="analysisResult.relatedHexagram" class="related-hexagram">
                <span class="related-title">变卦：</span>
                <span class="related-name">{{ analysisResult.relatedHexagram.name }}（{{ analysisResult.relatedHexagram.symbol }}）</span>
                <span class="related-meaning">—— {{ analysisResult.relatedHexagram.meaning }}</span>
              </div>
            </div>
          </div>
          
          <!-- 结果分析 -->
          <div class="analysis-section">
            <div class="recommendation-card">
              <div class="recommendation-header">
                <div class="recommendation-icon">💡</div>
                <h4 class="recommendation-title">玄学建议</h4>
              </div>
              <div class="recommendation-content">
                <span v-if="analysisResult.recommendation === 'A'" class="recommended-option">{{ optionA }}</span>
                <span v-else-if="analysisResult.recommendation === 'B'" class="recommended-option">{{ optionB }}</span>
                <span v-else class="balanced-option">{{ analysisResult.recommendation }}</span>
              </div>
              <p class="recommendation-analysis">{{ analysisResult.analysis }}</p>
            </div>
          </div>
          
          <!-- 详细分析部分 -->
          <div class="detailed-analysis">
            <div class="analysis-header">
              <span class="analysis-icon">易</span>
                              <h4 class="analysis-title">卦象解读</h4>
            </div>
            
            <!-- 卦象详细解读 -->
            <div class="hexagram-details">
              <div class="detail-item">
                <span class="detail-label">卦象解读：</span>
                <span class="detail-content">{{ analysisResult.hexagram?.judgment || analysisResult.hexagram?.modernInterpretation || '' }}</span>
              </div>
              
              <!-- 卦象基本属性 -->
              <div class="attributes-grid">
                <div class="attribute-card">
                  <span class="attribute-label">特性：</span>
                  <span class="attribute-value">{{ getHexagramAttribute(analysisResult.hexagram) }}</span>
                </div>
                <div class="attribute-card">
                  <span class="attribute-label">代表：</span>
                  <span class="attribute-value">{{ getHexagramNature(analysisResult.hexagram) }}</span>
                </div>
              </div>
              
              <!-- 卦辞 -->
              <div class="judgment-card">
                <span class="judgment-label">卦辞：</span>
                <span class="judgment-content">{{ analysisResult.hexagram?.judgment || '无' }}</span>
              </div>
            </div>
            
            <!-- 变爻分析 -->
            <div v-if="analysisResult.changingLines && analysisResult.changingLines.length > 0" class="changing-analysis">
              <h5 class="changing-analysis-title">变爻分析</h5>
              <div class="changing-analysis-content">
                <p class="changing-summary">本次卦象有 {{ analysisResult.changingLines.length }} 个变爻，
                  表示处于<span class="highlight">转变期</span>，从
                  <span class="hexagram-name">{{ analysisResult.hexagram?.chineseName }}</span>卦
                  变为<span class="hexagram-name">{{ analysisResult.relatedHexagram?.chineseName }}</span>卦。
                </p>
                
                <div v-for="(line, idx) in analysisResult.changingLines" :key="idx" class="changing-line-analysis">
                  <p class="line-title">第{{ line + 1 }}爻变化：</p>
                  <p class="line-interpretation">{{ getChangingLineInterpretation(line, analysisResult.hexagram?.chineseName) }}</p>
                </div>
              </div>
            </div>
            
            <!-- 选项深入分析 -->
            <div class="options-analysis">
              <h5 class="options-analysis-title">选项分析</h5>
              
              <div class="option-analysis-card">
                <div class="option-analysis-header">
                  <span class="option-label">选项A: {{ optionA }}</span>
                  <span class="option-score">匹配度: {{ analysisResult.optionA_score }}%</span>
                </div>
                <div class="option-analysis-content">
                  <p class="option-description">{{ analysisResult.optionA_analysis }}</p>
                  <div class="option-details">
                    <p class="option-strengths">
                      <span class="detail-label">优点：</span>
                      {{ getOptionStrengths(analysisResult, 'A') }}
                    </p>
                    <p class="option-cautions">
                      <span class="detail-label">注意点：</span>
                      {{ getOptionCautions(analysisResult, 'A') }}
                    </p>
                  </div>
                </div>
                <div class="score-bar">
                  <div class="score-fill" :style="`width: ${analysisResult.optionA_score}%`"></div>
                </div>
              </div>
              
              <div class="option-analysis-card">
                <div class="option-analysis-header">
                  <span class="option-label">选项B: {{ optionB }}</span>
                  <span class="option-score">匹配度: {{ analysisResult.optionB_score }}%</span>
                </div>
                <div class="option-analysis-content">
                  <p class="option-description">{{ analysisResult.optionB_analysis }}</p>
                  <div class="option-details">
                    <p class="option-strengths">
                      <span class="detail-label">优点：</span>
                      {{ getOptionStrengths(analysisResult, 'B') }}
                    </p>
                    <p class="option-cautions">
                      <span class="detail-label">注意点：</span>
                      {{ getOptionCautions(analysisResult, 'B') }}
                    </p>
                  </div>
                </div>
                <div class="score-bar">
                  <div class="score-fill" :style="`width: ${analysisResult.optionB_score}%`"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 综合建议 -->
          <div class="comprehensive-advice">
            <div class="advice-header">
              <span class="advice-icon">💡</span>
              <h4 class="advice-title">综合建议</h4>
            </div>
            <div class="advice-content">
              <p class="advice-intro">基于本次卦象解析，对于"{{ optionA }} vs {{ optionB }}"的抉择，给您的综合建议是：</p>
              <ul class="advice-list">
                <li v-if="analysisResult.hexagram">{{ getLLMAdvice(1, analysisResult) }}</li>
                <li v-if="analysisResult.hexagram">{{ getLLMAdvice(2, analysisResult) }}</li>
                <li v-if="analysisResult.hexagram">{{ getLLMAdvice(3, analysisResult) }}</li>
              </ul>
              
              <div class="wisdom-summary">
                <p class="wisdom-title">易经智慧总结：</p>
                <p class="wisdom-content">{{ getFinalWisdom(analysisResult) }}</p>
              </div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="result-actions">
            <div class="action-left">
              <button class="action-button">
                <span class="action-icon">🔖</span>
                <span class="action-text">收藏</span>
              </button>
            </div>
            <div class="action-right">
              <button class="action-button">
                <span class="action-icon">📤</span>
                <span class="action-text">分享</span>
              </button>
              <button @click="resetForm" class="action-button primary">
                <span class="action-icon">🔄</span>
                <span class="action-text">重新选择</span>
              </button>
            </div>
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
import SaveButton from '../../../components/common/SaveButton.vue';
import SharePanel from '../../../components/common/SharePanel.vue';
import MysticalBackground from '../../../components/common/MysticalBackground.vue';
import { LLMService } from '../../../services/LLMService';

// 表单数据
const optionA = ref('');
const optionB = ref('');
const useMultipleAlgorithms = ref(false);
const showError = ref(false);
const showResult = ref(false);
const analysisResult = ref<AnalysisResult | null>(null);
// 易经占卜下拉菜单状态 - 已移除
// const showDropdown = ref(false);

// 新增：分享功能相关
const isSharePanelOpen = ref(false);
const dilemmaResultRef = ref<HTMLElement | null>(null);

// LLM加载状态
const isGenerating = ref(false);
const loadingProgress = ref('');
const loadingStage = ref<'preparing' | 'calling' | 'processing' | 'completed' | 'error'>('preparing');

// 订阅LLM服务的加载状态
let unsubscribeFromLLM: (() => void) | null = null;

// 开发模式检测
const isDevelopment = computed(() => {
  return process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost'
})

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
    
      // 生成卦象并分析，传入种子
      const result = await generateHexagram(
        optionA.value,
        optionB.value,
        seed,
        useMultipleAlgorithms.value
      );
    
    console.log('✅ generateHexagram完成');
    console.log('🔧 完成后isGenerating:', isGenerating.value);
      
      // 转换结果格式以适配现有界面
      analysisResult.value = {
        ...result,
        question: `${optionA.value} vs ${optionB.value}`,
        method: useMultipleAlgorithms.value ? '综合分析' : '易经六十四卦',
        recommendation: result.recommendation || 'A',
        optionA_analysis: result.optionA_analysis || '',
        optionB_analysis: result.optionB_analysis || '',
        optionA_score: result.optionA_score || 50,
        optionB_score: result.optionB_score || 50
      };
      
      // 显示结果(带动画)
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
    method: useMultipleAlgorithms.value ? '综合分析' : '易经六十四卦',
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
  useMultipleAlgorithms.value = false;
  showResult.value = false;
  
  setTimeout(() => {
    analysisResult.value = null;
  }, 300);
};

// 新增的辅助函数
// 获取卦象属性
const getHexagramAttribute = (hexagram: any): string => {
  if (!hexagram) return '未知';
  return hexagram.nature || hexagram.attribute || (hexagram.trigrams ? 
    `${hexagram.trigrams.lower}下${hexagram.trigrams.upper}上` : '');
};

// 获取卦象性质
const getHexagramNature = (hexagram: any): string => {
  if (!hexagram) return '未知';
  if (hexagram.modernInterpretation) {
    return hexagram.modernInterpretation.split('，')[0];
  }
  const meanings = {
    '乾': '刚健、领导、创造',
    '坤': '柔顺、包容、承载',
    '震': '行动、震动、新生',
    '艮': '稳定、停止、限制',
    '坎': '险难、智慧、深邃',
    '离': '光明、明辨、附着',
    '兑': '喜悦、沟通、满足',
    '巽': '谦逊、渗透、柔顺'
  };
  
  const chineseName = hexagram.chineseName || '';
  for (const key in meanings) {
    if (chineseName.includes(key)) {
      return (meanings as any)[key];
    }
  }
  
  return hexagram.element || '变化与平衡';
};

// 获取变爻解读
const getChangingLineInterpretation = (lineIndex: number, hexagramName?: string): string => {
  const defaultInterpretations = [
    '基础正在变化，需要调整起点或重新审视根本问题。',
    '内在态度需要转变，应重新思考自己的立场。',
    '行动方式需要改变，寻找更有效的方法。',
    '环境或他人的态度正在变化，需要适应新局面。',
    '目标或方向需要调整，重新思考核心策略。',
    '事情接近尾声或新的开始，为下一阶段做好准备。'
  ];
  
  // 根据具体的卦名提供更有针对性的解读
  const specificInterpretations: Record<string, string[]> = {
    '乾': [
      '创始之初，蓄积能量，稳扎稳打。',
      '稳步前行，保持谦逊，不要锋芒太露。',
      '保持警惕，认清潜在风险，避免冒进。',
      '审时度势，不宜过度用力，适当休整。',
      '居高位而不骄，leadership需要智慧。',
      '过犹不及，避免刚愎自用，适时收手。'
    ],
    '坤': [
      '厚积薄发，打好基础，静待时机。',
      '柔顺中保持原则，不盲从他人意见。',
      '耐心等待，不要急于求成，守正不阿。',
      '谨守本分，不要超越能力范围行事。',
      '谦虚服务，以柔克刚，以退为进。',
      '不要过度顺从，需保持自己的边界。'
    ]
  };
  
  if (hexagramName && specificInterpretations[hexagramName]) {
    return specificInterpretations[hexagramName][lineIndex] || defaultInterpretations[lineIndex];
  }
  
  return defaultInterpretations[lineIndex] || '此爻的变化提示您需要适应新的情况，并做出相应的调整。';
};

// 获取选项优点
const getOptionStrengths = (result: any, option: 'A' | 'B'): string => {
  const defaultStrengths = {
    'A': '符合当前能量场，能够发挥主动性和创造力。',
    'B': '更具适应性，能够顺应环境变化，灵活应对。'
  };
  
  if (!result || !result.hexagram) return defaultStrengths[option];
  
  const hexagram = result.hexagram;
  const isOptionARecommended = result.recommendation === 'A';
  const isOptionBRecommended = result.recommendation === 'B';
  
  // 根据卦象特性生成更有针对性的优点描述
  if (option === 'A') {
    if (isOptionARecommended) {
      return `符合${hexagram.chineseName}卦的${getHexagramNature(hexagram)}特性，能带来积极成效。`;
    } else {
      return `具有一定的主动性，但需要权衡当前形势是否适合行动。`;
    }
  } else {
    if (isOptionBRecommended) {
      return `符合${hexagram.chineseName}卦的${getHexagramNature(hexagram)}特性，更适合当前局势。`;
    } else {
      return `提供了另一种可能性，但需要评估是否符合长期发展需要。`;
    }
  }
};

// 获取选项注意点
const getOptionCautions = (result: any, option: 'A' | 'B'): string => {
  const defaultCautions = {
    'A': '可能过于刚强，需要注意灵活度和适应性。',
    'B': '可能过于被动，需要注意是否会错失主动权。'
  };
  
  if (!result || !result.hexagram) return defaultCautions[option];
  
  const hexagram = result.hexagram;
  const isOptionARecommended = result.recommendation === 'A';
  const isOptionBRecommended = result.recommendation === 'B';
  
  // 根据卦象特性生成更有针对性的注意点
  if (option === 'A') {
    if (isOptionARecommended) {
      return `即使选择这条路，也需注意${hexagram.chineseName}卦中提示的潜在挑战。`;
    } else {
      return `与${hexagram.chineseName}卦的能量不太相符，可能会遇到阻力。`;
    }
  } else {
    if (isOptionBRecommended) {
      return `虽然符合当前形势，仍需注意${hexagram.chineseName}卦中的警示。`;
    } else {
      return `与${hexagram.chineseName}卦的指引有所偏离，需谨慎考量。`;
    }
  }
};

// 获取新的 LLM 建议
const getLLMAdvice = (index: number, result: any): string => {
  if (!result || !result.hexagram) {
    return '请综合考虑自身情况和外部环境，做出平衡决策。';
  }
  
  const hexagram = result.hexagram;
  const changingLines = result.changingLines || [];
  const hasChangingLines = changingLines.length > 0;
  
  // 每个索引提供不同类型的建议
  switch (index) {
    case 1: // 当前形势
      if (hasChangingLines) {
        return `当前所处形势：${hexagram.chineseName}卦暗示您${
          hexagram.modernInterpretation?.split('，')[0] || '处于变化之中'
        }，正在向${result.relatedHexagram?.chineseName || ''}卦转变，建议顺应这个变化趋势。`;
      } else {
        return `当前所处形势：${hexagram.chineseName}卦代表${
          hexagram.modernInterpretation?.split('，')[0] || getHexagramNature(hexagram)
        }，建议在此基础上${getHexagramNature(hexagram).includes('稳定') ? '稳健前行' : '积极进取'}。`;
      }
    case 2: // 行动建议
      // 根据卦象特性给出行动建议
      const action = getActionByHexagram(hexagram.chineseName || '');
      if (result.recommendation === 'A' || result.recommendation === 'B') {
        const selectedOption = result.recommendation === 'A' ? optionA.value : optionB.value;
        return `行动建议：选择"${selectedOption}"更符合当前卦象能量，${action}`;
      } else {
        return `行动建议：${action}`;
      }
    case 3: // 需要注意的事项
      return `注意事项：${getCautionByHexagram(hexagram.chineseName || '')}`;
    default:
      return '按照易经智慧，顺势而为，不勉强，不逆行。';
  }
};

// 根据卦象提供行动建议
const getActionByHexagram = (hexagramName: string): string => {
  const actionMap: Record<string, string> = {
    '乾': '积极行动，但不要过于刚强，注意保持谦虚和开放的心态。',
    '坤': '保持耐心和包容，积累能量，等待合适的时机再行动。',
    '震': '勇敢面对变化和挑战，抓住新的机会，但不要操之过急。',
    '艮': '适当停下脚步，反思当前状况，调整方向后再继续前进。',
    '坎': '面对困难保持冷静，寻找智慧的解决方案，坚守内心真实。',
    '离': '保持明智的判断，不被表象迷惑，找出事物的本质再行动。',
    '兑': '加强沟通与交流，以开放的态度寻求合作与共识。',
    '巽': '以柔克刚，灵活应对各种情况，顺势而为不强求。',
    '蒙': '保持虚心学习的态度，寻求指导和启发，不要急于求成。',
    '颐': '注重自我修养和滋养，调整身心状态，为长期发展做准备。',
    '讼': '避免冲突和争执，寻求和平解决方案，不要卷入纷争。',
    '师': '有组织有纪律地行动，集中力量办大事，需做好充分准备。',
    '比': '寻求志同道合的伙伴，加强合作关系，共同进退。',
    '小畜': '循序渐进，积少成多，不要期望一蹴而就。',
    '履': '谨慎前行，一步一个脚印，注意细节和分寸。',
    '泰': '把握当前的大好时机，积极行动，开展新的计划。',
    '否': '保持耐心，暂时收敛锋芒，韬光养晦等待时机。'
  };
  
  // 寻找匹配的卦名
  for (const key in actionMap) {
    if (hexagramName.includes(key)) {
      return actionMap[key];
    }
  }
  
  return '根据卦象指引，合理规划行动方案，既不急躁冒进，也不过于犹豫。';
};

// 根据卦象提供注意事项
const getCautionByHexagram = (hexagramName: string): string => {
  const cautionMap: Record<string, string> = {
    '乾': '不要过于强硬，避免刚愎自用，注意倾听他人意见。',
    '坤': '不要过度顺从，保持自我边界，避免委屈求全。',
    '震': '不要盲目冲动，需谨慎评估风险，避免鲁莽行事。',
    '艮': '不要过于保守，适当突破自我限制，避免错失机会。',
    '坎': '不要畏惧困难，保持内心坚定，避免陷入消极情绪。',
    '离': '不要被表面现象迷惑，保持理性判断，避免过于感性。',
    '兑': '不要一味追求愉悦，保持适度克制，避免过度放纵。',
    '巽': '不要过于谦让，适当表达自我需求，避免委曲求全。',
    '蒙': '不要盲目听信他人，保持独立思考，避免受人蒙蔽。',
    '颐': '不要过度追求物质享受，注重心灵成长，避免奢靡浪费。',
    '讼': '不要卷入无谓争端，理性处理分歧，避免加剧冲突。',
    '师': '不要独断专行，尊重团队意见，避免刚愎自用。',
    '比': '不要盲目依赖他人，保持自主能力，避免失去独立性。',
    '小畜': '不要因小失大，着眼长远利益，避免短视行为。',
    '履': '不要忽视细节，注重过程管理，避免粗心大意。',
    '泰': '不要盲目乐观，适度防范风险，避免掉以轻心。',
    '否': '不要消极悲观，保持积极心态，避免错失转机。'
  };
  
  // 寻找匹配的卦名
  for (const key in cautionMap) {
    if (hexagramName.includes(key)) {
      return cautionMap[key];
    }
  }
  
  return '任何决策都有风险，需保持警觉，既不过度担忧，也不掉以轻心，保持适度的风险意识。';
};

// 获取最终智慧总结
const getFinalWisdom = (result: any): string => {
  if (!result || !result.hexagram) {
    return '万事万物皆有其节奏和规律，顺应自然，方能无往不利。';
  }
  
  const hexagram = result.hexagram;
  const hexagramName = hexagram.chineseName || '';
  
  // 根据不同卦象提供智慧总结
  const wisdomMap: Record<string, string> = {
    '乾': '乾卦代表天行健，君子以自强不息。当下需要积极进取，同时保持谦逊和自省。',
    '坤': '坤卦代表地势坤，君子以厚德载物。当下需要包容和耐心，积累能量，等待合适时机。',
    '震': '震卦代表雷霆行动，惊蛰启发。当下需要振奋精神，开创新局面，但应保持敬畏之心。',
    '艮': '艮卦代表山岳巍峨，止而不止。当下需要适当停顿和反思，但不意味着完全放弃前进。',
    '坎': '坎卦代表行险不失其信。当下可能面临挑战，需要坚守内心真实，智慧应对困境。',
    '离': '离卦代表光明显象。当下需要明辨是非，保持清晰判断，避免被表象迷惑。',
    '兑': '兑卦代表喜悦和沟通。当下需要保持愉悦心态，加强交流和表达，但不可过度放纵。',
    '巽': '巽卦代表谦逊和渗透。当下需要保持谦虚态度，温和而坚定地推进事情，避免强势。'
  };
  
  // 寻找匹配的卦名
  for (const key in wisdomMap) {
    if (hexagramName.includes(key)) {
      return wisdomMap[key];
    }
  }
  
  // 没有找到特定卦象的智慧，提供通用智慧
  return `${hexagramName}卦提示我们：${hexagram.modernInterpretation || hexagram.judgment || '万事万物皆有其时，顺应天时地利人和，方能获得成功'}。`;
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

/* 选项分析 */
.options-analysis {
  margin-bottom: 2rem;
}

.options-analysis-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
}

.option-analysis-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.option-analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.option-label {
  font-weight: 500;
  color: #ffffff;
  font-size: 0.95rem;
}

.option-score {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.option-analysis-content {
  padding: 1rem;
}

.option-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.option-details {
  margin-bottom: 1rem;
}

.option-strengths,
.option-cautions {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.detail-label {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.score-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  transition: width 1s ease;
}

/* 综合建议 */
.comprehensive-advice {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.advice-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.advice-icon {
  font-size: 1.5rem;
}

.advice-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.advice-content {
  color: rgba(255, 255, 255, 0.8);
}

.advice-intro {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.advice-list {
  list-style: disc;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.advice-list li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
  font-size: 0.9rem;
}

.wisdom-summary {
  background: rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  padding: 1rem;
}

.wisdom-title {
  color: #8b5cf6;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.wisdom-content {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
}

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
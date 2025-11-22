<template>
  <div class="triple-analysis-mvp">
    <!-- 问题输入区 -->
    <div class="question-input-section mb-6">
      <h3 class="section-title">输入你的问题</h3>
      <textarea
        v-model="question"
        placeholder="比如：我应该换工作吗？这段感情会有结果吗？..."
        class="question-input"
        rows="3"
        @keydown.enter.ctrl="analyze"
      ></textarea>
      <button
        class="analyze-button"
        :disabled="!question.trim() || isAnalyzing"
        @click="analyze"
      >
        <span v-if="!isAnalyzing">开始分析</span>
        <span v-else>分析中...</span>
      </button>
    </div>

    <!-- 分析结果区（Week 1 MVP：单系统主导+简要提示） -->
    <div v-if="analysisResult" class="analysis-result">
      <!-- 主要解读（单系统主导） -->
      <div class="main-analysis">
        <div class="analysis-header">
          <div class="system-icon">{{ getSystemIcon(analysisResult.primarySystem) }}</div>
          <h3 class="analysis-title">{{ getSystemName(analysisResult.primarySystem) }}解读</h3>
        </div>
        <div class="analysis-content">
          <p class="analysis-text">{{ analysisResult.primaryAnalysis }}</p>
        </div>
      </div>

      <!-- 其他视角（简要提示） -->
      <div v-if="analysisResult.secondaryHint" class="secondary-hint">
        <div class="hint-header">
          <span class="hint-icon">💡</span>
          <span class="hint-title">{{ getSystemName(analysisResult.secondarySystem) }}视角</span>
        </div>
        <p class="hint-text">{{ analysisResult.secondaryHint }}</p>
        <button
          class="expand-button"
          @click="showFullAnalysis = true"
          v-if="!showFullAnalysis"
        >
          想深入了解？点击展开详细分析
        </button>
      </div>

      <!-- 深度探索（用户主动触发，Week 2-3迭代） -->
      <div v-if="showFullAnalysis && analysisResult.fullAnalysis" class="full-analysis">
        <div class="analysis-header">
          <div class="system-icon">🔮</div>
          <h3 class="analysis-title">完整三维分析</h3>
        </div>
        <div class="analysis-content">
          <p class="analysis-text">{{ analysisResult.fullAnalysis }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QuestionClassifierService } from '../../../shared/services/crossSystemService';
import { useZiweiStore } from '../store/ziweiStore';
import { convertPalaceIdToName } from '../utils/typeAdapter';
import type { QuestionType } from '../../../shared/types/cross-system';

// Week 1 MVP：5个核心场景模板
const SCENARIO_TEMPLATES: Record<string, {
  primarySystem: 'ziwei' | 'yijing';
  primaryAnalysis: string;
  secondarySystem: 'ziwei' | 'yijing';
  secondaryHint: string;
}> = {
  'career': {
    primarySystem: 'ziwei',
    primaryAnalysis: '根据你的命盘分析，官禄宫显示你在事业方面具有【XX特质】。当前流年显示【XX时机】较好，适合【XX行动】。',
    secondarySystem: 'yijing',
    secondaryHint: '易经角度：当前卦象显示宜静不宜动。'
  },
  'love': {
    primarySystem: 'ziwei',
    primaryAnalysis: '你的夫妻宫显示【XX特质】，在感情方面【XX倾向】。当前流年对感情运势【XX影响】。',
    secondarySystem: 'yijing',
    secondaryHint: '易经角度：当前时机对感情发展【XX建议】。'
  },
  'wealth': {
    primarySystem: 'ziwei',
    primaryAnalysis: '财帛宫分析显示你在财运方面【XX特征】。当前流年四化显示【XX影响】，建议【XX策略】。',
    secondarySystem: 'yijing',
    secondaryHint: '易经角度：当前卦象对财运【XX提示】。'
  },
  'health': {
    primarySystem: 'ziwei',
    primaryAnalysis: '疾厄宫显示你的健康状况【XX特征】。当前流年需要注意【XX方面】。',
    secondarySystem: 'yijing',
    secondaryHint: '易经角度：当前时令对健康【XX建议】。'
  },
  'study': {
    primarySystem: 'ziwei',
    primaryAnalysis: '父母宫（文昌位）显示你在学习方面【XX特质】。当前流年对学业【XX影响】。',
    secondarySystem: 'yijing',
    secondaryHint: '易经角度：当前时机对学习【XX建议】。'
  }
};

interface AnalysisResult {
  primarySystem: 'ziwei' | 'yijing';
  primaryAnalysis: string;
  secondarySystem: 'ziwei' | 'yijing';
  secondaryHint: string;
  fullAnalysis?: string; // Week 2-3迭代
}

const question = ref('');
const isAnalyzing = ref(false);
const analysisResult = ref<AnalysisResult | null>(null);
const showFullAnalysis = ref(false);

const ziweiStore = useZiweiStore();

// 获取系统图标
const getSystemIcon = (system: 'ziwei' | 'yijing'): string => {
  return system === 'ziwei' ? '🌟' : '☯️';
};

// 获取系统名称
const getSystemName = (system: 'ziwei' | 'yijing'): string => {
  return system === 'ziwei' ? '紫微系统' : '易经系统';
};

// 分析问题
const analyze = async () => {
  if (!question.value.trim()) return;

  isAnalyzing.value = true;
  showFullAnalysis.value = false;

  try {
    // 1. 问题分类
    const classification = QuestionClassifierService.classify(question.value);
    console.log('📊 问题分类结果:', classification);

    // 2. 检查是否有命盘
    const hasChart = !!ziweiStore.currentChart;

    // 3. Week 1 MVP：使用规则引擎+模板
    const questionType = classification.type;
    const template = SCENARIO_TEMPLATES[questionType] || SCENARIO_TEMPLATES['career'];

    // 4. 生成主要解读（单系统主导）
    let primaryAnalysis = template.primaryAnalysis;
    
    // 如果有命盘，可以基于命盘数据优化解读
    if (hasChart && template.primarySystem === 'ziwei') {
      const chart = ziweiStore.currentChart;
      const palaceId = QuestionClassifierService.getPalaceByQuestionType(questionType);
      const palaceName = convertPalaceIdToName(palaceId);
      const relatedPalace = chart.palaces.find(p => p.name === palaceName) || chart.palaces[0];
      
      // 简化版：基于宫位主星生成解读
      const mainStars = relatedPalace.stars.filter(s => s.category === '主星');
      if (mainStars.length > 0) {
        primaryAnalysis = `根据你的命盘分析，${relatedPalace.name}有${mainStars.map(s => s.name).join('、')}等主星，显示你在${getQuestionTypeName(questionType)}方面具有【${mainStars[0].name}】的特质。当前流年显示时机较好，适合采取行动。`;
      }
    }

    // 5. 生成简要提示（另一系统）
    const secondaryHint = template.secondaryHint;

    analysisResult.value = {
      primarySystem: template.primarySystem,
      primaryAnalysis,
      secondarySystem: template.secondarySystem,
      secondaryHint
    };

    // 认知阶梯埋点：使用三维解读
    const { trackCognitiveLadder } = await import('../utils/cognitiveLadderTracking');
    trackCognitiveLadder('triple_analysis_use', {
      questionType,
      primarySystem: template.primarySystem
    });

  } catch (error) {
    console.error('❌ 分析失败:', error);
    alert('分析失败，请稍后重试');
  } finally {
    isAnalyzing.value = false;
  }
};

// 获取问题类型中文名称
const getQuestionTypeName = (type: QuestionType): string => {
  const map: Record<QuestionType, string> = {
    career: '事业',
    wealth: '财运',
    love: '感情',
    marriage: '婚姻',
    health: '健康',
    study: '学习',
    family: '家庭',
    friendship: '友情',
    travel: '出行',
    property: '房产',
    general: '一般'
  };
  return map[type] || '一般';
};
</script>

<style scoped>
.triple-analysis-mvp {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.question-input-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.question-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid rgba(139, 92, 246, 0.2);
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 1rem;
}

.question-input:focus {
  outline: none;
  border-color: rgba(139, 92, 246, 0.5);
}

.analyze-button {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #9333EA 0%, #3B82F6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.analyze-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.4);
}

.analyze-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.analysis-result {
  margin-top: 2rem;
}

.main-analysis {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(147, 51, 234, 0.3);
  margin-bottom: 1rem;
}

.analysis-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.system-icon {
  font-size: 2rem;
}

.analysis-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.analysis-content {
  color: #666;
  line-height: 1.8;
}

.analysis-text {
  font-size: 1rem;
  margin: 0;
}

.secondary-hint {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  margin-bottom: 1rem;
}

.hint-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.hint-icon {
  font-size: 1.25rem;
}

.hint-title {
  font-size: 1rem;
  font-weight: 600;
  color: #3B82F6;
}

.hint-text {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.expand-button {
  width: 100%;
  padding: 0.5rem;
  background: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.expand-button:hover {
  background: rgba(59, 130, 246, 0.2);
}

.full-analysis {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(147, 51, 234, 0.3);
  margin-top: 1rem;
}
</style>


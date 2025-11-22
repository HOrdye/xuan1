<template>
  <div class="summary-panel">
    <!-- 模式选择器 -->
    <div v-if="summaryResult" class="mode-selector">
      <n-button-group>
        <n-button
          :type="analysisMode === 'quick' ? 'primary' : 'default'"
          @click="analysisMode = 'quick'"
          size="small"
        >
          <template #icon>
            <span>⚡</span>
          </template>
          快速诊断
        </n-button>
        <n-button
          :type="analysisMode === 'deep' ? 'primary' : 'default'"
          @click="analysisMode = 'deep'"
          size="small"
        >
          <template #icon>
            <span>🔮</span>
          </template>
          深度探索
        </n-button>
      </n-button-group>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <n-spin size="large">
        <template #description>
          <span>正在分析你的命盘...</span>
        </template>
      </n-spin>
    </div>

    <!-- 总结内容 -->
    <div v-else-if="summaryResult" class="summary-content">
      <!-- 核心洞察卡片（突出显示） -->
      <div class="insight-card">
        <div class="insight-header">
          <div class="insight-icon-wrapper">
            <span class="insight-icon">💎</span>
          </div>
          <div class="insight-title-group">
            <h2 class="insight-title">核心洞察</h2>
            <p class="insight-subtitle">你的命盘关键信息</p>
          </div>
        </div>
        <div class="insight-content">
          <div class="summary-text-highlight">
            {{ getShortenedSummary(summaryResult.summaryText) }}
          </div>
        </div>
      </div>

      <!-- 核心标签（快速模式显示，深度模式可折叠） -->
      <div v-if="summaryResult.coreTags.length > 0" class="core-tags-section">
        <div class="section-header-collapsible" @click="tagsExpanded = !tagsExpanded">
          <span class="section-title">核心标签</span>
          <span class="collapse-icon">{{ tagsExpanded ? '▼' : '▶' }}</span>
        </div>
        <div v-show="tagsExpanded || analysisMode === 'quick'" class="core-tags">
          <div
            v-for="(tag, index) in summaryResult.coreTags"
            :key="index"
            :class="['tag', tag.type]"
          >
            <span class="tag-icon">{{ tag.icon }}</span>
            <span class="tag-text">{{ tag.text }}</span>
          </div>
        </div>
      </div>

      <!-- 综合评分（快速模式显示，深度模式可折叠） -->
      <div class="score-section">
        <div class="section-header-collapsible" @click="scoreExpanded = !scoreExpanded">
          <span class="section-title">综合评分</span>
          <span class="collapse-icon">{{ scoreExpanded ? '▼' : '▶' }}</span>
        </div>
        <div v-show="scoreExpanded || analysisMode === 'quick'" class="score-card">
          <div class="score-header">
            <span class="score-label">综合评分</span>
            <span class="score-value">{{ summaryResult.overallScore }}分</span>
          </div>
          <div class="score-bar">
            <div 
              class="score-fill" 
              :style="{ width: `${summaryResult.overallScore}%` }"
              :class="getScoreClass(summaryResult.overallScore)"
            ></div>
          </div>
          <div class="score-hint">
            {{ getScoreHint(summaryResult.overallScore) }}
          </div>
        </div>
      </div>

      <!-- 详细分析（深度模式显示，默认折叠） -->
      <div v-if="analysisMode === 'deep'" class="detailed-analysis-section">
        <div class="section-header-collapsible" @click="detailedExpanded = !detailedExpanded">
          <span class="section-title">详细分析</span>
          <span class="collapse-icon">{{ detailedExpanded ? '▼' : '▶' }}</span>
        </div>
        <div v-show="detailedExpanded" class="detailed-content">
          <div class="summary-description">
            {{ summaryResult.summaryDescription }}
          </div>
          <div class="full-summary-text">
            {{ summaryResult.summaryText }}
          </div>
          <!-- 付费墙提示（深度模式详细分析后显示） -->
          <div class="paywall-prompt">
            <div class="prompt-content">
              <span class="prompt-icon">🔮</span>
              <div class="prompt-text">
                <div class="prompt-title">想获得更深入的AI分析？</div>
                <div class="prompt-subtitle">解锁AI深度解读、无限次解读、个性化建议等高级功能</div>
              </div>
            </div>
            <n-button
              type="primary"
              size="small"
              @click="showPaywall = true"
              class="prompt-button"
            >
              立即升级
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <n-alert type="error" :show-icon="true">
        {{ error }}
      </n-alert>
    </div>

    <!-- 付费墙弹窗 -->
    <PaywallModal
      v-model:show="showPaywall"
      title="解锁深度解读功能"
      value-title="升级会员，解锁AI深度解读"
      value-description="获得AI深度分析、无限次解读、个性化建议、大运导航等高级功能"
      :features="paywallFeatures"
      @upgrade="handleUpgrade"
      @later="handleLater"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { NSpin, NAlert, NButton, NButtonGroup } from 'naive-ui';
import type { ZiweiChart } from '../types';
import { generateSummaryResult, type SummaryResult } from '../utils/summaryGenerator';
import PaywallModal from './PaywallModal.vue';

const props = defineProps<{
  chartData: ZiweiChart | null;
}>();

const loading = ref(false);
const error = ref<string | null>(null);
const summaryResult = ref<SummaryResult | null>(null);

// 模式选择：快速诊断 / 深度探索
const analysisMode = ref<'quick' | 'deep'>('quick');

// 折叠状态
const tagsExpanded = ref(true);
const scoreExpanded = ref(true);
const detailedExpanded = ref(false); // 详细分析默认折叠

// 付费墙状态
const showPaywall = ref(false);

// 付费墙功能列表
const paywallFeatures = [
  { name: '基础排盘', free: true },
  { name: '快速诊断', free: true },
  { name: '每日3次解读', free: true },
  { name: 'AI深度解读', free: false },
  { name: '无限次解读', free: false },
  { name: '三维综合分析', free: false },
  { name: '个性化建议', free: false },
  { name: '大运导航', free: false },
];

/**
 * 简化文本（减少30%）
 */
const getShortenedSummary = (text: string): string => {
  if (!text) return '';
  // 如果文本超过100字，截取前70%并添加省略号
  if (text.length > 100) {
    const targetLength = Math.floor(text.length * 0.7);
    const lastPeriod = text.lastIndexOf('。', targetLength);
    if (lastPeriod > 0) {
      return text.substring(0, lastPeriod + 1);
    }
    return text.substring(0, targetLength) + '...';
  }
  return text;
};

/**
 * 处理升级
 */
const handleUpgrade = () => {
  console.log('🚀 用户点击升级');
  // TODO: 集成实际的支付流程
  // 这里可以跳转到支付页面或打开支付弹窗
};

/**
 * 处理稍后再说
 */
const handleLater = () => {
  console.log('⏸️ 用户选择稍后再说');
  // 可以记录用户行为，用于后续优化
};

/**
 * 生成总结
 */
const generateSummary = async () => {
  if (!props.chartData) {
    summaryResult.value = null;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const result = await generateSummaryResult(props.chartData);
    summaryResult.value = result;
  } catch (err) {
    console.error('❌ 生成总结失败:', err);
    error.value = '生成总结时出现错误，请稍后重试';
  } finally {
    loading.value = false;
  }
};

/**
 * 获取评分等级样式类
 */
const getScoreClass = (score: number): string => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'normal';
  return 'poor';
};

/**
 * 获取评分提示文字
 */
const getScoreHint = (score: number): string => {
  if (score >= 80) return '命盘整体非常优秀，各方面运势都很好';
  if (score >= 60) return '命盘整体良好，有不错的运势基础';
  if (score >= 40) return '命盘整体中等，需要努力把握机会';
  return '命盘整体需要关注，建议多注意各方面平衡';
};

// 监听命盘数据变化
watch(
  () => props.chartData,
  () => {
    generateSummary();
  },
  { immediate: true, deep: true }
);

// 组件挂载时生成总结
onMounted(() => {
  if (props.chartData) {
    generateSummary();
  }
});
</script>

<style scoped>
.summary-panel {
  width: 100%;
  margin-bottom: 2rem;
}

/* 模式选择器 */
.mode-selector {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* 核心洞察卡片（突出显示） */
.insight-card {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  border: 2px solid rgba(147, 51, 234, 0.3);
  box-shadow: 0 20px 40px rgba(147, 51, 234, 0.15);
  position: relative;
  overflow: hidden;
}

.insight-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #9333EA 0%, #3B82F6 100%);
}

.insight-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.insight-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #9333EA 0%, #3B82F6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(147, 51, 234, 0.3);
}

.insight-icon {
  font-size: 2rem;
}

.insight-title-group {
  flex: 1;
}

.insight-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
  background: linear-gradient(135deg, #9333EA 0%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.insight-subtitle {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
  font-weight: 500;
}

.insight-content {
  margin-top: 1rem;
}

.summary-text-highlight {
  font-size: 1.25rem;
  line-height: 1.8;
  color: #1a1a1a;
  font-weight: 600;
  letter-spacing: 0.01em;
}

/* 可折叠区域 */
.core-tags-section,
.score-section,
.detailed-analysis-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.25rem;
  border: 1px solid rgba(139, 92, 246, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section-header-collapsible {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0;
  user-select: none;
  transition: all 0.2s ease;
}

.section-header-collapsible:hover {
  opacity: 0.8;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.collapse-icon {
  font-size: 0.875rem;
  color: #666;
  transition: transform 0.2s ease;
}

.summary-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.full-summary-text {
  font-size: 1rem;
  line-height: 1.8;
  color: #444;
}

/* 核心标签 */
.core-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
  margin-top: 1rem;
}

.tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.125rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.tag.advantage {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
  border: 1.5px solid rgba(34, 197, 94, 0.25);
}

.tag.advantage:hover {
  background: rgba(34, 197, 94, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.25);
}

.tag.attention {
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
  border: 1.5px solid rgba(245, 158, 11, 0.25);
}

.tag.attention:hover {
  background: rgba(245, 158, 11, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
}

.tag-icon {
  font-size: 1.1rem;
}

.tag-text {
  font-weight: 600;
}

/* 综合评分 */
.score-card {
  margin-top: 1rem;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.score-label {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.score-value {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #9333EA 0%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.score-bar {
  width: 100%;
  height: 10px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.score-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.8s ease;
}

.score-fill.excellent {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.score-fill.good {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.score-fill.normal {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.score-fill.poor {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

.score-hint {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.6;
}

/* 详细分析区域 */
.detailed-content {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(139, 92, 246, 0.1);
}

/* 付费墙提示 */
.paywall-prompt {
  margin-top: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%);
  border-radius: 12px;
  border: 1px solid rgba(147, 51, 234, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.prompt-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.prompt-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.prompt-text {
  flex: 1;
}

.prompt-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.prompt-subtitle {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
}

.prompt-button {
  flex-shrink: 0;
  background: linear-gradient(135deg, #9333EA 0%, #3B82F6 100%);
  border: none;
  font-weight: 600;
}

@media (max-width: 768px) {
  .paywall-prompt {
    flex-direction: column;
    align-items: stretch;
  }

  .prompt-button {
    width: 100%;
  }
}

.error-state {
  padding: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .insight-card {
    padding: 1.5rem;
  }

  .insight-title {
    font-size: 1.5rem;
  }

  .summary-text-highlight {
    font-size: 1.1rem;
  }

  .score-value {
    font-size: 1.5rem;
  }

  .mode-selector {
    justify-content: center;
  }
}
</style>


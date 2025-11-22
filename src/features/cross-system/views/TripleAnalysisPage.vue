<template>
  <div class="triple-analysis-page min-h-screen relative overflow-hidden">
    <!-- 动态背景 -->
    <div class="cosmic-background">
      <div class="stars-layer"></div>
      <div class="nebula-layer"></div>
      <div class="energy-particles"></div>
    </div>

    <!-- 页面内容 -->
    <div class="relative z-10 p-4 pb-20 pt-20">
      <!-- 页面标题区域 -->
      <div class="hero-section mb-8">
        <div class="title-container">
          <h1 class="main-title mystical-glow">
            <span class="title-icon">🔮</span>
            <span class="title-text">三维决策系统</span>
          </h1>
          <p class="subtitle">易经·紫微·塔罗<br>三个维度，一个答案</p>
          <div class="title-decoration">
            <div class="decoration-line"></div>
            <div class="decoration-symbol">⚡</div>
            <div class="decoration-line"></div>
          </div>
        </div>
      </div>

      <!-- 模式选择区（仅在无结果时显示） -->
      <div v-if="!hasResults" class="mode-selection-section mb-6">
        <div class="section-header">
          <h3 class="section-title">选择分析模式</h3>
          <p class="section-description">根据你的需求选择最适合的分析深度</p>
        </div>
        <div class="mode-grid">
          <div
            class="mode-card"
            :class="{ active: analysisMode === 'quick' }"
            @click="analysisMode = 'quick'"
          >
            <div class="mode-icon">⚡</div>
            <h4 class="mode-title">快速诊断</h4>
            <p class="mode-description">30秒获取核心结论<br>适合快速决策</p>
          </div>
          <div
            class="mode-card"
            :class="{ active: analysisMode === 'deep' }"
            @click="analysisMode = 'deep'"
          >
            <div class="mode-icon">🔍</div>
            <h4 class="mode-title">深度探索</h4>
            <p class="mode-description">完整三维分析<br>包含详细解读</p>
          </div>
        </div>
      </div>

      <!-- 问题输入区 -->
      <div class="question-input-section mb-8">
        <div class="section-header">
          <h3 class="section-title">输入你的问题</h3>
          <p class="section-description">让三个古老的智慧系统为你提供全方位的指引</p>
        </div>
        <div class="input-wrapper">
          <textarea
            v-model="question"
            placeholder="比如：我是否应该换工作？这段感情会有结果吗？投资这个项目合适吗？..."
            class="question-input"
            rows="4"
            @keydown.enter.ctrl="analyze"
          ></textarea>
          <div class="input-focus-border"></div>
        </div>
        <div class="action-buttons mt-4">
          <button
            class="analyze-button primary"
            :disabled="!question.trim() || isAnalyzing || selectedSystems.length === 0"
            @click="analyze"
          >
            <span v-if="!isAnalyzing">{{ analysisMode === 'quick' ? '快速诊断' : '开始三维分析' }}</span>
            <span v-else class="loading-text">
              <span class="spinner"></span>
              正在分析中...
            </span>
          </button>
          <button
            class="analyze-button secondary"
            @click="clearResults"
            :disabled="!hasResults"
          >
            清空结果
          </button>
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="error-message mt-4">
          <div class="error-icon">⚠️</div>
          <div class="error-text">{{ errorMessage }}</div>
        </div>
      </div>

      <!-- 系统选择区 -->
      <div v-if="!hasResults" class="system-selection-section mb-8">
        <div class="section-header">
          <h3 class="section-title">选择分析系统</h3>
          <p class="section-description">可以选择一个或多个系统进行分析</p>
        </div>
        <div class="system-grid">
          <div
            v-for="system in systems"
            :key="system.id"
            class="system-card"
            :class="{ active: selectedSystems.includes(system.id) }"
            @click="toggleSystem(system.id)"
          >
            <div class="system-icon">{{ system.icon }}</div>
            <h4 class="system-name">{{ system.name }}</h4>
            <p class="system-description">{{ system.description }}</p>
            <div class="system-badge" v-if="selectedSystems.includes(system.id)">
              ✓ 已选择
            </div>
          </div>
        </div>

        <!-- 综合分析选项 -->
        <div v-if="selectedSystems.length > 1" class="integrated-option-section mt-6">
          <div class="integrated-option-card">
            <div class="option-header">
              <div class="option-icon">🔮</div>
              <div class="option-content">
                <h4 class="option-title">综合分析决策</h4>
                <p class="option-description">
                  将多个系统的分析结果进行综合，生成统一的决策建议和优先行动清单
                </p>
              </div>
            </div>
            <div class="option-switch">
              <label class="switch">
                <input
                  type="checkbox"
                  v-model="enableIntegratedAnalysis"
                  :disabled="selectedSystems.length < 2"
                >
                <span class="slider"></span>
              </label>
              <span class="switch-label">
                {{ enableIntegratedAnalysis ? '已启用' : '未启用' }}
              </span>
            </div>
          </div>
          <div v-if="enableIntegratedAnalysis" class="integrated-hint">
            <p>✨ 综合分析将包括：一致性分析、综合洞察、优先行动建议</p>
          </div>
        </div>
      </div>

      <!-- 分析结果区 -->
      <div v-if="hasResults" class="results-section">
        <!-- 步骤指示器：渐进式引导 -->
        <div class="step-indicator">
          <div class="step-item" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
            <div class="step-number">1</div>
            <div class="step-label">核心洞察</div>
          </div>
          <div class="step-connector" :class="{ active: currentStep > 1 }"></div>
          <div class="step-item" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
            <div class="step-number">2</div>
            <div class="step-label">行动建议</div>
          </div>
          <div class="step-connector" :class="{ active: currentStep > 2 }"></div>
          <div class="step-item" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
            <div class="step-number">3</div>
            <div class="step-label">详细分析</div>
          </div>
        </div>

        <!-- 阅读进度指示器 -->
        <div class="reading-progress-indicator">
          <div class="progress-header">
            <span class="progress-label">阅读进度</span>
            <span class="progress-percentage">{{ readingProgress }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: readingProgress + '%' }"></div>
          </div>
          <div class="progress-hint">
            <span v-if="readingProgress < 30">💡 先看核心洞察，快速了解结论</span>
            <span v-else-if="readingProgress < 60">📋 查看行动建议，明确下一步</span>
            <span v-else-if="readingProgress < 90">🔍 深入了解详细分析</span>
            <span v-else>✨ 完整阅读，获得全面洞察</span>
          </div>
        </div>

        <!-- 核心洞察卡片（优先显示，仅在综合分析模式显示） -->
        <div
          v-if="analysisResult.integratedInsight && enableIntegratedAnalysis && (analysisMode === 'quick' || analysisMode === 'deep')"
          class="core-insight-card mb-6"
        >
          <div class="core-insight-header">
            <div class="insight-icon">💡</div>
            <h2 class="core-insight-title">核心洞察</h2>
          </div>
          <div class="core-insight-content">
            <!-- 核心结论：简化展示，突出最关键信息 -->
            <div class="insight-conclusion">
              <div class="conclusion-icon">✨</div>
              <div class="conclusion-text">{{ getSimplifiedConclusion() }}</div>
            </div>
            
            <!-- 关键要点：最多3条，使用简洁语言 -->
            <div v-if="getSimplifiedKeyPoints().length > 0" class="key-points">
              <div
                v-for="(point, index) in getSimplifiedKeyPoints()"
                :key="index"
                class="key-point-item"
              >
                <div class="point-badge">{{ index + 1 }}</div>
                <div class="point-content">
                  <div class="point-label">{{ point.label }}</div>
                  <div class="point-value">{{ point.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 简要建议卡片（仅在综合分析模式显示） -->
        <div
          v-if="analysisResult.integratedInsight && enableIntegratedAnalysis && analysisResult.integratedInsight.priorityActions.length > 0 && (analysisMode === 'quick' || analysisMode === 'deep')"
          class="quick-advice-card mb-6"
        >
          <div class="advice-header">
            <div class="advice-icon">🎯</div>
            <h3 class="advice-title">行动建议</h3>
          </div>
          <div class="advice-list">
            <div
              v-for="(action, index) in analysisResult.integratedInsight.priorityActions.slice(0, 3)"
              :key="index"
              class="advice-item"
              :class="action.priority"
            >
              <div class="advice-priority-indicator" :class="action.priority">
                <span class="priority-icon">{{ getPriorityIcon(action.priority) }}</span>
              </div>
              <div class="advice-content">
                <div class="advice-number">{{ index + 1 }}</div>
                <div class="advice-text-wrapper">
                  <div class="advice-text">{{ action.action }}</div>
                  <div v-if="action.reason" class="advice-reason">{{ action.reason }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 多维度分析卡片（可折叠，默认折叠） -->
        <div
          v-if="analysisResult.integratedInsight && enableIntegratedAnalysis"
          class="multi-dimension-analysis mb-6"
        >
          <div class="dimension-toggle" @click="toggleDimensionsExpanded">
            <h3 class="dimension-section-title">多维度分析</h3>
            <span class="toggle-icon">{{ dimensionsExpanded ? '▼' : '▶' }}</span>
          </div>
          <div v-if="dimensionsExpanded" class="dimensions-content">
          <!-- 一致性分析 -->
          <div class="dimension-card consistency-card">
            <div class="dimension-header">
              <h3 class="dimension-title">一致性分析</h3>
              <div
                class="dimension-badge"
                :class="analysisResult.integratedInsight.consistency.level"
              >
                {{ getConsistencyText(analysisResult.integratedInsight.consistency.level) }}
              </div>
            </div>
            <div class="dimension-content">
              <div class="dimension-score">
                <span class="score-label">一致性评分</span>
                <span class="score-value">
                  {{ Math.round(analysisResult.integratedInsight.consistency.score) }}分
                </span>
              </div>
              <p class="dimension-analysis">
                {{ analysisResult.integratedInsight.consistency.analysis }}
              </p>
            </div>
          </div>

          <!-- 冲突性分析 -->
          <div v-if="analysisResult.integratedInsight?.conflict" class="dimension-card conflict-card">
            <div class="dimension-header">
              <h3 class="dimension-title">冲突性分析</h3>
              <div
                class="dimension-badge"
                :class="analysisResult.integratedInsight.conflict.hasConflict ? 'has-conflict' : 'no-conflict'"
              >
                {{ analysisResult.integratedInsight.conflict.hasConflict ? '存在冲突' : '无冲突' }}
              </div>
            </div>
            <div class="dimension-content">
              <p class="dimension-analysis">
                {{ analysisResult.integratedInsight.conflict.analysis }}
              </p>
            </div>
          </div>

          <!-- 互补性分析 -->
          <div v-if="analysisResult.integratedInsight?.complementarity" class="dimension-card complementarity-card">
            <div class="dimension-header">
              <h3 class="dimension-title">互补性分析</h3>
              <div class="dimension-badge complementarity">
                互补视角
              </div>
            </div>
            <div class="dimension-content">
              <p class="dimension-analysis">
                {{ analysisResult.integratedInsight.complementarity.analysis }}
              </p>
            </div>
          </div>
          </div>
        </div>

        <!-- 三个系统结果（可折叠，默认折叠） -->
        <div class="systems-section mb-6">
          <div class="systems-toggle" @click="toggleSystemsExpanded">
            <h3 class="systems-section-title">详细分析</h3>
            <span class="toggle-icon">{{ systemsExpanded ? '▼' : '▶' }}</span>
          </div>
          <div v-if="systemsExpanded" class="systems-results-grid">
          <!-- 易经结果 -->
          <div v-if="analysisResult.yijing || systemLoadingStates.yijing" class="system-result-card yijing">
            <div class="result-header">
              <div class="result-icon">☯️</div>
              <h3 class="result-title">易经占卜</h3>
              <div v-if="systemLoadingStates.yijing" class="system-loading">
                <span class="mini-spinner"></span>
              </div>
            </div>
            <div v-if="systemLoadingStates.yijing" class="loading-placeholder">
              正在生成卦象和解读...
            </div>
            <div v-if="systemErrors.yijing" class="system-error">
              ⚠️ {{ systemErrors.yijing }}
            </div>
            <div v-if="analysisResult.yijing" class="result-content">
              <div v-if="analysisResult.yijing.hexagram" class="hexagram-info">
                <div class="hexagram-name">
                  {{ analysisResult.yijing.hexagram.name }}
                  <span class="hexagram-number">({{ analysisResult.yijing.hexagram.number }})</span>
                </div>
                <div class="hexagram-symbol">{{ analysisResult.yijing.hexagram.symbol }}</div>
              </div>
              <div class="result-interpretation">
                <h4 class="interpretation-title">卦象解读</h4>
                <div class="interpretation-content">
                  <p>{{ simplifyText(analysisResult.yijing.interpretation) }}</p>
                </div>
              </div>
              <div class="result-advice">
                <h4 class="advice-title">建议</h4>
                <div class="advice-content-text">
                  <p>{{ simplifyText(analysisResult.yijing.advice) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 紫微结果 -->
          <div v-if="analysisResult.ziwei || systemLoadingStates.ziwei" class="system-result-card ziwei">
            <div class="result-header">
              <div class="result-icon">🌟</div>
              <h3 class="result-title">紫微命盘</h3>
              <div v-if="systemLoadingStates.ziwei" class="system-loading">
                <span class="mini-spinner"></span>
              </div>
            </div>
            <div v-if="systemLoadingStates.ziwei" class="loading-placeholder">
              正在分析命盘和宫位...
            </div>
            <div v-if="systemErrors.ziwei" class="system-error">
              ⚠️ {{ systemErrors.ziwei }}
            </div>
            <div v-if="analysisResult.ziwei" class="result-content">
              <div v-if="analysisResult.ziwei.relatedPalace" class="palace-info">
                <div class="palace-name">相关宫位：{{ getPalaceName(analysisResult.ziwei.relatedPalace) }}</div>
              </div>
              <div class="result-analysis">
                <h4 class="analysis-title">命盘分析</h4>
                <div class="analysis-content-text">
                  <p>{{ simplifyText(analysisResult.ziwei.analysis) }}</p>
                </div>
              </div>
              <div class="result-advice">
                <h4 class="advice-title">建议</h4>
                <div class="advice-content-text">
                  <p>{{ simplifyText(analysisResult.ziwei.advice) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 塔罗结果 -->
          <div v-if="analysisResult.tarot || systemLoadingStates.tarot" class="system-result-card tarot">
            <div class="result-header">
              <div class="result-icon">🃏</div>
              <h3 class="result-title">塔罗指引</h3>
              <div v-if="systemLoadingStates.tarot" class="system-loading">
                <span class="mini-spinner"></span>
              </div>
            </div>
            <div v-if="systemLoadingStates.tarot" class="loading-placeholder">
              正在抽取塔罗牌和解读...
            </div>
            <div v-if="systemErrors.tarot" class="system-error">
              ⚠️ {{ systemErrors.tarot }}
            </div>
            <div v-if="analysisResult.tarot" class="result-content">
              <div v-if="analysisResult.tarot.cards && analysisResult.tarot.cards.length > 0" class="tarot-cards">
                <div
                  v-for="(card, index) in analysisResult.tarot.cards"
                  :key="index"
                  class="tarot-card-item"
                >
                  <div class="card-position">{{ card.position }}</div>
                  <div class="card-name">{{ card.name }}</div>
                  <div class="card-meaning">{{ card.meaning }}</div>
                </div>
              </div>
              <div class="result-interpretation">
                <h4 class="interpretation-title">整体解读</h4>
                <div class="interpretation-content">
                  <p>{{ simplifyText(analysisResult.tarot.overallInterpretation) }}</p>
                </div>
              </div>
              <div class="result-advice">
                <h4 class="advice-title">建议</h4>
                <div class="advice-content-text">
                  <p>{{ simplifyText(analysisResult.tarot.advice) }}</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <!-- AI综合洞察（会员专享） -->
        <div
          v-if="analysisResult.integratedInsight && enableIntegratedAnalysis"
          class="integrated-insight-card premium-section"
          :class="{ 'premium-locked': !isPremium }"
        >
          <div class="premium-badge" :class="{ 'premium-active': isPremium }">
            {{ isPremium ? '✨ 会员专享' : '🔐 会员专享' }}
          </div>
          
          <!-- 会员状态显示 -->
          <div v-if="isPremium" class="member-status-badge">
            <span class="status-icon">👑</span>
            <span class="status-text">{{ subscriptionTier === 'premium' ? '会员版' : '高级版' }}</span>
          </div>

          <div class="insight-header">
            <h3 class="insight-title">✨ AI综合洞察</h3>
            <div v-if="isPremium" class="insight-confidence">
              置信度：{{ Math.round(analysisResult.integratedInsight.confidence) }}%
            </div>
          </div>

          <!-- 非会员：显示预览和升级提示 -->
          <div v-if="!isPremium" class="premium-preview">
            <div class="preview-overlay">
              <div class="preview-content">
                <div class="preview-icon">🔒</div>
                <h4 class="preview-title">AI综合洞察需要会员权限</h4>
                <p class="preview-description">
                  升级会员即可解锁AI综合分析、30天动态趋势预测、专家复核等高级功能
                </p>
                
                <!-- 价值对比表格 -->
                <div class="value-comparison-table">
                  <h4 class="comparison-title">📊 会员专属价值</h4>
                  <table class="comparison-table">
                    <thead>
                      <tr>
                        <th>功能</th>
                        <th>免费版</th>
                        <th>会员版</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>分析维度</td>
                        <td>2个系统</td>
                        <td><strong>3个系统</strong></td>
                      </tr>
                      <tr>
                        <td>信息深度</td>
                        <td>基础解读</td>
                        <td><strong>完整分析</strong></td>
                      </tr>
                      <tr>
                        <td>AI综合洞察</td>
                        <td>❌ 无</td>
                        <td><strong>✅ 完整分析</strong></td>
                      </tr>
                      <tr>
                        <td>时间预测</td>
                        <td>❌ 无</td>
                        <td><strong>✅ 30天动态趋势</strong></td>
                      </tr>
                      <tr>
                        <td>专家支持</td>
                        <td>❌ 无</td>
                        <td><strong>✅ 每周1次复核</strong></td>
                      </tr>
                      <tr>
                        <td>使用次数</td>
                        <td>每日3次</td>
                        <td><strong>无限次</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- CTA按钮 -->
                <div class="premium-cta">
                  <button class="upgrade-button" @click="handleUpgrade">
                    <span class="cta-icon">🚀</span>
                    <span class="cta-text">立即升级会员</span>
                    <span class="cta-price">仅需¥19/月</span>
                  </button>
                  <p class="cta-hint">首月优惠：新用户专享¥9.9</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 会员：显示完整内容 -->
          <div v-else class="insight-content">
            <div class="key-insights">
              <h4 class="insights-title">核心洞察</h4>
              <ul class="insights-list">
                <li
                  v-for="(insight, index) in analysisResult.integratedInsight.keyInsights"
                  :key="index"
                >
                  {{ insight }}
                </li>
              </ul>
            </div>
            <div class="comprehensive-advice">
              <h4 class="advice-title">综合建议</h4>
              <p>{{ analysisResult.integratedInsight.comprehensiveAdvice }}</p>
            </div>
            <div v-if="analysisResult.integratedInsight.priorityActions.length > 0" class="priority-actions">
              <h4 class="actions-title">优先行动</h4>
              <div class="actions-list">
                <div
                  v-for="(action, index) in analysisResult.integratedInsight.priorityActions"
                  :key="index"
                  class="action-item"
                  :class="action.priority"
                >
                  <div class="action-priority-badge">{{ getPriorityText(action.priority) }}</div>
                  <div class="action-content">
                    <div class="action-text">{{ action.action }}</div>
                    <div class="action-reason">{{ action.reason }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import {
  AnalysisServiceManager,
  AnalysisMode,
} from '../services';
import type {
  CrossSystemAnalysis,
  ZiweiPalace,
} from '@/shared/types/cross-system';

const router = useRouter();
const userStore = useUserStore();

// 响应式数据
const question = ref('');
const selectedSystems = ref<string[]>(['yijing', 'ziwei', 'tarot']); // 默认全选
const enableIntegratedAnalysis = ref(true); // 默认启用综合分析
const analysisMode = ref<'quick' | 'deep'>('quick'); // 分析模式：快速诊断/深度探索
const isAnalyzing = ref(false);
const analysisResult = ref<CrossSystemAnalysis | null>(null);

// 会员状态
const isPremium = computed(() => userStore.isPremium);
const subscriptionTier = computed(() => userStore.subscriptionTier);
const showUpgradePrompt = ref(false);

// 折叠状态
const dimensionsExpanded = ref(false); // 多维度分析默认折叠
const systemsExpanded = ref(false); // 详细分析默认折叠

// 阅读进度追踪
const readingProgress = ref(0);
const currentStep = ref(1); // 当前步骤（1=核心洞察，2=行动建议，3=详细分析）
const sectionsRead = ref({
  coreInsight: false,
  actionAdvice: false,
  dimensions: false,
  systems: false,
  premium: false,
});

// 各系统独立的加载状态
const systemLoadingStates = ref<Record<string, boolean>>({
  yijing: false,
  ziwei: false,
  tarot: false,
  integrated: false,
});

// 错误状态
const errorMessage = ref<string | null>(null);
const systemErrors = ref<Record<string, string | null>>({
  yijing: null,
  ziwei: null,
  tarot: null,
  integrated: null,
});

// 系统配置
const systems = [
  {
    id: 'yijing',
    name: '易经占卜',
    icon: '☯️',
    description: '判断"何时做"，动态时机分析',
  },
  {
    id: 'ziwei',
    name: '紫微命盘',
    icon: '🌟',
    description: '分析"适合做什么"，静态特质分析',
  },
  {
    id: 'tarot',
    name: '塔罗指引',
    icon: '🃏',
    description: '探索"内心真实想法"，情感层面分析',
  },
];

// 计算属性
const hasResults = computed(() => analysisResult.value !== null);

// 宫位名称映射
const palaceNames: Record<ZiweiPalace, string> = {
  ming: '命宫',
  xiongdi: '兄弟宫',
  fuqi: '夫妻宫',
  zinu: '子女宫',
  cai: '财帛宫',
  jiluan: '疾厄宫',
  qianyi: '迁移宫',
  pugu: '仆役宫',
  guanlu: '官禄宫',
  tianzhai: '田宅宫',
  fude: '福德宫',
  fumu: '父母宫',
};

// 方法
const toggleSystem = (systemId: string) => {
  const index = selectedSystems.value.indexOf(systemId);
  if (index > -1) {
    selectedSystems.value.splice(index, 1);
  } else {
    selectedSystems.value.push(systemId);
  }
};

const getPalaceName = (palace: ZiweiPalace): string => {
  return palaceNames[palace] || palace;
};

const getConsistencyText = (level: 'high' | 'medium' | 'low'): string => {
  return {
    high: '高度一致',
    medium: '中等一致',
    low: '一致性较低',
  }[level];
};

const getPriorityText = (priority: 'high' | 'medium' | 'low'): string => {
  return {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级',
  }[priority];
};

const analyze = async () => {
  if (!question.value.trim() || selectedSystems.value.length === 0) {
    errorMessage.value = '请输入问题并选择至少一个分析系统';
    return;
  }

  // 重置状态
  isAnalyzing.value = true;
  errorMessage.value = null;
  systemErrors.value = {
    yijing: null,
    ziwei: null,
    tarot: null,
    integrated: null,
  };
  analysisResult.value = null;

  try {
    // 进度回调函数
    const onProgress = (system: string, status: 'start' | 'complete' | 'error', error?: Error) => {
      if (status === 'start') {
        systemLoadingStates.value[system] = true;
        systemErrors.value[system] = null;
      } else if (status === 'complete') {
        systemLoadingStates.value[system] = false;
      } else if (status === 'error') {
        systemLoadingStates.value[system] = false;
        systemErrors.value[system] = error?.message || `${system}分析失败`;
      }
    };

    // 根据用户选择执行独立分析或综合分析
    if (enableIntegratedAnalysis.value && selectedSystems.value.length > 1) {
      // 综合分析模式
      const analysis = await AnalysisServiceManager.performIntegratedAnalysis(
        question.value,
        selectedSystems.value,
        onProgress
      );
      analysisResult.value = analysis;
      
      // 快速诊断模式：默认展开核心洞察，折叠详细分析
      if (analysisMode.value === 'quick') {
        dimensionsExpanded.value = false;
        systemsExpanded.value = false;
      } else {
        // 深度探索模式：默认展开所有内容
        dimensionsExpanded.value = true;
        systemsExpanded.value = true;
      }
    } else {
      // 独立分析模式
      const analysis = await AnalysisServiceManager.performIndependentAnalysis(
        question.value,
        selectedSystems.value,
        onProgress
      );
      analysisResult.value = analysis;
      
      // 独立模式：默认展开系统结果
      systemsExpanded.value = true;
    }
  } catch (error) {
    console.error('分析失败:', error);
    const errorMsg = error instanceof Error ? error.message : '分析过程中发生未知错误';
    errorMessage.value = errorMsg;
    
    // 如果是综合分析失败，尝试降级到独立分析
    if (enableIntegratedAnalysis.value && selectedSystems.value.length > 1) {
      try {
        console.log('综合分析失败，降级到独立分析模式');
        const analysis = await AnalysisServiceManager.performIndependentAnalysis(
          question.value,
          selectedSystems.value
        );
        analysisResult.value = analysis;
        errorMessage.value = '综合分析生成失败，已显示各系统的独立分析结果';
      } catch (fallbackError) {
        console.error('降级分析也失败:', fallbackError);
      }
    }
  } finally {
    isAnalyzing.value = false;
    systemLoadingStates.value = {
      yijing: false,
      ziwei: false,
      tarot: false,
      integrated: false,
    };
  }
};

const clearResults = () => {
  analysisResult.value = null;
  question.value = '';
  dimensionsExpanded.value = false;
  systemsExpanded.value = false;
};

// 切换折叠状态
const toggleDimensionsExpanded = () => {
  dimensionsExpanded.value = !dimensionsExpanded.value;
};

const toggleSystemsExpanded = () => {
  systemsExpanded.value = !systemsExpanded.value;
};

// 获取简化的核心结论（去除专业术语，使用通俗语言）
const getSimplifiedConclusion = (): string => {
  if (!analysisResult.value?.integratedInsight) {
    return '基于三个系统的综合分析，为你提供决策建议';
  }
  
  const insight = analysisResult.value.integratedInsight;
  
  // 优先使用综合建议，但需要简化
  if (insight.comprehensiveAdvice) {
    let conclusion = insight.comprehensiveAdvice;
    
    // 简化专业术语
    conclusion = conclusion
      .replace(/命宫/g, '你的特质')
      .replace(/四化/g, '变化')
      .replace(/卦象/g, '当前时机')
      .replace(/体用关系/g, '当前情况')
      .replace(/用克体/g, '外部压力')
      .replace(/金星入命宫/g, '最佳时机');
    
    // 提取核心结论（前60字）
    if (conclusion.length > 60) {
      // 尝试找到句号或逗号作为断点
      const firstSentence = conclusion.match(/^[^。，]+[。，]/);
      if (firstSentence && firstSentence[0].length <= 60) {
        return firstSentence[0];
      }
      return conclusion.substring(0, 60) + '...';
    }
    return conclusion;
  }
  
  // 否则使用第一个关键洞察，同样简化
  if (insight.keyInsights && insight.keyInsights.length > 0) {
    let firstInsight = insight.keyInsights[0];
    firstInsight = firstInsight
      .replace(/命宫/g, '你的特质')
      .replace(/四化/g, '变化')
      .replace(/卦象/g, '当前时机');
    return firstInsight.length > 60 ? firstInsight.substring(0, 60) + '...' : firstInsight;
  }
  
  return '基于三个系统的综合分析，为你提供决策建议';
};

// 获取简化的关键要点（结构化展示）
const getSimplifiedKeyPoints = (): Array<{ label: string; value: string }> => {
  if (!analysisResult.value?.integratedInsight) {
    return [];
  }
  
  const insight = analysisResult.value.integratedInsight;
  const points: Array<{ label: string; value: string }> = [];
  
  // 从keyInsights中提取关键信息，最多3条
  if (insight.keyInsights && insight.keyInsights.length > 0) {
    insight.keyInsights.slice(0, 3).forEach((insightText) => {
      // 简化专业术语
      let simplified = insightText
        .replace(/命宫/g, '你的特质')
        .replace(/四化/g, '变化')
        .replace(/卦象/g, '当前时机')
        .replace(/体用关系/g, '当前情况');
      
      // 尝试提取标签和值（格式：标签：值）
      const match = simplified.match(/^(.+?)[：:](.+)$/);
      if (match) {
        points.push({
          label: match[1].trim(),
          value: match[2].trim().substring(0, 40) + (match[2].trim().length > 40 ? '...' : ''),
        });
      } else {
        // 如果没有冒号，尝试提取前20字作为标签
        const label = simplified.length > 20 ? simplified.substring(0, 20) + '...' : simplified;
        points.push({
          label: label,
          value: simplified.length > 20 ? simplified.substring(20) : '详情见下方',
        });
      }
    });
  }
  
  return points;
};

// 获取优先级图标
const getPriorityIcon = (priority: 'high' | 'medium' | 'low'): string => {
  return {
    high: '🔥',
    medium: '⭐',
    low: '💡',
  }[priority] || '•';
};

// 简化文本：去除专业术语，使用通俗语言
const simplifyText = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/命宫/g, '你的特质')
    .replace(/四化/g, '变化')
    .replace(/卦象/g, '当前时机')
    .replace(/体用关系/g, '当前情况')
    .replace(/用克体/g, '外部压力')
    .replace(/金星入命宫/g, '最佳时机')
    .replace(/七杀星/g, '挑战特质')
    .replace(/巨门/g, '沟通特质')
    .replace(/紫微/g, '领导特质')
    .replace(/天机/g, '智慧特质')
    .replace(/太阳/g, '光明特质')
    .replace(/武曲/g, '财富特质')
    .replace(/天同/g, '和谐特质')
    .replace(/廉贞/g, '复杂特质')
    .replace(/天府/g, '稳定特质')
    .replace(/太阴/g, '柔和特质')
    .replace(/贪狼/g, '欲望特质')
    .replace(/天相/g, '辅助特质')
    .replace(/天梁/g, '保护特质')
    .replace(/七杀/g, '变革特质')
    .replace(/破军/g, '破坏特质');
};

// 处理升级会员
const handleUpgrade = () => {
  router.push('/pricing');
};

// 计算阅读进度
const calculateReadingProgress = () => {
  const totalSections = 5;
  let readCount = 0;
  
  if (sectionsRead.value.coreInsight) readCount++;
  if (sectionsRead.value.actionAdvice) readCount++;
  if (sectionsRead.value.dimensions) readCount++;
  if (sectionsRead.value.systems) readCount++;
  if (sectionsRead.value.premium) readCount++;
  
  readingProgress.value = Math.round((readCount / totalSections) * 100);
};

// 监听滚动，检测用户阅读进度
const handleScroll = () => {
  if (!hasResults.value) return;
  
  const coreInsightEl = document.querySelector('.core-insight-card');
  const actionAdviceEl = document.querySelector('.quick-advice-card');
  const dimensionsEl = document.querySelector('.multi-dimension-analysis');
  const systemsEl = document.querySelector('.systems-section');
  const premiumEl = document.querySelector('.premium-section');
  
  const viewportHeight = window.innerHeight;
  const scrollTop = window.scrollY;
  
  // 检测每个部分是否在视口中（至少50%可见）
  const isInViewport = (el: Element | null) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
    return visibleHeight > rect.height * 0.5;
  };
  
  // 更新步骤指示器
  if (coreInsightEl && isInViewport(coreInsightEl)) {
    sectionsRead.value.coreInsight = true;
    if (currentStep.value < 2) currentStep.value = 2;
  }
  if (actionAdviceEl && isInViewport(actionAdviceEl)) {
    sectionsRead.value.actionAdvice = true;
    if (currentStep.value < 3) currentStep.value = 3;
  }
  if (dimensionsEl && isInViewport(dimensionsEl)) {
    sectionsRead.value.dimensions = true;
  }
  if (systemsEl && isInViewport(systemsEl)) {
    sectionsRead.value.systems = true;
  }
  if (premiumEl && isInViewport(premiumEl)) {
    sectionsRead.value.premium = true;
  }
  
  calculateReadingProgress();
};

// 在组件挂载时添加滚动监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // 初始计算一次
  setTimeout(() => {
    handleScroll();
  }, 500);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.triple-analysis-page {
  background: #f5f7fa;
  min-height: 100vh;
  color: #1f2937;
}

/* 动态背景 - 调整为更柔和的样式 */
.cosmic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  opacity: 0.3;
}

.stars-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(2px 2px at 20% 30%, white, transparent),
    radial-gradient(2px 2px at 60% 70%, white, transparent),
    radial-gradient(1px 1px at 50% 50%, white, transparent);
  background-size: 200% 200%;
  animation: starsMove 20s linear infinite;
  opacity: 0.6;
}

@keyframes starsMove {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}

.nebula-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at top, rgba(147, 51, 234, 0.3), transparent),
    radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.3), transparent);
  animation: nebulaPulse 8s ease-in-out infinite;
}

@keyframes nebulaPulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

.energy-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1), transparent);
  animation: particleFloat 15s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(50px, -50px);
  }
}

/* 标题区域 */
.hero-section {
  text-align: center;
}

.title-container {
  max-width: 800px;
  margin: 0 auto;
}

.main-title {
  font-size: 3rem;
  font-weight: bold;
  color: #0a1e4d;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.title-icon {
  font-size: 3.5rem;
}

.title-text {
  background: linear-gradient(135deg, #0a1e4d 0%, #1e3a8a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mystical-glow {
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5),
    0 0 40px rgba(147, 51, 234, 0.5);
}

.subtitle {
  font-size: 1.25rem;
  color: #6b7280;
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
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #f8c400, transparent);
}

.decoration-symbol {
  font-size: 1.5rem;
}

/* 问题输入区 */
.question-input-section {
  max-width: 900px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #0a1e4d;
  margin-bottom: 0.5rem;
}

.section-description {
  font-size: 1rem;
  color: #6b7280;
}

.input-wrapper {
  position: relative;
}

.question-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #0a1e4d;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s ease;
}

.question-input::placeholder {
  color: #9ca3af;
}

.question-input:focus {
  outline: none;
  border-color: #f8c400;
  box-shadow: 0 0 0 3px rgba(248, 196, 0, 0.1);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.analyze-button {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.analyze-button.primary {
  background: linear-gradient(135deg, #f8c400 0%, #ffd700 100%);
  color: #0a1e4d;
  box-shadow: 0 4px 15px rgba(248, 196, 0, 0.4);
  font-weight: 700;
}

.analyze-button.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(248, 196, 0, 0.6);
}

.analyze-button.secondary {
  background: white;
  color: #0a1e4d;
  border: 2px solid #e5e7eb;
}

.analyze-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 系统选择区 */
.system-selection-section {
  max-width: 900px;
  margin: 0 auto;
}

.system-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.system-card {
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.system-card:hover {
  transform: translateY(-4px);
  border-color: #f8c400;
  box-shadow: 0 4px 12px rgba(248, 196, 0, 0.2);
}

.system-card.active {
  border-color: #f8c400;
  background: linear-gradient(135deg, rgba(248, 196, 0, 0.05) 0%, white 100%);
  box-shadow: 0 4px 20px rgba(248, 196, 0, 0.3);
}

.system-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.system-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: #0a1e4d;
  margin-bottom: 0.5rem;
}

.system-description {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.system-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #f8c400;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #0a1e4d;
  font-weight: 600;
  margin-top: 0.5rem;
}

/* 结果区域 */
.results-section {
  max-width: 1200px;
  margin: 0 auto;
}

/* 多维度分析区域 */
.multi-dimension-analysis {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dimension-card {
  padding: 1.5rem;
  border-radius: 12px;
  background: white;
  border: 2px solid #e5e7eb;
}

.consistency-card {
  border-left: 4px solid rgba(16, 185, 129, 0.6);
}

.conflict-card {
  border-left: 4px solid rgba(239, 68, 68, 0.6);
}

.complementarity-card {
  border-left: 4px solid rgba(59, 130, 246, 0.6);
}

.dimension-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.dimension-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #0a1e4d;
}

.dimension-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
}

.dimension-badge.high {
  background: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.dimension-badge.medium {
  background: rgba(245, 158, 11, 0.3);
  color: #f59e0b;
}

.dimension-badge.low {
  background: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.dimension-badge.has-conflict {
  background: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.dimension-badge.no-conflict {
  background: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.dimension-badge.complementarity {
  background: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.dimension-content {
  color: #1f2937;
}

.dimension-score {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.score-label {
  font-size: 0.95rem;
}

.score-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #0a1e4d;
}

.dimension-analysis {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #1f2937;
}

/* 三个系统结果网格 */
.systems-results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.system-result-card {
  padding: 1.5rem;
  border-radius: 12px;
  background: white;
  border: 2px solid #e5e7eb;
}

.system-result-card.yijing {
  border-left: 4px solid #f59e0b;
}

.system-result-card.ziwei {
  border-left: 4px solid #9333ea;
}

.system-result-card.tarot {
  border-left: 4px solid #3b82f6;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.result-icon {
  font-size: 2rem;
}

.result-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #0a1e4d;
}

.result-content {
  color: #1f2937;
}

.hexagram-info,
.palace-info,
.tarot-cards {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 8px;
}

.hexagram-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: #0a1e4d;
  margin-bottom: 0.5rem;
}

.hexagram-number {
  font-size: 0.9rem;
  color: #6b7280;
}

.hexagram-symbol {
  font-size: 2rem;
  text-align: center;
  margin-top: 0.5rem;
}

.palace-name {
  font-size: 1rem;
  color: #0a1e4d;
  font-weight: 600;
}

.tarot-card-item {
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.card-position {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.card-name {
  font-size: 1rem;
  font-weight: 600;
  color: #0a1e4d;
  margin-bottom: 0.25rem;
}

.card-meaning {
  font-size: 0.9rem;
  color: #1f2937;
  line-height: 1.5;
}

.interpretation-title,
.analysis-title,
.advice-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0a1e4d;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.result-interpretation p,
.result-analysis p,
.result-advice p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #1f2937;
}

.interpretation-content,
.analysis-content-text,
.advice-content-text {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.interpretation-content::-webkit-scrollbar,
.analysis-content-text::-webkit-scrollbar,
.advice-content-text::-webkit-scrollbar {
  width: 4px;
}

.interpretation-content::-webkit-scrollbar-track,
.analysis-content-text::-webkit-scrollbar-track,
.advice-content-text::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 2px;
}

.interpretation-content::-webkit-scrollbar-thumb,
.analysis-content-text::-webkit-scrollbar-thumb,
.advice-content-text::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.interpretation-content::-webkit-scrollbar-thumb:hover,
.analysis-content-text::-webkit-scrollbar-thumb:hover,
.advice-content-text::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* AI综合洞察卡片 */
.integrated-insight-card {
  padding: 2rem;
  border-radius: 12px;
  background: white;
  border: 2px solid #e5e7eb;
  max-width: 900px;
  margin: 0 auto;
}

.insight-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.insight-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #0a1e4d;
}

.insight-confidence {
  padding: 0.5rem 1rem;
  background: #f5f7fa;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #0a1e4d;
  font-weight: 600;
}

.insight-content {
  color: #1f2937;
}

.key-insights {
  margin-bottom: 1.5rem;
}

.insights-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #0a1e4d;
  margin-bottom: 1rem;
}

.insights-list {
  list-style: none;
  padding: 0;
}

.insights-list li {
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: #f5f7fa;
  border-radius: 8px;
  border-left: 3px solid #f8c400;
  color: #1f2937;
}

.comprehensive-advice {
  margin-bottom: 1.5rem;
}

.comprehensive-advice p {
  font-size: 0.9rem;
  line-height: 1.8;
  color: #1f2937;
}

.priority-actions {
  margin-top: 1.5rem;
}

.actions-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #0a1e4d;
  margin-bottom: 1rem;
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 8px;
  border-left: 4px solid #e5e7eb;
}

.action-item.high {
  border-left-color: #10b981;
}

.action-item.medium {
  border-left-color: #f59e0b;
}

.action-item.low {
  border-left-color: #6b7280;
}

.action-priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.action-item.high .action-priority-badge {
  background: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.action-item.medium .action-priority-badge {
  background: rgba(245, 158, 11, 0.3);
  color: #f59e0b;
}

.action-item.low .action-priority-badge {
  background: rgba(107, 114, 128, 0.3);
  color: #9ca3af;
}

.action-content {
  flex: 1;
}

.action-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0a1e4d;
  margin-bottom: 0.25rem;
}

.action-reason {
  font-size: 0.85rem;
  color: #6b7280;
  line-height: 1.5;
}

/* 综合分析选项区域 */
.integrated-option-section {
  max-width: 900px;
  margin: 0 auto;
}

.integrated-option-card {
  padding: 1.5rem;
  border-radius: 12px;
  background: white;
  border: 2px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.option-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.option-icon {
  font-size: 2.5rem;
}

.option-content {
  flex: 1;
}

.option-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #0a1e4d;
  margin-bottom: 0.5rem;
}

.option-description {
  font-size: 0.95rem;
  color: #6b7280;
  line-height: 1.5;
}

.option-switch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.3);
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: rgba(147, 51, 234, 0.8);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

input:disabled + .slider {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch-label {
  font-size: 0.85rem;
  color: #0a1e4d;
  font-weight: 500;
}

.integrated-hint {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(248, 196, 0, 0.1);
  border-radius: 8px;
  border-left: 4px solid #f8c400;
}

.integrated-hint p {
  font-size: 0.9rem;
  color: #1f2937;
  margin: 0;
}

/* 错误提示 */
.error-message {
  padding: 1rem;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.2);
  border: 2px solid rgba(239, 68, 68, 0.5);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
}

.error-icon {
  font-size: 1.5rem;
}

.error-text {
  flex: 1;
  font-size: 0.95rem;
}

/* 模式选择区域 */
.mode-selection-section {
  max-width: 900px;
  margin: 0 auto;
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.mode-card {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.mode-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border-color: #f8c400;
}

.mode-card.active {
  border-color: #f8c400;
  background: linear-gradient(135deg, rgba(248, 196, 0, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%);
  box-shadow: 0 4px 16px rgba(248, 196, 0, 0.3);
}

.mode-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.mode-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a1e4d;
  margin-bottom: 0.75rem;
}

.mode-description {
  font-size: 0.95rem;
  color: #6b7280;
  line-height: 1.6;
}

/* 核心洞察卡片 */
.core-insight-card {
  max-width: 900px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8c400 0%, #ffd700 100%);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(248, 196, 0, 0.4);
  border: 3px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.core-insight-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

.core-insight-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.insight-icon {
  font-size: 2.5rem;
}

.core-insight-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0a1e4d;
  margin: 0;
}

.core-insight-content {
  color: #0a1e4d;
}

/* 核心结论：简化展示 */
.insight-conclusion {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  border-left: 4px solid #0a1e4d;
  position: relative;
  z-index: 1;
}

.conclusion-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.conclusion-text {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.6;
  color: #0a1e4d;
  flex: 1;
}

.insight-highlight {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  border-left: 4px solid #0a1e4d;
  position: relative;
  z-index: 1;
}

.key-points {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.key-point-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  border: 1px solid rgba(10, 30, 77, 0.1);
  position: relative;
  z-index: 1;
  transition: all 0.2s ease;
}

.key-point-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(248, 196, 0, 0.2);
}

.point-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f8c400;
  color: #0a1e4d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.point-content {
  flex: 1;
}

.point-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #0a1e4d;
  margin-bottom: 0.25rem;
}

.point-value {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
}

.point-icon {
  color: #0a1e4d;
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 1;
}

.point-text {
  flex: 1;
}

/* 简要建议卡片 */
.quick-advice-card {
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.advice-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.advice-icon {
  font-size: 2rem;
}

.advice-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a1e4d;
  margin: 0;
}

.advice-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.advice-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 10px;
  border-left: 4px solid #f8c400;
  transition: all 0.2s ease;
}

.advice-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(248, 196, 0, 0.2);
}

.advice-item.high {
  border-left-color: #ef4444;
}

.advice-item.medium {
  border-left-color: #f59e0b;
}

.advice-item.low {
  border-left-color: #6b7280;
}

.advice-priority-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.advice-priority-indicator.high {
  background: rgba(239, 68, 68, 0.1);
}

.advice-priority-indicator.medium {
  background: rgba(245, 158, 11, 0.1);
}

.advice-priority-indicator.low {
  background: rgba(107, 114, 128, 0.1);
}

.priority-icon {
  font-size: 1.5rem;
}

.advice-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.advice-text-wrapper {
  flex: 1;
}

.advice-reason {
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 0.25rem;
  line-height: 1.4;
}

.advice-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f8c400;
  color: #0a1e4d;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.advice-text {
  flex: 1;
  font-size: 1.2rem;
  font-weight: 600;
  color: #0a1e4d;
  line-height: 1.5;
}

/* 折叠功能样式 */
.dimension-toggle,
.systems-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
  border: 2px solid rgba(10, 30, 77, 0.1);
}

.dimension-toggle:hover,
.systems-toggle:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #f8c400;
  transform: translateX(4px);
}

.dimension-section-title,
.systems-section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0a1e4d;
  margin: 0;
}

.toggle-icon {
  font-size: 1.25rem;
  color: #0a1e4d;
  transition: transform 0.2s ease;
}

.dimensions-content {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 付费墙样式 */
.premium-section {
  position: relative;
  border: 3px solid #f8c400;
  background: white;
}

.premium-section.premium-locked {
  border-color: #d1d5db;
  opacity: 0.95;
}

.premium-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: linear-gradient(135deg, #f8c400 0%, #ffd700 100%);
  color: #0a1e4d;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(248, 196, 0, 0.4);
}

.premium-badge.premium-active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.member-status-badge {
  position: absolute;
  top: -12px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.status-icon {
  font-size: 1rem;
}

.status-text {
  font-weight: 700;
}

/* 会员预览遮罩 */
.premium-preview {
  position: relative;
  min-height: 400px;
}

.preview-overlay {
  padding: 2rem;
  text-align: center;
}

.preview-content {
  max-width: 600px;
  margin: 0 auto;
}

.preview-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.preview-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a1e4d;
  margin-bottom: 0.75rem;
}

.preview-description {
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.cta-hint {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #f59e0b;
  font-weight: 600;
}

/* 价值对比表格 */
.value-comparison-table {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f5f7fa;
  border-radius: 12px;
}

.comparison-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0a1e4d;
  margin-bottom: 1rem;
  text-align: center;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.comparison-table thead {
  background: #0a1e4d;
  color: white;
}

.comparison-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
}

.comparison-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
  font-size: 0.9rem;
}

.comparison-table tbody tr:last-child td {
  border-bottom: none;
}

.comparison-table tbody tr:hover {
  background: #f9fafb;
}

.comparison-table td strong {
  color: #f8c400;
  font-weight: 700;
}

/* CTA按钮 */
.premium-cta {
  margin-top: 2rem;
  text-align: center;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.upgrade-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #f8c400 0%, #ffd700 100%);
  color: #0a1e4d;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(248, 196, 0, 0.4);
}

.upgrade-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(248, 196, 0, 0.6);
}

.cta-icon {
  font-size: 1.5rem;
}

.cta-text {
  font-weight: 700;
}

.cta-price {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 系统加载状态 */
.system-loading {
  margin-left: auto;
}

.mini-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

.loading-placeholder {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
}

.system-error {
  padding: 0.75rem;
  margin: 0.5rem 0;
  border-radius: 6px;
  background: rgba(239, 68, 68, 0.1);
  border-left: 3px solid #ef4444;
  color: #dc2626;
  font-size: 0.9rem;
}

/* 步骤指示器 */
.step-indicator {
  max-width: 900px;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  max-width: 150px;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.step-item.active .step-number {
  background: #f8c400;
  color: #0a1e4d;
  transform: scale(1.1);
}

.step-item.completed .step-number {
  background: #10b981;
  color: white;
}

.step-label {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
  text-align: center;
}

.step-item.active .step-label {
  color: #0a1e4d;
  font-weight: 600;
}

.step-item.completed .step-label {
  color: #10b981;
}

.step-connector {
  flex: 1;
  height: 2px;
  background: #e5e7eb;
  margin: 0 0.5rem;
  transition: all 0.3s ease;
}

.step-connector.active {
  background: #f8c400;
}

/* 阅读进度指示器 */
.reading-progress-indicator {
  max-width: 900px;
  margin: 0 auto 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #0a1e4d;
}

.progress-percentage {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f8c400;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f8c400 0%, #ffd700 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-hint {
  text-align: center;
  font-size: 0.85rem;
  color: #6b7280;
  font-style: italic;
}

/* 统一卡片样式 */
.core-insight-card,
.quick-advice-card,
.dimension-card,
.system-result-card,
.integrated-insight-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.core-insight-card:hover,
.quick-advice-card:hover,
.dimension-card:hover,
.system-result-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* 统一间距 */
.results-section > * {
  margin-bottom: 1.5rem;
}

.results-section > *:last-child {
  margin-bottom: 0;
}

/* 统一边框和圆角 */
.core-insight-card,
.quick-advice-card,
.dimension-card,
.system-result-card,
.integrated-insight-card,
.reading-progress-indicator,
.step-indicator {
  border-radius: 16px;
}

/* 统一标题样式 */
.core-insight-title,
.advice-title,
.dimension-title,
.result-title,
.insight-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a1e4d;
  margin: 0;
}

/* 统一内容文本样式 */
.core-insight-content,
.advice-list,
.dimension-content,
.result-content,
.insight-content {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #1f2937;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2rem;
  }

  .title-icon {
    font-size: 2.5rem;
  }

  .systems-results-grid {
    grid-template-columns: 1fr;
  }

  .system-grid {
    grid-template-columns: 1fr;
  }

  .integrated-option-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .option-switch {
    align-self: flex-end;
  }

  .core-insight-card {
    padding: 1.5rem;
  }

  .conclusion-text {
    font-size: 1.2rem;
  }

  .insight-highlight {
    font-size: 1.2rem;
    padding: 1rem;
  }

  .key-point-item {
    flex-direction: column;
    gap: 0.75rem;
  }

  .point-label {
    font-size: 0.9rem;
  }

  .point-value {
    font-size: 0.85rem;
  }

  .advice-item {
    flex-direction: column;
    gap: 0.75rem;
  }

  .advice-content {
    flex-direction: column;
    gap: 0.5rem;
  }

  .advice-text {
    font-size: 1rem;
  }

  .comparison-table {
    font-size: 0.85rem;
  }

  .comparison-table th,
  .comparison-table td {
    padding: 0.5rem;
  }

  .reading-progress-indicator,
  .step-indicator {
    padding: 1rem;
  }

  .step-item {
    max-width: 100px;
  }

  .step-number {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }

  .step-label {
    font-size: 0.8rem;
  }

  .upgrade-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>


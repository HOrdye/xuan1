<template>
  <div class="empty-palace-analysis min-h-screen relative overflow-hidden">
    <!-- 动态星空背景 -->
    <div class="cosmic-background">
      <div class="stars-layer"></div>
      <div class="nebula-layer"></div>
    </div>

    <!-- 页面内容 -->
    <div class="relative z-10 p-4 pb-20">
      <!-- 返回按钮 -->
      <div class="back-button-container mb-4">
        <n-button
          text
          type="primary"
          @click="goBack"
          class="back-button"
        >
          ← 返回命盘
        </n-button>
      </div>

      <!-- 标题区域 -->
      <div class="header-section mb-8">
        <h1 class="main-title">
          <span class="title-icon">🌌</span>
          <span class="title-text">你的命盘中的空宫</span>
        </h1>
        <p class="subtitle">空宫不是缺陷，是特色！了解你的空宫，发挥独特优势</p>
      </div>

      <!-- 空宫统计 -->
      <div v-if="stats" class="stats-card mb-8">
        <div class="stats-content">
          <div class="stat-item">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">个空宫</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.percentage }}%</div>
            <div class="stat-label">空宫占比</div>
          </div>
        </div>
      </div>

      <!-- 空宫说明 -->
      <div v-if="emptyPalaces.length > 0" class="common-info-card mb-8">
        <h3 class="common-info-title">📖 关于空宫</h3>
        <div class="common-info-content">
          <div class="common-info-section">
            <h4 class="common-info-subtitle">什么是空宫？</h4>
            <p class="common-info-text">空宫是指命盘中某个宫位没有主星的情况。空宫不是"空白"或"缺陷"，而是需要通过借对宫（对面宫位）的星曜来论命。</p>
          </div>
          <div class="common-info-section">
            <h4 class="common-info-subtitle">空宫的特点：</h4>
            <ul class="common-info-list">
              <li>✨ 可塑性强：不受主星固定特质束缚，更灵活</li>
              <li>✨ 受环境影响大：容易受外界、他人影响</li>
              <li>✨ 需要主动性：不像有主星那样有明确特质，需要自己探索</li>
            </ul>
          </div>
          <div class="common-info-section">
            <h4 class="common-info-subtitle">空宫的建议：</h4>
            <ul class="common-info-list">
              <li>💡 发挥空宫的灵活性优势，适应不同环境</li>
              <li>💡 主动探索和规划，不要被动等待</li>
              <li>💡 参考对宫星曜的特质，但不要完全依赖</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 空宫列表 -->
      <div v-if="emptyPalaces.length > 0" class="empty-palaces-list">
        <div
          v-for="(analysis, index) in emptyPalaces"
          :key="index"
          class="empty-palace-card mb-6"
        >
          <!-- 卡片头部 -->
          <div class="card-header">
            <div class="palace-name-section">
              <h2 class="palace-name">{{ analysis.palace.name }}</h2>
              <div class="palace-badge">空宫</div>
            </div>
            <div class="opposite-info">
              <span class="opposite-label">对宫：</span>
              <span class="opposite-name">{{ analysis.oppositePalace.name }}</span>
            </div>
          </div>

          <!-- 对宫星曜 -->
          <div v-if="analysis.oppositeStars.length > 0" class="opposite-stars-section">
            <h3 class="section-title">对宫星曜</h3>
            <div class="stars-list">
              <div
                v-for="(star, starIndex) in analysis.oppositeStars"
                :key="starIndex"
                class="star-item"
                @click="showStarDetail(star)"
              >
                <span class="star-emoji">{{ star.emoji }}</span>
                <span class="star-name">{{ star.name }}</span>
                <span class="star-category">{{ star.category }}</span>
              </div>
            </div>
          </div>

          <!-- 解读内容（增强版，已包含针对性分析） -->
          <div class="interpretation-section">
            <h3 class="section-title">解读</h3>
            <p class="interpretation-text">{{ analysis.interpretation }}</p>    
          </div>
        </div>
      </div>

      <!-- 无空宫提示 -->
      <div v-else class="no-empty-palace">
        <div class="no-empty-icon">🌟</div>
        <h2 class="no-empty-title">恭喜！</h2>
        <p class="no-empty-text">你的命盘中所有宫位都有主星，没有空宫。</p>
        <p class="no-empty-subtext">这说明你的性格特质比较明确，各方面都有明确的方向。</p>
      </div>
    </div>

    <!-- 星曜详情弹窗 -->
    <StarDetailModal
      v-if="selectedStar"
      :star="selectedStar"
      :show="showStarModal"
      @update:show="showStarModal = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NButton } from 'naive-ui';
import { useZiweiStore } from '../store/ziweiStore';
import {
  analyzeEmptyPalaces,
  getEmptyPalaceStats,
  type EmptyPalaceAnalysis
} from '../utils/emptyPalaceAnalyzer';
import { StarDetailModal } from '../components';
import type { Star } from '../types';

const router = useRouter();
const ziweiStore = useZiweiStore();

// 空宫分析结果
const emptyPalaces = ref<EmptyPalaceAnalysis[]>([]);
const stats = ref<{ total: number; emptyPalaces: string[]; percentage: number } | null>(null);

// 星曜详情弹窗
const selectedStar = ref<Star | null>(null);
const showStarModal = ref(false);

// 返回上一页
const goBack = () => {
  router.push('/ziwei/chart');
};

// 显示星曜详情
const showStarDetail = (star: Star) => {
  selectedStar.value = star;
  showStarModal.value = true;
};

// 初始化分析
onMounted(() => {
  const chart = ziweiStore.currentChart;
  if (!chart) {
    // 如果没有命盘，跳转到输入页面
    router.push('/ziwei/input');
    return;
  }

  // 分析空宫
  emptyPalaces.value = analyzeEmptyPalaces(chart);
  stats.value = getEmptyPalaceStats(chart);
});
</script>

<style scoped>
.empty-palace-analysis {
  min-height: 100vh;
  position: relative;
}

/* 动态星空背景 */
.cosmic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.stars-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(2px 2px at 20% 30%, #fff, transparent),
    radial-gradient(2px 2px at 60% 70%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 50% 50%, #fff, transparent);
  background-size: 200% 200%;
  animation: starsMove 20s linear infinite;
  opacity: 0.6;
}

@keyframes starsMove {
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
}

.nebula-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%);
}

/* 返回按钮 */
.back-button-container {
  max-width: 1000px;
  margin: 0 auto;
}

.back-button {
  font-size: 1rem;
  padding: 0.5rem 1rem;
}

/* 标题区域 */
.header-section {
  text-align: center;
  max-width: 1000px;
  margin: 0 auto 3rem;
}

.main-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #9333EA 0%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-icon {
  font-size: 2.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
}

/* 统计卡片 */
.stats-card {
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* 空宫通用说明卡片 */
.common-info-card {
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.common-info-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(139, 92, 246, 0.1);
}

.common-info-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.common-info-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.common-info-subtitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: #9333EA;
  margin: 0;
}

.common-info-text {
  font-size: 1rem;
  color: #666;
  line-height: 1.8;
  margin: 0;
}

.common-info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.common-info-list li {
  font-size: 1rem;
  color: #666;
  line-height: 1.8;
  padding-left: 0;
}

.stats-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 3rem;
  font-weight: bold;
  color: #9333EA;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  color: #666;
}

.stat-divider {
  width: 1px;
  height: 60px;
  background: rgba(139, 92, 246, 0.2);
}

/* 空宫列表 */
.empty-palaces-list {
  max-width: 1000px;
  margin: 0 auto;
}

.empty-palace-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(139, 92, 246, 0.1);
}

.palace-name-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.palace-name {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.palace-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(147, 51, 234, 0.1);
  color: #9333EA;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
}

.opposite-info {
  color: #666;
  font-size: 1rem;
}

.opposite-label {
  color: #999;
}

.opposite-name {
  color: #9333EA;
  font-weight: 600;
}

/* 对宫星曜 */
.opposite-stars-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.stars-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.star-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(147, 51, 234, 0.05);
  border: 1px solid rgba(147, 51, 234, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.star-item:hover {
  background: rgba(147, 51, 234, 0.1);
  border-color: rgba(147, 51, 234, 0.4);
  transform: translateY(-2px);
}

.star-emoji {
  font-size: 1.2rem;
}

.star-name {
  font-weight: 600;
  color: #333;
}

.star-category {
  font-size: 0.85rem;
  color: #999;
}

/* 解读内容 */
.interpretation-section {
  margin-bottom: 1.5rem;
}

.interpretation-text {
  font-size: 1rem;
  color: #666;
  line-height: 1.8;
  padding: 1rem;
  background: rgba(147, 51, 234, 0.05);
  border-left: 4px solid #9333EA;
  border-radius: 8px;
}


/* 无空宫提示 */
.no-empty-palace {
  max-width: 600px;
  margin: 4rem auto;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
  padding: 4rem 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.no-empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.no-empty-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.no-empty-text {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.no-empty-subtext {
  font-size: 1rem;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2rem;
    flex-direction: column;
  }

  .stats-content {
    flex-direction: column;
    gap: 1rem;
  }

  .stat-divider {
    width: 60px;
    height: 1px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .palace-name {
    font-size: 1.5rem;
  }
}
</style>


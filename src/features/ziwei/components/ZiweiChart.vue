<template>
  <div class="ziwei-chart-container">
    <!-- 控制工具栏 -->
    <div class="chart-controls">
      <n-button-group>
        <n-button
          size="small"
          @click="zoomOut"
          :disabled="zoomLevel <= 0.5"
        >
          <template #icon>
            <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13H5v-2h14v2z"/></svg></n-icon>
          </template>
        </n-button>
        <n-button size="small" @click="resetZoom">
          {{ Math.round(zoomLevel * 100) }}%
        </n-button>
        <n-button
          size="small"
          @click="zoomIn"
          :disabled="zoomLevel >= 2"
        >
          <template #icon>
            <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></n-icon>
          </template>
        </n-button>
      </n-button-group>
    </div>

    <!-- 星盘主体 -->
    <div
      class="chart-wrapper"
      :class="{ 'dark-mode': isDarkMode }"
      :style="{ 
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'center center'
      }"
    >
      <!-- 中心区域 -->
      <div class="chart-center">
        <div class="center-content">
          <div class="center-title">紫微命盘</div>
          <div class="center-info">
            <div class="info-item">
              <span class="info-label">五行局</span>
              <span class="info-value">{{ chart.wuxingJu }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">命宫</span>
              <span class="info-value">{{ chart.mingGong.name }}</span>
            </div>
            <div v-if="chart.shenGong" class="info-item">
              <span class="info-label">身宫</span>
              <span class="info-value">{{ chart.shenGong.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 十二宫位环形布局 -->
      <div class="palaces-ring" ref="palacesRingRef">
        <div
          v-for="(palace, index) in chart.palaces"
          :key="index"
          class="palace"
          :class="{
            'ming-gong': index === 0,
            'shen-gong': isShenGong(index),
            'empty': palace.stars.length === 0,
            'palace-animated': isAnimated,
            'palace-highlighted': highlightedPalaces.includes(index),
            'palace-related': relatedPalaces.includes(index)
          }"
          :style="getPalacePosition(index)"
          :data-index="index"
          @click="handlePalaceClick(palace, index)"
          @mouseenter="handlePalaceHover(index)"
          @mouseleave="handlePalaceLeave"
        >
          <!-- 宫位标题 -->
          <div class="palace-title">
            <span class="palace-name">{{ palace.name }}</span>
            <span v-if="index === 0" class="badge ming-badge">命</span>
            <span v-if="isShenGong(index)" class="badge shen-badge">身</span>
          </div>

          <!-- 主星 -->
          <div class="main-stars">
            <div
              v-for="(star, starIndex) in getMainStars(palace.stars)"
              :key="star.id"
              class="main-star star-item clickable"
              :style="{ color: star.color }"
              :title="star.description"
              :data-delay="starIndex * 100"
              @click.stop="handleStarClick(star)"
            >
              <span class="star-emoji">{{ star.emoji }}</span>
              <span class="star-name">
                <TermTooltip :term="star.name">{{ star.name }}</TermTooltip>
              </span>
            </div>
          </div>

          <!-- 辅星 -->
          <div class="auxiliary-stars">
            <div
              v-for="(star, starIndex) in getAuxiliaryStars(palace.stars)"      
              :key="star.id"
              class="auxiliary-star star-item clickable"
              :class="star.category"
              :title="star.description"
              :data-delay="(getMainStars(palace.stars).length + starIndex) * 100"
              @click.stop="handleStarClick(star)"
            >
              <span class="star-name-small">
                <TermTooltip :term="star.name">{{ star.name }}</TermTooltip>
              </span>
            </div>
          </div>

          <!-- 四化标记 -->
          <div v-if="palace.sihua" class="sihua-markers">
            <span
              v-if="palace.sihua.lu"
              class="sihua-marker lu"
              :title="`化禄: ${palace.sihua.lu}`"
            >
              禄
            </span>
            <span
              v-if="palace.sihua.quan"
              class="sihua-marker quan"
              :title="`化权: ${palace.sihua.quan}`"
            >
              权
            </span>
            <span
              v-if="palace.sihua.ke"
              class="sihua-marker ke"
              :title="`化科: ${palace.sihua.ke}`"
            >
              科
            </span>
            <span
              v-if="palace.sihua.ji"
              class="sihua-marker ji"
              :title="`化忌: ${palace.sihua.ji}`"
            >
              忌
            </span>
          </div>

          <!-- 空宫提示 -->
          <div v-if="palace.stars.length === 0" class="empty-palace-hint">
            空宫
          </div>
        </div>
      </div>
    </div>

    <!-- 宫位详情弹窗 -->
    <PalaceDetailCard
      v-if="selectedPalace"
      :model-value="!!selectedPalace"
      :palace="selectedPalace.palace"
      :is-ming-gong="selectedPalace.index === 0"
      :is-shen-gong="isShenGong(selectedPalace.index)"
      @close="selectedPalace = null"
    />

    <!-- 星曜详情弹窗 -->
    <StarDetailModal
      v-model="showStarModal"
      :star="selectedStar"
    />

      <!-- 格局展示 -->
    <div v-if="chart.patterns.length > 0" class="patterns-section" ref="patternsSectionRef">
      <h3 class="patterns-title">✨ 格局识别</h3>
      <div class="patterns-grid">
        <div
          v-for="(pattern, index) in chart.patterns"
          :key="pattern.name"
          class="pattern-card pattern-item"
          :class="pattern.level"
          :data-index="index"
        >
          <div class="pattern-header">
            <h4 class="pattern-name">{{ pattern.name }}</h4>
            <div class="pattern-score">{{ pattern.score }}分</div>
          </div>
          <p class="pattern-description">{{ pattern.description }}</p>
          <div v-if="pattern.stars && pattern.stars.length > 0" class="pattern-stars">
            <span
              v-for="starName in pattern.stars"
              :key="starName"
              class="pattern-star-tag"
            >
              {{ starName }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue';
import { NButtonGroup, NButton, NIcon } from 'naive-ui';
import anime from 'animejs';
import type { ZiweiChart, Palace, Star } from '../types';
import PalaceDetailCard from './PalaceDetailCard.vue';
import StarDetailModal from './StarDetailModal.vue';
import { getRelatedPalaces } from '../utils/palaceRelations';
import TermTooltip from './TermTooltip.vue';

interface Props {
  chart: ZiweiChart;
  isDarkMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isDarkMode: false,
});

/**
 * 判断是否为身宫
 */
const isShenGong = (index: number): boolean => {
  if (!props.chart.shenGong) return false;
  const shenGongIndex = props.chart.palaces.findIndex(
    p => p.name === props.chart.shenGong.name
  );
  return shenGongIndex === index;
};

/**
 * 获取宫位位置（圆形布局）
 * 12个宫位均匀分布在圆周上
 */
const getPalacePosition = (index: number) => {
  const angle = (index * 30 - 90) * (Math.PI / 180); // 从顶部开始，每个宫位30度
  const radius = 280; // 半径（px）
  const centerX = 50; // 中心点百分比
  const centerY = 50;

  // 精确计算位置，确保圆形完美居中
  const x = centerX + (radius / 10) * Math.cos(angle);
  const y = centerY + (radius / 10) * Math.sin(angle);

  return {
    position: 'absolute' as const,
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%, -50%) rotate(${index * 30}deg)`,
    transformOrigin: 'center center',
  };
};

/**
 * 获取主星
 */
const getMainStars = (stars: Star[]): Star[] => {
  return stars.filter(star => star.category === '主星');
};

/**
 * 获取辅星
 */
const getAuxiliaryStars = (stars: Star[]): Star[] => {
  return stars.filter(star => star.category !== '主星');
};

/**
 * 计算身宫索引
 */
const shenGongIndex = computed(() => {
  if (!props.chart.shenGong) return -1;
  return props.chart.palaces.findIndex(
    p => p.name === props.chart.shenGong.name
  );
});

// 动画相关
const palacesRingRef = ref<HTMLElement | null>(null);
const patternsSectionRef = ref<HTMLElement | null>(null);
const isAnimated = ref(false);

// 交互相关
const selectedPalace = ref<{ palace: Palace; index: number } | null>(null);
const selectedStar = ref<Star | null>(null);
const showStarModal = ref(false);
const highlightedPalaces = ref<number[]>([]);
const relatedPalaces = ref<number[]>([]);
const zoomLevel = ref(1);

/**
 * 处理宫位点击
 */
const handlePalaceClick = (palace: Palace, index: number) => {
  selectedPalace.value = { palace, index };
};

/**
 * 处理星曜点击
 */
const handleStarClick = (star: Star) => {
  selectedStar.value = star;
  showStarModal.value = true;
};

/**
 * 处理宫位hover
 */
const handlePalaceHover = (index: number) => {
  const relations = getRelatedPalaces(index);
  relatedPalaces.value = [
    ...relations.sanhe,
    relations.chong,
    ...relations.sihua
  ];
  highlightedPalaces.value = [index];
};

/**
 * 处理宫位离开
 */
const handlePalaceLeave = () => {
  highlightedPalaces.value = [];
  relatedPalaces.value = [];
};

/**
 * 缩放控制
 */
const zoomIn = () => {
  if (zoomLevel.value < 2) {
    zoomLevel.value = Math.min(zoomLevel.value + 0.1, 2);
  }
};

const zoomOut = () => {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5);
  }
};

const resetZoom = () => {
  zoomLevel.value = 1;
};

/**
 * 初始化动画
 */
onMounted(async () => {
  await nextTick();
  animateChartGeneration();
});

  /**
   * 星盘生成动画
   */
  const animateChartGeneration = () => {
    if (!palacesRingRef.value) return;

    // 1. 中心区域淡入（使用transform scale，保持居中）
    // 注意：anime.js会自动组合transform属性，translate(-50%, -50%)会被保留
    anime({
      targets: '.chart-center',
      opacity: [0, 1],
      scale: [0.8, 1],
      translateX: ['-50%', '-50%'], // 保持水平居中
      translateY: ['-50%', '-50%'], // 保持垂直居中
      duration: 800,
      easing: 'easeOutElastic(1, .8)',
    });

  // 2. 宫位依次出现（从命宫开始）
  const palaces = palacesRingRef.value.querySelectorAll('.palace');
  anime({
    targets: palaces,
    opacity: [0, 1],
    scale: [0.5, 1],
    translateY: [20, 0],
    delay: (el: any, i: number) => {
      // 命宫优先，然后顺时针
      if (i === 0) return 300;
      return 300 + i * 80;
    },
    duration: 600,
    easing: 'easeOutBack',
    complete: () => {
      isAnimated.value = true;
      animateStars();
      animateSihua();
    },
  });

  // 3. 格局卡片动画
  if (patternsSectionRef.value) {
    const patternCards = patternsSectionRef.value.querySelectorAll('.pattern-item');
    anime({
      targets: patternCards,
      opacity: [0, 1],
      translateY: [30, 0],
      delay: (el: any, i: number) => 1000 + i * 150,
      duration: 500,
      easing: 'easeOutQuad',
    });
  }
};

/**
 * 星曜出现动画
 */
const animateStars = () => {
  const starItems = palacesRingRef.value?.querySelectorAll('.star-item');
  if (!starItems || starItems.length === 0) return;

  anime({
    targets: starItems,
    opacity: [0, 1],
    scale: [0, 1],
    rotate: [180, 0],
    delay: (el: any) => {
      const delay = parseInt(el.dataset.delay || '0');
      return 1200 + delay;
    },
    duration: 400,
    easing: 'easeOutElastic(1, .6)',
  });
};

/**
 * 四化标记动画
 */
const animateSihua = () => {
  setTimeout(() => {
    const sihuaMarkers = palacesRingRef.value?.querySelectorAll('.sihua-marker');
    if (!sihuaMarkers || sihuaMarkers.length === 0) return;

    anime({
      targets: sihuaMarkers,
      opacity: [0, 1],
      scale: [0, 1],
      delay: (el: any, i: number) => i * 100,
      duration: 400,
      easing: 'easeOutBack',
    });
  }, 1800);
};
</script>

<style scoped>
.ziwei-chart-container {
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  position: relative;
  min-height: 100vh;
}

.chart-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chart-wrapper {
  position: relative;
  width: 100%;
  max-width: 800px;
  aspect-ratio: 1;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);                                                                
  border-radius: 50%;
  border: 3px solid rgba(147, 51, 234, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: chartGlow 4s ease-in-out infinite;
  transition: transform 0.3s ease;
  transform-origin: center center;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes chartGlow {
  0%, 100% {
    box-shadow: 0 20px 60px rgba(147, 51, 234, 0.3);
  }
  50% {
    box-shadow: 0 20px 80px rgba(147, 51, 234, 0.5);
  }
}

.chart-wrapper.dark-mode {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%);
  border-color: rgba(147, 51, 234, 0.5);
}

/* 中心区域 */
.chart-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 10;
  opacity: 0;
  /* 使用transform确保完美居中，transform-origin确保缩放时以中心为基准 */
  transform: translate(-50%, -50%);
  transform-origin: center center;
  animation: centerGlow 3s ease-in-out infinite;
}

@keyframes centerGlow {
  0%, 100% {
    box-shadow: 0 10px 30px rgba(147, 51, 234, 0.3);
  }
  50% {
    box-shadow: 0 10px 40px rgba(147, 51, 234, 0.5);
  }
}

.chart-wrapper.dark-mode .chart-center {
  background: rgba(30, 30, 30, 0.95);
  color: white;
}

.center-content {
  text-align: center;
  padding: 1rem;
}

.center-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #9333EA;
  margin-bottom: 0.5rem;
}

.center-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.9rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.info-label {
  color: #666;
  font-weight: 500;
}

.info-value {
  color: #333;
  font-weight: bold;
}

.chart-wrapper.dark-mode .info-label {
  color: #999;
}

.chart-wrapper.dark-mode .info-value {
  color: #fff;
}

/* 宫位环形布局 */
.palaces-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: center center;
}

.palace {
  position: absolute;
  width: 180px;
  min-height: 160px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(147, 51, 234, 0.3);
  border-radius: 16px;
  padding: 0.75rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 5;
  opacity: 0;
  transform: scale(0.5) translateY(20px);
}

.palace.palace-animated {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.palace {
  cursor: pointer;
}

.palace:hover {
  transform: translate(-50%, -50%) scale(1.15) rotate(0deg) !important;
  z-index: 20;
  box-shadow: 0 12px 32px rgba(147, 51, 234, 0.5);
  border-color: rgba(147, 51, 234, 0.6);
  animation: palacePulse 2s ease-in-out infinite;
}

.palace.palace-highlighted {
  border-color: rgba(147, 51, 234, 0.8) !important;
  box-shadow: 0 0 20px rgba(147, 51, 234, 0.6) !important;
  z-index: 15;
}

.palace.palace-related {
  border-color: rgba(59, 130, 246, 0.5) !important;
  background: rgba(59, 130, 246, 0.1) !important;
  z-index: 12;
}

@keyframes palacePulse {
  0%, 100% {
    box-shadow: 0 12px 32px rgba(147, 51, 234, 0.5);
  }
  50% {
    box-shadow: 0 12px 32px rgba(147, 51, 234, 0.8);
  }
}

.palace.ming-gong {
  border-color: #9333EA;
  background: rgba(147, 51, 234, 0.1);
  box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
}

.palace.shen-gong {
  border-color: #3B82F6;
  background: rgba(59, 130, 246, 0.1);
}

.palace.empty {
  opacity: 0.7;
}

.chart-wrapper.dark-mode .palace {
  background: rgba(30, 30, 30, 0.95);
  border-color: rgba(147, 51, 234, 0.4);
  color: white;
}

/* 宫位标题 */
.palace-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.3rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.chart-wrapper.dark-mode .palace-title {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.palace-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}

.chart-wrapper.dark-mode .palace-name {
  color: white;
}

.badge {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-weight: bold;
}

.ming-badge {
  background: #9333EA;
  color: white;
}

.shen-badge {
  background: #3B82F6;
  color: white;
}

/* 主星 */
.main-stars {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 0.3rem;
}

.main-star {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0;
  transform: scale(0) rotate(180deg);
  transition: all 0.3s ease;
}

.star-item {
  opacity: 0;
  transform: scale(0) rotate(180deg);
}

.star-item.clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.star-item.clickable:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
  background: rgba(147, 51, 234, 0.1);
  border-radius: 4px;
  padding: 0.2rem;
}

.star-emoji {
  font-size: 1rem;
  display: inline-block;
  transition: transform 0.3s ease;
}

.star-item:hover .star-emoji {
  transform: rotate(360deg) scale(1.2);
  animation: starTwinkle 0.5s ease-in-out;
}

@keyframes starTwinkle {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.5) drop-shadow(0 0 8px currentColor);
  }
}

.star-name {
  font-size: 1rem;
  font-weight: 600;
}

/* 辅星 */
.auxiliary-stars {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  margin-bottom: 0.3rem;
}

.auxiliary-star {
  font-size: 0.7rem;
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.05);
}

.auxiliary-star.辅星 {
  background: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
}

.auxiliary-star.吉星 {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.auxiliary-star.煞星 {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.chart-wrapper.dark-mode .auxiliary-star {
  background: rgba(255, 255, 255, 0.1);
}

.star-name-small {
  font-size: 0.85rem;
  font-weight: 500;
}

/* 四化标记 */
.sihua-markers {
  display: flex;
  gap: 0.2rem;
  flex-wrap: wrap;
  margin-top: 0.2rem;
}

.sihua-marker {
  font-size: 0.8rem;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  font-weight: bold;
  min-width: 24px;
  text-align: center;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
  animation: sihuaPulse 2s ease-in-out infinite;
}

@keyframes sihuaPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.sihua-marker.lu {
  background: rgba(16, 185, 129, 0.2);
  color: #10B981;
}

.sihua-marker.quan {
  background: rgba(245, 158, 11, 0.2);
  color: #F59E0B;
}

.sihua-marker.ke {
  background: rgba(59, 130, 246, 0.2);
  color: #3B82F6;
}

.sihua-marker.ji {
  background: rgba(239, 68, 68, 0.2);
  color: #EF4444;
}

/* 空宫提示 */
.empty-palace-hint {
  font-size: 0.95rem;
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 0.5rem 0;
  font-weight: 500;
}

.chart-wrapper.dark-mode .empty-palace-hint {
  color: #666;
}

/* 格局展示 */
.patterns-section {
  width: 100%;
  max-width: 1200px;
  margin-top: 2rem;
}

.patterns-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  animation: titleShimmer 3s ease-in-out infinite;
  background: linear-gradient(90deg, #9333EA 0%, #3B82F6 50%, #9333EA 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes titleShimmer {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

.patterns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.pattern-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid rgba(147, 51, 234, 0.2);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(30px);
}

.pattern-item {
  opacity: 1;
  transform: translateY(0);
}

.pattern-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 32px rgba(147, 51, 234, 0.4);
  border-color: rgba(147, 51, 234, 0.5);
}

.pattern-card.excellent {
  border-color: #10B981;
  background: rgba(16, 185, 129, 0.05);
}

.pattern-card.good {
  border-color: #3B82F6;
  background: rgba(59, 130, 246, 0.05);
}

.pattern-card.normal {
  border-color: #F59E0B;
  background: rgba(245, 158, 11, 0.05);
}

.pattern-card.poor {
  border-color: #EF4444;
  background: rgba(239, 68, 68, 0.05);
}

.pattern-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.pattern-name {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.pattern-score {
  font-size: 0.9rem;
  font-weight: bold;
  color: #9333EA;
  background: rgba(147, 51, 234, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.pattern-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0.5rem 0;
  line-height: 1.5;
}

.pattern-stars {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.5rem;
}

.pattern-star-tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
  background: rgba(147, 51, 234, 0.1);
  color: #9333EA;
  border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ziwei-chart-container {
    padding: 1rem;
    min-height: auto;
  }

  .chart-wrapper {
    max-width: 100%;
    margin: 0 auto;
  }

  .palace {
    width: 150px;
    min-height: 140px;
    font-size: 0.9rem;
    padding: 0.6rem;
  }

  .center-content {
    padding: 0.5rem;
  }

  .center-title {
    font-size: 1.2rem;
  }

  .patterns-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .ziwei-chart-container {
    padding: 0.5rem;
    min-height: auto;
  }

  .chart-wrapper {
    max-width: 100%;
    margin: 0 auto;
  }

  .palace {
    width: 120px;
    min-height: 110px;
    font-size: 0.7rem;
    padding: 0.5rem;
  }

  .chart-center {
    width: 150px;
    height: 150px;
    /* transform: translate(-50%, -50%) 已经在基础样式中设置，这里不需要额外设置 */
  }

  .center-title {
    font-size: 1rem;
  }

  .center-info {
    font-size: 0.8rem;
  }
}
</style>


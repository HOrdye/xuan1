<template>
  <div class="chart-display">
    <div v-if="!currentChart" class="no-chart">
      <n-empty description="还没有生成命盘">
        <template #extra>
          <n-button @click="goToInput">去输入生辰</n-button>
        </template>
      </n-empty>
    </div>

    <div v-else class="chart-content">
      <div class="chart-header">
        <h2>你的紫微命盘</h2>
        <div class="birth-info">
          <p>出生：{{ birthInfoText }}</p>
          <p>五行局：{{ currentChart.wuxingJu }}</p>
        </div>
      </div>

      <div class="palaces-grid">
        <div 
          v-for="(palace, index) in currentChart.palaces" 
          :key="index"
          class="palace-card"
          :class="{ 'ming-gong': index === 0 }"
        >
          <div class="palace-header">
            <h3>{{ palace.name }}</h3>
            <span v-if="index === 0" class="ming-gong-badge">命宫</span>
          </div>
          
          <div class="stars-list">
            <div 
              v-for="star in palace.stars" 
              :key="star.id"
              class="star-item"
              :style="{ color: star.color }"
            >
              <span class="star-emoji">{{ star.emoji }}</span>
              <span class="star-name">{{ star.name }}</span>
            </div>
            <div v-if="palace.stars.length === 0" class="empty-palace">
              空宫
            </div>
          </div>

          <div v-if="palace.sihua" class="sihua-info">
            <span v-if="palace.sihua.lu" class="sihua-tag lu">化禄: {{ palace.sihua.lu }}</span>
            <span v-if="palace.sihua.quan" class="sihua-tag quan">化权: {{ palace.sihua.quan }}</span>
            <span v-if="palace.sihua.ke" class="sihua-tag ke">化科: {{ palace.sihua.ke }}</span>
            <span v-if="palace.sihua.ji" class="sihua-tag ji">化忌: {{ palace.sihua.ji }}</span>
          </div>
        </div>
      </div>

      <div v-if="currentChart.patterns.length > 0" class="patterns-section">
        <h3>格局识别</h3>
        <div class="patterns-list">
          <div 
            v-for="pattern in currentChart.patterns" 
            :key="pattern.name"
            class="pattern-card"
            :class="pattern.level"
          >
            <h4>{{ pattern.name }}</h4>
            <p>{{ pattern.description }}</p>
            <div class="pattern-score">评分：{{ pattern.score }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useZiweiStore } from '../store/ziweiStore';
import { NEmpty, NButton } from 'naive-ui';

const router = useRouter();
const ziweiStore = useZiweiStore();

const currentChart = computed(() => ziweiStore.currentChart);

const birthInfoText = computed(() => {
  if (!currentChart.value) return '';
  const { year, month, day, hour, gender } = currentChart.value.birthInfo;
  const hourNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  return `${year}年${month}月${day}日 ${hourNames[hour]}时 ${gender === 'male' ? '男' : '女'}`;
});

const goToInput = () => {
  router.push('/ziwei/input');
};
</script>

<style scoped>
.chart-display {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.no-chart {
  text-align: center;
  padding: 4rem 2rem;
}

.chart-header {
  text-align: center;
  margin-bottom: 2rem;
}

.chart-header h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.birth-info {
  color: #666;
}

.palaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.palace-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.2s;
}

.palace-card:hover {
  transform: translateY(-4px);
}

.palace-card.ming-gong {
  border: 2px solid #9333EA;
  box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
}

.palace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.palace-header h3 {
  font-size: 1.2rem;
  margin: 0;
}

.ming-gong-badge {
  background: #9333EA;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.stars-list {
  min-height: 60px;
  margin-bottom: 0.5rem;
}

.star-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
  font-weight: 500;
}

.star-emoji {
  font-size: 1.2rem;
}

.empty-palace {
  color: #999;
  font-style: italic;
}

.sihua-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.5rem;
}

.sihua-tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
}

.sihua-tag.lu {
  color: #10B981;
}

.sihua-tag.quan {
  color: #F59E0B;
}

.sihua-tag.ke {
  color: #3B82F6;
}

.sihua-tag.ji {
  color: #EF4444;
}

.patterns-section {
  margin-top: 2rem;
}

.patterns-section h3 {
  margin-bottom: 1rem;
}

.patterns-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.pattern-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.pattern-card.excellent {
  border-color: #10B981;
}

.pattern-card.good {
  border-color: #3B82F6;
}

.pattern-card.normal {
  border-color: #F59E0B;
}

.pattern-score {
  margin-top: 0.5rem;
  font-weight: bold;
  color: #9333EA;
}
</style>


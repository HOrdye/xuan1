<template>
  <div class="chart-loading">
    <div class="loading-content">
      <!-- 旋转的魔法阵 -->
      <div class="magic-circle">
        <div class="circle-ring ring-1"></div>
        <div class="circle-ring ring-2"></div>
        <div class="circle-ring ring-3"></div>
        <div class="center-star">⭐</div>
      </div>
      
      <!-- 加载文字 -->
      <div class="loading-text">
        <div class="text-line" v-for="(text, index) in loadingTexts" :key="index" :style="{ animationDelay: `${index * 0.3}s` }">
          {{ text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loadingTexts = ref([
  '正在计算农历...',
  '定位紫微星...',
  '安排群星...',
  '识别格局...',
  '生成命盘...'
]);
</script>

<style scoped>
.chart-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  width: 100%;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.magic-circle {
  position: relative;
  width: 200px;
  height: 200px;
}

.circle-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 3px solid rgba(147, 51, 234, 0.3);
  border-radius: 50%;
  border-top-color: #9333EA;
  border-right-color: #3B82F6;
}

.ring-1 {
  width: 120px;
  height: 120px;
  animation: rotate 2s linear infinite;
}

.ring-2 {
  width: 160px;
  height: 160px;
  animation: rotate 3s linear infinite reverse;
}

.ring-3 {
  width: 200px;
  height: 200px;
  animation: rotate 4s linear infinite;
}

.center-star {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.7;
  }
}

.loading-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.text-line {
  font-size: 1.1rem;
  color: #9333EA;
  font-weight: 500;
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>









<template>
  <div class="ziwei-home">
    <div class="hero-section">
      <h1 class="title">🌟 紫微斗数</h1>
      <p class="subtitle">观星盘，知天命，做自己命运的设计师</p>
    </div>

    <div class="action-section">
      <n-button 
        type="primary" 
        size="large"
        @click="startPersonalityTest"
        :loading="isLoading"
      >
        开始紫微人格测试
      </n-button>
      
      <n-button 
        type="default" 
        size="large"
        @click="directInput"
      >
        直接输入生辰
      </n-button>
    </div>

    <div v-if="currentChart" class="chart-preview">
      <h3>你的命盘</h3>
      <p>命宫主星：{{ mainStarName }}</p>
      <n-button @click="viewFullChart">查看完整命盘</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useZiweiStore } from '../store/ziweiStore';
import { NButton } from 'naive-ui';

const router = useRouter();
const ziweiStore = useZiweiStore();

const currentChart = computed(() => ziweiStore.currentChart);
const isLoading = computed(() => ziweiStore.isLoading);
const mainStarName = computed(() => ziweiStore.mainStar?.name || '未知');

const startPersonalityTest = () => {
  router.push('/ziwei/personality-test');
};

const directInput = () => {
  router.push('/ziwei/input');
};

const viewFullChart = () => {
  router.push('/ziwei/chart');
};
</script>

<style scoped>
.ziwei-home {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
}

.action-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.chart-preview {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>


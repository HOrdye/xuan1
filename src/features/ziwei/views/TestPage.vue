<template>
  <div class="test-page">
    <h2>🧪 紫微斗数功能测试</h2>
    
    <div class="test-section">
      <h3>测试用例</h3>
      <div class="test-cases">
        <div 
          v-for="(testCase, index) in testCases" 
          :key="index"
          class="test-case-card"
        >
          <h4>{{ testCase.name }}</h4>
          <p>出生：{{ formatBirthInfo(testCase.birthInfo) }}</p>
          <n-button @click="runTest(testCase)" :loading="loadingIndex === index">
            运行测试
          </n-button>
        </div>
      </div>
    </div>

    <div v-if="testResult" class="test-result">
      <h3>测试结果</h3>
      <div class="result-content">
        <div class="result-item">
          <strong>五行局：</strong>{{ testResult.wuxingJu }}
        </div>
        <div class="result-item">
          <strong>命宫主星：</strong>
          {{ testResult.mingGong.stars.map(s => s.name).join('、') || '空宫' }}
        </div>
        <div class="result-item">
          <strong>格局：</strong>
          {{ testResult.patterns.map(p => p.name).join('、') || '无' }}
        </div>
        <div class="result-item">
          <strong>大限：</strong>
          {{ testResult.daxian.length }}个
        </div>
        
        <div class="palaces-preview">
          <h4>十二宫预览</h4>
          <div class="palaces-grid">
            <div 
              v-for="(palace, index) in testResult.palaces" 
              :key="index"
              class="palace-mini"
              :class="{ 'ming-gong': index === 0 }"
            >
              <div class="palace-name">{{ palace.name }}</div>
              <div class="palace-stars">
                {{ palace.stars.map(s => s.name).join(' ') || '空' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useZiweiStore } from '../store/ziweiStore';
import type { BirthInfo, ZiweiChart } from '../types';
import { NButton } from 'naive-ui';

const ziweiStore = useZiweiStore();

const testCases = [
  {
    name: '测试用例1',
    birthInfo: {
      year: 1990,
      month: 1,
      day: 1,
      hour: 0,
      gender: 'male' as const
    }
  },
  {
    name: '测试用例2',
    birthInfo: {
      year: 1995,
      month: 6,
      day: 15,
      hour: 6,
      gender: 'female' as const
    }
  },
  {
    name: '测试用例3',
    birthInfo: {
      year: 2000,
      month: 12,
      day: 25,
      hour: 12,
      gender: 'male' as const
    }
  }
];

const loadingIndex = ref<number | null>(null);
const testResult = ref<ZiweiChart | null>(null);

const formatBirthInfo = (info: BirthInfo) => {
  const hourNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  return `${info.year}年${info.month}月${info.day}日 ${hourNames[info.hour]}时 ${info.gender === 'male' ? '男' : '女'}`;
};

const runTest = async (testCase: typeof testCases[0]) => {
  loadingIndex.value = testCases.indexOf(testCase);
  testResult.value = null;
  
  try {
    const chart = await ziweiStore.generateChart(testCase.birthInfo);
    testResult.value = chart;
    console.log('测试成功:', chart);
  } catch (error: any) {
    console.error('测试失败:', error);
    alert(`测试失败: ${error.message}`);
  } finally {
    loadingIndex.value = null;
  }
};
</script>

<style scoped>
.test-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.test-section {
  margin-bottom: 2rem;
}

.test-cases {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.test-case-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.test-result {
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.result-content {
  margin-top: 1rem;
}

.result-item {
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.palaces-preview {
  margin-top: 2rem;
}

.palaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
}

.palace-mini {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
}

.palace-mini.ming-gong {
  border-color: #9333EA;
  background: rgba(147, 51, 234, 0.1);
}

.palace-name {
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.palace-stars {
  font-size: 0.8rem;
  color: #999;
}
</style>


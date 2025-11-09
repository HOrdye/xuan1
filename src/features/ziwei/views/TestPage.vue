<template>
  <div class="test-page">
    <div class="page-header">
      <h2>🧪 紫微斗数功能测试</h2>
      <p class="subtitle">测试排盘算法的正确性和数据完整性</p>
    </div>

    <div class="test-section">
      <h3>📋 测试用例</h3>
      <div class="test-cases">
        <div
          v-for="(testCase, index) in testCases"
          :key="index"
          class="test-case-card"
        >
          <div class="test-case-header">
            <h4>{{ testCase.name }}</h4>
            <span 
              v-if="testResult && testResult.birthInfo.year === testCase.birthInfo.year"
              class="test-badge success"
            >
              ✓ 已测试
            </span>
          </div>
          <p class="birth-info">出生：{{ formatBirthInfo(testCase.birthInfo) }}</p>
          <n-button 
            type="primary"
            @click="runTest(testCase)" 
            :loading="loadingIndex === index"
            block
          >                                                                               
            运行测试
          </n-button>
        </div>
      </div>
    </div>

    <div v-if="testResult" class="test-result">
      <div class="result-header">
        <h3>✅ 测试结果</h3>
        <n-button size="small" @click="viewFullChart">查看完整命盘</n-button>
      </div>
      
      <div class="result-content">
        <!-- 基本信息 -->
        <div class="info-section">
          <h4>基本信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">出生信息：</span>
              <span class="value">{{ formatBirthInfo(testResult.birthInfo) }}</span>
            </div>
            <div class="info-item">
              <span class="label">五行局：</span>
              <span class="value highlight">{{ testResult.wuxingJu }}</span>
            </div>
            <div class="info-item">
              <span class="label">命宫主星：</span>
              <span class="value highlight">
                {{ testResult.mingGong.stars.map(s => s.name).join('、') || '空宫' }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">格局数量：</span>
              <span class="value">{{ testResult.patterns.length }}个</span>
            </div>
          </div>
        </div>

        <!-- 格局信息 -->
        <div v-if="testResult.patterns.length > 0" class="info-section">
          <h4>识别到的格局</h4>
          <div class="patterns-list">
            <div
              v-for="(pattern, index) in testResult.patterns"
              :key="index"
              class="pattern-card"
              :class="pattern.level"
            >
              <div class="pattern-header">
                <span class="pattern-name">{{ pattern.name }}</span>
                <span class="pattern-score">评分：{{ pattern.score }}</span>
              </div>
              <p class="pattern-desc">{{ pattern.description }}</p>
            </div>
          </div>
        </div>

        <!-- 大限信息 -->
        <div class="info-section">
          <h4>大限信息</h4>
          <div class="daxian-list">
            <div
              v-for="(daxian, index) in testResult.daxian.slice(0, 5)"
              :key="index"
              class="daxian-item"
            >
              <span class="daxian-age">{{ daxian.startAge }}-{{ daxian.endAge }}岁</span>
              <span class="daxian-palace">{{ daxian.palace.name }}</span>
            </div>
            <div v-if="testResult.daxian.length > 5" class="daxian-more">
              还有 {{ testResult.daxian.length - 5 }} 个大限...
            </div>
          </div>
        </div>

        <!-- 十二宫预览 -->
        <div class="palaces-preview">
          <h4>十二宫星曜分布</h4>
          <div class="palaces-grid">
            <div
              v-for="(palace, index) in testResult.palaces"
              :key="index"
              class="palace-mini"
              :class="{ 'ming-gong': index === 0 }"
            >
              <div class="palace-header-mini">
                <span class="palace-name">{{ palace.name }}</span>
                <span v-if="index === 0" class="ming-badge">命</span>
              </div>
              <div class="palace-stars">
                <template v-if="palace.stars.length > 0">
                  <span
                    v-for="(star, starIndex) in palace.stars"
                    :key="starIndex"
                    class="star-tag"
                    :style="{ color: star.color }"
                  >
                    {{ star.emoji }} {{ star.name }}
                  </span>
                </template>
                <span v-else class="empty-tag">空</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误信息 -->
    <div v-if="errorMessage" class="error-message">
      <n-alert type="error" title="测试失败">
        {{ errorMessage }}
      </n-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useZiweiStore } from '../store/ziweiStore';
import type { BirthInfo, ZiweiChart } from '../types';
import { NButton, NAlert, useMessage } from 'naive-ui';

const router = useRouter();
const ziweiStore = useZiweiStore();
const message = useMessage();

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
const errorMessage = ref<string | null>(null);

const formatBirthInfo = (info: BirthInfo) => {
  const hourNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];                                                                   
  return `${info.year}年${info.month}月${info.day}日 ${hourNames[info.hour]}时 ${info.gender === 'male' ? '男' : '女'}`;                                        
};

const runTest = async (testCase: typeof testCases[0]) => {
  loadingIndex.value = testCases.indexOf(testCase);
  testResult.value = null;
  errorMessage.value = null;

  try {
    const chart = await ziweiStore.generateChart(testCase.birthInfo);
    testResult.value = chart;
    message.success('测试成功！命盘已生成');
    console.log('测试成功:', chart);
    
    // 验证数据完整性
    validateChart(chart);
  } catch (error: any) {
    console.error('测试失败:', error);
    errorMessage.value = error.message || '排盘失败，请检查输入数据';
    message.error(`测试失败: ${error.message || '未知错误'}`);
  } finally {
    loadingIndex.value = null;
  }
};

const validateChart = (chart: ZiweiChart) => {
  const issues: string[] = [];
  
  if (chart.palaces.length !== 12) {
    issues.push(`宫位数量不正确：应为12个，实际${chart.palaces.length}个`);
  }
  
  if (!chart.mingGong) {
    issues.push('命宫不存在');
  }
  
  if (chart.daxian.length !== 12) {
    issues.push(`大限数量不正确：应为12个，实际${chart.daxian.length}个`);
  }
  
  if (issues.length > 0) {
    console.warn('数据验证发现问题:', issues);
    message.warning('数据验证发现问题，请查看控制台');
  } else {
    console.log('✅ 数据验证通过');
  }
};

const viewFullChart = () => {
  router.push('/ziwei/chart');
};
</script>

<style scoped>
.test-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h2 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.test-section {
  margin-bottom: 3rem;
}

.test-section h3 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.test-cases {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.test-case-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.test-case-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.test-case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.test-case-header h4 {
  margin: 0;
  font-size: 1.2rem;
}

.test-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.test-badge.success {
  background: #10b981;
  color: white;
}

.birth-info {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.test-result {
  margin-top: 3rem;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.result-header h3 {
  margin: 0;
  font-size: 1.8rem;
  color: #9333EA;
}

.result-content {
  margin-top: 1rem;
}

.info-section {
  margin-bottom: 2rem;
}

.info-section h4 {
  margin-bottom: 1rem;
  color: #374151;
  font-size: 1.2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 3px solid #9333EA;
}

.info-item .label {
  display: block;
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.info-item .value {
  display: block;
  color: #111827;
  font-size: 1rem;
  font-weight: 500;
}

.info-item .value.highlight {
  color: #9333EA;
  font-weight: 600;
}

.patterns-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.pattern-card {
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid;
}

.pattern-card.excellent {
  border-color: #10b981;
  background: #f0fdf4;
}

.pattern-card.good {
  border-color: #3b82f6;
  background: #eff6ff;
}

.pattern-card.normal {
  border-color: #f59e0b;
  background: #fffbeb;
}

.pattern-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.pattern-name {
  font-weight: 600;
  font-size: 1.1rem;
}

.pattern-score {
  color: #9333EA;
  font-weight: 600;
}

.pattern-desc {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.daxian-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.daxian-item {
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.daxian-age {
  font-weight: 600;
  color: #9333EA;
}

.daxian-palace {
  color: #6b7280;
  font-size: 0.9rem;
}

.daxian-more {
  padding: 0.75rem 1rem;
  color: #6b7280;
  font-style: italic;
}

.palaces-preview {
  margin-top: 2rem;
}

.palaces-preview h4 {
  margin-bottom: 1rem;
}

.palaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.palace-mini {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  transition: all 0.2s;
}

.palace-mini:hover {
  border-color: #9333EA;
  box-shadow: 0 2px 8px rgba(147, 51, 234, 0.2);
}

.palace-mini.ming-gong {
  border-color: #9333EA;
  background: #faf5ff;
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
}

.palace-header-mini {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.palace-name {
  font-weight: 600;
  color: #111827;
  font-size: 1rem;
}

.ming-badge {
  background: #9333EA;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.palace-stars {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 2rem;
}

.star-tag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: white;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid currentColor;
}

.empty-tag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  color: #9ca3af;
  font-size: 0.85rem;
  font-style: italic;
}

.error-message {
  margin-top: 2rem;
}
</style>


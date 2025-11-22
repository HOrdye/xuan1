<template>
  <div class="phase1-test-container">
    <n-card title="P0阶段功能测试" class="test-card">
      <template #header-extra>
        <n-button 
          type="primary" 
          @click="runTests"
          :loading="testing"
        >
          {{ testing ? '测试中...' : '运行测试' }}
        </n-button>
      </template>

      <div v-if="testResults.length === 0" class="empty-state">
        <n-empty description="点击上方按钮开始测试">
          <template #icon>
            <n-icon size="48">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </n-icon>
          </template>
        </n-empty>
      </div>

      <div v-else>
        <!-- 测试摘要 -->
        <n-statistic label="测试摘要" class="test-summary">
          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-label">总计:</span>
              <span class="stat-value">{{ testResults.length }}</span>
            </div>
            <div class="stat-item success">
              <span class="stat-label">通过:</span>
              <span class="stat-value">{{ passedCount }}</span>
            </div>
            <div class="stat-item error">
              <span class="stat-label">失败:</span>
              <span class="stat-value">{{ failedCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">通过率:</span>
              <span class="stat-value">{{ passRate }}%</span>
            </div>
          </div>
        </n-statistic>

        <!-- 测试结果列表 -->
        <n-divider />
        <div class="test-results">
          <div
            v-for="(result, index) in testResults"
            :key="index"
            class="test-result-item"
            :class="{ 'test-passed': result.passed, 'test-failed': !result.passed }"
          >
            <div class="test-header">
              <n-icon :size="20" :color="result.passed ? '#18a058' : '#d03050'">
                <svg viewBox="0 0 24 24" v-if="result.passed">
                  <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <svg viewBox="0 0 24 24" v-else>
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </n-icon>
              <span class="test-name">{{ result.name }}</span>
            </div>
            <div class="test-message">{{ result.message }}</div>
            <div v-if="result.details && !result.passed" class="test-details">
              <n-collapse>
                <n-collapse-item title="查看详情" name="details">
                  <pre>{{ JSON.stringify(result.details, null, 2) }}</pre>
                </n-collapse-item>
              </n-collapse>
            </div>
          </div>
        </div>

        <!-- 测试完成提示 -->
        <n-divider />
        <n-alert 
          :type="allPassed ? 'success' : 'warning'"
          :title="allPassed ? '🎉 所有测试通过！' : '⚠️ 部分测试失败'"
          class="test-alert"
        >
          {{ allPassed 
            ? 'P0阶段所有功能正常工作！' 
            : '请检查失败的测试项，修复相关问题。' 
          }}
        </n-alert>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { NCard, NButton, NIcon, NEmpty, NStatistic, NDivider, NCollapse, NCollapseItem, NAlert } from 'naive-ui';
import { runPhase1Tests } from '../utils/test-phase1';
import type { TestResult } from '../utils/test-phase1';

const testing = ref(false);
const testResults = ref<TestResult[]>([]);

const passedCount = computed(() => 
  testResults.value.filter(r => r.passed).length
);

const failedCount = computed(() => 
  testResults.value.filter(r => !r.passed).length
);

const passRate = computed(() => 
  testResults.value.length > 0 
    ? ((passedCount.value / testResults.value.length) * 100).toFixed(1)
    : '0'
);

const allPassed = computed(() => 
  testResults.value.length > 0 && failedCount.value === 0
);

const runTests = async () => {
  testing.value = true;
  testResults.value = [];
  
  try {
    // 运行测试
    const results = runPhase1Tests();
    testResults.value = results;
  } catch (error: any) {
    console.error('测试运行失败:', error);
    testResults.value = [{
      name: '测试运行器',
      passed: false,
      message: `测试运行失败: ${error.message}`,
      details: { error: error.stack }
    }];
  } finally {
    testing.value = false;
  }
};
</script>

<style scoped>
.phase1-test-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.test-summary {
  margin-bottom: 20px;
}

.summary-stats {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
}

.stat-item.success .stat-value {
  color: #18a058;
}

.stat-item.error .stat-value {
  color: #d03050;
}

.test-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.test-result-item {
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: #fafafa;
}

.test-result-item.test-passed {
  border-color: #18a058;
  background: #f0f9f4;
}

.test-result-item.test-failed {
  border-color: #d03050;
  background: #fff0f0;
}

.test-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.test-name {
  font-size: 16px;
  font-weight: 600;
}

.test-message {
  font-size: 14px;
  color: #666;
  margin-left: 28px;
}

.test-details {
  margin-top: 12px;
  margin-left: 28px;
}

.test-details pre {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}

.test-alert {
  margin-top: 20px;
}
</style>


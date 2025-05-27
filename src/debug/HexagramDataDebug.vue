<template>
  <div class="hexagram-debug">
    <div class="debug-header">
      <h2>🔧 卦象数据调试面板</h2>
      <p>专门用于诊断"卦象未找到"问题</p>
    </div>

    <!-- 数据加载状态 -->
    <div class="debug-section">
      <h3>📊 数据加载状态</h3>
      <div class="status-grid">
        <div class="status-item">
          <span class="label">数据是否已加载:</span>
          <span :class="['status', dataStatus.isLoaded ? 'success' : 'error']">
            {{ dataStatus.isLoaded ? '✅ 是' : '❌ 否' }}
          </span>
        </div>
        <div class="status-item">
          <span class="label">正在加载中:</span>
          <span :class="['status', dataStatus.isLoading ? 'warning' : 'success']">
            {{ dataStatus.isLoading ? '⏳ 是' : '✅ 否' }}
          </span>
        </div>
        <div class="status-item">
          <span class="label">数据数量:</span>
          <span class="value">{{ dataStatus.dataCount }} / 64</span>
        </div>
        <div class="status-item">
          <span class="label">错误信息:</span>
          <span :class="['status', dataStatus.error ? 'error' : 'success']">
            {{ dataStatus.error || '✅ 无错误' }}
          </span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <div class="debug-section">
      <h3>🛠️ 操作面板</h3>
      <div class="controls">
        <button @click="refreshDataStatus" class="debug-btn primary">
          🔄 刷新状态
        </button>
        <button @click="reloadData" class="debug-btn secondary" :disabled="dataStatus.isLoading">
          📥 重新加载数据
        </button>
        <button @click="testRandomHexagram" class="debug-btn test" :disabled="!dataStatus.isLoaded">
          🎲 测试随机卦象
        </button>
        <button @click="testAllLines" class="debug-btn test" :disabled="!dataStatus.isLoaded">
          🔍 测试所有爻组合
        </button>
      </div>
    </div>

    <!-- 测试结果 -->
    <div v-if="testResults.length > 0" class="debug-section">
      <h3>🧪 测试结果</h3>
      <div class="test-results">
        <div v-for="(result, index) in testResults" :key="index" 
             :class="['test-result', result.success ? 'success' : 'error']">
          <div class="result-header">
            <span class="result-status">{{ result.success ? '✅' : '❌' }}</span>
            <span class="result-title">{{ result.title }}</span>
          </div>
          <div v-if="result.details" class="result-details">{{ result.details }}</div>
          <div v-if="result.error" class="result-error">{{ result.error }}</div>
        </div>
      </div>
    </div>

    <!-- 卦象查找测试器 -->
    <div class="debug-section">
      <h3>🔎 卦象查找测试器</h3>
      <div class="search-test">
        <div class="input-group">
          <label>输入爻组合（6个数字，0或1）:</label>
          <input 
            v-model="searchLines" 
            placeholder="例如: 111111" 
            maxlength="6"
            pattern="[01]{6}"
            class="search-input"
          >
          <button @click="testSearchHexagram" class="debug-btn primary" :disabled="!isValidLines">
            🔍 查找卦象
          </button>
        </div>
        
        <div v-if="searchResult" class="search-result">
          <h4>查找结果:</h4>
          <div v-if="searchResult.found" class="found-hexagram">
            <p><strong>卦名:</strong> {{ searchResult.hexagram.name }}</p>
            <p><strong>序号:</strong> {{ searchResult.hexagram.sequence }}</p>
            <p><strong>爻组合:</strong> {{ searchResult.hexagram.lines.join('') }}</p>
            <p><strong>卦辞:</strong> {{ searchResult.hexagram.description }}</p>
          </div>
          <div v-else class="not-found">
            <p class="error">❌ 未找到匹配的卦象</p>
            <p>搜索的爻组合: {{ searchLines }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 原始数据检查 -->
    <div class="debug-section">
      <h3>📋 原始数据检查</h3>
      <div class="data-check">
        <button @click="checkRawData" class="debug-btn info">
          📊 检查JSON数据
        </button>
        <div v-if="rawDataCheck" class="raw-data-result">
          <p><strong>JSON文件状态:</strong> {{ rawDataCheck.status }}</p>
          <p><strong>数据项数量:</strong> {{ rawDataCheck.count }}</p>
          <div v-if="rawDataCheck.samples" class="data-samples">
            <h4>前5个卦象样本:</h4>
            <div v-for="sample in rawDataCheck.samples" :key="sample.sequence" class="sample-item">
              {{ sample.sequence }}. {{ sample.name }} - {{ sample.lines.join('') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { getDataLoadingStatus, ensureDataLoaded } from '../features/dilemma/utils/hexagramGenerator';
import { ensureDivinationDataLoaded } from '../features/dilemma/utils/divinationMethods';

// 数据状态
const dataStatus = reactive({
  isLoaded: false,
  isLoading: false,
  dataCount: 0,
  error: null as string | null
});

// 测试结果
const testResults = ref<Array<{
  title: string;
  success: boolean;
  details?: string;
  error?: string;
}>>([]);

// 查找测试
const searchLines = ref('111111');
const searchResult = ref<{
  found: boolean;
  hexagram?: any;
} | null>(null);

// 原始数据检查
const rawDataCheck = ref<{
  status: string;
  count: number;
  samples?: any[];
} | null>(null);

// 验证爻组合格式
const isValidLines = computed(() => {
  return /^[01]{6}$/.test(searchLines.value);
});

// 刷新数据状态
const refreshDataStatus = () => {
  const status = getDataLoadingStatus();
  dataStatus.isLoaded = status.isLoaded;
  dataStatus.isLoading = status.isLoading;
  dataStatus.dataCount = status.dataCount;
  dataStatus.error = status.error;
};

// 重新加载数据
const reloadData = async () => {
  testResults.value = [];
  
  try {
    dataStatus.isLoading = true;
    dataStatus.error = null;
    
    // 尝试重新加载数据
    const success = await ensureDataLoaded();
    
    testResults.value.push({
      title: '数据重新加载',
      success: success,
      details: success ? '数据加载成功' : '数据加载失败'
    });
    
    refreshDataStatus();
  } catch (error) {
    console.error('重新加载数据失败:', error);
    testResults.value.push({
      title: '数据重新加载',
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  } finally {
    dataStatus.isLoading = false;
  }
};

// 测试随机卦象
const testRandomHexagram = async () => {
  try {
    // 测试多个随机爻组合
    const testCases = [
      [1, 1, 1, 1, 1, 1], // 乾卦
      [0, 0, 0, 0, 0, 0], // 坤卦
      [1, 0, 1, 0, 1, 0], // 随机组合
      [0, 1, 0, 1, 0, 1], // 随机组合
    ];
    
    testResults.value = [];
    
    for (const lines of testCases) {
      try {
        const { generateHexagramFromLines } = await import('../features/dilemma/utils/hexagramGenerator');
        const hexagram = await generateHexagramFromLines(lines);
        
        testResults.value.push({
          title: `爻组合 ${lines.join('')}`,
          success: !!hexagram,
          details: hexagram ? `找到卦象: ${hexagram.name}` : '未找到卦象'
        });
      } catch (error) {
        testResults.value.push({
          title: `爻组合 ${lines.join('')}`,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  } catch (error) {
    console.error('测试随机卦象失败:', error);
  }
};

// 测试所有爻组合
const testAllLines = async () => {
  try {
    testResults.value = [];
    
    // 生成一些测试用的爻组合
    const testCount = 10;
    let successCount = 0;
    
    for (let i = 0; i < testCount; i++) {
      const lines = Array(6).fill(0).map(() => Math.random() < 0.5 ? 0 : 1);
      
      try {
        const { generateHexagramFromLines } = await import('../features/dilemma/utils/hexagramGenerator');
        const hexagram = await generateHexagramFromLines(lines);
        
        if (hexagram) {
          successCount++;
        }
        
        testResults.value.push({
          title: `测试 ${i + 1}: ${lines.join('')}`,
          success: !!hexagram,
          details: hexagram ? `卦象: ${hexagram.name}` : '未找到'
        });
      } catch (error) {
        testResults.value.push({
          title: `测试 ${i + 1}: ${lines.join('')}`,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    // 添加总结
    testResults.value.unshift({
      title: '测试总结',
      success: successCount === testCount,
      details: `成功: ${successCount}/${testCount}`
    });
    
  } catch (error) {
    console.error('批量测试失败:', error);
  }
};

// 测试查找卦象
const testSearchHexagram = async () => {
  if (!isValidLines.value) return;
  
  const lines = searchLines.value.split('').map(c => parseInt(c));
  
  try {
    const { generateHexagramFromLines } = await import('../features/dilemma/utils/hexagramGenerator');
    const hexagram = await generateHexagramFromLines(lines);
    
    searchResult.value = {
      found: !!hexagram,
      hexagram: hexagram
    };
  } catch (error) {
    console.error('查找卦象失败:', error);
    searchResult.value = {
      found: false
    };
  }
};

// 检查原始数据
const checkRawData = async () => {
  try {
    const response = await fetch('/hexagrams.json');
    
    if (!response.ok) {
      rawDataCheck.value = {
        status: `HTTP错误: ${response.status}`,
        count: 0
      };
      return;
    }
    
    const data = await response.json();
    const entries = Object.entries(data);
    
    rawDataCheck.value = {
      status: '数据加载成功',
      count: entries.length,
      samples: entries.slice(0, 5).map(([key, value]: [string, any]) => ({
        sequence: value.sequence,
        name: value.name,
        lines: value.lines
      }))
    };
  } catch (error) {
    rawDataCheck.value = {
      status: `加载失败: ${error instanceof Error ? error.message : String(error)}`,
      count: 0
    };
  }
};

// 组件挂载时初始化
onMounted(() => {
  refreshDataStatus();
});
</script>

<style scoped>
.hexagram-debug {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.debug-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.debug-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.debug-section h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.label {
  font-weight: 500;
  color: #2c3e50;
}

.status.success {
  color: #27ae60;
  font-weight: 600;
}

.status.error {
  color: #e74c3c;
  font-weight: 600;
}

.status.warning {
  color: #f39c12;
  font-weight: 600;
}

.value {
  font-weight: 600;
  color: #2c3e50;
}

.controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.debug-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.debug-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.debug-btn.primary {
  background: #3498db;
  color: white;
}

.debug-btn.primary:hover:not(:disabled) {
  background: #2980b9;
}

.debug-btn.secondary {
  background: #95a5a6;
  color: white;
}

.debug-btn.secondary:hover:not(:disabled) {
  background: #7f8c8d;
}

.debug-btn.test {
  background: #e67e22;
  color: white;
}

.debug-btn.test:hover:not(:disabled) {
  background: #d35400;
}

.debug-btn.info {
  background: #9b59b6;
  color: white;
}

.debug-btn.info:hover:not(:disabled) {
  background: #8e44ad;
}

.test-results {
  max-height: 400px;
  overflow-y: auto;
}

.test-result {
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  border-left: 4px solid;
}

.test-result.success {
  background: #d5f4e6;
  border-color: #27ae60;
}

.test-result.error {
  background: #fadbd8;
  border-color: #e74c3c;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.result-details {
  margin-top: 5px;
  font-size: 14px;
  color: #555;
}

.result-error {
  margin-top: 5px;
  font-size: 14px;
  color: #e74c3c;
  font-style: italic;
}

.search-test {
  space-y: 15px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.input-group label {
  font-weight: 500;
  color: #2c3e50;
  min-width: 200px;
}

.search-input {
  padding: 8px 12px;
  border: 2px solid #bdc3c7;
  border-radius: 6px;
  font-size: 16px;
  font-family: monospace;
  min-width: 120px;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.search-result {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.found-hexagram {
  color: #27ae60;
}

.found-hexagram p {
  margin: 5px 0;
}

.not-found {
  color: #e74c3c;
}

.data-check {
  space-y: 15px;
}

.raw-data-result {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.raw-data-result p {
  margin: 5px 0;
}

.data-samples {
  margin-top: 10px;
}

.sample-item {
  padding: 5px 10px;
  background: white;
  border-radius: 4px;
  margin: 3px 0;
  font-family: monospace;
  font-size: 14px;
}
</style> 
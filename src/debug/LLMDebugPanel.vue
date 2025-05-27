<template>
  <div class="llm-debug-panel">
    <div class="panel-header">
      <h3>🔧 LLM服务调试面板</h3>
      <button @click="collapsed = !collapsed" class="collapse-btn">
        {{ collapsed ? '📈 展开' : '📉 收起' }}
      </button>
    </div>

    <div v-if="!collapsed" class="panel-content">
      <!-- LLM服务状态 -->
      <div class="debug-section">
        <h4>📡 服务状态</h4>
        <div class="status-grid">
          <div class="status-item">
            <span class="label">连接状态:</span>
            <span :class="['status', connectionStatus.class]">
              {{ connectionStatus.text }}
            </span>
          </div>
          <div class="status-item">
            <span class="label">API提供商:</span>
            <span class="value">{{ currentProvider || '未配置' }}</span>
          </div>
          <div class="status-item">
            <span class="label">最后调用:</span>
            <span class="value">{{ lastCallTime || '无' }}</span>
          </div>
          <div class="status-item">
            <span class="label">响应时间:</span>
            <span class="value">{{ responseTime || '无' }}</span>
          </div>
        </div>
      </div>

      <!-- 实时加载状态 -->
      <div class="debug-section">
        <h4>⚡ 实时状态</h4>
        <div class="live-status">
          <div class="status-indicator">
            <div class="indicator-dot" :class="{ active: isLoading }"></div>
            <span>{{ isLoading ? '正在加载...' : '空闲状态' }}</span>
          </div>
          <div class="current-stage">
            <span class="label">当前阶段:</span>
            <span class="stage-badge" :class="`stage-${currentStage}`">
              {{ getStageLabel(currentStage) }}
            </span>
          </div>
          <div class="progress-info">
            <span class="label">进度信息:</span>
            <span class="progress-text">{{ currentProgress || '无' }}</span>
          </div>
        </div>
      </div>

      <!-- 测试工具 -->
      <div class="debug-section">
        <h4>🧪 测试工具</h4>
        <div class="test-tools">
          <button @click="testConnection" class="tool-btn" :disabled="testing">
            {{ testing ? '测试中...' : '🔗 测试连接' }}
          </button>
          <button @click="mockLLMCall" class="tool-btn" :disabled="isLoading">
            🤖 模拟LLM调用
          </button>
          <button @click="simulateError" class="tool-btn error">
            ⚠️ 模拟错误
          </button>
          <button @click="clearLogs" class="tool-btn secondary">
            🗑️ 清空日志
          </button>
        </div>
      </div>

      <!-- 调用日志 -->
      <div class="debug-section">
        <h4>📜 调用日志</h4>
        <div class="log-container">
          <div v-if="logs.length === 0" class="no-logs">
            暂无调用日志
          </div>
          <div v-else class="log-list">
            <div v-for="(log, index) in logs" :key="index" class="log-item" :class="log.type">
              <div class="log-header">
                <span class="log-time">{{ log.timestamp }}</span>
                <span class="log-type">{{ log.type.toUpperCase() }}</span>
              </div>
              <div class="log-message">{{ log.message }}</div>
              <div v-if="log.details" class="log-details">
                <pre>{{ JSON.stringify(log.details, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 性能监控 -->
      <div class="debug-section">
        <h4>📊 性能监控</h4>
        <div class="performance-metrics">
          <div class="metric">
            <span class="metric-label">总调用次数:</span>
            <span class="metric-value">{{ metrics.totalCalls }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">成功次数:</span>
            <span class="metric-value success">{{ metrics.successCalls }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">失败次数:</span>
            <span class="metric-value error">{{ metrics.errorCalls }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">平均响应时间:</span>
            <span class="metric-value">{{ averageResponseTime }}ms</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { LLMService } from '../services/LLMService'

const collapsed = ref(false)
const testing = ref(false)
const isLoading = ref(false)
const currentStage = ref<'preparing' | 'calling' | 'processing' | 'completed' | 'error'>('preparing')
const currentProgress = ref('')
const currentProvider = ref('')
const lastCallTime = ref('')
const responseTime = ref('')

interface LogEntry {
  timestamp: string
  type: 'info' | 'success' | 'error' | 'warning'
  message: string
  details?: any
}

const logs = ref<LogEntry[]>([])

const metrics = reactive({
  totalCalls: 0,
  successCalls: 0,
  errorCalls: 0,
  responseTimes: [] as number[]
})

const connectionStatus = computed(() => {
  if (testing.value) {
    return { text: '测试中...', class: 'testing' }
  }
  if (isLoading.value) {
    return { text: '连接中...', class: 'connecting' }
  }
  return { text: '就绪', class: 'ready' }
})

const averageResponseTime = computed(() => {
  if (metrics.responseTimes.length === 0) return 0
  const sum = metrics.responseTimes.reduce((a, b) => a + b, 0)
  return Math.round(sum / metrics.responseTimes.length)
})

const getStageLabel = (stage: string) => {
  const labels = {
    preparing: '准备中',
    calling: '调用中',
    processing: '处理中',
    completed: '完成',
    error: '错误'
  }
  return labels[stage] || '未知'
}

const addLog = (type: LogEntry['type'], message: string, details?: any) => {
  const timestamp = new Date().toLocaleTimeString()
  logs.value.unshift({
    timestamp,
    type,
    message,
    details
  })
  
  // 保持日志数量限制
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50)
  }
}

const testConnection = async () => {
  testing.value = true
  addLog('info', '开始连接测试...')
  
  try {
    const startTime = Date.now()
    
    // 模拟API测试
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    // 模拟成功或失败
    if (Math.random() > 0.2) {
      responseTime.value = `${duration}ms`
      lastCallTime.value = new Date().toLocaleTimeString()
      addLog('success', `连接测试成功 (${duration}ms)`)
      metrics.successCalls++
      metrics.responseTimes.push(duration)
    } else {
      addLog('error', '连接测试失败', { error: 'Network timeout' })
      metrics.errorCalls++
    }
    
    metrics.totalCalls++
  } catch (error) {
    addLog('error', '连接测试异常', error)
    metrics.errorCalls++
    metrics.totalCalls++
  } finally {
    testing.value = false
  }
}

const mockLLMCall = async () => {
  addLog('info', '开始模拟LLM调用...')
  
  const stages = [
    { stage: 'preparing', progress: '准备调用参数...', duration: 500 },
    { stage: 'calling', progress: '发送请求到LLM服务...', duration: 1000 },
    { stage: 'processing', progress: 'LLM正在处理请求...', duration: 2000 },
    { stage: 'completed', progress: '处理完成', duration: 500 }
  ]
  
  isLoading.value = true
  
  try {
    for (const stageInfo of stages) {
      currentStage.value = stageInfo.stage as any
      currentProgress.value = stageInfo.progress
      
      addLog('info', `阶段: ${stageInfo.stage} - ${stageInfo.progress}`)
      
      await new Promise(resolve => setTimeout(resolve, stageInfo.duration))
    }
    
    addLog('success', '模拟LLM调用完成')
    metrics.successCalls++
  } catch (error) {
    addLog('error', '模拟LLM调用失败', error)
    metrics.errorCalls++
  } finally {
    isLoading.value = false
    currentStage.value = 'preparing'
    currentProgress.value = ''
    metrics.totalCalls++
  }
}

const simulateError = () => {
  currentStage.value = 'error'
  currentProgress.value = '模拟错误状态'
  addLog('error', '模拟错误状态触发', { 
    errorType: 'API_ERROR',
    errorCode: 500,
    message: 'Internal Server Error'
  })
  
  setTimeout(() => {
    currentStage.value = 'preparing'
    currentProgress.value = ''
  }, 3000)
}

const clearLogs = () => {
  logs.value = []
  addLog('info', '日志已清空')
}

let unsubscribe: (() => void) | null = null

onMounted(() => {
  addLog('info', 'LLM调试面板初始化完成')
  
  // 订阅LLM服务状态变化
  try {
    unsubscribe = LLMService.onLoadingStateChange((state) => {
      isLoading.value = state.isLoading
      currentStage.value = state.stage
      currentProgress.value = state.progress
      
      if (state.isLoading) {
        addLog('info', `LLM状态变化: ${state.stage} - ${state.progress}`)
      }
    })
  } catch (error) {
    addLog('warning', 'LLM服务订阅失败', error)
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>

<style scoped>
.llm-debug-panel {
  background: #1a1a1a;
  color: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin: 1rem 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.panel-header {
  background: #2d2d2d;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #404040;
}

.panel-header h3 {
  margin: 0;
  color: #4CAF50;
  font-size: 1.1rem;
}

.collapse-btn {
  background: #404040;
  color: #e0e0e0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.2s;
}

.collapse-btn:hover {
  background: #555;
}

.panel-content {
  padding: 1rem;
}

.debug-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333;
}

.debug-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.debug-section h4 {
  color: #FFC107;
  margin: 0 0 0.8rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.8rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #2a2a2a;
  border-radius: 4px;
}

.label {
  color: #999;
  font-size: 0.9rem;
}

.value {
  color: #e0e0e0;
  font-weight: 500;
}

.status {
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.status.ready {
  background: #4CAF50;
  color: white;
}

.status.testing {
  background: #FF9800;
  color: white;
}

.status.connecting {
  background: #2196F3;
  color: white;
}

.live-status {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #666;
  transition: background 0.3s;
}

.indicator-dot.active {
  background: #4CAF50;
  animation: pulse 2s infinite;
}

.current-stage, .progress-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stage-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.stage-preparing { background: #2196F3; color: white; }
.stage-calling { background: #FF9800; color: white; }
.stage-processing { background: #9C27B0; color: white; }
.stage-completed { background: #4CAF50; color: white; }
.stage-error { background: #F44336; color: white; }

.progress-text {
  color: #4CAF50;
  font-style: italic;
}

.test-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.tool-btn {
  background: #404040;
  color: #e0e0e0;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.tool-btn:hover:not(:disabled) {
  background: #555;
  transform: translateY(-1px);
}

.tool-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tool-btn.error {
  background: #F44336;
}

.tool-btn.error:hover:not(:disabled) {
  background: #D32F2F;
}

.tool-btn.secondary {
  background: #666;
}

.tool-btn.secondary:hover:not(:disabled) {
  background: #777;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  background: #0a0a0a;
  border-radius: 4px;
}

.no-logs {
  padding: 2rem;
  text-align: center;
  color: #666;
  font-style: italic;
}

.log-list {
  padding: 0.5rem;
}

.log-item {
  margin-bottom: 0.8rem;
  padding: 0.8rem;
  border-radius: 4px;
  border-left: 4px solid;
}

.log-item.info {
  background: #1a2332;
  border-left-color: #2196F3;
}

.log-item.success {
  background: #1b2e1b;
  border-left-color: #4CAF50;
}

.log-item.error {
  background: #2e1b1b;
  border-left-color: #F44336;
}

.log-item.warning {
  background: #2e2a1b;
  border-left-color: #FF9800;
}

.log-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}

.log-time {
  color: #999;
  font-size: 0.8rem;
}

.log-type {
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.1rem 0.4rem;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
}

.log-message {
  color: #e0e0e0;
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
}

.log-details {
  background: #0f0f0f;
  padding: 0.5rem;
  border-radius: 2px;
  margin-top: 0.4rem;
}

.log-details pre {
  margin: 0;
  font-size: 0.7rem;
  color: #888;
  max-height: 100px;
  overflow-y: auto;
}

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.8rem;
}

.metric {
  display: flex;
  flex-direction: column;
  padding: 0.8rem;
  background: #2a2a2a;
  border-radius: 4px;
  text-align: center;
}

.metric-label {
  color: #999;
  font-size: 0.8rem;
  margin-bottom: 0.4rem;
}

.metric-value {
  color: #e0e0e0;
  font-size: 1.2rem;
  font-weight: 600;
}

.metric-value.success {
  color: #4CAF50;
}

.metric-value.error {
  color: #F44336;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .test-tools {
    flex-direction: column;
  }
  
  .performance-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .log-header {
    flex-direction: column;
    gap: 0.2rem;
  }
}
</style> 
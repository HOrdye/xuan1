<template>
  <div class="animation-test">
    <div class="header">
      <h1>🎨 动画测试工作台</h1>
      <p>测试和预览各种动画效果</p>
    </div>
    
    <!-- 快速测试区 -->
    <div class="test-section">
      <h2>⚡ 快速测试</h2>
      <div class="test-controls">
        <button @click="testAnimation" class="test-btn primary" :disabled="isTestRunning">
          {{ isTestRunning ? '测试进行中...' : '🚀 开始完整流程测试' }}
        </button>
        <button @click="resetTest" class="test-btn secondary">
          🔄 重置测试
        </button>
        <button @click="testSingleStage('preparing')" class="test-btn stage">
          🎯 测试准备阶段
        </button>
        <button @click="testSingleStage('calling')" class="test-btn stage">
          🌐 测试调用阶段
        </button>
        <button @click="testSingleStage('processing')" class="test-btn stage">
          🧠 测试处理阶段
        </button>
        <button @click="testSingleStage('error')" class="test-btn error">
          ⚠️ 测试错误状态
        </button>
      </div>
    </div>

    <!-- 动画效果预览区 -->
    <div class="preview-section">
      <h2>🎭 动画效果预览</h2>
      
      <div class="preview-grid">
        <!-- 八卦旋转动画预览 -->
        <div class="preview-card">
          <h3>八卦旋转动画</h3>
          <div class="mini-bagua">
            <div class="bagua-spinner-mini">
              <div class="bagua-inner-mini">
                <div class="yin-yang-mini">
                  <div class="yang-mini"></div>
                  <div class="yin-mini"></div>
                </div>
              </div>
              <div class="bagua-trigrams-mini">
                <div v-for="i in 8" :key="i" :class="`trigram-mini trigram-${i}`">
                  <div class="line-mini" v-for="j in 3" :key="j"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 进度条动画预览 -->
        <div class="preview-card">
          <h3>进度条动画</h3>
          <div class="progress-demo">
            <div class="progress-bar-demo">
              <div class="progress-fill-demo" :style="{ width: demoProgress + '%' }"></div>
            </div>
            <div class="progress-controls">
              <button @click="animateProgress" class="demo-btn">启动进度动画</button>
            </div>
          </div>
        </div>

        <!-- 点点动画预览 -->
        <div class="preview-card">
          <h3>加载点点动画</h3>
          <div class="dots-demo">
            <div class="loading-dots-demo">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <!-- 渐变背景动画预览 -->
        <div class="preview-card">
          <h3>渐变背景动画</h3>
          <div class="gradient-demo">
            <div class="animated-gradient">
              <p>动态渐变背景</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 状态监控区 -->
    <div class="status-section">
      <h2>📊 状态监控</h2>
      <div class="status-cards">
        <div class="status-card">
          <h4>加载状态</h4>
          <div class="status-value" :class="testState.isLoading ? 'active' : 'inactive'">
            {{ testState.isLoading ? '⚡ 加载中' : '💤 空闲' }}
          </div>
        </div>
        <div class="status-card">
          <h4>当前阶段</h4>
          <div class="status-value stage-indicator" :class="`stage-${testState.stage}`">
            {{ getStageLabel(testState.stage) }}
          </div>
        </div>
        <div class="status-card">
          <h4>进度信息</h4>
          <div class="status-value progress-text">
            {{ testState.progress || '暂无进度信息' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 主要动画组件 -->
    <LLMLoadingIndicator
      :isLoading="testState.isLoading"
      :progress="testState.progress" 
      :stage="testState.stage"
    />

    <!-- 高级调试区 -->
    <div class="debug-section" v-if="showDebug">
      <h2>🐛 调试信息</h2>
      <div class="debug-content">
        <div class="debug-json">
          <h4>状态对象</h4>
          <pre>{{ JSON.stringify(testState, null, 2) }}</pre>
        </div>
        <div class="debug-timeline">
          <h4>测试时间线</h4>
          <div class="timeline">
            <div v-for="(log, index) in debugLogs" :key="index" class="timeline-item">
              <span class="timestamp">{{ log.timestamp }}</span>
              <span class="event">{{ log.event }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 调试开关 -->
    <div class="debug-toggle">
      <button @click="showDebug = !showDebug" class="toggle-btn">
        {{ showDebug ? '🙈 隐藏调试' : '🔍 显示调试' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import LLMLoadingIndicator from '../components/LLMLoadingIndicator.vue'

const isTestRunning = ref(false)
const showDebug = ref(false)
const demoProgress = ref(0)

const testState = reactive({
  isLoading: false,
  stage: 'preparing' as 'preparing' | 'calling' | 'processing' | 'completed' | 'error',
  progress: ''
})

const debugLogs = ref<Array<{timestamp: string, event: string}>>([])

// 记录调试日志
const addDebugLog = (event: string) => {
  const timestamp = new Date().toLocaleTimeString()
  debugLogs.value.unshift({ timestamp, event })
  if (debugLogs.value.length > 10) {
    debugLogs.value = debugLogs.value.slice(0, 10)
  }
}

// 获取阶段标签
const getStageLabel = (stage: string) => {
  const labels = {
    preparing: '🎯 准备阶段',
    calling: '🌐 调用阶段', 
    processing: '🧠 处理阶段',
    completed: '✨ 完成阶段',
    error: '⚠️ 错误状态'
  }
  return labels[stage] || '❓ 未知阶段'
}

// 重置测试
const resetTest = () => {
  testState.isLoading = false
  testState.stage = 'preparing'
  testState.progress = ''
  isTestRunning.value = false
  addDebugLog('测试状态已重置')
}

// 测试单个阶段
const testSingleStage = (stage: typeof testState.stage) => {
  testState.isLoading = true
  testState.stage = stage
  testState.progress = `测试${getStageLabel(stage)}...`
  addDebugLog(`开始测试阶段: ${stage}`)
  
  setTimeout(() => {
    testState.isLoading = false
    addDebugLog(`阶段测试完成: ${stage}`)
  }, 3000)
}

// 完整流程测试
const testAnimation = async () => {
  if (isTestRunning.value) return
  
  isTestRunning.value = true
  addDebugLog('开始完整流程测试')

  const stages = [
    { stage: 'preparing' as const, progress: '🎯 初始化中，请稍候...', duration: 2000 },
    { stage: 'calling' as const, progress: '🌐 正在连接AI服务...', duration: 2500 },
    { stage: 'processing' as const, progress: '🧠 AI正在思考您的问题...', duration: 3000 },
    { stage: 'completed' as const, progress: '✨ 解读完成，正在整理结果...', duration: 1500 }
  ]

  // 开始加载
  testState.isLoading = true

  for (const stageInfo of stages) {
    testState.stage = stageInfo.stage
    testState.progress = stageInfo.progress
    addDebugLog(`进入阶段: ${stageInfo.stage}`)
    
    await new Promise(resolve => setTimeout(resolve, stageInfo.duration))
  }

  // 结束加载
  testState.isLoading = false
  isTestRunning.value = false
  addDebugLog('完整流程测试结束')
}

// 进度条动画演示
const animateProgress = () => {
  demoProgress.value = 0
  const interval = setInterval(() => {
    demoProgress.value += 2
    if (demoProgress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        demoProgress.value = 0
      }, 1000)
    }
  }, 50)
}

onMounted(() => {
  addDebugLog('动画测试工作台初始化完成')
  // 自动演示进度条
  setTimeout(() => {
    animateProgress()
  }, 1000)
})
</script>

<style scoped>
.animation-test {
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

/* 测试控制区 */
.test-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.test-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1rem;
}

.test-btn {
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  min-width: 140px;
}

.test-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.test-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.test-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.test-btn.secondary {
  background: #6c757d;
  color: white;
}

.test-btn.secondary:hover {
  background: #545b62;
}

.test-btn.stage {
  background: #17a2b8;
  color: white;
}

.test-btn.stage:hover {
  background: #138496;
}

.test-btn.error {
  background: #dc3545;
  color: white;
}

.test-btn.error:hover {
  background: #c82333;
}

/* 预览区 */
.preview-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.preview-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.preview-card h3 {
  color: #495057;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

/* 迷你八卦动画 */
.mini-bagua {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bagua-spinner-mini {
  position: relative;
  width: 60px;
  height: 60px;
  animation: rotate 3s linear infinite;
}

.bagua-inner-mini {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
}

.yin-yang-mini {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(to right, #fff 50%, #000 50%);
  position: relative;
  animation: rotateReverse 2s linear infinite;
}

.yang-mini, .yin-mini {
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 50%;
}

.yang-mini {
  top: 0;
  left: 7.5px;
  background: #000;
}

.yin-mini {
  bottom: 0;
  left: 7.5px;
  background: #fff;
}

.yang-mini::after, .yin-mini::after {
  content: '';
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.yang-mini::after {
  background: #fff;
}

.yin-mini::after {
  background: #000;
}

.bagua-trigrams-mini {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.trigram-mini {
  position: absolute;
  width: 10px;
  height: 8px;
  opacity: 0.8;
}

.trigram-1 { top: 0; left: 50%; transform: translateX(-50%); }
.trigram-2 { top: 15%; right: 15%; transform: rotate(45deg); }
.trigram-3 { top: 50%; right: 0; transform: translateY(-50%) rotate(90deg); }
.trigram-4 { bottom: 15%; right: 15%; transform: rotate(135deg); }
.trigram-5 { bottom: 0; left: 50%; transform: translateX(-50%) rotate(180deg); }
.trigram-6 { bottom: 15%; left: 15%; transform: rotate(225deg); }
.trigram-7 { top: 50%; left: 0; transform: translateY(-50%) rotate(270deg); }
.trigram-8 { top: 15%; left: 15%; transform: rotate(315deg); }

.line-mini {
  width: 100%;
  height: 1px;
  background: #667eea;
  margin: 1px 0;
  border-radius: 0.5px;
  animation: glow 1.5s ease-in-out infinite alternate;
}

/* 进度条演示 */
.progress-demo {
  padding: 1rem 0;
}

.progress-bar-demo {
  width: 100%;
  height: 6px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill-demo {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
  transition: width 0.1s ease;
  animation: shimmer 2s infinite;
}

.demo-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
}

.demo-btn:hover {
  background: #5a67d8;
}

/* 点点动画演示 */
.dots-demo {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-dots-demo {
  display: flex;
  gap: 6px;
}

.loading-dots-demo span {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots-demo span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots-demo span:nth-child(2) { animation-delay: -0.16s; }

/* 渐变动画演示 */
.gradient-demo {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.animated-gradient {
  width: 100%;
  height: 60px;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradientShift 4s ease infinite;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

/* 状态监控区 */
.status-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.status-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.status-card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.status-card h4 {
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-value {
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 6px;
}

.status-value.active {
  background: #d4edda;
  color: #155724;
}

.status-value.inactive {
  background: #f8d7da;
  color: #721c24;
}

.stage-indicator {
  background: #d1ecf1;
  color: #0c5460;
}

.stage-indicator.stage-error {
  background: #f8d7da;
  color: #721c24;
}

.progress-text {
  background: #fff3cd;
  color: #856404;
  font-size: 0.9rem;
}

/* 调试区 */
.debug-section {
  background: #2c3e50;
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.debug-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
}

.debug-json pre {
  background: #34495e;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  max-height: 200px;
  overflow-y: auto;
}

.timeline {
  background: #34495e;
  padding: 1rem;
  border-radius: 6px;
  max-height: 200px;
  overflow-y: auto;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #4a5f7a;
  font-size: 0.8rem;
}

.timeline-item:last-child {
  border-bottom: none;
}

.timestamp {
  color: #95a5a6;
  min-width: 80px;
}

.event {
  color: #ecf0f1;
}

/* 调试开关 */
.debug-toggle {
  text-align: center;
}

.toggle-btn {
  padding: 0.8rem 1.5rem;
  background: #34495e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.toggle-btn:hover {
  background: #2c3e50;
}

/* 动画 */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotateReverse {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(-360deg); }
}

@keyframes glow {
  from { box-shadow: 0 0 2px rgba(102, 126, 234, 0.5); }
  to { box-shadow: 0 0 6px rgba(102, 126, 234, 1), 0 0 10px rgba(118, 75, 162, 0.5); }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .animation-test {
    padding: 1rem;
  }
  
  .test-controls {
    flex-direction: column;
  }
  
  .preview-grid {
    grid-template-columns: 1fr;
  }
  
  .debug-content {
    grid-template-columns: 1fr;
  }
  
  .status-cards {
    grid-template-columns: 1fr;
  }
}
</style> 
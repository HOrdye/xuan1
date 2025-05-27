<template>
  <div v-if="isVisible" class="llm-loading-overlay">
    <div class="llm-loading-container">
      <!-- 主要动画区域 -->
      <div class="loading-animation">
        <!-- 八卦图案动画 -->
        <div class="bagua-spinner">
          <div class="bagua-inner">
            <div class="yin-yang">
              <div class="yang"></div>
              <div class="yin"></div>
            </div>
          </div>
          <div class="bagua-trigrams">
            <div v-for="i in 8" :key="i" :class="`trigram trigram-${i}`">
              <div class="line" v-for="j in 3" :key="j"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 状态文本 -->
      <div class="loading-text">
        <h3 class="loading-title">{{ stageTitle }}</h3>
        <p class="loading-progress">{{ progress }}</p>
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>

      <!-- 提示信息 -->
      <div class="loading-tips">
        <p class="tip-text">{{ currentTip }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  isLoading: boolean
  progress: string
  stage: 'preparing' | 'calling' | 'processing' | 'completed' | 'error'
}

const props = defineProps<Props>()

const isVisible = ref(false)
const currentTipIndex = ref(0)

// 根据阶段显示不同的标题
const stageTitle = computed(() => {
  switch (props.stage) {
    case 'preparing':
      return '🎯 正在准备'
    case 'calling':
      return '🌐 连接AI模型'
    case 'processing':
      return '🧠 AI思考中'
    case 'completed':
      return '✨ 解读完成'
    case 'error':
      return '⚠️ 处理中'
    default:
      return '🔮 玄机运算'
  }
})

// 根据阶段计算进度百分比
const progressPercentage = computed(() => {
  switch (props.stage) {
    case 'preparing':
      return 25
    case 'calling':
      return 50
    case 'processing':
      return 75
    case 'completed':
      return 100
    case 'error':
      return 60
    default:
      return 0
  }
})

// 轮播提示
const tips = [
  '易有太极，是生两仪...',
  '两仪生四象，四象生八卦...',
  '天地定位，山泽通气...',
  '雷风相薄，水火不相射...',
  '观其所由，察其所安...',
  '天行健，君子以自强不息...',
  '厚德载物，包容万象...',
  '变化无穷，唯德动天...'
]

const currentTip = computed(() => tips[currentTipIndex.value])

// 定时切换提示
let tipInterval: number | null = null

onMounted(() => {
  tipInterval = window.setInterval(() => {
    currentTipIndex.value = (currentTipIndex.value + 1) % tips.length
  }, 2000)
})

onUnmounted(() => {
  if (tipInterval) {
    clearInterval(tipInterval)
  }
})

// 监听加载状态变化
watch(() => props.isLoading, (newVal) => {
  if (newVal) {
    isVisible.value = true
  } else {
    // 延迟隐藏，让用户看到完成状态
    setTimeout(() => {
      isVisible.value = false
    }, 1000)
  }
}, { immediate: true })
</script>

<style scoped>
.llm-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
}

.llm-loading-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

/* 八卦动画 */
.loading-animation {
  margin-bottom: 1.5rem;
}

.bagua-spinner {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  animation: rotate 3s linear infinite;
}

.bagua-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  z-index: 2; /* 确保太极图在八卦上方 */
}

.yin-yang {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(to right, #fff 50%, #000 50%);
  position: relative;
  animation: rotateReverse 2s linear infinite;
  /* 移除transform，避免与父元素定位冲突 */
}

.yang, .yin {
  position: absolute;
  width: 50%;
  height: 50%;
  border-radius: 50%;
}

.yang {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background: #000;
}

.yin {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
}

.yang::after, .yin::after {
  content: '';
  position: absolute;
  width: 33.33%;
  height: 33.33%;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.yang::after {
  background: #fff;
}

.yin::after {
  background: #000;
}

.bagua-trigrams {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; /* 确保八卦在太极图下方 */
}

.trigram {
  position: absolute;
  width: 20px;
  height: 15px;
  opacity: 0.8;
}

/* 重新调整八卦位置，确保围绕中心 */
.trigram-1 { top: 5px; left: 50%; transform: translateX(-50%); }
.trigram-2 { top: 20px; right: 20px; transform: rotate(45deg); }
.trigram-3 { top: 50%; right: 5px; transform: translateY(-50%) rotate(90deg); }
.trigram-4 { bottom: 20px; right: 20px; transform: rotate(135deg); }
.trigram-5 { bottom: 5px; left: 50%; transform: translateX(-50%) rotate(180deg); }
.trigram-6 { bottom: 20px; left: 20px; transform: rotate(225deg); }
.trigram-7 { top: 50%; left: 5px; transform: translateY(-50%) rotate(270deg); }
.trigram-8 { top: 20px; left: 20px; transform: rotate(315deg); }

.trigram .line {
  width: 100%;
  height: 2px;
  background: #fff;
  margin: 2px 0;
  border-radius: 1px;
  animation: glow 1.5s ease-in-out infinite alternate;
}

.trigram:nth-child(odd) .line {
  animation-delay: 0.5s;
}

/* 文本样式 */
.loading-text {
  color: white;
  margin-bottom: 1.5rem;
}

.loading-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.loading-progress {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

/* 进度条 */
.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd700, #ff6b6b);
  border-radius: 2px;
  transition: width 0.5s ease;
  animation: shimmer 2s infinite;
}

/* 提示信息 */
.loading-tips {
  margin-top: 1rem;
}

.tip-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotateReverse {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes glow {
  from { box-shadow: 0 0 2px rgba(255, 255, 255, 0.5); }
  to { box-shadow: 0 0 8px rgba(255, 255, 255, 1), 0 0 12px rgba(255, 215, 0, 0.5); }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}
</style> 
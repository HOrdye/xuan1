<template>
  <div class="ritual-animation">
    <div class="ritual-container">
      <!-- 魔法阵背景 -->
      <div class="magic-circle">
        <!-- 12地支环 -->
        <div class="earthly-branches-ring">
          <div
            v-for="(branch, index) in earthlyBranches"
            :key="index"
            class="branch-item"
            :style="{ transform: `rotate(${index * 30}deg)` }"
          >
            <span class="branch-text">{{ branch }}</span>
          </div>
        </div>

        <!-- 8卦符 -->
        <div class="trigrams-ring">
          <div
            v-for="(trigram, index) in trigrams"
            :key="index"
            class="trigram-item"
            :style="{ transform: `rotate(${index * 45}deg)` }"
          >
            <span class="trigram-text">{{ trigram }}</span>
          </div>
        </div>

        <!-- 紫微星核心 -->
        <div class="ziwei-core">
          <div class="core-glow"></div>
          <div class="core-icon">🌟</div>
        </div>
      </div>

      <!-- 分阶段文案 -->
      <div class="ritual-text">
        <Transition name="fade" mode="out-in">
          <div :key="currentStage" class="stage-text">
            <div class="stage-icon">{{ stages[currentStage].icon }}</div>
            <div class="stage-title">{{ stages[currentStage].title }}</div>
            <div class="stage-description">{{ stages[currentStage].description }}</div>
          </div>
        </Transition>
      </div>

      <!-- 进度指示 -->
      <div class="progress-indicator">
        <div
          v-for="(stage, index) in stages"
          :key="index"
          class="progress-dot"
          :class="{ 'active': index === currentStage, 'completed': index < currentStage }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// Props
interface Props {
  duration?: number; // 总动画时长（毫秒）
  onComplete?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000
});

// 定义事件
const emit = defineEmits<{
  complete: [];
}>();

// 12地支
const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 8卦
const trigrams = ['乾', '坤', '震', '巽', '坎', '离', '艮', '兑'];

// 阶段定义
const stages = [
  {
    icon: '📅',
    title: '计算农历',
    description: '正在转换你的出生日期...'
  },
  {
    icon: '🔢',
    title: '定位紫微',
    description: '根据五行局和生日计算紫微星位置...'
  },
  {
    icon: '⭐',
    title: '安排群星',
    description: '正在排列十四主星和辅星...'
  },
  {
    icon: '✨',
    title: '完成排盘',
    description: '命盘生成完成！'
  }
];

const currentStage = ref(0);
let stageTimer: number | null = null;

// 开始动画
const startAnimation = () => {
  const stageDuration = props.duration / stages.length;
  let stageIndex = 0;

  const nextStage = () => {
    if (stageIndex < stages.length - 1) {
      stageIndex++;
      currentStage.value = stageIndex;
      stageTimer = window.setTimeout(nextStage, stageDuration);
    } else {
      // 动画完成
      emit('complete');
      if (props.onComplete) {
        props.onComplete();
      }
    }
  };

  stageTimer = window.setTimeout(nextStage, stageDuration);
};

onMounted(() => {
  startAnimation();
});

onUnmounted(() => {
  if (stageTimer) {
    clearTimeout(stageTimer);
  }
});

// 暴露方法供外部调用
defineExpose({
  restart: () => {
    currentStage.value = 0;
    if (stageTimer) {
      clearTimeout(stageTimer);
    }
    startAnimation();
  }
});
</script>

<style scoped>
.ritual-animation {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.ritual-container {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

/* 魔法阵 */
.magic-circle {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto;
}

/* 12地支环 */
.earthly-branches-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: rotate 20s linear infinite;
}

.branch-item {
  position: absolute;
  top: 0;
  left: 50%;
  transform-origin: 0 200px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.branch-text {
  font-size: 1.2rem;
  color: rgba(147, 51, 234, 0.8);
  font-weight: bold;
  transform: rotate(-90deg);
}

/* 8卦环 */
.trigrams-ring {
  position: absolute;
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  border-radius: 50%;
  animation: rotate 15s linear infinite reverse;
}

.trigram-item {
  position: absolute;
  top: 0;
  left: 50%;
  transform-origin: 0 140px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trigram-text {
  font-size: 1rem;
  color: rgba(59, 130, 246, 0.8);
  font-weight: bold;
  transform: rotate(90deg);
}

/* 紫微星核心 */
.ziwei-core {
  position: absolute;
  width: 120px;
  height: 120px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.core-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%);
  animation: pulse 2s ease-in-out infinite;
}

.core-icon {
  font-size: 4rem;
  position: relative;
  z-index: 1;
  animation: float 3s ease-in-out infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 文案区域 */
.ritual-text {
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.stage-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.stage-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.stage-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.stage-description {
  font-size: 1rem;
  color: #666;
}

/* 进度指示 */
.progress-indicator {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.progress-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.progress-dot.active {
  background: #9333EA;
  transform: scale(1.3);
  box-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
}

.progress-dot.completed {
  background: #9333EA;
  opacity: 0.6;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .magic-circle {
    width: 300px;
    height: 300px;
  }

  .branch-item {
    transform-origin: 0 150px;
  }

  .trigram-item {
    transform-origin: 0 105px;
  }

  .core-icon {
    font-size: 3rem;
  }

  .stage-icon {
    font-size: 2.5rem;
  }

  .stage-title {
    font-size: 1.2rem;
  }
}
</style>


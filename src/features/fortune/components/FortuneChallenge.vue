<template>
  <div class="fortune-challenge bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
    <!-- 卡片头部 -->
    <div class="card-header p-6" :class="headerClass">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-white">{{ title }}</h3>
        <div class="difficulty-badge px-3 py-1 rounded-full text-sm" :class="difficultyClass">
          {{ difficultyText }}
        </div>
      </div>
    </div>

    <!-- 卡片内容 -->
    <div class="p-6">
      <div v-if="!isUnlocked" class="text-center">
        <!-- 解锁动画容器 -->
        <div class="unlock-container relative">
          <!-- 粒子效果 -->
          <div v-if="showParticles" class="particles-container absolute inset-0 pointer-events-none">
            <div v-for="i in 12" :key="i" 
                 class="particle absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                 :style="getParticleStyle(i)">
            </div>
          </div>
          
          <!-- 解锁按钮 -->
          <button
            @click="handleUnlock"
            :disabled="isUnlocking"
            class="unlock-button relative px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isUnlocking" class="flex items-center">
              <span class="mr-2">🔓</span>
              点击解锁{{ type === 'challenge' ? '挑战' : '机遇' }}
            </span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              正在解锁...
            </span>
          </button>
        </div>
      </div>

      <!-- 解锁后的内容 -->
      <div v-else class="space-y-4 unlock-content" :class="{ 'animate-in': showContent }">
        <div class="content-header flex items-center mb-4">
          <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
            <span class="text-white text-sm">✓</span>
          </div>
          <h4 class="text-lg font-semibold text-gray-800">已解锁</h4>
        </div>
        
        <p class="text-gray-800 text-base leading-relaxed">{{ content }}</p>
        
        <div class="tips bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
          <h4 class="font-semibold text-gray-700 mb-2 flex items-center">
            <span class="mr-2">💡</span>
            小贴士
          </h4>
          <p class="text-gray-600">{{ tips }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';

const props = defineProps<{
  type: 'challenge' | 'opportunity';
  content: string;
  tips: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isUnlocked: boolean;
}>();

const emit = defineEmits<{
  (e: 'unlock'): void;
}>();

// 动画状态
const isUnlocking = ref(false);
const showParticles = ref(false);
const showContent = ref(false);

// 处理解锁动画
const handleUnlock = async () => {
  if (isUnlocking.value) return;
  
  isUnlocking.value = true;
  showParticles.value = true;
  
  // 播放解锁动画
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  showParticles.value = false;
  emit('unlock');
  
  // 等待父组件更新状态后显示内容
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 300));
  showContent.value = true;
  
  isUnlocking.value = false;
};

// 生成粒子样式
const getParticleStyle = (index: number) => {
  const angle = (index / 12) * 2 * Math.PI;
  const radius = 60;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    animationDelay: `${index * 0.1}s`
  };
};

// 计算标题
const title = computed(() => {
  return props.type === 'challenge' ? '今日挑战' : '今日机遇';
});

// 计算头部样式
const headerClass = computed(() => {
  return props.type === 'challenge'
    ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
    : 'bg-gradient-to-br from-amber-500 to-orange-600';
});

// 计算难度标签样式
const difficultyClass = computed(() => {
  const baseClass = 'bg-white bg-opacity-20 text-white';
  switch (props.difficulty) {
    case 'easy':
      return `${baseClass} border border-green-200`;
    case 'medium':
      return `${baseClass} border border-yellow-200`;
    case 'hard':
      return `${baseClass} border border-red-200`;
    default:
      return baseClass;
  }
});

// 计算难度文本
const difficultyText = computed(() => {
  switch (props.difficulty) {
    case 'easy':
      return '简单';
    case 'medium':
      return '中等';
    case 'hard':
      return '困难';
    default:
      return '未知';
  }
});
</script>

<style scoped>
.fortune-challenge {
  transition: all 0.3s ease;
  border-width: 2px;
  border-style: solid;
}

.fortune-challenge:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.content-wrapper {
  transition: filter 0.3s ease;
}

/* 解锁动画样式 */
.unlock-container {
  position: relative;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.particles-container {
  z-index: 10;
}

.particle {
  animation: particle-float 2s ease-out infinite;
}

@keyframes particle-float {
  0% {
    opacity: 0;
    transform: scale(0) translateY(0);
  }
  50% {
    opacity: 1;
    transform: scale(1) translateY(-20px);
  }
  100% {
    opacity: 0;
    transform: scale(0) translateY(-40px);
  }
}

/* 内容显示动画 */
.unlock-content {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.unlock-content.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.content-header {
  animation: slide-in 0.6s ease-out;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 按钮动画增强 */
.unlock-button {
  position: relative;
  overflow: hidden;
}

.unlock-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.unlock-button:hover::before {
  left: 100%;
}
</style> 
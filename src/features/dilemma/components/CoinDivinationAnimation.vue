<template>
  <div class="coin-divination-container">
    <!-- 阶段1：初始状态，只显示按钮 -->
    <div v-if="stage === 'init'" class="flex justify-center items-center h-80 bg-scroll-paper rounded-lg mb-6">
      <button 
        @click="startDivination" 
        class="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition transform hover:scale-105 active:scale-95"
      >
        <span>开始占卜</span>
      </button>
    </div>

    <!-- 阶段2：动画播放 -->
    <div v-if="stage === 'animating'" class="relative w-full h-80 bg-scroll-paper rounded-lg mb-6 overflow-hidden flex items-center justify-center">
      <div ref="lottieContainer" style="width: 220px; height: 220px;"></div>
    </div>

    <!-- 阶段3：显示六爻可视化和卦象解读 -->
    <DivinationResult
      v-if="stage === 'result' && divinationResult"
      :result="divinationResult"
      :method="method"
      :question="question"
      @restart="resetDivination"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch, nextTick } from 'vue';
import lottie from 'lottie-web';
import DivinationResult from './DivinationResult.vue';
import { coinDivination } from '../utils/divinationMethods';

const lottieContainer = ref(null);
let lottieInstance: any = null;

const stage = ref<'init' | 'animating' | 'result'>('init');
const lottiePlaying = ref(false);
const divinationResult = ref<any>(null);
const divinationResultText = ref('');

// 新增：占卜方法和问题（可根据实际需求传递）
const method = 'coin';
const question = '我的问题';

function startDivination() {
  stage.value = 'animating';
  lottiePlaying.value = true;
  }

function resetDivination() {
  stage.value = 'init';
  divinationResult.value = null;
  divinationResultText.value = '';
}

async function onLottieComplete() {
  lottiePlaying.value = false;
  try {
    // 调用真实铜钱占卜逻辑
    const result = await coinDivination();
    divinationResult.value = result;
  } catch (e) {
    divinationResult.value = null;
    // 可根据需要弹窗或提示错误
    alert('占卜失败，请重试');
  }
  stage.value = 'result';
}

watch(stage, (val) => {
  if (val === 'animating') {
    nextTick(() => {
      if (lottieInstance) {
        lottieInstance.destroy();
        lottieInstance = null;
  }
      lottieInstance = lottie.loadAnimation({
        container: lottieContainer.value as unknown as Element,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: '/coinplay.json'
      });
      lottieInstance.addEventListener('complete', onLottieComplete);
      lottieInstance.play();
    });
  }
});

onBeforeUnmount(() => {
  if (lottieInstance) {
    lottieInstance.destroy();
    lottieInstance = null;
  }
});
</script>

<style scoped>
.bg-scroll-paper {
  background-color: #f8f3e6;
  background-image: 
    linear-gradient(rgba(204, 187, 154, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(204, 187, 154, 0.1) 1px, transparent 1px),
    url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(124, 58, 237, .03)' fill-rule='evenodd'/%3E%3C/svg%3E");
  background-size: 20px 20px, 20px 20px, 300px 300px;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
}

.w-6\.5 {
  width: 6.5rem;
}

.coin {
  width: 70px;
  height: 70px;
  perspective: 1000px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform-style: preserve-3d;
  position: relative;
}

.coin-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.3s;
}

.coin-inner.show-back {
  transform: rotateY(180deg);
}

.coin-front, .coin-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.coin-back {
  transform: rotateY(180deg);
}

.coin-landed {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

.changing-line {
  animation: changingPulse 2s infinite;
  box-shadow: 0 0 8px #5b21b6;
}

@keyframes changingPulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 8px #5b21b6;
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 15px #7c3aed;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style> 
<template>
  <div class="jiaobei-container mx-auto p-6 max-w-lg">
    <h1 class="text-2xl font-bold mb-4">笅杯占卜</h1>
    <div class="flex flex-col items-center mb-6">
      <JiaoBeiAnimation 
        :is-throwing="isThrowing"
        @animation-complete="onAnimationComplete"
      />
      <button 
        @click="throwJiaoBei" 
        :disabled="isThrowing" 
        class="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition mt-4"
      >
        {{ isThrowing ? '投掷中...' : '投掷笅杯' }}
      </button>
    </div>
    <div v-if="result" class="result-container">
      <div class="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-500"
           :class="{ 'scale-100 opacity-100': showResult, 'scale-95 opacity-0': !showResult }">
        <h2 class="text-2xl font-semibold mb-3 text-center" :class="resultColorClass">
          {{ result.name }}
        </h2>
        <div class="space-y-4">
          <p class="text-gray-700">{{ result.desc }}</p>
          <div class="border-t border-gray-200 pt-4">
            <h3 class="text-lg font-medium mb-2">解读</h3>
            <p class="text-gray-600">{{ result.interpret }}</p>
          </div>
          <div v-if="result.suggestion" class="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 class="text-lg font-medium mb-2 text-yellow-800">建议</h3>
            <p class="text-yellow-700">{{ result.suggestion }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import JiaoBeiAnimation from '../components/JiaoBeiAnimation.vue';

// 笅杯结果类型
interface JiaoBeiResult {
  name: string;
  desc: string;
  interpret: string;
  suggestion?: string;
  type: 'good' | 'neutral' | 'bad';
}

const results: JiaoBeiResult[] = [
  { 
    name: '圣杯', 
    desc: '两个正面，吉兆。', 
    interpret: '大吉大利，所问之事顺利成就。',
    suggestion: '此时正是行动的好时机，可以大胆推进计划。',
    type: 'good'
  },
  { 
    name: '笑杯', 
    desc: '一正一反，需再问。', 
    interpret: '结果未明，可再次投掷或静待时机。',
    suggestion: '建议稍作等待，观察形势变化后再做决定。',
    type: 'neutral'
  },
  { 
    name: '阴杯', 
    desc: '两个反面，凶兆。', 
    interpret: '不宜强求，建议暂缓或改变方向。',
    suggestion: '此时宜静不宜动，可以重新思考或调整计划。',
    type: 'bad'
  }
];

const isThrowing = ref(false);
const result = ref<JiaoBeiResult | null>(null);
const showResult = ref(false);

const resultColorClass = computed(() => {
  if (!result.value) return '';
  switch (result.value.type) {
    case 'good':
      return 'text-green-600';
    case 'neutral':
      return 'text-yellow-600';
    case 'bad':
      return 'text-red-600';
    default:
      return '';
  }
});

function throwJiaoBei() {
  isThrowing.value = true;
  showResult.value = false;
  result.value = null;
}

function onAnimationComplete() {
  isThrowing.value = false;
  // 随机生成结果
  const idx = Math.floor(Math.random() * results.length);
  result.value = results[idx];
  // 延迟显示结果，配合动画效果
  setTimeout(() => {
    showResult.value = true;
  }, 100);
}
</script>

<style scoped>
.jiaobei-container {
  background: linear-gradient(135deg, #f0fdf4 0%, #f5f3ff 100%);
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.result-container {
  perspective: 1000px;
}
</style> 
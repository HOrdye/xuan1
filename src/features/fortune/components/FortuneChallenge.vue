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
        <button
          @click="$emit('unlock')"
          class="unlock-button px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          点击解锁{{ type === 'challenge' ? '挑战' : '机遇' }}
        </button>
      </div>

      <div v-else class="space-y-4">
        <p class="text-gray-800">{{ content }}</p>
        
        <div class="tips bg-gray-50 rounded-xl p-4">
          <h4 class="font-semibold text-gray-700 mb-2">💡 小贴士</h4>
          <p class="text-gray-600">{{ tips }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  type: 'challenge' | 'opportunity';
  content: string;
  tips: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isUnlocked: boolean;
}>();

defineEmits<{
  (e: 'unlock'): void;
}>();

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
</style> 
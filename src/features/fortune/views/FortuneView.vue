<template>
  <div class="fortune-view container mx-auto px-4 py-8">
    <!-- 页面标题 -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">今日运势</h1>
      <p class="text-gray-600">{{ formattedDate }}</p>
    </div>

    <!-- 生日输入 -->
    <div class="max-w-md mx-auto mb-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">输入生日（可选）</h2>
        <div class="flex gap-4">
          <input
            type="date"
            v-model="birthday"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="generateFortune"
            :disabled="loading"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ loading ? '生成中...' : '生成运势' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 运势总览卡片 -->
    <div v-if="fortune" class="max-w-2xl mx-auto space-y-6">
      <FortuneCard
        title="今日运势总览"
        :fortune="fortune"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFortune } from '../composables/useFortune';
import FortuneCard from '../components/FortuneCard.vue';

const { fortune, loading, error, formattedDate, generate, reset } = useFortune();
const birthday = ref('');

const generateFortune = async () => {
  await generate(birthday.value || undefined);
};
</script>
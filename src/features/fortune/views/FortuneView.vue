<template>
  <div class="fortune-view min-h-screen bg-gray-50 py-12">
    <!-- 页面标题 -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">今日运势</h1>
      <p class="text-gray-500">{{ currentDate }}</p>
    </div>

    <!-- 生日和性别输入表单 -->
    <div class="max-w-2xl mx-auto mb-12 bg-white rounded-2xl shadow-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 生日输入 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            您的生日
          </label>
          <input
            type="date"
            v-model="birthday"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <!-- 性别选择 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            您的性别
          </label>
          <div class="flex gap-4">
            <label class="flex items-center">
              <input
                type="radio"
                v-model="gender"
                value="male"
                class="text-purple-600 focus:ring-purple-500"
              />
              <span class="ml-2">男</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                v-model="gender"
                value="female"
                class="text-purple-600 focus:ring-purple-500"
              />
              <span class="ml-2">女</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 问题输入 -->
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          有什么想问的吗？（选填）
        </label>
        <textarea
          v-model="question"
          rows="3"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="例如：今天适合表白吗？"
        ></textarea>
      </div>

      <!-- 生成按钮 -->
      <div class="mt-6 flex justify-center">
        <button
          @click="generateFortune"
          :disabled="loading || !isFormValid"
          class="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          <span v-if="!loading" class="flex items-center">
            <span class="mr-2">🔮</span>
            生成运势
          </span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loadingMessage }}
          </span>
        </button>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="max-w-2xl mx-auto mb-8">
      <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p class="text-red-600">{{ error }}</p>
        <button 
          @click="error = null" 
          class="mt-2 text-sm text-red-500 hover:text-red-700"
        >
          关闭
        </button>
      </div>
    </div>

    <!-- 运势结果 -->
    <div v-if="fortune && !loading" class="max-w-4xl mx-auto px-4">
      <!-- 挑战和机遇 -->
      <div v-if="fortune.dailyChallenge || fortune.dailyOpportunity" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FortuneChallenge
          v-if="fortune.dailyChallenge"
          :type="fortune.dailyChallenge.type"
          :content="fortune.dailyChallenge.content"
          :tips="fortune.dailyChallenge.tips"
          :difficulty="fortune.dailyChallenge.difficulty || 'easy'"
          :is-unlocked="fortune.dailyChallenge.isUnlocked || false"
          @unlock="handleUnlock('challenge')"
        />
        <FortuneChallenge
          v-if="fortune.dailyOpportunity"
          :type="fortune.dailyOpportunity.type"
          :content="fortune.dailyOpportunity.content"
          :tips="fortune.dailyOpportunity.tips"
          :difficulty="fortune.dailyOpportunity.difficulty || 'easy'"
          :is-unlocked="fortune.dailyOpportunity.isUnlocked || false"
          @unlock="handleUnlock('opportunity')"
        />
      </div>

      <!-- 运势卡片 -->
      <FortuneCard
        :fortune="fortune"
      />
    </div>

    <!-- 使用说明 -->
    <div v-if="!fortune && !loading" class="max-w-2xl mx-auto mt-12 px-4">
      <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3 text-center">✨ 功能说明</h3>
        <div class="space-y-2 text-sm text-gray-600">
          <p>🎯 <strong>个性化分析</strong>：输入生日和性别获得更准确的运势预测</p>
          <p>💫 <strong>互动体验</strong>：解锁运势能量球,发现今日机遇与挑战</p>
          <p>🔮 <strong>全方位解读</strong>：事业、财运、感情、健康多维度分析</p>
          <p>💡 <strong>贴心建议</strong>：获取具体可行的行动指导</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFortune } from '../composables/useFortune';
import FortuneCard from '../components/FortuneCard.vue';
import FortuneChallenge from '../components/FortuneChallenge.vue';
import type { PersonalizedFortuneData } from '../types/fortune';

const { fortune, loading, error, generate } = useFortune();

// 表单数据
const birthday = ref('');
const gender = ref<'male' | 'female' | ''>('');
const question = ref('');

// 加载消息
const loadingMessage = ref('正在生成运势...');

// 当前日期
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
});

// 表单验证
const isFormValid = computed(() => {
  return birthday.value && gender.value;
});

// 生成运势
const generateFortune = async () => {
  if (!isFormValid.value) return;

  try {
    loadingMessage.value = '正在分析星盘能量...';
    
    // 构建个性化数据
    const personalData: PersonalizedFortuneData = {
      birthDate: new Date(birthday.value),
      gender: gender.value as 'male' | 'female',
      question: question.value || undefined
    };
    
    await generate(personalData);
  } catch (err) {
    console.error('生成运势失败:', err);
  }
};

// 处理解锁事件
const handleUnlock = (type: 'challenge' | 'opportunity') => {
  if (!fortune.value) return;
  
  if (type === 'challenge' && fortune.value.dailyChallenge) {
    fortune.value.dailyChallenge.isUnlocked = true;
  } else if (type === 'opportunity' && fortune.value.dailyOpportunity) {
    fortune.value.dailyOpportunity.isUnlocked = true;
  }
};
</script>

<style scoped>
.fortune-view {
  background-image: linear-gradient(to bottom, rgba(139, 92, 246, 0.05), rgba(99, 102, 241, 0.05));
}
</style>
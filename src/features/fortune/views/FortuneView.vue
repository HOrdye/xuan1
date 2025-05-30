<template>
  <div class="fortune-view container mx-auto px-4 py-8">
    <!-- 页面标题 -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">🔮 今日运势</h1>
      <p class="text-gray-600">{{ currentDate }}</p>
    </div>

    <!-- 输入表单 -->
    <div class="max-w-lg mx-auto mb-8">
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">📝 输入您的信息</h2>
        
        <div class="space-y-4">
          <!-- 生日输入 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">生日 (可选)</label>
            <input
              type="date"
              v-model="birthday"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="选择您的生日"
            />
          </div>

          <!-- 性别选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">性别 (可选)</label>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input type="radio" v-model="gender" value="male" class="mr-2">
                <span>男性</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="gender" value="female" class="mr-2">
                <span>女性</span>
              </label>
            </div>
          </div>

          <!-- 特殊问题 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">想咨询的问题 (可选)</label>
            <textarea
              v-model="question"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="例如：最近工作压力很大，该如何调节？"
            ></textarea>
          </div>

          <!-- 生成按钮 -->
          <div class="flex gap-3">
            <button
              @click="generateBasicFortune"
              :disabled="loading"
              class="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? '生成中...' : '🎲 快速生成' }}
            </button>
            <button
              @click="generateAIFortune"
              :disabled="loading || !isAIAvailable"
              class="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? '分析中...' : '🤖 AI智能分析' }}
            </button>
          </div>

          <!-- AI不可用提示 -->
          <div v-if="!isAIAvailable" class="text-xs text-gray-500 text-center">
            💡 AI智能分析需要配置API密钥
          </div>
        </div>
      </div>
    </div>

    <!-- 加载指示器 -->
    <div v-if="loading" class="max-w-2xl mx-auto mb-8">
      <div class="bg-white rounded-xl shadow-lg p-6 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p class="text-gray-600">{{ loadingMessage }}</p>
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
    <div v-if="fortune && !loading" class="max-w-4xl mx-auto">
      <FortuneCard
        title="您的专属运势"
        :fortune="fortune"
      />
    </div>

    <!-- 使用说明 -->
    <div v-if="!fortune && !loading" class="max-w-2xl mx-auto mt-12">
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3 text-center">✨ 功能说明</h3>
        <div class="space-y-2 text-sm text-gray-600">
          <p>🎲 <strong>快速生成</strong>：基于传统命理学快速生成今日运势</p>
          <p>🤖 <strong>AI智能分析</strong>：结合个人信息进行深度AI分析（需配置API）</p>
          <p>📅 <strong>个性化</strong>：输入生日等信息获得更精准的运势分析</p>
          <p>💬 <strong>问题咨询</strong>：针对特定问题获得专门指导</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFortune } from '../composables/useFortune';
import { LLMService } from '../../../services/LLMService';
import FortuneCard from '../components/FortuneCard.vue';

const { fortune, loading, error, generate, reset } = useFortune();

// 表单数据
const birthday = ref('');
const gender = ref<'male' | 'female' | ''>('');
const question = ref('');

// 加载消息
const loadingMessage = ref('');

// 当前日期
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
});

// 检查AI是否可用
const isAIAvailable = computed(() => {
  const config = LLMService.getConfig();
  return !!(config.apiKey && config.provider);
});

// 生成基础运势
const generateBasicFortune = async () => {
  loadingMessage.value = '正在生成运势...';
  await generate(birthday.value || undefined);
};

// 生成AI运势
const generateAIFortune = async () => {
  if (!isAIAvailable.value) {
    error.value = '请先配置LLM API密钥才能使用AI分析功能';
    return;
  }

  loadingMessage.value = '正在进行AI智能分析...';
  // TODO: 这里需要扩展useFortune来支持AI选项
  await generate(birthday.value || undefined);
};
</script>
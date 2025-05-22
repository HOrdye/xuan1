<template>
  <div class="fortune-container mx-auto p-6 max-w-2xl">
    <h1 class="text-3xl font-bold mb-6 text-center">今日运势</h1>
    
    <!-- 用户信息表单 -->
    <div v-if="!fortuneResult" class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <form @submit.prevent="generateFortune" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">出生日期</label>
            <input 
              type="date" 
              v-model="formData.birthDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">性别</label>
            <select 
              v-model="formData.gender"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">生肖</label>
          <select 
            v-model="formData.zodiacSign"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">请选择</option>
            <option v-for="sign in zodiacSigns" :key="sign" :value="sign">{{ sign }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">想问的问题（选填）</label>
          <textarea 
            v-model="formData.question"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            rows="3"
            placeholder="请输入你想问的问题..."
          ></textarea>
        </div>
        <button 
          type="submit"
          class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition"
          :disabled="isGenerating"
        >
          {{ isGenerating ? '生成中...' : '生成运势' }}
        </button>
      </form>
    </div>

    <!-- 运势结果展示 -->
    <div v-if="fortuneResult" class="space-y-6">
      <!-- 整体运势 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-semibold mb-4">整体运势</h2>
        <div class="flex items-center justify-between mb-4">
          <div class="text-4xl font-bold" :class="getScoreColorClass(fortuneResult.overall.score)">
            {{ fortuneResult.overall.score }}
          </div>
          <div class="text-xl" :class="getLevelColorClass(fortuneResult.overall.level)">
            {{ getLevelText(fortuneResult.overall.level) }}
          </div>
        </div>
        <p class="text-gray-700">{{ fortuneResult.overall.description }}</p>
      </div>

      <!-- 各方面运势 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(aspect, key) in fortuneResult.aspects" :key="key" 
             class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-semibold mb-3">{{ getAspectName(key) }}</h3>
          <div class="flex items-center justify-between mb-3">
            <div class="text-2xl font-bold" :class="getScoreColorClass(aspect.score)">
              {{ aspect.score }}
            </div>
            <div :class="getLevelColorClass(aspect.level)">
              {{ getLevelText(aspect.level) }}
            </div>
          </div>
          <p class="text-gray-700 mb-2">{{ aspect.description }}</p>
          <p class="text-sm text-gray-600">{{ aspect.suggestion }}</p>
        </div>
      </div>

      <!-- 幸运信息 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-semibold mb-4">今日幸运</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 class="text-lg font-medium mb-2">幸运数字</h3>
            <div class="flex space-x-2">
              <span v-for="num in fortuneResult.lucky.numbers" :key="num"
                    class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                {{ num }}
              </span>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium mb-2">幸运颜色</h3>
            <div class="flex space-x-2">
              <span v-for="color in fortuneResult.lucky.colors" :key="color"
                    class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                {{ color }}
              </span>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium mb-2">幸运方位</h3>
            <div class="flex space-x-2">
              <span v-for="direction in fortuneResult.lucky.directions" :key="direction"
                    class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                {{ direction }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 建议 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-semibold mb-4">今日建议</h2>
        <ul class="space-y-2">
          <li v-for="(item, index) in fortuneResult.advice" :key="index"
              class="flex items-start">
            <span class="text-primary mr-2">•</span>
            <span class="text-gray-700">{{ item }}</span>
          </li>
        </ul>
      </div>

      <!-- 操作按钮 -->
      <div class="flex space-x-4">
        <button 
          @click="handleShare"
          class="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition flex items-center justify-center"
          :disabled="isSharing"
        >
          <span v-if="isSharing">分享中...</span>
          <span v-else>分享运势</span>
        </button>
        <button 
          @click="resetForm"
          class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition"
        >
          重新生成
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { FortuneGenerator } from '../utils/fortuneGenerator';
import { shareFortune } from '../utils/shareUtils';
import { 
  saveFortuneResult, 
  getFortuneResult, 
  saveFortuneRequest, 
  getFortuneRequest,
  isFortuneExpired,
  clearFortuneData
} from '../utils/storageUtils';
import type { FortuneResult, FortuneRequest } from '../types';

const zodiacSigns = [
  '鼠', '牛', '虎', '兔', '龙', '蛇', 
  '马', '羊', '猴', '鸡', '狗', '猪'
];

const formData = reactive<FortuneRequest>({
  birthDate: '',
  gender: 'male',
  zodiacSign: '',
  question: ''
});

const isGenerating = ref(false);
const fortuneResult = ref<FortuneResult | null>(null);
const isSharing = ref(false);

onMounted(() => {
  // 检查是否有缓存的运势结果
  const cachedResult = getFortuneResult();
  const cachedRequest = getFortuneRequest();
  
  if (cachedResult && !isFortuneExpired()) {
    fortuneResult.value = cachedResult;
    if (cachedRequest) {
      Object.assign(formData, cachedRequest);
    }
  }
});

async function generateFortune() {
  isGenerating.value = true;
  // 模拟API调用延迟
  setTimeout(() => {
    fortuneResult.value = FortuneGenerator.generateFortune(formData);
    // 保存结果和请求数据
    saveFortuneResult(fortuneResult.value);
    saveFortuneRequest(formData);
    isGenerating.value = false;
  }, 1000);
}

function resetForm() {
  fortuneResult.value = null;
  formData.birthDate = '';
  formData.gender = 'male';
  formData.zodiacSign = '';
  formData.question = '';
  clearFortuneData();
}

async function handleShare() {
  if (!fortuneResult.value) return;
  
  isSharing.value = true;
  try {
    await shareFortune(fortuneResult.value);
  } catch (error) {
    console.error('分享失败:', error);
  } finally {
    isSharing.value = false;
  }
}

function getScoreColorClass(score: number): string {
  if (score >= 85) return 'text-green-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

function getLevelColorClass(level: string): string {
  switch (level) {
    case 'excellent': return 'text-green-600';
    case 'good': return 'text-blue-600';
    case 'normal': return 'text-yellow-600';
    case 'bad': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

function getLevelText(level: string): string {
  switch (level) {
    case 'excellent': return '极佳';
    case 'good': return '良好';
    case 'normal': return '一般';
    case 'bad': return '不佳';
    default: return '未知';
  }
}

function getAspectName(key: string): string {
  switch (key) {
    case 'career': return '事业运';
    case 'wealth': return '财运';
    case 'love': return '感情运';
    case 'health': return '健康运';
    default: return key;
  }
}
</script>

<style scoped>
.fortune-container {
  background: linear-gradient(135deg, #f0fdf4 0%, #f5f3ff 100%);
  min-height: 100vh;
}

/* 添加动画效果 */
.fortune-container > * {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 添加卡片悬停效果 */
.bg-white {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}

.bg-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
</style> 
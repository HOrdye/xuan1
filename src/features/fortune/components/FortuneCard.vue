// 定义运势等级类型
export type FortuneLevel = 'excellent' | 'good' | 'normal' | 'bad' | 'terrible';

export interface FortuneItem {
  level: FortuneLevel;
  description: string;
  // 添加组件中使用的属性
  energyScore?: number;
  energyDescription?: string;
  zodiac?: {
    sign: string;
    element: string;
    luckyColor: string;
  };
  birthday?: string;
  date?: string;
  // 幸运元素
  luckyNumber?: number;
  luckyColor?: {
    name: string;
    hex: string;
  };
  luckyDirection?: string;
  // 活动建议
  goodActivities?: string[];
  badActivities?: string[];
}

export interface FortuneTips {
  do: string[];
  dont: string[];
}

export interface LuckyElements {
  color: string;
  number: number;
  direction: string;
}

export interface ZodiacInfo {
  sign: string;
  element: string;
  luckyColor: string;
}

export interface FortuneDetail {
  type: string;
  status: string;
  score: number;
  advice: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  barColor: string;
}

export interface LuckyColor {
  name: string;
  hex: string;
}

export interface ActionSuggestion {
  title: string;
  description: string;
}

export interface FortuneResult {
  date: string;
  birthday?: string;
  // 卡片式
  overall: FortuneItem;
  love: FortuneItem;
  career: FortuneItem;
  wealth: FortuneItem;
  health: FortuneItem;
  tips: FortuneTips;
  story: string;
  luckyElements: LuckyElements;
  zodiac: ZodiacInfo;
  // 能量式
  energyScore?: number;
  energyDescription?: string;
  fortuneDetails?: FortuneDetail[];
  luckyColor?: LuckyColor;
  luckyNumber?: number;
  luckyDirection?: string;
  storyContent?: string;
  goodActivities?: string[];
  badActivities?: string[];
  actionSuggestions?: ActionSuggestion[];
  aspects?: { [key: string]: { score: number; description: string } };
  lucky?: {
    numbers?: number[];
    colors?: string[];
    directions?: string[];
  };
  advice?: string[];
  aiAnalysis?: string;
  personalizedTips?: string[];
}

<template>
  <div class="fortune-card bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- 头部标题 -->
    <div class="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6">
      <h2 class="text-2xl font-bold text-center">{{ title }}</h2>
      <p class="text-center opacity-90 mt-1">{{ formattedDate }}</p>
    </div>
    
    <div v-if="fortune" class="p-6 space-y-6">
      <!-- 整体运势 -->
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-2xl font-bold mb-3">
          {{ fortune.overall?.score || 0 }}
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">整体运势</h3>
        <p class="text-gray-600">{{ fortune.overall?.description || '运势良好' }}</p>
        <div class="mt-2 text-sm text-blue-600 bg-blue-50 rounded-lg p-2">
          {{ fortune.overall?.suggestion || '保持积极心态' }}
        </div>
      </div>

      <!-- 分项运势 -->
      <div v-if="fortune.aspects" class="grid grid-cols-2 gap-4">
        <div v-for="(aspect, key) in fortune.aspects" :key="key" 
             class="bg-gray-50 rounded-lg p-4 text-center">
          <div class="text-2xl mb-2">{{ getAspectIcon(key) }}</div>
          <h4 class="font-semibold text-gray-800 mb-1">{{ getAspectName(key) }}</h4>
          <div class="flex items-center justify-center mb-2">
            <div class="flex space-x-1">
              <span v-for="i in 5" :key="i" class="text-lg"
                    :class="i <= getStarRating(aspect.score) ? 'text-yellow-400' : 'text-gray-300'">
                ★
              </span>
            </div>
            <span class="ml-2 text-sm font-medium text-gray-600">{{ aspect.score }}</span>
          </div>
          <p class="text-xs text-gray-600">{{ aspect.description }}</p>
        </div>
      </div>

      <!-- 幸运元素 -->
      <div v-if="fortune.lucky" class="bg-yellow-50 rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-3 text-center">🍀 今日幸运</h4>
        <div class="space-y-2">
          <div v-if="fortune.lucky.numbers?.length" class="flex items-center">
            <span class="text-sm font-medium text-gray-700 w-16">数字:</span>
            <div class="flex flex-wrap gap-1">
              <span v-for="num in fortune.lucky.numbers" :key="num" 
                    class="inline-block bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-sm">
                {{ num }}
              </span>
            </div>
          </div>
          <div v-if="fortune.lucky.colors?.length" class="flex items-center">
            <span class="text-sm font-medium text-gray-700 w-16">颜色:</span>
            <div class="flex flex-wrap gap-1">
              <span v-for="color in fortune.lucky.colors" :key="color" 
                    class="inline-block bg-purple-200 text-purple-800 px-2 py-1 rounded text-sm">
                {{ color }}
              </span>
            </div>
          </div>
          <div v-if="fortune.lucky.directions?.length" class="flex items-center">
            <span class="text-sm font-medium text-gray-700 w-16">方位:</span>
            <div class="flex flex-wrap gap-1">
              <span v-for="direction in fortune.lucky.directions" :key="direction" 
                    class="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm">
                {{ direction }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 今日建议 -->
      <div v-if="fortune.advice?.length" class="bg-green-50 rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-3 text-center">💡 今日建议</h4>
        <ul class="space-y-2">
          <li v-for="(advice, index) in fortune.advice.slice(0, 3)" :key="index" 
              class="text-sm text-gray-700 flex items-start">
            <span class="text-green-500 mr-2">•</span>
            <span>{{ advice }}</span>
          </li>
        </ul>
      </div>

      <!-- AI分析（如果有） -->
      <div v-if="fortune.aiAnalysis" class="bg-blue-50 rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-3 text-center">🤖 AI个性化分析</h4>
        <div class="text-sm text-gray-700 whitespace-pre-line max-h-40 overflow-y-auto">
          {{ fortune.aiAnalysis }}
        </div>
      </div>

      <!-- 个性化建议 -->
      <div v-if="fortune.personalizedTips?.length" class="bg-pink-50 rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-3 text-center">✨ 个性化建议</h4>
        <ul class="space-y-2">
          <li v-for="(tip, index) in fortune.personalizedTips.slice(0, 3)" :key="index" 
              class="text-sm text-gray-700 flex items-start">
            <span class="text-pink-500 mr-2">•</span>
            <span>{{ tip }}</span>
          </li>
        </ul>
      </div>
    </div>
    
    <div v-else class="p-6 text-center text-gray-400">
      暂无运势数据
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FortuneResult } from '../types/fortune';

const props = defineProps<{
  title: string
  fortune: FortuneResult | null
}>();

// 格式化日期
const formattedDate = computed(() => {
  if (!props.fortune?.date) return '';
  try {
    return new Date(props.fortune.date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  } catch (err) {
    console.error('日期格式化错误:', err);
    return '';
  }
});

// 获取运势方面的图标
const getAspectIcon = (aspect: string): string => {
  const icons: { [key: string]: string } = {
    career: '💼',
    wealth: '💰',
    love: '❤️',
    health: '🏃‍♂️'
  };
  return icons[aspect] || '⭐';
};

// 获取运势方面的中文名称
const getAspectName = (aspect: string): string => {
  const names: { [key: string]: string } = {
    career: '事业运',
    wealth: '财运',
    love: '感情运',
    health: '健康运'
  };
  return names[aspect] || aspect;
};

// 根据分数计算星级评分（1-5星）
const getStarRating = (score: number): number => {
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 60) return 3;
  if (score >= 45) return 2;
  return 1;
};
</script>
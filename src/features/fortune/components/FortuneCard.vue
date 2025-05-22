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
}

<template>
  <div class="fortune-card bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
    <div class="text-2xl font-bold mb-4">{{ title }}</div>
    <div v-if="fortune" class="w-full">
      <!-- 能量分数和描述 -->
      <div class="text-lg font-semibold mb-2 flex items-center justify-between">
        <span>能量分：</span>
        <span class="text-primary text-xl">{{ fortune.energyScore || getScoreFromLevel(fortune.level) }}</span>
      </div>
      <div class="text-base text-gray-600 mb-4">{{ fortune.energyDescription || fortune.description }}</div>
      
      <!-- 星座信息 -->
      <div v-if="fortune.zodiac" class="flex flex-wrap items-center gap-4 mb-4">
        <div class="px-3 py-1 bg-gray-100 rounded-lg">
          <span class="font-semibold">星座：</span>
          <span>{{ fortune.zodiac.sign }}</span>
          <span class="ml-2 text-xs text-gray-400">({{ fortune.zodiac.element }}象)</span>
        </div>
        <div class="px-3 py-1 bg-gray-100 rounded-lg">
          <span class="font-semibold">幸运色：</span>
          <span :style="{ color: fortune.zodiac.luckyColor }">{{ fortune.zodiac.luckyColor }}</span>
        </div>
      </div>
      
      <!-- 幸运元素 -->
      <div class="mb-4" v-if="hasLuckyElements">
        <div class="text-sm font-semibold mb-2">今日幸运</div>
        <div class="flex flex-wrap gap-2">
          <div v-if="fortune.luckyNumber" class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            <span class="font-semibold">数字：</span>{{ fortune.luckyNumber }}
          </div>
          <div v-if="fortune.luckyColor?.name" class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            <span class="font-semibold">颜色：</span>
            <span :style="{ color: fortune.luckyColor.hex }">{{ fortune.luckyColor.name }}</span>
          </div>
          <div v-if="fortune.luckyDirection" class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            <span class="font-semibold">方位：</span>{{ fortune.luckyDirection }}
          </div>
        </div>
      </div>
      
      <!-- 建议和提示 -->
      <div v-if="fortune.goodActivities && fortune.goodActivities.length" class="mb-4">
        <div class="text-sm font-semibold mb-1 text-green-600">宜</div>
        <div class="text-sm text-gray-600">
          {{ fortune.goodActivities.join('、') }}
        </div>
      </div>
      <div v-if="fortune.badActivities && fortune.badActivities.length" class="mb-4">
        <div class="text-sm font-semibold mb-1 text-red-600">忌</div>
        <div class="text-sm text-gray-600">
          {{ fortune.badActivities.join('、') }}
        </div>
      </div>
      
      <!-- 日期信息 -->
      <div class="text-sm text-gray-400 mt-4 border-t pt-2">
        <div v-if="fortune.birthday" class="mb-1">
          <span>生日：{{ fortune.birthday }}</span>
        </div>
        <div>
          <span>日期：{{ fortune.date }}</span>
        </div>
      </div>
    </div>
    <div v-else class="text-gray-400">暂无运势数据</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 内联定义 FortuneItem 类型，避免导入问题
interface FortuneItem {
  level: string;
  description: string;
  energyScore?: number;
  energyDescription?: string;
  zodiac?: {
    sign: string;
    element: string;
    luckyColor: string;
  };
  birthday?: string;
  date?: string;
  luckyNumber?: number;
  luckyColor?: {
    name: string;
    hex: string;
  };
  luckyDirection?: string;
  goodActivities?: string[];
  badActivities?: string[];
}

const props = defineProps<{
  title: string
  fortune: FortuneItem
}>();

// 根据运势等级计算分数
const getScoreFromLevel = (level: string): number => {
  switch (level) {
    case 'excellent': return Math.floor(Math.random() * 10) + 90; // 90-99
    case 'good': return Math.floor(Math.random() * 20) + 70; // 70-89
    case 'normal': return Math.floor(Math.random() * 30) + 40; // 40-69
    case 'bad': return Math.floor(Math.random() * 20) + 20; // 20-39
    case 'terrible': return Math.floor(Math.random() * 19) + 1; // 1-19
    default: return 50;
  }
};

// 检查是否有幸运元素可以显示
const hasLuckyElements = computed(() => {
  const { fortune } = props;
  return fortune.luckyNumber || (fortune.luckyColor && fortune.luckyColor.name) || fortune.luckyDirection;
});
</script>
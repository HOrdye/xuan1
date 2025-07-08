<template>
  <div class="fortune-card bg-white rounded-2xl shadow-xl overflow-hidden">
    <!-- 卡片头部 -->
    <div class="card-header relative p-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-2xl font-bold">运势详解</h3>
        <span class="text-sm opacity-75">{{ formattedDate }}</span>
      </div>
      
      <!-- 整体运势 -->
      <div class="overall-fortune">
        <div class="flex items-center gap-4 mb-3">
          <div class="text-4xl">{{ getOverallEmoji() }}</div>
          <div>
            <div class="text-lg font-semibold">{{ fortune.overall.description }}</div>
            <div class="text-sm opacity-75">能量指数: {{ fortune.overall.energyScore }}%</div>
          </div>
        </div>
        <div class="text-sm">{{ fortune.overall.energyDescription }}</div>
      </div>
    </div>

    <!-- 运势详情 -->
    <div class="p-6 space-y-6">
      <!-- 各方面运势 -->
      <div class="aspects-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(aspect, key) in fortune.aspects" :key="key"
             class="aspect-card bg-gray-50 rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-semibold text-gray-700">{{ getAspectTitle(key) }}</h4>
            <div class="text-2xl">{{ getAspectEmoji(key) }}</div>
          </div>
          <div class="mb-2">
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                   :style="{ width: `${aspect.score}%` }">
              </div>
            </div>
          </div>
          <p class="text-sm text-gray-600">{{ aspect.description }}</p>
        </div>
      </div>

      <!-- 幸运元素 -->
      <div class="bg-gray-50 rounded-2xl p-6 mt-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span class="mr-2">🍀</span>
          今日幸运元素
        </h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-2xl"
                 :style="{ backgroundColor: getLuckyColorStyle(fortune.luckyElements.color) }">
              🎨
            </div>
            <p class="text-sm text-gray-600">幸运色</p>
            <p class="font-medium text-gray-800">{{ fortune.luckyElements.color }}</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600 text-xl font-bold">
              {{ fortune.luckyElements.number }}
            </div>
            <p class="text-sm text-gray-600">幸运数字</p>
            <p class="font-medium text-gray-800">{{ fortune.luckyElements.number }}</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">
              🧭
            </div>
            <p class="text-sm text-gray-600">幸运方位</p>
            <p class="font-medium text-gray-800">{{ fortune.luckyElements.direction }}</p>
          </div>
        </div>
      </div>

      <!-- AI个性化分析（新增） -->
      <div v-if="fortune.aiAnalysis && isAIAnalyzed" class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mt-6 border border-purple-200">
        <h3 class="text-lg font-semibold mb-4 text-purple-800 flex items-center">
          <span class="mr-2">🤖</span>
          AI深度分析
        </h3>
        
        <!-- 个性化见解 -->
        <div v-if="fortune.personalizedInsights" class="mb-4">
          <h4 class="text-md font-medium text-purple-700 mb-2 flex items-center">
            <span class="mr-2">💡</span>
            个性化见解
          </h4>
          <div class="bg-white rounded-lg p-4 border border-purple-100">
            <p class="text-gray-700 leading-relaxed">{{ fortune.personalizedInsights }}</p>
          </div>
        </div>
        
        <!-- 问题解答 -->
        <div v-if="fortune.questionAnswer" class="mb-4">
          <h4 class="text-md font-medium text-purple-700 mb-2 flex items-center">
            <span class="mr-2">💭</span>
            专属问题解答
          </h4>
          <div class="bg-white rounded-lg p-4 border border-purple-100">
            <p class="text-gray-700 leading-relaxed">{{ fortune.questionAnswer }}</p>
          </div>
        </div>
        
        <!-- AI来源标识 -->
        <div class="text-xs text-purple-500 mt-4 text-center">
          <span class="inline-flex items-center">
            <span class="mr-1">✨</span>
            由AI智能分析生成，结合传统命理学与现代心理学
          </span>
        </div>
      </div>

      <!-- 每日建议 -->
      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <span class="mr-2">📝</span>
          今日建议
        </h3>
        <div class="space-y-3">
          <div v-for="advice in fortune.advice" :key="advice" class="flex items-start">
            <span class="text-green-500 mr-2 mt-1">•</span>
            <p class="text-gray-700">{{ advice }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FortuneResult } from '../types/fortune';

const props = defineProps<{
  fortune: FortuneResult;
}>();

// 格式化日期
const formattedDate = computed(() => {
  if (!props.fortune.date) return '';
  const date = new Date(props.fortune.date);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
});

// 获取整体运势表情
const getOverallEmoji = () => {
  const score = props.fortune.overall.energyScore || 0;
  if (score >= 90) return '🌟';
  if (score >= 80) return '⭐';
  if (score >= 70) return '✨';
  if (score >= 60) return '💫';
  return '⚡';
};

// 获取方面标题
const getAspectTitle = (key: string) => {
  const titles: Record<string, string> = {
    career: '事业运势',
    wealth: '财运',
    love: '感情运势',
    health: '健康运势'
  };
  return titles[key] || key;
};

// 获取方面表情
const getAspectEmoji = (key: string) => {
  const emojis: Record<string, string> = {
    career: '💼',
    wealth: '💰',
    love: '💝',
    health: '💪'
  };
  return emojis[key] || '✨';
};

// 检查是否为AI分析结果
const isAIAnalyzed = computed(() => {
  return props.fortune.aiAnalysis && (
    props.fortune.personalizedInsights || 
    props.fortune.questionAnswer ||
    (props.fortune.aiAnalysis.includes('AI') || props.fortune.aiAnalysis.includes('{"'))
  )
})

// 获取幸运颜色样式
const getLuckyColorStyle = (colorName: string): string => {
  const colorMap: {[key: string]: string} = {
    '红色': '#ef4444',
    '橙色': '#f97316', 
    '黄色': '#eab308',
    '绿色': '#22c55e',
    '蓝色': '#3b82f6',
    '紫色': '#8b5cf6',
    '粉色': '#ec4899',
    '白色': '#f8fafc',
    '黑色': '#1f2937',
    '金色': '#f59e0b',
    '银色': '#64748b',
    '棕色': '#92400e',
    '青色': '#06b6d4',
    '灰色': '#6b7280'
  };
  
  return colorMap[colorName] || '#8b5cf6';
}
</script>

<style scoped>
.fortune-card {
  max-width: 800px;
  margin: 0 auto;
}

.energy-bar {
  box-shadow: 0 0 10px rgba(250, 204, 21, 0.3);
}

.aspect-card {
  transition: all 0.3s ease;
}

.aspect-card:hover {
  transform: translateY(-2px);
}

.stars {
  letter-spacing: -1px;
}
</style>
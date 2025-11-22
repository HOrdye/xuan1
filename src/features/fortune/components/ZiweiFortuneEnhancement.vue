<template>
  <div v-if="ziweiData" class="ziwei-enhancement mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 shadow-lg">
    <!-- 标题 -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 flex items-center">
        <span class="mr-2 text-2xl">🔮</span>
        紫微流年运势
      </h3>
      <span class="text-sm text-purple-600 font-medium">{{ ziweiData.flowYear }}</span>
    </div>

    <!-- 双轨时间线（Week 1 MVP：上轨易经，下轨紫微流日） -->
    <div class="timeline-section mb-6">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center">
          <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
          <span class="text-sm font-medium text-gray-700">紫微流日</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span class="text-sm font-medium text-gray-700">易经时令</span>
        </div>
      </div>
      
      <!-- 上轨：易经时令 -->
      <div class="timeline-track mb-3">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-blue-600">易经时令</span>
          <span class="text-xs text-gray-500">{{ currentSeason }}</span>
        </div>
        <div class="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" 
               style="width: 60%"></div>
        </div>
      </div>
      
      <!-- 下轨：紫微流日（Week 1 MVP：流日主星显示） -->
      <div class="timeline-track">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-purple-600">紫微流日</span>
          <span v-if="ziweiData.flowDay" class="text-xs text-gray-500">{{ ziweiData.flowDay }}</span>
        </div>
        <div class="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" 
               :style="{ width: `${ziweiData.overallEnergy}%` }"></div>
        </div>
        <!-- Week 1 MVP：流日主星信息 -->
        <div v-if="ziweiData.flowDayMainStars && ziweiData.flowDayMainStars.length > 0" 
             class="flow-day-stars mt-2 flex items-center gap-2 text-xs">
          <span class="text-gray-600">流日主星：</span>
          <div class="flex flex-wrap gap-1">
            <span v-for="star in ziweiData.flowDayMainStars" :key="star"
                  class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
              {{ getMainStarName(star) }}
            </span>
          </div>
          <span v-if="ziweiData.flowDayPalace" class="text-gray-500 ml-2">
            在{{ getPalaceName(ziweiData.flowDayPalace) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 流年四化 -->
    <div v-if="ziweiData.sihua?.year" class="sihua-section mb-6">
      <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <span class="mr-2">✨</span>
        流年四化
      </h4>
      <div class="grid grid-cols-4 gap-2">
        <div v-for="(sihuaType, starName) in ziweiData.sihua.year" :key="starName"
             class="sihua-item bg-white rounded-lg p-2 text-center border border-gray-200">
          <div class="text-xs text-gray-600 mb-1">{{ starName }}</div>
          <div class="text-sm font-semibold" :class="getSihuaColorClass(sihuaType)">
            {{ getSihuaLabel(sihuaType) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 宫位建议 -->
    <div v-if="ziweiData.palaceAdvice && ziweiData.palaceAdvice.length > 0" class="palace-advice-section">
      <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <span class="mr-2">🏛️</span>
        宫位建议
      </h4>
      <div class="space-y-3">
        <div v-for="(advice, index) in ziweiData.palaceAdvice.slice(0, 3)" :key="index"
             class="advice-card bg-white rounded-lg p-3 border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-800">{{ getPalaceName(advice.palace) }}</span>
            <div class="flex items-center">
              <div class="w-16 h-2 bg-gray-200 rounded-full mr-2">
                <div class="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                     :style="{ width: `${advice.score}%` }"></div>
              </div>
              <span class="text-xs text-gray-600">{{ advice.score }}%</span>
            </div>
          </div>
          <p class="text-xs text-gray-600">{{ advice.advice }}</p>
          <div class="flex flex-wrap gap-1 mt-2">
            <span v-for="keyword in advice.keywords.slice(0, 3)" :key="keyword"
                  class="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
              {{ keyword }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 幸运宫位和挑战宫位 -->
    <div v-if="ziweiData.luckyPalace || ziweiData.challengePalace" class="palace-highlight mt-4 grid grid-cols-2 gap-3">
      <div v-if="ziweiData.luckyPalace" class="lucky-palace bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
        <div class="flex items-center mb-1">
          <span class="text-lg mr-2">🍀</span>
          <span class="text-sm font-semibold text-green-700">幸运宫位</span>
        </div>
        <span class="text-xs text-green-600">{{ getPalaceName(ziweiData.luckyPalace) }}</span>
      </div>
      <div v-if="ziweiData.challengePalace" class="challenge-palace bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-3 border border-orange-200">
        <div class="flex items-center mb-1">
          <span class="text-lg mr-2">⚠️</span>
          <span class="text-sm font-semibold text-orange-700">挑战宫位</span>
        </div>
        <span class="text-xs text-orange-600">{{ getPalaceName(ziweiData.challengePalace) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ZiweiFortuneEnhancement } from '../../../shared/types/cross-system';

interface Props {
  ziweiData?: ZiweiFortuneEnhancement;
}

const props = defineProps<Props>();

// 获取当前季节
const currentSeason = computed(() => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return '春季';
  if (month >= 6 && month <= 8) return '夏季';
  if (month >= 9 && month <= 11) return '秋季';
  return '冬季';
});

// 获取四化标签
const getSihuaLabel = (type: string): string => {
  const map: Record<string, string> = {
    lu: '禄',
    quan: '权',
    ke: '科',
    ji: '忌'
  };
  return map[type] || type;
};

// 获取四化颜色类
const getSihuaColorClass = (type: string): string => {
  const map: Record<string, string> = {
    lu: 'text-green-600',
    quan: 'text-red-600',
    ke: 'text-blue-600',
    ji: 'text-orange-600'
  };
  return map[type] || 'text-gray-600';
};

// 获取宫位名称
const getPalaceName = (palace: string): string => {
  const map: Record<string, string> = {
    ming: '命宫',
    xiongdi: '兄弟宫',
    fuqi: '夫妻宫',
    zinu: '子女宫',
    cai: '财帛宫',
    jiluan: '疾厄宫',
    qianyi: '迁移宫',
    pugu: '仆役宫',
    guanlu: '官禄宫',
    tianzhai: '田宅宫',
    fude: '福德宫',
    fumu: '父母宫'
  };
  return map[palace] || palace;
};

// 获取主星名称（Week 1 MVP新增）
const getMainStarName = (starId: string): string => {
  const map: Record<string, string> = {
    ziwei: '紫微',
    tianji: '天机',
    taiyang: '太阳',
    wuqu: '武曲',
    tiantong: '天同',
    lianzhen: '廉贞',
    tianfu: '天府',
    taiyin: '太阴',
    tanlang: '贪狼',
    jumen: '巨门',
    tianxiang: '天相',
    tianliang: '天梁',
    qisha: '七杀',
    poyao: '破军'
  };
  return map[starId] || starId;
};
</script>

<style scoped>
.timeline-section {
  position: relative;
}

.sihua-item {
  transition: transform 0.2s, box-shadow 0.2s;
}

.sihua-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.advice-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.advice-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>


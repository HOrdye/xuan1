<template>
  <div class="fortune-tips bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-xl font-semibold text-gray-800 mb-4">今日运势提示</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 宜 -->
      <div class="tips-section">
        <h4 class="text-lg font-medium text-green-600 mb-2">宜</h4>
        <ul class="space-y-2">
          <li v-for="(tip, index) in tips.do" :key="'do-' + index" 
              class="flex items-center text-gray-600">
            <span class="text-green-500 mr-2">✓</span>
            {{ tip }}
          </li>
        </ul>
      </div>
      
      <!-- 忌 -->
      <div class="tips-section">
        <h4 class="text-lg font-medium text-red-600 mb-2">忌</h4>
        <ul class="space-y-2">
          <li v-for="(tip, index) in tips.dont" :key="'dont-' + index"
              class="flex items-center text-gray-600">
            <span class="text-red-500 mr-2">✗</span>
            {{ tip }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FortuneTips as FortuneTipsType } from '../types/fortune';

defineProps<{
  tips: FortuneTipsType;
}>();
</script> 
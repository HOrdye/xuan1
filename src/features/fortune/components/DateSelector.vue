<template>
  <div class="date-selector">
    <div class="flex items-center justify-between bg-white rounded-lg shadow-sm p-3 mb-4">
      <button 
        @click="previousDay" 
        class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
      >
        <i class="fas fa-chevron-left text-gray-500"></i>
      </button>
      
      <div class="text-center">
        <span 
          class="text-gray-800 font-medium cursor-pointer px-3 py-1 rounded-lg hover:bg-primary hover:text-white transition-colors"
          @click="selectToday"
        >
          {{ isToday ? '今天' : formattedDate }}
        </span>
      </div>
      
      <button 
        @click="nextDay" 
        class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        :disabled="isFutureLimit"
        :class="{ 'opacity-50 cursor-not-allowed': isFutureLimit }"
      >
        <i class="fas fa-chevron-right text-gray-500"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

// 定义组件属性
const props = defineProps<{
  modelValue: Date;
  // 允许查看的最大未来天数（默认为7天）
  futureDayLimit?: number;
}>();

// 定义事件
const emit = defineEmits<{
  (e: 'update:modelValue', date: Date): void;
}>();

// 当前选择的日期
const selectedDate = computed(() => props.modelValue);

// 今天日期
const today = new Date();
today.setHours(0, 0, 0, 0);

// 计算属性：是否是今天
const isToday = computed(() => {
  return isSameDay(selectedDate.value, today);
});

// 计算属性：格式化后的日期
const formattedDate = computed(() => {
  const date = selectedDate.value;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
});

// 计算属性：是否达到未来日期限制
const isFutureLimit = computed(() => {
  // 计算最大允许的未来日期
  const maxFutureDate = new Date(today);
  const futureDayLimit = props.futureDayLimit || 7;
  maxFutureDate.setDate(today.getDate() + futureDayLimit);
  
  // 如果选择的日期超过最大允许日期，则禁用下一天按钮
  return selectedDate.value >= maxFutureDate;
});

// 辅助方法：检查是否是同一天
function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

// 方法：前一天
function previousDay() {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() - 1);
  emit('update:modelValue', newDate);
}

// 方法：后一天
function nextDay() {
  if (isFutureLimit.value) return;
  
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() + 1);
  emit('update:modelValue', newDate);
}

// 方法：选择今天
function selectToday() {
  emit('update:modelValue', new Date(today));
}
</script>

<style scoped>
.date-selector {
  /* 如果需要自定义样式，可以在这里添加 */
}
</style> 
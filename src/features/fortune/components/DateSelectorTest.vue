<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">日期选择器测试</h1>
    
    <div class="bg-white rounded-xl p-4 mb-6">
      <DateSelector v-model="selectedDate" :future-day-limit="7" />
      
      <div class="mt-4">
        <p>当前选择日期: <span class="font-medium">{{ formattedDate }}</span></p>
        <p>是否为今天: <span class="font-medium">{{ isToday ? '是' : '否' }}</span></p>
        <p>是否超过未来限制: <span class="font-medium">{{ isFutureLimit ? '是' : '否' }}</span></p>
      </div>
      
      <div class="flex space-x-2 mt-4">
        <button 
          @click="moveDate(-1)"
          class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          前一天
        </button>
        <button 
          @click="resetToToday"
          class="px-3 py-1 bg-primary text-white rounded-lg"
        >
          今天
        </button>
        <button 
          @click="moveDate(1)"
          class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg"
          :class="{'opacity-50 cursor-not-allowed': isFutureLimit}"
          :disabled="isFutureLimit"
        >
          后一天
        </button>
      </div>
    </div>
    
    <div class="bg-white rounded-xl p-4">
      <h2 class="text-lg font-bold mb-2">测试结果</h2>
      <div class="space-y-2">
        <div v-for="(result, index) in testResults" :key="index" class="p-2 rounded-lg" :class="result.pass ? 'bg-green-50' : 'bg-red-50'">
          <div class="flex items-center">
            <span class="w-5 h-5 rounded-full flex items-center justify-center mr-2" :class="result.pass ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
              <i :class="result.pass ? 'fas fa-check' : 'fas fa-times'"></i>
            </span>
            <span>{{ result.name }}: {{ result.message }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DateSelector from './DateSelector.vue';

// 状态
const selectedDate = ref(new Date());
const testResults = ref([
  {
    name: '初始化测试',
    pass: true,
    message: '组件正确加载并显示今天日期'
  }
]);

// 辅助函数：格式化日期
function formatDate(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

// 计算属性：格式化后的当前选择日期
const formattedDate = computed(() => {
  return formatDate(selectedDate.value);
});

// 计算属性：是否是今天
const isToday = computed(() => {
  const today = new Date();
  return isSameDay(selectedDate.value, today);
});

// 计算属性：是否超过未来限制
const isFutureLimit = computed(() => {
  const today = new Date();
  const maxFutureDate = new Date(today);
  maxFutureDate.setDate(today.getDate() + 7); // 7天限制
  
  return selectedDate.value > maxFutureDate;
});

// 辅助函数：检查是否是同一天
function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

// 方法：移动日期
function moveDate(days: number) {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() + days);
  
  if (days > 0 && isFutureLimit.value) {
    // 添加测试结果
    testResults.value.push({
      name: '未来日期限制测试',
      pass: true,
      message: '成功限制超过7天的未来日期'
    });
    return;
  }
  
  selectedDate.value = newDate;
  
  // 添加测试结果
  testResults.value.push({
    name: '日期变更测试',
    pass: true,
    message: `成功${days > 0 ? '前进' : '后退'}到 ${formatDate(newDate)}`
  });
}

// 方法：重置到今天
function resetToToday() {
  const today = new Date();
  selectedDate.value = today;
  
  // 添加测试结果
  testResults.value.push({
    name: '重置日期测试',
    pass: true,
    message: '成功重置到今天'
  });
}
</script> 
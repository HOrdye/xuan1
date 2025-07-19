<template>
  <button
    @click="toggleSave"
    :disabled="isChecking || !isValidItem"
    class="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
    :aria-label="isSaved ? '从历史记录中移除' : '保存到历史记录'"
    :title="getButtonTitle()"
  >
    <transition name="fade" mode="out-in">
      <svg
        v-if="isChecking"
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 animate-spin"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <svg
        v-else-if="isSaved"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-yellow-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </transition>
    
    <!-- Enhanced Tooltip -->
    <div
      v-if="showTooltip"
      class="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 z-50"
      style="max-width: 200px;"
    >
      <div class="bg-gray-900 text-white text-sm rounded-lg shadow-lg border border-white/20 overflow-hidden">
        <div class="px-3 py-2">
          <p class="font-medium leading-tight break-words">{{ tooltipText }}</p>
          <p v-if="tooltipText === '已保存'" class="text-gray-300 text-xs mt-1 leading-tight break-words">
            可在历史记录中随时查看
          </p>
          <p v-if="tooltipText.includes('错误')" class="text-red-300 text-xs mt-1 leading-tight break-words">
            请稍后重试或联系支持
          </p>
        </div>
        <div v-if="tooltipText === '已保存'" class="border-t border-white/10 px-2 py-1">
          <button
            @click="navigateToHistory"
            class="w-full text-left text-xs text-purple-300 hover:text-purple-200 py-1 px-2 rounded hover:bg-white/10 transition-colors"
          >
            📚 查看历史记录
          </button>
        </div>
      </div>
      <!-- Arrow -->
      <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useHistoryStore } from '../../store/historyStore';
import type { HistoryItem } from '../../services/historyService';

const props = defineProps<{
  item: Omit<HistoryItem, 'id' | 'date' | 'title'>;
  title: string;
}>();

const router = useRouter();
const historyStore = useHistoryStore();
const isSaved = ref(false);
const isChecking = ref(true);
const savedItemId = ref<string | null>(null);

const showTooltip = ref(false);
const tooltipText = ref('');

let tooltipTimeout: number;

// 验证项目数据的完整性
const isValidItem = computed(() => {
  if (!props.item || !props.title) {
    console.warn('⚠️ SaveButton: Invalid item or title', { item: props.item, title: props.title });
    return false;
  }
  
  if (!props.item.type || !['fortune', 'jiaoBei', 'divination', 'tarot'].includes(props.item.type)) {
    console.warn('⚠️ SaveButton: Invalid item type', props.item.type);
    return false;
  }
  
  if (!props.item.result) {
    console.warn('⚠️ SaveButton: Missing result data');
    return false;
  }
  
  return true;
});

const getButtonTitle = () => {
  if (!isValidItem.value) return '数据不完整，无法保存';
  if (isChecking.value) return '检查保存状态中...';
  return isSaved.value ? '点击从历史记录中移除' : '保存到历史记录，随时回顾';
};

// 改进的数据比较函数
const compareItemData = (item1: any, item2: any): boolean => {
  try {
    // 标准化数据结构用于比较
    const normalize = (item: any) => {
      return {
        type: item.type,
        question: item.question || '',
        result: item.result
      };
    };
    
    const normalized1 = normalize(item1);
    const normalized2 = normalize(item2);
    
    return JSON.stringify(normalized1) === JSON.stringify(normalized2);
  } catch (error) {
    console.error('❌ Error comparing items:', error);
    return false;
  }
};

const checkSavedStatus = async () => {
  if (!isValidItem.value) {
    isChecking.value = false;
    return;
  }
  
  console.log('🔍 Checking saved status...', props.title);
  isChecking.value = true;
  
  try {
  const history = historyStore.historyList;
    console.log('📊 Current history count:', history.length);
    
    const existingItem = history.find(h => compareItemData(h, props.item));

  if (existingItem) {
    isSaved.value = true;
    savedItemId.value = existingItem.id;
    console.log('✅ Item already saved:', existingItem.id);
  } else {
    isSaved.value = false;
    savedItemId.value = null;
    console.log('❌ Item not saved yet');
  }
  } catch (error) {
    console.error('❌ Error checking saved status:', error);
    showTemporaryTooltip('检查状态时出错');
  } finally {
  isChecking.value = false;
  }
};

const toggleSave = async () => {
  if (isChecking.value || !isValidItem.value) return;

  console.log('🔄 Toggle save clicked, current state:', isSaved.value);

  try {
  if (isSaved.value && savedItemId.value) {
    // Remove from history
    console.log('🗑️ Removing from history:', savedItemId.value);
    await historyStore.removeHistory(savedItemId.value);
    isSaved.value = false;
    savedItemId.value = null;
    showTemporaryTooltip('已移除');
  } else {
    // Add to history
    console.log('💾 Adding to history:', props.title);
    const newItem: Omit<HistoryItem, 'id'> = {
      ...props.item,
      title: props.title,
      date: new Date().toISOString(),
    };
      
    await historyStore.addHistory(newItem);
      // Re-check status to get the new ID
    await checkSavedStatus();
    showTemporaryTooltip('已保存');
    }
  } catch (error) {
    console.error('❌ Error toggling save:', error);
    showTemporaryTooltip('操作失败，请重试');
  }
};

const showTemporaryTooltip = (text: string) => {
  console.log('💬 Showing tooltip:', text);
  tooltipText.value = text;
  showTooltip.value = true;
  clearTimeout(tooltipTimeout);
  tooltipTimeout = window.setTimeout(() => {
    showTooltip.value = false;
  }, 4000); // Extended to 4 seconds for better UX
};

const navigateToHistory = () => {
  console.log('🔗 Navigating to history page');
  showTooltip.value = false;
  router.push('/history');
};

onMounted(async () => {
  console.log('🚀 SaveButton mounted for:', props.title);
  console.log('📋 Item data:', props.item);
  
  if (!isValidItem.value) {
    console.error('❌ Invalid item data provided to SaveButton');
    return;
  }
  
  try {
    // Ensure history is loaded
  if (historyStore.historyList.length === 0) {
      console.log('📚 Loading history from storage...');
      await historyStore.fetchHistory();
    }
    
    await checkSavedStatus();
  } catch (error) {
    console.error('❌ Error during SaveButton initialization:', error);
    isChecking.value = false;
  }
});

watch(() => historyStore.historyList, () => {
  if (isValidItem.value) {
    checkSavedStatus();
  }
}, { deep: true });

// 监听 props 变化
watch(() => [props.item, props.title], () => {
  if (isValidItem.value) {
    checkSavedStatus();
  }
}, { deep: true });
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 
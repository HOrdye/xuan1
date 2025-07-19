import { defineStore } from 'pinia';
import { ref } from 'vue';
import { historyService, type HistoryItem } from '../services/historyService';

export const useHistoryStore = defineStore('history', () => {
  // --- State ---
  const historyList = ref<HistoryItem[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isInitialized = ref(false);

  // --- Actions ---

  /**
   * 从服务层获取所有历史记录并填充到状态中
   */
  const fetchHistory = async () => {
    if (isLoading.value) {
      console.log('📚 History fetch already in progress, skipping...');
      return;
    }
    
    console.log('📚 Fetching history from storage...');
    isLoading.value = true;
    error.value = null;
    
    try {
      const history = await historyService.getHistory();
      historyList.value = history;
      isInitialized.value = true;
      console.log(`✅ History loaded successfully: ${history.length} items`);
    } catch (e: any) {
      error.value = e.message || '获取历史记录失败';
      console.error('❌ Failed to fetch history:', error.value, e);
      // Fallback to empty array if loading fails
      historyList.value = [];
      isInitialized.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 添加一个新的历史记录项
   * @param item - 要添加的条目
   */
  const addHistory = async (item: Omit<HistoryItem, 'id'>) => {
    console.log('💾 Adding history item:', item.title);
    
    if (!isInitialized.value) {
      console.log('📚 History not initialized, fetching first...');
      await fetchHistory();
    }
    
    isLoading.value = true;
    error.value = null;
    
    try {
      // Validate item before adding
      if (!item.type || !item.title || !item.result) {
        throw new Error('Invalid history item: missing required fields');
      }
      
      const newItem = await historyService.addHistoryItem(item);
      console.log('✅ History item saved with ID:', newItem.id);
      
      // Add to list top for immediate UI update
      historyList.value.unshift(newItem);
      console.log(`📊 History list updated, total items: ${historyList.value.length}`);
    } catch (e: any) {
      error.value = e.message || '保存历史记录失败';
      console.error('❌ Failed to add history item:', error.value, e);
      throw e; // Re-throw to let SaveButton handle the error
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 根据ID删除一个历史记录项
   * @param id - 要删除的条目的ID
   */
  const removeHistory = async (id: string) => {
    console.log('🗑️ Removing history item:', id);
    
    isLoading.value = true;
    error.value = null;
    
    try {
      await historyService.removeHistoryItem(id);
      
      const index = historyList.value.findIndex(item => item.id === id);
      if (index !== -1) {
        historyList.value.splice(index, 1);
        console.log('✅ History item removed from store');
      } else {
        console.warn('⚠️ Item not found in store but removed from storage');
      }
      
      console.log(`📊 History list updated, total items: ${historyList.value.length}`);
    } catch (e: any) {
      error.value = e.message || '删除历史记录失败';
      console.error('❌ Failed to remove history item:', error.value, e);
      throw e; // Re-throw to let SaveButton handle the error
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * 检查一个项目是否已经存在
   * @param item - 要检查的项目
   */
  const checkIfExists = async (item: Omit<HistoryItem, 'id' | 'date' | 'title'>): Promise<boolean> => {
    try {
      if (!isInitialized.value) {
        await fetchHistory();
      }
      
      return await historyService.doesItemExist(item);
    } catch (e: any) {
      console.error('❌ Failed to check if item exists:', e);
      return false;
    }
  };

  /**
   * 强制刷新历史记录
   */
  const refreshHistory = async () => {
    console.log('🔄 Force refreshing history...');
    isInitialized.value = false;
    await fetchHistory();
  };

  /**
   * 清空错误状态
   */
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    historyList,
    isLoading,
    error,
    isInitialized,
    
    // Actions
    fetchHistory,
    addHistory,
    removeHistory,
    checkIfExists,
    refreshHistory,
    clearError,
  };
});

 

// 定义历史记录条目的类型
export interface HistoryItem {
    id: string;
    type: 'fortune' | 'jiaoBei' | 'divination' | 'tarot'; // 功能类型
    date: string; // ISO 8601 格式的日期字符串
    question?: string; // 用户提出的问题
    result: any; // 结果数据对象，具体结构取决于功能
    title: string; // 根据结果生成的简短标题
  }
  
  const HISTORY_STORAGE_KEY = 'tianxuan_history';
  
  // 模拟异步操作，为未来API调用预留空间
  const fakeAsync = <T>(data: T, delay: number = 50): Promise<T> =>
    new Promise(resolve => setTimeout(() => resolve(data), delay));
  
  // 简化的唯一ID生成器
  const simpleUUID = () => `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  // 验证历史记录项目
  const validateHistoryItem = (item: any): boolean => {
    if (!item) {
      console.error('❌ History item is null or undefined');
      return false;
    }
    
    if (!item.type || !['fortune', 'jiaoBei', 'divination', 'tarot'].includes(item.type)) {
      console.error('❌ Invalid history item type:', item.type);
      return false;
    }
    
    if (!item.title || typeof item.title !== 'string') {
      console.error('❌ Invalid or missing title in history item');
      return false;
    }
    
    if (!item.result) {
      console.error('❌ Missing result data in history item');
      return false;
    }
    
    return true;
  };
  
  // 安全的localStorage操作
  const safeLocalStorageOperation = <T>(operation: () => T, fallback: T, operationName: string): T => {
    try {
      const result = operation();
      console.log(`✅ ${operationName} successful`);
      return result;
    } catch (error) {
      console.error(`❌ ${operationName} failed:`, error);
      
      // 检查是否是存储空间问题
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('💾 LocalStorage quota exceeded');
      }
      
      return fallback;
    }
  };
  
  // --- Public API ---
  
  /**
   * 从LocalStorage获取所有历史记录
   */
  const getHistory = (): Promise<HistoryItem[]> => {
    return new Promise((resolve) => {
      const result = safeLocalStorageOperation(
        () => {
          const rawData = localStorage.getItem(HISTORY_STORAGE_KEY);
          console.log('📚 Raw localStorage data length:', rawData?.length || 0);
          
          if (!rawData) {
            console.log('📚 No existing history data found');
            return [];
          }
          
          const history: HistoryItem[] = JSON.parse(rawData);
          console.log('📚 Parsed history items count:', history.length);
          
          // 验证数据完整性
          const validHistory = history.filter((item, index) => {
            const isValid = validateHistoryItem(item);
            if (!isValid) {
              console.warn(`⚠️ Invalid history item at index ${index}:`, item);
            }
            return isValid;
          });
          
          if (validHistory.length !== history.length) {
            console.warn(`⚠️ Filtered out ${history.length - validHistory.length} invalid items`);
          }
          
          // 按日期降序排序
          const sortedHistory = validHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          return sortedHistory;
        },
        [],
        'Get history'
      );
      
      resolve(fakeAsync(result));
    });
  };
  
  /**
   * 向LocalStorage添加一条新的历史记录
   * @param item - 要添加的条目，不需要id
   */
  const addHistoryItem = (item: Omit<HistoryItem, 'id'>): Promise<HistoryItem> => {
    return new Promise((resolve, reject) => {
      // 验证输入
      if (!validateHistoryItem(item)) {
        const error = new Error('Invalid history item provided');
        console.error('❌ Validation failed for new history item:', item);
        reject(error);
        return;
      }
      
      const result = safeLocalStorageOperation(
        () => {
          console.log('💾 Adding new history item:', item.title);
          
          const rawData = localStorage.getItem(HISTORY_STORAGE_KEY);
          const currentHistory: HistoryItem[] = rawData ? JSON.parse(rawData) : [];
          
          const newItem: HistoryItem = {
            ...item,
            id: simpleUUID(),
            date: item.date || new Date().toISOString(), // 确保日期存在
          };
          
          console.log('📝 Generated ID for new item:', newItem.id);
          
          currentHistory.unshift(newItem); // 添加到数组开头
          
          const serializedData = JSON.stringify(currentHistory);
          localStorage.setItem(HISTORY_STORAGE_KEY, serializedData);
          
          console.log('✅ History item saved to localStorage');
          console.log(`📊 Total history items: ${currentHistory.length}`);
          
          return newItem;
        },
        null,
        'Add history item'
      );
      
      if (result) {
        resolve(fakeAsync(result));
      } else {
        reject(new Error('Failed to save history item to localStorage'));
      }
    });
  };
  
  /**
   * 从LocalStorage删除一条历史记录
   * @param id - 要删除的条目的ID
   */
  const removeHistoryItem = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!id || typeof id !== 'string') {
        const error = new Error('Invalid ID provided for removal');
        console.error('❌ Invalid ID for removal:', id);
        reject(error);
        return;
      }
      
      const success = safeLocalStorageOperation(
        () => {
          console.log('🗑️ Removing history item with ID:', id);
          
          const rawData = localStorage.getItem(HISTORY_STORAGE_KEY);
          if (!rawData) {
            console.log('📚 No history data found for removal');
            return true; // Not an error, just empty
          }
          
          let currentHistory: HistoryItem[] = JSON.parse(rawData);
          const initialLength = currentHistory.length;
          
          currentHistory = currentHistory.filter(item => item.id !== id);
          
          if (currentHistory.length === initialLength) {
            console.warn('⚠️ Item with ID not found for removal:', id);
            return false;
          }
          
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(currentHistory));
          
          console.log('✅ History item removed from localStorage');
          console.log(`📊 Remaining history items: ${currentHistory.length}`);
          
          return true;
        },
        false,
        'Remove history item'
      );
      
      if (success) {
        resolve(fakeAsync(undefined));
      } else {
        reject(new Error('Failed to remove history item'));
      }
    });
  };
  
  /**
   * 检查某个条目是否已存在（基于内容，改进版）
   * @param item - 要检查的条目
   */
  const doesItemExist = async (item: Omit<HistoryItem, 'id' | 'date' | 'title'>): Promise<boolean> => {
    try {
      const history = await getHistory();
      console.log('🔍 Checking existence among', history.length, 'items');
      
      // 改进的比较逻辑
      const exists = history.some(h => {
        // 基本类型检查
        if (h.type !== item.type) return false;
        
        // 问题比较（处理空值情况）
        const questionMatch = (h.question || '') === (item.question || '');
        if (!questionMatch) return false;
        
        // 结果比较（深度比较）
        try {
          const resultMatch = JSON.stringify(h.result) === JSON.stringify(item.result);
          return resultMatch;
        } catch (error) {
          console.warn('⚠️ Error comparing results:', error);
          return false;
        }
      });
      
      console.log('🔍 Item existence check result:', exists);
      return exists;
    } catch (error) {
      console.error('❌ Error checking item existence:', error);
      return false;
    }
  };
  
  export const historyService = {
    getHistory,
    addHistoryItem,
    removeHistoryItem,
    doesItemExist,
  };
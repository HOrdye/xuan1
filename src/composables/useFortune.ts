import { ref } from 'vue';
import { FortuneResult, UserFortuneData } from '../features/fortune/types';
import { generateDailyFortune } from '../features/fortune/utils/fortuneGenerator';

/**
 * 今日运势功能的组合式函数
 * 提供运势数据的获取、本地缓存和状态管理
 */
export function useFortune() {
  // 状态
  const isLoading = ref(false);
  const fortune = ref<FortuneResult | null>(null);
  const selectedDate = ref(new Date());
  
  /**
   * 格式化日期为YYYY-MM-DD格式
   * @param date 日期对象
   * @returns 格式化后的日期字符串
   */
  function formatDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }
  
  /**
   * 从本地存储获取运势数据
   * @param date 日期
   * @returns 运势数据或null
   */
  function getFromLocalStorage(date: Date): FortuneResult | null {
    const dateKey = formatDate(date);
    const storedData = localStorage.getItem(`fortune_${dateKey}`);
    
    if (storedData) {
      try {
        return JSON.parse(storedData) as FortuneResult;
      } catch (error) {
        console.error('解析存储的运势数据失败:', error);
        return null;
      }
    }
    
    return null;
  }
  
  /**
   * 保存运势数据到本地存储
   * @param data 运势数据
   */
  function saveToLocalStorage(data: FortuneResult): void {
    const dateKey = data.date;
    localStorage.setItem(`fortune_${dateKey}`, JSON.stringify(data));
  }
  
  /**
   * 获取指定日期的运势
   * @param date 日期对象，默认为今天
   * @param userData 用户数据（可选），用于个性化运势
   * @returns 运势结果Promise
   */
  async function fetchFortune(date: Date = new Date(), userData?: UserFortuneData): Promise<FortuneResult> {
    isLoading.value = true;
    selectedDate.value = date;
    
    try {
      // 先尝试从本地存储获取
      const cachedFortune = getFromLocalStorage(date);
      
      if (cachedFortune) {
        fortune.value = cachedFortune;
        return cachedFortune;
      }
      
      // 没有缓存，生成新的运势
      // 注意：实际项目中这里可能会调用API获取运势
      // 但在MVP阶段，我们直接使用本地算法生成
      const newFortune = generateDailyFortune(date, userData);
      
      // 保存到本地存储
      saveToLocalStorage(newFortune);
      
      fortune.value = newFortune;
      return newFortune;
    } catch (error) {
      console.error('获取运势失败:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  
  /**
   * 重置当前运势数据
   */
  function resetFortune(): void {
    fortune.value = null;
  }
  
  return {
    isLoading,
    fortune,
    selectedDate,
    fetchFortune,
    resetFortune
  };
} 
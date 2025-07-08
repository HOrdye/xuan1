import { ref } from 'vue';
import type { 
  FortuneResult, 
  FortuneRequest, 
  PersonalizedFortuneData
} from '../features/fortune/types/fortune';
import { FortuneGenerator } from '../features/fortune/utils/fortuneGenerator';
import { LLMService } from '../services/LLMService';

/**
 * 今日运势功能的组合式函数
 * 提供运势数据的获取、本地缓存和状态管理
 */
export function useFortune() {
  // 状态
  const loading = ref(false);
  const error = ref<string | null>(null);
  const fortune = ref<FortuneResult | null>(null);
  const selectedDate = ref(new Date());
  
  /**
   * 格式化日期为YYYY-MM-DD格式
   */
  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  /**
   * 从本地存储获取运势数据
   */
  function getFromLocalStorage(date: Date, personalData?: PersonalizedFortuneData): FortuneResult | null {
    const dateKey = formatDate(date);
    const personalKey = personalData ? JSON.stringify(personalData) : '';
    const storageKey = `fortune_${dateKey}_${personalKey}`;
    
    try {
      const storedData = localStorage.getItem(storageKey);
      if (!storedData) return null;
      
      const parsedData = JSON.parse(storedData) as FortuneResult;
      if (!parsedData.date) {
        parsedData.date = dateKey;
      }
      return parsedData;
      } catch (error) {
        console.error('解析存储的运势数据失败:', error);
        return null;
      }
  }
  
  /**
   * 保存运势数据到本地存储
   */
  function saveToLocalStorage(data: FortuneResult, personalData?: PersonalizedFortuneData): void {
    const dateKey = data.date;
    const personalKey = personalData ? JSON.stringify(personalData) : '';
    const storageKey = `fortune_${dateKey}_${personalKey}`;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('保存运势数据失败:', error);
    }
  }
  
  /**
   * 生成运势
   */
  async function generate(personalData: PersonalizedFortuneData, useAI: boolean = false): Promise<void> {
    loading.value = true;
    error.value = null;
    
    try {
      const today = new Date();
      
      // 构建请求参数
      const request: FortuneRequest = {
        birthDate: personalData.birthDate?.toISOString().split('T')[0],
        zodiacSign: personalData.zodiac?.sign,
        question: personalData.question,
        date: formatDate(today),
        gender: personalData.gender
      };

      // 检查本地缓存
      const cachedFortune = getFromLocalStorage(today, personalData);
      if (cachedFortune) {
        fortune.value = cachedFortune;
        return;
      }
      
      // 生成新的运势
      let newFortune: FortuneResult;
      
      if (useAI) {
        // 检查AI服务配置
        const config = LLMService.getConfig();
        if (!config.apiKey || !config.provider) {
          throw new Error('请先配置AI服务');
        }
        
        // 使用AI生成运势
        newFortune = await FortuneGenerator.generateFortuneWithAI(request);
      } else {
        // 使用基础生成器
        newFortune = FortuneGenerator.generateFortune(request);
      }
      
      // 保存到本地存储
      saveToLocalStorage(newFortune, personalData);
      fortune.value = newFortune;
      
    } catch (err) {
      console.error('获取运势失败:', err);
      error.value = err instanceof Error 
        ? err.message 
        : '获取运势失败，请稍后重试';
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * 重置当前运势数据
   */
  function reset(): void {
    fortune.value = null;
    error.value = null;
  }
  
  /**
   * 解锁挑战或机遇
   */
  function unlock(type: 'challenge' | 'opportunity'): void {
    if (!fortune.value) return;
    
    if (type === 'challenge' && fortune.value.dailyChallenge) {
      fortune.value.dailyChallenge.isUnlocked = true;
      saveToLocalStorage(fortune.value);
    } else if (type === 'opportunity' && fortune.value.dailyOpportunity) {
      fortune.value.dailyOpportunity.isUnlocked = true;
      saveToLocalStorage(fortune.value);
    }
  }
  
  return {
    loading,
    fortune,
    error,
    selectedDate,
    generate,
    reset,
    unlock
  } as const;
} 
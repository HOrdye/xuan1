import { ref, computed } from 'vue';
import { generateFortune } from '../utils/fortuneGenerator';
import type { FortuneResult, PersonalizedFortuneData } from '../types/fortune';

export function useFortune() {
  const fortune = ref<FortuneResult | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 计算属性：格式化日期
  const formattedDate = computed(() => {
    if (!fortune.value?.date) return '';
    try {
      return new Date(fortune.value.date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    } catch (err) {
      console.error('日期格式化错误:', err);
      return '';
    }
  });

  // 生成运势
  const generate = async (personalData: PersonalizedFortuneData, useAI: boolean = true) => {
    if (loading.value) {
      console.log('已在加载中，跳过本次调用');
      return;
    }
    loading.value = true;
    error.value = null;
    console.log('开始生成运势，输入personalData:', personalData, '使用AI:', useAI);
  
    try {
      console.log('准备调用 generateFortune', personalData, useAI);
      const result = await generateFortune(personalData, useAI);
      console.log('generateFortune 已返回', result);
  
      if (!result || !result.date) {
        throw new Error('运势生成失败');
      }
      fortune.value = result;
      console.log('fortune.value已更新:', fortune.value);
    } catch (err: any) {
      console.error('运势生成错误:', err);
      error.value = err.message || '生成运势失败';
      fortune.value = null;
    } finally {
      loading.value = false;
      console.log('generate函数执行完毕，loading:', loading.value);
    }
  };

  // 重置运势
  const reset = () => {
    fortune.value = null;
    error.value = null;
    loading.value = false;
  };

  return {
    fortune,
    loading,
    error,
    formattedDate,
    generate,
    reset
  };
} 
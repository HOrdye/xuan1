import { ref, computed } from 'vue';
import { generateFortune } from '../utils/fortuneGenerator';
import type { FortuneResult } from '../types/fortune';

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
  const generate = async (birthday?: string) => {
    if (loading.value) {
      console.log('已在加载中，跳过本次调用');
      return;
    }
    loading.value = true;
    error.value = null;
    console.log('开始生成运势，输入birthday:', birthday);
  
    try {
      let dateObj: Date;
      if (birthday) {
        console.log('收到生日字符串:', birthday);
        const [year, month, day] = birthday.split('-').map(Number);
        console.log('解析后:', { year, month, day });
        if (!year || !month || !day) {
          throw new Error('生日格式不正确，请使用 YYYY-MM-DD 格式');
        }
        dateObj = new Date(year, month - 1, day);
        console.log('生成的dateObj:', dateObj);
        if (isNaN(dateObj.getTime())) {
          throw new Error('生日日期无效');
        }
      } else {
        dateObj = new Date();
        console.log('未输入生日，使用当前日期:', dateObj);
      }
  
      console.log('准备调用 generateFortune', dateObj, birthday);
      const result = generateFortune(dateObj, birthday);
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
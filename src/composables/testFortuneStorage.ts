import { FortuneResult } from '../features/fortune/types';
import { ref } from 'vue';
import { generateDailyFortune } from '../features/fortune/utils/fortuneGenerator';

/**
 * 测试本地存储功能
 * 检查运势数据的存储和获取是否正常工作
 */
export function testFortuneStorage() {
  console.log('==== 运势存储测试开始 ====');
  
  // 辅助函数：格式化日期为YYYY-MM-DD
  function formatDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }
  
  // 辅助函数：保存运势数据到本地存储
  function saveToLocalStorage(data: FortuneResult): void {
    const dateKey = data.date;
    localStorage.setItem(`fortune_${dateKey}`, JSON.stringify(data));
    console.log(`已保存运势数据: ${dateKey}`);
  }
  
  // 辅助函数：从本地存储获取运势数据
  function getFromLocalStorage(date: Date): FortuneResult | null {
    const dateKey = formatDate(date);
    const storedData = localStorage.getItem(`fortune_${dateKey}`);
    
    if (storedData) {
      try {
        console.log(`找到缓存数据: ${dateKey}`);
        return JSON.parse(storedData) as FortuneResult;
      } catch (error) {
        console.error('解析存储的运势数据失败:', error);
        return null;
      }
    }
    
    console.log(`未找到缓存数据: ${dateKey}`);
    return null;
  }
  
  // 清理测试前的旧数据
  localStorage.removeItem('fortune_test_item');
  
  // 测试1: 存储和获取测试
  console.log('测试1: 存储和获取测试');
  
  const testDate = new Date('2023-07-15');
  const generatedFortune = generateDailyFortune(testDate);
  
  // 保存到本地存储
  saveToLocalStorage(generatedFortune);
  
  // 从本地存储获取
  const retrievedFortune = getFromLocalStorage(testDate);
  
  // 验证数据一致性
  const isSameData = JSON.stringify(generatedFortune) === JSON.stringify(retrievedFortune);
  console.log('存储和获取的数据是否一致?', isSameData ? '通过 ✅' : '失败 ❌');
  
  // 测试2: 缺失数据测试
  console.log('测试2: 缺失数据测试');
  
  const nonExistingDate = new Date('2000-01-01');
  const nullResult = getFromLocalStorage(nonExistingDate);
  
  console.log('未存储日期是否返回null?', nullResult === null ? '通过 ✅' : '失败 ❌');
  
  // 测试3: 数据覆盖测试
  console.log('测试3: 数据覆盖测试');
  
  // 更新数据
  const updatedFortune = { ...generatedFortune, energyScore: 99 };
  saveToLocalStorage(updatedFortune);
  
  // 再次获取
  const retrievedUpdated = getFromLocalStorage(testDate);
  
  // 验证更新成功
  const isUpdateSuccessful = retrievedUpdated?.energyScore === 99;
  console.log('数据更新是否成功?', isUpdateSuccessful ? '通过 ✅' : '失败 ❌');
  
  // 清理测试数据
  localStorage.removeItem(`fortune_${generatedFortune.date}`);
  
  console.log('==== 运势存储测试完成 ====');
  
  return { 
    passed: isSameData && nullResult === null && isUpdateSuccessful,
    results: [
      { name: '存储和获取测试', pass: isSameData },
      { name: '缺失数据测试', pass: nullResult === null },
      { name: '数据覆盖测试', pass: isUpdateSuccessful }
    ]
  };
} 
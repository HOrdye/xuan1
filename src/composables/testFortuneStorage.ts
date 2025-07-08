/**
 * 测试本地存储功能
 * 检查基本的存储和获取功能是否正常工作
 */
export function testFortuneStorage() {
  console.log('==== 运势存储测试开始 ====');
  
  try {
    // 测试1: 基本存储和获取测试
    console.log('测试1: 基本存储和获取测试');
    
    const testData = {
      date: '2023-07-15',
      energyScore: 75,
      description: '测试数据'
    };
    
    // 保存到本地存储
    localStorage.setItem('fortune_test', JSON.stringify(testData));
    console.log('数据已保存');
    
    // 从本地存储获取
    const retrieved = localStorage.getItem('fortune_test');
    const parsedData = retrieved ? JSON.parse(retrieved) : null;
    
    // 验证数据一致性
    const isSameData = JSON.stringify(testData) === JSON.stringify(parsedData);
    console.log('存储和获取的数据是否一致?', isSameData ? '通过 ✅' : '失败 ❌');
    
    // 测试2: 缺失数据测试
    console.log('测试2: 缺失数据测试');
    
    const nonExistingData = localStorage.getItem('fortune_nonexisting');
    const isNull = nonExistingData === null;
    console.log('未存储数据是否返回null?', isNull ? '通过 ✅' : '失败 ❌');
    
    // 测试3: 数据覆盖测试
    console.log('测试3: 数据覆盖测试');
    
    const updatedData = { ...testData, energyScore: 99 };
    localStorage.setItem('fortune_test', JSON.stringify(updatedData));
    
    const retrievedUpdated = localStorage.getItem('fortune_test');
    const parsedUpdated = retrievedUpdated ? JSON.parse(retrievedUpdated) : null;
    
    const isUpdateSuccessful = parsedUpdated?.energyScore === 99;
    console.log('数据更新是否成功?', isUpdateSuccessful ? '通过 ✅' : '失败 ❌');
    
    // 清理测试数据
    localStorage.removeItem('fortune_test');
    
    console.log('==== 运势存储测试完成 ====');
    
    return { 
      passed: isSameData && isNull && isUpdateSuccessful,
      results: [
        { name: '存储和获取测试', pass: isSameData },
        { name: '缺失数据测试', pass: isNull },
        { name: '数据覆盖测试', pass: isUpdateSuccessful }
      ]
    };
  } catch (error) {
    console.error('❌ 运势存储测试过程中发生错误:', error);
    return {
      passed: false,
      results: [
        { name: '测试执行', pass: false }
      ]
    };
  }
} 
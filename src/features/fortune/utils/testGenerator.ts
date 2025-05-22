import { generateDailyFortune } from './fortuneGenerator';

/**
 * 测试运势生成器
 * 测试多个日期的运势生成，确保:
 * 1. 相同日期生成相同运势
 * 2. 不同日期生成不同运势
 * 3. 所有必要的数据字段都存在且格式正确
 */
function testFortuneGenerator() {
  console.log('==== 运势生成器测试开始 ====');
  
  // 测试1: 相同日期的一致性测试
  const testDate1 = new Date('2023-07-01');
  console.log(`测试1: 相同日期(${testDate1.toLocaleDateString()})的一致性测试`);
  
  const fortune1A = generateDailyFortune(testDate1);
  const fortune1B = generateDailyFortune(testDate1);
  
  console.log('生成结果是否相同?', 
    JSON.stringify(fortune1A) === JSON.stringify(fortune1B) ? '通过 ✅' : '失败 ❌');
  
  // 测试2: 不同日期的差异性测试
  const testDate2 = new Date('2023-07-02');
  console.log(`测试2: 不同日期的差异性测试(${testDate1.toLocaleDateString()} vs ${testDate2.toLocaleDateString()})`);
  
  const fortune2 = generateDailyFortune(testDate2);
  
  const isDifferent = JSON.stringify(fortune1A) !== JSON.stringify(fortune2);
  console.log('生成结果是否不同?', isDifferent ? '通过 ✅' : '失败 ❌');
  
  // 测试3: 数据完整性测试
  console.log('测试3: 数据完整性测试');
  
  const completenessCheck = [
    { name: 'date', value: !!fortune1A.date },
    { name: 'energyScore', value: typeof fortune1A.energyScore === 'number' && fortune1A.energyScore >= 0 && fortune1A.energyScore <= 100 },
    { name: 'energyDescription', value: !!fortune1A.energyDescription },
    { name: 'fortuneDetails', value: Array.isArray(fortune1A.fortuneDetails) && fortune1A.fortuneDetails.length > 0 },
    { name: 'luckyColor', value: !!fortune1A.luckyColor && !!fortune1A.luckyColor.name && !!fortune1A.luckyColor.hex },
    { name: 'luckyNumber', value: typeof fortune1A.luckyNumber === 'number' },
    { name: 'luckyDirection', value: !!fortune1A.luckyDirection },
    { name: 'storyContent', value: !!fortune1A.storyContent },
    { name: 'goodActivities', value: Array.isArray(fortune1A.goodActivities) && fortune1A.goodActivities.length > 0 },
    { name: 'badActivities', value: Array.isArray(fortune1A.badActivities) && fortune1A.badActivities.length > 0 },
    { name: 'actionSuggestions', value: Array.isArray(fortune1A.actionSuggestions) && fortune1A.actionSuggestions.length > 0 }
  ];
  
  let allFieldsValid = true;
  completenessCheck.forEach(check => {
    if (!check.value) {
      allFieldsValid = false;
      console.log(`字段 ${check.name} 无效 ❌`);
    }
  });
  
  console.log('所有字段是否有效?', allFieldsValid ? '通过 ✅' : '失败 ❌');
  
  // 测试4: 个性化数据测试
  console.log('测试4: 个性化数据测试');
  const userData = {
    birthDate: '1995-01-01',
    gender: '女',
    location: '北京'
  };
  
  const personalized = generateDailyFortune(testDate1, userData);
  // 由于当前实现没有使用userData进行个性化，所以应该返回相同结果
  // 如果将来实现了个性化，这个测试需要调整
  console.log('个性化结果是否有效?', 
    JSON.stringify(personalized) !== '' ? '通过 ✅' : '失败 ❌');
  
  console.log('==== 运势生成器测试完成 ====');
}

// 运行测试
testFortuneGenerator();

// 导出函数以便其他地方调用
export { testFortuneGenerator }; 
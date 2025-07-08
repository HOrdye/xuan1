import { generateFortune } from './fortuneGenerator';
import type { PersonalizedFortuneData } from '../types/fortune';

/**
 * 测试运势生成器
 * 测试运势生成功能，确保:
 * 1. 基本功能正常工作
 * 2. 所有必要的数据字段都存在且格式正确
 * 3. 不同的输入产生合理的输出
 */
async function testFortuneGenerator() {
  console.log('==== 运势生成器测试开始 ====');
  
  try {
    // 测试1: 基本功能测试
    const testData1: PersonalizedFortuneData = {
      birthDate: new Date('1995-01-01'),
      gender: 'female',
      question: '今天运势怎么样？'
    };
    console.log(`测试1: 基本功能测试`);
    
    const fortune1 = await generateFortune(testData1, false); // 不使用AI确保稳定性
    console.log('基本功能是否正常?', fortune1 ? '通过 ✅' : '失败 ❌');
    
    // 测试2: 不同参数的差异性测试
    const testData2: PersonalizedFortuneData = {
      birthDate: new Date('1990-06-15'),
      gender: 'male',
      question: '工作发展如何？'
    };
    console.log(`测试2: 不同参数的差异性测试`);
    
    const fortune2 = await generateFortune(testData2, false);
    const isDifferent = JSON.stringify(fortune1) !== JSON.stringify(fortune2);
    console.log('不同参数生成结果是否不同?', isDifferent ? '通过 ✅' : '失败 ❌');
    
    // 测试3: 数据完整性测试
    console.log('测试3: 数据完整性测试');
    
    const completenessCheck = [
      { name: 'date', value: !!fortune1.date },
      { name: 'overall', value: !!fortune1.overall && typeof fortune1.overall.energyScore === 'number' },
      { name: 'career', value: !!fortune1.career && typeof fortune1.career.energyScore === 'number' },
      { name: 'wealth', value: !!fortune1.wealth && typeof fortune1.wealth.energyScore === 'number' },
      { name: 'love', value: !!fortune1.love && typeof fortune1.love.energyScore === 'number' },
      { name: 'health', value: !!fortune1.health && typeof fortune1.health.energyScore === 'number' },
      { name: 'luckyElements', value: !!fortune1.luckyElements && !!fortune1.luckyElements.color },
      { name: 'tips', value: !!fortune1.tips && Array.isArray(fortune1.tips.do) },
      { name: 'advice', value: Array.isArray(fortune1.advice) },
      { name: 'aspects', value: !!fortune1.aspects && !!fortune1.aspects.career }
    ];
    
    let allFieldsValid = true;
    completenessCheck.forEach(check => {
      if (!check.value) {
        allFieldsValid = false;
        console.log(`字段 ${check.name} 无效 ❌`);
      } else {
        console.log(`字段 ${check.name} 有效 ✅`);
      }
    });
    
    console.log('所有字段是否有效?', allFieldsValid ? '通过 ✅' : '失败 ❌');
    
    // 测试4: AI功能测试（如果配置了的话）
    console.log('测试4: AI功能测试');
    try {
      const fortuneAI = await generateFortune(testData1, true);
      console.log('AI增强功能是否正常?', fortuneAI ? '通过 ✅' : '失败 ❌');
    } catch (error) {
      console.log('AI功能测试结果: 未配置AI或AI调用失败（这是正常的）⚠️');
    }
    
    console.log('==== 运势生成器测试完成 ====');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 导出函数以便其他地方调用
export { testFortuneGenerator }; 
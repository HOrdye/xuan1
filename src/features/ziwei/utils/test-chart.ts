/**
 * 紫微斗数排盘测试
 * 用于验证排盘算法的正确性
 */

import { ZiweiChartCalculator } from './chartCalculator';
import type { BirthInfo } from '../types';

/**
 * 测试用例
 */
const testCases: Array<{ name: string; birthInfo: BirthInfo }> = [
  {
    name: '测试用例1：1990年1月1日子时男',
    birthInfo: {
      year: 1990,
      month: 1,
      day: 1,
      hour: 0,
      gender: 'male'
    }
  },
  {
    name: '测试用例2：1995年6月15日午时女',
    birthInfo: {
      year: 1995,
      month: 6,
      day: 15,
      hour: 6,
      gender: 'female'
    }
  }
];

/**
 * 运行测试
 */
export function runChartTests() {
  console.log('🧪 开始测试紫微斗数排盘算法...\n');
  
  const calculator = new ZiweiChartCalculator();
  
  testCases.forEach((testCase, index) => {
    console.log(`\n📋 ${testCase.name}`);
    console.log('─'.repeat(50));
    
    try {
      const chart = calculator.calculate(testCase.birthInfo);
      
      console.log(`✅ 排盘成功`);
      console.log(`   五行局: ${chart.wuxingJu}`);
      console.log(`   命宫主星: ${chart.mingGong.stars.map(s => s.name).join('、') || '空宫'}`);
      console.log(`   格局数量: ${chart.patterns.length}`);
      if (chart.patterns.length > 0) {
        console.log(`   格局: ${chart.patterns.map(p => p.name).join('、')}`);
      }
      console.log(`   大限数量: ${chart.daxian.length}`);
      console.log(`   第一个大限: ${chart.daxian[0]?.startAge}-${chart.daxian[0]?.endAge}岁`);
      
      // 验证基本数据
      if (chart.palaces.length !== 12) {
        console.error(`   ❌ 错误：宫位数量不正确，应为12个，实际${chart.palaces.length}个`);
      } else {
        console.log(`   ✅ 宫位数量正确：12个`);
      }
      
      if (!chart.mingGong) {
        console.error(`   ❌ 错误：命宫不存在`);
      } else {
        console.log(`   ✅ 命宫存在：${chart.mingGong.name}`);
      }
      
    } catch (error: any) {
      console.error(`   ❌ 排盘失败: ${error.message}`);
      console.error(error.stack);
    }
  });
  
  console.log('\n✨ 测试完成！');
}

// 如果在Node环境中运行
if (typeof window === 'undefined') {
  runChartTests();
}


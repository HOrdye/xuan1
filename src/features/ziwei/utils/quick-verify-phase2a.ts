/**
 * Phase 2A 快速验证脚本
 * 验证关键功能是否正确实现
 */

import { placeSuiqianTwelve } from './auxiliaryStars';
import { calculateLiunianInfo } from './liunianCalculator';
import { ZiweiChartCalculator } from './chartCalculator';
import type { BirthInfo } from '../types';

console.log('🔍 Phase 2A 功能快速验证\n');
console.log('='.repeat(50));

// 验证1: 流年岁前十二星函数是否存在
console.log('\n1️⃣ 验证流年岁前十二星函数...');
try {
  const stars = placeSuiqianTwelve('子');
  const palaceCount = Object.keys(stars).length;
  if (palaceCount === 12) {
    console.log('   ✅ 函数存在且正常工作');
    console.log(`   ✅ 安放了${palaceCount}个宫位的星曜`);
    
    // 检查岁建位置
    if (stars[0] && stars[0].includes('岁建')) {
      console.log('   ✅ 岁建在正确位置（子宫）');
    } else {
      console.log('   ❌ 岁建位置错误');
    }
  } else {
    console.log(`   ❌ 宫位数量错误: 期望12，实际${palaceCount}`);
  }
} catch (error: any) {
  console.log(`   ❌ 函数调用失败: ${error.message}`);
}

// 验证2: 流年信息是否包含岁前十二星
console.log('\n2️⃣ 验证流年信息包含岁前十二星...');
try {
  const liunian = calculateLiunianInfo(2024);
  if (liunian.suiqianStars) {
    const suiqianCount = Object.keys(liunian.suiqianStars).length;
    if (suiqianCount === 12) {
      console.log('   ✅ 流年信息包含岁前十二星');
      console.log(`   ✅ 岁前十二星分布在${suiqianCount}个宫位`);
    } else {
      console.log(`   ❌ 岁前十二星数量错误: 期望12，实际${suiqianCount}`);
    }
  } else {
    console.log('   ❌ 流年信息缺少suiqianStars字段');
  }
} catch (error: any) {
  console.log(`   ❌ 流年信息计算失败: ${error.message}`);
}

// 验证3: 大限四化飞星
console.log('\n3️⃣ 验证大限四化飞星...');
try {
  const calculator = new ZiweiChartCalculator();
  const birthInfo: BirthInfo = {
    year: 1990,
    month: 5,
    day: 15,
    hour: 8,
    gender: 'male'
  };
  
  const chart = calculator.calculate(birthInfo);
  
  if (chart.daxian && chart.daxian.length > 0) {
    let feixingCount = 0;
    for (const daxian of chart.daxian) {
      if (daxian.feixing) {
        feixingCount++;
        
        // 验证飞星结构
        if (daxian.feixing.lu && daxian.feixing.quan && daxian.feixing.ke && daxian.feixing.ji) {
          // 结构正确
        } else {
          console.log(`   ❌ 大限${daxian.startAge}-${daxian.endAge}岁: 飞星结构不完整`);
        }
      }
    }
    
    if (feixingCount > 0) {
      console.log(`   ✅ ${feixingCount}个大限包含四化飞星数据`);
    } else {
      console.log('   ❌ 没有大限包含四化飞星数据');
    }
  } else {
    console.log('   ❌ 大限数据为空');
  }
} catch (error: any) {
  console.log(`   ❌ 排盘计算失败: ${error.message}`);
}

// 验证4: 流年流月流日信息
console.log('\n4️⃣ 验证流年流月流日信息...');
try {
  const calculator = new ZiweiChartCalculator();
  const birthInfo: BirthInfo = {
    year: 1990,
    month: 5,
    day: 15,
    hour: 8,
    gender: 'male'
  };
  
  const chart = calculator.calculate(birthInfo);
  
  if (chart.liunian && chart.liumonth && chart.liuday) {
    console.log('   ✅ 命盘包含流年流月流日信息');
    console.log(`   ✅ 流年: ${chart.liunian.year}年 (${chart.liunian.tiangan}${chart.liunian.dizhi})`);
    console.log(`   ✅ 流月: ${chart.liumonth.year}年${chart.liumonth.month}月 (${chart.liumonth.tiangan}${chart.liumonth.dizhi})`);
    console.log(`   ✅ 流日: ${chart.liuday.year}年${chart.liuday.month}月${chart.liuday.day}日 (${chart.liuday.tiangan}${chart.liuday.dizhi})`);
  } else {
    console.log('   ❌ 命盘缺少流年流月流日信息');
  }
} catch (error: any) {
  console.log(`   ❌ 验证失败: ${error.message}`);
}

console.log('\n' + '='.repeat(50));
console.log('✅ 验证完成！');
console.log('\n💡 提示: 请在浏览器中手动测试UI时间选择器功能');





/**
 * Phase 2A 排盘算法完善功能测试
 * 测试流年岁前十二星、大限四化飞星、时间选择器相关功能
 */

import { ZiweiChartCalculator } from './chartCalculator';
import { placeSuiqianTwelve } from './auxiliaryStars';
import { calculateLiunianInfo, calculateLiumonthInfo, calculateLiudayInfo } from './liunianCalculator';
import { calculateSihuaFeixing } from './sihuaFeixingCalculator';
import type { BirthInfo, Dizhi } from '../types';

/**
 * 测试结果接口
 */
interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

/**
 * Phase 2A 测试套件
 */
export class Phase2ATestSuite {
  private results: TestResult[] = [];

  /**
   * 运行所有测试
   */
  runAllTests(): TestResult[] {
    console.log('🧪 开始Phase 2A功能测试...\n');

    this.results = [];

    // 1. 测试流年岁前十二星安放算法
    this.testSuiqianTwelve();

    // 2. 测试流年流月流日算法
    this.testLiunianAlgorithms();

    // 3. 测试大限四化飞星计算
    this.testDaxianFeixing();

    // 4. 测试完整排盘流程（包含新功能）
    this.testCompleteChartCalculation();

    // 打印测试结果
    this.printResults();

    return this.results;
  }

  /**
   * 测试流年岁前十二星安放算法
   */
  private testSuiqianTwelve() {
    console.log('📋 测试1: 流年岁前十二星安放算法');

    try {
      // 测试不同流年地支
      const testCases: Dizhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

      for (const dizhi of testCases) {
        const stars = placeSuiqianTwelve(dizhi);

        // 验证：应该有12个宫位有星曜
        const palaceCount = Object.keys(stars).length;
        if (palaceCount !== 12) {
          this.addResult('流年岁前十二星安放', false, `流年地支${dizhi}: 应该有12个宫位，实际${palaceCount}个`);
          continue;
        }

        // 验证：岁建应该在流年地支所在宫位
        const dizhiList: Dizhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        const suijianIndex = dizhiList.indexOf(dizhi);
        if (!stars[suijianIndex] || !stars[suijianIndex].includes('岁建')) {
          this.addResult('流年岁前十二星安放', false, `流年地支${dizhi}: 岁建应该在宫位${suijianIndex}`);
          continue;
        }

        // 验证：应该有12颗不同的星
        const allStars: string[] = [];
        for (const palaceStars of Object.values(stars)) {
          allStars.push(...palaceStars);
        }
        const uniqueStars = Array.from(new Set(allStars));
        if (uniqueStars.length !== 12) {
          this.addResult('流年岁前十二星安放', false, `流年地支${dizhi}: 应该有12颗不同的星，实际${uniqueStars.length}颗`);
          continue;
        }
      }

      this.addResult('流年岁前十二星安放', true, '所有测试用例通过');
    } catch (error: any) {
      this.addResult('流年岁前十二星安放', false, `测试失败: ${error.message}`);
    }
  }

  /**
   * 测试流年流月流日算法
   */
  private testLiunianAlgorithms() {
    console.log('📋 测试2: 流年流月流日算法');

    try {
      // 测试2024年
      const year = 2024;
      const month = 6;
      const day = 15;

      // 测试流年信息
      const liunian = calculateLiunianInfo(year);
      if (!liunian || !liunian.tiangan || !liunian.dizhi || !liunian.sihua) {
        this.addResult('流年算法', false, '流年信息不完整');
        return;
      }

      // 验证流年岁前十二星
      if (!liunian.suiqianStars) {
        this.addResult('流年算法', false, '流年信息缺少岁前十二星');
        return;
      }

      const suiqianCount = Object.keys(liunian.suiqianStars).length;
      if (suiqianCount !== 12) {
        this.addResult('流年算法', false, `流年岁前十二星应该有12个宫位，实际${suiqianCount}个`);
        return;
      }

      // 测试流月信息
      const liumonth = calculateLiumonthInfo(year, month);
      if (!liumonth || !liumonth.tiangan || !liumonth.dizhi || !liumonth.sihua) {
        this.addResult('流月算法', false, '流月信息不完整');
        return;
      }

      // 测试流日信息
      const liuday = calculateLiudayInfo(year, month, day);
      if (!liuday || !liuday.tiangan || !liuday.dizhi || !liuday.sihua) {
        this.addResult('流日算法', false, '流日信息不完整');
        return;
      }

      this.addResult('流年流月流日算法', true, `测试通过: 2024年6月15日 - 流年${liunian.tiangan}${liunian.dizhi}, 流月${liumonth.tiangan}${liumonth.dizhi}, 流日${liuday.tiangan}${liuday.dizhi}`);
    } catch (error: any) {
      this.addResult('流年流月流日算法', false, `测试失败: ${error.message}`);
    }
  }

  /**
   * 测试大限四化飞星计算
   */
  private testDaxianFeixing() {
    console.log('📋 测试3: 大限四化飞星计算');

    try {
      // 创建一个测试命盘
      const calculator = new ZiweiChartCalculator();
      const birthInfo: BirthInfo = {
        year: 1990,
        month: 5,
        day: 15,
        hour: 8,
        gender: 'male'
      };

      const chart = calculator.calculate(birthInfo);

      // 验证大限数据
      if (!chart.daxian || chart.daxian.length === 0) {
        this.addResult('大限四化飞星', false, '大限数据为空');
        return;
      }

      // 检查每个大限是否有四化飞星
      let feixingCount = 0;
      for (const daxian of chart.daxian) {
        if (daxian.feixing) {
          feixingCount++;

          // 验证飞星结果结构
          if (!daxian.feixing.lu || !daxian.feixing.quan || !daxian.feixing.ke || !daxian.feixing.ji) {
            this.addResult('大限四化飞星', false, `大限${daxian.startAge}-${daxian.endAge}岁: 飞星结果结构不完整`);
            return;
          }
        }
      }

      if (feixingCount === 0) {
        this.addResult('大限四化飞星', false, '没有大限包含四化飞星数据');
        return;
      }

      this.addResult('大限四化飞星', true, `测试通过: ${feixingCount}个大限包含四化飞星数据`);
    } catch (error: any) {
      this.addResult('大限四化飞星', false, `测试失败: ${error.message}`);
    }
  }

  /**
   * 测试完整排盘流程（包含新功能）
   */
  private testCompleteChartCalculation() {
    console.log('📋 测试4: 完整排盘流程（包含新功能）');

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

      // 验证基础数据
      if (!chart.palaces || chart.palaces.length !== 12) {
        this.addResult('完整排盘流程', false, '宫位数量不正确');
        return;
      }

      // 验证流年流月流日信息
      if (!chart.liunian || !chart.liumonth || !chart.liuday) {
        this.addResult('完整排盘流程', false, '流年流月流日信息缺失');
        return;
      }

      // 验证流年岁前十二星
      if (!chart.liunian.suiqianStars) {
        this.addResult('完整排盘流程', false, '流年岁前十二星缺失');
        return;
      }

      // 验证大限四化飞星
      if (!chart.daxian || chart.daxian.length === 0) {
        this.addResult('完整排盘流程', false, '大限数据缺失');
        return;
      }

      let hasFeixing = false;
      for (const daxian of chart.daxian) {
        if (daxian.feixing) {
          hasFeixing = true;
          break;
        }
      }

      if (!hasFeixing) {
        this.addResult('完整排盘流程', false, '大限四化飞星缺失');
        return;
      }

      this.addResult('完整排盘流程', true, '所有新功能已正确集成到排盘流程中');
    } catch (error: any) {
      this.addResult('完整排盘流程', false, `测试失败: ${error.message}`);
    }
  }

  /**
   * 添加测试结果
   */
  private addResult(name: string, passed: boolean, message: string, details?: any) {
    this.results.push({
      name,
      passed,
      message,
      details
    });

    const icon = passed ? '✅' : '❌';
    console.log(`  ${icon} ${name}: ${message}`);
    if (details) {
      console.log(`     详情:`, details);
    }
  }

  /**
   * 打印测试结果摘要
   */
  private printResults() {
    console.log('\n📊 测试结果摘要:');
    console.log('='.repeat(50));

    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const percentage = ((passed / total) * 100).toFixed(1);

    console.log(`总计: ${total} 个测试`);
    console.log(`通过: ${passed} 个`);
    console.log(`失败: ${total - passed} 个`);
    console.log(`通过率: ${percentage}%`);

    if (passed === total) {
      console.log('\n🎉 所有测试通过！');
    } else {
      console.log('\n⚠️ 部分测试失败，请检查上述错误信息');
    }

    console.log('='.repeat(50));
  }
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
  const suite = new Phase2ATestSuite();
  suite.runAllTests();
}


/**
 * P0阶段功能测试
 * 测试所有已实现的核心功能
 */

import { ZiweiChartCalculator } from './chartCalculator';
import type { BirthInfo } from '../types';
import { locateMingGongDizhi, calculatePalaceDizhi, getDizhiWuxing, getDizhiYinyang } from './dizhiCalculator';
import { calculateMingGongTiangan, calculateAllGonggan, getTianganDizhi } from './gongganCalculator';
import { calculateChangsheng, getChangshengDescription } from './changshengCalculator';
import { calculateMingZhu, calculateShenZhu, getMingZhuDescription, getShenZhuDescription } from './mingzhuCalculator';
import { calculateStarBrightness, getBrightnessDescription, getBrightnessLevel } from './brightnessCalculator';
import { getAllStars, getAllStarNames, getStarByName, getMainStar, getAuxiliaryStar } from '../data/stars';

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
 * 测试套件
 */
export class Phase1TestSuite {
  private results: TestResult[] = [];

  /**
   * 运行所有测试
   */
  runAllTests(): TestResult[] {
    console.log('🧪 开始P0阶段功能测试...\n');
    
    this.results = [];
    
    // 1. 测试地支系统
    this.testDizhiSystem();
    
    // 2. 测试宫干系统
    this.testGongganSystem();
    
    // 3. 测试长生十二神系统
    this.testChangshengSystem();
    
    // 4. 测试命主身主系统
    this.testMingzhuSystem();
    
    // 5. 测试庙旺陷系统
    this.testBrightnessSystem();
    
    // 6. 测试星曜数据库
    this.testStarDatabase();
    
    // 7. 测试完整排盘算法
    this.testFullChartCalculation();
    
    // 打印测试结果
    this.printResults();
    
    return this.results;
  }

  /**
   * 测试地支系统
   */
  private testDizhiSystem() {
    console.log('📍 测试地支系统...');
    
    try {
      // 测试1: 命宫地支定位
      const testCases: Array<{ hour: number; expected: import('../types').Dizhi }> = [
        { hour: 0, expected: '子' },
        { hour: 7, expected: '辰' },
        { hour: 12, expected: '午' },
        { hour: 23, expected: '子' }
      ];
      
      let passed = true;
      const details: any[] = [];
      
      for (const testCase of testCases) {
        const result = locateMingGongDizhi(testCase.hour);
        const isCorrect = result === testCase.expected;
        passed = passed && isCorrect;
        details.push({
          hour: testCase.hour,
          expected: testCase.expected,
          actual: result,
          passed: isCorrect
        });
      }
      
      // 测试2: 宫位地支计算
      const mingGongDizhi = locateMingGongDizhi(7); // 辰时
      const palaceDizhiList = calculatePalaceDizhi(mingGongDizhi);
      const isPalaceDizhiCorrect = palaceDizhiList.length === 12 && palaceDizhiList[0] === '辰';
      passed = passed && isPalaceDizhiCorrect;
      
      // 测试3: 地支属性查询
      const wuxing = getDizhiWuxing('子');
      const yinyang = getDizhiYinyang('子');
      const isAttributeCorrect = wuxing === '水' && yinyang === '阳';
      passed = passed && isAttributeCorrect;
      
      this.addResult('地支系统', passed, '地支计算和属性查询', {
        testCases: details,
        palaceDizhiList,
        attributes: { wuxing, yinyang }
      });
    } catch (error: any) {
      this.addResult('地支系统', false, `测试失败: ${error.message}`, { error });
    }
  }

  /**
   * 测试宫干系统
   */
  private testGongganSystem() {
    console.log('📍 测试宫干系统...');
    
    try {
      // 测试1: 命宫天干计算
      const yearStem: import('../types').Tiangan = '乙'; // 1989年是己年，但这里测试用乙年
      const mingGongDizhi: import('../types').Dizhi = '申';
      const mingGongTiangan = calculateMingGongTiangan(yearStem, mingGongDizhi);
      const isMingGongCorrect = typeof mingGongTiangan === 'string' && mingGongTiangan.length === 1;
      
      // 测试2: 所有宫位天干计算
      const palaceDizhiList = calculatePalaceDizhi(mingGongDizhi);
      const palaceTianganList = calculateAllGonggan(mingGongTiangan, mingGongDizhi, palaceDizhiList);
      const isAllGongganCorrect = palaceTianganList.length === 12;
      
      // 测试3: 天干地支组合
      const tianganDizhi = getTianganDizhi(mingGongTiangan, mingGongDizhi);
      const isCombinationCorrect = tianganDizhi.length === 2;
      
      const passed = isMingGongCorrect && isAllGongganCorrect && isCombinationCorrect;
      
      this.addResult('宫干系统', passed, '宫干计算和组合', {
        mingGongTiangan,
        palaceTianganList,
        tianganDizhi
      });
    } catch (error: any) {
      this.addResult('宫干系统', false, `测试失败: ${error.message}`, { error });
    }
  }

  /**
   * 测试长生十二神系统
   */
  private testChangshengSystem() {
    console.log('📍 测试长生十二神系统...');
    
    try {
      const wuxingJu = '金四局' as const;
      const mingGongDizhi: import('../types').Dizhi = '申';
      const palaceDizhiList = calculatePalaceDizhi(mingGongDizhi);
      
      // 测试1: 长生十二神计算
      const changshengMap = calculateChangsheng(wuxingJu, mingGongDizhi, palaceDizhiList);
      const isChangshengCorrect = Object.keys(changshengMap).length === 12;
      
      // 测试2: 长生十二神说明
      const description = getChangshengDescription('长生');
      const isDescriptionCorrect = typeof description === 'string' && description.length > 0;
      
      const passed = isChangshengCorrect && isDescriptionCorrect;
      
      this.addResult('长生十二神系统', passed, '长生十二神计算和说明', {
        changshengMap,
        description
      });
    } catch (error: any) {
      this.addResult('长生十二神系统', false, `测试失败: ${error.message}`, { error });
    }
  }

  /**
   * 测试命主身主系统
   */
  private testMingzhuSystem() {
    console.log('📍 测试命主身主系统...');
    
    try {
      // 测试1: 命主星计算
      const mingGongDizhi: import('../types').Dizhi = '申';
      const mingZhu = calculateMingZhu(mingGongDizhi);
      const isMingZhuCorrect = typeof mingZhu === 'string' && mingZhu.length > 0;
      
      // 测试2: 身主星计算
      const birthHour = 7;
      const shenZhu = calculateShenZhu(birthHour);
      const isShenZhuCorrect = typeof shenZhu === 'string' && shenZhu.length > 0;
      
      // 测试3: 说明查询
      const mingZhuDesc = getMingZhuDescription(mingZhu);
      const shenZhuDesc = getShenZhuDescription(shenZhu);
      const isDescriptionCorrect = mingZhuDesc.length > 0 && shenZhuDesc.length > 0;
      
      const passed = isMingZhuCorrect && isShenZhuCorrect && isDescriptionCorrect;
      
      this.addResult('命主身主系统', passed, '命主身主计算和说明', {
        mingZhu,
        shenZhu,
        mingZhuDesc,
        shenZhuDesc
      });
    } catch (error: any) {
      this.addResult('命主身主系统', false, `测试失败: ${error.message}`, { error });
    }
  }

  /**
   * 测试庙旺陷系统
   */
  private testBrightnessSystem() {
    console.log('📍 测试庙旺陷系统...');
    
    try {
      // 测试1: 主星庙旺陷计算
      const testCases: Array<{ starName: string; dizhi: import('../types').Dizhi; expected: import('../types').StarBrightness }> = [
        { starName: '紫微', dizhi: '子', expected: '庙' },
        { starName: '太阳', dizhi: '午', expected: '庙' },
        { starName: '太阴', dizhi: '子', expected: '庙' }
      ];
      
      let passed = true;
      const details: any[] = [];
      
      for (const testCase of testCases) {
        const brightness = calculateStarBrightness(testCase.starName, testCase.dizhi);
        const isCorrect = brightness === testCase.expected;
        passed = passed && isCorrect;
        details.push({
          starName: testCase.starName,
          dizhi: testCase.dizhi,
          expected: testCase.expected,
          actual: brightness,
          passed: isCorrect
        });
      }
      
      // 测试2: 辅星庙旺陷计算
      const auxBrightness = calculateStarBrightness('文昌', '子');
      const isAuxCorrect = typeof auxBrightness === 'string';
      passed = passed && isAuxCorrect;
      
      // 测试3: 庙旺陷说明和等级
      const description = getBrightnessDescription('庙');
      const level = getBrightnessLevel('庙');
      const isToolCorrect = description.length > 0 && level === 5;
      passed = passed && isToolCorrect;
      
      this.addResult('庙旺陷系统', passed, '庙旺陷计算和工具函数', {
        testCases: details,
        auxBrightness,
        description,
        level
      });
    } catch (error: any) {
      this.addResult('庙旺陷系统', false, `测试失败: ${error.message}`, { error });
    }
  }

  /**
   * 测试星曜数据库
   */
  private testStarDatabase() {
    console.log('📍 测试星曜数据库...');
    
    try {
      // 测试1: 获取所有星曜
      const allStars = getAllStars();
      const allStarNames = getAllStarNames();
      const isCountCorrect = allStars.length >= 70 && allStarNames.length >= 70;
      
      // 测试2: 主星查询
      const ziwei = getMainStar('紫微');
      const isMainStarCorrect = ziwei !== undefined && ziwei.name === '紫微';
      
      // 测试3: 辅星查询
      const wenchang = getAuxiliaryStar('文昌');
      const isAuxStarCorrect = wenchang !== undefined && wenchang.name === '文昌';
      
      // 测试4: 统一查询接口
      const star = getStarByName('紫微');
      const isUnifiedCorrect = star !== undefined && star.name === '紫微';
      
      // 测试5: 检查新增星曜
      const newStars = ['禄存', '天马', '红鸾', '博士', '岁建'];
      const hasNewStars = newStars.every(name => getStarByName(name) !== undefined);
      
      const passed = isCountCorrect && isMainStarCorrect && isAuxStarCorrect && isUnifiedCorrect && hasNewStars;
      
      this.addResult('星曜数据库', passed, '星曜数据库查询和扩展', {
        totalStars: allStars.length,
        totalNames: allStarNames.length,
        ziwei: ziwei?.name,
        wenchang: wenchang?.name,
        newStarsCheck: hasNewStars
      });
    } catch (error: any) {
      this.addResult('星曜数据库', false, `测试失败: ${error.message}`, { error });
    }
  }

  /**
   * 测试完整排盘算法
   */
  private testFullChartCalculation() {
    console.log('📍 测试完整排盘算法...');
    
    try {
      // 测试用例：1989年12月11日 7时（辰时）
      const birthInfo: BirthInfo = {
        year: 1989,
        month: 12,
        day: 11,
        hour: 7,
        gender: 'male'
      };
      
      const calculator = new ZiweiChartCalculator();
      const chart = calculator.calculate(birthInfo);
      
      // 测试1: 基本结构
      const hasBasicStructure = 
        chart.palaces !== undefined &&
        chart.palaces.length === 12 &&
        chart.mingGong !== undefined &&
        chart.shenGong !== undefined;
      
      // 测试2: 地支系统
      const hasDizhi = chart.palaces.every(p => p.dizhi !== undefined);
      
      // 测试3: 宫干系统
      const hasTiangan = chart.palaces.every(p => p.tiangan !== undefined);
      
      // 测试4: 长生十二神
      const hasChangsheng = chart.palaces.some(p => p.changsheng !== undefined);
      
      // 测试5: 命主身主
      const hasMingZhu = chart.mingZhu !== undefined && chart.mingZhu.length > 0;
      const hasShenZhu = chart.shenZhu !== undefined && chart.shenZhu.length > 0;
      
      // 测试6: 庙旺陷
      const hasBrightness = chart.palaces.some(p => 
        p.stars.length > 0 && p.stars.some(s => s.brightness !== undefined)
      );
      
      // 测试7: 星曜数据
      const hasStars = chart.palaces.some(p => p.stars.length > 0);
      
      const passed = 
        hasBasicStructure &&
        hasDizhi &&
        hasTiangan &&
        hasChangsheng &&
        hasMingZhu &&
        hasShenZhu &&
        hasBrightness &&
        hasStars;
      
      this.addResult('完整排盘算法', passed, '排盘算法集成测试', {
        palacesCount: chart.palaces.length,
        hasDizhi,
        hasTiangan,
        hasChangsheng,
        mingZhu: chart.mingZhu,
        shenZhu: chart.shenZhu,
        hasBrightness,
        hasStars,
        wuxingJu: chart.wuxingJu
      });
    } catch (error: any) {
      this.addResult('完整排盘算法', false, `测试失败: ${error.message}`, { error: error.message, stack: error.stack });
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
  }

  /**
   * 打印测试结果摘要
   */
  private printResults() {
    console.log('\n📊 测试结果摘要:');
    console.log('='.repeat(60));
    
    const passedCount = this.results.filter(r => r.passed).length;
    const totalCount = this.results.length;
    const passRate = ((passedCount / totalCount) * 100).toFixed(1);
    
    console.log(`\n总计: ${totalCount} 个测试`);
    console.log(`通过: ${passedCount} 个 ✅`);
    console.log(`失败: ${totalCount - passedCount} 个 ❌`);
    console.log(`通过率: ${passRate}%`);
    
    console.log('\n详细结果:');
    this.results.forEach((result, index) => {
      const icon = result.passed ? '✅' : '❌';
      console.log(`${index + 1}. ${icon} ${result.name}`);
      console.log(`   消息: ${result.message}`);
      if (!result.passed && result.details) {
        console.log(`   详情:`, result.details);
      }
    });
    
    console.log('\n' + '='.repeat(60));
    
    if (passedCount === totalCount) {
      console.log('🎉 所有测试通过！P0阶段功能正常！');
    } else {
      console.log('⚠️  部分测试失败，请检查相关功能。');
    }
  }
}

/**
 * 运行测试
 */
export function runPhase1Tests(): TestResult[] {
  const testSuite = new Phase1TestSuite();
  return testSuite.runAllTests();
}


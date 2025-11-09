/**
 * 集成测试脚本
 * 测试完整的占卜流程，包括传统逻辑分析的集成
 */

import { coinDivination, plumBlossomDivination } from './divinationMethods';
import { generateTraditionalAnalysisCoin, generateTraditionalAnalysisPlumBlossom } from './traditionalAnalysis';
import { generateHexagramFromLines } from './hexagramGenerator';
import type { Hexagram } from '../types';

/**
 * 测试铜钱占卜完整流程
 */
export async function testCoinDivinationFlow() {
  console.log('\n🪙 === 测试铜钱占卜完整流程 ===\n');

  try {
    // 1. 执行占卜
    console.log('1️⃣ 执行铜钱占卜...');
    const coinResult = await coinDivination();
    
    if (!coinResult || !coinResult.hexagram) {
      console.error('❌ 占卜失败：未获取到卦象');
      return;
    }

    console.log(`✅ 占卜成功: ${coinResult.hexagram.chineseName} (${coinResult.hexagram.symbol})`);
    console.log(`   铜钱结果: ${coinResult.results.join(', ')}`);

    // 2. 计算动爻
    const changingLines = coinResult.results
      .map((val, idx) => (val === 6 || val === 9) ? idx : -1)
      .filter(idx => idx !== -1);

    console.log(`\n2️⃣ 计算动爻...`);
    if (changingLines.length > 0) {
      console.log(`✅ 发现 ${changingLines.length} 个动爻: 第${changingLines.map(i => i + 1).join('、')}爻`);
    } else {
      console.log('✅ 静卦（无动爻）');
    }

    // 3. 计算变卦
    let relatedHexagram: Hexagram | null = null;
    if (changingLines.length > 0) {
      console.log(`\n3️⃣ 计算变卦...`);
      try {
        const newLines = [...coinResult.hexagram.lines];
        changingLines.forEach(line => {
          newLines[line] = newLines[line] === 1 ? 0 : 1;
        });
        const temp = await generateHexagramFromLines(newLines);
        if (temp) {
          relatedHexagram = temp;
          console.log(`✅ 变卦: ${relatedHexagram.chineseName} (${relatedHexagram.symbol})`);
        }
      } catch (err) {
        console.error('❌ 计算变卦失败:', err);
      }
    }

    // 4. 生成传统逻辑分析
    console.log(`\n4️⃣ 生成传统逻辑分析...`);
    const traditionalAnalysis = generateTraditionalAnalysisCoin(
      coinResult.hexagram,
      changingLines,
      relatedHexagram
    );

    if (!traditionalAnalysis) {
      console.error('❌ 传统逻辑分析生成失败');
      return;
    }

    console.log('✅ 传统逻辑分析生成成功:');
    
    if (traditionalAnalysis.palaceData) {
      console.log(`   📊 卦宫: ${traditionalAnalysis.palaceData.palace}宫（${traditionalAnalysis.palaceData.element}）`);
      console.log(`   🎯 世爻: 第${traditionalAnalysis.palaceData.shiYao + 1}爻，应爻: 第${traditionalAnalysis.palaceData.yingYao + 1}爻`);
    }

    if (traditionalAnalysis.bodyUsage) {
      console.log(`   ⚖️ 体用关系:`);
      console.log(`      体卦: ${traditionalAnalysis.bodyUsage.bodyTrigram}（${traditionalAnalysis.bodyUsage.bodyElement}）`);
      console.log(`      用卦: ${traditionalAnalysis.bodyUsage.usageTrigram}（${traditionalAnalysis.bodyUsage.usageElement}）`);
      console.log(`      关系: ${traditionalAnalysis.bodyUsage.relationship}`);
      console.log(`      解读: ${traditionalAnalysis.bodyUsage.interpretation.generalMeaning.substring(0, 60)}...`);
    }

    if (traditionalAnalysis.sixRelatives) {
      console.log(`   👨‍👩‍👧‍👦 六亲信息: ${traditionalAnalysis.sixRelatives.length}个爻位`);
      if (changingLines.length > 0) {
        console.log(`      动爻六亲:`);
        changingLines.forEach(pos => {
          const rel = traditionalAnalysis.sixRelatives?.find(r => r.position === pos);
          if (rel) {
            console.log(`        ${pos + 1}爻: ${rel.relative}（${rel.element}）`);
          }
        });
      }
    }

    if (traditionalAnalysis.changingLinesAnalysis && traditionalAnalysis.changingLinesAnalysis.length > 0) {
      console.log(`   📝 动爻分析: ${traditionalAnalysis.changingLinesAnalysis.length}个`);
      traditionalAnalysis.changingLinesAnalysis.forEach(ch => {
        console.log(`      ${ch.position + 1}爻: ${ch.relative}（${ch.element}） - ${ch.importance}`);
      });
    }

    // 5. 验证数据完整性
    console.log(`\n5️⃣ 验证数据完整性...`);
    const issues: string[] = [];
    
    if (!traditionalAnalysis.palaceData) {
      issues.push('缺少卦宫数据');
    }
    if (!traditionalAnalysis.bodyUsage) {
      issues.push('缺少体用关系');
    }
    if (changingLines.length > 0 && !traditionalAnalysis.changingLinesAnalysis) {
      issues.push('缺少动爻分析');
    }

    if (issues.length === 0) {
      console.log('✅ 所有数据完整');
    } else {
      console.log(`⚠️ 发现以下问题: ${issues.join(', ')}`);
    }

    console.log('\n✅ 铜钱占卜流程测试完成！\n');
    return {
      success: true,
      coinResult,
      traditionalAnalysis,
      changingLines,
      relatedHexagram
    };

  } catch (error) {
    console.error('❌ 测试失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * 测试梅花易数完整流程
 */
export async function testPlumBlossomFlow() {
  console.log('\n🌸 === 测试梅花易数完整流程 ===\n');

  try {
    // 1. 执行占卜
    console.log('1️⃣ 执行梅花易数占卜...');
    const plumResult = await plumBlossomDivination({
      method: 'number',
      numbers: [3, 5]
    });

    if (!plumResult || !plumResult.hexagram) {
      console.error('❌ 占卜失败：未获取到卦象');
      return;
    }

    console.log(`✅ 占卜成功: ${plumResult.hexagram.chineseName} (${plumResult.hexagram.symbol})`);
    console.log(`   起卦数字: ${plumResult.numbers.join(', ')}`);
    console.log(`   上卦: ${plumResult.upperTrigram.chineseName}，下卦: ${plumResult.lowerTrigram.chineseName}`);

    // 2. 生成传统逻辑分析（梅花易数没有动爻）
    console.log(`\n2️⃣ 生成传统逻辑分析...`);
    const traditionalAnalysis = generateTraditionalAnalysisPlumBlossom(
      plumResult.hexagram,
      [], // 梅花易数没有动爻
      null
    );

    if (!traditionalAnalysis) {
      console.error('❌ 传统逻辑分析生成失败');
      return;
    }

    console.log('✅ 传统逻辑分析生成成功:');
    
    if (traditionalAnalysis.palaceData) {
      console.log(`   📊 卦宫: ${traditionalAnalysis.palaceData.palace}宫（${traditionalAnalysis.palaceData.element}）`);
      console.log(`   🎯 世爻: 第${traditionalAnalysis.palaceData.shiYao + 1}爻，应爻: 第${traditionalAnalysis.palaceData.yingYao + 1}爻`);
    }

    if (traditionalAnalysis.bodyUsage) {
      console.log(`   ⚖️ 体用关系（梅花易数: 上卦用、下卦体）:`);
      console.log(`      体卦: ${traditionalAnalysis.bodyUsage.bodyTrigram}（${traditionalAnalysis.bodyUsage.bodyElement}）`);
      console.log(`      用卦: ${traditionalAnalysis.bodyUsage.usageTrigram}（${traditionalAnalysis.bodyUsage.usageElement}）`);
      console.log(`      关系: ${traditionalAnalysis.bodyUsage.relationship}`);
      console.log(`      解读: ${traditionalAnalysis.bodyUsage.interpretation.generalMeaning.substring(0, 60)}...`);
    }

    // 3. 验证数据完整性
    console.log(`\n3️⃣ 验证数据完整性...`);
    const issues: string[] = [];
    
    if (!traditionalAnalysis.bodyUsage) {
      issues.push('缺少体用关系');
    }

    if (issues.length === 0) {
      console.log('✅ 所有数据完整');
    } else {
      console.log(`⚠️ 发现以下问题: ${issues.join(', ')}`);
    }

    console.log('\n✅ 梅花易数流程测试完成！\n');
    return {
      success: true,
      plumResult,
      traditionalAnalysis
    };

  } catch (error) {
    console.error('❌ 测试失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * 测试传统逻辑分析数据结构
 */
export function testTraditionalAnalysisStructure(traditionalAnalysis: any) {
  console.log('\n📋 === 测试传统逻辑分析数据结构 ===\n');

  const requiredFields = {
    'palaceData': ['palace', 'element', 'shiYao', 'yingYao', 'naJiaSequence'],
    'bodyUsage': ['method', 'bodyTrigram', 'usageTrigram', 'bodyElement', 'usageElement', 'relationship', 'interpretation'],
    'sixRelatives': ['position', 'relative', 'element', 'dizhi']
  };

  let allValid = true;

  // 检查 palaceData
  if (traditionalAnalysis.palaceData) {
    console.log('✅ palaceData 存在');
    const missing = requiredFields.palaceData.filter(field => !(field in traditionalAnalysis.palaceData));
    if (missing.length > 0) {
      console.log(`⚠️ palaceData 缺少字段: ${missing.join(', ')}`);
      allValid = false;
    } else {
      console.log('✅ palaceData 字段完整');
    }
  } else {
    console.log('⚠️ palaceData 不存在（可能某些卦查找失败）');
  }

  // 检查 bodyUsage
  if (traditionalAnalysis.bodyUsage) {
    console.log('✅ bodyUsage 存在');
    const missing = requiredFields.bodyUsage.filter(field => !(field in traditionalAnalysis.bodyUsage));
    if (missing.length > 0) {
      console.log(`⚠️ bodyUsage 缺少字段: ${missing.join(', ')}`);
      allValid = false;
    } else {
      console.log('✅ bodyUsage 字段完整');
      
      // 检查 interpretation
      if (traditionalAnalysis.bodyUsage.interpretation) {
        const intFields = ['generalMeaning', 'careerAdvice', 'wealthAdvice', 'relationshipAdvice', 'healthAdvice', 'actionGuidance'];
        const missingInt = intFields.filter(field => !(field in traditionalAnalysis.bodyUsage.interpretation));
        if (missingInt.length > 0) {
          console.log(`⚠️ interpretation 缺少字段: ${missingInt.join(', ')}`);
          allValid = false;
        } else {
          console.log('✅ interpretation 字段完整');
        }
      }
    }
  } else {
    console.log('❌ bodyUsage 不存在（必需）');
    allValid = false;
  }

  // 检查 sixRelatives
  if (traditionalAnalysis.sixRelatives && traditionalAnalysis.sixRelatives.length > 0) {
    console.log(`✅ sixRelatives 存在（${traditionalAnalysis.sixRelatives.length}个爻位）`);
    const sample = traditionalAnalysis.sixRelatives[0];
    const missing = requiredFields.sixRelatives.filter(field => !(field in sample));
    if (missing.length > 0) {
      console.log(`⚠️ sixRelatives 缺少字段: ${missing.join(', ')}`);
      allValid = false;
    } else {
      console.log('✅ sixRelatives 字段完整');
    }
  } else {
    console.log('⚠️ sixRelatives 不存在（可能某些卦查找失败）');
  }

  if (allValid) {
    console.log('\n✅ 数据结构验证通过！');
  } else {
    console.log('\n⚠️ 数据结构存在问题，请检查');
  }

  return allValid;
}

/**
 * 运行所有集成测试
 */
export async function runIntegrationTests() {
  console.log('🚀 === 开始集成测试 ===\n');

  // 测试1: 铜钱占卜流程
  const coinTest = await testCoinDivinationFlow();
  if (coinTest && coinTest.success && coinTest.traditionalAnalysis) {
    testTraditionalAnalysisStructure(coinTest.traditionalAnalysis);
  }

  // 测试2: 梅花易数流程
  const plumTest = await testPlumBlossomFlow();
  if (plumTest && plumTest.success && plumTest.traditionalAnalysis) {
    testTraditionalAnalysisStructure(plumTest.traditionalAnalysis);
  }

  // 总结
  console.log('\n📊 === 测试总结 ===\n');
  console.log(`铜钱占卜: ${coinTest?.success ? '✅ 通过' : '❌ 失败'}`);
  console.log(`梅花易数: ${plumTest?.success ? '✅ 通过' : '❌ 失败'}`);
  
  const allPassed = coinTest?.success && plumTest?.success;
  if (allPassed) {
    console.log('\n✨ 所有集成测试通过！系统已准备就绪。');
  } else {
    console.log('\n⚠️ 部分测试失败，请检查问题。');
  }

  return allPassed;
}

// 如果在Node环境中直接运行
if (typeof window === 'undefined') {
  runIntegrationTests().catch(console.error);
}


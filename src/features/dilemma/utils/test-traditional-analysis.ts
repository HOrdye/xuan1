/**
 * 传统逻辑分析测试脚本
 * 用于验证体用关系、六亲、世应等传统逻辑计算的准确性
 */

import { getHexagramPalaceByName, validatePalaceData } from './palaceSystem';
import { calculatePlumBlossomBodyUsage, calculateCoinBodyUsage } from './bodyUsage';
import { calculateYingYao, getShiYingInfo } from './shiYing';
import { calculateAllSixRelatives } from './sixRelatives';
import { generateTraditionalAnalysisCoin, generateTraditionalAnalysisPlumBlossom } from './traditionalAnalysis';
import type { Hexagram } from '../types';

/**
 * 测试用例：乾卦
 */
function createQianHexagram(): Hexagram {
  return {
    number: 1,
    sequence: 1,
    name: 'Qian',
    chineseName: '乾',
    symbol: '䷀',
    lines: [1, 1, 1, 1, 1, 1] as (0 | 1)[],
    judgment: '元亨利贞。',
    meaning: '天行健，君子以自强不息',
    yao_texts: [
      '初九：潜龙勿用。',
      '九二：见龙在田，利见大人。',
      '九三：君子终日乾乾，夕惕若厉，无咎。',
      '九四：或跃在渊，无咎。',
      '九五：飞龙在天，利见大人。',
      '上九：亢龙有悔。'
    ],
    trigrams: { upper: 'Heaven', lower: 'Heaven' },
    modernInterpretation: '当前形势利于开创新局面，适合主动出击'
  };
}

/**
 * 测试用例：坤卦
 */
function createKunHexagram(): Hexagram {
  return {
    number: 2,
    sequence: 2,
    name: 'Kun',
    chineseName: '坤',
    symbol: '䷁',
    lines: [0, 0, 0, 0, 0, 0] as (0 | 1)[],
    judgment: '元亨，利牝马之贞。',
    meaning: '地势坤，君子以厚德载物',
    yao_texts: [
      '初六：履霜，坚冰至。',
      '六二：直方大，不习无不利。',
      '六三：含章可贞，或从王事，无成有终。',
      '六四：括囊，无咎无誉。',
      '六五：黄裳，元吉。',
      '上六：龙战于野，其血玄黄。'
    ],
    trigrams: { upper: 'Earth', lower: 'Earth' },
    modernInterpretation: '当前形势需要保持包容和顺应'
  };
}

/**
 * 测试用例：屯卦（水雷屯）
 */
function createTunHexagram(): Hexagram {
  return {
    number: 3,
    sequence: 3,
    name: 'Tun',
    chineseName: '屯',
    symbol: '䷂',
    lines: [1, 0, 0, 0, 1, 0] as (0 | 1)[],
    judgment: '元亨利贞，勿用有攸往，利建侯。',
    meaning: '云雷屯，君子以经纶',
    yao_texts: [
      '初九：磐桓，利居贞，利建侯。',
      '六二：屯如邅如，乘马班如。',
      '六三：即鹿无虞，惟入于林中。',
      '六四：乘马班如，求婚媾，往吉。',
      '九五：屯其膏，小贞吉，大贞凶。',
      '上六：乘马班如，泣血涟如。'
    ],
    trigrams: { upper: 'Water', lower: 'Thunder' },
    modernInterpretation: '当前处于初创阶段，需要谨慎规划'
  };
}

/**
 * 运行所有测试
 */
export async function runTraditionalAnalysisTests(): Promise<void> {
  console.log('🧪 开始测试传统逻辑分析...\n');

  // 测试1: 验证卦宫数据完整性
  console.log('📊 测试1: 验证卦宫数据完整性');
  const validationResult = validatePalaceData();
  if (validationResult.valid) {
    console.log('✅ 卦宫数据验证通过');
    console.log(`   总数: ${validationResult.statistics.total}`);
    console.log(`   卦宫分布:`, validationResult.statistics.byPalace);
    console.log(`   五行分布:`, validationResult.statistics.byElement);
  } else {
    console.log('❌ 卦宫数据验证失败:');
    validationResult.errors.forEach(err => console.log(`   - ${err}`));
  }
  console.log('');

  // 测试2: 测试卦宫数据查找
  console.log('🔍 测试2: 卦宫数据查找');
  const qianPalace = getHexagramPalaceByName('乾');
  const kunPalace = getHexagramPalaceByName('坤');
  const tunPalace = getHexagramPalaceByName('屯');

  if (qianPalace) {
    console.log(`✅ 乾卦: 卦宫=${qianPalace.palace}, 五行=${qianPalace.element}, 世爻=${qianPalace.shiYao + 1}爻`);
  } else {
    console.log('❌ 未找到乾卦数据');
  }

  if (kunPalace) {
    console.log(`✅ 坤卦: 卦宫=${kunPalace.palace}, 五行=${kunPalace.element}, 世爻=${kunPalace.shiYao + 1}爻`);
  } else {
    console.log('❌ 未找到坤卦数据');
  }

  const tunPalace2 = getHexagramPalaceByName('屯');
  const tunPalace3 = getHexagramPalaceByName('水雷屯');
  if (tunPalace || tunPalace2 || tunPalace3) {
    const found = tunPalace || tunPalace2 || tunPalace3;
    console.log(`✅ 屯卦: 卦宫=${found!.palace}, 五行=${found!.element}, 世爻=${found!.shiYao + 1}爻`);
    console.log(`   (测试: "屯"=${!!tunPalace2}, "水雷屯"=${!!tunPalace3})`);
  } else {
    console.log('❌ 未找到屯卦数据');
  }
  console.log('');

  // 测试3: 测试世应定位
  console.log('🎯 测试3: 世应定位');
  if (qianPalace) {
    const shiYingInfo = getShiYingInfo(qianPalace.shiYao);
    const yingYao = calculateYingYao(qianPalace.shiYao);
    console.log(`✅ 乾卦: 世在${qianPalace.shiYao + 1}爻, 应在${yingYao + 1}爻`);
    console.log(`   世爻所在: ${shiYingInfo.shiTrigram === 'upper' ? '上卦' : '下卦'}`);
    console.log(`   应爻所在: ${shiYingInfo.yingTrigram === 'upper' ? '上卦' : '下卦'}`);
  }
  console.log('');

  // 测试4: 测试六亲定位
  console.log('👨‍👩‍👧‍👦 测试4: 六亲定位');
  if (qianPalace) {
    const sixRelatives = calculateAllSixRelatives(
      qianPalace.element as any,
      qianPalace.naJiaSequence as any
    );
    console.log(`✅ 乾卦六亲:`);
    sixRelatives.forEach((rel, idx) => {
      console.log(`   ${idx + 1}爻: ${rel.dizhi}(${rel.element}) -> ${rel.relative}`);
    });
  }
  console.log('');

  // 测试5: 测试梅花易数体用关系
  console.log('🌸 测试5: 梅花易数体用关系');
  const qianHexagram = createQianHexagram();
  const plumBodyUsage = calculatePlumBlossomBodyUsage(qianHexagram);
  console.log(`✅ 乾卦（梅花易数）:`);
  console.log(`   体卦: ${plumBodyUsage.bodyTrigramName} (${plumBodyUsage.bodyElement})`);
  console.log(`   用卦: ${plumBodyUsage.usageTrigramName} (${plumBodyUsage.usageElement})`);
  console.log(`   关系: ${plumBodyUsage.relationship}`);
  console.log('');

  // 测试6: 测试铜钱法体用关系
  console.log('🪙 测试6: 铜钱法体用关系');
  if (qianPalace) {
    const coinBodyUsage = calculateCoinBodyUsage(qianHexagram, qianPalace.shiYao, qianPalace);
    console.log(`✅ 乾卦（铜钱法）:`);
    console.log(`   世爻: ${qianPalace.shiYao + 1}爻`);
    console.log(`   应爻: ${coinBodyUsage.yingYao + 1}爻`);
    console.log(`   体卦: ${coinBodyUsage.bodyTrigramName} (${coinBodyUsage.bodyElement})`);
    console.log(`   用卦: ${coinBodyUsage.usageTrigramName} (${coinBodyUsage.usageElement})`);
    console.log(`   关系: ${coinBodyUsage.relationship}`);
  }
  console.log('');

  // 测试7: 测试完整传统逻辑分析（梅花易数）
  console.log('📝 测试7: 完整传统逻辑分析（梅花易数）');
  const plumAnalysis = generateTraditionalAnalysisPlumBlossom(qianHexagram, [], null);
  console.log(`✅ 梅花易数分析结果:`);
  console.log(`   卦宫: ${plumAnalysis.palaceData?.palace || '未知'}`);
  console.log(`   五行: ${plumAnalysis.palaceData?.element || '未知'}`);
  console.log(`   体用关系: ${plumAnalysis.bodyUsage?.relationship || '未知'}`);
  console.log(`   体卦: ${plumAnalysis.bodyUsage?.bodyTrigram} (${plumAnalysis.bodyUsage?.bodyElement})`);
  console.log(`   用卦: ${plumAnalysis.bodyUsage?.usageTrigram} (${plumAnalysis.bodyUsage?.usageElement})`);
  if (plumAnalysis.bodyUsage?.interpretation) {
    console.log(`   解读: ${plumAnalysis.bodyUsage.interpretation.generalMeaning.substring(0, 50)}...`);
  }
  console.log('');

  // 测试8: 测试完整传统逻辑分析（铜钱法，带动爻）
  console.log('📝 测试8: 完整传统逻辑分析（铜钱法，带动爻）');
  const tunHexagram = createTunHexagram();
  // 修改卦名为"水雷屯"以匹配数据
  tunHexagram.chineseName = '水雷屯';
  const coinAnalysis = generateTraditionalAnalysisCoin(tunHexagram, [0, 2], null); // 初爻和三爻动
  console.log(`✅ 屯卦（铜钱法）分析结果:`);
  console.log(`   卦宫: ${coinAnalysis.palaceData?.palace || '未知'}`);
  console.log(`   五行: ${coinAnalysis.palaceData?.element || '未知'}`);
  console.log(`   世爻: ${coinAnalysis.palaceData?.shiYao !== undefined ? coinAnalysis.palaceData.shiYao + 1 : '未知'}爻`);
  console.log(`   应爻: ${coinAnalysis.palaceData?.yingYao !== undefined ? coinAnalysis.palaceData.yingYao + 1 : '未知'}爻`);
  console.log(`   体用关系: ${coinAnalysis.bodyUsage?.relationship || '未知'}`);
  if (coinAnalysis.changingLinesAnalysis && coinAnalysis.changingLinesAnalysis.length > 0) {
    console.log(`   动爻分析:`);
    coinAnalysis.changingLinesAnalysis.forEach(ch => {
      console.log(`     ${ch.position + 1}爻: ${ch.relative}(${ch.element}) - ${ch.importance}`);
    });
  }
  console.log('');

  // 测试9: 测试不同体用关系的解读
  console.log('📚 测试9: 不同体用关系的解读');
  const { getBodyUsageInterpretation } = await import('./bodyUsage');
  const relationships: Array<'body-ke-usage' | 'usage-ke-body' | 'body-sheng-usage' | 'usage-sheng-body' | 'bihe'> = [
    'body-ke-usage',
    'usage-ke-body',
    'body-sheng-usage',
    'usage-sheng-body',
    'bihe'
  ];
  
  relationships.forEach(rel => {
    const interpretation = getBodyUsageInterpretation(rel);
    console.log(`✅ ${rel}:`);
    console.log(`   ${interpretation.generalMeaning.substring(0, 60)}...`);
  });
  console.log('');

  console.log('✨ 测试完成！');
}

// 如果在Node环境中直接运行
if (typeof window === 'undefined') {
  runTraditionalAnalysisTests().catch(console.error);
}


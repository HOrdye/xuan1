/**
 * 传统易经逻辑分析
 * 整合体用关系、六亲、世应等传统逻辑，生成完整的分析结果
 */

import type { Hexagram } from '../types';
import type { TraditionalAnalysis } from '../types';
import { getHexagramPalaceByName } from './palaceSystem';
import { calculatePlumBlossomBodyUsage, calculateCoinBodyUsage, getBodyUsageInterpretation } from './bodyUsage';
import { calculateYingYao, getShiYingInfo } from './shiYing';
import { calculateAllSixRelatives, getSixRelativeName } from './sixRelatives';

/**
 * 生成传统易经逻辑分析结果（梅花易数）
 * @param hexagram 卦象
 * @param changingLines 动爻位置
 * @param relatedHexagram 变卦
 * @returns 传统逻辑分析结果
 */
export function generateTraditionalAnalysisPlumBlossom(
  hexagram: Hexagram,
  changingLines: number[],
  relatedHexagram: Hexagram | null
): TraditionalAnalysis {
  // 获取卦宫数据
  const palaceData = getHexagramPalaceByName(hexagram.chineseName);
  
  // 计算体用关系（梅花易数：上卦用、下卦体）
  const bodyUsage = calculatePlumBlossomBodyUsage(hexagram);
  const bodyUsageInterpretation = getBodyUsageInterpretation(bodyUsage.relationship);
  
  // 计算六亲（如果有卦宫数据）
  let sixRelatives;
  if (palaceData) {
    sixRelatives = calculateAllSixRelatives(
      palaceData.element as any,
      palaceData.naJiaSequence as any
    ).map(yao => ({
      position: yao.position,
      relative: getSixRelativeName(yao.relative),
      element: yao.element,
      dizhi: yao.dizhi
    }));
  }
  
  // 分析动爻
  const changingLinesAnalysis = changingLines.map(position => {
    const yaoRelative = sixRelatives?.find(r => r.position === position);
    const yaoText = hexagram.yao_texts[position] || '';
    
    // 判断动爻重要性
    let importance: 'high' | 'medium' | 'low' = 'medium';
    if (palaceData && position === palaceData.shiYao) {
      importance = 'high'; // 世爻位置的动爻最重要
    } else if (palaceData && position === calculateYingYao(palaceData.shiYao)) {
      importance = 'high'; // 应爻位置的动爻也很重要
    } else if (changingLines.length === 1) {
      importance = 'high'; // 单动爻很重要
    }
    
    return {
      position,
      relative: yaoRelative?.relative || '未知',
      element: yaoRelative?.element || '未知',
      yaoText,
      interpretation: `${yaoText}。此动爻位于${yaoRelative?.relative || ''}，${yaoRelative?.element || ''}属性，${importance === 'high' ? '对卦象影响较大' : '对卦象有一定影响'}。`,
      importance
    };
  });
  
  return {
    palaceData: palaceData ? {
      palace: palaceData.palace,
      element: palaceData.element,
      shiYao: palaceData.shiYao,
      yingYao: calculateYingYao(palaceData.shiYao),
      naJiaSequence: palaceData.naJiaSequence
    } : undefined,
    bodyUsage: {
      method: 'plumBlossom',
      bodyTrigram: bodyUsage.bodyTrigramName || '未知',
      usageTrigram: bodyUsage.usageTrigramName || '未知',
      bodyElement: bodyUsage.bodyElement,
      usageElement: bodyUsage.usageElement,
      relationship: bodyUsage.relationship,
      interpretation: bodyUsageInterpretation
    },
    sixRelatives,
    changingLinesAnalysis: changingLinesAnalysis.length > 0 ? changingLinesAnalysis : undefined
  };
}

/**
 * 生成传统易经逻辑分析结果（铜钱法）
 * @param hexagram 卦象
 * @param changingLines 动爻位置
 * @param relatedHexagram 变卦
 * @returns 传统逻辑分析结果
 */
export function generateTraditionalAnalysisCoin(
  hexagram: Hexagram,
  changingLines: number[],
  relatedHexagram: Hexagram | null
): TraditionalAnalysis {
  // 获取卦宫数据
  const palaceData = getHexagramPalaceByName(hexagram.chineseName);
  
  if (!palaceData) {
    console.warn(`未找到卦宫数据: ${hexagram.chineseName}`);
    // 返回基础分析结果
    return {
      bodyUsage: {
        method: 'coin',
        bodyTrigram: '未知',
        usageTrigram: '未知',
        bodyElement: '金',
        usageElement: '金',
        relationship: 'bihe',
        interpretation: getBodyUsageInterpretation('bihe')
      }
    };
  }
  
  // 计算体用关系（铜钱法：按世应确定）
  const bodyUsage = calculateCoinBodyUsage(hexagram, palaceData.shiYao, palaceData);
  const bodyUsageInterpretation = getBodyUsageInterpretation(bodyUsage.relationship);
  
  // 计算六亲
  const sixRelatives = calculateAllSixRelatives(
    palaceData.element as any,
    palaceData.naJiaSequence as any
  ).map(yao => ({
    position: yao.position,
    relative: getSixRelativeName(yao.relative),
    element: yao.element,
    dizhi: yao.dizhi
  }));
  
  // 分析动爻
  const changingLinesAnalysis = changingLines.map(position => {
    const yaoRelative = sixRelatives.find(r => r.position === position);
    const yaoText = hexagram.yao_texts[position] || '';
    
    // 判断动爻重要性
    let importance: 'high' | 'medium' | 'low' = 'medium';
    if (position === palaceData.shiYao) {
      importance = 'high'; // 世爻位置的动爻最重要
    } else if (position === calculateYingYao(palaceData.shiYao)) {
      importance = 'high'; // 应爻位置的动爻也很重要
    } else if (changingLines.length === 1) {
      importance = 'high'; // 单动爻很重要
    }
    
    return {
      position,
      relative: yaoRelative.relative,
      element: yaoRelative.element,
      yaoText,
      interpretation: `${yaoText}。此动爻位于${yaoRelative.relative}，${yaoRelative.element}属性，${importance === 'high' ? '对卦象影响较大，需要重点关注' : '对卦象有一定影响'}。`,
      importance
    };
  });
  
  return {
    palaceData: {
      palace: palaceData.palace,
      element: palaceData.element,
      shiYao: palaceData.shiYao,
      yingYao: calculateYingYao(palaceData.shiYao),
      naJiaSequence: palaceData.naJiaSequence
    },
    bodyUsage: {
      method: 'coin',
      bodyTrigram: bodyUsage.bodyTrigramName || '未知',
      usageTrigram: bodyUsage.usageTrigramName || '未知',
      bodyElement: bodyUsage.bodyElement,
      usageElement: bodyUsage.usageElement,
      relationship: bodyUsage.relationship,
      interpretation: bodyUsageInterpretation
    },
    sixRelatives,
    changingLinesAnalysis: changingLinesAnalysis.length > 0 ? changingLinesAnalysis : undefined
  };
}


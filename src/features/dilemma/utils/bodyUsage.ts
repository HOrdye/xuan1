/**
 * 体用关系判断
 * 支持梅花易数和铜钱法两种体用关系确定方式
 */

import type { Element } from './trigramElements';
import { getElementRelationship, getTrigramElement } from './trigramElements';
import { getShiYingInfo } from './shiYing';
import type { Hexagram } from '../types';

export type TrigramPosition = 'upper' | 'lower';

export type BodyUsageRelationship = 
  | 'body-ke-usage'    // 体克用
  | 'usage-ke-body'    // 用克体
  | 'body-sheng-usage' // 体生用
  | 'usage-sheng-body' // 用生体
  | 'bihe';            // 比和

/**
 * 梅花易数体用关系
 * 规则：上卦为用卦，下卦为体卦
 */
export interface PlumBlossomBodyUsage {
  /** 体卦（下卦） */
  bodyTrigram: 'upper' | 'lower';
  /** 用卦（上卦） */
  usageTrigram: 'upper' | 'lower';
  /** 体卦五行 */
  bodyElement: Element;
  /** 用卦五行 */
  usageElement: Element;
  /** 体用关系 */
  relationship: BodyUsageRelationship;
  /** 体卦名称（中文） */
  bodyTrigramName?: string;
  /** 用卦名称（中文） */
  usageTrigramName?: string;
}

/**
 * 铜钱法体用关系（按世应确定）
 * 规则：世爻所在卦为体卦，应爻所在卦为用卦
 */
export interface CoinBodyUsage {
  /** 世爻位置 */
  shiYao: number;
  /** 应爻位置 */
  yingYao: number;
  /** 体卦（世爻所在卦） */
  bodyTrigram: 'upper' | 'lower';
  /** 用卦（应爻所在卦） */
  usageTrigram: 'upper' | 'lower';
  /** 体卦五行 */
  bodyElement: Element;
  /** 用卦五行 */
  usageElement: Element;
  /** 体用关系 */
  relationship: BodyUsageRelationship;
  /** 体卦名称（中文） */
  bodyTrigramName?: string;
  /** 用卦名称（中文） */
  usageTrigramName?: string;
}

/**
 * 根据卦象和上下卦确定五行
 * @param hexagram 卦象
 * @param trigramPosition 卦位（上卦或下卦）
 * @returns 五行属性
 */
function getTrigramElementFromHexagram(
  hexagram: Hexagram,
  trigramPosition: TrigramPosition
): Element {
  // 从hexagram.trigrams中获取
  const trigramName = trigramPosition === 'upper' 
    ? hexagram.trigrams.upper 
    : hexagram.trigrams.lower;
  
  // 将英文名转换为中文名
  const trigramMap: Record<string, string> = {
    'Heaven': '乾',
    'Lake': '兑',
    'Fire': '离',
    'Thunder': '震',
    'Wind': '巽',
    'Water': '坎',
    'Mountain': '艮',
    'Earth': '坤'
  };
  
  const chineseName = trigramMap[trigramName] || '乾';
  return getTrigramElement(chineseName as any);
}

/**
 * 计算体用关系
 * @param bodyElement 体卦五行
 * @param usageElement 用卦五行
 * @returns 体用关系
 */
function calculateBodyUsageRelationship(
  bodyElement: Element,
  usageElement: Element
): BodyUsageRelationship {
  const relationship = getElementRelationship(bodyElement, usageElement);

  switch (relationship) {
    case 'ke':
      // 需要判断是谁克谁
      const keMap: Record<Element, Element> = {
        '金': '木',
        '木': '土',
        '土': '水',
        '水': '火',
        '火': '金'
      };
      
      if (keMap[bodyElement] === usageElement) {
        return 'body-ke-usage'; // 体克用
      } else {
        return 'usage-ke-body'; // 用克体
      }

    case 'sheng':
      // 需要判断是谁生谁
      const shengMap: Record<Element, Element> = {
        '金': '水',
        '水': '木',
        '木': '火',
        '火': '土',
        '土': '金'
      };
      
      if (shengMap[bodyElement] === usageElement) {
        return 'body-sheng-usage'; // 体生用
      } else {
        return 'usage-sheng-body'; // 用生体
      }

    case 'bihe':
    default:
      return 'bihe'; // 比和
  }
}

/**
 * 计算梅花易数体用关系
 * @param hexagram 卦象
 * @returns 体用关系
 */
export function calculatePlumBlossomBodyUsage(hexagram: Hexagram): PlumBlossomBodyUsage {
  // 梅花易数：上卦为用，下卦为体
  const bodyTrigram: TrigramPosition = 'lower'; // 下卦为体
  const usageTrigram: TrigramPosition = 'upper'; // 上卦为用

  const bodyElement = getTrigramElementFromHexagram(hexagram, bodyTrigram);
  const usageElement = getTrigramElementFromHexagram(hexagram, usageTrigram);

  const relationship = calculateBodyUsageRelationship(bodyElement, usageElement);

  // 获取卦名
  const trigramMap: Record<string, string> = {
    'Heaven': '乾',
    'Lake': '兑',
    'Fire': '离',
    'Thunder': '震',
    'Wind': '巽',
    'Water': '坎',
    'Mountain': '艮',
    'Earth': '坤'
  };

  return {
    bodyTrigram: bodyTrigram,
    usageTrigram: usageTrigram,
    bodyElement,
    usageElement,
    relationship,
    bodyTrigramName: trigramMap[hexagram.trigrams.lower] || '未知',
    usageTrigramName: trigramMap[hexagram.trigrams.upper] || '未知'
  };
}

/**
 * 计算铜钱法体用关系（按世应确定）
 * @param hexagram 卦象
 * @param shiYao 世爻位置（0-5）
 * @param hexagramPalaceData 卦宫数据（用于确定世爻位置）
 * @returns 体用关系
 */
export function calculateCoinBodyUsage(
  hexagram: Hexagram,
  shiYao: number,
  hexagramPalaceData?: { shiYao: number }
): CoinBodyUsage {
  // 如果提供了卦宫数据，使用卦宫数据中的世爻位置
  const actualShiYao = hexagramPalaceData?.shiYao ?? shiYao;

  const shiYingInfo = getShiYingInfo(actualShiYao);

  // 世爻所在卦为体卦，应爻所在卦为用卦
  const bodyTrigram = shiYingInfo.shiTrigram;
  const usageTrigram = shiYingInfo.yingTrigram;

  const bodyElement = getTrigramElementFromHexagram(hexagram, bodyTrigram);
  const usageElement = getTrigramElementFromHexagram(hexagram, usageTrigram);

  const relationship = calculateBodyUsageRelationship(bodyElement, usageElement);

  // 获取卦名
  const trigramMap: Record<string, string> = {
    'Heaven': '乾',
    'Lake': '兑',
    'Fire': '离',
    'Thunder': '震',
    'Wind': '巽',
    'Water': '坎',
    'Mountain': '艮',
    'Earth': '坤'
  };

  return {
    shiYao: actualShiYao,
    yingYao: shiYingInfo.yingYao,
    bodyTrigram,
    usageTrigram,
    bodyElement,
    usageElement,
    relationship,
    bodyTrigramName: bodyTrigram === 'upper' 
      ? (trigramMap[hexagram.trigrams.upper] || '未知')
      : (trigramMap[hexagram.trigrams.lower] || '未知'),
    usageTrigramName: usageTrigram === 'upper'
      ? (trigramMap[hexagram.trigrams.upper] || '未知')
      : (trigramMap[hexagram.trigrams.lower] || '未知')
  };
}

/**
 * 体用关系的现代解读
 */
export interface BodyUsageInterpretation {
  /** 关系类型 */
  relationship: BodyUsageRelationship;
  /** 总体含义 */
  generalMeaning: string;
  /** 事业建议 */
  careerAdvice: string;
  /** 财运建议 */
  wealthAdvice: string;
  /** 感情建议 */
  relationshipAdvice: string;
  /** 健康建议 */
  healthAdvice: string;
  /** 行动指导 */
  actionGuidance: string;
}

/**
 * 获取体用关系的解读
 * @param relationship 体用关系
 * @returns 解读内容
 */
export function getBodyUsageInterpretation(
  relationship: BodyUsageRelationship
): BodyUsageInterpretation {
  const interpretations: Record<BodyUsageRelationship, BodyUsageInterpretation> = {
    'body-ke-usage': {
      relationship: 'body-ke-usage',
      generalMeaning: '体卦克用卦，表明您能够主动控制局面，有利于主动出击、谋求发展。整体趋势较为积极，但需要付出努力才能达成目标。',
      careerAdvice: '事业方面，当前形势有利于您主动把握机会。可以积极争取项目、提出方案，但需要踏实做事，不能过于急躁。',
      wealthAdvice: '财运方面，有求财的有利条件，但需要通过自己的努力去争取。投资理财需要谨慎，避免冲动决策。',
      relationshipAdvice: '感情方面，您在关系中处于主动地位，可以积极表达自己的心意。但要注意尊重对方，不要过于强势。',
      healthAdvice: '健康方面，身体状态总体良好，但要避免过度劳累。注意劳逸结合，保持规律作息。',
      actionGuidance: '建议采取积极主动的态度，但要有计划、有步骤地推进，避免盲目行动。'
    },
    'usage-ke-body': {
      relationship: 'usage-ke-body',
      generalMeaning: '用卦克体卦，表明外部环境对您有一定压力，不宜贸然行动。需要保持谨慎，以守为主，等待更好的时机。',
      careerAdvice: '事业方面，可能面临一些外部压力或阻碍。建议暂时保持稳定，不宜主动寻求变动。可以加强学习，提升自身能力。',
      wealthAdvice: '财运方面，当前不是最佳的投资时机，建议保持谨慎。避免大额支出，可以适当储蓄以备不时之需。',
      relationshipAdvice: '感情方面，可能遇到一些阻力或挑战。需要耐心沟通，不要急于求成。给对方一些时间和空间。',
      healthAdvice: '健康方面，需要特别注意身体健康，避免过度消耗。如有不适，应及时就医检查。',
      actionGuidance: '建议以守为主，保持耐心，等待时机成熟后再行动。同时要做好充分准备。'
    },
    'body-sheng-usage': {
      relationship: 'body-sheng-usage',
      generalMeaning: '体卦生用卦，表明您需要付出较多，资源可能会向外输出。虽然有利于他人或外部环境，但需要谨慎管理自己的资源。',
      careerAdvice: '事业方面，需要投入较多时间和精力，但可能短期内难以看到明显回报。建议做好长期规划，保持耐心。',
      wealthAdvice: '财运方面，支出可能较多，需要合理规划财务。避免不必要的开支，保持收支平衡。',
      relationshipAdvice: '感情方面，您在关系中需要付出更多，但要注意平衡。不要一味付出，也要让对方感受到您的需求。',
      healthAdvice: '健康方面，需要注意劳逸结合，避免过度消耗精力。适当休息，保持身心平衡。',
      actionGuidance: '建议合理规划资源，既要积极付出，也要注意保护自己的利益，避免过度消耗。'
    },
    'usage-sheng-body': {
      relationship: 'usage-sheng-body',
      generalMeaning: '用卦生体卦，表明外部环境对您有利，能够得到帮助和支持。这是一个较为有利的时机，可以积极发展。',
      careerAdvice: '事业方面，外部环境对您有利，容易得到贵人相助或好的机会。可以积极争取，但要把握好分寸。',
      wealthAdvice: '财运方面，有不错的财运机会，可能通过合作或外部资源获得收益。可以适当进行投资，但要注意风险控制。',
      relationshipAdvice: '感情方面，容易得到对方的理解和支持，关系发展较为顺利。可以主动推进关系，但要尊重对方意愿。',
      healthAdvice: '健康方面，身体状态较好，能够得到良好的休息和调养。继续保持良好的生活习惯。',
      actionGuidance: '建议把握当前有利时机，积极发展。同时要心怀感恩，与他人保持良好的合作关系。'
    },
    'bihe': {
      relationship: 'bihe',
      generalMeaning: '体用比和，表明内外和谐统一，形势稳定。虽然缺乏明显的变化动力，但整体环境较为平稳。',
      careerAdvice: '事业方面，当前形势稳定，适合保持现状，不宜贸然变动。可以在现有基础上稳步发展，积累经验。',
      wealthAdvice: '财运方面，财务状态稳定，既无大的进账也无大的支出。适合稳健理财，不宜冒险投资。',
      relationshipAdvice: '感情方面，关系稳定和谐，但可能缺乏激情。可以通过增加互动和沟通来增进感情。',
      healthAdvice: '健康方面，身体状态平稳，继续保持良好的生活习惯。注意预防疾病，保持定期体检。',
      actionGuidance: '建议保持现状，稳步发展。在稳定的基础上寻找突破点，但不要急于求成。'
    }
  };

  return interpretations[relationship];
}


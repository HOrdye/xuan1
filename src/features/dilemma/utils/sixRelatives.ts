/**
 * 六亲定位算法
 * 基于卦宫五行和爻位五行确定六亲关系
 */

import type { Element } from './trigramElements';

export type SixRelative = 'parent' | 'sibling' | 'offspring' | 'wealth' | 'officer';

/**
 * 六亲中文名称映射
 */
export const SIX_RELATIVES_NAMES: Record<SixRelative, string> = {
  'parent': '父母',
  'sibling': '兄弟',
  'offspring': '子孙',
  'wealth': '妻财',
  'officer': '官鬼'
};

/**
 * 地支对应的五行
 */
const DI_ZHI_ELEMENTS: Record<string, Element> = {
  '子': '水',
  '丑': '土',
  '寅': '木',
  '卯': '木',
  '辰': '土',
  '巳': '火',
  '午': '火',
  '未': '土',
  '申': '金',
  '酉': '金',
  '戌': '土',
  '亥': '水'
};

/**
 * 根据纳甲地支获取五行
 * @param dizhi 地支（子、丑、寅等）
 * @returns 五行属性
 */
export function getElementByDiZhi(dizhi: string): Element {
  return DI_ZHI_ELEMENTS[dizhi] || '金'; // 默认返回金
}

/**
 * 基于卦宫五行和爻位五行确定六亲关系
 * 
 * 六亲定义（以卦宫五行为"我"）：
 * - 父母：生我者
 * - 兄弟：同我者
 * - 子孙：我生者
 * - 妻财：我克者
 * - 官鬼：克我者
 * 
 * @param palaceElement 卦宫五行（"我"）
 * @param yaoElement 爻位五行
 * @returns 六亲关系
 */
export function calculateSixRelative(palaceElement: Element, yaoElement: Element): SixRelative {
  // 相同五行 → 兄弟
  if (palaceElement === yaoElement) {
    return 'sibling';
  }

  // 五行生克关系
  const shengMap: Record<Element, Element> = {
    '金': '水',
    '水': '木',
    '木': '火',
    '火': '土',
    '土': '金'
  };

  const keMap: Record<Element, Element> = {
    '金': '木',
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金'
  };

  // 检查"生我"：如果yioElement生palaceElement，则为父母
  // 即：yaoElement === shengMap[palaceElement的反向查找]
  for (const [key, value] of Object.entries(shengMap)) {
    if (value === palaceElement && key === yaoElement) {
      return 'parent';
    }
  }

  // 检查"我生"：如果palaceElement生yioElement，则为子孙
  if (shengMap[palaceElement] === yaoElement) {
    return 'offspring';
  }

  // 检查"我克"：如果palaceElement克yioElement，则为妻财
  if (keMap[palaceElement] === yaoElement) {
    return 'wealth';
  }

  // 检查"克我"：如果yioElement克palaceElement，则为官鬼
  if (keMap[yaoElement] === palaceElement) {
    return 'officer';
  }

  // 默认返回兄弟（理论上不会到这里）
  return 'sibling';
}

/**
 * 单个爻位的六亲信息
 */
export interface YaoSixRelative {
  /** 爻位（0-5，对应初爻到上爻） */
  position: number;
  /** 六亲关系 */
  relative: SixRelative;
  /** 爻位五行 */
  element: Element;
  /** 纳甲地支 */
  dizhi: string;
}

/**
 * 为整个卦计算所有爻位的六亲
 * @param palaceElement 卦宫五行
 * @param naJiaSequence 纳甲地支序列（6个地支）
 * @returns 六亲信息数组
 */
export function calculateAllSixRelatives(
  palaceElement: Element,
  naJiaSequence: [string, string, string, string, string, string]
): YaoSixRelative[] {
  return naJiaSequence.map((dizhi, index) => {
    const element = getElementByDiZhi(dizhi);
    const relative = calculateSixRelative(palaceElement, element);

    return {
      position: index,
      relative,
      element,
      dizhi
    };
  });
}

/**
 * 根据问题类型获取重点关注的六亲
 * @param questionType 问题类型
 * @returns 重点六亲数组
 */
export function getKeyRelativesByQuestionType(
  questionType: 'career' | 'wealth' | 'relationship' | 'health' | 'study' | 'general'
): SixRelative[] {
  switch (questionType) {
    case 'career':
      return ['officer', 'parent']; // 官鬼（事业）、父母（工作环境）
    case 'wealth':
      return ['wealth', 'offspring']; // 妻财（财运）、子孙（投资）
    case 'relationship':
      return ['wealth', 'officer']; // 妻财（异性）、官鬼（感情对象）
    case 'health':
      return ['officer', 'offspring']; // 官鬼（疾病）、子孙（健康）
    case 'study':
      return ['parent', 'officer']; // 父母（学习）、官鬼（考试）
    default:
      return []; // 一般问题不特别关注
  }
}

/**
 * 获取六亲的中文名称
 * @param relative 六亲类型
 * @returns 中文名称
 */
export function getSixRelativeName(relative: SixRelative): string {
  return SIX_RELATIVES_NAMES[relative];
}


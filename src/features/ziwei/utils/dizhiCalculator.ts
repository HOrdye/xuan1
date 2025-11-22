/**
 * 地支计算器
 * 实现地支与宫位的对应关系计算
 */

import type { Dizhi } from '../types';

/**
 * 12地支列表（按顺序）
 */
export const DIZHI_LIST: Dizhi[] = [
  '子', '丑', '寅', '卯', '辰', '巳',
  '午', '未', '申', '酉', '戌', '亥'
];

/**
 * 地支五行属性
 */
export const DIZHI_WUXING: Record<Dizhi, '金' | '木' | '水' | '火' | '土'> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

/**
 * 地支阴阳属性
 */
export const DIZHI_YINYANG: Record<Dizhi, '阴' | '阳'> = {
  '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴',
  '辰': '阳', '巳': '阴', '午': '阳', '未': '阴',
  '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴'
};

/**
 * 根据出生时辰确定命宫地支
 * 
 * 时辰与命宫地支对应关系：
 * - 子时(23:00-01:00) -> 子
 * - 丑时(01:00-03:00) -> 丑
 * - 寅时(03:00-05:00) -> 寅
 * - 卯时(05:00-07:00) -> 卯
 * - 辰时(07:00-09:00) -> 辰
 * - 巳时(09:00-11:00) -> 巳
 * - 午时(11:00-13:00) -> 午
 * - 未时(13:00-15:00) -> 未
 * - 申时(15:00-17:00) -> 申
 * - 酉时(17:00-19:00) -> 酉
 * - 戌时(19:00-21:00) -> 戌
 * - 亥时(21:00-23:00) -> 亥
 */
export function locateMingGongDizhi(birthHour: number): Dizhi {
  // 将小时转换为时辰索引（0-11）
  // 注意：子时跨越两天，23:00-01:00都算子时
  let hourIndex: number;
  
  if (birthHour >= 23 || birthHour < 1) {
    hourIndex = 0; // 子时
  } else {
    hourIndex = Math.floor((birthHour - 1) / 2) + 1;
  }
  
  return DIZHI_LIST[hourIndex];
}

/**
 * 根据命宫地支，计算所有12个宫位的地支
 * 从命宫开始，顺时针排列
 * 
 * @param mingGongDizhi 命宫地支
 * @returns 12个宫位的地支数组（索引0对应命宫）
 */
export function calculatePalaceDizhi(mingGongDizhi: Dizhi): Dizhi[] {
  const mingGongIndex = DIZHI_LIST.indexOf(mingGongDizhi);
  const result: Dizhi[] = [];
  
  // 从命宫开始，顺时针排列12个地支
  for (let i = 0; i < 12; i++) {
    const index = (mingGongIndex + i) % 12;
    result.push(DIZHI_LIST[index]);
  }
  
  return result;
}

/**
 * 获取地支的五行属性
 */
export function getDizhiWuxing(dizhi: Dizhi): '金' | '木' | '水' | '火' | '土' {
  return DIZHI_WUXING[dizhi];
}

/**
 * 获取地支的阴阳属性
 */
export function getDizhiYinyang(dizhi: Dizhi): '阴' | '阳' {
  return DIZHI_YINYANG[dizhi];
}

/**
 * 根据地支索引获取地支
 */
export function getDizhiByIndex(index: number): Dizhi {
  return DIZHI_LIST[index % 12];
}

/**
 * 获取地支的索引
 */
export function getDizhiIndex(dizhi: Dizhi): number {
  return DIZHI_LIST.indexOf(dizhi);
}


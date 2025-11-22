/**
 * 命主身主计算器
 * 实现命主星和身主星的计算
 */

import type { Dizhi } from '../types';
import { getDizhiIndex } from './dizhiCalculator';

/**
 * 命主星对照表
 * 根据命宫地支确定命主星
 * 
 * 规则：
 * - 子：贪狼
 * - 丑：巨门
 * - 寅：禄存
 * - 卯：文曲
 * - 辰：廉贞
 * - 巳：武曲
 * - 午：破军
 * - 未：武曲
 * - 申：廉贞
 * - 酉：文曲
 * - 戌：禄存
 * - 亥：巨门
 */
const MINGZHU_MAP: Record<Dizhi, string> = {
  '子': '贪狼',
  '丑': '巨门',
  '寅': '禄存',
  '卯': '文曲',
  '辰': '廉贞',
  '巳': '武曲',
  '午': '破军',
  '未': '武曲',
  '申': '廉贞',
  '酉': '文曲',
  '戌': '禄存',
  '亥': '巨门'
};

/**
 * 身主星对照表
 * 根据出生时辰确定身主星
 * 
 * 规则：
 * - 子时：火星
 * - 丑时：天相
 * - 寅时：天梁
 * - 卯时：天同
 * - 辰时：文昌
 * - 巳时：天机
 * - 午时：火星
 * - 未时：天相
 * - 申时：天梁
 * - 酉时：天同
 * - 戌时：文昌
 * - 亥时：天机
 */
const SHENZHU_MAP: Record<Dizhi, string> = {
  '子': '火星',
  '丑': '天相',
  '寅': '天梁',
  '卯': '天同',
  '辰': '文昌',
  '巳': '天机',
  '午': '火星',
  '未': '天相',
  '申': '天梁',
  '酉': '天同',
  '戌': '文昌',
  '亥': '天机'
};

/**
 * 计算命主星
 * 根据命宫地支确定命主星
 * 
 * @param mingGongDizhi 命宫地支
 * @returns 命主星名称
 */
export function calculateMingZhu(mingGongDizhi: Dizhi): string {
  return MINGZHU_MAP[mingGongDizhi] || '未知';
}

/**
 * 计算身主星
 * 根据出生时辰确定身主星
 * 
 * @param birthHour 出生时辰（0-23）
 * @returns 身主星名称
 */
export function calculateShenZhu(birthHour: number): string {
  // 将小时转换为时辰地支
  let hourDizhi: Dizhi;
  
  if (birthHour >= 23 || birthHour < 1) {
    hourDizhi = '子';
  } else if (birthHour >= 1 && birthHour < 3) {
    hourDizhi = '丑';
  } else if (birthHour >= 3 && birthHour < 5) {
    hourDizhi = '寅';
  } else if (birthHour >= 5 && birthHour < 7) {
    hourDizhi = '卯';
  } else if (birthHour >= 7 && birthHour < 9) {
    hourDizhi = '辰';
  } else if (birthHour >= 9 && birthHour < 11) {
    hourDizhi = '巳';
  } else if (birthHour >= 11 && birthHour < 13) {
    hourDizhi = '午';
  } else if (birthHour >= 13 && birthHour < 15) {
    hourDizhi = '未';
  } else if (birthHour >= 15 && birthHour < 17) {
    hourDizhi = '申';
  } else if (birthHour >= 17 && birthHour < 19) {
    hourDizhi = '酉';
  } else if (birthHour >= 19 && birthHour < 21) {
    hourDizhi = '戌';
  } else {
    hourDizhi = '亥';
  }
  
  return SHENZHU_MAP[hourDizhi] || '未知';
}

/**
 * 获取命主星的说明
 */
export function getMingZhuDescription(mingZhu: string): string {
  const descriptions: Record<string, string> = {
    '贪狼': '欲望强烈，多才多艺，善于交际',
    '巨门': '口才好，善于分析，有时多疑',
    '禄存': '财禄之星，理财能力强',
    '文曲': '文化功名，文学才华',
    '廉贞': '廉洁自律，原则性强',
    '武曲': '刚毅果断，执行力强',
    '破军': '变动性强，勇于突破'
  };
  
  return descriptions[mingZhu] || '';
}

/**
 * 获取身主星的说明
 */
export function getShenZhuDescription(shenZhu: string): string {
  const descriptions: Record<string, string> = {
    '火星': '行动力强，热情冲动',
    '天相': '协调能力强，善于合作',
    '天梁': '稳重可靠，有责任感',
    '天同': '温和善良，人缘好',
    '文昌': '文化功名，学习能力强',
    '天机': '思维敏捷，善于谋划'
  };
  
  return descriptions[shenZhu] || '';
}


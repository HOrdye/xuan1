/**
 * 宫干计算器
 * 实现每个宫位天干（宫干）的计算
 */

import type { Tiangan, Dizhi } from '../types';
import { TIANGAN_LIST, getTianganByYear } from '../data/sihua';
import { getDizhiIndex } from './dizhiCalculator';

/**
 * 宫干计算规则
 * 
 * 根据命宫地支和出生年份天干，计算命宫天干
 * 然后根据命宫天干地支，计算其他11个宫位的天干
 * 
 * 规则：
 * 1. 命宫天干 = 根据命宫地支和出生年份天干计算
 * 2. 其他宫位天干 = 根据命宫天干和地支差计算
 */

/**
 * 计算命宫天干
 * 
 * 命宫天干的计算规则：
 * - 根据出生年份天干和命宫地支，查表确定
 * - 或者根据"五虎遁"口诀计算
 * 
 * 五虎遁口诀：
 * - 甲己之年丙作首（甲年、己年，寅月天干为丙）
 * - 乙庚之年戊为头（乙年、庚年，寅月天干为戊）
 * - 丙辛之年寻庚起（丙年、辛年，寅月天干为庚）
 * - 丁壬壬寅顺水流（丁年、壬年，寅月天干为壬）
 * - 若问戊癸何处起（戊年、癸年，寅月天干为甲）
 * - 甲寅之上好追求
 * 
 * 但这里我们需要的是命宫天干，不是月干
 * 命宫天干的计算：根据命宫地支和出生年份天干
 */
export function calculateMingGongTiangan(
  birthYearTiangan: Tiangan,
  mingGongDizhi: Dizhi
): Tiangan {
  // 命宫天干的计算方法：
  // 根据出生年份天干和命宫地支，使用"五子遁"或查表法
  
  // 简化方法：使用固定规则
  // 实际应该根据更复杂的规则计算，这里先使用简化版本
  
  const yearTianganIndex = TIANGAN_LIST.indexOf(birthYearTiangan);
  const dizhiIndex = getDizhiIndex(mingGongDizhi);
  
  // 根据命宫地支和年份天干计算命宫天干
  // 规则：命宫天干 = (年份天干索引 + 地支索引) % 10
  // 但实际规则更复杂，这里使用简化版本
  
  // 更准确的方法：使用五子遁规则
  // 子时对应的天干根据年份天干确定：
  // 甲己年子时为甲，乙庚年子时为丙，丙辛年子时为戊，丁壬年子时为庚，戊癸年子时为壬
  
  const wuzidunMap: Record<Tiangan, Tiangan> = {
    '甲': '甲', // 甲年子时为甲
    '乙': '丙', // 乙年子时为丙
    '丙': '戊', // 丙年子时为戊
    '丁': '庚', // 丁年子时为庚
    '戊': '壬', // 戊年子时为壬
    '己': '甲', // 己年子时为甲
    '庚': '丙', // 庚年子时为丙
    '辛': '戊', // 辛年子时为戊
    '壬': '庚', // 壬年子时为庚
    '癸': '壬'  // 癸年子时为壬
  };
  
  // 子时的天干
  const ziTiangan = wuzidunMap[birthYearTiangan];
  const ziTianganIndex = TIANGAN_LIST.indexOf(ziTiangan);
  
  // 根据命宫地支索引，计算命宫天干
  const mingGongTianganIndex = (ziTianganIndex + dizhiIndex) % 10;
  return TIANGAN_LIST[mingGongTianganIndex];
}

/**
 * 计算所有12个宫位的天干
 * 
 * @param mingGongTiangan 命宫天干
 * @param mingGongDizhi 命宫地支
 * @param palaceDizhiList 12个宫位的地支数组
 * @returns 12个宫位的天干数组（索引0对应命宫）
 */
export function calculateAllGonggan(
  mingGongTiangan: Tiangan,
  mingGongDizhi: Dizhi,
  palaceDizhiList: Dizhi[]
): Tiangan[] {
  const mingGongTianganIndex = TIANGAN_LIST.indexOf(mingGongTiangan);
  const mingGongDizhiIndex = getDizhiIndex(mingGongDizhi);
  const result: Tiangan[] = [];
  
  for (let i = 0; i < 12; i++) {
    const palaceDizhi = palaceDizhiList[i];
    const palaceDizhiIndex = getDizhiIndex(palaceDizhi);
    
    // 计算地支差
    const dizhiDiff = (palaceDizhiIndex - mingGongDizhiIndex + 12) % 12;
    
    // 计算天干：命宫天干 + 地支差
    const tianganIndex = (mingGongTianganIndex + dizhiDiff) % 10;
    result.push(TIANGAN_LIST[tianganIndex]);
  }
  
  return result;
}

/**
 * 获取天干地支组合（如：甲子、乙丑等）
 */
export function getTianganDizhi(tiangan: Tiangan, dizhi: Dizhi): string {
  return `${tiangan}${dizhi}`;
}


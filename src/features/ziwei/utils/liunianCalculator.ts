/**
 * 流年流月流日计算器
 * 实现时间维度的运势计算
 */

import type { ZiweiChart, BirthInfo, Tiangan, Dizhi, Sihua, Palace } from '../types';
import { getTianganByYear, getSihuaByTiangan } from '../data/sihua';
import { placeSuiqianTwelve } from './auxiliaryStars';
import { calculateSihuaFeixing, type SihuaFeixingResult } from './sihuaFeixingCalculator';

/**
 * 根据年份获取地支
 */
function getDizhiByYear(year: number): Dizhi {
  const dizhiList: Dizhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const index = (year - 4) % 12;
  return dizhiList[index < 0 ? index + 12 : index];
}

/**
 * 根据年份获取天干地支
 */
export function getTianganDizhiByYear(year: number): { tiangan: Tiangan; dizhi: Dizhi } {
  const tiangan = getTianganByYear(year);
  const dizhi = getDizhiByYear(year);
  return { tiangan, dizhi };
}

/**
 * 根据月份获取流月天干地支
 * 流月天干：根据流年天干和月份计算
 * 流月地支：固定（正月寅、二月卯...）
 */
export function getTianganDizhiByMonth(
  liunianTiangan: Tiangan,
  month: number
): { tiangan: Tiangan; dizhi: Dizhi } {
  // 流月地支：固定顺序
  const dizhiList: Dizhi[] = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
  const dizhi = dizhiList[month - 1] || '寅';

  // 流月天干：根据流年天干和月份计算（五虎遁）
  const tianganList: Tiangan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const tianganIndex = tianganList.indexOf(liunianTiangan);
  
  // 五虎遁规则：甲己之年丙作首，乙庚之年戊为头，丙辛之年寻庚起，丁壬壬寅顺水流，戊癸甲寅好追求
  const wuhudunMap: Record<Tiangan, Tiangan> = {
    '甲': '丙', '己': '丙', // 甲己年正月天干为丙
    '乙': '戊', '庚': '戊', // 乙庚年正月天干为戊
    '丙': '庚', '辛': '庚', // 丙辛年正月天干为庚
    '丁': '壬', '壬': '壬', // 丁壬年正月天干为壬
    '戊': '甲', '癸': '甲'  // 戊癸年正月天干为甲
  };
  
  const yueTianganStart = wuhudunMap[liunianTiangan];
  const yueTianganStartIndex = tianganList.indexOf(yueTianganStart);
  const yueTianganIndex = (yueTianganStartIndex + month - 1) % 10;
  const tiangan = tianganList[yueTianganIndex];

  return { tiangan, dizhi };
}

/**
 * 根据日期获取流日天干地支
 * 流日天干地支：根据流月天干地支和日期计算
 */
export function getTianganDizhiByDay(
  liumonthTiangan: Tiangan,
  liumonthDizhi: Dizhi,
  day: number
): { tiangan: Tiangan; dizhi: Dizhi } {
  const tianganList: Tiangan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const dizhiList: Dizhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // 计算流日天干地支（60甲子循环）
  const tianganIndex = tianganList.indexOf(liumonthTiangan);
  const dizhiIndex = dizhiList.indexOf(liumonthDizhi);
  
  // 从流月天干地支开始，加上日期差
  const totalOffset = day - 1; // 日期从1开始，所以减1
  const newTianganIndex = (tianganIndex + totalOffset) % 10;
  const newDizhiIndex = (dizhiIndex + totalOffset) % 12;
  
  const tiangan = tianganList[newTianganIndex];
  const dizhi = dizhiList[newDizhiIndex];

  return { tiangan, dizhi };
}

/**
 * 计算流年四化
 */
export function calculateLiunianSihua(year: number): Sihua {
  const { tiangan } = getTianganDizhiByYear(year);
  return getSihuaByTiangan(tiangan);
}

/**
 * 计算流月四化
 */
export function calculateLiumonthSihua(liunianTiangan: Tiangan, month: number): Sihua {
  const { tiangan } = getTianganDizhiByMonth(liunianTiangan, month);
  return getSihuaByTiangan(tiangan);
}

/**
 * 计算流日四化
 */
export function calculateLiudaySihua(liudayTiangan: Tiangan): Sihua {
  return getSihuaByTiangan(liudayTiangan);
}

/**
 * 计算流年命宫位置
 * 流年命宫：根据流年地支确定
 */
export function calculateLiunianMingGong(liunianDizhi: Dizhi): number {
  const dizhiList: Dizhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  return dizhiList.indexOf(liunianDizhi);
}

/**
 * 计算流月命宫位置
 * 流月命宫：根据流月地支确定
 */
export function calculateLiumonthMingGong(liumonthDizhi: Dizhi): number {
  const dizhiList: Dizhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  return dizhiList.indexOf(liumonthDizhi);
}

/**
 * 计算流日命宫位置
 * 流日命宫：根据流日地支确定
 */
export function calculateLiudayMingGong(liudayDizhi: Dizhi): number {
  const dizhiList: Dizhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  return dizhiList.indexOf(liudayDizhi);
}

/**
 * 流年对本命盘的影响
 */
export interface LiunianPalaceImpact {
  palaceIndex: number;
  palaceName: string;
  sihuaImpact: {
    lu?: string[];  // 化禄飞入的星曜
    quan?: string[];
    ke?: string[];
    ji?: string[];  // 化忌飞入的星曜（最重要）
  };
  feixingResult?: SihuaFeixingResult; // 完整的四化飞星结果
}

/**
 * 流年信息接口
 */
export interface LiunianInfo {
  year: number;
  tiangan: Tiangan;
  dizhi: Dizhi;
  sihua: Sihua;
  mingGongIndex: number;
  suiqianStars?: import('../types').StarPositions; // 流年岁前十二星位置
  impactOnPalaces?: LiunianPalaceImpact[]; // 流年对本命盘各宫位的影响
  feixingResult?: SihuaFeixingResult; // 流年四化飞入本命盘的结果
}

/**
 * 流月信息接口
 */
export interface LiumonthInfo {
  year: number;
  month: number;
  tiangan: Tiangan;
  dizhi: Dizhi;
  sihua: Sihua;
  mingGongIndex: number;
  impactOnPalaces?: LiunianPalaceImpact[]; // 流月对本命盘各宫位的影响
  feixingResult?: SihuaFeixingResult; // 流月四化飞入本命盘的结果
}

/**
 * 流日信息接口
 */
export interface LiudayInfo {
  year: number;
  month: number;
  day: number;
  tiangan: Tiangan;
  dizhi: Dizhi;
  sihua: Sihua;
  mingGongIndex: number;
  impactOnPalaces?: LiunianPalaceImpact[]; // 流日对本命盘各宫位的影响
  feixingResult?: SihuaFeixingResult; // 流日四化飞入本命盘的结果
}

/**
 * 计算流年信息
 * @param year 年份
 * @param chart 本命盘（可选，如果提供则计算流年对本命盘的影响）
 */
export function calculateLiunianInfo(year: number, chart?: ZiweiChart): LiunianInfo {
  const { tiangan, dizhi } = getTianganDizhiByYear(year);
  const sihua = calculateLiunianSihua(year);
  const mingGongIndex = calculateLiunianMingGong(dizhi);

  // 计算流年岁前十二星位置
  const suiqianStars = placeSuiqianTwelve(dizhi);

  const result: LiunianInfo = {
    year,
    tiangan,
    dizhi,
    sihua,
    mingGongIndex,
    suiqianStars
  };

  // 如果提供了本命盘，计算流年对本命盘的影响
  if (chart && chart.palaces) {
    // 计算流年四化飞入本命盘各宫位
    const feixingResult = calculateSihuaFeixing(chart.palaces, sihua);
    result.feixingResult = feixingResult;

    // 生成各宫位的影响分析
    const impactOnPalaces: LiunianPalaceImpact[] = [];
    
    // 遍历所有宫位，找出受流年四化影响的宫位
    for (let i = 0; i < chart.palaces.length; i++) {
      const palace = chart.palaces[i];
      const impact: LiunianPalaceImpact = {
        palaceIndex: i,
        palaceName: palace.name,
        sihuaImpact: {}
      };

      // 检查化禄影响
      const luStars = feixingResult.lu.filter(f => f.palaceIndex === i).map(f => f.star);
      if (luStars.length > 0) {
        impact.sihuaImpact.lu = luStars;
      }

      // 检查化权影响
      const quanStars = feixingResult.quan.filter(f => f.palaceIndex === i).map(f => f.star);
      if (quanStars.length > 0) {
        impact.sihuaImpact.quan = quanStars;
      }

      // 检查化科影响
      const keStars = feixingResult.ke.filter(f => f.palaceIndex === i).map(f => f.star);
      if (keStars.length > 0) {
        impact.sihuaImpact.ke = keStars;
      }

      // 检查化忌影响（最重要）
      const jiStars = feixingResult.ji.filter(f => f.palaceIndex === i).map(f => f.star);
      if (jiStars.length > 0) {
        impact.sihuaImpact.ji = jiStars;
      }

      // 如果有任何四化影响，添加到结果中
      if (luStars.length > 0 || quanStars.length > 0 || keStars.length > 0 || jiStars.length > 0) {
        impact.feixingResult = {
          lu: feixingResult.lu.filter(f => f.palaceIndex === i),
          quan: feixingResult.quan.filter(f => f.palaceIndex === i),
          ke: feixingResult.ke.filter(f => f.palaceIndex === i),
          ji: feixingResult.ji.filter(f => f.palaceIndex === i)
        };
        impactOnPalaces.push(impact);
      }
    }

    result.impactOnPalaces = impactOnPalaces;
  }

  return result;
}

/**
 * 计算流月信息
 * @param year 年份
 * @param month 月份
 * @param chart 本命盘（可选，如果提供则计算流月对本命盘的影响）
 */
export function calculateLiumonthInfo(year: number, month: number, chart?: ZiweiChart): LiumonthInfo {
  const liunianInfo = calculateLiunianInfo(year);
  const { tiangan, dizhi } = getTianganDizhiByMonth(liunianInfo.tiangan, month);
  const sihua = calculateLiumonthSihua(liunianInfo.tiangan, month);
  const mingGongIndex = calculateLiumonthMingGong(dizhi);

  const result: LiumonthInfo = {
    year,
    month,
    tiangan,
    dizhi,
    sihua,
    mingGongIndex
  };

  // 如果提供了本命盘，计算流月对本命盘的影响
  if (chart && chart.palaces) {
    // 计算流月四化飞入本命盘各宫位
    const feixingResult = calculateSihuaFeixing(chart.palaces, sihua);
    result.feixingResult = feixingResult;

    // 生成各宫位的影响分析
    const impactOnPalaces: LiunianPalaceImpact[] = [];
    
    for (let i = 0; i < chart.palaces.length; i++) {
      const palace = chart.palaces[i];
      const impact: LiunianPalaceImpact = {
        palaceIndex: i,
        palaceName: palace.name,
        sihuaImpact: {}
      };

      // 检查化禄影响
      const luStars = feixingResult.lu.filter(f => f.palaceIndex === i).map(f => f.star);
      if (luStars.length > 0) {
        impact.sihuaImpact.lu = luStars;
      }

      // 检查化权影响
      const quanStars = feixingResult.quan.filter(f => f.palaceIndex === i).map(f => f.star);
      if (quanStars.length > 0) {
        impact.sihuaImpact.quan = quanStars;
      }

      // 检查化科影响
      const keStars = feixingResult.ke.filter(f => f.palaceIndex === i).map(f => f.star);
      if (keStars.length > 0) {
        impact.sihuaImpact.ke = keStars;
      }

      // 检查化忌影响（最重要）
      const jiStars = feixingResult.ji.filter(f => f.palaceIndex === i).map(f => f.star);
      if (jiStars.length > 0) {
        impact.sihuaImpact.ji = jiStars;
      }

      // 如果有任何四化影响，添加到结果中
      if (luStars.length > 0 || quanStars.length > 0 || keStars.length > 0 || jiStars.length > 0) {
        impact.feixingResult = {
          lu: feixingResult.lu.filter(f => f.palaceIndex === i),
          quan: feixingResult.quan.filter(f => f.palaceIndex === i),
          ke: feixingResult.ke.filter(f => f.palaceIndex === i),
          ji: feixingResult.ji.filter(f => f.palaceIndex === i)
        };
        impactOnPalaces.push(impact);
      }
    }

    result.impactOnPalaces = impactOnPalaces;
  }

  return result;
}

/**
 * 计算流日信息
 * @param year 年份
 * @param month 月份
 * @param day 日期
 * @param chart 本命盘（可选，如果提供则计算流日对本命盘的影响）
 */
export function calculateLiudayInfo(year: number, month: number, day: number, chart?: ZiweiChart): LiudayInfo {
  const liumonthInfo = calculateLiumonthInfo(year, month);
  const { tiangan, dizhi } = getTianganDizhiByDay(liumonthInfo.tiangan, liumonthInfo.dizhi, day);
  const sihua = calculateLiudaySihua(tiangan);
  const mingGongIndex = calculateLiudayMingGong(dizhi);

  const result: LiudayInfo = {
    year,
    month,
    day,
    tiangan,
    dizhi,
    sihua,
    mingGongIndex
  };

  // 如果提供了本命盘，计算流日对本命盘的影响
  if (chart && chart.palaces) {
    // 计算流日四化飞入本命盘各宫位
    const feixingResult = calculateSihuaFeixing(chart.palaces, sihua);
    result.feixingResult = feixingResult;

    // 生成各宫位的影响分析
    const impactOnPalaces: LiunianPalaceImpact[] = [];
    
    for (let i = 0; i < chart.palaces.length; i++) {
      const palace = chart.palaces[i];
      const impact: LiunianPalaceImpact = {
        palaceIndex: i,
        palaceName: palace.name,
        sihuaImpact: {}
      };

      // 检查化禄影响
      const luStars = feixingResult.lu.filter(f => f.palaceIndex === i).map(f => f.star);
      if (luStars.length > 0) {
        impact.sihuaImpact.lu = luStars;
      }

      // 检查化权影响
      const quanStars = feixingResult.quan.filter(f => f.palaceIndex === i).map(f => f.star);
      if (quanStars.length > 0) {
        impact.sihuaImpact.quan = quanStars;
      }

      // 检查化科影响
      const keStars = feixingResult.ke.filter(f => f.palaceIndex === i).map(f => f.star);
      if (keStars.length > 0) {
        impact.sihuaImpact.ke = keStars;
      }

      // 检查化忌影响（最重要）
      const jiStars = feixingResult.ji.filter(f => f.palaceIndex === i).map(f => f.star);
      if (jiStars.length > 0) {
        impact.sihuaImpact.ji = jiStars;
      }

      // 如果有任何四化影响，添加到结果中
      if (luStars.length > 0 || quanStars.length > 0 || keStars.length > 0 || jiStars.length > 0) {
        impact.feixingResult = {
          lu: feixingResult.lu.filter(f => f.palaceIndex === i),
          quan: feixingResult.quan.filter(f => f.palaceIndex === i),
          ke: feixingResult.ke.filter(f => f.palaceIndex === i),
          ji: feixingResult.ji.filter(f => f.palaceIndex === i)
        };
        impactOnPalaces.push(impact);
      }
    }

    result.impactOnPalaces = impactOnPalaces;
  }

  return result;
}


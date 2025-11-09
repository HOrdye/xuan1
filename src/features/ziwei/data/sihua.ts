/**
 * 紫微斗数四化表
 * 十干四化对应关系
 */

import type { Sihua, Tiangan } from '../types';

/**
 * 十干四化表
 */
export const SIHUA_TABLE: Record<Tiangan, Sihua> = {
  '甲': { lu: '廉贞', quan: '破军', ke: '武曲', ji: '太阳' },
  '乙': { lu: '天机', quan: '天梁', ke: '紫微', ji: '太阴' },
  '丙': { lu: '天同', quan: '天机', ke: '文昌', ji: '廉贞' },
  '丁': { lu: '太阴', quan: '天同', ke: '天机', ji: '巨门' },
  '戊': { lu: '贪狼', quan: '太阴', ke: '右弼', ji: '天机' },
  '己': { lu: '武曲', quan: '贪狼', ke: '天梁', ji: '文曲' },
  '庚': { lu: '太阳', quan: '武曲', ke: '太阴', ji: '天同' },
  '辛': { lu: '巨门', quan: '太阳', ke: '文曲', ji: '文昌' },
  '壬': { lu: '天梁', quan: '紫微', ke: '左辅', ji: '武曲' },
  '癸': { lu: '破军', quan: '巨门', ke: '太阴', ji: '贪狼' }
};

/**
 * 根据天干获取四化
 */
export function getSihuaByTiangan(tiangan: Tiangan): Sihua {
  return SIHUA_TABLE[tiangan];
}

/**
 * 天干列表
 */
export const TIANGAN_LIST: Tiangan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

/**
 * 根据年份获取天干
 * 天干循环：甲(4) 乙(5) 丙(6) 丁(7) 戊(8) 己(9) 庚(0) 辛(1) 壬(2) 癸(3)
 */
export function getTianganByYear(year: number): Tiangan {
  const index = (year - 4) % 10;
  return TIANGAN_LIST[index < 0 ? index + 10 : index];
}


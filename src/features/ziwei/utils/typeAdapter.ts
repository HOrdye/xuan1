/**
 * 类型适配器
 * 将紫微模块的中文类型转换为 Phase 0 融合接口的英文类型
 */

import type { PalaceName } from '../types';
import type { ZiweiPalace, ZiweiMainStar } from '../../../shared/types/cross-system';

/**
 * 宫位名称映射：中文 -> 英文标识符
 */
const PALACE_NAME_MAP: Record<PalaceName, ZiweiPalace> = {
  '命宫': 'ming',
  '兄弟宫': 'xiongdi',
  '夫妻宫': 'fuqi',
  '子女宫': 'zinu',
  '财帛宫': 'cai',
  '疾厄宫': 'jiluan',
  '迁移宫': 'qianyi',
  '奴仆宫': 'pugu',
  '官禄宫': 'guanlu',
  '田宅宫': 'tianzhai',
  '福德宫': 'fude',
  '父母宫': 'fumu',
};

/**
 * 主星名称映射：中文 -> 英文标识符
 */
const MAIN_STAR_NAME_MAP: Record<string, ZiweiMainStar> = {
  '紫微': 'ziwei',
  '天机': 'tianji',
  '太阳': 'taiyang',
  '武曲': 'wuqu',
  '天同': 'tiantong',
  '廉贞': 'lianzhen',
  '天府': 'tianfu',
  '太阴': 'taiyin',
  '贪狼': 'tanlang',
  '巨门': 'jumen',
  '天相': 'tianxiang',
  '天梁': 'tianliang',
  '七杀': 'qisha',
  '破军': 'poyao',
};

/**
 * 将中文宫位名称转换为英文标识符
 */
export function convertPalaceNameToId(palaceName: PalaceName): ZiweiPalace {
  return PALACE_NAME_MAP[palaceName] || 'ming';
}

/**
 * 将英文标识符转换为中文宫位名称
 */
export function convertPalaceIdToName(palaceId: ZiweiPalace): PalaceName {
  const entry = Object.entries(PALACE_NAME_MAP).find(([_, id]) => id === palaceId);
  return (entry?.[0] as PalaceName) || '命宫';
}

/**
 * 将中文主星名称转换为英文标识符
 */
export function convertMainStarNameToId(starName: string): ZiweiMainStar | null {
  return MAIN_STAR_NAME_MAP[starName] || null;
}

/**
 * 将英文标识符转换为中文主星名称
 */
export function convertMainStarIdToName(starId: ZiweiMainStar): string {
  const entry = Object.entries(MAIN_STAR_NAME_MAP).find(([_, id]) => id === starId);
  return entry?.[0] || starId;
}

/**
 * 批量转换宫位名称数组
 */
export function convertPalaceNamesToIds(palaceNames: PalaceName[]): ZiweiPalace[] {
  return palaceNames.map(convertPalaceNameToId);
}

/**
 * 批量转换主星名称数组
 */
export function convertMainStarNamesToIds(starNames: string[]): ZiweiMainStar[] {
  return starNames
    .map(convertMainStarNameToId)
    .filter((id): id is ZiweiMainStar => id !== null);
}









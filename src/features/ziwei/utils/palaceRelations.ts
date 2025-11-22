/**
 * 紫微斗数宫位关系计算工具
 * 计算三合、对冲、四正等宫位关系
 */

/**
 * 获取三合宫位索引
 * 三合：命宫(0)的三合是寅(2)、午(6)、戌(10)
 * 规律：每隔4个宫位
 */
export function getSanhePalaces(palaceIndex: number): number[] {
  const sanhe = [
    (palaceIndex + 4) % 12,
    (palaceIndex + 8) % 12
  ];
  return sanhe;
}

/**
 * 获取对冲宫位索引
 * 对冲：命宫(0)的对冲是迁移宫(6)
 * 规律：相隔6个宫位
 */
export function getChongPalace(palaceIndex: number): number {
  return (palaceIndex + 6) % 12;
}

/**
 * 获取四正宫位索引（三合+本宫）
 */
export function getSizhengPalaces(palaceIndex: number): number[] {
  return [palaceIndex, ...getSanhePalaces(palaceIndex)];
}

/**
 * 获取四化宫位索引
 * 四化：命宫(0)的四化是财帛宫(4)、官禄宫(8)、迁移宫(6)
 * 规律：相隔4、8、6个宫位
 */
export function getSihuaPalaces(palaceIndex: number): number[] {
  return [
    (palaceIndex + 4) % 12,  // 财帛宫
    (palaceIndex + 8) % 12,  // 官禄宫
    (palaceIndex + 6) % 12   // 迁移宫（对冲）
  ];
}

/**
 * 获取所有相关宫位索引
 */
export function getRelatedPalaces(palaceIndex: number): {
  sanhe: number[];
  chong: number;
  sizheng: number[];
  sihua: number[];
} {
  return {
    sanhe: getSanhePalaces(palaceIndex),
    chong: getChongPalace(palaceIndex),
    sizheng: getSizhengPalaces(palaceIndex),
    sihua: getSihuaPalaces(palaceIndex)
  };
}









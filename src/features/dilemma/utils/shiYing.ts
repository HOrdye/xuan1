/**
 * 世应定位算法
 * 根据世爻位置确定应爻位置
 */

/**
 * 根据世爻位置计算应爻位置
 * 传统六爻规则：
 * - 世在初爻(0) → 应在四爻(3)
 * - 世在二爻(1) → 应在五爻(4)
 * - 世在三爻(2) → 应在六爻(5)
 * - 世在四爻(3) → 应在初爻(0)
 * - 世在五爻(4) → 应在二爻(1)
 * - 世在六爻(5) → 应在三爻(2)
 * 
 * @param shiYao 世爻位置（0-5）
 * @returns 应爻位置（0-5）
 */
export function calculateYingYao(shiYao: number): number {
  const yingYaoMap: Record<number, number> = {
    0: 3, // 初爻 → 四爻
    1: 4, // 二爻 → 五爻
    2: 5, // 三爻 → 六爻
    3: 0, // 四爻 → 初爻
    4: 1, // 五爻 → 二爻
    5: 2  // 六爻 → 三爻
  };

  if (shiYao < 0 || shiYao > 5) {
    console.warn(`世爻位置无效: ${shiYao}，使用默认值5（上爻）`);
    return 2; // 默认应在三爻
  }

  return yingYaoMap[shiYao];
}

/**
 * 确定世爻所在的卦（上卦或下卦）
 * @param shiYao 世爻位置（0-5）
 * @returns 'upper' 表示上卦，'lower' 表示下卦
 */
export function getShiYaoTrigram(shiYao: number): 'upper' | 'lower' {
  // 初、二、三爻在下卦（lower），四、五、六爻在上卦（upper）
  return shiYao < 3 ? 'lower' : 'upper';
}

/**
 * 确定应爻所在的卦（上卦或下卦）
 * @param yingYao 应爻位置（0-5）
 * @returns 'upper' 表示上卦，'lower' 表示下卦
 */
export function getYingYaoTrigram(yingYao: number): 'upper' | 'lower' {
  return yingYao < 3 ? 'lower' : 'upper';
}

/**
 * 世应关系信息
 */
export interface ShiYingInfo {
  /** 世爻位置（0-5） */
  shiYao: number;
  /** 应爻位置（0-5） */
  yingYao: number;
  /** 世爻所在卦 */
  shiTrigram: 'upper' | 'lower';
  /** 应爻所在卦 */
  yingTrigram: 'upper' | 'lower';
  /** 世应是否在同一卦 */
  sameTrigram: boolean;
}

/**
 * 获取完整的世应关系信息
 * @param shiYao 世爻位置（0-5）
 * @returns 世应关系信息
 */
export function getShiYingInfo(shiYao: number): ShiYingInfo {
  const yingYao = calculateYingYao(shiYao);
  const shiTrigram = getShiYaoTrigram(shiYao);
  const yingTrigram = getYingYaoTrigram(yingYao);

  return {
    shiYao,
    yingYao,
    shiTrigram,
    yingTrigram,
    sameTrigram: shiTrigram === yingTrigram
  };
}

/**
 * 将爻位转换为中文描述
 * @param position 爻位（0-5）
 * @returns 中文描述（初爻、二爻、三爻、四爻、五爻、上爻）
 */
export function getYaoPositionName(position: number): string {
  const names = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
  if (position < 0 || position > 5) {
    return '未知';
  }
  return names[position];
}


/**
 * 卦宫体系
 * 提供卦宫数据的快速查找和管理功能
 */

import { hexagramPalaceData, HexagramPalaceData } from '../data/hexagramPalaceData';

/**
 * 根据卦序号查找卦宫数据
 * @param number 卦序号（1-64）
 * @returns 卦宫数据或null
 */
export function getHexagramPalaceByNumber(number: number): HexagramPalaceData | null {
  return hexagramPalaceData.find(h => h.number === number) || null;
}

/**
 * 根据卦名查找卦宫数据
 * @param chineseName 中文卦名（支持完整名称和简化名称）
 * @returns 卦宫数据或null
 */
export function getHexagramPalaceByName(chineseName: string): HexagramPalaceData | null {
  // 精确匹配
  let result = hexagramPalaceData.find(h => h.chineseName === chineseName);
  if (result) return result;

  // 模糊匹配：检查是否包含（支持"屯"匹配"水雷屯"）
  result = hexagramPalaceData.find(h => 
    h.chineseName.includes(chineseName) || chineseName.includes(h.chineseName)
  );
  if (result) return result;

  // 提取核心卦名匹配（去除"为X"、"X宫"等后缀）
  const coreName = chineseName.replace(/^.*?(乾|兑|离|震|巽|坎|艮|坤)/, '$1').replace(/(为|宫).*$/, '');
  if (coreName && coreName !== chineseName) {
    result = hexagramPalaceData.find(h => 
      h.chineseName.includes(coreName) || coreName.includes(h.chineseName.split(/为|宫/)[0])
    );
    if (result) return result;
  }

  return null;
}

/**
 * 根据卦的二进制线形查找卦宫数据
 * @param lines 六爻线形（0或1的数组，长度为6）
 * @returns 卦宫数据或null
 */
export function getHexagramPalaceByLines(lines: (0 | 1)[]): HexagramPalaceData | null {
  // 首先需要找到对应的卦，这需要与hexagrams.json中的数据进行匹配
  // 这里先提供一个基础框架，后续可以优化
  return null;
}

/**
 * 获取指定卦宫的所有卦
 * @param palace 卦宫名称
 * @returns 该卦宫的所有卦
 */
export function getHexagramsByPalace(palace: '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤'): HexagramPalaceData[] {
  return hexagramPalaceData.filter(h => h.palace === palace);
}

/**
 * 获取卦宫的五行属性
 * @param palace 卦宫名称
 * @returns 五行属性
 */
export function getPalaceElement(palace: '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤'): string {
  const palaceData = hexagramPalaceData.find(h => h.palace === palace);
  return palaceData?.element || '金'; // 默认返回金
}

/**
 * 验证卦宫数据的完整性
 * @returns 验证结果
 */
export function validatePalaceData(): {
  valid: boolean;
  errors: string[];
  statistics: {
    total: number;
    byPalace: Record<string, number>;
    byElement: Record<string, number>;
  };
} {
  const errors: string[] = [];
  const byPalace: Record<string, number> = {};
  const byElement: Record<string, number> = {};

  // 验证总数
  if (hexagramPalaceData.length !== 64) {
    errors.push(`卦数不正确: 期望64个，实际${hexagramPalaceData.length}个`);
  }

  // 验证序号
  const numbers = hexagramPalaceData.map(h => h.number).sort((a, b) => a - b);
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] !== i + 1) {
      errors.push(`序号不连续: 缺少序号${i + 1}`);
      break;
    }
  }

  // 统计卦宫分布
  for (const hexagram of hexagramPalaceData) {
    byPalace[hexagram.palace] = (byPalace[hexagram.palace] || 0) + 1;
    byElement[hexagram.element] = (byElement[hexagram.element] || 0) + 1;

    // 验证纳甲序列
    if (hexagram.naJiaSequence.length !== 6) {
      errors.push(`卦${hexagram.chineseName}的纳甲序列长度不正确: ${hexagram.naJiaSequence.length}`);
    }

    // 验证世爻位置
    if (hexagram.shiYao < 0 || hexagram.shiYao > 5) {
      errors.push(`卦${hexagram.chineseName}的世爻位置无效: ${hexagram.shiYao}`);
    }
  }

  // 验证每个卦宫应该有8个卦
  for (const palace of ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']) {
    const count = byPalace[palace] || 0;
    if (count !== 8) {
      errors.push(`卦宫${palace}的卦数不正确: 期望8个，实际${count}个`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    statistics: {
      total: hexagramPalaceData.length,
      byPalace,
      byElement
    }
  };
}


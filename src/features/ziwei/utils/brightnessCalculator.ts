/**
 * 庙旺陷计算器
 * 根据星曜和宫位地支，计算星曜的庙旺陷状态
 */

import type { StarBrightness, Dizhi } from '../types';

/**
 * 14主星的庙旺陷对照表
 * 根据宫位地支确定星曜的庙旺陷状态
 * 
 * 规则说明：
 * - 庙：星曜力量最强
 * - 旺：星曜力量强
 * - 利/得：星曜力量中等偏上
 * - 平：星曜力量普通
 * - 不得地：星曜力量弱
 * - 陷：星曜力量最弱
 */

// 紫微星庙旺陷表
const ZIWEI_BRIGHTNESS: Record<Dizhi, StarBrightness> = {
  '子': '庙', '丑': '旺', '寅': '庙', '卯': '旺',
  '辰': '庙', '巳': '旺', '午': '庙', '未': '旺',
  '申': '庙', '酉': '旺', '戌': '庙', '亥': '旺'
};

// 天机星庙旺陷表
const TIANJI_BRIGHTNESS: Record<Dizhi, StarBrightness> = {
  '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
  '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
  '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
};

// 太阳星庙旺陷表
const TAIYANG_BRIGHTNESS: Record<Dizhi, StarBrightness> = {
  '子': '陷', '丑': '陷', '寅': '得', '卯': '庙',
  '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
  '申': '旺', '酉': '旺', '戌': '平', '亥': '陷'
};

// 武曲星庙旺陷表
const WUQU_BRIGHTNESS: Record<Dizhi, StarBrightness> = {
  '子': '庙', '丑': '庙', '寅': '旺', '卯': '旺',
  '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
  '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
};

// 天同星庙旺陷表
const TIANTONG_BRIGHTNESS: Record<Dizhi, StarBrightness> = {
  '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
  '辰': '庙', '巳': '庙', '午': '陷', '未': '陷',
  '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
};

// 廉贞星庙旺陷表
const LIANZHEN_BRIGHTNESS: Record<Dizhi, StarBrightness> = {
  '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
  '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
  '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
};

// 天府星庙旺陷表
const TIANFU_BRIGHTNESS: Record<Dizhi, StarBrightness> = {
  '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
  '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
  '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
};

// 太阴星庙旺陷表
const TAIYIN_BRIGHTNESS: Record<Dizhi, StarBrightness> = {
  '子': '庙', '丑': '庙', '寅': '陷', '卯': '陷',
  '辰': '陷', '巳': '陷', '午': '陷', '未': '陷',
  '申': '得', '酉': '庙', '戌': '庙', '亥': '庙'
};

// 贪狼星庙旺陷表
const TANLANG_BRIGHTNESS: Record<Dizhi, StarBrightness> = {
  '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
  '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
  '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
};

// 巨门星庙旺陷表
const JUMEN_BRIGHTNESS: Record<Dizhi, StarBrightness> = {
  '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
  '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
  '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
};

// 天相星庙旺陷表
const TIANXIANG_BRIGHTNESS: Record<Dizhi, StarBrightness> = {
  '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
  '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
  '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
};

// 天梁星庙旺陷表
const TIANLIANG_BRIGHTNESS: Record<Dizhi, StarBrightness> = {
  '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
  '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
  '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
};

// 七杀星庙旺陷表
const QISHA_BRIGHTNESS: Record<Dizhi, StarBrightness> = {
  '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
  '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
  '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
};

// 破军星庙旺陷表
const POJUN_BRIGHTNESS: Record<Dizhi, StarBrightness> = {
  '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
  '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
  '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
};

/**
 * 14主星庙旺陷对照表
 */
const MAIN_STAR_BRIGHTNESS_MAP: Record<string, Record<Dizhi, StarBrightness>> = {
  '紫微': ZIWEI_BRIGHTNESS,
  '天机': TIANJI_BRIGHTNESS,
  '太阳': TAIYANG_BRIGHTNESS,
  '武曲': WUQU_BRIGHTNESS,
  '天同': TIANTONG_BRIGHTNESS,
  '廉贞': LIANZHEN_BRIGHTNESS,
  '天府': TIANFU_BRIGHTNESS,
  '太阴': TAIYIN_BRIGHTNESS,
  '贪狼': TANLANG_BRIGHTNESS,
  '巨门': JUMEN_BRIGHTNESS,
  '天相': TIANXIANG_BRIGHTNESS,
  '天梁': TIANLIANG_BRIGHTNESS,
  '七杀': QISHA_BRIGHTNESS,
  '破军': POJUN_BRIGHTNESS
};

/**
 * 辅星庙旺陷规则
 * 大部分辅星有固定的庙旺陷规则
 */

// 六吉星庙旺陷表
const JIXING_BRIGHTNESS: Record<string, Record<Dizhi, StarBrightness>> = {
  '文昌': {
    '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
    '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
    '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
  },
  '文曲': {
    '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
    '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
    '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
  },
  '左辅': {
    '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
    '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
    '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
  },
  '右弼': {
    '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
    '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
    '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
  },
  '天魁': {
    '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
    '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
    '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
  },
  '天钺': {
    '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
    '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
    '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
  }
};

// 六煞星庙旺陷表
const SHAXING_BRIGHTNESS: Record<string, Record<Dizhi, StarBrightness>> = {
  '火星': {
    '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
    '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
    '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
  },
  '铃星': {
    '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
    '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
    '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
  },
  '擎羊': {
    '子': '庙', '丑': '庙', '寅': '庙', '卯': '庙',
    '辰': '庙', '巳': '庙', '午': '庙', '未': '庙',
    '申': '庙', '酉': '庙', '戌': '庙', '亥': '庙'
  },
  '陀罗': {
    '子': '陷', '丑': '陷', '寅': '陷', '卯': '陷',
    '辰': '陷', '巳': '陷', '午': '陷', '未': '陷',
    '申': '陷', '酉': '陷', '戌': '陷', '亥': '陷'
  },
  '地空': {
    '子': '陷', '丑': '陷', '寅': '陷', '卯': '陷',
    '辰': '陷', '巳': '陷', '午': '陷', '未': '陷',
    '申': '陷', '酉': '陷', '戌': '陷', '亥': '陷'
  },
  '地劫': {
    '子': '陷', '丑': '陷', '寅': '陷', '卯': '陷',
    '辰': '陷', '巳': '陷', '午': '陷', '未': '陷',
    '申': '陷', '酉': '陷', '戌': '陷', '亥': '陷'
  }
};

/**
 * 计算星曜的庙旺陷状态
 * 
 * @param starName 星曜名称
 * @param palaceDizhi 宫位地支
 * @returns 庙旺陷状态
 */
export function calculateStarBrightness(
  starName: string,
  palaceDizhi: Dizhi
): StarBrightness {
  // 先查主星表
  if (MAIN_STAR_BRIGHTNESS_MAP[starName]) {
    return MAIN_STAR_BRIGHTNESS_MAP[starName][palaceDizhi] || '平';
  }
  
  // 再查吉星表
  if (JIXING_BRIGHTNESS[starName]) {
    return JIXING_BRIGHTNESS[starName][palaceDizhi] || '平';
  }
  
  // 再查煞星表
  if (SHAXING_BRIGHTNESS[starName]) {
    return SHAXING_BRIGHTNESS[starName][palaceDizhi] || '平';
  }
  
  // 默认返回"平"
  return '平';
}

/**
 * 获取庙旺陷状态的说明
 */
export function getBrightnessDescription(brightness: StarBrightness): string {
  const descriptions: Record<StarBrightness, string> = {
    '庙': '力量最强，发挥最佳',
    '旺': '力量强，发挥良好',
    '利': '力量中等偏上，发挥较好',
    '得': '力量中等偏上，发挥较好',
    '平': '力量普通，正常发挥',
    '不得地': '力量较弱，发挥受限',
    '陷': '力量最弱，发挥最差'
  };
  
  return descriptions[brightness] || '力量普通';
}

/**
 * 获取庙旺陷状态的等级（用于排序和评分）
 */
export function getBrightnessLevel(brightness: StarBrightness): number {
  const levels: Record<StarBrightness, number> = {
    '庙': 5,
    '旺': 4,
    '利': 3,
    '得': 3,
    '平': 2,
    '不得地': 1,
    '陷': 0
  };
  
  return levels[brightness] || 2;
}

/**
 * 判断星曜是否处于有利状态
 */
export function isBrightnessFavorable(brightness: StarBrightness): boolean {
  return ['庙', '旺', '利', '得'].includes(brightness);
}

/**
 * 判断星曜是否处于不利状态
 */
export function isBrightnessUnfavorable(brightness: StarBrightness): boolean {
  return ['陷', '不得地'].includes(brightness);
}


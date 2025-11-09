/**
 * 紫微斗数十二宫数据
 */

import type { Palace, PalaceName } from '../types';

/**
 * 十二宫名称列表（按顺序）
 */
export const PALACE_NAMES: PalaceName[] = [
  '命宫', '兄弟宫', '夫妻宫', '子女宫',
  '财帛宫', '疾厄宫', '迁移宫', '奴仆宫',
  '官禄宫', '田宅宫', '福德宫', '父母宫'
];

/**
 * 宫位描述
 */
export const PALACE_DESCRIPTIONS: Record<PalaceName, string> = {
  '命宫': '代表个人的性格、天赋、命运走向',
  '兄弟宫': '代表兄弟姐妹、朋友、同辈关系',
  '夫妻宫': '代表婚姻、配偶、感情关系',
  '子女宫': '代表子女、晚辈、创作、娱乐',
  '财帛宫': '代表财运、收入、理财能力',
  '疾厄宫': '代表健康、疾病、身体状况',
  '迁移宫': '代表外出、旅行、迁移、发展',
  '奴仆宫': '代表下属、同事、合作伙伴',
  '官禄宫': '代表事业、工作、社会地位',
  '田宅宫': '代表房产、不动产、家庭环境',
  '福德宫': '代表福气、精神享受、内心世界',
  '父母宫': '代表父母、长辈、教育、根源'
};

/**
 * 创建空宫位
 */
export function createEmptyPalace(name: PalaceName, index: number): Palace {
  return {
    name,
    index,
    stars: [],
    brightness: '平',
    description: PALACE_DESCRIPTIONS[name]
  };
}

/**
 * 创建所有空宫位
 */
export function createAllPalaces(): Palace[] {
  return PALACE_NAMES.map((name, index) => createEmptyPalace(name, index));
}

/**
 * 根据索引获取宫位名称
 */
export function getPalaceNameByIndex(index: number): PalaceName {
  return PALACE_NAMES[index % 12];
}

/**
 * 根据名称获取宫位索引
 */
export function getPalaceIndexByName(name: PalaceName): number {
  return PALACE_NAMES.indexOf(name);
}


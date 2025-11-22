/**
 * 空宫分析工具
 * 检测空宫、识别对宫、生成解读
 */

import type { Palace, ZiweiChart, Star } from '../types';
import { PALACE_NAMES } from '../data/palaces';

/**
 * 空宫分析结果
 */
export interface EmptyPalaceAnalysis {
  palace: Palace;
  palaceIndex: number;
  oppositePalace: Palace;
  oppositePalaceIndex: number;
  oppositeStars: Star[];
  interpretation: string;
  characteristics: string[];
  suggestions: string[];
}

/**
 * 判断宫位是否为空宫
 * 空宫定义：没有主星（category === '主星'）的宫位
 */
export function isEmptyPalace(palace: Palace): boolean {
  // 检查是否有主星
  const hasMainStar = palace.stars.some(star => star.category === '主星');
  return !hasMainStar;
}

/**
 * 获取对宫索引
 * 对宫 = 当前宫位索引 + 6（取模12）
 */
export function getOppositePalaceIndex(palaceIndex: number): number {
  return (palaceIndex + 6) % 12;
}

/**
 * 获取对宫名称
 */
export function getOppositePalaceName(palaceIndex: number): string {
  const oppositeIndex = getOppositePalaceIndex(palaceIndex);
  return PALACE_NAMES[oppositeIndex];
}

/**
 * 分析命盘中的所有空宫
 */
export function analyzeEmptyPalaces(chart: ZiweiChart): EmptyPalaceAnalysis[] {
  const emptyPalaces: EmptyPalaceAnalysis[] = [];

  chart.palaces.forEach((palace, index) => {
    if (isEmptyPalace(palace)) {
      const oppositeIndex = getOppositePalaceIndex(index);
      const oppositePalace = chart.palaces[oppositeIndex];
      
      // 获取对宫的主星
      const oppositeMainStars = oppositePalace.stars.filter(
        star => star.category === '主星'
      );

      // 获取对宫的辅星和煞星
      const oppositeAuxiliaryStars = oppositePalace.stars.filter(
        star => star.category === '辅星' || star.category === '煞星'
      );

      // 生成解读
      const analysis = generateEmptyPalaceInterpretation(
        palace,
        index,
        oppositePalace,
        oppositeIndex,
        oppositeMainStars,
        oppositeAuxiliaryStars
      );

      emptyPalaces.push(analysis);
    }
  });

  return emptyPalaces;
}

/**
 * 生成空宫解读
 */
function generateEmptyPalaceInterpretation(
  palace: Palace,
  palaceIndex: number,
  oppositePalace: Palace,
  oppositeIndex: number,
  oppositeMainStars: Star[],
  oppositeAuxiliaryStars: Star[]
): EmptyPalaceAnalysis {
  const oppositeStars = [...oppositeMainStars, ...oppositeAuxiliaryStars];
  
  // 根据宫位类型生成不同的解读
  const interpretation = getPalaceSpecificInterpretation(
    palace.name,
    oppositeMainStars,
    oppositeAuxiliaryStars
  );

  const characteristics = getEmptyPalaceCharacteristics(
    palace.name,
    oppositeMainStars
  );

  const suggestions = getEmptyPalaceSuggestions(
    palace.name,
    oppositeMainStars
  );

  return {
    palace,
    palaceIndex,
    oppositePalace,
    oppositePalaceIndex: oppositeIndex,
    oppositeStars,
    interpretation,
    characteristics,
    suggestions
  };
}

/**
 * 获取宫位特定的解读
 */
function getPalaceSpecificInterpretation(
  palaceName: string,
  oppositeMainStars: Star[],
  oppositeAuxiliaryStars: Star[]
): string {
  const mainStarNames = oppositeMainStars.map(s => s.name).join('、');
  const auxiliaryStarNames = oppositeAuxiliaryStars.map(s => s.name).join('、');
  const allStarNames = [mainStarNames, auxiliaryStarNames].filter(Boolean).join('、');

  // 根据对宫星曜组合生成更深入的解读
  const starAnalysis = getStarCombinationAnalysis(oppositeMainStars, oppositeAuxiliaryStars);

  switch (palaceName) {
    case '命宫':
      return `命宫空宫，性格特质需借对宫"迁移宫"的${allStarNames}来论。${starAnalysis}你的个性具有${getPersonalityTrait(oppositeMainStars)}的特质，但表现方式较为内敛。你容易受环境和他人的影响，在不同场合展现不同面貌，这种灵活性是你的优势，但也需要培养核心的自我认知，避免过度迎合而迷失方向。`;

    case '夫妻宫':
      return `夫妻宫空宫，配偶特质需借对宫"官禄宫"的${allStarNames}来论。${starAnalysis}你的配偶可能具有${getCareerTrait(oppositeMainStars)}的事业特质，在感情中${getRelationshipStyle(oppositeMainStars)}。婚姻关系需要你主动经营，配偶可能更关注事业发展，你需要理解并支持，同时也要表达自己的情感需求。`;

    case '官禄宫':
      return `官禄宫空宫，事业发展需借对宫"夫妻宫"的${allStarNames}来论。${starAnalysis}你的事业方向与${getCareerDirection(oppositeMainStars)}相关，适合${getCareerType(oppositeMainStars)}。你的事业发展可能受配偶或合作伙伴影响较大，需要主动探索和规划，不要被动等待机会。`;

    case '财帛宫':
      return `财帛宫空宫，财运状况需借对宫"福德宫"的${allStarNames}来论。${starAnalysis}你的财运与${getWealthSource(oppositeMainStars)}相关，赚钱方式${getWealthStyle(oppositeMainStars)}。财务上需要主动寻找机会，不要依赖单一收入来源，同时要培养理财能力，合理规划财务。`;

    case '兄弟宫':
      return `兄弟宫空宫，兄弟姐妹关系需借对宫"奴仆宫"的${allStarNames}来论。${starAnalysis}同辈关系${getSiblingRelation(oppositeMainStars)}，兄弟姐妹可能${getSiblingTrait(oppositeMainStars)}。`;

    case '子女宫':
      return `子女宫空宫，子女缘分需借对宫"田宅宫"的${allStarNames}来论。${starAnalysis}子女或创作能力与${getChildrenTrait(oppositeMainStars)}相关，${getChildrenStyle(oppositeMainStars)}。`;

    case '疾厄宫':
      return `疾厄宫空宫，健康状况需借对宫"父母宫"的${allStarNames}来论。${starAnalysis}健康方面${getHealthTrait(oppositeMainStars)}，需要注意${getHealthAttention(oppositeMainStars)}。`;

    case '迁移宫':
      return `迁移宫空宫，外出发展需借对宫"命宫"的${allStarNames}来论。${starAnalysis}外出发展${getMigrationTrait(oppositeMainStars)}，适合${getMigrationDirection(oppositeMainStars)}。`;

    case '奴仆宫':
      return `奴仆宫空宫，人际关系需借对宫"兄弟宫"的${allStarNames}来论。${starAnalysis}人际关系${getSocialTrait(oppositeMainStars)}，朋友和下属可能${getSocialStyle(oppositeMainStars)}。`;

    case '田宅宫':
      return `田宅宫空宫，房产家庭需借对宫"子女宫"的${allStarNames}来论。${starAnalysis}房产和家庭环境${getPropertyTrait(oppositeMainStars)}，${getPropertyStyle(oppositeMainStars)}。`;

    case '福德宫':
      return `福德宫空宫，精神世界需借对宫"财帛宫"的${allStarNames}来论。${starAnalysis}精神享受和内心世界${getSpiritualTrait(oppositeMainStars)}，${getSpiritualStyle(oppositeMainStars)}。`;

    case '父母宫':
      return `父母宫空宫，父母关系需借对宫"疾厄宫"的${allStarNames}来论。${starAnalysis}父母关系和根源${getParentTrait(oppositeMainStars)}，${getParentStyle(oppositeMainStars)}。`;

    default:
      return `你的${palaceName}是空宫，需借对宫${allStarNames}来论。${starAnalysis}`;
  }
}

/**
 * 获取空宫的特点（精简版，只保留最核心的1-2个）
 */
function getEmptyPalaceCharacteristics(
  palaceName: string,
  oppositeMainStars: Star[]
): string[] {
  // 只返回最核心的1-2个特点，避免重复
  const characteristics: string[] = [];

  // 根据宫位类型返回最核心的特点
  switch (palaceName) {
    case '命宫':
      characteristics.push('性格可塑性强，容易受环境影响');
      break;
    case '夫妻宫':
      characteristics.push('配偶特质不明显，需要主动经营关系');
      break;
    case '官禄宫':
      characteristics.push('事业方向多样化，不受固定职业束缚');
      break;
    case '财帛宫':
      characteristics.push('财运起伏较大，赚钱方式不固定');
      break;
    default:
      // 其他宫位只保留一个核心特点
      characteristics.push('需要借对宫星曜来论，特质不固定');
  }

  return characteristics;
}

/**
 * 获取空宫的建议（精简版，只保留最核心的1-2个）
 */
function getEmptyPalaceSuggestions(
  palaceName: string,
  oppositeMainStars: Star[]
): string[] {
  const suggestions: string[] = [];

  switch (palaceName) {
    case '命宫':
      suggestions.push('培养独立思考能力，避免过度迎合他人');
      break;

    case '夫妻宫':
      suggestions.push('主动经营感情关系，多关注配偶需求');
      break;

    case '官禄宫':
      suggestions.push('探索多种职业可能性，主动规划发展路径');
      break;

    case '财帛宫':
      suggestions.push('保持财务灵活性，主动寻找赚钱机会');
      break;

    default:
      // 其他宫位只保留一个核心建议
      suggestions.push('主动探索和规划，参考对宫星曜特质');
  }

  return suggestions;
}

/**
 * 获取空宫数量统计
 */
export function getEmptyPalaceStats(chart: ZiweiChart): {
  total: number;
  emptyPalaces: string[];
  percentage: number;
} {
  const emptyPalaces = analyzeEmptyPalaces(chart);
  const emptyPalaceNames = emptyPalaces.map(ep => ep.palace.name);

  return {
    total: emptyPalaces.length,
    emptyPalaces: emptyPalaceNames,
    percentage: Math.round((emptyPalaces.length / 12) * 100)
  };
}

/**
 * 获取星曜组合分析
 */
function getStarCombinationAnalysis(mainStars: Star[], auxiliaryStars: Star[]): string {
  if (mainStars.length === 0) return '';
  
  const starNames = mainStars.map(s => s.name);
  
  // 根据主星组合给出分析
  if (starNames.includes('紫微')) {
    return '对宫有紫微，说明这个方面具有领导力和权威性，但需要通过借宫来体现。';
  }
  if (starNames.includes('天机')) {
    return '对宫有天机，说明这个方面具有灵活性和变通性，需要主动把握机会。';
  }
  if (starNames.includes('太阳')) {
    return '对宫有太阳，说明这个方面具有光明和积极的特质，但需要主动展现。';
  }
  if (starNames.includes('武曲')) {
    return '对宫有武曲，说明这个方面具有刚强和果断的特质，但需要通过努力来实现。';
  }
  if (starNames.includes('天同')) {
    return '对宫有天同，说明这个方面具有温和和随和的特质，但需要避免过度依赖。';
  }
  if (starNames.includes('廉贞')) {
    return '对宫有廉贞，说明这个方面具有复杂和多变的特质，需要谨慎处理。';
  }
  if (starNames.includes('天府')) {
    return '对宫有天府，说明这个方面具有稳定和富足的特质，但需要主动经营。';
  }
  if (starNames.includes('太阴')) {
    return '对宫有太阴，说明这个方面具有柔和和内敛的特质，需要耐心培养。';
  }
  if (starNames.includes('贪狼')) {
    return '对宫有贪狼，说明这个方面具有欲望和追求的特质，需要合理引导。';
  }
  if (starNames.includes('巨门')) {
    return '对宫有巨门，说明这个方面具有口才和沟通的特质，但需要注意言辞。';
  }
  if (starNames.includes('天相')) {
    return '对宫有天相，说明这个方面具有辅助和协调的特质，需要配合他人。';
  }
  if (starNames.includes('天梁')) {
    return '对宫有天梁，说明这个方面具有保护和照顾的特质，需要承担责任。';
  }
  if (starNames.includes('七杀')) {
    return '对宫有七杀，说明这个方面具有果断和冲劲的特质，但需要控制冲动。';
  }
  if (starNames.includes('破军')) {
    return '对宫有破军，说明这个方面具有变革和创新的特质，但需要稳定基础。';
  }
  
  return '';
}

// 辅助函数：根据星曜获取不同方面的特质描述
function getPersonalityTrait(stars: Star[]): string {
  const names = stars.map(s => s.name);
  if (names.includes('紫微')) return '领导权威';
  if (names.includes('天机')) return '灵活机变';
  if (names.includes('太阳')) return '光明积极';
  return '灵活多变';
}

function getCareerTrait(stars: Star[]): string {
  const names = stars.map(s => s.name);
  if (names.includes('紫微')) return '领导管理';
  if (names.includes('武曲')) return '务实果断';
  if (names.includes('天机')) return '灵活变通';
  return '多样化';
}

function getRelationshipStyle(stars: Star[]): string {
  const names = stars.map(s => s.name);
  if (names.includes('天同')) return '较为温和随和';
  if (names.includes('太阳')) return '较为主动热情';
  if (names.includes('太阴')) return '较为内敛细腻';
  return '较为灵活';
}

function getCareerDirection(stars: Star[]): string {
  return '人际关系和合作';
}

function getCareerType(stars: Star[]): string {
  const names = stars.map(s => s.name);
  if (names.includes('天机')) return '需要灵活变通的工作';
  if (names.includes('武曲')) return '需要务实执行的工作';
  if (names.includes('紫微')) return '需要领导管理的工作';
  return '自由职业或多重身份';
}

function getWealthSource(stars: Star[]): string {
  return '精神享受和内心满足';
}

function getWealthStyle(stars: Star[]): string {
  const names = stars.map(s => s.name);
  if (names.includes('武曲')) return '较为稳定但需要努力';
  if (names.includes('天机')) return '较为灵活多变';
  return '不固定';
}

function getSiblingRelation(stars: Star[]): string {
  return '相对平淡，需要主动维护';
}

function getSiblingTrait(stars: Star[]): string {
  return '个性不明显，关系需要经营';
}

function getChildrenTrait(stars: Star[]): string {
  return '家庭环境和房产状况';
}

function getChildrenStyle(stars: Star[]): string {
  return '需要主动培养和引导';
}

function getHealthTrait(stars: Star[]): string {
  return '与父母遗传和根源相关';
}

function getHealthAttention(stars: Star[]): string {
  return '预防和保养';
}

function getMigrationTrait(stars: Star[]): string {
  return '与命宫特质相关';
}

function getMigrationDirection(stars: Star[]): string {
  return '根据命宫特质选择方向';
}

function getSocialTrait(stars: Star[]): string {
  return '与兄弟姐妹关系相关';
}

function getSocialStyle(stars: Star[]): string {
  return '需要主动建立和维护';
}

function getPropertyTrait(stars: Star[]): string {
  return '与子女和创作相关';
}

function getPropertyStyle(stars: Star[]): string {
  return '需要主动规划和经营';
}

function getSpiritualTrait(stars: Star[]): string {
  return '与财运和物质相关';
}

function getSpiritualStyle(stars: Star[]): string {
  return '需要平衡物质和精神';
}

function getParentTrait(stars: Star[]): string {
  return '与健康和根源相关';
}

function getParentStyle(stars: Star[]): string {
  return '需要理解和包容';
}


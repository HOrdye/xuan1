/**
 * 辅星安放算法
 * 实现左辅、右弼、文昌、文曲、天魁、天钺、地空、地劫、火星、铃星等辅星的安放
 */

import type { StarPositions, Tiangan, Dizhi } from '../types';
import { getTianganByYear } from '../data/sihua';

/**
 * 安放左辅、右弼
 * 左辅：从辰宫起正月，顺时针数到出生月
 * 右弼：从戌宫起正月，逆时针数到出生月
 */
export function placeZuofuYoubi(month: number): StarPositions {
  const stars: StarPositions = {};
  
  // 左辅：从辰宫（索引4）起正月，顺时针
  const zuofuIndex = (4 + month - 1) % 12;
  if (!stars[zuofuIndex]) stars[zuofuIndex] = [];
  stars[zuofuIndex].push('左辅');
  
  // 右弼：从戌宫（索引10）起正月，逆时针
  const youbiIndex = (10 - (month - 1) + 12) % 12;
  if (!stars[youbiIndex]) stars[youbiIndex] = [];
  stars[youbiIndex].push('右弼');
  
  return stars;
}

/**
 * 安放文昌、文曲
 * 文昌：从戌宫起子时，顺时针数到出生时
 * 文曲：从辰宫起子时，逆时针数到出生时
 */
export function placeWenchangWenqu(hour: number): StarPositions {
  const stars: StarPositions = {};
  
  // 文昌：从戌宫（索引10）起子时，顺时针
  const wenchangIndex = (10 + hour) % 12;
  if (!stars[wenchangIndex]) stars[wenchangIndex] = [];
  stars[wenchangIndex].push('文昌');
  
  // 文曲：从辰宫（索引4）起子时，逆时针
  const wenquIndex = (4 - hour + 12) % 12;
  if (!stars[wenquIndex]) stars[wenquIndex] = [];
  stars[wenquIndex].push('文曲');
  
  return stars;
}

/**
 * 安放天魁、天钺
 * 天魁：根据出生年的天干
 * 天钺：根据出生年的天干
 */
export function placeTiankuiTianyue(year: number): StarPositions {
  const stars: StarPositions = {};
  const tiangan = getTianganByYear(year);
  
  // 天魁、天钺的安放表（根据天干）
  const tiankuiTianyueTable: Record<Tiangan, { tiankui: number; tianyue: number }> = {
    '甲': { tiankui: 1, tianyue: 7 },  // 甲年：天魁在丑，天钺在未
    '乙': { tiankui: 0, tianyue: 6 },  // 乙年：天魁在子，天钺在午
    '丙': { tiankui: 3, tianyue: 9 },  // 丙年：天魁在卯，天钺在酉
    '丁': { tiankui: 2, tianyue: 8 },  // 丁年：天魁在寅，天钺在戌
    '戊': { tiankui: 1, tianyue: 7 },  // 戊年：天魁在丑，天钺在未
    '己': { tiankui: 0, tianyue: 6 },  // 己年：天魁在子，天钺在午
    '庚': { tiankui: 3, tianyue: 9 },  // 庚年：天魁在卯，天钺在酉
    '辛': { tiankui: 2, tianyue: 8 },  // 辛年：天魁在寅，天钺在戌
    '壬': { tiankui: 1, tianyue: 7 },  // 壬年：天魁在丑，天钺在未
    '癸': { tiankui: 0, tianyue: 6 },  // 癸年：天魁在子，天钺在午
  };
  
  const positions = tiankuiTianyueTable[tiangan];
  if (positions) {
    if (!stars[positions.tiankui]) stars[positions.tiankui] = [];
    stars[positions.tiankui].push('天魁');
    
    if (!stars[positions.tianyue]) stars[positions.tianyue] = [];
    stars[positions.tianyue].push('天钺');
  }
  
  return stars;
}

/**
 * 安放地空、地劫
 * 地空：从亥宫起子时，逆时针数到出生时
 * 地劫：从亥宫起子时，顺时针数到出生时
 */
export function placeDikongDijie(hour: number): StarPositions {
  const stars: StarPositions = {};
  
  // 地空：从亥宫（索引11）起子时，逆时针
  const dikongIndex = (11 - hour + 12) % 12;
  if (!stars[dikongIndex]) stars[dikongIndex] = [];
  stars[dikongIndex].push('地空');
  
  // 地劫：从亥宫（索引11）起子时，顺时针
  const dijieIndex = (11 + hour) % 12;
  if (!stars[dijieIndex]) stars[dijieIndex] = [];
  stars[dijieIndex].push('地劫');
  
  return stars;
}

/**
 * 安放火星、铃星
 * 火星：根据出生年和出生时
 * 铃星：根据出生年和出生时
 */
export function placeHuoxingLingxing(year: number, hour: number): StarPositions {
  const stars: StarPositions = {};
  const dizhi = getDizhiByYear(year);
  
  // 火星、铃星的安放表（根据地支和时辰）
  // 简化版：火星从寅宫起，铃星从戌宫起，根据时辰数
  const huoxingStartIndex = 2; // 寅宫
  const lingxingStartIndex = 10; // 戌宫
  
  // 火星：从寅宫起，根据时辰和地支计算
  const huoxingOffset = calculateHuoxingOffset(dizhi, hour);
  const huoxingIndex = (huoxingStartIndex + huoxingOffset) % 12;
  if (!stars[huoxingIndex]) stars[huoxingIndex] = [];
  stars[huoxingIndex].push('火星');
  
  // 铃星：从戌宫起，根据时辰和地支计算
  const lingxingOffset = calculateLingxingOffset(dizhi, hour);
  const lingxingIndex = (lingxingStartIndex + lingxingOffset) % 12;
  if (!stars[lingxingIndex]) stars[lingxingIndex] = [];
  stars[lingxingIndex].push('铃星');
  
  return stars;
}

/**
 * 根据年份获取地支
 */
function getDizhiByYear(year: number): Dizhi {
  const dizhiList: Dizhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const index = (year - 4) % 12;
  return dizhiList[index < 0 ? index + 12 : index];
}

/**
 * 计算火星偏移量（简化版）
 */
function calculateHuoxingOffset(dizhi: Dizhi, hour: number): number {
  // 简化算法：根据地支和时辰计算
  const dizhiIndex = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].indexOf(dizhi);
  return (dizhiIndex + hour) % 12;
}

/**
 * 计算铃星偏移量（简化版）
 */
function calculateLingxingOffset(dizhi: Dizhi, hour: number): number {
  // 简化算法：根据地支和时辰计算
  const dizhiIndex = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].indexOf(dizhi);
  return (dizhiIndex - hour + 12) % 12;
}

/**
 * 合并所有辅星位置
 */
export function mergeAuxiliaryStars(...starMaps: StarPositions[]): StarPositions {
  const merged: StarPositions = {};
  
  for (const starMap of starMaps) {
    for (const [index, stars] of Object.entries(starMap)) {
      const idx = parseInt(index);
      if (!merged[idx]) {
        merged[idx] = [];
      }
      merged[idx].push(...stars);
    }
  }
  
  return merged;
}

/**
 * 安放擎羊、陀罗
 * 擎羊：根据出生年的天干，安放在特定宫位
 * 陀罗：根据出生年的天干，安放在特定宫位
 */
export function placeQingyangTuoluo(year: number): StarPositions {
  const stars: StarPositions = {};
  const tiangan = getTianganByYear(year);

  // 擎羊、陀罗的安放表（根据天干）
  // 擎羊在禄存的前一宫，陀罗在禄存的后一宫
  const qingyangTuoluoTable: Record<Tiangan, { qingyang: number; tuoluo: number }> = {
    '甲': { qingyang: 2, tuoluo: 4 },  // 甲年：禄存在卯，擎羊在寅，陀罗在辰
    '乙': { qingyang: 3, tuoluo: 5 },  // 乙年：禄存在辰，擎羊在卯，陀罗在巳
    '丙': { qingyang: 5, tuoluo: 7 },  // 丙年：禄存在午，擎羊在巳，陀罗在未
    '丁': { qingyang: 6, tuoluo: 8 },  // 丁年：禄存在未，擎羊在午，陀罗在申
    '戊': { qingyang: 8, tuoluo: 10 }, // 戊年：禄存在酉，擎羊在申，陀罗在戌
    '己': { qingyang: 9, tuoluo: 11 }, // 己年：禄存在戌，擎羊在酉，陀罗在亥
    '庚': { qingyang: 11, tuoluo: 1 }, // 庚年：禄存在子，擎羊在亥，陀罗在丑
    '辛': { qingyang: 0, tuoluo: 2 },  // 辛年：禄存在丑，擎羊在子，陀罗在寅
    '壬': { qingyang: 2, tuoluo: 4 },  // 壬年：禄存在卯，擎羊在寅，陀罗在辰
    '癸': { qingyang: 3, tuoluo: 5 }   // 癸年：禄存在辰，擎羊在卯，陀罗在巳
  };

  const positions = qingyangTuoluoTable[tiangan];
  if (positions) {
    if (!stars[positions.qingyang]) stars[positions.qingyang] = [];
    stars[positions.qingyang].push('擎羊');

    if (!stars[positions.tuoluo]) stars[positions.tuoluo] = [];
    stars[positions.tuoluo].push('陀罗');
  }

  return stars;
}

/**
 * 安放禄存
 * 禄存：根据出生年的天干，安放在特定宫位
 */
export function placeLucun(year: number): StarPositions {
  const stars: StarPositions = {};
  const tiangan = getTianganByYear(year);

  // 禄存的安放表（根据天干）
  const lucunTable: Record<Tiangan, number> = {
    '甲': 3,  // 甲年：禄存在卯
    '乙': 4,  // 乙年：禄存在辰
    '丙': 5,  // 丙年：禄存在巳
    '丁': 6,  // 丁年：禄存在午
    '戊': 7,  // 戊年：禄存在未
    '己': 8,  // 己年：禄存在申
    '庚': 9,  // 庚年：禄存在酉
    '辛': 10, // 辛年：禄存在戌
    '壬': 11, // 壬年：禄存在亥
    '癸': 0   // 癸年：禄存在子
  };

  const position = lucunTable[tiangan];
  if (position !== undefined) {
    if (!stars[position]) stars[position] = [];
    stars[position].push('禄存');
  }

  return stars;
}

/**
 * 安放天马
 * 天马：根据出生年的地支，安放在特定宫位
 */
export function placeTianma(year: number): StarPositions {
  const stars: StarPositions = {};
  const dizhi = getDizhiByYear(year);

  // 天马的安放表（根据地支）
  // 天马在申、子、辰年安放在寅，在亥、卯、未年安放在巳，在寅、午、戌年安放在申，在巳、酉、丑年安放在亥
  const tianmaTable: Record<Dizhi, number> = {
    '申': 2, '子': 2, '辰': 2,  // 申子辰年：天马在寅
    '亥': 5, '卯': 5, '未': 5,  // 亥卯未年：天马在巳
    '寅': 8, '午': 8, '戌': 8,  // 寅午戌年：天马在申
    '巳': 11, '酉': 11, '丑': 11 // 巳酉丑年：天马在亥
  };

  const position = tianmaTable[dizhi];
  if (position !== undefined) {
    if (!stars[position]) stars[position] = [];
    stars[position].push('天马');
  }

  return stars;
}

/**
 * 安放红鸾、天喜
 * 红鸾：根据出生年的地支，安放在特定宫位
 * 天喜：红鸾的对宫
 */
export function placeHongluanTianxi(year: number): StarPositions {
  const stars: StarPositions = {};
  const dizhi = getDizhiByYear(year);

  // 红鸾的安放表（根据地支）
  const hongluanTable: Record<Dizhi, number> = {
    '子': 0,  // 子年：红鸾在子
    '丑': 11, // 丑年：红鸾在亥
    '寅': 10, // 寅年：红鸾在戌
    '卯': 9,  // 卯年：红鸾在酉
    '辰': 8,  // 辰年：红鸾在申
    '巳': 7,  // 巳年：红鸾在未
    '午': 6,  // 午年：红鸾在午
    '未': 5,  // 未年：红鸾在巳
    '申': 4,  // 申年：红鸾在辰
    '酉': 3,  // 酉年：红鸾在卯
    '戌': 2,  // 戌年：红鸾在寅
    '亥': 1   // 亥年：红鸾在丑
  };

  const hongluanPosition = hongluanTable[dizhi];
  if (hongluanPosition !== undefined) {
    // 红鸾
    if (!stars[hongluanPosition]) stars[hongluanPosition] = [];
    stars[hongluanPosition].push('红鸾');

    // 天喜（红鸾的对宫）
    const tianxiPosition = (hongluanPosition + 6) % 12;
    if (!stars[tianxiPosition]) stars[tianxiPosition] = [];
    stars[tianxiPosition].push('天喜');
  }

  return stars;
}

/**
 * 安放博士十二神
 * 博士十二神：根据出生年的地支，安放在特定宫位
 * 12颗星：博士、力士、青龙、小耗、将军、奏书、飞廉、喜神、病符、大耗、伏兵、官府
 */
export function placeBoshiTwelve(year: number): StarPositions {
  const stars: StarPositions = {};
  const dizhi = getDizhiByYear(year);

  // 博士十二神的起始位置（根据地支）
  // 博士从寅宫起，根据地支确定起始位置
  const dizhiIndex = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].indexOf(dizhi);
  const startIndex = (2 + dizhiIndex) % 12; // 从寅宫（索引2）开始

  // 博士十二神列表（按顺序）
  const boshiTwelve = [
    '博士', '力士', '青龙', '小耗', '将军', '奏书',
    '飞廉', '喜神', '病符', '大耗', '伏兵', '官府'
  ];

  // 顺时针安放12颗星
  for (let i = 0; i < 12; i++) {
    const index = (startIndex + i) % 12;
    if (!stars[index]) stars[index] = [];
    stars[index].push(boshiTwelve[i]);
  }

  return stars;
}

/**
 * 安放流年岁前十二星
 * 根据流年地支安放12颗流年星
 * 
 * @param liunianDizhi 流年地支
 * @returns 星曜位置映射
 */
export function placeSuiqianTwelve(liunianDizhi: Dizhi): StarPositions {
  const stars: StarPositions = {};
  
  // 地支列表：子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥
  const dizhiList: Dizhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  // 流年岁前十二星列表（按顺序）
  const suiqianStars = [
    '岁建',   // 0: 在流年地支所在宫位
    '晦气',   // 1: 在岁建前一宫
    '丧门',   // 2: 在岁建前二宫
    '贯索',   // 3: 在岁建前三宫
    '官符',   // 4: 在岁建前四宫
    '小耗',   // 5: 在岁建前五宫
    '大耗',   // 6: 在岁建前六宫
    '龙德',   // 7: 在岁建前七宫
    '白虎',   // 8: 在岁建前八宫
    '天德',   // 9: 在岁建前九宫
    '吊客',   // 10: 在岁建前十宫
    '病符'    // 11: 在岁建前十一宫
  ];
  
  // 找到流年地支所在的宫位索引
  const suijianIndex = dizhiList.indexOf(liunianDizhi);
  
  // 安放12颗星（逆时针，从岁建开始）
  for (let i = 0; i < 12; i++) {
    // 计算星曜所在宫位（逆时针，从岁建开始）
    const palaceIndex = (suijianIndex - i + 12) % 12;
    
    if (!stars[palaceIndex]) {
      stars[palaceIndex] = [];
    }
    stars[palaceIndex].push(suiqianStars[i]);
  }
  
  return stars;
}

/**
 * 主函数：安放所有辅星
 */
export function placeAllAuxiliaryStars(
  year: number,
  month: number,
  hour: number
): StarPositions {
  const zuofuYoubi = placeZuofuYoubi(month);
  const wenchangWenqu = placeWenchangWenqu(hour);
  const tiankuiTianyue = placeTiankuiTianyue(year);
  const dikongDijie = placeDikongDijie(hour);
  const huoxingLingxing = placeHuoxingLingxing(year, hour);

  // 新增：补充六煞星和重要辅星
  const qingyangTuoluo = placeQingyangTuoluo(year);
  const lucun = placeLucun(year);
  const tianma = placeTianma(year);
  const hongluanTianxi = placeHongluanTianxi(year);

  // 新增：博士十二神
  const boshiTwelve = placeBoshiTwelve(year);

  return mergeAuxiliaryStars(
    zuofuYoubi,
    wenchangWenqu,
    tiankuiTianyue,
    dikongDijie,
    huoxingLingxing,
    qingyangTuoluo,
    lucun,
    tianma,
    hongluanTianxi,
    boshiTwelve
  );
}





/**
 * 紫微斗数排盘核心算法
 * 实现五行局、安星、四化等核心计算
 */

import type { 
  BirthInfo, 
  ZiweiChart, 
  Palace, 
  Star, 
  WuxingJu,
  Sihua,
  Pattern,
  Daxian,
  StarPositions
} from '../types';
import { createAllPalaces, getPalaceNameByIndex } from '../data/palaces';
import { getSihuaByTiangan, getTianganByYear } from '../data/sihua';
import { getNayinByYear, getJuByNayin, getJuName } from '../data/nayin';
import { getMainStar } from '../data/stars';

/**
 * 紫微斗数排盘计算器
 */
export class ZiweiChartCalculator {
  /**
   * 主函数：生成完整命盘
   */
  calculate(birthInfo: BirthInfo): ZiweiChart {
    // 1. 计算农历（简化版，实际应该使用农历转换库）
    const lunar = this.toLunar(birthInfo);
    
    // 2. 计算五行局
    const wuxingJu = this.calculateWuxingJu(lunar.year, lunar.month);
    
    // 3. 定位命宫
    const mingGongIndex = this.locateMingGong(lunar.month, birthInfo.hour);
    
    // 4. 定位身宫
    const shenGongIndex = this.locateShenGong(lunar.month, birthInfo.hour);
    
    // 5. 定位紫微星
    const ziweiIndex = this.locateZiwei(wuxingJu, lunar.day);
    
    // 6. 安十四主星
    const mainStars = this.placeMainStars(ziweiIndex);
    
    // 7. 安辅星、煞星、吉星（简化版，后续完善）
    const auxiliaryStars = this.placeAuxiliaryStars(lunar, birthInfo);
    
    // 8. 计算四化
    const yearStem = getTianganByYear(birthInfo.year);
    const sihua = getSihuaByTiangan(yearStem);
    
    // 9. 组装宫位
    const palaces = this.assemblePalaces(
      mingGongIndex,
      shenGongIndex,
      mainStars,
      auxiliaryStars,
      sihua
    );
    
    // 10. 识别格局
    const patterns = this.detectPatterns(palaces);
    
    // 11. 计算大限
    const daxian = this.calculateDaxian(palaces, birthInfo.gender, wuxingJu);
    
    return {
      birthInfo,
      wuxingJu: getJuName(wuxingJu) as WuxingJu,
      palaces,
      patterns,
      mingGong: palaces[0], // 重新排序后，命宫在索引0
      shenGong: palaces[(shenGongIndex - mingGongIndex + 12) % 12], // 计算身宫在新数组中的位置
      daxian,
      createdAt: new Date()
    };
  }
  
  /**
   * 转换为农历（简化版）
   * TODO: 使用专业的农历转换库
   */
  private toLunar(birthInfo: BirthInfo): { year: number; month: number; day: number } {
    // 简化处理：直接使用公历，实际应该转换为农历
    return {
      year: birthInfo.year,
      month: birthInfo.month,
      day: birthInfo.day
    };
  }
  
  /**
   * 计算五行局
   */
  private calculateWuxingJu(year: number, month: number): number {
    const nayin = getNayinByYear(year);
    return getJuByNayin(nayin);
  }
  
  /**
   * 定位命宫
   * 公式：从寅宫起正月，顺时针数到出生月，再逆时针数到出生时
   */
  private locateMingGong(month: number, hour: number): number {
    // 从寅宫（索引2）起正月
    const monthIndex = (2 + month - 1) % 12;
    // 逆时针数到出生时（子时为0，丑时为1...）
    const hourIndex = (hour + 1) % 12; // 简化处理
    return (monthIndex - hourIndex + 12) % 12;
  }
  
  /**
   * 定位身宫
   * 公式：从寅宫起正月，顺时针数到出生月，再顺时针数到出生时
   */
  private locateShenGong(month: number, hour: number): number {
    const monthIndex = (2 + month - 1) % 12;
    const hourIndex = (hour + 1) % 12;
    return (monthIndex + hourIndex) % 12;
  }
  
  /**
   * 定位紫微星
   * 公式：(五行局数 + 农历生日) mod 12
   */
  private locateZiwei(wuxingJu: number, day: number): number {
    return (wuxingJu + day - 1) % 12;
  }
  
  /**
   * 安十四主星
   * 紫微星系：顺时针
   * 天府星系：逆时针
   */
  private placeMainStars(ziweiIndex: number): StarPositions {
    const stars: StarPositions = {};
    
    // 紫微星系（顺时针）
    this.addStar(stars, ziweiIndex, '紫微');
    this.addStar(stars, (ziweiIndex + 1) % 12, '天机');
    this.addStar(stars, (ziweiIndex + 11) % 12, '太阳');
    this.addStar(stars, (ziweiIndex + 3) % 12, '武曲');
    this.addStar(stars, (ziweiIndex + 4) % 12, '天同');
    this.addStar(stars, (ziweiIndex + 8) % 12, '廉贞');
    
    // 天府星系（逆时针，从紫微+4宫开始）
    const tianfuIndex = (ziweiIndex + 4) % 12;
    this.addStar(stars, tianfuIndex, '天府');
    this.addStar(stars, (tianfuIndex - 1 + 12) % 12, '太阴');
    this.addStar(stars, (tianfuIndex - 2 + 12) % 12, '贪狼');
    this.addStar(stars, (tianfuIndex - 3 + 12) % 12, '巨门');
    this.addStar(stars, (tianfuIndex - 4 + 12) % 12, '天相');
    this.addStar(stars, (tianfuIndex - 5 + 12) % 12, '天梁');
    this.addStar(stars, (tianfuIndex - 6 + 12) % 12, '七杀');
    this.addStar(stars, (tianfuIndex + 4) % 12, '破军');
    
    return stars;
  }
  
  /**
   * 安辅星（简化版，后续完善）
   */
  private placeAuxiliaryStars(lunar: any, birthInfo: BirthInfo): StarPositions {
    // TODO: 实现左辅、右弼、文昌、文曲等辅星的安放
    return {};
  }
  
  /**
   * 组装宫位
   */
  private assemblePalaces(
    mingGongIndex: number,
    shenGongIndex: number,
    mainStars: StarPositions,
    auxiliaryStars: StarPositions,
    sihua: Sihua
  ): Palace[] {
    const palaces = createAllPalaces();
    
    // 将命宫调整到索引0
    const reorderedPalaces: Palace[] = [];
    for (let i = 0; i < 12; i++) {
      const originalIndex = (mingGongIndex + i) % 12;
      const palace = { ...palaces[originalIndex] };
      palace.index = i;
      
      // 添加主星
      const mainStarNames = mainStars[originalIndex] || [];
      palace.stars = mainStarNames.map(name => getMainStar(name)).filter(Boolean) as Star[];
      
      // 添加辅星（简化版）
      const auxStarNames = auxiliaryStars[originalIndex] || [];
      // TODO: 添加辅星数据
      
      // 应用四化
      palace.sihua = this.applySihuaToPalace(palace, sihua);
      
      reorderedPalaces.push(palace);
    }
    
    return reorderedPalaces;
  }
  
  /**
   * 应用四化到宫位
   */
  private applySihuaToPalace(palace: Palace, sihua: Sihua): Sihua | undefined {
    const starNames = palace.stars.map(s => s.name);
    const hasSihua = Object.values(sihua).some(star => starNames.includes(star || ''));
    return hasSihua ? sihua : undefined;
  }
  
  /**
   * 格局识别
   */
  private detectPatterns(palaces: Palace[]): Pattern[] {
    const patterns: Pattern[] = [];
    const mingGong = palaces[0]; // 命宫
    
    // 1. 紫府同宫（最佳格局之一）
    if (this.hasStars(mingGong, ['紫微', '天府'])) {
      patterns.push({
        name: '紫府同宫',
        level: 'excellent',
        description: '帝王格局，领导能力强，一生富贵',
        score: 95
      });
    }
    
    // 2. 府相朝垣
    if (this.hasStars(mingGong, ['天府']) && 
        this.hasStarsInTriangle(palaces, 0, ['天相'])) {
      patterns.push({
        name: '府相朝垣',
        level: 'excellent',
        description: '财官双美，事业顺遂',
        score: 90
      });
    }
    
    // 3. 君臣庆会
    if (this.hasStars(mingGong, ['紫微']) &&
        this.hasStarsInTriangle(palaces, 0, ['天府', '天相'])) {
      patterns.push({
        name: '君臣庆会',
        level: 'good',
        description: '有贵人相助，事业有成',
        score: 85
      });
    }
    
    return patterns.sort((a, b) => b.score - a.score);
  }
  
  /**
   * 计算大限（每10年一个大限）
   */
  private calculateDaxian(
    palaces: Palace[], 
    gender: 'male' | 'female',
    wuxingJu: number
  ): Daxian[] {
    const daxianList: Daxian[] = [];
    const mingGongIndex = 0;
    
    // 起大限的岁数：水二局2岁起，木三局3岁起...
    const startAge = wuxingJu;
    
    // 阳男阴女顺行，阴男阳女逆行
    const isForward = (gender === 'male' && wuxingJu % 2 === 0) ||
                      (gender === 'female' && wuxingJu % 2 === 1);
    
    for (let i = 0; i < 12; i++) {
      const age = startAge + i * 10;
      const palaceIndex = isForward 
        ? (mingGongIndex + i) % 12
        : (mingGongIndex - i + 12) % 12;
      
      daxianList.push({
        startAge: age,
        endAge: age + 9,
        palace: palaces[palaceIndex],
        palaceIndex
      });
    }
    
    return daxianList;
  }
  
  /**
   * 辅助函数：添加星曜
   */
  private addStar(map: StarPositions, index: number, star: string) {
    if (!map[index]) {
      map[index] = [];
    }
    map[index].push(star);
  }
  
  /**
   * 辅助函数：检查宫位是否有指定星曜
   */
  private hasStars(palace: Palace, stars: string[]): boolean {
    return stars.every(star => 
      palace.stars.some(s => s.name === star)
    );
  }
  
  /**
   * 辅助函数：检查三方四正是否有指定星曜
   */
  private hasStarsInTriangle(palaces: Palace[], centerIndex: number, stars: string[]): boolean {
    const triangleIndexes = [
      (centerIndex + 4) % 12,
      (centerIndex + 8) % 12
    ];
    
    return stars.some(star =>
      triangleIndexes.some(idx =>
        palaces[idx].stars.some(s => s.name === star)
      )
    );
  }
}


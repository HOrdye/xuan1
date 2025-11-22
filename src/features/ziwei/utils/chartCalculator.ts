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
import { getMainStar, getAuxiliaryStar } from '../data/stars';
import { solarToLunar } from './lunarConverter';
import { placeAllAuxiliaryStars } from './auxiliaryStars';
import { locateMingGongDizhi, calculatePalaceDizhi } from './dizhiCalculator';
import { calculateMingGongTiangan, calculateAllGonggan } from './gongganCalculator';
import { calculateChangsheng } from './changshengCalculator';
import { calculateMingZhu, calculateShenZhu } from './mingzhuCalculator';
import { calculateStarBrightness } from './brightnessCalculator';
import { calculateLiunianInfo, calculateLiumonthInfo, calculateLiudayInfo } from './liunianCalculator';
import { calculateSihuaFeixing, type SihuaFeixingResult } from './sihuaFeixingCalculator';

/**
 * 紫微斗数排盘计算器
 */
export class ZiweiChartCalculator {
  /**
   * 主函数：生成完整命盘
   */
  calculate(birthInfo: BirthInfo): ZiweiChart {
    try {
      // 1. 计算农历（简化版，实际应该使用农历转换库）
      const lunar = this.toLunar(birthInfo);
      console.log('📅 农历转换:', lunar);
      
      // 2. 计算五行局
      const wuxingJu = this.calculateWuxingJu(lunar.year, lunar.month);
      console.log('🔢 五行局:', wuxingJu, getJuName(wuxingJu));
      
      // 3. 定位命宫
      const mingGongIndex = this.locateMingGong(lunar.month, birthInfo.hour);   
      console.log('📍 命宫索引:', mingGongIndex);

      // 4. 定位身宫
      const shenGongIndex = this.locateShenGong(lunar.month, birthInfo.hour);   
      console.log('📍 身宫索引:', shenGongIndex);

      // 3.5. 计算命宫地支
      const mingGongDizhi = locateMingGongDizhi(birthInfo.hour);
      console.log('📍 命宫地支:', mingGongDizhi);

      // 3.6. 计算所有宫位地支
      const palaceDizhiList = calculatePalaceDizhi(mingGongDizhi);
      console.log('📍 宫位地支:', palaceDizhiList);

      // 3.7. 计算命宫天干（宫干）
      const yearStem = getTianganByYear(birthInfo.year);
      const mingGongTiangan = calculateMingGongTiangan(yearStem, mingGongDizhi);
      console.log('📍 命宫天干:', mingGongTiangan);

      // 3.8. 计算所有宫位天干
      const palaceTianganList = calculateAllGonggan(
        mingGongTiangan,
        mingGongDizhi,
        palaceDizhiList
      );
      console.log('📍 宫位天干:', palaceTianganList);

      // 3.9. 计算长生十二神
      const wuxingJuName = getJuName(wuxingJu) as WuxingJu;
      const changshengMap = calculateChangsheng(
        wuxingJuName,
        mingGongDizhi,
        palaceDizhiList
      );
      console.log('📍 长生十二神:', changshengMap);

      // 3.10. 计算命主身主
      const mingZhu = calculateMingZhu(mingGongDizhi);
      const shenZhu = calculateShenZhu(birthInfo.hour);
      console.log('⭐ 命主:', mingZhu, '身主:', shenZhu);
      
      // 5. 定位紫微星
      const ziweiIndex = this.locateZiwei(wuxingJu, lunar.day);
      console.log('⭐ 紫微星索引:', ziweiIndex);

      // 6. 安十四主星
      const mainStars = this.placeMainStars(ziweiIndex);
      console.log('⭐ 主星分布:', mainStars);

      // 7. 安辅星、煞星、吉星
      const auxiliaryStars = placeAllAuxiliaryStars(
        birthInfo.year,
        lunar.month,
        birthInfo.hour
      );

      // 8. 计算四化
      const sihua = getSihuaByTiangan(yearStem);
      console.log('🔄 四化:', sihua);
      
      // 9. 组装宫位
      const palaces = this.assemblePalaces(
        mingGongIndex,
        shenGongIndex,
        mainStars,
        auxiliaryStars,
        sihua,
        palaceDizhiList,
        palaceTianganList,
        changshengMap
      );
      console.log('🏛️ 宫位组装完成，数量:', palaces.length);
      
      // 10. 识别格局
      const patterns = this.detectPatterns(palaces);
      console.log('🎯 识别到格局:', patterns.length, '个');
      
      // 11. 计算大限
      const daxian = this.calculateDaxian(
        palaces, 
        birthInfo.gender, 
        wuxingJu,
        birthInfo.year,
        palaceTianganList,
        palaceDizhiList
      );
      console.log('📊 大限计算完成，数量:', daxian.length);

        // 12. 计算当前流年流月流日信息（传入本命盘以计算关联）
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const currentDay = now.getDate();

        const result: ZiweiChart = {
          birthInfo,
          wuxingJu: getJuName(wuxingJu) as WuxingJu,
          palaces,
          patterns,
          mingGong: palaces[0], // 重新排序后，命宫在索引0
          shenGong: palaces[(shenGongIndex - mingGongIndex + 12) % 12], // 计算身宫在新数组中的位置
          mingZhu, // 命主星
          shenZhu, // 身主星
          daxian,
          createdAt: new Date()
        };

        // 计算流年流月流日信息（传入本命盘以计算关联）
        const liunian = calculateLiunianInfo(currentYear, result);
        const liumonth = calculateLiumonthInfo(currentYear, currentMonth, result);
        const liuday = calculateLiudayInfo(currentYear, currentMonth, currentDay, result);
        
        console.log('📅 流年信息:', liunian);
        console.log('📅 流月信息:', liumonth);
        console.log('📅 流日信息:', liuday);
        
        // 将流年流月流日信息添加到结果中
        result.liunian = liunian;
        result.liumonth = liumonth;
        result.liuday = liuday;
      
      console.log('✅ 命盘生成完成:', result);
      return result;
    } catch (error: any) {
      console.error('❌ 排盘计算错误:', error);
      console.error('错误堆栈:', error.stack);
      throw new Error(`排盘失败: ${error.message || '未知错误'}`);
    }
  }
  
  /**
   * 转换为农历
   */
  private toLunar(birthInfo: BirthInfo): { year: number; month: number; day: number } {
    const lunar = solarToLunar(birthInfo.year, birthInfo.month, birthInfo.day);
    return {
      year: lunar.year,
      month: lunar.month,
      day: lunar.day
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
   * 组装宫位
   */
  private assemblePalaces(
    mingGongIndex: number,
    shenGongIndex: number,
    mainStars: StarPositions,
    auxiliaryStars: StarPositions,
    sihua: Sihua,
    palaceDizhiList: import('../types').Dizhi[],
    palaceTianganList: import('../types').Tiangan[],
    changshengMap: Record<number, import('../types').ChangshengStatus>
  ): Palace[] {
    const palaces = createAllPalaces();
    
    // 将命宫调整到索引0
    const reorderedPalaces: Palace[] = [];
    for (let i = 0; i < 12; i++) {
      const originalIndex = (mingGongIndex + i) % 12;
      const palace = { ...palaces[originalIndex] };
      palace.index = i;

      // 添加地支
      palace.dizhi = palaceDizhiList[i];

      // 添加宫干（天干）
      palace.tiangan = palaceTianganList[i];

      // 添加长生十二神
      palace.changsheng = changshengMap[i];

      // 添加主星
      const mainStarNames = mainStars[originalIndex] || [];
      palace.stars = mainStarNames
        .map(name => {
          const star = getMainStar(name);
          if (!star) {
            console.warn(`警告：未找到星曜数据：${name}`);
            return undefined;
          }
          // 计算庙旺陷状态
          const brightness = calculateStarBrightness(star.name, palace.dizhi);
          return {
            ...star,
            brightness
          };
        })
        .filter((star): star is Star => star !== undefined);

      // 添加辅星
      const auxStarNames = auxiliaryStars[originalIndex] || [];
      const auxStars = auxStarNames
        .map(name => {
          const star = getAuxiliaryStar(name);
          if (!star) {
            console.warn(`警告：未找到辅星数据：${name}`);
            return undefined;
          }
          // 计算庙旺陷状态
          const brightness = calculateStarBrightness(star.name, palace.dizhi);
          return {
            ...star,
            brightness
          };
        })
        .filter((star): star is Star => star !== undefined);
      palace.stars.push(...auxStars);

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
        score: 95,
        stars: ['紫微', '天府']
      });
    }

    // 2. 府相朝垣
    if (this.hasStars(mingGong, ['天府']) &&
        this.hasStarsInTriangle(palaces, 0, ['天相'])) {
      patterns.push({
        name: '府相朝垣',
        level: 'excellent',
        description: '财官双美，事业顺遂',
        score: 90,
        stars: ['天府', '天相']
      });
    }

    // 3. 君臣庆会
    if (this.hasStars(mingGong, ['紫微']) &&
        this.hasStarsInTriangle(palaces, 0, ['天府', '天相'])) {
      patterns.push({
        name: '君臣庆会',
        level: 'good',
        description: '有贵人相助，事业有成',
        score: 85,
        stars: ['紫微', '天府', '天相']
      });
    }

    // 4. 杀破狼（七杀、破军、贪狼）
    const hasQisha = this.hasStars(mingGong, ['七杀']);
    const hasPojun = this.hasStars(mingGong, ['破军']);
    const hasTanlang = this.hasStars(mingGong, ['贪狼']);
    if ((hasQisha && hasPojun) || (hasQisha && hasTanlang) || (hasPojun && hasTanlang)) {
      patterns.push({
        name: '杀破狼',
        level: 'good',
        description: '变动格局，勇于创新，适合创业和变革',
        score: 80,
        stars: ['七杀', '破军', '贪狼'].filter(star => 
          mingGong.stars.some(s => s.name === star)
        )
      });
    }

    // 5. 机月同梁（天机、太阴、天同、天梁）
    const hasTianji = this.hasStars(mingGong, ['天机']);
    const hasTaiyin = this.hasStars(mingGong, ['太阴']);
    const hasTiantong = this.hasStars(mingGong, ['天同']);
    const hasTianliang = this.hasStars(mingGong, ['天梁']);
    const jiyueCount = [hasTianji, hasTaiyin, hasTiantong, hasTianliang].filter(Boolean).length;
    if (jiyueCount >= 3) {
      patterns.push({
        name: '机月同梁',
        level: 'good',
        description: '稳定格局，适合公职和稳定工作',
        score: 75,
        stars: ['天机', '太阴', '天同', '天梁'].filter(star =>
          mingGong.stars.some(s => s.name === star)
        )
      });
    }

    // 6. 日月同宫（太阳、太阴）
    if (this.hasStars(mingGong, ['太阳', '太阴'])) {
      patterns.push({
        name: '日月同宫',
        level: 'good',
        description: '阴阳调和，性格平衡，人缘好',
        score: 80,
        stars: ['太阳', '太阴']
      });
    }

    // 7. 武贪格（武曲、贪狼）
    if (this.hasStars(mingGong, ['武曲', '贪狼'])) {
      patterns.push({
        name: '武贪格',
        level: 'good',
        description: '财星格局，理财能力强，适合经商',
        score: 78,
        stars: ['武曲', '贪狼']
      });
    }

    // 8. 紫微独坐
    if (this.hasStars(mingGong, ['紫微']) && 
        !this.hasStars(mingGong, ['天府', '天相', '天机', '太阳'])) {
      patterns.push({
        name: '紫微独坐',
        level: 'normal',
        description: '紫微独坐，需要辅星配合才能发挥最大能量',
        score: 70,
        stars: ['紫微']
      });
    }

    // 9. 空劫夹命（地空、地劫夹命宫）
    const leftPalace = palaces[11]; // 父母宫
    const rightPalace = palaces[1]; // 兄弟宫
    if ((this.hasStars(leftPalace, ['地空']) && this.hasStars(rightPalace, ['地劫'])) ||
        (this.hasStars(leftPalace, ['地劫']) && this.hasStars(rightPalace, ['地空']))) {
      patterns.push({
        name: '空劫夹命',
        level: 'poor',
        description: '空劫夹命，容易空想，需要脚踏实地',
        score: 50,
        stars: ['地空', '地劫']
      });
    }

    // 10. 魁钺夹命（天魁、天钺夹命宫）
    if ((this.hasStars(leftPalace, ['天魁']) && this.hasStars(rightPalace, ['天钺'])) ||
        (this.hasStars(leftPalace, ['天钺']) && this.hasStars(rightPalace, ['天魁']))) {
      patterns.push({
        name: '魁钺夹命',
        level: 'excellent',
        description: '魁钺夹命，贵人运强，容易得到帮助',
        score: 88,
        stars: ['天魁', '天钺']
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
      wuxingJu: number,
      birthYear: number,
      palaceTianganList: import('../types').Tiangan[],
      palaceDizhiList: import('../types').Dizhi[]
    ): import('../types').Daxian[] {
      const daxianList: import('../types').Daxian[] = [];
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

        // 计算大限天干地支
        // 大限天干：根据大限起始年份的天干
        const daxianStartYear = birthYear + age;
        const daxianTiangan = getTianganByYear(daxianStartYear);
        
        // 大限地支：大限命宫的地支
        const daxianDizhi = palaceDizhiList[palaceIndex];
        
          // 计算大限四化
          const daxianSihua = getSihuaByTiangan(daxianTiangan);

          // 计算大限四化飞入各宫位
          const daxianFeixing = calculateSihuaFeixing(palaces, daxianSihua);

          daxianList.push({
            startAge: age,
            endAge: age + 9,
            palace: palaces[palaceIndex],
            palaceIndex,
            tiangan: daxianTiangan,
            dizhi: daxianDizhi,
            sihua: daxianSihua,
            feixing: daxianFeixing // 大限四化飞星结果
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


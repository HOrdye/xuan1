/**
 * 紫微融合服务
 * 将紫微命盘数据转换为 Phase 0 融合接口格式
 */

import type { ZiweiChart, Palace, BirthInfo } from '../types';
import type {
  ZiweiFortuneEnhancement,
  ZiweiMatchAnalysis,
  PalacePerspective,
  QuestionType,
  ZiweiResult,
  ZiweiPalace,
  ZiweiMainStar,
  SihuaType,
} from '../../../shared/types/cross-system';
import { QuestionClassifierService } from '../../../shared/services/crossSystemService';
import {
  convertPalaceNameToId,
  convertMainStarNamesToIds,
  convertMainStarIdToName,
} from '../utils/typeAdapter';
import { getSihuaByTiangan, getTianganByYear } from '../data/sihua';
import { calculateLiudayInfo } from '../utils/liunianCalculator';

/**
 * 紫微融合服务类
 */
export class ZiweiFusionService {
  /**
   * 生成运势增强数据
   * @param chart 紫微命盘
   * @param date 日期（可选，默认今天）
   * @returns 运势增强数据
   */
  static generateFortuneEnhancement(
    chart: ZiweiChart,
    date?: Date
  ): ZiweiFortuneEnhancement {
    const targetDate = date || new Date();
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    const day = targetDate.getDate();

    // 计算流年四化
    const yearStem = getTianganByYear(year);
    const sihua = getSihuaByTiangan(yearStem);

    // 转换为融合接口格式
    const sihuaAnalysis = {
      year: this.convertSihuaToAnalysis(sihua),
    };

    // Week 1 MVP: 计算流日信息（流日主星显示）
    let flowDay: string | undefined;
    let flowDayMainStars: ZiweiMainStar[] | undefined;
    let flowDayPalace: ZiweiPalace | undefined;
    
    try {
      const liudayInfo = calculateLiudayInfo(year, month, day, chart);
      flowDay = `${year}年${month}月${day}日 (${liudayInfo.tiangan}${liudayInfo.dizhi})`;
      
      // 获取流日命宫的主星（Week 1 MVP基础版：仅显示流日命宫主星）
      if (liudayInfo.mingGongIndex !== undefined && chart.palaces) {
        const liudayMingGong = chart.palaces[liudayInfo.mingGongIndex];
        if (liudayMingGong) {
          flowDayPalace = convertPalaceNameToId(liudayMingGong.name);
          
          // 提取主星
          const mainStars = liudayMingGong.stars
            .filter(star => star.category === '主星')
            .map(star => convertMainStarNamesToIds([star.name])[0])
            .filter((id): id is ZiweiMainStar => id !== undefined);
          
          if (mainStars.length > 0) {
            flowDayMainStars = mainStars;
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ 计算流日信息失败:', error);
    }

    // 生成宫位建议（简化版，后续可以优化）
    const palaceAdvice = this.generatePalaceAdvice(chart, targetDate);

    // 计算整体能量（简化版）
    const overallEnergy = this.calculateOverallEnergy(chart, targetDate);

    // 确定幸运宫位和挑战宫位
    const { luckyPalace, challengePalace } = this.determineLuckyAndChallengePalaces(
      chart,
      targetDate
    );

    return {
      flowYear: `${year}年`,
      flowMonth: `${year}年${month}月`,
      flowDay, // Week 1 MVP新增
      flowDayMainStars, // Week 1 MVP新增
      flowDayPalace, // Week 1 MVP新增
      sihua: sihuaAnalysis,
      palaceAdvice,
      overallEnergy,
      luckyPalace: convertPalaceNameToId(luckyPalace.name),
      challengePalace: challengePalace
        ? convertPalaceNameToId(challengePalace.name)
        : undefined,
    };
  }

  /**
   * 生成两难抉择匹配分析
   * @param chart 紫微命盘
   * @param optionA 选项A
   * @param optionB 选项B
   * @param questionType 问题类型
   * @returns 匹配分析结果
   */
  static generateMatchAnalysis(
    chart: ZiweiChart,
    optionA: string,
    optionB: string,
    questionType: QuestionType
  ): ZiweiMatchAnalysis {
    // 获取相关宫位
    const relatedPalaceId = QuestionClassifierService.getPalaceByQuestionType(questionType);
    const relatedPalace = chart.palaces.find(
      p => convertPalaceNameToId(p.name) === relatedPalaceId
    ) || chart.mingGong;

    // 分析选项A
    const optionAAnalysis = this.analyzeOption(
      optionA,
      relatedPalace,
      chart
    );

    // 分析选项B
    const optionBAnalysis = this.analyzeOption(
      optionB,
      relatedPalace,
      chart
    );

    // 确定推荐
    const recommendation = this.determineRecommendation(
      optionAAnalysis,
      optionBAnalysis
    );

    // 生成综合分析
    const overallAnalysis = this.generateOverallAnalysis(
      optionAAnalysis,
      optionBAnalysis,
      recommendation
    );

    return {
      optionA: {
        palace: convertPalaceNameToId(relatedPalace.name),
        matchScore: optionAAnalysis.matchScore,
        mainStars: convertMainStarNamesToIds(optionAAnalysis.mainStars),
        analysis: optionAAnalysis.analysis,
        successProbability: optionAAnalysis.successProbability,
        keywords: optionAAnalysis.keywords,
      },
      optionB: {
        palace: convertPalaceNameToId(relatedPalace.name),
        matchScore: optionBAnalysis.matchScore,
        mainStars: convertMainStarNamesToIds(optionBAnalysis.mainStars),
        analysis: optionBAnalysis.analysis,
        successProbability: optionBAnalysis.successProbability,
        keywords: optionBAnalysis.keywords,
      },
      recommendation,
      overallAnalysis,
    };
  }

  /**
   * 生成命盘视角（用于易经占卜）
   * @param chart 紫微命盘
   * @param question 问题
   * @param hexagramName 卦象名称
   * @returns 命盘视角
   */
  static generatePalacePerspective(
    chart: ZiweiChart,
    question: string,
    hexagramName: string
  ): PalacePerspective {
    // 识别问题类型
    const classification = QuestionClassifierService.classify(question);
    const relatedPalaceId = classification.relatedPalace;

    // 找到相关宫位
    const relatedPalace = chart.palaces.find(
      p => convertPalaceNameToId(p.name) === relatedPalaceId
    ) || chart.mingGong;

    // 提取主星名称
    const mainStars = relatedPalace.stars
      .filter(star => star.category === '主星')
      .map(star => star.name);

    // 生成宫位分析
    const palaceAnalysis = this.generatePalaceAnalysis(relatedPalace, chart);

    // 生成卦象与宫位关联分析
    const hexagramConnection = this.generateHexagramConnection(
      hexagramName,
      relatedPalace
    );

    // 生成融合建议
    const integratedAdvice = this.generateIntegratedAdvice(
      relatedPalace,
      hexagramName
    );

    // 计算能量匹配度（简化版）
    const energyMatch = this.calculateEnergyMatch(relatedPalace);

    return {
      relatedPalace: convertPalaceNameToId(relatedPalace.name),
      mainStars: convertMainStarNamesToIds(mainStars),
      palaceAnalysis,
      hexagramConnection,
      integratedAdvice,
      energyMatch,
    };
  }

  /**
   * 生成紫微结果（用于三维解读）
   * @param chart 紫微命盘
   * @param question 问题
   * @returns 紫微结果
   */
  static generateZiweiResult(
    chart: ZiweiChart,
    question: string
  ): ZiweiResult {
    // 识别问题类型
    const classification = QuestionClassifierService.classify(question);
    const relatedPalaceId = classification.relatedPalace;

    // 找到相关宫位
    const relatedPalace = chart.palaces.find(
      p => convertPalaceNameToId(p.name) === relatedPalaceId
    ) || chart.mingGong;

    // 生成分析
    const analysis = this.generatePalaceAnalysis(relatedPalace, chart);

    // 生成建议
    const advice = this.generateAdvice(relatedPalace, chart, question);

    return {
      chart: {
        palaces: chart.palaces.map(palace => ({
          palace: convertPalaceNameToId(palace.name),
          mainStars: convertMainStarNamesToIds(
            palace.stars
              .filter(star => star.category === '主星')
              .map(star => star.name)
          ),
          sihua: palace.sihua ? this.convertSihuaToArray(palace.sihua) : undefined,
        })),
      },
      analysis,
      advice,
      relatedPalace: convertPalaceNameToId(relatedPalace.name),
    };
  }

  // ==================== 私有辅助方法 ====================

  /**
   * 转换四化格式
   */
  private static convertSihuaToAnalysis(sihua: any): Record<string, SihuaType> {
    const result: Record<string, SihuaType> = {};
    if (sihua.lu) result[sihua.lu] = 'lu';
    if (sihua.quan) result[sihua.quan] = 'quan';
    if (sihua.ke) result[sihua.ke] = 'ke';
    if (sihua.ji) result[sihua.ji] = 'ji';
    return result;
  }

  /**
   * 转换四化为数组格式
   */
  private static convertSihuaToArray(sihua: any): Array<'lu' | 'quan' | 'ke' | 'ji'> {
    const result: Array<'lu' | 'quan' | 'ke' | 'ji'> = [];
    if (sihua.lu) result.push('lu');
    if (sihua.quan) result.push('quan');
    if (sihua.ke) result.push('ke');
    if (sihua.ji) result.push('ji');
    return result;
  }

  /**
   * 生成宫位建议
   */
  private static generatePalaceAdvice(
    chart: ZiweiChart,
    date: Date
  ): Array<{
    palace: ZiweiPalace;
    mainStars: ZiweiMainStar[];
    advice: string;
    score: number;
    keywords: string[];
  }> {
    // 简化版实现，后续可以优化
    return chart.palaces.slice(0, 3).map(palace => ({
      palace: convertPalaceNameToId(palace.name),
      mainStars: convertMainStarNamesToIds(
        palace.stars
          .filter(star => star.category === '主星')
          .map(star => star.name)
      ),
      advice: `${palace.name}当前能量较强，适合相关事务的推进。`,
      score: 70,
      keywords: ['能量', '推进', '发展'],
    }));
  }

  /**
   * 计算整体能量
   */
  private static calculateOverallEnergy(chart: ZiweiChart, date: Date): number {
    // 简化版实现，后续可以优化
    return 75;
  }

  /**
   * 确定幸运宫位和挑战宫位
   */
  private static determineLuckyAndChallengePalaces(
    chart: ZiweiChart,
    date: Date
  ): { luckyPalace: Palace; challengePalace?: Palace } {
    // 简化版实现，后续可以优化
    return {
      luckyPalace: chart.mingGong,
      challengePalace: chart.palaces[6], // 迁移宫
    };
  }

  /**
   * 分析选项
   */
  private static analyzeOption(
    option: string,
    palace: Palace,
    chart: ZiweiChart
  ): {
    matchScore: number;
    mainStars: string[];
    analysis: string;
    successProbability: number;
    keywords: string[];
  } {
    const mainStars = palace.stars
      .filter(star => star.category === '主星')
      .map(star => star.name);

    // 简化版匹配算法，后续可以优化
    const matchScore = 60 + Math.floor(Math.random() * 30);
    const successProbability = matchScore - 10;

    return {
      matchScore,
      mainStars,
      analysis: `基于${palace.name}的星曜配置，${option}的匹配度为${matchScore}分。`,
      successProbability,
      keywords: ['匹配', '适配', '成功'],
    };
  }

  /**
   * 确定推荐
   */
  private static determineRecommendation(
    optionA: any,
    optionB: any
  ): 'optionA' | 'optionB' | 'neutral' {
    const diff = optionA.matchScore - optionB.matchScore;
    if (diff > 10) return 'optionA';
    if (diff < -10) return 'optionB';
    return 'neutral';
  }

  /**
   * 生成综合分析
   */
  private static generateOverallAnalysis(
    optionA: any,
    optionB: any,
    recommendation: string
  ): string {
    return `选项A匹配度${optionA.matchScore}分，选项B匹配度${optionB.matchScore}分。${recommendation === 'optionA' ? '建议选择选项A' : recommendation === 'optionB' ? '建议选择选项B' : '两个选项匹配度相近，需要综合考虑其他因素'}。`;
  }

  /**
   * 生成宫位分析
   */
  private static generatePalaceAnalysis(palace: Palace, chart: ZiweiChart): string {
    const mainStars = palace.stars
      .filter(star => star.category === '主星')
      .map(star => star.name)
      .join('、');

    return `${palace.name}坐${mainStars}，${palace.description || '能量较强，适合相关事务的推进'}。`;
  }

  /**
   * 生成卦象关联分析
   */
  private static generateHexagramConnection(
    hexagramName: string,
    palace: Palace
  ): string {
    return `${hexagramName}卦与${palace.name}的能量相互呼应，${palace.description || '形成良好的能量共振'}。`;
  }

  /**
   * 生成融合建议
   */
  private static generateIntegratedAdvice(
    palace: Palace,
    hexagramName: string
  ): string {
    return `结合${palace.name}的星曜配置和${hexagramName}卦的指引，建议在相关事务中保持平衡，顺势而为。`;
  }

  /**
   * 计算能量匹配度
   */
  private static calculateEnergyMatch(palace: Palace): number {
    // 简化版实现，后续可以优化
    return 70 + Math.floor(Math.random() * 20);
  }

  /**
   * 生成建议
   */
  private static generateAdvice(
    palace: Palace,
    chart: ZiweiChart,
    question: string
  ): string {
    return `基于${palace.name}的星曜配置，建议在${question}相关事务中保持耐心，顺势而为。`;
  }
}


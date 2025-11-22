/**
 * 跨系统融合类型定义
 * 用于紫微斗数与现有功能（易经、塔罗、运势、两难）的深度融合
 */

// ==================== 紫微斗数基础类型 ====================

/**
 * 紫微斗数宫位枚举
 */
export type ZiweiPalace =
  | 'ming' // 命宫
  | 'xiongdi' // 兄弟宫
  | 'fuqi' // 夫妻宫
  | 'zinu' // 子女宫
  | 'cai' // 财帛宫
  | 'jiluan' // 疾厄宫
  | 'qianyi' // 迁移宫
  | 'pugu' // 仆役宫
  | 'guanlu' // 官禄宫
  | 'tianzhai' // 田宅宫
  | 'fude' // 福德宫
  | 'fumu'; // 父母宫

/**
 * 紫微斗数主星枚举
 */
export type ZiweiMainStar =
  | 'ziwei' // 紫微
  | 'tianji' // 天机
  | 'taiyang' // 太阳
  | 'wuqu' // 武曲
  | 'tiantong' // 天同
  | 'lianzhen' // 廉贞
  | 'tianfu' // 天府
  | 'taiyin' // 太阴
  | 'tanlang' // 贪狼
  | 'jumen' // 巨门
  | 'tianxiang' // 天相
  | 'tianliang' // 天梁
  | 'qisha' // 七杀
  | 'poyao'; // 破军

/**
 * 四化类型
 */
export type SihuaType = 'lu' | 'quan' | 'ke' | 'ji'; // 禄、权、科、忌

/**
 * 四化分析
 */
export interface SihuaAnalysis {
  year: {
    [key: string]: SihuaType; // 星曜名称 -> 四化类型
  };
  month?: {
    [key: string]: SihuaType;
  };
  day?: {
    [key: string]: SihuaType;
  };
}

/**
 * 宫位建议
 */
export interface PalaceAdvice {
  palace: ZiweiPalace;
  mainStars: ZiweiMainStar[];
  advice: string;
  score: number; // 0-100 适配度评分
  keywords: string[];
}

/**
 * 紫微命盘增强数据（用于运势）
 */
export interface ZiweiFortuneEnhancement {
  flowYear: string; // 流年
  flowMonth?: string; // 流月
  flowDay?: string; // 流日（Week 1 MVP新增）
  flowDayMainStars?: ZiweiMainStar[]; // 流日主星（Week 1 MVP新增）
  flowDayPalace?: ZiweiPalace; // 流日主星所在宫位（Week 1 MVP新增）
  sihua: SihuaAnalysis; // 四化分析
  palaceAdvice: PalaceAdvice[]; // 宫位建议
  overallEnergy: number; // 整体能量 0-100
  luckyPalace: ZiweiPalace; // 幸运宫位
  challengePalace?: ZiweiPalace; // 挑战宫位
}

/**
 * 紫微命盘匹配分析（用于两难抉择）
 */
export interface ZiweiMatchAnalysis {
  optionA: {
    palace: ZiweiPalace;
    matchScore: number; // 0-100 匹配度
    mainStars: ZiweiMainStar[];
    analysis: string;
    successProbability: number; // 0-100 成功概率
    keywords: string[];
  };
  optionB: {
    palace: ZiweiPalace;
    matchScore: number;
    mainStars: ZiweiMainStar[];
    analysis: string;
    successProbability: number;
    keywords: string[];
  };
  recommendation: 'optionA' | 'optionB' | 'neutral';
  overallAnalysis: string;
}

/**
 * 紫微命盘视角（用于易经占卜）
 */
export interface PalacePerspective {
  relatedPalace: ZiweiPalace; // 相关宫位
  mainStars: ZiweiMainStar[];
  palaceAnalysis: string; // 宫位分析
  hexagramConnection: string; // 卦象与宫位的关联分析
  integratedAdvice: string; // 融合建议
  energyMatch: number; // 0-100 能量匹配度
}

/**
 * 塔罗与宫位能量呼应分析
 */
export interface TarotPalaceResonance {
  tarotCard: string; // 塔罗牌名称
  relatedPalace: ZiweiPalace; // 对应宫位
  energyResonance: number; // 0-100 能量呼应度
  analysis: string; // 呼应分析
  integratedMessage: string; // 综合讯息
}

// ==================== 跨系统分析类型 ====================

/**
 * 问题类型枚举（用于自动识别和宫位匹配）
 */
export type QuestionType =
  | 'career' // 事业/工作
  | 'wealth' // 财运/投资
  | 'love' // 感情/恋爱
  | 'marriage' // 婚姻
  | 'health' // 健康
  | 'study' // 学习/考试
  | 'family' // 家庭
  | 'friendship' // 友情
  | 'travel' // 出行/迁移
  | 'property' // 房产
  | 'general'; // 一般性问题

/**
 * 问题类型识别结果
 */
export interface QuestionClassification {
  type: QuestionType;
  confidence: number; // 0-100 置信度
  keywords: string[]; // 识别到的关键词
  relatedPalace: ZiweiPalace; // 相关宫位
}

/**
 * 易经占卜结果（扩展）
 */
export interface YijingResult {
  hexagram: {
    name: string;
    number: number;
    symbol: string;
  };
  changingLines: number[];
  interpretation: string;
  advice: string;
  // 紫微增强字段（可选）
  palacePerspective?: PalacePerspective;
}

/**
 * 塔罗占卜结果（扩展）
 */
export interface TarotResult {
  cards: Array<{
    name: string;
    position: string;
    meaning: string;
  }>;
  overallInterpretation: string;
  advice: string;
  // 紫微增强字段（可选）
  palaceResonance?: TarotPalaceResonance[];
}

/**
 * 紫微斗数结果
 */
export interface ZiweiResult {
  chart: {
    palaces: Array<{
      palace: ZiweiPalace;
      mainStars: ZiweiMainStar[];
      sihua?: SihuaType[];
    }>;
  };
  analysis: string;
  advice: string;
  relatedPalace?: ZiweiPalace; // 针对问题的相关宫位
}

/**
 * 综合洞察（AI生成）
 */
export interface IntegratedInsight {
  consistency: {
    level: 'high' | 'medium' | 'low';
    score: number; // 0-100 一致性评分
    analysis: string;
  };
  keyInsights: string[]; // 核心洞察
  comprehensiveAdvice: string; // 综合建议
  confidence: number; // 0-100 置信度
  priorityActions: Array<{
    action: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
  }>;
  // 扩展字段（可选）
  conflict?: {
    hasConflict: boolean;
    analysis: string;
  };
  complementarity?: {
    analysis: string;
  };
}

/**
 * 跨系统分析结果（三维决策系统）
 */
export interface CrossSystemAnalysis {
  question: string;
  questionType: QuestionType;
  timestamp: number;
  // 三个系统的结果（可选，根据用户选择）
  yijing?: YijingResult;
  ziwei?: ZiweiResult;
  tarot?: TarotResult;
  // AI综合洞察
  integratedInsight?: IntegratedInsight;
}

// ==================== 扩展的现有功能类型 ====================

/**
 * 扩展的运势结果（向后兼容）
 */
export interface EnhancedFortuneResult {
  // 原有字段保持不变
  date: string;
  birthday?: string;
  overall: any;
  career: any;
  wealth: any;
  love: any;
  health: any;
  tips: any;
  story: string;
  luckyElements: any;
  zodiac: any;
  aspects: any;
  advice: string[];
  dailyChallenge: any;
  dailyOpportunity: any;
  aiAnalysis?: string;
  personalizedTips?: string[];
  // 新增紫微增强字段（可选）
  ziwei?: ZiweiFortuneEnhancement;
}

/**
 * 扩展的两难抉择分析结果（向后兼容）
 */
export interface EnhancedDilemmaAnalysisResult {
  // 原有字段保持不变
  optionA?: string;
  optionB?: string;
  optionA_score?: number;
  optionB_score?: number;
  optionA_analysis?: string;
  optionB_analysis?: string;
  recommendation?: string;
  hexagram?: any;
  changingLines?: number[];
  relatedHexagram?: any;
  analysis?: any;
  // 新增紫微增强字段（可选）
  ziweiMatch?: ZiweiMatchAnalysis;
}


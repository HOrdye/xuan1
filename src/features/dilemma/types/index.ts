/**
 * 天玄项目类型定义
 */

// 六十四卦相关类型
export interface Hexagram {
  name: string;
  number: number;
  sequence: number;
  symbol: string;
  lines: (0 | 1)[];
  judgment: string; // 卦辞
  image?: string; // 象辞
  tuan?: string; // 彖辞
  meaning: string; // 卦象含义 (兼容旧字段)
  yao_texts: string[]; // 六爻的爻辞
  trigrams: { upper: string; lower: string };
  svg_path?: string; 
  attribute?: string; 
  element?: string; 
  chineseName: string; // 中文名 (改为必填)
  modernInterpretation: string; // 现代解读 (改为必填)
  detailedAnalysis?: {
    overallLuck?: string;
    career?: string;
    love?: string;
    health?: string;
  };
  nature?: string; 
  description?: string; 
  overall?: string; 
  imageUrl?: string; 
}

export interface Trigram {
  name: string; // 英文名
  chineseName: string; // 中文名
  symbol: string; // 卦符号
  lines: (0 | 1)[]; // 三爻
  meaning?: string; // 卦意
  nature: string; // 天、泽、火等
  attribute: string; // 刚健、喜悦等
}

// 传统易经逻辑分析结果
export interface TraditionalAnalysis {
  // 卦宫信息
  palaceData?: {
    palace: string;
    element: string;
    shiYao: number;
    yingYao: number;
    naJiaSequence: string[];
  };
  
  // 体用关系
  bodyUsage?: {
    method: 'plumBlossom' | 'coin';
    bodyTrigram: string;
    usageTrigram: string;
    bodyElement: string;
    usageElement: string;
    relationship: string;
    interpretation: {
      generalMeaning: string;
      careerAdvice: string;
      wealthAdvice: string;
      relationshipAdvice: string;
      healthAdvice: string;
      actionGuidance: string;
    };
  };
  
  // 六亲信息
  sixRelatives?: Array<{
    position: number;
    relative: string;
    element: string;
    dizhi: string;
  }>;
  
  // 动爻分析
  changingLinesAnalysis?: Array<{
    position: number;
    relative: string;
    element: string;
    yaoText: string;
    interpretation: string;
    importance: 'high' | 'medium' | 'low';
  }>;
}

export interface AnalysisResult {
  hexagram: Hexagram | null;
  changingLines: number[];
  relatedHexagram: Hexagram | null;
  analysis: string | {
    title: string;
    summary: string;
    detailed: string;
    advice: string;
    changingLinesAnalysis: any[];
  };
  question?: string;
  method?: string;
  optionA?: string;
  optionB?: string;
  optionA_score?: number;
  optionB_score?: number;
  optionA_analysis?: string;
  optionB_analysis?: string;
  recommendation?: string;
  results?: number[]; // 铜钱占卜的原始结果值
  // 传统易经逻辑分析结果
  traditionalAnalysis?: TraditionalAnalysis;
  // 场景化分析相关
  scenarioContext?: {
    decisionType: string;
    emotionalTone: string;
    urgency: string;
    riskLevel: string;
  };
}

// 占卜方法类型（已删除random，只保留coin和plumBlossom）
export type DivinationMethod = 'coin' | 'plumBlossom';

// 铜钱结果类型
export interface CoinResult {
  headsCount: number;
  value: {
    line: number;
    changing: boolean;
  };
  display: string;
}

// 梅花易数参数类型
export interface PlumBlossomParams {
  method: 'time' | 'number';
  numbers: number[];
}

// 铜钱六爻结果类型
export interface SixCoinsResult {
  coins: CoinResult[];
  results: number[];
  hexagram: Hexagram;
}

// 梅花易数结果类型
export interface PlumBlossomResult {
  numbers: number[];
  upperTrigram: Trigram;
  lowerTrigram: Trigram;
  hexagram: Hexagram;
}

// 占卜会话状态
export interface DivinationSession {
  method: DivinationMethod;
  question: string;
  options?: {
    optionA: string;
    optionB: string;
  };
  result?: AnalysisResult;
  processData?: {
    coinResults?: SixCoinsResult;
    plumBlossomResult?: PlumBlossomResult;
  };
  timestamp: number;
}

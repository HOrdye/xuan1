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
} 

// 占卜方法类型
export type DivinationMethod = 'coin' | 'plumBlossom' | 'random';

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

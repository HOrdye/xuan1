/**
 * 运势等级类型
 */
export type FortuneLevel = 'excellent' | 'good' | 'normal' | 'bad' | 'terrible';

/**
 * 每日挑战/机遇
 */
export interface DailyChallenge {
  type: 'challenge' | 'opportunity';
  content: string;
  tips: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  isUnlocked?: boolean;
}

/**
 * 运势方面详情
 */
export interface FortuneItem {
  level: FortuneLevel;
  description: string;
  energyScore?: number;
  energyDescription?: string;
}

/**
 * 运势方面数据
 */
export interface AspectData {
  score: number;
  description: string;
  level?: FortuneLevel;
  suggestion?: string;
}

/**
 * 运势请求参数
 */
export interface FortuneRequest {
  birthDate?: string;
  zodiacSign?: string;
  question?: string;
  date?: string;
}

/**
 * 幸运元素
 */
export interface LuckyElements {
  color: string;
  number: number;
  direction: string;
}

/**
 * 运势提示
 */
export interface FortuneTips {
  do: string[];
  dont: string[];
}

/**
 * 星座信息
 */
export interface ZodiacInfo {
  sign: string;
  element: string;
  luckyColor: string;
}

/**
 * 运势结果
 */
export interface FortuneResult {
  date: string;
  birthday?: string;
  overall: FortuneItem;
  career: FortuneItem;
  wealth: FortuneItem;
  love: FortuneItem;
  health: FortuneItem;
  tips: FortuneTips;
  story: string;
  luckyElements: LuckyElements;
  zodiac: ZodiacInfo;
  aspects: {
    career: AspectData;
    wealth: AspectData;
    love: AspectData;
    health: AspectData;
  };
  advice: string[];
  dailyChallenge: DailyChallenge;
  dailyOpportunity: DailyChallenge;
  aiAnalysis?: string;
  personalizedTips?: string[];
}

/**
 * 星座信息
 */
export interface ConstellationInfo {
  name: string;
  element: string;
  traits: string[];
  luckyColor: string;
  characteristics: string;
  advice: string;
}

/**
 * 个性化运势参数
 */
export interface PersonalizedFortuneData {
  birthDate?: Date;
  zodiac?: ZodiacInfo;
  constellation?: ConstellationInfo;
  gender?: 'male' | 'female';
  question?: string;
}

/**
 * 宜忌事项
 */
export interface DailyActivities {
  suitable: string[];
  unsuitable: string[];
}

/**
 * 详细运势分析
 */
export interface DetailedFortuneResult extends FortuneResult {
  activities: DailyActivities;
  starRating: {
    career: number;
    wealth: number;
    love: number;
    health: number;
    overall: number;
  };
  timeAdvice: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  warningsAndTips: {
    warnings: string[];
    tips: string[];
  };
}

export interface FortuneDetail {
  type: string;
  status: string;
  score: number;
  advice: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  barColor: string;
}

export interface LuckyColor {
  name: string;
  hex: string;
}

export interface ActionSuggestion {
  title: string;
  description: string;
}

export type AspectKey = 'career' | 'wealth' | 'love' | 'health';

export interface FortuneItem {
  level: FortuneLevel;
  description: string;
  energyScore?: number;
  energyDescription?: string;
  score?: number;
  suggestion?: string;
}

export interface AspectData {
  score: number;
  description: string;
  level?: FortuneLevel;
  suggestion?: string;
} 
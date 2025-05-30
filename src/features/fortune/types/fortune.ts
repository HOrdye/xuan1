/**
 * 运势等级类型
 */
export type FortuneLevel = 'excellent' | 'good' | 'normal' | 'bad';

/**
 * 运势请求参数
 */
export interface FortuneRequest {
  birthDate?: string;
  gender?: 'male' | 'female';
  zodiacSign?: string;
  constellation?: string;
  question?: string;
}

/**
 * 运势方面详情
 */
export interface FortuneAspect {
  score: number;
  level: FortuneLevel;
  description: string;
  suggestion: string;
}

/**
 * 幸运元素
 */
export interface LuckyElements {
  numbers: number[];
  colors: string[];
  directions: string[];
}

/**
 * 运势结果
 */
export interface FortuneResult {
  date: string;
  overall: FortuneAspect;
  aspects: {
    career: FortuneAspect;
    wealth: FortuneAspect;
    love: FortuneAspect;
    health: FortuneAspect;
  };
  lucky: LuckyElements;
  advice: string[];
  // 可选的AI增强内容
  aiAnalysis?: string;
  personalizedTips?: string[];
}

/**
 * 生肖信息
 */
export interface ZodiacInfo {
  sign: string;
  element: string;
  traits: string[];
  luckyColor: string;
  luckyNumber: number;
  personality: string;
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

// Legacy types for backward compatibility
export interface FortuneItem {
  level: FortuneLevel;
  description: string;
  energyScore?: number;
  energyDescription?: string;
  zodiac?: {
    sign: string;
    element: string;
    luckyColor: string;
  };
  birthday?: string;
  date?: string;
  luckyNumber?: number;
  luckyColor?: {
    name: string;
    hex: string;
  };
  luckyDirection?: string;
  goodActivities?: string[];
  badActivities?: string[];
}

export interface FortuneTips {
  do: string[];
  dont: string[];
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
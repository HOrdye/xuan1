// 定义运势等级类型export type FortuneLevel = 'excellent' | 'good' | 'normal' | 'bad' | 'terrible';export interface FortuneItem {  level: FortuneLevel;  description: string;  // 添加组件中使用的属性  energyScore?: number;  energyDescription?: string;  zodiac?: {    sign: string;    element: string;    luckyColor: string;  };  birthday?: string;  date?: string;  // 幸运元素  luckyNumber?: number;  luckyColor?: {    name: string;    hex: string;  };  luckyDirection?: string;  // 活动建议  goodActivities?: string[];  badActivities?: string[];}

export interface FortuneTips {
  do: string[];
  dont: string[];
}

export interface LuckyElements {
  color: string;
  number: number;
  direction: string;
}

export interface ZodiacInfo {
  sign: string;
  element: string;
  luckyColor: string;
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

export interface FortuneResult {
  date: string;
  birthday?: string;
  // 卡片式
  overall: FortuneItem;
  love: FortuneItem;
  career: FortuneItem;
  wealth: FortuneItem;
  health: FortuneItem;
  tips: FortuneTips;
  story: string;
  luckyElements: LuckyElements;
  zodiac: ZodiacInfo;
  // 能量式
  energyScore?: number;
  energyDescription?: string;
  fortuneDetails?: FortuneDetail[];
  luckyColor?: LuckyColor;
  luckyNumber?: number;
  luckyDirection?: string;
  storyContent?: string;
  goodActivities?: string[];
  badActivities?: string[];
  actionSuggestions?: ActionSuggestion[];
} 
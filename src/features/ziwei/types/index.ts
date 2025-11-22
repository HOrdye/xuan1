/**
 * 紫微斗数类型定义
 * 定义所有紫微斗数相关的TypeScript类型
 */

/**
 * 星曜类别
 */
export type StarCategory = '主星' | '辅星' | '煞星' | '吉星';

/**
 * 星曜亮度
 */
export type StarBrightness = '庙' | '旺' | '利' | '得' | '平' | '不得地' | '陷';

/**
 * 长生十二神
 */
export type ChangshengStatus = 
  | '长生' | '沐浴' | '冠带' | '临官' | '帝旺' | '衰'
  | '病' | '死' | '墓' | '绝' | '胎' | '养';

/**
 * 五行
 */
export type Wuxing = '金' | '木' | '水' | '火' | '土';

/**
 * 阴阳
 */
export type Yinyang = '阴' | '阳';

/**
 * 星曜数据
 */
export interface Star {
  id: string;
  name: string;
  category: StarCategory;
  brightness: StarBrightness;
  element: Wuxing;
  yinyang: Yinyang;
  personality: string[];
  color: string;
  emoji: string;
  description?: string;
}

/**
 * 四化
 */
export interface Sihua {
  lu?: string;  // 化禄
  quan?: string; // 化权
  ke?: string;   // 化科
  ji?: string;    // 化忌
}

/**
 * 宫位名称
 */
export type PalaceName = 
  | '命宫' | '兄弟宫' | '夫妻宫' | '子女宫' 
  | '财帛宫' | '疾厄宫' | '迁移宫' | '奴仆宫'
  | '官禄宫' | '田宅宫' | '福德宫' | '父母宫';

/**
 * 宫位数据
 */
export interface Palace {
  name: PalaceName;
  index: number;  // 0-11
  dizhi: Dizhi;  // 地支
  tiangan?: Tiangan;  // 宫干（天干）
  stars: Star[];
  brightness: string;
  sihua?: Sihua;
  changsheng?: ChangshengStatus;  // 长生十二神
  description?: string;
}

/**
 * 格局等级
 */
export type PatternLevel = 'excellent' | 'good' | 'normal' | 'poor';

/**
 * 格局数据
 */
export interface Pattern {
  name: string;
  level: PatternLevel;
  description: string;
  score: number;
  stars?: string[];
  palaces?: number[];
}

  /**
   * 大限数据
   */
  export interface Daxian {
    startAge: number;
    endAge: number;
    palace: Palace;
    palaceIndex: number;
    tiangan?: Tiangan;  // 大限天干
    dizhi?: Dizhi;  // 大限地支
    sihua?: Sihua;  // 大限四化
    feixing?: import('../utils/sihuaFeixingCalculator').SihuaFeixingResult; // 大限四化飞星结果
  }

/**
 * 出生信息
 */
export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: 'male' | 'female';
  lunarYear?: number;
  lunarMonth?: number;
  lunarDay?: number;
}

/**
 * 五行局
 */
export type WuxingJu = '水二局' | '木三局' | '金四局' | '土五局' | '火六局';

/**
 * 完整紫微命盘
 */
export interface ZiweiChart {
  birthInfo: BirthInfo;
  wuxingJu: WuxingJu;
  palaces: Palace[];
  patterns: Pattern[];
  mingGong: Palace;  // 命宫
  shenGong: Palace;  // 身宫
  mingZhu?: string;  // 命主星
  shenZhu?: string;  // 身主星
  daxian: Daxian[];  // 大限列表
  liunian?: any;  // 当前流年信息（LiunianInfo）
  liumonth?: any;  // 当前流月信息（LiumonthInfo）
  liuday?: any;  // 当前流日信息（LiudayInfo）
  createdAt: Date;
}

/**
 * 星曜位置映射
 */
export interface StarPositions {
  [palaceIndex: number]: string[];
}

/**
 * 天干
 */
export type Tiangan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

/**
 * 地支
 */
export type Dizhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

/**
 * 农历日期
 */
export interface LunarDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  tiangan: Tiangan;
  dizhi: Dizhi;
}

/**
 * 紫微解读结果
 */
export interface ZiweiReading {
  question?: string;
  relevantPalace: Palace;
  currentDaxian?: Daxian;
  sihua: Sihua;
  personalityTraits: string[];
  timing: string;
  advice: string;
}

/**
 * 三维解读结果
 */
export interface TripleAnalysisResult {
  yijing: any;
  ziwei: ZiweiReading;
  tarot: any;
  integrated: IntegratedInsight;
  consistency: ConsistencyAnalysis;
  timestamp: Date;
}

/**
 * 一致性分析
 */
export interface ConsistencyAnalysis {
  score: number;
  level: 'high' | 'medium' | 'low';
  agreements: string[];
  conflicts: string[];
}

/**
 * 综合洞察
 */
export interface IntegratedInsight {
  coreSuggestion: string;
  detailedAnalysis: string;
  actionItems: string[];
  confidence: number;
  keyInsight: string;
}


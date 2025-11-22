/**
 * 会员订阅类型定义
 * 3级会员体系：探索者(免费) / 开悟者(基础) / 天命师(高级)
 * 注：VIP等级暂时搁置，保留类型定义以便未来扩展
 */

export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'vip'; // vip暂时不使用
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trial';

/**
 * 会员订阅信息
 */
export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string | null;
  trial_end_date: string | null;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 会员功能权限（覆盖所有功能模块）
 */
export interface SubscriptionFeatures {
  // 三维决策系统
  tripleAnalysis: {
    available: boolean;
    dailyLimit: number; // 0=无限，-1=不可用
    depthLevel: 'basic' | 'advanced' | 'expert'; // 分析深度
  };
  
  // 易经系统
  yijing: {
    available: boolean;
    dailyLimit: number;
    advancedHexagram: boolean; // 高级卦象解读
    historyComparison: boolean; // 历史卦象对比
    expertLibrary: boolean; // 专家解读库
  };
  
  // 紫微斗数
  ziwei: {
    basicChart: boolean; // 基础星盘查看
    advancedChart: boolean; // 完整命盘解锁
    flowYearForecast: boolean; // 流年运势预测
    starAnalysis: boolean; // 星曜深度分析
    chartStorageLimit: number; // -1=无限
  };
  
  // 塔罗系统
  tarot: {
    available: boolean;
    allCards: boolean; // 全部78张卡牌
    customSpread: boolean; // 问题定制化抽牌
    historyAnalysis: boolean; // 历史记录分析
  };
  
  // 两难抉择
  dilemma: {
    available: boolean;
    deepAnalysis: boolean; // 深度选项推演
    actionGuide: boolean; // 破局行动手册
    qualityAssessment: boolean; // 决策质量评估
  };
  
  // 笅杯占卜
  jiaobei: {
    available: boolean;
    unlimited: boolean; // 无限次投掷
    deepInterpretation: boolean; // 签文深度解读
    effects3D: boolean; // 3D特效全开
  };
  
  // 今日运势
  fortune: {
    available: boolean;
    personalized: boolean; // 个性化运势
    yijiItems: boolean; // 宜忌事项
    improvementTips: boolean; // 改运建议
  };
  
  // 系统功能
  system: {
    historyDays: number; // 历史记录保存天数，-1=无限
    exportable: boolean; // 数据导出
    insights: boolean; // 数据洞察
    multiDeviceSync: boolean; // 多设备同步
    adFree: boolean; // 无广告体验
  };
  
  // 高级功能
  advanced: {
    aiDeepAnalysis: boolean; // AI个性化深度分析
    trendForecast: boolean; // 运势趋势预测（30天）
    weeklyReport: boolean; // 专属决策报告（周）
    monthlyReport: boolean; // 专属决策报告（月）
    expertReview: {
      available: boolean;
      monthlyCount: number; // 每月次数
    };
    priorityFeatures: boolean; // 优先功能体验
  };
  
  // VIP专属
  vip: {
    oneOnOneConsultation: {
      available: boolean;
      monthlyCount: number; // 每月1对1咨询次数
    };
    annualReport: boolean; // 年度命盘深度分析报告
    customWorkflow: boolean; // 定制化决策工作流
    dedicatedSupport: boolean; // 专属客服通道
    offlineEvents: boolean; // 线下活动优先参与权
    lifetimeUpgrade: boolean; // 新功能终身免费升级
    familyAnalysis: {
      available: boolean;
      memberCount: number; // 家族命盘分析人数
    };
  };
}

/**
 * 会员套餐配置
 */
export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  displayName: string; // 显示名称（探索者/开悟者/天命师/玄机大师）
  price: number;
  priceYearly: number;
  highlight?: string; // 推荐标签（如"性价比最高"）
  features: SubscriptionFeatures;
  description: string;
  targetUsers: string; // 目标用户描述
  valueProposition: string; // 价值主张
  keyBenefits: string[]; // 核心权益列表
  limitations?: string[]; // 限制说明（仅免费版）
}

/**
 * 会员状态响应
 */
export interface SubscriptionStatusResponse {
  isPremium: boolean;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  features: SubscriptionFeatures;
  expiresAt: string | null;
  trialEndsAt: string | null;
}


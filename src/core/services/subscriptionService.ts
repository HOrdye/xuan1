/**
 * 会员订阅服务
 * 管理会员状态、权限和功能访问控制
 */

import { SupabaseManager } from './supabaseClient';
import type {
  Subscription,
  SubscriptionTier,
  SubscriptionStatus,
  SubscriptionFeatures,
  SubscriptionPlan,
  SubscriptionStatusResponse
} from '../types/subscription';

class SubscriptionService {
  // 会员套餐配置 - 四级会员体系
  private static readonly PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
    // 🌟 探索者（免费版）
    free: {
      tier: 'free',
      name: '免费版',
      displayName: '探索者',
      price: 0,
      priceYearly: 0,
      description: '基础功能，适合初次体验',
      targetUsers: '新用户和轻度用户',
      valueProposition: '解决基础问题，建立产品认知',
      keyBenefits: [
        '基础星盘查看',
        '每日1次易经占卜',
        '基础运势查询',
        '7天决策历史'
      ],
      limitations: [
        '每日仅1次易经占卜',
        '仅可查看基础星盘',
        '历史记录仅保存7天',
        '无AI深度分析'
      ],
      features: {
        // 三维决策系统
        tripleAnalysis: {
          available: false,
          dailyLimit: 0,
          depthLevel: 'basic'
        },
        // 易经系统
        yijing: {
          available: true,
          dailyLimit: 1,
          advancedHexagram: false,
          historyComparison: false,
          expertLibrary: false
        },
        // 紫微斗数
        ziwei: {
          basicChart: true,
          advancedChart: false,
          flowYearForecast: false,
          starAnalysis: false,
          chartStorageLimit: 1
        },
        // 塔罗系统
        tarot: {
          available: false,
          allCards: false,
          customSpread: false,
          historyAnalysis: false
        },
        // 两难抉择
        dilemma: {
          available: false,
          deepAnalysis: false,
          actionGuide: false,
          qualityAssessment: false
        },
        // 笅杯占卜
        jiaobei: {
          available: false,
          unlimited: false,
          deepInterpretation: false,
          effects3D: false
        },
        // 今日运势
        fortune: {
          available: true,
          personalized: false,
          yijiItems: false,
          improvementTips: false
        },
        // 系统功能
        system: {
          historyDays: 7,
          exportable: false,
          insights: false,
          multiDeviceSync: false,
          adFree: false
        },
        // 高级功能
        advanced: {
          aiDeepAnalysis: false,
          trendForecast: false,
          weeklyReport: false,
          monthlyReport: false,
          expertReview: {
            available: false,
            monthlyCount: 0
          },
          priorityFeatures: false
        },
        // VIP专属
        vip: {
          oneOnOneConsultation: {
            available: false,
            monthlyCount: 0
          },
          annualReport: false,
          customWorkflow: false,
          dedicatedSupport: false,
          offlineEvents: false,
          lifetimeUpgrade: false,
          familyAnalysis: {
            available: false,
            memberCount: 0
          }
        }
      }
    },
    // ⭐ 开悟者（基础版）- 推荐
    basic: {
      tier: 'basic',
      name: '基础版',
      displayName: '开悟者',
      price: 19,
      priceYearly: 199,
      highlight: '性价比最高',
      description: '完整功能，适合日常使用',
      targetUsers: '活跃用户和决策频繁者',
      valueProposition: '解决日常决策困惑的核心工具',
      keyBenefits: [
        '完整三维解读（每日3次）',
        '所有塔罗牌解读',
        '两难抉择系统完整版',
        '30天决策历史',
        '基础个性化建议',
        '无广告体验'
      ],
      features: {
        // 三维决策系统
        tripleAnalysis: {
          available: true,
          dailyLimit: 3,
          depthLevel: 'advanced'
        },
        // 易经系统
        yijing: {
          available: true,
          dailyLimit: 3,
          advancedHexagram: true,
          historyComparison: true,
          expertLibrary: false
        },
        // 紫微斗数
        ziwei: {
          basicChart: true,
          advancedChart: true,
          flowYearForecast: false,
          starAnalysis: true,
          chartStorageLimit: 5
        },
        // 塔罗系统
        tarot: {
          available: true,
          allCards: true,
          customSpread: false,
          historyAnalysis: true
        },
        // 两难抉择
        dilemma: {
          available: true,
          deepAnalysis: true,
          actionGuide: true,
          qualityAssessment: false
        },
        // 笅杯占卜
        jiaobei: {
          available: true,
          unlimited: true,
          deepInterpretation: true,
          effects3D: true
        },
        // 今日运势
        fortune: {
          available: true,
          personalized: true,
          yijiItems: true,
          improvementTips: false
        },
        // 系统功能
        system: {
          historyDays: 30,
          exportable: false,
          insights: false,
          multiDeviceSync: true,
          adFree: true
        },
        // 高级功能
        advanced: {
          aiDeepAnalysis: false,
          trendForecast: false,
          weeklyReport: false,
          monthlyReport: false,
          expertReview: {
            available: false,
            monthlyCount: 0
          },
          priorityFeatures: false
        },
        // VIP专属
        vip: {
          oneOnOneConsultation: {
            available: false,
            monthlyCount: 0
          },
          annualReport: false,
          customWorkflow: false,
          dedicatedSupport: false,
          offlineEvents: false,
          lifetimeUpgrade: false,
          familyAnalysis: {
            available: false,
            memberCount: 0
          }
        }
      }
    },
    // 🌈 天命师（高级版）
    premium: {
      tier: 'premium',
      name: '高级版',
      displayName: '天命师',
      price: 49,
      priceYearly: 499,
      highlight: '功能最完整',
      description: '专业功能，适合深度用户',
      targetUsers: '深度用户和自我提升爱好者',
      valueProposition: '掌握人生决策主动权的完整系统',
      keyBenefits: [
        '无限次三维解读',
        'AI个性化深度分析',
        '紫微斗数完整解读',
        '运势趋势预测（30天）',
        '专属决策报告（周/月）',
        '专家解读复核（每月2次）',
        '优先功能体验'
      ],
      features: {
        // 三维决策系统
        tripleAnalysis: {
          available: true,
          dailyLimit: 0, // 0=无限
          depthLevel: 'expert'
        },
        // 易经系统
        yijing: {
          available: true,
          dailyLimit: 0, // 无限
          advancedHexagram: true,
          historyComparison: true,
          expertLibrary: true
        },
        // 紫微斗数
        ziwei: {
          basicChart: true,
          advancedChart: true,
          flowYearForecast: true,
          starAnalysis: true,
          chartStorageLimit: -1 // 无限
        },
        // 塔罗系统
        tarot: {
          available: true,
          allCards: true,
          customSpread: true,
          historyAnalysis: true
        },
        // 两难抉择
        dilemma: {
          available: true,
          deepAnalysis: true,
          actionGuide: true,
          qualityAssessment: true
        },
        // 笅杯占卜
        jiaobei: {
          available: true,
          unlimited: true,
          deepInterpretation: true,
          effects3D: true
        },
        // 今日运势
        fortune: {
          available: true,
          personalized: true,
          yijiItems: true,
          improvementTips: true
        },
        // 系统功能
        system: {
          historyDays: -1, // 无限
          exportable: true,
          insights: true,
          multiDeviceSync: true,
          adFree: true
        },
        // 高级功能
        advanced: {
          aiDeepAnalysis: true,
          trendForecast: true,
          weeklyReport: true,
          monthlyReport: true,
          expertReview: {
            available: true,
            monthlyCount: 2
          },
          priorityFeatures: true
        },
        // VIP专属
        vip: {
          oneOnOneConsultation: {
            available: false,
            monthlyCount: 0
          },
          annualReport: false,
          customWorkflow: false,
          dedicatedSupport: false,
          offlineEvents: false,
          lifetimeUpgrade: false,
          familyAnalysis: {
            available: false,
            memberCount: 0
          }
        }
      }
    },
    // 👑 玄机大师（VIP版）
    vip: {
      tier: 'vip',
      name: 'VIP版',
      displayName: '玄机大师',
      price: 199,
      priceYearly: 1999,
      description: '私人决策顾问级别的全方位服务',
      targetUsers: '高净值用户和玄学深度爱好者',
      valueProposition: '私人决策顾问级别的全方位服务',
      keyBenefits: [
        '1对1专家咨询（每月2次）',
        '年度命盘深度分析报告',
        '定制化决策工作流',
        '专属客服通道',
        '线下活动优先参与权',
        '新功能终身免费升级',
        '家族命盘分析（3人）'
      ],
      features: {
        // 三维决策系统
        tripleAnalysis: {
          available: true,
          dailyLimit: 0, // 无限
          depthLevel: 'expert'
        },
        // 易经系统
        yijing: {
          available: true,
          dailyLimit: 0, // 无限
          advancedHexagram: true,
          historyComparison: true,
          expertLibrary: true
        },
        // 紫微斗数
        ziwei: {
          basicChart: true,
          advancedChart: true,
          flowYearForecast: true,
          starAnalysis: true,
          chartStorageLimit: -1 // 无限
        },
        // 塔罗系统
        tarot: {
          available: true,
          allCards: true,
          customSpread: true,
          historyAnalysis: true
        },
        // 两难抉择
        dilemma: {
          available: true,
          deepAnalysis: true,
          actionGuide: true,
          qualityAssessment: true
        },
        // 笅杯占卜
        jiaobei: {
          available: true,
          unlimited: true,
          deepInterpretation: true,
          effects3D: true
        },
        // 今日运势
        fortune: {
          available: true,
          personalized: true,
          yijiItems: true,
          improvementTips: true
        },
        // 系统功能
        system: {
          historyDays: -1, // 无限
          exportable: true,
          insights: true,
          multiDeviceSync: true,
          adFree: true
        },
        // 高级功能
        advanced: {
          aiDeepAnalysis: true,
          trendForecast: true,
          weeklyReport: true,
          monthlyReport: true,
          expertReview: {
            available: true,
            monthlyCount: 2
          },
          priorityFeatures: true
        },
        // VIP专属
        vip: {
          oneOnOneConsultation: {
            available: true,
            monthlyCount: 2
          },
          annualReport: true,
          customWorkflow: true,
          dedicatedSupport: true,
          offlineEvents: true,
          lifetimeUpgrade: true,
          familyAnalysis: {
            available: true,
            memberCount: 3
          }
        }
      }
    }
  };

  /**
   * 获取所有套餐（排除VIP，暂时搁置）
   */
  static getPlans(): SubscriptionPlan[] {
    return Object.values(this.PLANS).filter(plan => plan.tier !== 'vip');
  }

  /**
   * 获取指定套餐
   */
  static getPlan(tier: SubscriptionTier): SubscriptionPlan {
    // 如果请求VIP但不存在，返回premium
    if (tier === 'vip' && !this.PLANS.vip) {
      return this.PLANS.premium;
    }
    return this.PLANS[tier] || this.PLANS.free;
  }

  /**
   * 获取用户会员状态
   */
  static async getUserSubscription(userId: string): Promise<SubscriptionStatusResponse> {
    try {
      const client = SupabaseManager.getClient();
      
      // 查询用户订阅
      const { data, error } = await client
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        // 没有订阅，返回免费版
        return this.getFreeTierStatus();
      }

      const subscription = data as Subscription;
      
      // 验证tier是否有效，如果无效则使用free
      const tier = subscription.tier in this.PLANS ? subscription.tier : 'free';
      const plan = this.PLANS[tier];

      // 检查是否过期
      if (subscription.end_date && new Date(subscription.end_date) < new Date()) {
        return this.getFreeTierStatus();
      }

      return {
        isPremium: tier !== 'free',
        tier: tier,
        status: subscription.status,
        features: plan.features,
        expiresAt: subscription.end_date,
        trialEndsAt: subscription.trial_end_date,
      };
    } catch (error) {
      console.warn('⚠️ 获取会员状态失败，使用免费版:', error);
      return this.getFreeTierStatus();
    }
  }

  /**
   * 获取免费版状态
   */
  private static getFreeTierStatus(): SubscriptionStatusResponse {
    const freePlan = this.PLANS.free;
    return {
      isPremium: false,
      tier: 'free',
      status: 'active',
      features: freePlan.features,
      expiresAt: null,
      trialEndsAt: null,
    };
  }

  /**
   * 检查用户是否有特定功能权限
   */
  static async hasFeature(userId: string, featurePath: string): Promise<boolean> {
    const status = await this.getUserSubscription(userId);
    const features = status.features;
    
    // 支持嵌套路径，如 'yijing.available', 'ziwei.advancedChart'
    const parts = featurePath.split('.');
    let value: any = features;
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return false;
      }
    }
    
    return value === true || value === 0 || (typeof value === 'number' && value > 0);
  }

  /**
   * 检查用户是否可以使用功能（考虑使用次数限制）
   */
  static async canUseFeature(
    userId: string,
    feature: 'tripleAnalysis' | 'yijing' | 'ziwei' | 'tarot' | 'dilemma' | 'jiaobei' | 'fortune'
  ): Promise<{ allowed: boolean; reason?: string; upgradeTier?: SubscriptionTier }> {
    const status = await this.getUserSubscription(userId);
    const features = status.features;
    
    // 检查功能是否可用
    let featureConfig: any = null;
    let dailyLimit = 0;
    
    switch (feature) {
      case 'tripleAnalysis':
        featureConfig = features.tripleAnalysis;
        if (!featureConfig?.available) {
          return { 
            allowed: false, 
            reason: '三维解读功能需要开悟者及以上会员',
            upgradeTier: 'basic'
          };
        }
        dailyLimit = featureConfig.dailyLimit;
        break;
        
      case 'yijing':
        featureConfig = features.yijing;
        if (!featureConfig?.available) {
          return { 
            allowed: false, 
            reason: '易经占卜功能需要会员权限',
            upgradeTier: 'basic'
          };
        }
        dailyLimit = featureConfig.dailyLimit;
        break;
        
      case 'ziwei':
        // 紫微斗数基础查看总是可用
        return { allowed: true };
        
      case 'tarot':
        if (!features.tarot?.available) {
          return { 
            allowed: false, 
            reason: '塔罗牌功能需要开悟者及以上会员',
            upgradeTier: 'basic'
          };
        }
        return { allowed: true };
        
      case 'dilemma':
        if (!features.dilemma?.available) {
          return { 
            allowed: false, 
            reason: '两难抉择功能需要开悟者及以上会员',
            upgradeTier: 'basic'
          };
        }
        return { allowed: true };
        
      case 'jiaobei':
        if (!features.jiaobei?.available) {
          return { 
            allowed: false, 
            reason: '笅杯占卜功能需要开悟者及以上会员',
            upgradeTier: 'basic'
          };
        }
        return { allowed: true };
        
      case 'fortune':
        // 今日运势基础版总是可用
        return { allowed: true };
        
      default:
        return { allowed: false, reason: '未知功能' };
    }

    // 检查使用次数限制（0=无限，>0=有限制）
    if (dailyLimit > 0) {
      const usage = await this.getTodayUsage(userId, feature);
      if (usage >= dailyLimit) {
        const upgradeTier = status.tier === 'free' ? 'basic' : 'premium';
        return {
          allowed: false,
          reason: `今日使用次数已用完（${dailyLimit}次），升级会员可${upgradeTier === 'premium' ? '无限' : '增加'}使用`,
          upgradeTier
        };
      }
    }

    return { allowed: true };
  }

  /**
   * 获取今日使用次数
   */
  static async getTodayUsage(
    userId: string,
    feature: 'tripleAnalysis' | 'yijing' | 'ziwei' | 'tarot' | 'dilemma' | 'jiaobei' | 'fortune'
  ): Promise<number> {
    try {
      const client = SupabaseManager.getClient();
      const today = new Date().toISOString().split('T')[0];

      // 查询今日使用记录
      const { data, error } = await client
        .from('usage_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('feature', feature)
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`);

      if (error) {
        console.warn('查询使用记录失败:', error);
        return 0;
      }

      return data?.length || 0;
    } catch (error) {
      console.warn('获取使用次数失败:', error);
      return 0;
    }
  }

  /**
   * 记录功能使用
   */
  static async recordUsage(
    userId: string,
    feature: 'tripleAnalysis' | 'yijing' | 'ziwei' | 'tarot' | 'dilemma' | 'jiaobei' | 'fortune'
  ): Promise<void> {
    try {
      const client = SupabaseManager.getClient();
      
      // 记录使用日志
      const { error } = await client.from('usage_logs').insert({
        user_id: userId,
        feature,
        created_at: new Date().toISOString()
      });

      if (error) {
        console.warn('记录使用日志失败:', error);
      }
    } catch (error) {
      console.warn('记录使用日志失败:', error);
    }
  }

  /**
   * 获取历史记录保存天数
   */
  static async getHistoryDays(userId: string): Promise<number> {
    const status = await this.getUserSubscription(userId);
    return status.features.system.historyDays;
  }

  /**
   * 检查是否可以导出数据
   */
  static async canExport(userId: string): Promise<boolean> {
    const status = await this.getUserSubscription(userId);
    return status.features.system.exportable;
  }

  /**
   * 创建订阅（模拟，实际需要支付集成）
   */
  static async createSubscription(
    userId: string,
    tier: SubscriptionTier,
    isYearly: boolean = false
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const client = SupabaseManager.getClient();
      
      const now = new Date();
      const endDate = new Date(now);
      
      if (isYearly) {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      const { error } = await client.from('subscriptions').insert({
        user_id: userId,
        tier,
        status: 'active',
        start_date: now.toISOString(),
        end_date: endDate.toISOString(),
        auto_renew: true,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export default SubscriptionService;


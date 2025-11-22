/**
 * 会员权限守卫 Hook
 * 提供权限检查、使用限制检查等功能
 */

import { computed } from 'vue';
import { useUserStore } from '../store/userStore';
import SubscriptionService from '../core/services/subscriptionService';
import type { SubscriptionTier, SubscriptionFeatures } from '../core/types/subscription';

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  upgradeTier?: SubscriptionTier;
}

export interface FeatureUsageInfo {
  used: number;
  limit: number;
  remaining: number;
  isUnlimited: boolean;
}

/**
 * 会员权限守卫 Hook
 */
export function useMembershipGuard() {
  const userStore = useUserStore();
  
  // 当前会员状态
  const subscriptionStatus = computed(() => userStore.subscriptionStatus);
  const currentTier = computed(() => userStore.subscriptionTier);
  const isPremium = computed(() => userStore.isPremium);
  const features = computed<SubscriptionFeatures | null>(() => 
    subscriptionStatus.value?.features || null
  );

  /**
   * 检查功能是否可用
   */
  const checkFeature = async (
    feature: 'tripleAnalysis' | 'yijing' | 'ziwei' | 'tarot' | 'dilemma' | 'jiaobei' | 'fortune'
  ): Promise<PermissionCheckResult> => {
    if (!userStore.currentUser) {
      return {
        allowed: false,
        reason: '请先登录',
        upgradeTier: 'free'
      };
    }

    return await SubscriptionService.canUseFeature(
      userStore.currentUser.id,
      feature
    );
  };

  /**
   * 检查嵌套权限路径
   * 例如: 'yijing.available', 'ziwei.advancedChart'
   */
  const checkPermission = async (featurePath: string): Promise<boolean> => {
    if (!userStore.currentUser) {
      return false;
    }

    return await SubscriptionService.hasFeature(
      userStore.currentUser.id,
      featurePath
    );
  };

  /**
   * 获取功能使用情况
   */
  const getFeatureUsage = async (
    feature: 'tripleAnalysis' | 'yijing' | 'ziwei' | 'tarot' | 'dilemma' | 'jiaobei' | 'fortune'
  ): Promise<FeatureUsageInfo> => {
    if (!userStore.currentUser || !features.value) {
      return {
        used: 0,
        limit: 0,
        remaining: 0,
        isUnlimited: false
      };
    }

    const used = await SubscriptionService.getTodayUsage(
      userStore.currentUser.id,
      feature
    );

    let limit = 0;
    let isUnlimited = false;

    switch (feature) {
      case 'tripleAnalysis':
        limit = features.value.tripleAnalysis?.dailyLimit ?? 0;
        isUnlimited = limit === 0;
        break;
      case 'yijing':
        limit = features.value.yijing?.dailyLimit ?? 0;
        isUnlimited = limit === 0;
        break;
      default:
        limit = 0;
        isUnlimited = true;
    }

    return {
      used,
      limit: isUnlimited ? -1 : limit,
      remaining: isUnlimited ? -1 : Math.max(0, limit - used),
      isUnlimited
    };
  };

  /**
   * 记录功能使用
   */
  const recordUsage = async (
    feature: 'tripleAnalysis' | 'yijing' | 'ziwei' | 'tarot' | 'dilemma' | 'jiaobei' | 'fortune'
  ): Promise<void> => {
    if (!userStore.currentUser) {
      return;
    }

    await SubscriptionService.recordUsage(
      userStore.currentUser.id,
      feature
    );
  };

  /**
   * 检查是否可以访问高级功能
   */
  const canAccessAdvanced = computed(() => {
    if (!features.value) return false;
    return currentTier.value === 'premium' || currentTier.value === 'vip';
  });

  /**
   * 检查是否可以访问VIP功能（暂时搁置）
   */
  const canAccessVIP = computed(() => {
    return false; // VIP暂时搁置
  });

  /**
   * 获取历史记录保存天数
   */
  const getHistoryDays = async (): Promise<number> => {
    if (!userStore.currentUser) {
      return 7; // 默认7天
    }

    return await SubscriptionService.getHistoryDays(userStore.currentUser.id);
  };

  /**
   * 检查是否可以导出数据
   */
  const canExport = async (): Promise<boolean> => {
    if (!userStore.currentUser) {
      return false;
    }

    return await SubscriptionService.canExport(userStore.currentUser.id);
  };

  /**
   * 获取推荐升级等级
   */
  const getRecommendedUpgrade = (): SubscriptionTier => {
    if (currentTier.value === 'free') {
      return 'basic';
    } else if (currentTier.value === 'basic') {
      return 'premium';
    }
    // VIP暂时搁置，premium为最高等级
    return 'premium';
  };

  /**
   * 获取升级提示信息
   */
  const getUpgradeMessage = (feature: string, requiredTier: SubscriptionTier): string => {
    const tierNames: Record<SubscriptionTier, string> = {
      free: '探索者',
      basic: '开悟者',
      premium: '天命师',
      vip: '玄机大师' // 暂时不使用
    };

    // 如果要求VIP，降级为premium
    const actualTier = requiredTier === 'vip' ? 'premium' : requiredTier;
    return `该功能需要${tierNames[actualTier]}及以上会员，立即升级解锁更多权益！`;
  };

  return {
    // 状态
    subscriptionStatus,
    currentTier,
    isPremium,
    features,
    canAccessAdvanced,
    canAccessVIP,

    // 方法
    checkFeature,
    checkPermission,
    getFeatureUsage,
    recordUsage,
    getHistoryDays,
    canExport,
    getRecommendedUpgrade,
    getUpgradeMessage
  };
}


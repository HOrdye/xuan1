<template>
  <UpgradePrompt
    v-if="shouldShow"
    :title="promptData.title"
    :description="promptData.description"
    :features="promptData.features"
    :required-tier="promptData.requiredTier"
    :dismissible="true"
    @dismiss="handleDismiss"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import UpgradePrompt from './UpgradePrompt.vue';
import { useMembershipGuard } from '../../composables/useMembershipGuard';
import SubscriptionService from '../../core/services/subscriptionService';
import type { SubscriptionTier } from '../../core/types/subscription';

interface Props {
  // 当前页面/功能上下文
  context?: 'yijing' | 'ziwei' | 'dilemma' | 'tarot' | 'jiaobei' | 'fortune' | 'tripleAnalysis';
  // 用户行为数据
  usageCount?: number;
  // 是否强制显示
  forceShow?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  context: undefined,
  usageCount: 0,
  forceShow: false
});

const { currentTier, getFeatureUsage, getRecommendedUpgrade } = useMembershipGuard();
const dismissedPrompts = ref<Set<string>>(new Set());
const shouldShow = ref(false);
const promptData = ref<{
  title: string;
  description: string;
  features: string[];
  requiredTier: SubscriptionTier;
}>({
  title: '',
  description: '',
  features: [],
  requiredTier: 'basic'
});

// 基于用户行为的智能推荐逻辑
const analyzeUserBehavior = async () => {
  if (currentTier.value === 'premium') {
    return null; // 已经是最高等级
  }

  // 检查是否已关闭过此提示
  const promptKey = `${props.context || 'general'}_${currentTier.value}`;
  if (dismissedPrompts.value.has(promptKey) && !props.forceShow) {
    return null;
  }

  // 根据上下文和使用情况生成个性化推荐
  const recommendations: Record<string, any> = {
    yijing: {
      title: '解锁无限次易经占卜',
      description: '你已经使用了今日的免费次数，升级会员可享受每日3次或无限次占卜',
      features: [
        '每日3次或无限次占卜',
        '高级卦象解读',
        '历史卦象对比',
        'AI深度分析'
      ],
      requiredTier: 'basic' as SubscriptionTier
    },
    ziwei: {
      title: '解锁流年运势预测',
      description: '升级会员可查看流年流月流日对本命盘的影响，掌握未来关键时机',
      features: [
        '流年运势预测',
        '流月流日分析',
        '四化影响解读',
        '深度命盘分析'
      ],
      requiredTier: 'premium' as SubscriptionTier
    },
    dilemma: {
      title: '获取破局行动手册',
      description: '升级会员可获得深度选项推演和破局行动手册，将建议转化为具体行动',
      features: [
        '深度选项推演',
        '破局行动手册',
        '决策质量评估',
        'AI综合建议'
      ],
      requiredTier: 'basic' as SubscriptionTier
    },
    tarot: {
      title: '解锁全部78张塔罗牌',
      description: '升级会员可使用全部78张塔罗牌，获得更丰富的占卜体验',
      features: [
        '全部78张卡牌',
        '问题定制化抽牌',
        '历史记录分析',
        '专属解读'
      ],
      requiredTier: 'basic' as SubscriptionTier
    },
    tripleAnalysis: {
      title: '解锁完整三维解读',
      description: '升级会员可享受完整的三维决策系统，获得多维度深度分析',
      features: [
        '完整三维解读',
        'AI综合分析',
        '多维度洞察',
        '无限次使用'
      ],
      requiredTier: 'basic' as SubscriptionTier
    }
  };

  // 如果有特定上下文，使用对应的推荐
  if (props.context && recommendations[props.context]) {
    return recommendations[props.context];
  }

  // 通用推荐：基于使用频率
  if (props.usageCount > 5) {
    return {
      title: '升级会员，解锁更多功能',
      description: '你已经是我们的活跃用户，升级会员可享受更多高级功能和无限使用次数',
      features: [
        '无限次使用',
        '高级功能解锁',
        '历史记录延长',
        '专属客服支持'
      ],
      requiredTier: getRecommendedUpgrade()
    };
  }

  return null;
};

// 检查是否应该显示升级提示
const checkShouldShow = async () => {
  if (props.forceShow) {
    const recommendation = await analyzeUserBehavior();
    if (recommendation) {
      promptData.value = recommendation;
      shouldShow.value = true;
    }
    return;
  }

  // 基于使用情况的智能判断
  if (props.context) {
    const usage = await getFeatureUsage(props.context as any);
    
    // 如果使用次数接近限制，显示提示
    if (!usage.isUnlimited && usage.remaining <= 1) {
      const recommendation = await analyzeUserBehavior();
      if (recommendation) {
        promptData.value = recommendation;
        shouldShow.value = true;
      }
    }
  } else {
    // 通用场景：检查总体使用情况
    const recommendation = await analyzeUserBehavior();
    if (recommendation) {
      promptData.value = recommendation;
      shouldShow.value = true;
    }
  }
};

const handleDismiss = () => {
  const promptKey = `${props.context || 'general'}_${currentTier.value}`;
  dismissedPrompts.value.add(promptKey);
  shouldShow.value = false;
  
  // 保存到localStorage，避免频繁提示
  try {
    const dismissed = JSON.parse(localStorage.getItem('dismissed_upgrade_prompts') || '[]');
    if (!dismissed.includes(promptKey)) {
      dismissed.push(promptKey);
      localStorage.setItem('dismissed_upgrade_prompts', JSON.stringify(dismissed));
    }
  } catch (error) {
    console.warn('保存关闭状态失败:', error);
  }
};

onMounted(async () => {
  // 从localStorage恢复已关闭的提示
  try {
    const dismissed = JSON.parse(localStorage.getItem('dismissed_upgrade_prompts') || '[]');
    dismissedPrompts.value = new Set(dismissed);
  } catch (error) {
    console.warn('恢复关闭状态失败:', error);
  }

  await checkShouldShow();
});
</script>


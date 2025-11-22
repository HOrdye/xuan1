<template>
  <div class="pricing-page min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
    <!-- 页面标题 -->
    <div class="text-center py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">选择适合你的套餐</h1>
      <p class="text-lg text-gray-600 mb-6">解锁更多功能，获得更深入的玄学洞察</p>
      <!-- 信任元素 -->
      <div class="trust-badges flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-gray-500">
        <div class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          <span>已有 <strong class="text-gray-700">10,000+</strong> 用户选择</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          <span>7天免费试用</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-green-500">✓</span>
          <span>随时可取消</span>
        </div>
      </div>
    </div>

    <!-- 套餐卡片 -->
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          v-for="plan in plans"
          :key="plan.tier"
          :class="['plan-card', `tier-${plan.tier}`, { recommended: plan.highlight }]"
        >
          <div v-if="plan.highlight" :class="['plan-badge', plan.tier === 'premium' ? 'premium-badge' : 'recommended-badge']">
            {{ plan.highlight }}
          </div>
          
          <!-- 价值主张卡片 -->
          <div v-if="plan.valueProposition" class="value-proposition-card">
            <div class="value-icon">💡</div>
            <div class="value-text">
              <div class="value-title">核心价值</div>
              <div class="value-content">{{ plan.valueProposition }}</div>
            </div>
          </div>

          <div class="plan-header">
            <h3 class="plan-name">{{ plan.displayName }}</h3>
            <p class="plan-description">{{ plan.description }}</p>
            
            <!-- 适用人群标签 -->
            <div v-if="plan.targetUsers" class="target-users-badge">
              <span class="target-icon">👤</span>
              <span class="target-text">最适合：{{ plan.targetUsers }}</span>
            </div>
          </div>
          <div class="plan-price">
            <div v-if="plan.price === 0" class="price-main">
              <span class="price-symbol">¥</span>
              <span class="price-value">0</span>
              <span class="price-period">/月</span>
            </div>
            <div v-else>
              <!-- 首月优惠（仅开悟者） -->
              <div v-if="plan.tier === 'basic'" class="price-discount">
                <span class="discount-label">首月特惠</span>
                <span class="discount-price">¥9.9</span>
                <span class="discount-note">（原价¥19/月）</span>
              </div>
              
              <!-- 主价格 -->
              <div class="price-main">
                <span class="price-symbol">¥</span>
                <span class="price-value">{{ plan.price }}</span>
                <span class="price-period">/月</span>
              </div>
              
              <!-- 年付优惠 -->
              <div v-if="plan.priceYearly > 0" class="price-yearly">
                <span class="yearly-price">¥{{ plan.priceYearly }}/年</span>
                <span class="yearly-save">省¥{{ Math.round((plan.price * 12 - plan.priceYearly) / 12) }}/月</span>
                <div class="yearly-equivalent">相当于每月仅需¥{{ Math.round(plan.priceYearly / 12 * 10) / 10 }}</div>
              </div>
            </div>
          </div>
          <!-- 核心权益标题 -->
          <div class="features-header">
            <h4 class="features-title">核心权益</h4>
          </div>
          
          <div class="plan-features">
            <div
              v-for="(benefit, index) in plan.keyBenefits"
              :key="index"
              class="feature-item"
            >
              <span class="feature-icon">✓</span>
              <span class="feature-text">{{ benefit }}</span>
            </div>
            <div
              v-if="plan.limitations"
              v-for="(limitation, index) in plan.limitations"
              :key="`limit-${index}`"
              class="feature-item disabled"
            >
              <span class="feature-icon">✗</span>
              <span class="feature-text">{{ limitation }}</span>
            </div>
          </div>
          
          <!-- 使用场景提示（仅推荐套餐） -->
          <div v-if="plan.highlight" class="usage-scenario">
            <div class="scenario-icon">🎯</div>
            <div class="scenario-content">
              <div class="scenario-title">适合场景</div>
              <div class="scenario-text">日常决策困惑、重要选择、人生规划</div>
            </div>
          </div>
          
          <button
            :class="[
              'plan-button',
              {
                current: subscriptionTier === plan.tier,
                primary: plan.highlight && subscriptionTier !== plan.tier
              }
            ]"
            :disabled="subscriptionTier === plan.tier"
            @click="handleSubscribe(plan.tier)"
          >
            {{
              subscriptionTier === plan.tier
                ? '当前套餐'
                : plan.tier === 'free'
                ? '免费使用'
                : plan.tier === 'basic'
                ? '立即升级 · 首月¥9.9'
                : '立即升级'
            }}
          </button>
          
          <!-- 保证承诺（仅付费套餐） -->
          <div v-if="plan.price > 0" class="guarantee-badge">
            <span class="guarantee-icon">🛡️</span>
            <span class="guarantee-text">7天免费试用 · 随时可取消</span>
          </div>
        </div>
      </div>

      <!-- 决策辅助提示 -->
      <div class="decision-helper bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8 border-2 border-purple-200 relative overflow-hidden">
        <!-- 视觉引导箭头 -->
        <div class="guide-arrow">
          <div class="arrow-icon">↓</div>
          <div class="arrow-text">查看详细对比</div>
        </div>
        
        <div class="flex items-start gap-4 relative z-10">
          <div class="helper-icon">💭</div>
          <div class="helper-content">
            <h3 class="helper-title">不知道如何选择？</h3>
            <p class="helper-text">
              <strong>探索者</strong>适合初次体验的用户，<strong>开悟者</strong>适合日常决策频繁的活跃用户（性价比最高），
              <strong>天命师</strong>适合深度用户和自我提升爱好者。建议从<strong>开悟者</strong>开始，首月仅需¥9.9。
            </p>
            <button class="helper-button" @click="scrollToComparison">
              <span>查看详细对比</span>
              <span class="arrow-animation">↓</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 功能对比表格 -->
      <div id="comparison-table" class="comparison-section bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-purple-200 relative">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">功能对比</h2>
          <div class="comparison-hint">
            <span class="hint-icon">💡</span>
            <span class="hint-text">开悟者列已高亮显示（推荐套餐）</span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="comparison-table w-full">
            <thead>
              <tr>
                <th class="feature-col">功能模块</th>
                <th class="plan-col">探索者</th>
                <th class="plan-col recommended-col">开悟者</th>
                <th class="plan-col">天命师</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>易经系统</td>
                <td>每日1次</td>
                <td class="recommended-cell"><strong>每日3次</strong></td>
                <td><strong>无限次</strong></td>
              </tr>
              <tr>
                <td>紫微斗数</td>
                <td>基础查看</td>
                <td class="recommended-cell"><strong>完整解读</strong></td>
                <td><strong>深度分析+流年</strong></td>
              </tr>
              <tr>
                <td>塔罗系统</td>
                <td><span style="color: #ef4444; font-weight: 600;">❌</span></td>
                <td class="recommended-cell"><strong>全部78张</strong></td>
                <td><strong>定制化抽牌</strong></td>
              </tr>
              <tr>
                <td>两难抉择</td>
                <td><span style="color: #ef4444; font-weight: 600;">❌</span></td>
                <td class="recommended-cell"><strong>完整版</strong></td>
                <td><strong>深度推演+行动手册</strong></td>
              </tr>
              <tr>
                <td>筊杯占卜</td>
                <td><span style="color: #ef4444; font-weight: 600;">❌</span></td>
                <td class="recommended-cell"><strong>无限次</strong></td>
                <td><strong>深度解读</strong></td>
              </tr>
              <tr>
                <td>今日运势</td>
                <td>基础查询</td>
                <td class="recommended-cell"><strong>个性化</strong></td>
                <td><strong>趋势预测</strong></td>
              </tr>
              <tr>
                <td>历史记录</td>
                <td>7天</td>
                <td class="recommended-cell"><strong>30天</strong></td>
                <td><strong>无限+导出</strong></td>
              </tr>
              <tr>
                <td>AI分析</td>
                <td>基础</td>
                <td class="recommended-cell"><strong>标准</strong></td>
                <td><strong>深度个性化</strong></td>
              </tr>
              <tr>
                <td>专家咨询</td>
                <td><span style="color: #ef4444; font-weight: 600;">❌</span></td>
                <td class="recommended-cell"><span style="color: #ef4444; font-weight: 600;">❌</span></td>
                <td><strong>每月2次</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 转化增强区域 -->
      <div class="conversion-boost bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-xl p-8 mb-8 border-4 border-red-400 relative overflow-hidden">
        <!-- 闪烁动画背景 -->
        <div class="boost-shine"></div>
        
        <!-- 限时标签 -->
        <div class="limited-time-badge">
          <span class="badge-text">限时优惠</span>
        </div>
        
        <div class="text-center relative z-10">
          <div class="boost-icon mb-4">⚡</div>
          <h3 class="boost-title mb-2">限时优惠</h3>
          <p class="boost-text mb-4">
            新用户首次订阅<strong>开悟者</strong>套餐，首月仅需
          </p>
          <!-- 超大价格显示 -->
          <div class="boost-price-display">
            <span class="price-symbol-large">¥</span>
            <span class="price-value-large">9.9</span>
            <span class="price-original">原价¥19</span>
          </div>
          <div class="boost-features">
            <div class="boost-feature-item">✓ 立即解锁所有会员功能</div>
            <div class="boost-feature-item">✓ 7天免费试用，不满意随时退款</div>
            <div class="boost-feature-item">✓ 年付更优惠，节省13-16%</div>
          </div>
        </div>
      </div>

      <!-- 常见问题 -->
      <div class="faq-section bg-white rounded-xl shadow-md p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">常见问题</h2>
        <div class="space-y-4">
          <div class="faq-item">
            <h3 class="faq-question">会员可以随时取消吗？</h3>
            <p class="faq-answer">是的，会员可以随时取消，取消后将在当前计费周期结束时停止续费。</p>
          </div>
          <div class="faq-item">
            <h3 class="faq-question">首月优惠如何享受？</h3>
            <p class="faq-answer">新用户首次订阅开悟者套餐可享受首月¥9.9的优惠价格，之后按正常价格¥19/月续费。</p>
          </div>
          <div class="faq-item">
            <h3 class="faq-question">年付有什么优惠？</h3>
            <p class="faq-answer">选择年付可节省13-16%，例如开悟者年付¥199/年，相当于每月仅需¥16.6。</p>
          </div>
          <div class="faq-item">
            <h3 class="faq-question">升级后可以立即使用所有功能吗？</h3>
            <p class="faq-answer">是的，升级成功后立即解锁所有会员功能，无需等待。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/userStore';
import SubscriptionService from '../core/services/subscriptionService';
import type { SubscriptionTier, SubscriptionPlan } from '../core/types/subscription';

const router = useRouter();
const userStore = useUserStore();

const plans = ref<SubscriptionPlan[]>([]);
const isPremium = computed(() => userStore.isPremium);
const subscriptionTier = computed(() => userStore.subscriptionTier);

onMounted(async () => {
  await userStore.initialize();
  if (userStore.isAuthenticated && userStore.currentUser) {
    await userStore.loadSubscriptionStatus(userStore.currentUser.id);
  }
  
  // 加载套餐列表
  plans.value = SubscriptionService.getPlans();
});

// 滚动到对比表格
const scrollToComparison = () => {
  const element = document.getElementById('comparison-table');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// 处理订阅
const handleSubscribe = async (tier: SubscriptionTier) => {
  if (tier === 'free') {
    return;
  }

  if (!userStore.isAuthenticated) {
    // 未登录，跳转到登录页面
    router.push('/');
    return;
  }

  try {
    // 这里应该集成支付系统
    // 目前只是模拟订阅创建
    const result = await SubscriptionService.createSubscription(
      userStore.currentUser!.id,
      tier,
      false // 暂时只支持月付
    );

    if (result.success) {
      // 刷新会员状态
      await userStore.refreshSubscription();
      // 显示成功提示
      alert('订阅成功！会员功能已激活。');
    } else {
      alert('订阅失败：' + (result.error || '未知错误'));
    }
  } catch (error: any) {
    console.error('订阅失败:', error);
    alert('订阅过程中发生错误，请稍后重试。');
  }
};
</script>

<style scoped>
.pricing-page {
  padding-top: 2rem;
}

.plan-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

/* 免费版样式 */
.plan-card.tier-free {
  border-color: #94a3b8;
  background: linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%);
}

.plan-card.tier-free .plan-name {
  color: #64748b;
}

/* 开悟者（推荐）样式 */
.plan-card.tier-basic.recommended {
  border-color: #f8c400;
  box-shadow: 0 8px 24px rgba(248, 196, 0, 0.3);
  transform: scale(1.05);
  background: linear-gradient(to bottom, #ffffff 0%, #fef3c7 100%); /* 更深的黄色背景 */
  position: relative;
}

/* 确保所有套餐内的核心权益文字清晰可读 */
.plan-card .plan-description,
.plan-card .feature-text,
.plan-card .value-content,
.plan-card .scenario-text,
.plan-card .target-text {
  color: #1f2937 !important; /* 深色文字，确保所有套餐都清晰可读 */
}

/* 推荐套餐特殊样式保持 */
.plan-card.tier-basic.recommended .plan-name {
  color: #f8c400;
}

.plan-card.tier-basic.recommended::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f8c400 0%, #ffd700 100%);
  border-radius: 16px 16px 0 0;
}

.plan-card.tier-basic.recommended .plan-name {
  color: #f8c400;
  text-shadow: 0 2px 4px rgba(248, 196, 0, 0.2);
}

/* 天命师样式 */
.plan-card.tier-premium {
  border-color: #8b5cf6;
  background: linear-gradient(to bottom, #ffffff 0%, #f3e8ff 50%, #e9d5ff 100%);
  position: relative;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
}

.plan-card.tier-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 50%, #c084fc 100%);
  border-radius: 16px 16px 0 0;
}

.plan-card.tier-premium .plan-name {
  color: #7c3aed;
  text-shadow: 0 2px 4px rgba(124, 58, 237, 0.15);
}

/* 天命师专属标签 */
.premium-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.recommended-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: linear-gradient(135deg, #f8c400 0%, #ffd700 100%);
  color: #0a1e4d;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(248, 196, 0, 0.4);
}

.plan-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.plan-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a1e4d;
  margin-bottom: 0.5rem;
  position: relative;
}


.plan-description {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

/* 价值主张卡片 */
.value-proposition-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  margin-bottom: 1rem;
  border-left: 3px solid #3b82f6;
}

.value-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.value-text {
  flex: 1;
}

.value-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #3b82f6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.value-content {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0a1e4d;
  line-height: 1.4;
}

/* 适用人群标签 */
.target-users-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #4b5563;
  margin-top: 0.5rem;
}

.target-icon {
  font-size: 1rem;
}

.target-text {
  font-weight: 500;
}

.plan-price {
  text-align: center;
  margin-bottom: 2rem;
}

.price-discount {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.discount-label {
  background: #ef4444;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.discount-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ef4444;
}

.discount-note {
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 0.25rem;
}

.price-main {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
}

.price-symbol {
  font-size: 1.25rem;
  color: #0a1e4d;
  font-weight: 600;
}

.price-value {
  font-size: 3rem;
  font-weight: 800;
  color: #0a1e4d;
  line-height: 1;
}

.price-period {
  font-size: 1rem;
  color: #6b7280;
}

.price-yearly {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.yearly-price {
  font-weight: 600;
  color: #0a1e4d;
}

.yearly-save {
  margin-left: 0.5rem;
  color: #10b981;
  font-weight: 600;
}

.yearly-equivalent {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  font-style: italic;
}

/* 核心权益标题 */
.features-header {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f3f4f6;
}

.features-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0a1e4d;
}

.plan-features {
  margin-bottom: 1.5rem;
  flex: 1;
  min-height: 200px;
}

/* 使用场景提示 */
.usage-scenario {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-radius: 12px;
  margin-bottom: 1rem;
  border-left: 3px solid #f8c400;
}

.scenario-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.scenario-content {
  flex: 1;
}

.scenario-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #92400e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.scenario-text {
  font-size: 0.85rem;
  color: #78350f;
  line-height: 1.4;
}

/* 保证承诺 */
.guarantee-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f0fdf4;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #166534;
}

.guarantee-icon {
  font-size: 1rem;
}

.guarantee-text {
  font-weight: 500;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  font-size: 0.9rem;
}

.feature-item.disabled {
  color: #9ca3af;
}

.feature-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 700;
}

.feature-item:not(.disabled) .feature-icon {
  color: #10b981;
}

.feature-item.disabled .feature-icon {
  color: #d1d5db;
}

.feature-text {
  flex: 1;
  color: #1f2937 !important; /* 确保所有套餐的核心权益文字都是深色 */
}

.plan-button {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
}

.plan-button.primary {
  background: linear-gradient(135deg, #f8c400 0%, #ffd700 100%);
  color: #0a1e4d;
  box-shadow: 0 4px 15px rgba(248, 196, 0, 0.4);
}

.plan-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(248, 196, 0, 0.6);
}

.plan-button.current {
  background: #e5e7eb;
  color: #6b7280;
  cursor: not-allowed;
}

.plan-button:not(.current):not(.primary) {
  background: #0a1e4d;
  color: white;
}

.plan-button:not(.current):not(.primary):hover {
  background: #1e3a8a;
  transform: translateY(-2px);
}

/* 决策辅助提示 */
.decision-helper {
  margin-top: 2rem;
}

.helper-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.helper-content {
  flex: 1;
}

.helper-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0a1e4d;
  margin-bottom: 0.5rem;
}

.helper-text {
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.helper-text strong {
  color: #0a1e4d;
  font-weight: 700;
}

.helper-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.helper-button:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.arrow-animation {
  display: inline-block;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(4px);
  }
}

/* 视觉引导箭头 */
.guide-arrow {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  z-index: 20;
  animation: float-arrow 2s ease-in-out infinite;
}

.arrow-icon {
  font-size: 1.5rem;
  color: #8b5cf6;
  font-weight: 700;
}

.arrow-text {
  font-size: 0.75rem;
  color: #8b5cf6;
  font-weight: 600;
  white-space: nowrap;
}

@keyframes float-arrow {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
  }
}


/* 对比表格 */
.comparison-section {
  margin-top: 3rem;
}

.comparison-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.hint-icon {
  font-size: 1rem;
}

.hint-text {
  font-weight: 500;
}

.comparison-table {
  border-collapse: collapse;
}

.comparison-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 700;
  color: #0a1e4d;
  border-bottom: 2px solid #e5e7eb;
  background: #ffffff;
}

.comparison-table th.plan-col {
  text-align: center;
}

.comparison-table th.recommended-col {
  background: #fef3c7 !important; /* 表头使用更深的黄色背景 */
  color: #0a1e4d !important; /* 深色文字，确保可读性 */
}

.comparison-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  color: #1f2937;
}

.comparison-table td strong {
  color: #0a1e4d;
  font-weight: 600;
}

.feature-col {
  width: 25%;
  font-weight: 600;
  min-width: 120px;
}

.plan-col {
  width: 25%;
  text-align: center;
  min-width: 100px;
}

.recommended-col {
  background: #fef3c7 !important; /* 更深的黄色背景，提高对比度 */
  position: relative;
}

.recommended-col::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #f8c400 0%, #ffd700 100%);
}

.recommended-cell {
  background: #fef3c7 !important; /* 更深的黄色背景，提高对比度 */
  font-weight: 600;
  color: #1f2937 !important; /* 深色文字，确保可读性 */
}

.recommended-cell strong {
  color: #0a1e4d !important; /* 深色加粗文字 */
}

/* FAQ */
.faq-item {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0a1e4d;
  margin-bottom: 0.5rem;
}

.faq-answer {
  font-size: 0.95rem;
  color: #6b7280;
  line-height: 1.6;
}

/* 转化增强区域 */
.conversion-boost {
  margin-top: 2rem;
  position: relative;
}

/* 闪烁动画背景 */
.boost-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* 限时标签 */
.limited-time-badge {
  position: absolute;
  top: -16px;
  right: 20px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 0.6rem 1.8rem;
  border-radius: 25px;
  font-weight: 800;
  font-size: 1rem;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.5);
  z-index: 10;
  animation: pulse-badge 2s ease-in-out infinite;
  white-space: nowrap;
  display: inline-block;
  letter-spacing: 0.5px;
}

@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.badge-text {
  letter-spacing: 0.5px;
}

.boost-icon {
  font-size: 3rem;
  text-align: center;
  animation: rotate-icon 3s ease-in-out infinite;
}

@keyframes rotate-icon {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

.boost-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0a1e4d;
  margin-bottom: 1rem;
}

.boost-text {
  font-size: 1.1rem;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.boost-text strong {
  color: #0a1e4d;
  font-weight: 700;
}

/* 超大价格显示 */
.boost-price-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.price-symbol-large {
  font-size: 3rem;
  font-weight: 800;
  color: #ef4444;
  line-height: 1;
}

.price-value-large {
  font-size: 5rem;
  font-weight: 900;
  color: #ef4444;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(239, 68, 68, 0.3);
  animation: price-pulse 2s ease-in-out infinite;
}

@keyframes price-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.price-original {
  font-size: 1.25rem;
  color: #6b7280;
  text-decoration: line-through;
  margin-left: 0.5rem;
}

.boost-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
  text-align: center;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.boost-feature-item {
  font-size: 1.1rem;
  color: #374151;
  font-weight: 600;
  line-height: 1.6;
}

/* 响应式 */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .comparison-hint {
    display: none;
  }
}

@media (max-width: 768px) {
  .plan-card.recommended {
    transform: scale(1);
  }

  .price-value {
    font-size: 2.5rem;
  }

  .comparison-table {
    font-size: 0.85rem;
  }

  .comparison-table th,
  .comparison-table td {
    padding: 0.75rem 0.5rem;
  }

  .grid {
    grid-template-columns: 1fr;
  }
  
  /* 移动端优化 */
  .pricing-page .text-center {
    padding: 1.5rem 0;
  }
  
  .trust-badges {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .trust-badges > div {
    justify-content: center;
  }
  
  .decision-helper {
    padding: 1rem !important;
  }
  
  .decision-helper .flex {
    flex-direction: column;
    gap: 1rem;
  }
  
  .helper-icon {
    font-size: 1.5rem;
  }
  
  .guide-arrow {
    display: none; /* 移动端隐藏箭头 */
  }
  
  .conversion-boost {
    padding: 1.5rem !important;
  }
  
  .boost-title {
    font-size: 1.5rem !important;
  }
  
  .price-value-large {
    font-size: 3.5rem !important;
  }
  
  .price-symbol-large {
    font-size: 2rem !important;
  }
  
  .price-original {
    font-size: 1rem !important;
  }
  
  .boost-features {
    max-width: 100%;
  }
  
  .value-proposition-card,
  .usage-scenario {
    padding: 0.75rem;
  }
  
  .target-users-badge {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
  }
  
  .limited-time-badge {
    top: -12px;
    right: 10px;
    font-size: 0.875rem;
    padding: 0.5rem 1.2rem;
    white-space: nowrap;
  }
  
  .boost-feature-item {
    font-size: 1rem !important;
  }
}
</style>


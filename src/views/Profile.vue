<template>
  <div class="p-4 pb-20">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">个人中心</h1>
      <p class="text-sm text-gray-600 mt-2">管理你的天玄账户和历史记录</p>
    </div>

    <!-- 用户资料卡片 -->
    <div class="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
      <div class="bg-gradient-to-r from-primary to-mystic p-5 text-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-16 h-16 rounded-full bg-white flex items-center justify-center mr-4">
              <i class="fas fa-user text-2xl text-primary"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-bold">{{ userName }}</h2>
                <!-- 会员徽章 -->
                <div v-if="isPremium" class="subscription-badge-inline" :class="subscriptionTier">
                  <span class="badge-icon">{{ tierIcon }}</span>
                  <span class="badge-text">{{ tierText }}</span>
                </div>
              </div>
              <p class="text-sm opacity-80">注册时间：{{ registrationDate }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 会员信息卡片 -->
      <div v-if="subscriptionStatus" class="p-4 border-b border-gray-100">
        <div class="subscription-info-card" :class="{ 'premium-active': isPremium }">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-700 mb-1">会员状态</div>
              <div class="flex items-center gap-2">
                <span class="text-lg font-bold" :class="isPremium ? 'text-yellow-600' : 'text-gray-600'">
                  {{ subscriptionStatusText }}
                </span>
                <span v-if="subscriptionStatus.expiresAt" class="text-xs text-gray-500">
                  ({{ formatExpiryDate(subscriptionStatus.expiresAt) }}到期)
                </span>
              </div>
            </div>
            <div v-if="!isPremium" class="flex flex-col items-end">
              <button 
                @click="goToUpgrade"
                class="upgrade-btn-inline"
              >
                升级会员
              </button>
              <span class="text-xs text-gray-500 mt-1">首月¥9.9</span>
            </div>
            <div v-else class="text-right">
              <div class="text-xs text-gray-500">会员权益</div>
              <div class="text-xs font-medium text-green-600">已激活</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-4">
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div class="text-center">
            <div class="text-lg font-bold text-primary">{{ userStats.divination_count }}</div>
            <div class="text-xs text-gray-500">占卜记录</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold text-primary">{{ userStats.total_count }}</div>
            <div class="text-xs text-gray-500">总记录</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold text-primary">{{ userStats.favorite_count }}</div>
            <div class="text-xs text-gray-500">收藏数量</div>
          </div>
        </div>
        
        <!-- 会员功能统计 -->
        <div v-if="isPremium" class="mt-4 pt-4 border-t border-gray-100">
          <div class="text-xs text-gray-500 mb-2">会员专属功能</div>
          <div class="grid grid-cols-2 gap-2">
            <div class="flex items-center gap-2 text-xs">
              <span class="text-green-600">✓</span>
              <span class="text-gray-700">AI综合洞察</span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="text-green-600">✓</span>
              <span class="text-gray-700">无限次使用</span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="text-green-600">✓</span>
              <span class="text-gray-700">30天趋势预测</span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="text-green-600">✓</span>
              <span class="text-gray-700">专家复核</span>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end">
          <button 
            @click="editProfile"
            class="text-primary text-sm font-medium flex items-center hover:text-purple-700 transition-colors"
          >
            编辑资料 <i class="fas fa-chevron-right ml-1 text-xs"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 会员管理入口 -->
    <div v-if="!isPremium" class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-md mb-6 p-4 border-2 border-yellow-200">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-1">升级会员，解锁更多功能</h3>
          <p class="text-sm text-gray-600">享受AI综合洞察、无限次使用等高级功能</p>
        </div>
        <button 
          @click="goToUpgrade"
          class="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-lg font-bold hover:from-yellow-500 hover:to-orange-500 transition-all shadow-md"
        >
          立即升级
        </button>
      </div>
    </div>

    <!-- 功能入口 -->
    <div class="bg-white rounded-xl shadow-md mb-6">
      <div class="px-4 py-3 border-b">
        <h3 class="font-bold text-gray-800">功能中心</h3>
      </div>
      
      <div>
        <button 
          @click="goToHexagramTest"
          class="flex items-center p-4 border-b w-full text-left hover:bg-gray-50 transition-colors"
        >
          <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
            <i class="fas fa-cog text-purple-500"></i>
          </div>
          <div class="flex-grow">
            <div class="font-medium text-gray-800">六十四卦算法测试</div>
            <div class="text-xs text-gray-500 mt-1">测试和验证六十四卦算法效果</div>
          </div>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </button>
        
        <button 
          @click="goToHistory"
          class="flex items-center p-4 border-b w-full text-left hover:bg-gray-50 transition-colors"
        >
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <i class="fas fa-history text-blue-500"></i>
          </div>
          <div class="flex-grow">
            <div class="font-medium text-gray-800">历史记录</div>
            <div class="text-xs text-gray-500 mt-1">查看历史决策和运势查询</div>
          </div>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </button>
        
        <button 
          @click="goToFavorites"
          class="flex items-center p-4 border-b w-full text-left hover:bg-gray-50 transition-colors"
        >
          <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <i class="fas fa-bookmark text-green-500"></i>
          </div>
          <div class="flex-grow">
            <div class="font-medium text-gray-800">我的收藏</div>
            <div class="text-xs text-gray-500 mt-1">查看收藏的卦象和运势</div>
          </div>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </button>
        
        <button 
          @click="goToNotifications"
          class="flex items-center p-4 w-full text-left hover:bg-gray-50 transition-colors"
        >
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
            <i class="fas fa-bell text-red-500"></i>
          </div>
          <div class="flex-grow">
            <div class="font-medium text-gray-800">通知设置</div>
            <div class="text-xs text-gray-500 mt-1">管理消息通知和提醒设置</div>
          </div>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </button>
      </div>
    </div>

    <!-- 关于天玄 -->
    <div class="bg-white rounded-xl shadow-md">
      <div class="px-4 py-3 border-b">
        <h3 class="font-bold text-gray-800">关于天玄</h3>
      </div>
      
      <div class="p-4">
        <p class="text-gray-600 text-sm">天玄是一款专注于易经与现代生活的玄学决策助手，帮助你在生活和工作中做出更符合自己的选择。</p>
        <p class="text-gray-600 text-sm mt-2">当前版本: v1.0.0 Beta</p>
        
        <div class="flex justify-between mt-4">
          <button class="text-gray-500 text-sm flex items-center">
            <i class="fas fa-book mr-1"></i> 使用指南
          </button>
          <button class="text-gray-500 text-sm flex items-center">
            <i class="fas fa-info-circle mr-1"></i> 联系我们
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/userStore';
import { UserStatsService, type UserStats } from '../services/userStatsService';
import type { SubscriptionTier } from '../core/types/subscription';
// import { useUserPreferencesStore } from '../store/userPreferences'; // 暂未使用

const router = useRouter();
const userStore = useUserStore();
// const userPreferences = useUserPreferencesStore(); // 暂未使用

// 响应式数据
const userStats = ref<UserStats>({
  divination_count: 0,
  fortune_count: 0,
  tarot_count: 0,
  total_count: 0,
  favorite_count: 0,
  last_activity: new Date().toISOString()
});

// 计算属性
const userName = computed(() => userStore.username || '天玄用户');
// const userEmail = computed(() => userStore.email || '未设置邮箱'); // 暂未使用
const registrationDate = computed(() => {
  if (userStore.currentUser?.created_at) {
    return new Date(userStore.currentUser.created_at).toLocaleDateString('zh-CN');
  }
  return '2024年4月24日';
});

// 会员状态
const isPremium = computed(() => userStore.isPremium);
const subscriptionTier = computed<SubscriptionTier>(() => userStore.subscriptionTier);
const subscriptionStatus = computed(() => userStore.subscriptionStatus);

const tierIcon = computed(() => {
  switch (subscriptionTier.value) {
    case 'premium':
      return '👑';
    case 'advanced':
      return '💎';
    default:
      return '';
  }
});

const tierText = computed(() => {
  switch (subscriptionTier.value) {
    case 'premium':
      return '会员';
    case 'advanced':
      return '高级会员';
    default:
      return '免费版';
  }
});

const subscriptionStatusText = computed(() => {
  if (isPremium.value) {
    return subscriptionTier.value === 'premium' ? '会员版' : '高级版';
  }
  return '免费版';
});

const formatExpiryDate = (dateStr: string | null): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 检查用户是否已登录，未登录则重定向
onMounted(async () => {
  await userStore.initialize();
  if (!userStore.isAuthenticated) {
    router.push('/');
    return;
  }
  
  // 加载会员状态
  if (userStore.currentUser) {
    await userStore.loadSubscriptionStatus(userStore.currentUser.id);
  }
  
  // 加载用户统计数据
  try {
    const stats = await UserStatsService.getUserStats();
    userStats.value = stats;
  } catch (error) {
    console.error('加载用户统计数据失败:', error);
  }
});

// 编辑资料功能
const editProfile = () => {
  router.push('/profile/edit');
};

// 导航到历史记录
const goToHistory = () => {
  router.push('/history');
};

// 导航到六十四卦测试
const goToHexagramTest = () => {
  router.push('/dilemma/test');
};

// 导航到我的收藏
const goToFavorites = () => {
  router.push('/favorites');
};

// 导航到通知设置
const goToNotifications = () => {
  router.push('/settings/notifications');
};

// 跳转到升级页面
const goToUpgrade = () => {
  router.push('/pricing');
};
</script>

<style scoped>
/* 会员徽章样式 */
.subscription-badge-inline {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.subscription-badge-inline.premium {
  background: linear-gradient(135deg, #f8c400 0%, #ffd700 100%);
  color: #0a1e4d;
}

.subscription-badge-inline.advanced {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.badge-icon {
  font-size: 0.875rem;
}

.badge-text {
  font-weight: 700;
}

/* 会员信息卡片 */
.subscription-info-card {
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.subscription-info-card.premium-active {
  background: linear-gradient(135deg, rgba(248, 196, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);
  border-color: #f8c400;
}

.upgrade-btn-inline {
  background: linear-gradient(135deg, #f8c400 0%, #ffd700 100%);
  color: #0a1e4d;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(248, 196, 0, 0.3);
}

.upgrade-btn-inline:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(248, 196, 0, 0.4);
}
</style> 
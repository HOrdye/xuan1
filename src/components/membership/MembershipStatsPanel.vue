<template>
  <div class="membership-stats-panel bg-white rounded-xl shadow-md p-6">
    <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <span>📊</span>
      <span>会员使用情况</span>
    </h3>

    <div class="stats-grid grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <!-- 当前会员等级 -->
      <div class="stat-card bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div class="stat-label text-sm text-gray-600 mb-1">当前等级</div>
        <div class="stat-value text-2xl font-bold text-purple-600">
          {{ tierDisplayName }}
        </div>
        <div v-if="!isPremium" class="stat-hint text-xs text-gray-500 mt-1">
          升级解锁更多功能
        </div>
      </div>

      <!-- 历史记录数量 -->
      <div class="stat-card bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <div class="stat-label text-sm text-gray-600 mb-1">历史记录</div>
        <div class="stat-value text-2xl font-bold text-green-600">
          {{ historyCount }}
        </div>
        <div class="stat-hint text-xs text-gray-500 mt-1">
          {{ historyDaysText }}
        </div>
      </div>
    </div>

    <!-- 功能使用情况 -->
    <div class="usage-section">
      <h4 class="text-lg font-semibold text-gray-700 mb-3">今日使用情况</h4>
      <div class="usage-list space-y-3">
        <div
          v-for="feature in featureUsageList"
          :key="feature.name"
          class="usage-item flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex-1">
            <div class="feature-name font-medium text-gray-700">{{ feature.displayName }}</div>
            <div class="feature-usage text-sm text-gray-500 mt-1">
              已使用 {{ feature.used }} / 
              <span :class="{ 'text-red-500': feature.remaining <= 1 && !feature.isUnlimited }">
                {{ feature.isUnlimited ? '∞' : feature.limit }}
              </span>
            </div>
          </div>
          <div class="usage-progress ml-4">
            <div
              v-if="!feature.isUnlimited"
              class="progress-bar w-24 h-2 bg-gray-200 rounded-full overflow-hidden"
            >
              <div
                class="progress-fill h-full transition-all duration-300"
                :class="getProgressColor(feature.remaining, feature.limit)"
                :style="{ width: `${(feature.used / feature.limit) * 100}%` }"
              ></div>
            </div>
            <div v-else class="text-green-500 font-semibold">∞</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 升级提示 -->
    <div v-if="shouldShowUpgrade" class="upgrade-cta mt-6 p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white">
      <div class="flex items-center justify-between">
        <div>
          <div class="font-semibold mb-1">升级解锁更多功能</div>
          <div class="text-sm opacity-90">{{ upgradeMessage }}</div>
        </div>
        <n-button
          type="primary"
          ghost
          @click="handleUpgrade"
          class="ml-4"
        >
          立即升级
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NButton } from 'naive-ui';
import { useMembershipGuard } from '../../composables/useMembershipGuard';
import { historyService } from '../../services/historyService';

const router = useRouter();
const { currentTier, getFeatureUsage, getRecommendedUpgrade, getHistoryDays } = useMembershipGuard();

const historyCount = ref(0);
const historyDays = ref(7);
const featureUsageList = ref<Array<{
  name: string;
  displayName: string;
  used: number;
  limit: number;
  remaining: number;
  isUnlimited: boolean;
}>>([]);

const tierDisplayName = computed(() => {
  const names: Record<string, string> = {
    free: '探索者',
    basic: '开悟者',
    premium: '天命师'
  };
  return names[currentTier.value] || '探索者';
});

const isPremium = computed(() => currentTier.value !== 'free');

const historyDaysText = computed(() => {
  if (historyDays.value === -1) {
    return '永久保存';
  }
  return `保存${historyDays.value}天`;
});

const shouldShowUpgrade = computed(() => {
  return currentTier.value !== 'premium';
});

const upgradeMessage = computed(() => {
  if (currentTier.value === 'free') {
    return '升级开悟者，解锁完整三维解读和所有塔罗牌';
  } else if (currentTier.value === 'basic') {
    return '升级天命师，解锁无限次使用和AI深度分析';
  }
  return '';
});

const getProgressColor = (remaining: number, limit: number) => {
  const percentage = (remaining / limit) * 100;
  if (percentage > 50) {
    return 'bg-green-500';
  } else if (percentage > 20) {
    return 'bg-yellow-500';
  } else {
    return 'bg-red-500';
  }
};

const loadStats = async () => {
  // 加载历史记录数量
  try {
    const history = await historyService.getHistory();
    historyCount.value = history.length;
  } catch (error) {
    console.warn('加载历史记录失败:', error);
  }

  // 加载历史记录保存天数
  try {
    historyDays.value = await getHistoryDays();
  } catch (error) {
    console.warn('获取历史记录天数失败:', error);
  }

  // 加载功能使用情况
  const features = [
    { name: 'yijing', displayName: '易经占卜' },
    { name: 'tripleAnalysis', displayName: '三维解读' },
    { name: 'ziwei', displayName: '紫微斗数' },
    { name: 'tarot', displayName: '塔罗牌' }
  ];

  const usagePromises = features.map(async (feature) => {
    try {
      const usage = await getFeatureUsage(feature.name as any);
      return {
        name: feature.name,
        displayName: feature.displayName,
        used: usage.used,
        limit: usage.limit === -1 ? 999 : usage.limit,
        remaining: usage.remaining === -1 ? 999 : usage.remaining,
        isUnlimited: usage.isUnlimited
      };
    } catch (error) {
      return {
        name: feature.name,
        displayName: feature.displayName,
        used: 0,
        limit: 0,
        remaining: 0,
        isUnlimited: false
      };
    }
  });

  featureUsageList.value = await Promise.all(usagePromises);
};

const handleUpgrade = () => {
  router.push('/pricing');
};

onMounted(() => {
  loadStats();
});
</script>

<style scoped>
.membership-stats-panel {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.progress-bar {
  min-width: 96px;
}

.progress-fill {
  transition: width 0.3s ease;
}
</style>


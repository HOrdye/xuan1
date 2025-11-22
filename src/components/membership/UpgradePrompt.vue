<template>
  <div class="upgrade-prompt bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 shadow-lg">
    <div class="flex items-start gap-4">
      <div class="icon-container flex-shrink-0">
        <div class="icon-circle bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-12 h-12 flex items-center justify-center">
          <span class="text-white text-xl">✨</span>
        </div>
      </div>
      <div class="content flex-1">
        <h3 class="title text-lg font-bold text-gray-800 mb-2">
          {{ title }}
        </h3>
        <p class="description text-gray-600 mb-4">
          {{ description }}
        </p>
        <div v-if="features && features.length > 0" class="features-list mb-4">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="feature-item flex items-center gap-2 text-sm text-gray-700"
          >
            <span class="check-icon text-green-500">✓</span>
            <span>{{ feature }}</span>
          </div>
        </div>
        <div class="actions flex gap-3">
          <n-button
            type="primary"
            @click="handleUpgrade"
            class="upgrade-button"
          >
            立即升级
          </n-button>
          <n-button
            ghost
            @click="handleDismiss"
            v-if="dismissible"
          >
            稍后再说
          </n-button>
        </div>
      </div>
      <button
        v-if="dismissible"
        @click="handleDismiss"
        class="close-button text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui';
import { useRouter } from 'vue-router';
import { useMembershipGuard } from '../../composables/useMembershipGuard';
import type { SubscriptionTier } from '../../core/types/subscription';

interface Props {
  title?: string;
  description?: string;
  features?: string[];
  requiredTier?: SubscriptionTier;
  dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '解锁更多功能',
  description: '升级会员可享受更多高级功能和无限使用次数',
  features: () => [],
  requiredTier: 'basic',
  dismissible: true
});

const emit = defineEmits<{
  dismiss: [];
}>();

const router = useRouter();
const { getRecommendedUpgrade, getUpgradeMessage } = useMembershipGuard();

const handleUpgrade = () => {
  router.push('/pricing');
};

const handleDismiss = () => {
  emit('dismiss');
};
</script>

<style scoped>
.upgrade-prompt {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.icon-circle {
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.title {
  color: #1e293b;
}

.description {
  line-height: 1.6;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature-item {
  padding: 0.25rem 0;
}

.check-icon {
  font-weight: bold;
  font-size: 1rem;
}

.upgrade-button {
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.upgrade-button:hover {
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
  transform: translateY(-1px);
}

.close-button {
  flex-shrink: 0;
  padding: 0.25rem;
  cursor: pointer;
}
</style>


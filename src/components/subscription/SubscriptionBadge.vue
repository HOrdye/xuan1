<template>
  <div v-if="show" class="subscription-badge" :class="tier">
    <span class="badge-icon">{{ tierIcon }}</span>
    <span class="badge-text">{{ tierText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/store/userStore';
import type { SubscriptionTier } from '@/core/types/subscription';

const props = defineProps<{
  show?: boolean;
}>();

const userStore = useUserStore();

const tier = computed<SubscriptionTier>(() => userStore.subscriptionTier);
const isPremium = computed(() => userStore.isPremium);

const tierIcon = computed(() => {
  switch (tier.value) {
    case 'premium':
      return '👑';
    case 'advanced':
      return '💎';
    default:
      return '';
  }
});

const tierText = computed(() => {
  switch (tier.value) {
    case 'premium':
      return '会员';
    case 'advanced':
      return '高级会员';
    default:
      return '免费版';
  }
});

const show = computed(() => {
  if (props.show !== undefined) return props.show;
  return isPremium.value;
});
</script>

<style scoped>
.subscription-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.subscription-badge.premium {
  background: linear-gradient(135deg, #f8c400 0%, #ffd700 100%);
  color: #0a1e4d;
}

.subscription-badge.advanced {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.badge-icon {
  font-size: 1rem;
}

.badge-text {
  font-weight: 700;
}
</style>



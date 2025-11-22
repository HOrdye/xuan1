<template>
  <n-modal
    v-model:show="showModal"
    preset="card"
    :title="title"
    :bordered="false"
    :closable="true"
    :mask-closable="true"
    class="paywall-modal"
    style="width: 90%; max-width: 600px;"
  >
    <div class="paywall-content">
      <!-- 价值展示 -->
      <div class="value-proposition">
        <div class="value-icon">✨</div>
        <h3 class="value-title">{{ valueTitle }}</h3>
        <p class="value-description">{{ valueDescription }}</p>
      </div>

      <!-- 功能对比 -->
      <div class="feature-comparison">
        <div class="comparison-row header">
          <div class="feature-name">功能</div>
          <div class="plan free">免费</div>
          <div class="plan premium">会员</div>
        </div>
        <div
          v-for="feature in features"
          :key="feature.name"
          class="comparison-row"
        >
          <div class="feature-name">{{ feature.name }}</div>
          <div class="plan free">
            <span v-if="feature.free" class="check">✓</span>
            <span v-else class="cross">✗</span>
          </div>
          <div class="plan premium">
            <span class="check">✓</span>
          </div>
        </div>
      </div>

      <!-- 价格展示 -->
      <div class="pricing-section">
        <div class="price-highlight">
          <span class="price-label">首月特惠</span>
          <div class="price-group">
            <span class="price-symbol">¥</span>
            <span class="price-value">9.9</span>
            <span class="price-period">/月</span>
          </div>
          <span class="price-original">原价 ¥19/月</span>
        </div>
        <div class="price-note">7天免费试用，随时可取消</div>
      </div>

      <!-- 行动按钮 -->
      <div class="action-buttons">
        <n-button
          type="primary"
          size="large"
          block
          @click="handleUpgrade"
          class="upgrade-button"
        >
          <template #icon>
            <span>🚀</span>
          </template>
          立即升级
        </n-button>
        <n-button
          type="default"
          size="medium"
          block
          @click="handleLater"
          class="later-button"
        >
          稍后再说
        </n-button>
      </div>

      <!-- 信任提示 -->
      <div class="trust-indicators">
        <div class="trust-item">
          <span class="trust-icon">🔒</span>
          <span class="trust-text">安全支付</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon">↩️</span>
          <span class="trust-text">随时取消</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon">💬</span>
          <span class="trust-text">专属客服</span>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { NModal, NButton } from 'naive-ui';

interface Feature {
  name: string;
  free: boolean;
}

const props = defineProps<{
  show: boolean;
  title?: string;
  valueTitle?: string;
  valueDescription?: string;
  features?: Feature[];
  onUpgrade?: () => void;
  onLater?: () => void;
}>();

const emit = defineEmits<{
  'update:show': [value: boolean];
  upgrade: [];
  later: [];
}>();

const showModal = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
});

const title = computed(() => props.title || '解锁更多功能');
const valueTitle = computed(() => props.valueTitle || '升级会员，解锁深度解读');
const valueDescription = computed(() => props.valueDescription || '获得AI深度分析、无限次解读、个性化建议等高级功能');

const defaultFeatures: Feature[] = [
  { name: '基础排盘', free: true },
  { name: '快速诊断', free: true },
  { name: '每日3次解读', free: true },
  { name: 'AI深度解读', free: false },
  { name: '无限次解读', free: false },
  { name: '三维综合分析', free: false },
  { name: '个性化建议', free: false },
  { name: '大运导航', free: false },
];

const features = computed(() => props.features || defaultFeatures);

const handleUpgrade = () => {
  emit('upgrade');
  if (props.onUpgrade) {
    props.onUpgrade();
  }
  showModal.value = false;
};

const handleLater = () => {
  emit('later');
  if (props.onLater) {
    props.onLater();
  }
  showModal.value = false;
};
</script>

<style scoped>
.paywall-modal :deep(.n-card) {
  border-radius: 24px;
  overflow: hidden;
}

.paywall-content {
  padding: 0.5rem;
}

/* 价值展示 */
.value-proposition {
  text-align: center;
  padding: 1.5rem 0;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  border-radius: 16px;
  margin-bottom: 1.5rem;
}

.value-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.value-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #9333EA 0%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.value-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
  padding: 0 1rem;
}

/* 功能对比 */
.feature-comparison {
  margin-bottom: 1.5rem;
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 12px;
  overflow: hidden;
}

.comparison-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
}

.comparison-row:last-child {
  border-bottom: none;
}

.comparison-row.header {
  background: rgba(139, 92, 246, 0.05);
  font-weight: 600;
  color: #333;
}

.feature-name {
  font-size: 0.95rem;
  color: #333;
}

.plan {
  text-align: center;
  font-weight: 600;
}

.plan.free {
  color: #666;
}

.plan.premium {
  color: #9333EA;
}

.check {
  color: #16a34a;
  font-weight: bold;
}

.cross {
  color: #dc2626;
  font-weight: bold;
}

/* 价格展示 */
.pricing-section {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
  border-radius: 16px;
  margin-bottom: 1.5rem;
}

.price-highlight {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.price-label {
  font-size: 0.875rem;
  color: #9333EA;
  font-weight: 600;
  background: rgba(147, 51, 234, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.price-group {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.price-symbol {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.price-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #9333EA;
  line-height: 1;
}

.price-period {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

.price-original {
  font-size: 0.875rem;
  color: #999;
  text-decoration: line-through;
}

.price-note {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.75rem;
}

/* 行动按钮 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.upgrade-button {
  background: linear-gradient(135deg, #9333EA 0%, #3B82F6 100%);
  border: none;
  font-weight: 600;
  height: 48px;
  font-size: 1rem;
}

.upgrade-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(147, 51, 234, 0.3);
}

.later-button {
  height: 40px;
}

/* 信任提示 */
.trust-indicators {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(139, 92, 246, 0.1);
}

.trust-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.trust-icon {
  font-size: 1.25rem;
}

.trust-text {
  font-size: 0.75rem;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .comparison-row {
    grid-template-columns: 1.5fr 1fr 1fr;
    padding: 0.75rem 0.5rem;
    gap: 0.5rem;
  }

  .feature-name {
    font-size: 0.875rem;
  }

  .trust-indicators {
    gap: 1rem;
  }
}
</style>




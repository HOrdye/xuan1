<template>
  <n-modal
    v-model:show="visible"
    preset="card"
    :title="star ? `✨ ${star.name}` : ''"
    class="star-detail-modal"
    :style="{ maxWidth: '600px' }"
    @close="handleClose"
  >
    <div v-if="star" class="star-detail-content">
      <!-- 星曜基本信息 -->
      <div class="star-header">
        <div class="star-icon-large">
          <span class="star-emoji-large">{{ star.emoji }}</span>
        </div>
        <div class="star-basic-info">
          <h3 class="star-name-large">{{ star.name }}</h3>
          <div class="star-tags">
            <span class="tag category-tag">{{ star.category }}</span>
            <span class="tag brightness-tag" :class="star.brightness">
              {{ star.brightness }}
            </span>
            <span class="tag element-tag">{{ star.element }}</span>
            <span class="tag yinyang-tag">{{ star.yinyang }}</span>
          </div>
        </div>
      </div>

      <!-- 星曜描述 -->
      <div v-if="star.description" class="star-description-section">
        <h4 class="section-title">星曜含义</h4>
        <p class="description-text">{{ star.description }}</p>
      </div>

      <!-- 性格特质 -->
      <div v-if="star.personality && star.personality.length > 0" class="personality-section">
        <h4 class="section-title">性格特质</h4>
        <div class="personality-tags">
          <span
            v-for="trait in star.personality"
            :key="trait"
            class="personality-tag"
          >
            {{ trait }}
          </span>
        </div>
      </div>

      <!-- 收藏按钮 -->
      <div class="action-section">
        <n-button
          :type="isCollected ? 'default' : 'primary'"
          @click="toggleCollect"
          :loading="collecting"
        >
          <template #icon>
            <n-icon>
              <svg v-if="isCollected" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" opacity="0.3"/>
              </svg>
            </n-icon>
          </template>
          {{ isCollected ? '已收藏' : '收藏星曜' }}
        </n-button>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { NModal, NButton, NIcon } from 'naive-ui';
import { useZiweiStore } from '../store/ziweiStore';
import type { Star } from '../types';

interface Props {
  modelValue: boolean;
  star: Star | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const ziweiStore = useZiweiStore();
const collecting = ref(false);

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const isCollected = computed(() => {
  if (!props.star) return false;
  return ziweiStore.hasCollectedStar(props.star.name);
});

const handleClose = () => {
  visible.value = false;
};

const toggleCollect = async () => {
  if (!props.star) return;
  
  collecting.value = true;
  try {
    if (isCollected.value) {
      // 取消收藏
      ziweiStore.removeCollectedStar(props.star.name);
    } else {
      // 收藏
      ziweiStore.addCollectedStar(props.star.name);
    }
  } finally {
    collecting.value = false;
  }
};
</script>

<style scoped>
.star-detail-modal :deep(.n-card) {
  border-radius: 16px;
}

.star-detail-content {
  padding: 0.5rem 0;
}

.star-header {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid rgba(147, 51, 234, 0.1);
}

.star-icon-large {
  flex-shrink: 0;
}

.star-emoji-large {
  font-size: 4rem;
  display: block;
}

.star-basic-info {
  flex: 1;
}

.star-name-large {
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
  color: #333;
}

.star-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 0.85rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-weight: 500;
}

.category-tag {
  background: rgba(147, 51, 234, 0.1);
  color: #9333EA;
}

.brightness-tag {
  background: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
}

.brightness-tag.庙 {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.brightness-tag.旺 {
  background: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
}

.brightness-tag.平 {
  background: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.brightness-tag.陷 {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.element-tag {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.yinyang-tag {
  background: rgba(139, 92, 246, 0.1);
  color: #8B5CF6;
}

.star-description-section,
.personality-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #9333EA;
  margin-bottom: 0.8rem;
}

.description-text {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.8;
  margin: 0;
}

.personality-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.personality-tag {
  font-size: 0.85rem;
  padding: 0.4rem 0.8rem;
  background: rgba(147, 51, 234, 0.1);
  color: #9333EA;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.personality-tag:hover {
  background: rgba(147, 51, 234, 0.2);
  transform: translateY(-2px);
}

.action-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(147, 51, 234, 0.1);
  text-align: center;
}
</style>









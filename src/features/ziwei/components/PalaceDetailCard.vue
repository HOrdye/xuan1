<template>
  <n-modal
    v-model:show="visible"
    preset="card"
    :title="`🏛️ ${palace.name}`"
    class="palace-detail-modal"
    :style="{ maxWidth: '800px' }"
    @close="handleClose"
  >
    <div
      ref="cardRef"
      class="palace-detail-card"
      :class="{
        'ming-gong': isMingGong,
        'shen-gong': isShenGong,
        'empty': palace.stars.length === 0,
        'card-animated': isAnimated
      }"
    >
      <div class="card-header">
        <h3 class="palace-name">
          <TermTooltip :term="palace.name">{{ palace.name }}</TermTooltip>
        </h3>
        <div class="badges">
          <span v-if="isMingGong" class="badge ming-badge">命宫</span>
          <span v-if="isShenGong" class="badge shen-badge">身宫</span>
          <span v-if="palace.stars.length === 0" class="badge empty-badge">空宫</span>                                                                            
        </div>
      </div>

    <div class="card-content">
          <!-- 主星区域 -->
      <div v-if="mainStars.length > 0" class="stars-section main-stars-section">
        <div class="section-title">主星</div>
        <div class="stars-grid">
          <div
            v-for="(star, index) in mainStars"
            :key="star.id"
            class="star-card main-star-card star-card-item"
            :style="{ '--star-color': star.color }"
            :data-index="index"
          >
            <div class="star-icon">
              <span class="star-emoji">{{ star.emoji }}</span>
            </div>
            <div class="star-info">
              <div class="star-name">
                <TermTooltip :term="star.name">{{ star.name }}</TermTooltip>
              </div>
              <div class="star-category">{{ star.category }}</div>
              <div class="star-brightness">亮度：{{ star.brightness }}</div>
            </div>
            <div class="star-description">{{ star.description }}</div>
            <div v-if="star.personality && star.personality.length > 0" class="star-personality">
              <div
                v-for="trait in star.personality"
                :key="trait"
                class="personality-tag"
              >
                {{ trait }}
              </div>
            </div>
          </div>
        </div>
      </div>

          <!-- 辅星区域 -->
      <div v-if="auxiliaryStars.length > 0" class="stars-section auxiliary-stars-section">
        <div class="section-title">辅星</div>
        <div class="stars-grid">
          <div
            v-for="(star, index) in auxiliaryStars"
            :key="star.id"
            class="star-card auxiliary-star-card star-card-item"
            :class="star.category"
            :data-index="index"
          >
            <div class="star-icon">
              <span class="star-emoji">{{ star.emoji }}</span>
            </div>
            <div class="star-info">
              <div class="star-name">
                <TermTooltip :term="star.name">{{ star.name }}</TermTooltip>
              </div>
              <div class="star-category">{{ star.category }}</div>
            </div>
            <div class="star-description">{{ star.description }}</div>
          </div>
        </div>
      </div>

      <!-- 四化信息 -->
      <div v-if="palace.sihua" class="sihua-section">
        <div class="section-title">四化</div>
        <div class="sihua-grid">
            <div v-if="palace.sihua.lu" class="sihua-item lu sihua-item-animated">
              <div class="sihua-label">
                <TermTooltip term="化禄">化禄</TermTooltip>
              </div>
            <div class="sihua-star">{{ palace.sihua.lu }}</div>
            <div class="sihua-meaning">财运、福气</div>
          </div>
            <div v-if="palace.sihua.quan" class="sihua-item quan sihua-item-animated">
              <div class="sihua-label">
                <TermTooltip term="化权">化权</TermTooltip>
              </div>
            <div class="sihua-star">{{ palace.sihua.quan }}</div>
            <div class="sihua-meaning">权力、地位</div>
          </div>
            <div v-if="palace.sihua.ke" class="sihua-item ke sihua-item-animated">
              <div class="sihua-label">
                <TermTooltip term="化科">化科</TermTooltip>
              </div>
            <div class="sihua-star">{{ palace.sihua.ke }}</div>
            <div class="sihua-meaning">名声、学问</div>
          </div>
            <div v-if="palace.sihua.ji" class="sihua-item ji sihua-item-animated">
              <div class="sihua-label">
                <TermTooltip term="化忌">化忌</TermTooltip>
              </div>
            <div class="sihua-star">{{ palace.sihua.ji }}</div>
            <div class="sihua-meaning">阻碍、困扰</div>
          </div>
        </div>
      </div>

      <!-- 宫位描述 -->
      <div v-if="palace.description" class="palace-description">
        <div class="section-title">宫位含义</div>
        <p>{{ palace.description }}</p>
      </div>

      <!-- 命宫解读（免费功能）- 方案1：卡片式布局 -->
      <div v-if="isMingGong" class="ming-gong-interpretation design-1">
        <div class="interpretation-header">
          <div class="interpretation-title">
            <span class="title-icon">✨</span>
            <span>命宫解读</span>
            <span class="free-badge">免费</span>
          </div>
        </div>
        <div v-if="mingGongInterpretation" class="interpretation-cards">
          <div 
            v-for="(paragraph, index) in interpretationParagraphs" 
            :key="index"
            class="interpretation-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <span class="card-label">{{ getCardLabel(index) }}</span>
            <div class="card-text">{{ paragraph }}</div>
          </div>
        </div>
        <div v-else class="interpretation-loading">
          <p>正在生成解读...</p>
        </div>
      </div>
    </div>
  </div>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick, watch } from 'vue';
import { NModal } from 'naive-ui';
import anime from 'animejs';
import type { Palace } from '../types';
import { generateMingGongInterpretation } from '../utils/palaceInterpretation';
import TermTooltip from './TermTooltip.vue';

interface Props {
  palace: Palace;
  isMingGong?: boolean;
  isShenGong?: boolean;
  modelValue?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isMingGong: false,
  isShenGong: false,
  modelValue: true
});

const emit = defineEmits<{
  close: [];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) {
      emit('close');
    }
  }
});

const handleClose = () => {
  emit('close');
};

/**
 * 获取主星
 */
const mainStars = computed(() => {
  return props.palace.stars.filter(star => star.category === '主星');
});

/**
 * 获取辅星
 */
const auxiliaryStars = computed(() => {
  return props.palace.stars.filter(star => star.category !== '主星');
});

/**
 * 命宫解读（免费功能）
 */
const mingGongInterpretation = computed(() => {
  if (!props.isMingGong) return null;
  try {
    const result = generateMingGongInterpretation(props.palace);
    console.log('命宫解读生成结果:', result);
    return result;
  } catch (error) {
    console.error('生成命宫解读时出错:', error);
    return null;
  }
});

/**
 * 将解读内容分段显示
 */
const interpretationParagraphs = computed(() => {
  if (!mingGongInterpretation.value) return [];
  return mingGongInterpretation.value.split('\n\n').filter(p => p.trim());
});

/**
 * 获取卡片标签
 */
const getCardLabel = (index: number): string => {
  const labels = ['核心特质', '性格分析', '人生建议', '详细解读'];
  return labels[index] || '解读内容';
};

// 动画相关
const cardRef = ref<HTMLElement | null>(null);
const isAnimated = ref(false);

/**
 * 初始化动画
 */
onMounted(async () => {
  await nextTick();
  if (visible.value) {
    animateCard();
  }
});

watch(visible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      animateCard();
    });
  }
});

/**
 * 卡片出现动画
 */
const animateCard = () => {
  if (!cardRef.value) return;

  // 卡片整体淡入
  anime({
    targets: cardRef.value,
    opacity: [0, 1],
    translateY: [30, 0],
    scale: [0.95, 1],
    duration: 600,
    easing: 'easeOutBack',
    complete: () => {
      isAnimated.value = true;
      animateStars();
      animateSihua();
    },
  });
};

/**
 * 星曜卡片动画
 */
const animateStars = () => {
  if (!cardRef.value) return;
  const starCards = cardRef.value.querySelectorAll('.star-card-item');
  
  anime({
    targets: starCards,
    opacity: [0, 1],
    translateX: [-20, 0],
    scale: [0.9, 1],
    delay: (el: any) => {
      const index = parseInt(el.dataset.index || '0');
      return index * 100;
    },
    duration: 400,
    easing: 'easeOutQuad',
  });
};

/**
 * 四化项目动画
 */
const animateSihua = () => {
  if (!cardRef.value) return;
  const sihuaItems = cardRef.value.querySelectorAll('.sihua-item-animated');
  
  anime({
    targets: sihuaItems,
    opacity: [0, 1],
    scale: [0.8, 1],
    delay: (el: any, i: number) => 500 + i * 150,
    duration: 400,
    easing: 'easeOutBack',
  });
};
</script>

<style scoped>
.palace-detail-modal :deep(.n-card) {
  border-radius: 16px;
}

.palace-detail-card {
  background: transparent;
  backdrop-filter: none;
  border-radius: 0;
  padding: 0;
  border: none;
  box-shadow: none;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.palace-detail-card.card-animated {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.palace-detail-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 32px rgba(147, 51, 234, 0.4);
  border-color: rgba(147, 51, 234, 0.5);
}

.palace-detail-card.ming-gong {
  border-color: #9333EA;
  background: rgba(147, 51, 234, 0.05);
}

.palace-detail-card.shen-gong {
  border-color: #3B82F6;
  background: rgba(59, 130, 246, 0.05);
}

.palace-detail-card.empty {
  opacity: 0.8;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(147, 51, 234, 0.1);
}

.palace-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.badges {
  display: flex;
  gap: 0.5rem;
}

.badge {
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-weight: bold;
}

.ming-badge {
  background: #9333EA;
  color: white;
}

.shen-badge {
  background: #3B82F6;
  color: white;
}

.empty-badge {
  background: #999;
  color: white;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stars-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #9333EA;
  margin-bottom: 0.5rem;
}

.stars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.star-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0;
  transform: translateX(-20px) scale(0.9);
}

.star-card-item {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.star-card:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  border-color: rgba(147, 51, 234, 0.3);
}

.main-star-card {
  border-left: 4px solid var(--star-color);
}

.auxiliary-star-card.辅星 {
  border-left: 4px solid #3B82F6;
}

.auxiliary-star-card.吉星 {
  border-left: 4px solid #10B981;
}

.auxiliary-star-card.煞星 {
  border-left: 4px solid #EF4444;
}

.star-icon {
  text-align: center;
  margin-bottom: 0.5rem;
}

.star-emoji {
  font-size: 2rem;
}

.star-info {
  margin-bottom: 0.5rem;
}

.star-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.2rem;
}

.star-category {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.2rem;
}

.star-brightness {
  font-size: 0.8rem;
  color: #999;
}

.star-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.star-personality {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.personality-tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
  background: rgba(147, 51, 234, 0.1);
  color: #9333EA;
  border-radius: 4px;
}

.sihua-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sihua-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.sihua-item {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  border: 2px solid;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.sihua-item-animated {
  opacity: 1;
  transform: scale(1);
}

.sihua-item:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.sihua-item.lu {
  border-color: #10B981;
  background: rgba(16, 185, 129, 0.1);
}

.sihua-item.quan {
  border-color: #F59E0B;
  background: rgba(245, 158, 11, 0.1);
}

.sihua-item.ke {
  border-color: #3B82F6;
  background: rgba(59, 130, 246, 0.1);
}

.sihua-item.ji {
  border-color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
}

.sihua-label {
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.sihua-star {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.sihua-meaning {
  font-size: 0.8rem;
  color: #666;
}

.palace-description {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.palace-description p {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* 命宫解读样式 - 方案1：卡片式布局 */
.ming-gong-interpretation.design-1 {
  margin-top: 2rem;
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
}

.interpretation-header {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px 25px;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.interpretation-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
}

.title-icon {
  font-size: 1.3rem;
}

.free-badge {
  margin-left: auto;
  padding: 4px 12px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.interpretation-cards {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.interpretation-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: cardSlideIn 0.5s ease-out backwards;
  opacity: 0;
  animation-fill-mode: forwards;
}

.interpretation-card:hover {
  transform: translateX(8px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.card-label {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: bold;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

.card-text {
  line-height: 1.8;
  color: #333;
  font-size: 0.95rem;
  text-align: justify;
}

.interpretation-loading {
  padding: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stars-grid {
    grid-template-columns: 1fr;
  }

  .sihua-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>


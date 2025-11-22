<template>
  <span class="term-tooltip-wrapper">
    <span
      class="term-link"
      :class="{ 'has-explanation': hasExplanationSync }"     
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="showModal = true"
    >
      <slot>{{ term }}</slot>
      <span v-if="hasExplanationSync" class="term-icon">ℹ️</span>
    </span>

    <!-- 悬停提示框 -->
    <Transition name="fade">
      <div
        v-show="showTooltip && hasExplanationSync"
        class="tooltip"
        :style="tooltipStyle"
      >
        <div class="tooltip-content">
          <div class="tooltip-title">{{ term }}</div>
          <div class="tooltip-text">{{ explanationText }}</div>
          <div class="tooltip-footer">
            <span class="tooltip-category">{{ category }}</span>
            <span class="tooltip-hint">点击查看详情</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 详细解释弹窗 -->
    <n-modal
      v-model:show="showModal"
      preset="card"
      title="术语解释"
      style="max-width: 500px"
    >
      <div class="term-modal">
        <div class="term-modal-title">{{ term }}</div>
        <div class="term-modal-category">{{ category }}</div>
        
        <div class="term-modal-tabs">
          <n-button-group>
            <n-button
              :type="viewMode === 'simple' ? 'primary' : 'default'"
              size="small"
              @click="viewMode = 'simple'"
            >
              简单解释
            </n-button>
            <n-button
              :type="viewMode === 'professional' ? 'primary' : 'default'"
              size="small"
              @click="viewMode = 'professional'"
            >
              专业解释
            </n-button>
          </n-button-group>
        </div>

        <div class="term-modal-content">
          <p>{{ currentExplanation }}</p>
        </div>
      </div>
    </n-modal>
  </span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';                                                      
import { NModal, NButtonGroup, NButton } from 'naive-ui';
import { debounce, throttle } from '../utils/debounce';
import { useZiweiStore } from '../store/ziweiStore';

interface Props {
  term: string;
  mode?: 'simple' | 'professional';
}

const props = withDefaults(defineProps<Props>(), {       
  mode: 'simple'
});

const ziweiStore = useZiweiStore();
const showTooltip = ref(false);
const showModal = ref(false);
const viewMode = ref<'simple' | 'professional'>(props.mode);                                                      
const tooltipStyle = ref({});
const isLoading = ref(false);
const termData = ref<any>(null);

// 懒加载术语数据
const loadTermData = async () => {
  if (termData.value) return termData.value;
  
  if (isLoading.value) return null;
  
  isLoading.value = true;
  try {
    // 动态导入术语数据，实现懒加载
    const module = await import('../data/termExplanations');
    const { getTermExplanation, hasTermExplanation, TERM_EXPLANATIONS } = module;
    
    termData.value = {
      getTermExplanation,
      hasTermExplanation,
      TERM_EXPLANATIONS
    };
    
    return termData.value;
  } catch (error) {
    console.error('Failed to load term explanations:', error);
    return null;
  } finally {
    isLoading.value = false;
  }
};

// 同步版本（用于模板）
const hasExplanationSync = ref(false);

// 监听术语变化，加载数据
watch(() => props.term, async () => {
  const data = await loadTermData();
  if (data) {
    hasExplanationSync.value = data.hasTermExplanation(props.term);
  }
}, { immediate: true });

const explanation = computed(() => {
  if (!termData.value || !hasExplanationSync.value) return null;
  return termData.value.getTermExplanation(props.term, viewMode.value); 
});

const explanationText = computed(() => {
  if (!explanation.value) return '';
  // 简单模式下，只显示前50个字
  if (viewMode.value === 'simple' && explanation.value.length > 50) {                                             
    return explanation.value.substring(0, 50) + '...';   
  }
  return explanation.value;
});

const currentExplanation = computed(() => {
  if (!termData.value || !hasExplanationSync.value) return '暂无解释';
  return termData.value.getTermExplanation(props.term, viewMode.value) || '暂无解释';                                            
});

const category = computed(() => {
  if (!termData.value || !hasExplanationSync.value) return '';
  const explanation = termData.value.TERM_EXPLANATIONS[props.term];     
  return explanation?.category || '';
});

// 防抖的悬停处理
const handleMouseEnter = debounce(() => {
  if (hasExplanationSync.value) {
    showTooltip.value = true;
  }
}, 200);

const handleMouseLeave = debounce(() => {
  showTooltip.value = false;
}, 100);

// 节流的提示框位置更新（优化性能）
const updateTooltipPosition = throttle((event: MouseEvent) => {   
  const tooltipWidth = 300;
  const tooltipHeight = 150;
  const padding = 10;

  let left = event.clientX + padding;
  let top = event.clientY + padding;

  // 防止超出右边界
  if (left + tooltipWidth > window.innerWidth) {
    left = event.clientX - tooltipWidth - padding;       
  }

  // 防止超出下边界
  if (top + tooltipHeight > window.innerHeight) {        
    top = event.clientY - tooltipHeight - padding;       
  }

  tooltipStyle.value = {
    left: `${left}px`,
    top: `${top}px`
  };
}, 50); // 每50ms最多更新一次位置

onMounted(() => {
  // 初始化加载术语数据
  loadTermData();
  
  // 监听鼠标移动，更新提示框位置（使用节流优化）
  document.addEventListener('mousemove', updateTooltipPosition);                                                  
});

onUnmounted(() => {
  document.removeEventListener('mousemove', updateTooltipPosition);                                               
});
</script>

<style scoped>
.term-tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.term-link {
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;
  color: inherit;
  transition: all 0.2s;
}

.term-link:hover {
  color: var(--primary-color, #18a058);
  text-decoration-color: var(--primary-color, #18a058);
}

.term-link.has-explanation {
  cursor: help;
}

.term-icon {
  margin-left: 4px;
  font-size: 0.8em;
  opacity: 0.6;
}

.tooltip {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  max-width: 300px;
  background: var(--card-color, #fff);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 12px;
  animation: fadeIn 0.2s;
}

.tooltip-content .tooltip-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  color: var(--text-color-1, #333);
}

.tooltip-content .tooltip-text {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-color-2, #666);
  margin-bottom: 8px;
}

.tooltip-content .tooltip-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-color-3, #999);
  padding-top: 8px;
  border-top: 1px solid var(--border-color, #e0e0e0);
}

.tooltip-content .tooltip-category {
  background: var(--info-color, #18a058);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.tooltip-content .tooltip-hint {
  font-size: 11px;
}

.term-modal .term-modal-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-color-1, #333);
}

.term-modal .term-modal-category {
  font-size: 12px;
  color: var(--text-color-3, #999);
  margin-bottom: 16px;
}

.term-modal .term-modal-tabs {
  margin-bottom: 16px;
}

.term-modal .term-modal-content {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-color-2, #666);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>


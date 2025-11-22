<template>
  <Transition name="slide-fade">
    <div v-if="isVisible" class="triple-analysis-sidebar">
      <!-- 侧边栏头部 -->
      <div class="sidebar-header">
        <div class="header-icon">🔮</div>
        <h4 class="header-title">三维解读</h4>
        <button 
          @click="closeSidebar" 
          class="close-button"
          aria-label="关闭"
        >
          ✕
        </button>
      </div>

      <!-- 引导文案 -->
      <div class="sidebar-prompt">
        <p class="prompt-text">{{ promptText }}</p>
      </div>

      <!-- 系统选择 -->
      <div class="system-selection">
        <button
          v-for="system in availableSystems"
          :key="system.id"
          @click="selectSystem(system.id)"
          class="system-button"
          :class="{ 'active': selectedSystem === system.id }"
        >
          <span class="system-icon">{{ system.icon }}</span>
          <span class="system-name">{{ system.name }}</span>
        </button>
      </div>

      <!-- 解读预览 -->
      <div v-if="previewContent" class="preview-content">
        <div class="preview-header">
          <span class="preview-icon">{{ selectedSystemIcon }}</span>
          <span class="preview-title">{{ selectedSystemName }}视角</span>
        </div>
        <div class="preview-text">
          {{ previewContent }}
        </div>
        <div v-if="keyInsight" class="key-insight">
          <div class="insight-label">💡 关键洞察</div>
          <div class="insight-text">{{ keyInsight }}</div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p class="loading-text">正在生成解读...</p>
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="error-state">
        <div class="error-icon">⚠️</div>
        <p class="error-text">{{ errorMessage }}</p>
      </div>

      <!-- 完整分析按钮 -->
      <div v-if="previewContent && !isLoading" class="action-section">
        <button 
          @click="goToFullAnalysis" 
          class="full-analysis-button"
        >
          查看完整三维分析 →
        </button>
      </div>
    </div>
  </Transition>

  <!-- 遮罩层 -->
  <Transition name="fade">
    <div 
      v-if="isVisible" 
      @click="closeSidebar"
      class="sidebar-overlay"
    ></div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useZiweiStore } from '../../ziwei/store/ziweiStore';
import { 
  matchQuestionToPalaces, 
  generateEntryPrompt,
  getPalaceFriendlyName
} from '../utils/questionMatcher';
import { ZiweiFusionService } from '../../ziwei/services/fusionService';

interface Props {
  question: string;
  hexagramName?: string;
  isVisible: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const router = useRouter();
const ziweiStore = useZiweiStore();

// 可用系统
const availableSystems = [
  { id: 'ziwei', name: '紫微视角', icon: '🌟' },
  { id: 'tarot', name: '塔罗视角', icon: '✨' }
];

// 状态
const selectedSystem = ref<string | null>(null);
const previewContent = ref<string>('');
const keyInsight = ref<string>('');
const isLoading = ref(false);
const errorMessage = ref<string>('');

// 计算属性
const promptText = computed(() => {
  const matchedPalaces = matchQuestionToPalaces(props.question);
  return generateEntryPrompt(matchedPalaces);
});

const selectedSystemIcon = computed(() => {
  const system = availableSystems.find(s => s.id === selectedSystem.value);
  return system?.icon || '🔮';
});

const selectedSystemName = computed(() => {
  const system = availableSystems.find(s => s.id === selectedSystem.value);
  return system?.name || '三维解读';
});

// 检查用户是否有命盘
const hasChart = computed(() => {
  return !!ziweiStore.currentChart;
});

// 选择系统
const selectSystem = async (systemId: string) => {
  if (selectedSystem.value === systemId) {
    return; // 已选择，不重复加载
  }

  selectedSystem.value = systemId;
  previewContent.value = '';
  keyInsight.value = '';
  errorMessage.value = '';
  isLoading.value = true;

  try {
    if (systemId === 'ziwei') {
      await generateZiweiPreview();
    } else if (systemId === 'tarot') {
      // TODO: 实现塔罗预览
      previewContent.value = '塔罗视角预览功能开发中...';
    }
  } catch (error: any) {
    console.error('生成预览失败:', error);
    errorMessage.value = '生成预览时出现错误，请稍后重试';
  } finally {
    isLoading.value = false;
  }
};

// 生成紫微视角预览
const generateZiweiPreview = async () => {
  if (!ziweiStore.currentChart) {
    throw new Error('用户未生成命盘');
  }

  const matchedPalaces = matchQuestionToPalaces(props.question);
  if (matchedPalaces.length === 0) {
    throw new Error('问题不匹配命盘相关领域');
  }

  // 选择第一个匹配的宫位进行预览
  const targetPalace = matchedPalaces[0];
  
  try {
    // 使用ZiweiFusionService生成宫位视角
    // 注意：generatePalacePerspective的参数顺序是 (chart, question, hexagramName)
    const palacePerspective = ZiweiFusionService.generatePalacePerspective(
      ziweiStore.currentChart,
      props.question,
      props.hexagramName || ''
    );

    // 提取简要解读（50字左右）
    // PalacePerspective包含：palaceAnalysis, hexagramConnection, integratedAdvice
    const analysisText = palacePerspective.palaceAnalysis || '';
    const connectionText = palacePerspective.hexagramConnection || '';
    const adviceText = palacePerspective.integratedAdvice || '';
    
    // 组合文本内容
    const fullText = [analysisText, connectionText, adviceText]
      .filter(Boolean)
      .join(' ');
    
    previewContent.value = fullText.length > 50 
      ? fullText.substring(0, 50) + '...'
      : fullText;

    // 提取关键洞察（使用integratedAdvice作为关键洞察）
    if (adviceText) {
      keyInsight.value = adviceText.length > 30 
        ? adviceText.substring(0, 30) + '...'
        : adviceText;
    } else {
      keyInsight.value = `能量匹配度：${palacePerspective.energyMatch || 0}%`;
    }
  } catch (error: any) {
    console.error('生成紫微预览失败:', error);
    // 降级方案：使用简单模板
    previewContent.value = `基于你的命盘${getPalaceFriendlyName(targetPalace)}宫位，这个问题与你当前的能量状态有关。`;
    keyInsight.value = '建议结合当前大运和流年进行综合分析。';
  }
};

// 关闭侧边栏
const closeSidebar = () => {
  emit('close');
};

// 跳转到完整三维分析
const goToFullAnalysis = () => {
  // 将问题传递到三维分析页面
  router.push({
    path: '/triple-analysis',
    query: {
      question: props.question,
      systems: selectedSystem.value || 'ziwei'
    }
  });
};

// 监听可见性变化，重置状态
watch(() => props.isVisible, (newVal) => {
  if (!newVal) {
    // 关闭时重置状态
    selectedSystem.value = null;
    previewContent.value = '';
    keyInsight.value = '';
    errorMessage.value = '';
    isLoading.value = false;
  }
});
</script>

<style scoped>
.triple-analysis-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 380px;
  max-width: 90vw;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  color: white;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-icon {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.header-title {
  flex: 1;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.sidebar-prompt {
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
}

.prompt-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

.system-selection {
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.system-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid transparent;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.system-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(-4px);
}

.system-button.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.system-icon {
  font-size: 1.25rem;
}

.system-name {
  font-weight: 500;
}

.preview-content {
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 1.5rem;
  border-radius: 8px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.preview-icon {
  font-size: 1.25rem;
}

.preview-text {
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.key-insight {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  border-left: 3px solid rgba(255, 255, 255, 0.5);
}

.insight-label {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.insight-text {
  font-size: 0.9rem;
  line-height: 1.5;
}

.loading-state,
.error-state {
  padding: 2rem 1.5rem;
  text-align: center;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 0.9rem;
  margin: 0;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.error-text {
  font-size: 0.9rem;
  margin: 0;
}

.action-section {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: auto;
}

.full-analysis-button {
  width: 100%;
  padding: 0.875rem 1rem;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.full-analysis-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);
}

/* 过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateX(100%);
}

.slide-fade-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .triple-analysis-sidebar {
    width: 100vw;
    max-width: 100vw;
  }
}
</style>


<template>
  <div class="ai-analysis-display">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">AI正在深度分析中...</p>
    </div>

    <!-- 解析后的结构化内容 -->
    <div v-else-if="parsedContent" class="analysis-content">
      <!-- 总体分析 -->
      <AnalysisCard
        v-if="parsedContent.overall"
        title="🔮 总体运势分析"
        :content="String(parsedContent.overall)"
        type="overall"
        class="mb-6"
      />

      <!-- 详细解读 -->
      <AnalysisCard
        v-if="parsedContent.details"
        title="📖 详细解读"
        :content="String(parsedContent.details)"
        type="details"
        class="mb-6"
      />

      <!-- 个性化建议 -->
      <AnalysisCard
        v-if="parsedContent.advice"
        title="💡 个性化建议"
        :content="String(parsedContent.advice)"
        type="advice"
        class="mb-6"
      />

      <!-- 运势预测 -->
      <AnalysisCard
        v-if="parsedContent.prediction"
        title="🔮 运势预测"
        :content="String(parsedContent.prediction)"
        type="prediction"
        class="mb-6"
      />

      <!-- 行动指南 -->
      <AnalysisCard
        v-if="parsedContent.action"
        title="🎯 行动指南"
        :content="String(parsedContent.action)"
        type="action"
        class="mb-6"
      />

      <!-- 其他内容 -->
      <AnalysisCard
        v-for="(content, key) in parsedContent.others"
        :key="key"
        :title="getCustomTitle(key)"
        :content="String(content)"
        type="other"
        class="mb-6"
      />
    </div>

    <!-- 解析失败时的降级显示 -->
    <div v-else-if="rawContent" class="fallback-content">
      <div class="fallback-card">
        <div class="fallback-header">
          <span class="text-2xl mr-3">🤖</span>
          <h3 class="text-lg font-semibold text-purple-800">AI智能分析</h3>
        </div>
        <div class="fallback-body">
          <p class="text-gray-700 leading-relaxed">{{ getCleanText(rawContent) }}</p>
        </div>
        <div class="fallback-footer">
          <span class="text-xs text-purple-500">
            <span class="mr-1">✨</span>
            由AI智能分析生成
          </span>
        </div>
      </div>
    </div>

    <!-- 无内容状态 -->
    <div v-else class="no-content">
      <div class="no-content-card">
        <span class="text-4xl mb-4">🔍</span>
        <p class="text-gray-500">暂无AI分析内容</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import AnalysisCard from './AnalysisCard.vue';

interface ParsedContent {
  overall?: string;
  details?: string;
  advice?: string;
  prediction?: string;
  action?: string;
  others?: Record<string, string>;
}

interface Props {
  content: string | object;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
});

const parsedContent = ref<ParsedContent | null>(null);
const rawContent = ref<string>('');

// 解析已解析的对象
const parseParsedObject = (parsed: any): ParsedContent | null => {
  const result: ParsedContent = {};
  
  // 映射常见字段
  if (parsed.overall || parsed.summary || parsed.analysis) {
    const overallContent = parsed.overall || parsed.summary || parsed.analysis;
    result.overall = typeof overallContent === 'string' ? overallContent : JSON.stringify(overallContent);
  }
  
  if (parsed.details || parsed.interpretation || parsed.explanation) {
    const detailsContent = parsed.details || parsed.interpretation || parsed.explanation;
    result.details = typeof detailsContent === 'string' ? detailsContent : JSON.stringify(detailsContent);
  }
  
  if (parsed.advice || parsed.suggestions || parsed.recommendations) {
    const adviceContent = parsed.advice || parsed.suggestions || parsed.recommendations;
    result.advice = typeof adviceContent === 'string' ? adviceContent : JSON.stringify(adviceContent);
  }
  
  if (parsed.prediction || parsed.forecast || parsed.outlook) {
    const predictionContent = parsed.prediction || parsed.forecast || parsed.outlook;
    result.prediction = typeof predictionContent === 'string' ? predictionContent : JSON.stringify(predictionContent);
  }
  
  if (parsed.action || parsed.actions || parsed.steps) {
    const actionContent = parsed.action || parsed.actions || parsed.steps;
    result.action = typeof actionContent === 'string' ? actionContent : JSON.stringify(actionContent);
  }
  
  // 收集其他字段
  const others: Record<string, string> = {};
  Object.keys(parsed).forEach(key => {
    if (!['overall', 'summary', 'analysis', 'details', 'interpretation', 
          'explanation', 'advice', 'suggestions', 'recommendations', 
          'prediction', 'forecast', 'outlook', 'action', 'actions', 'steps'].includes(key)) {
      const content = parsed[key];
      if (content && (typeof content === 'string' ? content.trim() : true)) {
        others[key] = typeof content === 'string' ? content : JSON.stringify(content);
      }
    }
  });
  
  if (Object.keys(others).length > 0) {
    result.others = others;
  }
  
  return Object.keys(result).length > 0 ? result : null;
};

// 解析AI内容
const parseAIContent = (content: string): ParsedContent | null => {
  if (!content) return null;

  try {
    // 首先尝试直接解析整个内容为JSON
    try {
      const parsed = JSON.parse(content);
      return parseParsedObject(parsed);
    } catch (e) {
      // 如果直接解析失败，尝试提取JSON片段
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        return parseParsedObject(parsed);
      }
    }
  } catch (error) {
    console.warn('AI内容JSON解析失败:', error);
  }
  
  return null;
};

// 清理文本内容
const getCleanText = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  
  // 移除JSON标记
  let cleaned = text.replace(/\{[\s\S]*\}/g, '').trim();
  
  // 移除多余的换行和空格
  cleaned = cleaned.replace(/\n\s*\n/g, '\n').trim();
  
  // 如果清理后为空，返回原始文本
  return cleaned || text;
};

// 获取自定义标题
const getCustomTitle = (key: string): string => {
  const titleMap: Record<string, string> = {
    'lucky': '🍀 幸运提示',
    'warning': '⚠️ 注意事项',
    'opportunity': '🎯 机遇提示',
    'challenge': '💪 挑战提醒',
    'energy': '⚡ 能量分析',
    'timing': '⏰ 时机建议',
    'relationship': '💝 人际关系',
    'career': '💼 事业发展',
    'wealth': '💰 财运分析',
    'health': '💪 健康提醒'
  };
  
  return titleMap[key] || `📋 ${key}`;
};

// 监听内容变化
watch(() => props.content, (newContent) => {
  try {
    // 处理不同类型的content
    let contentString = '';
    if (typeof newContent === 'string') {
      contentString = newContent;
    } else if (typeof newContent === 'object' && newContent !== null) {
      contentString = JSON.stringify(newContent);
    } else {
      parsedContent.value = null;
      rawContent.value = '';
      return;
    }
    
    if (!contentString || !contentString.trim()) {
      parsedContent.value = null;
      rawContent.value = '';
      return;
    }
    
    // 尝试解析结构化内容
    const parsed = parseAIContent(contentString);
    if (parsed && Object.keys(parsed).length > 0) {
      parsedContent.value = parsed;
      rawContent.value = '';
    } else {
      // 解析失败，使用原始内容
      parsedContent.value = null;
      rawContent.value = contentString;
    }
  } catch (error) {
    console.warn('监听内容变化时出错:', error);
    parsedContent.value = null;
    rawContent.value = typeof newContent === 'string' ? newContent : JSON.stringify(newContent) || '';
  }
}, { immediate: true });
</script>

<style scoped>
.ai-analysis-display {
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 1rem;
  border: 2px solid #e5e7eb;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-text {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.analysis-content {
  margin-bottom: 1.5rem;
}

.fallback-content {
  width: 100%;
}

.fallback-card {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border: 2px solid #e9d5ff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.fallback-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e9d5ff;
}

.fallback-body {
  margin-bottom: 1rem;
}

.fallback-footer {
  text-align: center;
  padding-top: 0.75rem;
  border-top: 1px solid #e9d5ff;
}

.no-content {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.no-content-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 1rem;
  border: 2px dashed #d1d5db;
}
</style> 
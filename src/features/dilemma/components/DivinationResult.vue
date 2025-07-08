<template>
  <div>
    <div v-if="result" class="divination-result bg-white shadow-xl rounded-lg p-6 animate-fadeIn">
      <!-- 标题和问题回顾 -->
      <div class="mb-6 text-center">
        <h3 class="text-3xl font-semibold text-primary mb-2 vintage-text animate-slideInDown">占卜结果</h3>
        <p v-if="result.question" class="text-gray-600 text-lg animate-slideInDown" style="animation-delay: 0.1s;">
          针对问题: "<span class="font-medium">{{ result.question }}</span>"
        </p>
      </div>

      <!-- 主卦象展示 -->
      <div v-if="result.hexagram" class="mb-6 p-4 border rounded-lg bg-gray-50 animate-reveal">
        <h4 class="font-bold text-gray-800 text-2xl text-center mb-3">本卦: {{ result.hexagram.name }}</h4>
        <HexagramDisplay :hexagram="result.hexagram" :debug="false" />
        <div v-if="result.hexagram.judgment || result.hexagram.meaning" class="mt-3 text-gray-700 text-center">
          <strong class="text-primary">卦辞:</strong> {{ result.hexagram.judgment || result.hexagram.meaning }}
        </div>
        <!-- 六爻爻辞展示 -->
        <ul v-if="(result.hexagram as any).yao_texts && (result.hexagram as any).yao_texts.length === 6" class="yao-list mt-4 space-y-2 text-sm text-gray-600">
          <li v-for="(yao, idx) in (result.hexagram as any).yao_texts" :key="idx"
              :class="['p-2 rounded', { 'highlight bg-primary/10 text-primary-dark font-semibold': result.changingLines && result.changingLines.includes(idx) }]">
            <span class="font-medium">{{ getYaoLabel(idx) }}：</span>{{ yao }}
            <span v-if="result.changingLines && result.changingLines.includes(idx) && result.relatedHexagram && (result.relatedHexagram as any).yao_texts && (result.relatedHexagram as any).yao_texts[idx]" 
                  class="block mt-1 pl-4 text-accent italic">
              → 变爻对应：{{ (result.relatedHexagram as any).yao_texts[idx] }}
            </span>
          </li>
        </ul>
      </div>
      <div v-else class="text-center p-4 mb-6 border rounded-lg bg-gray-50 animate-reveal">
        <p class="text-gray-600">主卦象信息未能生成。</p>
      </div>

      <!-- 变卦展示 -->
      <div v-if="result.changingLines && result.changingLines.length > 0">
        <div v-if="result.relatedHexagram" class="mb-6 p-4 border rounded-lg bg-gray-50 animate-reveal" style="animation-delay: 0.2s;">
          <h4 class="font-bold text-gray-800 text-2xl text-center mb-3">变卦: {{ result.relatedHexagram.name }}</h4>
          <HexagramDisplay :hexagram="result.relatedHexagram" :debug="false" />
          <div v-if="result.relatedHexagram.judgment || result.relatedHexagram.meaning" class="mt-3 text-gray-700 text-center">
            <strong class="text-primary">卦辞:</strong> {{ result.relatedHexagram.judgment || result.relatedHexagram.meaning }}
          </div>
        </div>
        <div v-else class="text-center p-4 mb-6 border rounded-lg bg-gray-50 animate-reveal" style="animation-delay: 0.2s;">
          <p class="text-gray-600">变卦信息未能生成。</p>
        </div>
      </div>

      <!-- Dilemma (玄选两难) 特定分析 -->
      <div v-if="result.method === 'dilemma' && result.optionA && result.optionB" 
           class="dilemma-analysis mt-8 p-6 border-t border-gray-200 animate-reveal" style="animation-delay: 0.4s;">
        <h4 class="text-2xl font-semibold text-primary mb-4 text-center vintage-text">玄选两难分析</h4>
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div class="option-card bg-secondary/10 p-4 rounded-lg shadow">
            <h5 class="font-bold text-secondary text-lg mb-2">选项A: {{ result.optionA }}</h5>
            <p class="text-sm text-gray-700 mb-1">匹配度: <span class="font-semibold">{{ result.optionA_score }}%</span></p>
            <p v-if="result.optionA_analysis" class="text-xs text-gray-600">{{ result.optionA_analysis }}</p>
          </div>
          <div class="option-card bg-accent/10 p-4 rounded-lg shadow">
            <h5 class="font-bold text-accent text-lg mb-2">选项B: {{ result.optionB }}</h5>
            <p class="text-sm text-gray-700 mb-1">匹配度: <span class="font-semibold">{{ result.optionB_score }}%</span></p>
            <p v-if="result.optionB_analysis" class="text-xs text-gray-600">{{ result.optionB_analysis }}</p>
          </div>
        </div>
        <div v-if="result.recommendation" class="recommendation mt-4 p-4 bg-primary/10 rounded-lg text-center">
          <strong class="text-primary">综合建议:</strong>
          <p class="text-gray-700">{{ result.recommendation }}</p>
        </div>
      </div>
      
      <!-- 一般性分析文本 -->
      <div v-if="result.analysis && result.method !== 'dilemma'" class="mt-6 p-4 bg-gray-100 rounded-lg animate-reveal" style="animation-delay: 0.3s;">
        <h4 class="text-xl font-semibold text-gray-800 mb-2">综合解读</h4>
        <div class="text-gray-700 whitespace-pre-wrap">
          <!-- 使用v-html渲染带格式的文本 -->
          <div v-html="formatAnalysisText(result.analysis)"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { AnalysisResult } from '../types';
import HexagramDisplay from '../../../components/hexagram/HexagramDisplay.vue';

const _props = defineProps<{
  result: AnalysisResult | null;
}>();

function getYaoLabel(idx: number): string {
  const labels = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
  return labels[idx] || `${idx + 1}爻`;
}

// 格式化解读文本，添加HTML标签使其更易读
function formatAnalysisText(text: string): string {
  if (!text) return '';
  
  try {
    // 检查文本是否包含格式标记如"text-primary text-lg block mt-4 mb-2"
    if (text.includes('"text-primary') || text.includes('"block pl-4')) {
      // 直接移除这些格式标记
      let cleaned = text;
      
      // 移除带引号的CSS类标记
      cleaned = cleaned.replace(/"([^"]*text-[^"]*|[^"]*block[^"]*|[^"]*pl-\d+[^"]*)"/g, '""');
      
      // 确保文本被包裹在段落标签中
      if (!cleaned.startsWith('<p>')) {
        cleaned = '<p>' + cleaned;
      }
      if (!cleaned.endsWith('</p>')) {
        cleaned = cleaned + '</p>';
      }
      
      return cleaned;
    }
    
    // 如果已经包含HTML标签，直接清理并返回
    if (text.includes('<p>') || text.includes('<strong>') || text.includes('<span>')) {
      return cleanFormatMarkers(text);
    }
    
    // 常规文本处理
    let processedText = text;
    
    // 首先移除英文括号及其内容
    processedText = processedText.replace(/\s*\([^)]*\)/g, '');
    
    // 将换行符转换为HTML段落
    let formattedText = processedText
      .replace(/\n\n+/g, '</p><p>') // 连续多个换行作为段落分隔
      .replace(/\n([^\n])/g, '<br>$1'); // 单个换行转为<br>
    
    // 为标题添加样式（如【变化分析】【具体建议】等）
    formattedText = formattedText.replace(/【([^】]+)】/g, '<strong>【$1】</strong>');
    
    // 为列表项添加样式（如1. 2. 3.等）
    formattedText = formattedText.replace(/(\d+\.\s+[^<]+)(?=<br>|<\/p>|$)/g, '<span>$1</span>');
    
    // 确保文本被包裹在段落中
    if (!formattedText.startsWith('<p>')) {
      formattedText = '<p>' + formattedText;
    }
    if (!formattedText.endsWith('</p>')) {
      formattedText = formattedText + '</p>';
    }
    
    return formattedText;
  } catch (error) {
    console.error('格式化文本时出错:', error);
    // 发生错误时返回原始文本，但确保包含在段落标签中
    return `<p>${text.replace(/\n/g, '<br>')}</p>`;
  }
}

/**
 * 清理文本中的格式标记和英文内容
 * @param text 输入文本
 * @returns 清理后的文本
 */
function cleanFormatMarkers(text: string): string {
  if (!text) return '';
  
  let cleaned = text;
  
  // 移除带引号的CSS类标记
  cleaned = cleaned.replace(/"([^"]*text-[^"]*|[^"]*block[^"]*|[^"]*pl-\d+[^"]*)"/g, '""');
  
  // 移除CSS类标记，如[text-primary text-lg block mt-4 mb-2]
  cleaned = cleaned.replace(/\[[^\]]+\]/g, '');
  
  // 移除英文括号及其内容
  cleaned = cleaned.replace(/\s*\([^)]*\)/g, '');
  
  return cleaned;
}
</script>

<style scoped>
.highlight {
  /* 已通过Tailwind类实现高亮 */
}

.vintage-text {
  font-family: 'Kaiti', 'STKaiti', serif; 
}

/* 卦象信息样式 */
:deep(p) {
  margin-bottom: 0.75rem;
}

:deep(.text-primary) {
  color: var(--primary, #4C7EF3);
}

:deep(.text-primary-dark) {
  color: var(--primary-dark, #3060D0);
}

:deep(.text-accent) {
  color: var(--accent, #D0642A);
}

/* 添加一些动画类 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }

@keyframes slideInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slideInDown { animation: slideInDown 0.5s ease-out forwards; }

@keyframes reveal {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-reveal { animation: reveal 0.5s ease-out forwards; }
</style> 
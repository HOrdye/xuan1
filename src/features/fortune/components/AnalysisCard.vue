<template>
  <div class="analysis-card" :class="cardClass">
    <!-- 卡片头部 -->
    <div class="card-header">
      <div class="header-content">
        <span class="header-icon">{{ getTypeIcon() }}</span>
        <h3 class="header-title">{{ title }}</h3>
      </div>
      <div class="header-decoration">
        <div class="decoration-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <!-- 卡片内容 -->
    <div class="card-body">
      <!-- 文本内容 -->
      <div v-if="isTextContent" class="text-content">
        <p class="content-text">{{ formatContent(content) }}</p>
      </div>

      <!-- 列表内容 -->
      <div v-else-if="isListContent" class="list-content">
        <ul class="content-list">
          <li v-for="(item, index) in contentList" :key="index" class="list-item">
            <span class="list-bullet">{{ getListBullet() }}</span>
            <span class="list-text">{{ item }}</span>
          </li>
        </ul>
      </div>

      <!-- 混合内容 -->
      <div v-else class="mixed-content">
        <div v-if="contentSummary" class="content-summary">
          <p class="summary-text">{{ contentSummary }}</p>
        </div>
        <div v-if="contentList && contentList.length > 0" class="content-details">
          <ul class="details-list">
            <li v-for="(item, index) in contentList" :key="index" class="detail-item">
              <span class="detail-bullet">{{ getDetailBullet() }}</span>
              <span class="detail-text">{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 卡片底部 -->
    <div class="card-footer">
      <div class="footer-decoration">
        <div class="decoration-line"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  content: string;
  type: 'overall' | 'details' | 'advice' | 'prediction' | 'action' | 'other';
}

const props = defineProps<Props>();

// 卡片样式类
const cardClass = computed(() => {
  const baseClass = 'analysis-card-base';
  const typeClass = `analysis-card-${props.type}`;
  return `${baseClass} ${typeClass}`;
});

// 获取类型图标
const getTypeIcon = (): string => {
  const iconMap: Record<string, string> = {
    overall: '🔮',
    details: '📖',
    advice: '💡',
    prediction: '🔮',
    action: '🎯',
    other: '📋'
  };
  return iconMap[props.type] || '📋';
};

// 判断是否为纯文本内容
const isTextContent = computed(() => {
  if (!props.content || typeof props.content !== 'string') return true;
  return !props.content.includes('\n') && !props.content.includes('•') && !props.content.includes('-');
});

// 判断是否为列表内容
const isListContent = computed(() => {
  if (!props.content || typeof props.content !== 'string') return false;
  return props.content.includes('\n') && (props.content.includes('•') || props.content.includes('-'));
});

// 获取列表项目
const contentList = computed(() => {
  if (!props.content || typeof props.content !== 'string' || !props.content.includes('\n')) return null;
  
  try {
    return props.content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')))
      .map(line => line.replace(/^[•\-*]\s*/, '').trim())
      .filter(line => line);
  } catch (error) {
    console.warn('解析内容列表失败:', error);
    return null;
  }
});

// 获取内容摘要
const contentSummary = computed(() => {
  if (!props.content || typeof props.content !== 'string' || !props.content.includes('\n')) return null;
  
  try {
    const lines = props.content.split('\n').map(line => line.trim()).filter(line => line);
    const summaryLines = lines.filter(line => !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*'));
    
    return summaryLines.length > 0 ? summaryLines.join(' ') : null;
  } catch (error) {
    console.warn('解析内容摘要失败:', error);
    return null;
  }
});

// 格式化内容
const formatContent = (content: string): string => {
  if (!content || typeof content !== 'string') return '';
  return content.trim();
};

// 获取列表项目符号
const getListBullet = (): string => {
  const bulletMap: Record<string, string> = {
    overall: '🌟',
    details: '📝',
    advice: '💡',
    prediction: '🔮',
    action: '🎯',
    other: '📋'
  };
  return bulletMap[props.type] || '•';
};

// 获取详情项目符号
const getDetailBullet = (): string => {
  const bulletMap: Record<string, string> = {
    overall: '✨',
    details: '📖',
    advice: '💭',
    prediction: '🔮',
    action: '⚡',
    other: '📌'
  };
  return bulletMap[props.type] || '•';
};
</script>

<style scoped>
.analysis-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.analysis-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 卡片类型样式 */
.analysis-card-overall {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
}

.analysis-card-details {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.analysis-card-advice {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.analysis-card-prediction {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.analysis-card-action {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
}

.analysis-card-other {
  border-color: #6b7280;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.header-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-decoration {
  display: flex;
  align-items: center;
}

.decoration-dots {
  display: flex;
  gap: 0.25rem;
}

.decoration-dots span {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: #d1d5db;
  opacity: 0.6;
}

/* 卡片内容 */
.card-body {
  padding: 1.5rem;
}

.text-content {
  line-height: 1.7;
}

.content-text {
  color: #374151;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.7;
}

.list-content {
  line-height: 1.6;
}

.content-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.content-list li {
  margin-bottom: 0.75rem;
}

.list-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.list-bullet {
  font-size: 0.875rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.list-text {
  color: #374151;
  font-size: 0.95rem;
  line-height: 1.6;
}

.mixed-content {
  margin-bottom: 1rem;
}

.content-summary {
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.summary-text {
  color: #374151;
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
}

.content-details {
  padding-top: 0.5rem;
}

.details-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.details-list li {
  margin-bottom: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.detail-bullet {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.detail-text {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* 卡片底部 */
.card-footer {
  padding: 0 1.5rem 1.25rem;
}

.footer-decoration {
  display: flex;
  justify-content: center;
}

.decoration-line {
  width: 3rem;
  height: 0.125rem;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
  border-radius: 0.0625rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-header {
    padding: 1rem 1.25rem 0.75rem;
  }
  
  .header-title {
    font-size: 1rem;
  }
  
  .card-body {
    padding: 1.25rem;
  }
  
  .content-text,
  .list-text,
  .summary-text {
    font-size: 0.9rem;
  }
  
  .detail-text {
    font-size: 0.8rem;
  }
}

/* 动画效果 */
.analysis-card {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 悬停效果增强 */
.analysis-card:hover .header-icon {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.analysis-card:hover .decoration-dots span {
  background: #8b5cf6;
  opacity: 0.8;
  transition: all 0.2s ease;
}
</style> 
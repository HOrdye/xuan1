<template>
  <div class="hexagram-display" :class="{ 'is-loading': isLoading, 'is-empty': !hexagram, 'debug-mode': debug }">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="hexagram-loading">
      <div class="ink-drop-loading">
        <div class="ink-drop"></div>
        <div class="ink-ripple"></div>
      </div>
      <p class="loading-text">卦象渐现中...</p>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="!hexagram" class="hexagram-empty">
      <div class="empty-icon">?</div>
      <p class="empty-text">{{ emptyText }}</p>
    </div>
    
    <!-- 卦象展示 -->
    <div v-else class="hexagram-content">
      <!-- 卦象图像与水墨效果 -->
      <div class="hexagram-ink-container" :style="{ color: themeColor }">
        <!-- 水墨背景 -->
        <div class="ink-background">
          <div class="ink-splash animate-splash"></div>
          <div class="ink-pool animate-pool"></div>
        </div>
        
        <!-- 卦象图像 -->
        <div v-if="computedImageUrl" class="hexagram-image-wrapper animate-ink-reveal">
          <img 
            :src="computedImageUrl" 
            :alt="`卦象 ${hexagram?.sequence || ''}` || '卦象'" 
            @error="handleImageError" 
            style="background: transparent; max-width: 120px; max-height: 150px;" 
          />
          <!-- 调试信息，仅在debug=true时显示 -->
          <div v-if="debug" class="image-debug-info">
            <p>图像路径: {{ computedImageUrl }}</p>
            <p>加载状态: {{ imageLoadError ? '失败' : '尝试加载中' }}</p>
          </div>
        </div>
        
        <!-- 爻线动态展示 -->
        <div v-else class="hexagram-lines-container">
          <!-- 基本卦象显示 - 无动画 -->
          <div class="static-hexagram">
            <div 
              v-for="(line, index) in hexagramLines" 
              :key="`line-${index}`" 
              class="hexagram-line-static"
              :class="{ 
                'yang-line': line === 1, 
                'yin-line': line === 0,
                'changing-line': changingLines?.includes(5 - index),
                'highlighted': highlightedLine === 5 - index
              }"
              @mouseenter="onLineHover(5 - index)"
              @mouseleave="onLineHover(null)"
            >
              <div v-if="line === 1" class="line-content full-line"></div>
              <template v-else>
                <div class="line-content half-line left-line"></div>
                <div class="line-content half-line right-line"></div>
              </template>
              
              <!-- 爻辞弹出 -->
              <div v-if="showYaoTexts && highlightedLine === 5 - index && hexagram.yao_texts && hexagram.yao_texts[5 - index]" class="yao-text-popup">
                <div class="ink-paper">
                  <div class="yao-text-content">
                    <h5 class="yao-title">{{ getYaoTitle(5 - index) }}</h5>
                    <p class="yao-text">{{ hexagram.yao_texts[5 - index] }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 调试信息 -->
          <div v-if="debug" class="debug-info">
            <span>Key: {{ hexagramKey }}</span>
            <span>Animated: {{ isAnimated }}</span>
          </div>
        </div>
      </div>
      
    <!-- 卦象信息 -->
    <div class="hexagram-info" :class="[`animate-ink-flow-${hexagramKey}`]">
      <template v-if="isValidHexagram">
        <h3 class="hexagram-name">{{ formatHexagramName(hexagram.name) }}卦</h3>
        <div class="hexagram-meta">
          <span class="meta-item">{{ hexagram.nature ?? '' }}</span>
          <span v-if="hexagram.element" class="meta-item">{{ hexagram.element }}属性</span>
          <span class="meta-item">第{{ hexagram.sequence ?? '' }}卦</span>
        </div>
      </template>
      <template v-else>
        <h3 class="hexagram-name">卦象数据加载失败</h3>
        <div class="hexagram-meta">
          <span class="meta-item">请检查数据源</span>
        </div>
      </template>
        
        <!-- 卦辞 -->
        <div v-if="showDescription" class="hexagram-description">
          <h4 class="description-title">卦辞</h4>
          <p class="description-text">{{ formatDescription(hexagram.judgment || hexagram.description || hexagram.meaning || '无卦辞') }}</p>
        </div>

        <!-- 象辞（使用image字段） -->
        <div v-if="showXiangText && hexagram.image" class="hexagram-xiang">
          <h4 class="xiang-title">象辞</h4>
          <p class="xiang-text">{{ formatDescription(hexagram.image) }}</p>
        </div>
        
        <!-- 卦象解读 -->
        <div v-if="showOverall" class="hexagram-overall">
          <h4 class="overall-title">解读</h4>
          <p class="overall-text">{{ formatDescription(hexagram.overall || hexagram.modernInterpretation || '暂无解读内容') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick } from 'vue';
import type { Hexagram } from '../../features/dilemma/types';

// 定义组件属性
interface Props {
  hexagram?: Hexagram | null; // 卦象数据
  imageUrl?: string;          // 自定义图像URL
  isLoading?: boolean;        // 加载状态
  emptyText?: string;         // 空状态文本
  showDescription?: boolean;  // 是否显示卦辞
  showTuanText?: boolean;     // 是否显示彖辞
  showXiangText?: boolean;    // 是否显示象辞
  showOverall?: boolean;      // 是否显示解读
  showYaoTexts?: boolean;     // 是否显示爻辞
  changingLines?: number[];   // 变爻位置
  themeColor?: string;        // 主题颜色
  debug?: boolean;            // 调试模式
}

// 设置默认值
const props = withDefaults(defineProps<Props>(), {
  hexagram: null,
  imageUrl: '',
  isLoading: false,
  emptyText: '暂无卦象数据',
  showDescription: true,
  showTuanText: true,
  showXiangText: true,
  showOverall: true,
  showYaoTexts: true,
  changingLines: () => [],
  themeColor: 'currentColor',
  debug: false,
});

// 当前高亮的爻线
const highlightedLine = ref<number | null>(null);
// 用于强制刷新动画的标识符
const hexagramKey = ref(Date.now());
// 是否已经执行了动画
const isAnimated = ref(false);
// 图像加载失败标志
const imageLoadError = ref(false);
// 图像路径尝试顺序
const imagePaths = ref<string[]>([]);
// 当前尝试的图像路径索引
const currentPathIndex = ref(0);

// 安全获取hexagram.lines，如果不存在则返回默认值
const hexagramLines = computed(() => {
  if (props.hexagram && Array.isArray(props.hexagram.lines)) {
    return props.hexagram.lines;
  }
  return [0, 0, 0, 0, 0, 0]; // 默认六爻全阴
});

// 检查卦象数据是否有效
const isValidHexagram = computed(() => {
  return props.hexagram && 
         props.hexagram.sequence && 
         props.hexagram.name && 
         Array.isArray(props.hexagram.lines);
});

// 计算图像URL，处理可能的错误情况
  const computedImageUrl = computed(() => {
    if (imageLoadError.value) return null;
    
    if (props.hexagram?.sequence) {
      return `/static/hexagrams/${props.hexagram.sequence}.svg`;
    }
    
    return null;
  });

// 处理图像加载错误 - 简化逻辑
const handleImageError = () => {
  imageLoadError.value = true;
};

// 鼠标悬停在爻线上
const onLineHover = (lineIndex: number | null) => {
  highlightedLine.value = lineIndex;
};

// 获取爻位标题
const getYaoTitle = (lineIndex: number): string => {
  const positions = ['初', '二', '三', '四', '五', '上'];
  // const types = ['六', '九']; // 未使用，注释掉
  
  if (lineIndex < 0 || lineIndex >= 6) return '';
  
  const position = positions[lineIndex];
  const lineType = hexagramLines.value[5 - lineIndex] === 1 ? '九' : '六';
  
  return `${position}${lineType}`;
};

// 重置动画状态
const resetAnimation = () => {
  isAnimated.value = false;
  hexagramKey.value = Date.now();
  imageLoadError.value = false; // 重置图像错误状态
  
  // 在下一帧中标记动画完成
  requestAnimationFrame(() => {
    setTimeout(() => {
      isAnimated.value = true;
      if (props.debug) {
        console.log('动画状态已重置，新key:', hexagramKey.value);
      }
    }, 100);
  });
};

// 监听卦象变化
watch(() => props.hexagram, (newHexagram) => {
  highlightedLine.value = null;
  
  if (newHexagram) {
    resetAnimation();
    if (props.debug) {
      console.log('卦象已更新:', newHexagram.name, '动画将被重置');
    }
  }
});

// 监听imageUrl变化
watch(() => props.imageUrl, () => {
  imageLoadError.value = false; // 重置图像错误状态
});


// 组件挂载时初始化
onMounted(() => {
  resetAnimation();
  if (props.debug) {
    console.log('组件已挂载，初始化动画状态');
    // 由于已简化图像加载逻辑，不再需要扫描多个路径
    console.log('【DEBUG】使用统一路径加载卦象图像');
  }
});

// 格式化卦象名称，移除英文内容
const formatHexagramName = (name: string | undefined): string => {
  if (!name) return '';
  
  // 移除英文括号及其内容，例如"震 (The Arousing Thunder)"变为"震"
  let formattedName = name.replace(/\s*\([^)]*\)/g, '');
  
  // 处理"Hexagram X"格式
  if (formattedName.includes('Hexagram')) {
    const num = formattedName.match(/\d+/);
    return num ? `第${num[0]}` : '';
  }
  
  // 处理纯英文名称的情况
  if (!/[一-龠]/.test(formattedName)) {
    return '';
  }
  
  return formattedName;
};

// 格式化描述文本，清理英文内容
const formatDescription = (text: string): string => {
  if (!text) return '';
  
  // 移除英文括号及其内容
  return text.replace(/\s*\([^)]*\)/g, '');
};
</script>

<style scoped>
.hexagram-display {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 280px;
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
}

/* 调试模式 */
.debug-mode {
  border: 2px dashed red;
  position: relative;
}

.debug-mode::before {
  content: 'DEBUG MODE';
  position: absolute;
  top: 0;
  right: 0;
  background: red;
  color: white;
  font-size: 10px;
  padding: 2px 4px;
}

.debug-info {
  position: absolute;
  left: 100%;
  margin-left: 10px;
  font-size: 10px;
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 4px;
  border-radius: 2px;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
}

/* 加载状态 */
.hexagram-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
}

.ink-drop-loading {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
}

.ink-drop {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background-color: var(--primary, #4C7EF3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  animation: ink-drop 2s infinite;
}

.ink-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: transparent;
  border: 2px solid var(--primary, #4C7EF3);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 1;
  animation: ink-ripple 2s infinite;
}

@keyframes ink-drop {
  0% { 
    opacity: 1; 
    transform: translate(-50%, -50%) scale(1);
  }
  20% { 
    opacity: 0.8; 
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% { 
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.2);
  }
}

@keyframes ink-ripple {
  0% { 
    width: 0px;
    height: 0px;
    opacity: 1;
    transform: translate(-50%, -50%) scale(0);
  }
  100% { 
    width: 80px;
    height: 80px;
    opacity: 0;
    transform: translate(-50%, -50%) scale(1);
  }
}

.loading-text,
.empty-text {
  color: #94a3b8;
  font-size: 0.875rem;
}

/* 空状态 */
.hexagram-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
}

.empty-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #cbd5e1;
  border-radius: 50%;
  color: #94a3b8;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

/* 卦象内容布局 */
.hexagram-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .hexagram-content {
    flex-direction: row;
    align-items: flex-start;
  }
  
  .hexagram-ink-container {
    flex: 0 0 200px;
    height: 250px;
  }
  
  .hexagram-info {
    flex: 1;
  }
}

/* 水墨与卦象容器 */
.hexagram-ink-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  margin: 0 auto;
  overflow: visible;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
}

.ink-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
  background-color: #fcfaf7; /* 米白色背景模拟宣纸 */
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.01) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.01) 1px, transparent 1px);
  background-size: 20px 20px;
}

.ink-splash {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(
    circle,
    rgba(0, 0, 0, 0.08) 0%,
    rgba(0, 0, 0, 0.05) 30%,
    rgba(0, 0, 0, 0.02) 70%,
    transparent 100%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
}

.animate-splash {
  animation: ink-splash 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes ink-splash {
  0% {
    width: 0;
    height: 0;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  40% {
    opacity: 0.2;
    transform: translate(-50%, -50%) scale(1);
  }
  70% {
    width: 150%;
    height: 150%;
    opacity: 0.15;
  }
  100% {
    width: 120%;
    height: 120%;
    opacity: 0.07;
    transform: translate(-50%, -50%) scale(0.95);
  }
}

.ink-pool {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  background: radial-gradient(
    circle, 
    rgba(0, 0, 0, 0.3) 0%, 
    rgba(0, 0, 0, 0.1) 40%, 
    rgba(0, 0, 0, 0.05) 70%, 
    transparent 100%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
}

.animate-pool {
  animation: ink-pool 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards;
}

@keyframes ink-pool {
  0% {
    width: 5px;
    height: 5px;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  30% {
    opacity: 0.9;
    transform: translate(-50%, -50%) scale(1.1);
  }
  60% {
    opacity: 0.5;
  }
  100% {
    width: 80px;
    height: 80px;
    opacity: 0.15;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* 卦象图像 */
.hexagram-image-wrapper {
  position: relative;
  z-index: 5;
  opacity: 1;  /* 立即显示，不等动画 */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.animate-ink-reveal {
  animation: none; /* 移除动画，避免干扰显示 */
}

@keyframes ink-reveal {
  0% {
    opacity: 0;
    filter: blur(5px);
  }
  100% {
    opacity: 1;
    filter: blur(0);
  }
}

.hexagram-image-wrapper img {
  max-width: 120px;
  max-height: 150px;
  height: auto;
  background-color: transparent;
  object-fit: contain;
}

/* 添加调试信息样式 */
.image-debug-info {
  margin-top: 8px;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
  font-size: 9px;
  font-family: monospace;
  color: #fff;
  word-break: break-all;
}

.image-debug-info p {
  margin: 2px 0;
}

/* 爻线容器 */
.hexagram-lines-container {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 150px;
}

.ink-animation-container {
  display: none; /* 彻底隐藏 */
}

/* 爻线静态展示（作为备用显示） */
.hexagram-lines-container .static-hexagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: center;
  gap: 10px;
}

.yao-line-container {
  display: none; /* 彻底隐藏 */
}

.hexagram-line-static {
  position: relative;
  width: 120px;
  height: 20px;
  margin: 5px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.line-content {
  height: 100%;
  background-color: black;
}

.full-line {
  width: 120px;
}

.half-line {
  width: 45%;
}

.left-line {
  margin-right: 10px;
}

.right-line {
  margin-left: 10px;
}

/* 爻辞弹出框 */
.yao-text-popup {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: fade-in 0.3s ease-out forwards;
}

.ink-paper {
  background-color: #f8f9fa;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.7) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.7) 1px, transparent 1px),
    linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
  background-size: 20px 20px, 20px 20px, 4px 4px, 4px 4px;
  border-radius: 6px;
  padding: 2px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transform: rotate(-1deg);
  height: 100%;
}

.yao-text-content {
  background-color: white;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.01) 0%, transparent 20%, transparent 80%, rgba(0, 0, 0, 0.01) 100%);
  border-radius: 4px;
  padding: 10px 12px;
  border-left: 2px solid var(--primary, #4C7EF3);
  height: 100%;
  overflow: auto;
}

/* 卦象信息 */
.hexagram-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  opacity: 0;
  position: relative;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow: hidden;
}

/* 信息区域背景水墨效果 */
.hexagram-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.02) 0%,
    rgba(0, 0, 0, 0.01) 70%,
    rgba(0, 0, 0, 0) 100%
  );
  z-index: -1;
  border-radius: 0.5rem 0.5rem 0 0;
}

/* 动态生成的特定动画类 */
[class*="animate-ink-flow-"] {
  animation-name: ink-flow;
  animation-duration: 1.2s;
  animation-timing-function: ease-out;
  animation-delay: 1.2s;
  animation-fill-mode: forwards;
  will-change: opacity, transform, filter;
}

[class*="animate-ink-flow-"]::before {
  animation: ink-seep 1.8s ease-out 1.5s forwards;
}

@keyframes ink-flow {
  0% {
    opacity: 0;
    transform: translateY(15px);
    filter: blur(3px);
  }
  40% {
    opacity: 0.7;
    filter: blur(2px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes ink-seep {
  0% {
    height: 0;
    opacity: 0;
  }
  100% {
    height: 100%;
    opacity: 1;
  }
}

.hexagram-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.hexagram-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #64748b;
}

.meta-item {
  padding: 0.25rem 0.5rem;
  background-color: #f1f5f9;
  border-radius: 0.25rem;
}

.hexagram-description,
.hexagram-overall {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
  animation: ink-text 1s ease-out;
  animation-fill-mode: both;
}

.hexagram-description {
  animation-delay: 1.6s;
}

.hexagram-overall {
  animation-delay: 1.9s;
}

.description-title,
.overall-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin: 0 0 0.5rem 0;
}

.description-text,
.overall-text {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #334155;
  margin: 0;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* 水墨晕染动画效果 */
.ink-drop-point {
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: currentColor;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  z-index: 2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

[class*="animate-ink-drop-"] {
  animation-name: ink-drop;
  animation-duration: 0.4s;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
}

@keyframes ink-drop {
  0% {
    opacity: 0;
    width: 0;
    height: 0;
    box-shadow: 0 0 0px rgba(0, 0, 0, 0);
  }
  40% {
    opacity: 0.9;
    width: 8px;
    height: 8px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }
  100% {
    opacity: 0;
    width: 10px;
    height: 10px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  }
}

.ink-spread-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

.ink-spread {
  position: relative;
  height: 100%;
  background-color: currentColor;
  border-radius: 4px;
  transform-origin: center;
  opacity: 0;
  filter: blur(3px);
  box-shadow: 0 0 3px currentColor;
}

.ink-spread::before,
.ink-spread::after {
  content: '';
  position: absolute;
  top: -1px;
  bottom: -1px;
  width: 0;
  background-color: currentColor;
  opacity: 0.3;
  border-radius: 4px;
  filter: blur(1px);
}

.ink-spread::before {
  left: -2px;
}

.ink-spread::after {
  right: -2px;
}

.yang-spread {
  width: 0%;
  flex-grow: 1;
}

.yin-spread {
  width: 0%;
}

.yin-left {
  margin-right: auto;
}

.yin-right {
  margin-left: auto;
}

[class*="animate-ink-spread-"] {
  animation-name: ink-spread;
  animation-duration: 1.2s;
  animation-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  animation-fill-mode: forwards;
  will-change: width, opacity, filter;
}

[class*="animate-ink-spread-"]::before {
  animation: ink-bleed 1.5s ease-out 0.1s forwards;
}

[class*="animate-ink-spread-"]::after {
  animation: ink-bleed 1.5s ease-out 0.2s forwards;
}

@keyframes ink-spread {
  0% {
    opacity: 0;
    width: 0%;
    filter: blur(5px);
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
  }
  20% {
    opacity: 0.4;
    filter: blur(4px);
    box-shadow: 0 0 4px currentColor;
  }
  40% {
    opacity: 0.7;
    filter: blur(2px);
  }
  70% {
    width: var(--target-width, 100%);
    filter: blur(1px);
    box-shadow: 0 0 2px currentColor;
  }
  100% {
    opacity: 0.9;
    width: var(--target-width, 100%);
    filter: blur(0.5px);
    box-shadow: 0 0 1px currentColor;
  }
}

@keyframes ink-bleed {
  0% {
    width: 0;
    opacity: 0;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    width: 5px;
    opacity: 0.1;
  }
}

.yang-line .yang-spread {
  --target-width: 100%;
}

.yin-line .yin-left {
  --target-width: 45%;
}

.yin-line .yin-right {
  --target-width: 45%;
}

.yao-title {
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: var(--primary, #4C7EF3);
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
}

.yao-text {
  font-size: 0.8rem;
  line-height: 1.5;
  margin: 0;
  color: #334155;
  position: relative;
}

.yao-text::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.1) 20%, rgba(0, 0, 0, 0.1) 80%, transparent);
}

@keyframes ink-text {
  0% {
    opacity: 0;
    transform: translateY(5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 水墨动画容器 */
.ink-animation-container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 20; /* 确保在最上层 */
}

/* 中心墨池 */
.ink-pool {
  display: none; /* 彻底隐藏 */
}

/* 爻线容器 */
.yao-line-container {
  display: none; /* 彻底隐藏 */
}

/* 基础墨线样式 */
.ink-line {
  display: none; /* 彻底隐藏 */
}

/* 墨点中心 */
.ink-drop-center {
  display: none; /* 彻底隐藏 */
}

/* 墨迹扩散 - 左侧 */
.ink-spread-left {
  display: none; /* 彻底隐藏 */
}

/* 墨迹扩散 - 右侧 */
.ink-spread-right {
  display: none; /* 彻底隐藏 */
}

/* 阴爻中间的间隙 */
.ink-spread-gap {
  display: none; /* 彻底隐藏 */
}

/* 变爻特效 */
.changing-line {
  position: relative;
}

.changing-line::after {
  content: '';
  position: absolute;
  top: -2px;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(
    to right,
    transparent, 
    rgba(255, 255, 255, 0.3),
    transparent
  );
  opacity: 0;
  animation: shimmer 2s ease-in-out infinite;
  pointer-events: none;
}

.highlighted {
  z-index: 10;
}

.highlighted::before {
  content: '';
  position: absolute;
  left: -10px;
  right: -10px;
  top: -10px;
  bottom: -10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  z-index: -1;
}

@keyframes shimmer {
  0% { opacity: 0; left: -100%; }
  50% { opacity: 0.5; }
  100% { opacity: 0; left: 100%; }
}

/* 彖辞样式 */
.hexagram-tuan {
  margin-top: 1rem;
  padding: 0.5rem 0;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

.tuan-title {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #444;
  font-weight: 600;
}

.tuan-text {
  font-size: 0.85rem;
  line-height: 1.5;
  color: #555;
  text-align: justify;
}

/* 象辞样式 */
.hexagram-xiang {
  margin-top: 1rem;
  padding: 0.5rem 0;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

.xiang-title {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #444;
  font-weight: 600;
}

.xiang-text {
  font-size: 0.85rem;
  line-height: 1.5;
  color: #555;
  text-align: justify;
}
</style>

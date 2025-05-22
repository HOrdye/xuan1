<template>
  <div v-if="hexagram" class="debug-panel">
    <div class="debug-header">调试面板</div>
    <div class="debug-content">
      <div class="debug-row">
        <span class="debug-label">卦象名称:</span>
        <span class="debug-value">{{ hexagram.name || '未知' }}</span>
      </div>
      <div class="debug-row">
        <span class="debug-label">卦序号:</span>
        <span class="debug-value">{{ hexagram.sequence || '未知' }}</span>
      </div>
      <div class="debug-row">
        <span class="debug-label">卦爻数据:</span>
        <span class="debug-value">{{ hexagram.lines ? hexagram.lines.join('') : '未知' }}</span>
      </div>
      <div class="debug-row">
        <span class="debug-label">图像状态:</span>
        <span class="debug-value" :class="{ 'debug-error': imageError }">
          {{ imageLoaded ? '加载成功' : (imageError ? '加载失败' : '加载中') }}
        </span>
      </div>
      <div class="debug-row">
        <span class="debug-label">图像路径:</span>
        <span class="debug-value">{{ currentImageUrl || '无' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Hexagram } from '../../features/dilemma/types';

// 定义组件属性
interface Props {
  hexagram?: Hexagram | null;
  currentImageUrl?: string;
  imageLoaded?: boolean;
  imageError?: boolean;
}

// 设置默认值
const props = withDefaults(defineProps<Props>(), {
  hexagram: null,
  currentImageUrl: '',
  imageLoaded: false,
  imageError: false
});
</script>

<style scoped>
.debug-panel {
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #00ff00;
  font-family: monospace;
  font-size: 11px;
  padding: 5px;
  border-radius: 4px;
  z-index: 1000;
  width: 250px;
  pointer-events: none;
  opacity: 0.9;
}

.debug-header {
  font-weight: bold;
  padding: 2px 4px;
  background-color: rgba(255, 0, 0, 0.5);
  margin-bottom: 4px;
}

.debug-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.debug-row {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
}

.debug-label {
  font-weight: bold;
  color: #aaffaa;
}

.debug-value {
  font-family: 'Courier New', monospace;
  word-break: break-all;
  text-align: right;
  max-width: 60%;
}

.debug-error {
  color: #ff6666;
}
</style> 
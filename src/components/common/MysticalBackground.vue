<template>
  <div class="mystical-background">
    <!-- 基础渐变背景 -->
    <div class="base-gradient"></div>
    
    <!-- 动态光效 -->
    <div class="dynamic-lights">
      <div class="light-orb light-1"></div>
      <div class="light-orb light-2"></div>
      <div class="light-orb light-3"></div>
    </div>
    
    <!-- 卦象装饰 -->
    <div class="hexagram-decorations">
      <div class="hexagram-symbol hexagram-1">☰</div>
      <div class="hexagram-symbol hexagram-2">☷</div>
      <div class="hexagram-symbol hexagram-3">☳</div>
      <div class="hexagram-symbol hexagram-4">☶</div>
    </div>
    
    <!-- 太极图案 -->
    <div class="taiji-container">
      <div class="taiji-symbol">☯</div>
    </div>
    
    <!-- 星辰效果 -->
    <div class="stars-container">
      <div v-for="i in 20" :key="i" class="star" :style="getStarStyle(i)"></div>
    </div>
    
    <!-- 神秘符文 -->
    <div class="mystical-sigils">
      <div class="sigil sigil-1">⚛</div>
      <div class="sigil sigil-2">⚜</div>
      <div class="sigil sigil-3">⚝</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

// 生成星星的随机样式 - 使用固定种子确保一致性
const getStarStyle = (index) => {
  // 使用固定种子确保每次渲染结果一致
  const seed = index * 137.5; // 黄金角度
  const size = (Math.sin(seed) * 0.5 + 0.5) * 3 + 1;
  const x = (Math.sin(seed * 0.5) * 0.5 + 0.5) * 100;
  const y = (Math.cos(seed * 0.3) * 0.5 + 0.5) * 100;
  const delay = (Math.sin(seed * 0.7) * 0.5 + 0.5) * 3;
  const duration = (Math.cos(seed * 0.4) * 0.5 + 0.5) * 2 + 2;
  
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };
};

// 组件挂载时的初始化
onMounted(() => {
  // 可以在这里添加JavaScript增强效果
  console.log('Mystical background initialized');
});

// 组件卸载时的清理
onUnmounted(() => {
  // 清理任何定时器或事件监听器
});
</script>

<style scoped>
.mystical-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

/* 基础渐变背景 */
.base-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%),
    linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%);
}

/* 动态光效 */
.dynamic-lights {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.light-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
}

.light-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.light-2 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%);
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.light-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  bottom: 20%;
  left: 30%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) scale(1.1);
    opacity: 0.5;
  }
}

/* 卦象装饰 */
.hexagram-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hexagram-symbol {
  position: absolute;
  font-size: 2rem;
  color: rgba(255, 215, 0, 0.2);
  opacity: 0.3;
  animation: rotate 20s linear infinite;
}

.hexagram-1 {
  top: 15%;
  left: 5%;
  animation-delay: 0s;
}

.hexagram-2 {
  top: 25%;
  right: 10%;
  animation-delay: 5s;
}

.hexagram-3 {
  bottom: 30%;
  left: 8%;
  animation-delay: 10s;
}

.hexagram-4 {
  bottom: 20%;
  right: 5%;
  animation-delay: 15s;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 太极图案 */
.taiji-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  opacity: 0;
  animation: taiji-fade 8s ease-in-out infinite;
}

.taiji-symbol {
  font-size: 8rem;
  color: rgba(255, 255, 255, 0.1);
  animation: taiji-rotate 30s linear infinite;
}

@keyframes taiji-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes taiji-fade {
  0%, 100% {
    opacity: 0;
  }
  25%, 75% {
    opacity: 0.15;
  }
}

/* 星辰效果 */
.stars-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  animation: stars-fade 8s ease-in-out infinite;
  animation-delay: 4s;
}

.star {
  position: absolute;
  background: radial-gradient(circle, #ffffff 0%, rgba(255, 255, 255, 0.8) 40%, transparent 70%);
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes stars-fade {
  0%, 100% {
    opacity: 0;
  }
  25%, 75% {
    opacity: 0.8;
  }
}

/* 神秘符文 */
.mystical-sigils {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.sigil {
  position: absolute;
  font-size: 1.5rem;
  color: rgba(255, 215, 0, 0.15);
  opacity: 0.4;
  animation: pulse 4s ease-in-out infinite;
}

.sigil-1 {
  top: 40%;
  left: 15%;
  animation-delay: 0s;
}

.sigil-2 {
  top: 70%;
  right: 20%;
  animation-delay: 1.5s;
}

.sigil-3 {
  bottom: 40%;
  left: 25%;
  animation-delay: 3s;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .light-orb {
    filter: blur(20px);
  }
  
  .light-1, .light-2, .light-3 {
    width: 150px;
    height: 150px;
  }
  
  .taiji-symbol {
    font-size: 4rem;
  }
  
  .hexagram-symbol {
    font-size: 1.5rem;
  }
  
  .sigil {
    font-size: 1rem;
  }
}

/* 性能优化 */
@media (prefers-reduced-motion: reduce) {
  .light-orb,
  .hexagram-symbol,
  .taiji-symbol,
  .star,
  .sigil {
    animation: none;
  }
  
  .taiji-container,
  .stars-container {
    animation: none;
    opacity: 0.3;
  }
}
</style> 
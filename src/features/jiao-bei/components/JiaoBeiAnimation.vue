<template>
  <div class="jiaobei-animation-container relative w-48 h-48">
    <!-- 关公虚影 - 增强版 -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="text-6xl text-red-500/20 animate-pulse filter blur-sm">关</div>
      <div class="absolute text-4xl text-red-400/15 animate-pulse delay-300">圣</div>
    </div>
    
    <!-- 环境光效 -->
    <div class="absolute inset-0 bg-gradient-radial from-purple-200/20 via-transparent to-transparent"></div>
    
    <!-- 地面阴影 - 增强版 -->
    <div ref="shadowRef" class="shadow absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-3 bg-gradient-to-r from-black/10 via-black/20 to-black/10 rounded-full blur-sm"></div>
    
    <!-- 粒子效果 -->
    <div v-if="isThrowing" class="particles absolute inset-0 pointer-events-none">
      <div v-for="i in 8" :key="i" class="particle" :style="{ '--delay': `${i * 0.1}s` }"></div>
    </div>
    
    <!-- 传统筊杯 - 真实形状 -->
    <div ref="cupRef" class="jiaobei absolute" :class="{ 'is-throwing': isThrowing }">
      <div class="jiaobei-pair">
        <!-- 第一个筊杯 -->
        <div class="jiaobei-cup jiaobei-cup-1">
          <svg width="60" height="30" viewBox="0 0 60 30" class="cup-svg">
            <defs>
              <!-- 渐变定义 -->
              <linearGradient id="cupGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#dc2626;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#b91c1c;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#991b1b;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="cupShadow1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#7f1d1d;stop-opacity:0.8" />
                <stop offset="100%" style="stop-color:#450a0a;stop-opacity:0.6" />
              </linearGradient>
              <!-- 内阴影效果 -->
              <filter id="innerShadow1">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
                <feOffset dx="0" dy="1" result="offsetblur"/>
                <feFlood flood-color="#000000" flood-opacity="0.3"/>
                <feComposite in2="offsetblur" operator="in"/>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <!-- 筊杯主体 - 月牙形 -->
            <path 
              d="M 5 15 Q 15 5, 30 5 Q 45 5, 55 15 Q 45 25, 30 25 Q 15 25, 5 15 Z" 
              fill="url(#cupGradient1)" 
              stroke="#991b1b" 
              stroke-width="1"
              filter="url(#innerShadow1)"
              class="cup-body"
            />
            <!-- 内部月牙 -->
            <path 
              d="M 10 15 Q 18 8, 30 8 Q 42 8, 50 15 Q 42 22, 30 22 Q 18 22, 10 15 Z" 
              fill="url(#cupShadow1)" 
              opacity="0.6"
              class="cup-inner"
            />
            <!-- 高光效果 -->
            <ellipse cx="20" cy="12" rx="8" ry="3" fill="rgba(255,255,255,0.4)" opacity="0.8" class="cup-highlight" />
          </svg>
        </div>
        
        <!-- 第二个筊杯 -->
        <div class="jiaobei-cup jiaobei-cup-2">
          <svg width="60" height="30" viewBox="0 0 60 30" class="cup-svg">
            <defs>
              <linearGradient id="cupGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#dc2626;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#b91c1c;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#991b1b;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="cupShadow2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#7f1d1d;stop-opacity:0.8" />
                <stop offset="100%" style="stop-color:#450a0a;stop-opacity:0.6" />
              </linearGradient>
              <filter id="innerShadow2">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
                <feOffset dx="0" dy="1" result="offsetblur"/>
                <feFlood flood-color="#000000" flood-opacity="0.3"/>
                <feComposite in2="offsetblur" operator="in"/>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <!-- 筊杯主体 - 月牙形 -->
            <path 
              d="M 5 15 Q 15 5, 30 5 Q 45 5, 55 15 Q 45 25, 30 25 Q 15 25, 5 15 Z" 
              fill="url(#cupGradient2)" 
              stroke="#991b1b" 
              stroke-width="1"
              filter="url(#innerShadow2)"
              class="cup-body"
            />
            <!-- 内部月牙 -->
            <path 
              d="M 10 15 Q 18 8, 30 8 Q 42 8, 50 15 Q 42 22, 30 22 Q 18 22, 10 15 Z" 
              fill="url(#cupShadow2)" 
              opacity="0.6"
              class="cup-inner"
            />
            <!-- 高光效果 -->
            <ellipse cx="20" cy="12" rx="8" ry="3" fill="rgba(255,255,255,0.4)" opacity="0.8" class="cup-highlight" />
          </svg>
        </div>
      </div>
    </div>
    
    <!-- 投掷声音效果 (暂时禁用) -->
    <!-- <audio ref="throwSoundRef" src="/sounds/throw.mp3" preload="auto"></audio> -->
    <!-- <audio ref="landSoundRef" src="/sounds/land.mp3" preload="auto"></audio> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
// @ts-ignore
import anime from 'animejs';

const props = defineProps<{
  isThrowing: boolean;
}>();

const emit = defineEmits<{
  (e: 'throw-complete', result: string): void;
}>();

const cupRef = ref<HTMLElement | null>(null);
const shadowRef = ref<HTMLElement | null>(null);
const throwSoundRef = ref<HTMLAudioElement | null>(null);
const landSoundRef = ref<HTMLAudioElement | null>(null);

let animation: anime.AnimeInstance | null = null;

// 计算随机结果
const getRandomResult = () => {
  // 筊杯结果：0=阴杯，1=圣杯，2=笑杯，3=立杯
  const rand = Math.random();
  
  // 立杯概率很低（5%）
  if (rand < 0.05) return 3; // 立杯 5%
  else if (rand < 0.45) return 1; // 圣杯 40%
  else if (rand < 0.75) return 2; // 笑杯 30%
  else return 0; // 阴杯 25%
};

// 初始化动画
onMounted(() => {
  if (cupRef.value && shadowRef.value) {
    // 设置初始位置
    anime.set(cupRef.value, {
      translateX: 0,
      translateY: 0,
      translateZ: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      opacity: 1
    });
    
    anime.set(shadowRef.value, {
      scale: 1,
      opacity: 0.2
    });
  }
});

// 监听投掷状态
watch(() => props.isThrowing, (newValue) => {
  if (newValue && cupRef.value && shadowRef.value) {
    // 停止现有动画
    if (animation) animation.pause();
    
    const result = getRandomResult();
    
    // 设置初始状态
    anime.set(cupRef.value, {
      translateX: 0,
      translateY: 0,
      opacity: 1,
      scale: 1
    });
    
    // 设置阴影初始状态
    anime.set(shadowRef.value, {
      scale: 1,
      opacity: 0.2
    });
    
    // 创建真实的筊杯投掷动画
    animation = anime.timeline({
      easing: 'easeOutQuad',
      complete: () => {
        // 动画完成后，发送结果
        setTimeout(() => {
          const resultText = result === 0 ? '阴杯' : result === 1 ? '圣杯' : result === 2 ? '笑杯' : '立杯';
          emit('throw-complete', resultText);
        }, 800);
      }
    })
    .add({
      targets: cupRef.value,
      translateX: anime.random(-60, 60),
      translateY: -120,
      rotateZ: anime.random(180, 360),
      rotateX: anime.random(90, 270),
      rotateY: anime.random(-120, 120),
      scale: [1, 0.8, 1.1],
      duration: 1000,
      easing: 'easeOutCubic',
    })
    .add({
      targets: cupRef.value,
      translateY: 0,
      rotateX: getResultRotationX(result),
      rotateY: getResultRotationY(result),
      rotateZ: getResultRotationZ(result),
      scale: 1,
      duration: 800,
      easing: 'easeInOutQuart',
    })
    .add({
      targets: cupRef.value,
      translateY: [
        { value: -10, duration: 150, easing: 'easeOutQuad' },
        { value: 0, duration: 150, easing: 'easeInQuad' }
      ],
      scale: [
        { value: 1.05, duration: 150, easing: 'easeOutQuad' },
        { value: 1, duration: 150, easing: 'easeInQuad' }
      ],
      duration: 300,
    });
    
    // 阴影动画
    anime.timeline()
      .add({
        targets: shadowRef.value,
        scale: [1, 0.3, 1.2, 1],
        opacity: [0.2, 0.1, 0.3, 0.2],
        duration: 1800,
        easing: 'easeInOutQuad',
      });
  }
});

// 根据结果获取旋转角度
const getResultRotationX = (result: number) => {
  switch (result) {
    case 0: return 180; // 阴杯：两个凸面朝上
    case 1: return 0;   // 圣杯：一平一凸
    case 2: return 0;   // 笑杯：两个平面朝上
    case 3: return 45;  // 立杯：倾斜站立
    default: return 0;
  }
};

const getResultRotationY = (result: number) => {
  switch (result) {
    case 0: return 0;   // 阴杯：正常摆放
    case 1: return 15;  // 圣杯：稍微倾斜
    case 2: return 0;   // 笑杯：正常摆放
    case 3: return 0;   // 立杯：不旋转
    default: return 0;
  }
};

const getResultRotationZ = (result: number) => {
  switch (result) {
    case 0: return 0;   // 阴杯：不旋转
    case 1: return 10;  // 圣杯：稍微旋转
    case 2: return 0;   // 笑杯：不旋转
    case 3: return 0;   // 立杯：不旋转
    default: return 0;
  }
};
</script>

<style scoped>
.jiaobei-animation-container {
  perspective: 1200px;
  transform-style: preserve-3d;
}

.jiaobei {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  will-change: transform;
}

.jiaobei.is-throwing {
  animation: enhanced-shake 0.6s ease-in-out infinite;
}

.jiaobei-pair {
  display: flex;
  gap: 8px;
  transform-style: preserve-3d;
}

.jiaobei-cup {
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.cup-svg {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.cup-body {
  transition: fill 0.3s ease;
}

.cup-inner {
  transition: fill 0.3s ease;
}

.cup-highlight {
  transition: opacity 0.3s ease;
}

.shadow {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
}

/* 增强的抖动动画 */
@keyframes enhanced-shake {
  0%, 100% { 
    transform: translate(-50%, -50%) rotate(0deg) scale(1); 
  }
  25% { 
    transform: translate(-50%, -50%) rotate(-2deg) scale(1.02); 
  }
  50% { 
    transform: translate(-50%, -50%) rotate(0deg) scale(0.98); 
  }
  75% { 
    transform: translate(-50%, -50%) rotate(2deg) scale(1.02); 
  }
}

/* 粒子效果 */
.particles {
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: linear-gradient(45deg, #dc2626, #b91c1c);
  border-radius: 50%;
  animation: particle-float 1.5s ease-out infinite;
  animation-delay: var(--delay);
  opacity: 0;
}

@keyframes particle-float {
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: translate(var(--x, 20px), var(--y, -40px)) scale(1);
    opacity: 0;
  }
}

/* 径向渐变背景 */
.bg-gradient-radial {
  background: radial-gradient(circle at center, var(--tw-gradient-stops));
}

/* 结果特定样式 */
.jiaobei[data-result="阴杯"] .jiaobei-cup {
  transform: rotateX(180deg);
}

.jiaobei[data-result="圣杯"] .jiaobei-cup-1 {
  transform: rotateX(0deg);
}

.jiaobei[data-result="圣杯"] .jiaobei-cup-2 {
  transform: rotateX(180deg);
}

.jiaobei[data-result="笑杯"] .jiaobei-cup {
  transform: rotateX(0deg);
}

.jiaobei[data-result="立杯"] .jiaobei-cup {
  transform: rotateX(45deg) rotateY(15deg);
}

/* 性能优化 */
.jiaobei, .shadow, .particle, .jiaobei-cup {
  backface-visibility: hidden;
  transform-style: preserve-3d;
}
</style>
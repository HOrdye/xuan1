<template>
    <div class="jiaobei-animation-container relative w-40 h-40">
      <!-- 地面阴影 -->
      <div ref="shadowRef" class="shadow absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-black/20 rounded-full"></div>
      
      <!-- 两个笅杯 -->
      <div ref="cup1Ref" class="jiaobei absolute" :class="{ 'is-throwing': isThrowing }">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <g class="cup-group">
            <ellipse class="cup-top" cx="50" cy="30" rx="40" ry="16" fill="#fbbf24" stroke="#b45309" stroke-width="3" />
            <ellipse class="cup-bottom" cx="50" cy="30" rx="40" ry="16" fill="#b45309" opacity="0.7" />
            <text x="50" y="35" text-anchor="middle" dy=".1em" font-size="24" fill="#92400e">杯</text>
          </g>
        </svg>
      </div>
      
      <div ref="cup2Ref" class="jiaobei absolute" :class="{ 'is-throwing': isThrowing }">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <g class="cup-group">
            <ellipse class="cup-top" cx="50" cy="30" rx="40" ry="16" fill="#fbbf24" stroke="#b45309" stroke-width="3" />
            <ellipse class="cup-bottom" cx="50" cy="30" rx="40" ry="16" fill="#b45309" opacity="0.7" />
            <text x="50" y="35" text-anchor="middle" dy=".1em" font-size="24" fill="#92400e">杯</text>
          </g>
        </svg>
      </div>
      
      <!-- 投掷声音效果 -->
      <audio ref="throwSoundRef" src="/sounds/throw.mp3" preload="auto"></audio>
      <audio ref="landSoundRef" src="/sounds/land.mp3" preload="auto"></audio>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import anime from 'animejs';
  
  const props = defineProps<{
    isThrowing: boolean;
  }>();
  
  const emit = defineEmits<{
    (e: 'animationComplete'): void;
  }>();
  
  const cup1Ref = ref<HTMLElement | null>(null);
  const cup2Ref = ref<HTMLElement | null>(null);
  const shadowRef = ref<HTMLElement | null>(null);
  const throwSoundRef = ref<HTMLAudioElement | null>(null);
  const landSoundRef = ref<HTMLAudioElement | null>(null);
  
  let animation1: anime.AnimeInstance | null = null;
  let animation2: anime.AnimeInstance | null = null;
  
  // 计算随机结果
  const getRandomResult = () => {
    // 随机结果：0=反面朝上(阴杯)，1=正面朝上(圣杯)
    return {
      cup1: Math.random() > 0.5 ? 1 : 0,
      cup2: Math.random() > 0.5 ? 1 : 0
    };
  };
  
  // 初始化动画
  onMounted(() => {
    if (cup1Ref.value && cup2Ref.value && shadowRef.value) {
      // 设置初始位置
      anime.set([cup1Ref.value, cup2Ref.value], {
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 1
      });
      
      anime.set(shadowRef.value, {
        scale: 1,
        opacity: 0.2
      });
    }
  });
  
  // 监听投掷状态
  watch(() => props.isThrowing, (newValue) => {
    if (newValue && cup1Ref.value && cup2Ref.value && shadowRef.value) {
      // 停止现有动画
      if (animation1) animation1.pause();
      if (animation2) animation2.pause();
      
      // 播放投掷音效
      if (throwSoundRef.value) {
        throwSoundRef.value.currentTime = 0;
        throwSoundRef.value.play().catch(() => {
          // 处理自动播放策略限制
          console.log('Audio playback was prevented by the browser');
        });
      }
      
      const result = getRandomResult();
      
      // 设置初始状态
      anime.set([cup1Ref.value, cup2Ref.value], {
        translateX: 0,
        translateY: 0,
        opacity: 1
      });
      
      // 设置阴影初始状态
      anime.set(shadowRef.value, {
        scale: 1,
        opacity: 0.2
      });
      
      // 创建第一个杯子的投掷动画
      animation1 = anime.timeline({
        easing: 'easeOutQuad',
        complete: () => {
          // 第一个杯子落地时播放音效
          if (landSoundRef.value) {
            landSoundRef.value.currentTime = 0;
            landSoundRef.value.play().catch(() => {
              console.log('Audio playback was prevented by the browser');
            });
          }
        }
      })
      .add({
        targets: cup1Ref.value,
        translateX: anime.random(-50, -20),
        translateY: -150,
        rotateZ: anime.random(180, 360),
        rotateX: anime.random(180, 360),
        rotateY: anime.random(-90, 90),
        scale: 0.9,
        duration: 800,
        easing: 'easeOutQuad',
      })
      .add({
        targets: cup1Ref.value,
        translateY: 0,
        rotateX: result.cup1 ? 0 : 180, // 根据结果决定朝上方向
        scale: 1,
        duration: 600,
        easing: 'easeInQuad',
      })
      .add({
        targets: cup1Ref.value,
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
      
      // 创建第二个杯子的投掷动画（稍微延迟，增加真实感）
      animation2 = anime.timeline({
        easing: 'easeOutQuad',
        delay: 150,
        complete: () => {
          // 完成后触发事件
          setTimeout(() => {
            emit('animationComplete');
          }, 300);
        }
      })
      .add({
        targets: cup2Ref.value,
        translateX: anime.random(20, 50),
        translateY: -120,
        rotateZ: anime.random(-360, -180),
        rotateX: anime.random(180, 360),
        rotateY: anime.random(-90, 90),
        scale: 0.9,
        duration: 800,
        easing: 'easeOutQuad',
      })
      .add({
        targets: cup2Ref.value,
        translateY: 0,
        rotateX: result.cup2 ? 0 : 180, // 根据结果决定朝上方向
        scale: 1,
        duration: 600,
        easing: 'easeInQuad',
      })
      .add({
        targets: cup2Ref.value,
        translateY: [
          { value: -5, duration: 150, easing: 'easeOutQuad' },
          { value: 0, duration: 150, easing: 'easeInQuad' }
        ],
        scale: [
          { value: 1.05, duration: 150, easing: 'easeOutQuad' },
          { value: 1, duration: 150, easing: 'easeInQuad' }
        ],
        duration: 300,
      });
      
      // 阴影动画
      anime({
        targets: shadowRef.value,
        scale: [
          { value: 0.8, duration: 400, easing: 'easeOutQuad' },
          { value: 1.2, duration: 400, easing: 'easeOutQuad' },
          { value: 1, duration: 400, easing: 'easeInOutQuad' },
        ],
        opacity: [
          { value: 0.1, duration: 400, easing: 'easeOutQuad' },
          { value: 0.3, duration: 400, easing: 'easeOutQuad' },
          { value: 0.2, duration: 400, easing: 'easeInOutQuad' },
        ],
        duration: 1200,
      });
    }
  });
  </script>
  
  <style scoped>
  .jiaobei-animation-container {
    perspective: 1000px;
    transform-style: preserve-3d;
  }
  
  .jiaobei {
    transform-style: preserve-3d;
    transition: transform 0.3s ease;
    will-change: transform;
  }
  
  .cup-group {
    transform-origin: center;
  }
  
  .cup-top {
    transform-origin: center;
  }
  
  .cup-bottom {
    transform-origin: center;
    transform: translateY(4px);
  }
  
  .shadow {
    transition: all 0.3s ease;
    will-change: transform, opacity;
  }
  </style>
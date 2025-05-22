<template>
  <div class="jiaobei-animation-container relative w-32 h-32">
    <div ref="jiaobeiRef" class="jiaobei absolute" :class="{ 'is-throwing': isThrowing }">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <ellipse cx="64" cy="64" rx="50" ry="20" fill="#fbbf24" stroke="#b45309" stroke-width="4" />
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="32" fill="#b45309">杯</text>
      </svg>
    </div>
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

const jiaobeiRef = ref<HTMLElement | null>(null);
let animation: anime.AnimeInstance | null = null;

// 初始化动画
onMounted(() => {
  if (jiaobeiRef.value) {
    // 设置初始位置
    anime.set(jiaobeiRef.value, {
      translateX: 0,
      translateY: 0,
      rotate: 0,
      scale: 1
    });
  }
});

// 监听投掷状态
watch(() => props.isThrowing, (newValue) => {
  if (newValue && jiaobeiRef.value) {
    // 停止现有动画
    if (animation) {
      animation.pause();
    }

    // 创建新的投掷动画
    animation = anime({
      targets: jiaobeiRef.value,
      translateX: [
        { value: 20, duration: 200, easing: 'easeOutQuad' },
        { value: -20, duration: 200, easing: 'easeInQuad' },
        { value: 0, duration: 200, easing: 'easeInOutQuad' }
      ],
      translateY: [
        { value: -40, duration: 300, easing: 'easeOutQuad' },
        { value: 0, duration: 500, easing: 'easeInBounce' }
      ],
      rotate: [
        { value: 360, duration: 800, easing: 'easeInOutQuad' }
      ],
      scale: [
        { value: 0.8, duration: 200, easing: 'easeOutQuad' },
        { value: 1.2, duration: 200, easing: 'easeInQuad' },
        { value: 1, duration: 200, easing: 'easeInOutQuad' }
      ],
      complete: () => {
        emit('animationComplete');
      }
    });
  }
});
</script>

<style scoped>
.jiaobei-animation-container {
  perspective: 1000px;
}

.jiaobei {
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.jiaobei.is-throwing {
  animation: throw 0.8s ease-in-out;
}

@keyframes throw {
  0% {
    transform: translateY(0) rotate(0);
  }
  50% {
    transform: translateY(-40px) rotate(180deg);
  }
  100% {
    transform: translateY(0) rotate(360deg);
  }
}
</style> 
<template>
  <div class="fortune-animation relative w-32 h-32 mx-auto">
    <!-- 能量波动动画 -->
    <div class="energy-waves absolute inset-0 pointer-events-none">
      <div v-for="i in 3" :key="i"
           class="wave absolute inset-0 rounded-full animate-wave"
           :style="{
             animationDelay: `${i * 0.5}s`,
             backgroundColor: color,
             opacity: 0.1
           }">
      </div>
    </div>
    
    <!-- 能量球 -->
    <div class="energy-orb relative w-full h-full cursor-pointer"
         :class="{ 'animate-unlock': isUnlocking }"
         @click="unlock">
      <div class="orb-inner absolute inset-0 rounded-full flex items-center justify-center"
           :style="{ backgroundColor: color }">
        <slot>
          <span class="text-4xl">{{ emoji }}</span>
        </slot>
      </div>
      
      <!-- 能量光晕 -->
      <div class="orb-glow absolute inset-0 rounded-full"
           :style="{ boxShadow: `0 0 30px ${color}` }">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  color?: string;
  emoji?: string;
}>();

const emit = defineEmits<{
  (e: 'unlock'): void;
}>();

const isUnlocking = ref(false);

const unlock = () => {
  if (isUnlocking.value) return;
  isUnlocking.value = true;
  setTimeout(() => {
    emit('unlock');
  }, 1000);
};
</script>

<style scoped>
.wave {
  animation: wave 2s infinite;
}

@keyframes wave {
  0% {
    transform: scale(0.8);
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.energy-orb {
  transition: transform 0.3s ease;
}

.energy-orb:hover {
  transform: scale(1.1);
}

.animate-unlock {
  animation: unlock 1s ease-in-out;
}

@keyframes unlock {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(0);
  }
}

.orb-inner {
  background: linear-gradient(45deg, var(--orb-color), var(--orb-color-light));
  transform-origin: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.95);
  }
}

.orb-glow {
  filter: blur(10px);
  opacity: 0.5;
  animation: glow 2s infinite;
}

@keyframes glow {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.3;
  }
}
</style> 
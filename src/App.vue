<template>
    <div class="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col">
      <header class="p-4 text-xl font-bold text-indigo-700 flex items-center justify-between">
        <span>天玄 Web</span>
        <span class="text-xs text-gray-400">你的专属玄学决策助手</span>
      </header>
      <main class="flex-1 p-4">
        <router-view />
      </main>
      <footer class="p-4 text-center text-gray-400 text-xs">© 2024 天玄 Web</footer>
      <GlobalLLMConfig />
    </div>
  </template>
  
  <script setup>
import { onMounted } from 'vue';
import anime from 'animejs';
import GlobalLLMConfig from './components/GlobalLLMConfig.vue';
import { useLLMConfigStore } from './store/llmConfig';

// 初始化全局LLM配置Store
const llmStore = useLLMConfigStore();

onMounted(async () => {
  // 启动动画
  anime({
    targets: 'header',
    translateY: [-40, 0],
    opacity: [0, 1],
    duration: 1200,
    easing: 'easeOutExpo',
  });
  
  // 初始化LLM配置
  await llmStore.initializeFromStorage();
  console.log('🚀 天玄Web应用启动完成，LLM配置已加载');
});
</script>
  
  <style scoped>
  header {
    letter-spacing: 0.1em;
  }
  </style>
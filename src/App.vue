<template>
    <div class="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col">
      <!-- 使用功能完整的导航栏组件 -->
      <AppNavbar />
      
      <main class="flex-1">
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
import AppNavbar from './components/AppNavbar.vue';
import { useLLMConfigStore } from './store/llmConfig';

// 初始化全局LLM配置Store
const llmStore = useLLMConfigStore();

onMounted(async () => {
  // 初始化LLM配置
  await llmStore.initializeFromStorage();
  console.log('🚀 天玄Web应用启动完成，LLM配置已加载');
});
</script>
  
  <style scoped>
  /* App级别的样式 */
  </style>
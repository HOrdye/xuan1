<template>
    <div class="min-h-screen flex flex-col">
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
import { useUserStore } from './store/userStore';
import { useZiweiStore } from './features/ziwei/store/ziweiStore';

// 初始化全局LLM配置Store
const llmStore = useLLMConfigStore();
const userStore = useUserStore();
const ziweiStore = useZiweiStore();

onMounted(async () => {
  // 初始化LLM配置
  await llmStore.initializeFromStorage();
  
  // 初始化用户状态
  await userStore.initialize();
  
  // 如果用户已登录且没有命盘数据，尝试从用户信息加载
  if (userStore.isAuthenticated && !ziweiStore.currentChart) {
    try {
      await ziweiStore.loadChartFromUser();
    } catch (error) {
      console.warn('⚠️ 加载命盘数据失败（不影响使用）:', error);
    }
  }
  
  console.log('🚀 天玄Web应用启动完成，LLM配置和用户数据已加载');
});
</script>
  
  <style scoped>
  /* App级别的样式 */
  </style>
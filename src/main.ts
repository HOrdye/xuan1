import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router';
import { SupabaseManager } from './core/services/supabaseClient';
import { useLLMConfigStore } from './store/llmConfig';

// 导入样式
import './assets/tailwind.css';
import './assets/global.css';

// 创建Pinia实例
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 创建Vue应用并挂载
const app = createApp(App);

// 注册Pinia和路由
app.use(pinia);
app.use(router);

// 调试信息
console.log('🌟 天玄Web应用启动中...');
console.log('📱 环境:', process.env.NODE_ENV || 'development');

// 初始化Supabase
SupabaseManager.initialize().catch(err => {
  console.warn('⚠️ Supabase初始化失败，使用本地模式:', err.message);
});

// 初始化LLM配置
const piniaInstance = pinia;
app.use(piniaInstance);
const llmStore = useLLMConfigStore(piniaInstance);
llmStore.initializeFromStorage().then(() => {
  console.log('🤖 LLM配置初始化完成');
}).catch(err => {
  console.warn('⚠️ LLM配置初始化失败:', err.message);
});

// 检查样式加载情况
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM加载完成');
  
  // 检查TailwindCSS样式是否生效
  const tailwindExists = getComputedStyle(document.documentElement)
    .getPropertyValue('--tw-ring-offset-width')
    .trim();
  console.log('Tailwind CSS 加载状态:', tailwindExists ? '成功' : '失败');
});

// 挂载应用
app.mount('#app');

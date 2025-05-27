import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router';

// 导入样式
import './assets/tailwind.css';

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
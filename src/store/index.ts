/**
 * Pinia 状态管理入口文件
 * 
 * 配置Pinia和持久化插件
 */

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// 创建 Pinia 实例
const pinia = createPinia();

// 使用持久化存储插件
pinia.use(piniaPluginPersistedstate);

export default pinia; 
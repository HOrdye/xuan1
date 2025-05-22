import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // 静态资源处理
  publicDir: 'public',
  // 确保静态资源正确服务
  server: {
    fs: {
      // 允许服务的目录
      allow: ['public', 'src'],
    },
  },
}) 
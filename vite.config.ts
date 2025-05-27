import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

console.log('🔧 Loading Vite config...')
console.log('📍 Current working directory:', process.cwd())
console.log('📍 Config file path:', __filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './'),
    },
  },
  server: {
    port: 5173,
    open: true,
    strictPort: false,
    host: true,
    fs: {
      allow: [
        path.resolve(__dirname, './src'),
        path.resolve(__dirname, './public'),
        path.resolve(__dirname, './node_modules'),
      ],
    },
    proxy: {
      '/api/qianwen': {
        target: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/qianwen/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 代理请求到通义千问:', proxyReq.path);
          });
        }
      },
      '/api/openai': {
        target: 'https://api.openai.com/v1/chat/completions',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openai/, ''),
      },
      '/api/deepseek': {
        target: 'https://api.deepseek.com/v1/chat/completions',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
      },
      '/api/claude': {
        target: 'https://api.anthropic.com/v1/messages',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/claude/, ''),
      }
    }
  },
  base: '/',
}) 

console.log('✅ Vite config loaded successfully') 
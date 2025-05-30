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
            if (req.headers['content-type']) {
              proxyReq.setHeader('Content-Type', req.headers['content-type']);
            }
            if (req.headers['authorization']) {
              proxyReq.setHeader('Authorization', req.headers['authorization']);
            }
          });
          proxy.on('error', (err, req, res) => {
            console.error('❌ 通义千问代理错误:', err);
          });
        }
      },
      '/api/openai': {
        target: 'https://api.openai.com/v1/chat/completions',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openai/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 代理请求到OpenAI:', proxyReq.path);
            if (req.headers['content-type']) {
              proxyReq.setHeader('Content-Type', req.headers['content-type']);
            }
            if (req.headers['authorization']) {
              proxyReq.setHeader('Authorization', req.headers['authorization']);
            }
          });
          proxy.on('error', (err, req, res) => {
            console.error('❌ OpenAI代理错误:', err);
          });
        }
      },
      '/api/deepseek': {
        target: 'https://api.deepseek.com/v1/chat/completions',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 代理请求到DeepSeek:', proxyReq.path);
            if (req.headers['content-type']) {
              proxyReq.setHeader('Content-Type', req.headers['content-type']);
            }
            if (req.headers['authorization']) {
              proxyReq.setHeader('Authorization', req.headers['authorization']);
            }
          });
          proxy.on('error', (err, req, res) => {
            console.error('❌ DeepSeek代理错误:', err);
          });
        }
      },
      '/api/claude': {
        target: 'https://api.anthropic.com/v1/messages',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/claude/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 代理请求到Claude:', proxyReq.path);
            if (req.headers['content-type']) {
              proxyReq.setHeader('Content-Type', req.headers['content-type']);
            }
            if (req.headers['authorization']) {
              proxyReq.setHeader('Authorization', req.headers['authorization']);
            }
            proxyReq.setHeader('anthropic-version', '2023-06-01');
          });
          proxy.on('error', (err, req, res) => {
            console.error('❌ Claude代理错误:', err);
          });
        }
      }
    }
  },
  base: '/',
}) 

console.log('✅ Vite config loaded successfully') 
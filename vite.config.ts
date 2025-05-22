import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

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
    port: 4000,
    open: true,
    strictPort: false,
    fs: {
      allow: [
        path.resolve(__dirname, './src'),
        path.resolve(__dirname, './public'),
        path.resolve(__dirname, './node_modules'),
      ],
    },
  },
  base: '/',
}) 
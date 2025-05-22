/// <reference types="vite/client" />

interface ImportMetaEnv {
  BASE_URL: string
  // 可以添加更多环境变量类型
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
} 
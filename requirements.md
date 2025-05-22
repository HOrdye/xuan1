# 天玄Web项目依赖与安装指南

## 项目依赖

本项目基于Vue 3 + Vite + TypeScript开发，使用到的主要依赖包括：

### 核心依赖

| 依赖包 | 版本 | 用途 |
|-------|------|------|
| vue | ^3.5.13 | 前端框架 |
| vue-router | ^4.5.1 | 路由管理 |
| pinia | ^2.1.3 | 状态管理 |
| pinia-plugin-persistedstate | ^3.1.0 | Pinia状态持久化 |
| animejs | ^3.2.2 | JavaScript动画库 |
| tailwindcss | ^3.3.2 | CSS工具类框架 |
| naive-ui | ^2.34.4 | UI组件库 |
| @vueuse/core | ^10.2.1 | Vue组合式API工具集 |
| @supabase/supabase-js | ^2.26.0 | Supabase客户端 |
| axios | ^1.4.0 | HTTP客户端 |

### 开发依赖

| 依赖包 | 版本 | 用途 |
|-------|------|------|
| vite | ^4.5.14 | 开发服务器和构建工具 |
| typescript | ^5.0.2 | TypeScript语言支持 |
| vue-tsc | ^1.4.2 | Vue TypeScript编译器 |
| @vitejs/plugin-vue | ^4.1.0 | Vue插件 |
| postcss | ^8.4.24 | CSS处理器 |
| autoprefixer | ^10.4.14 | PostCSS插件 |
| @types/animejs | ^3.1.7 | Anime.js类型定义 |
| @types/node | ^20.3.1 | Node.js类型定义 |
| eslint | ^8.52.0 | 代码检查工具 |
| eslint-plugin-vue | ^9.17.0 | Vue规则插件 |
| @typescript-eslint/eslint-plugin | ^6.9.0 | TypeScript规则插件 |
| @typescript-eslint/parser | ^6.9.0 | TypeScript解析器 |

## 依赖检查与安装

### 安装所有依赖

1. 确保已安装Node.js (推荐v18以上版本) 和npm
2. 在项目根目录执行：

```bash
npm install
```

### 检查依赖安装状态

项目提供了便捷脚本来检查依赖安装情况：

```bash
# 检查过期依赖
npm run check

# 清理并重新安装所有依赖（解决依赖冲突问题）
npm run clean:deps
```

也可以使用原生npm命令检查：

```bash
# 查看过期依赖
npm outdated

# 检查特定包的安装情况
npm list [package-name]
```

### 验证关键依赖安装

可以通过以下命令验证关键依赖是否正确安装：

```bash
# 检查Vue版本
npm list vue

# 检查TailwindCSS
npm list tailwindcss

# 检查Anime.js
npm list animejs
```

### 更新依赖

可以使用以下命令更新所有依赖到最新兼容版本：

```bash
npm update
```

或者更新特定依赖：

```bash
npm update [package-name]
```

## 项目启动与构建

### 开发环境

启动开发服务器：

```bash
npm run dev
```

### 代码检查

执行代码规范检查：

```bash
npm run lint
```

ESLint配置位于项目根目录的`.eslintrc.js`文件，您可以根据项目需求自定义规则。

### 生产环境构建

构建生产版本：

```bash
npm run build
```

预览生产版本：

```bash
npm run preview
```

## 可能的依赖问题与解决方案

### 问题1: 样式不正确加载

**症状**: 界面显示为毛坯状态，缺少样式
**解决方案**: 
- 确保tailwindcss配置正确，检查tailwind.config.js和postcss.config.js
- 检查main.ts中样式文件是否正确导入
- 可尝试重新安装相关依赖：`npm install tailwindcss postcss autoprefixer --save-dev`

### 问题2: 动画不正常工作

**症状**: 卦象动画未正常显示
**解决方案**:
- 确保animejs正确安装：`npm install animejs --save`
- 检查animejs导入语句是否正确
- 确保有正确的CSS类定义
- 检查浏览器控制台错误信息

### 问题3: Vue组件不正常渲染

**症状**: 组件未正常显示或报错
**解决方案**:
- 确保Vue及相关依赖版本兼容：`npm install vue@latest vue-router@latest`
- 检查组件注册方式
- 确认vite.config.ts配置正确 
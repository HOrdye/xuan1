# 筊杯动画方案说明

## 📋 概述

提供了两种创建专业级筊杯投掷动画的方案：

1. **代码方案**：使用 GSAP 在 Cursor 中直接实现（类似 AE 效果）
2. **AE 方案**：使用 After Effects 制作，导出为 Lottie

## 🎯 方案一：GSAP 代码动画（推荐用于快速开发）

### 组件位置
`src/features/jiao-bei/components/JiaoBeiGSAPAnimation.vue`

### 特点
- ✅ 完全在代码中实现，无需外部工具
- ✅ 实时渲染，性能优秀
- ✅ 可动态控制，根据结果调整动画
- ✅ 易于集成到现有项目
- ✅ 文件体积小

### 使用方法

```vue
<template>
  <JiaoBeiGSAPAnimation 
    :is-throwing="isThrowing"
    :target-result="targetResult"
    @throw-complete="handleThrowComplete"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JiaoBeiGSAPAnimation from './JiaoBeiGSAPAnimation.vue'

const isThrowing = ref(false)
const targetResult = ref<string | null>(null)

const handleThrowComplete = (result: string) => {
  console.log('投掷结果：', result)
  isThrowing.value = false
}

// 开始投掷
const startThrow = () => {
  isThrowing.value = true
}
</script>
```

### 动画特性

1. **物理模拟**：
   - 重力效果
   - 弹跳效果
   - 旋转动画
   - 阴影跟随

2. **视觉效果**：
   - 粒子飞散效果
   - 3D 变换
   - 光照效果
   - 缓动曲线

3. **结果对应**：
   - 根据结果自动调整筊杯朝向
   - 支持圣杯、阴杯、笑杯、立杯

### 自定义修改

#### 修改投掷轨迹
在 `performThrow()` 函数中修改路径：

```typescript
// 筊杯1的轨迹
const cup1Path = [
  { x: 0, y: -150 },
  { x: -80, y: 50 },
  { x: -100, y: 200 },
  { x: -80, y: 250 }
]
```

#### 修改动画时长
```typescript
// 阶段2: 向上投掷（0.3-0.6s）
masterTimeline.to(cupContainerRef.value, {
  y: -150,
  scale: 1.2,
  duration: 0.3, // 修改这里
  ease: 'power2.out'
})
```

#### 修改缓动效果
GSAP 提供多种缓动函数：
- `power1.inOut` - 平滑加速减速
- `power2.out` - 快速减速
- `back.out(1.7)` - 弹性效果
- `elastic.out(1, 0.3)` - 弹性反弹

## 🎬 方案二：After Effects + Lottie（推荐用于精细制作）

### 文件位置
- 脚本：`ae-scripts/jiaobei-throw-animation.jsx`
- 说明：`ae-scripts/README.md`

### 特点
- ✅ 专业级视觉效果
- ✅ 精确控制每一帧
- ✅ 支持复杂特效
- ✅ 可导出高质量动画

### 使用流程

1. **在 AE 中运行脚本**：
   ```
   File > Scripts > Run Script File > jiaobei-throw-animation.jsx
   ```

2. **调整动画**：
   - 修改关键帧
   - 调整缓动曲线
   - 添加特效

3. **导出 Lottie**：
   - 使用 Bodymovin 插件
   - 导出为 JSON 文件

4. **在项目中使用**：
   ```vue
   <template>
     <div ref="lottieContainer"></div>
   </template>
   
   <script setup>
   import { ref, onMounted } from 'vue'
   import lottie from 'lottie-web'
   
   const lottieContainer = ref(null)
   
   onMounted(() => {
     const animation = lottie.loadAnimation({
       container: lottieContainer.value,
       renderer: 'svg',
       loop: false,
       autoplay: false,
       path: '/animations/jiaobei-throw.json'
     })
     
     animation.play()
   })
   </script>
   ```

## 🔄 两种方案对比

| 特性 | GSAP 代码方案 | AE + Lottie 方案 |
|------|--------------|-----------------|
| **开发速度** | ⭐⭐⭐⭐⭐ 快速 | ⭐⭐⭐ 需要 AE 技能 |
| **视觉效果** | ⭐⭐⭐⭐ 优秀 | ⭐⭐⭐⭐⭐ 专业级 |
| **文件大小** | ⭐⭐⭐⭐⭐ 很小 | ⭐⭐⭐ 中等 |
| **可定制性** | ⭐⭐⭐⭐⭐ 完全可控 | ⭐⭐⭐ 需要重新导出 |
| **性能** | ⭐⭐⭐⭐⭐ 优秀 | ⭐⭐⭐⭐ 良好 |
| **学习曲线** | ⭐⭐⭐⭐ 中等 | ⭐⭐ 需要学习 AE |

## 💡 推荐使用场景

### 使用 GSAP 方案，如果：
- 需要快速实现和迭代
- 需要根据结果动态调整动画
- 希望完全在代码中控制
- 团队没有 AE 设计师

### 使用 AE + Lottie 方案，如果：
- 需要电影级视觉效果
- 有专业的 AE 设计师
- 动画设计已经确定，不需要频繁修改
- 需要复杂的特效和合成

## 🚀 快速开始

### 方案一：立即使用 GSAP 组件

1. 组件已创建：`JiaoBeiGSAPAnimation.vue`
2. 在页面中导入使用：
   ```vue
   <JiaoBeiGSAPAnimation :is-throwing="isThrowing" />
   ```

### 方案二：使用 AE 制作

1. 打开 After Effects
2. 运行脚本：`ae-scripts/jiaobei-throw-animation.jsx`
3. 调整动画并导出 Lottie
4. 将 JSON 文件放入 `public/animations/` 目录
5. 使用 `lottie-web` 加载动画

## 📝 注意事项

1. **GSAP 插件**：
   - MotionPathPlugin 和 Physics2DPlugin 是付费插件
   - 当前实现使用基础 GSAP，无需付费插件
   - 如需更高级功能，可考虑购买插件

2. **性能优化**：
   - GSAP 方案已优化，使用 `will-change` CSS 属性
   - Lottie 方案建议使用 `renderer: 'canvas'` 提高性能

3. **浏览器兼容性**：
   - GSAP 支持所有现代浏览器
   - Lottie 需要检查 Bodymovin 兼容性

## 🔧 故障排除

### GSAP 动画不流畅
- 检查是否有其他动画冲突
- 减少同时运行的动画数量
- 使用 `gsap.ticker` 优化性能

### Lottie 动画不显示
- 检查 JSON 文件路径
- 确认 `lottie-web` 已正确安装
- 检查浏览器控制台错误

## 📚 相关资源

- [GSAP 官方文档](https://greensock.com/docs/)
- [Lottie 官方文档](https://airbnb.io/lottie/)
- [After Effects 脚本指南](https://helpx.adobe.com/after-effects/using/scripts.html)

---

**选择最适合你项目的方案，开始制作精彩的筊杯动画吧！** 🎬











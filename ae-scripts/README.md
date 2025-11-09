# After Effects 筊杯动画脚本

## 📋 概述

这个文件夹包含用于在 After Effects 中创建筊杯投掷动画的脚本文件。

## 🎬 文件说明

### `jiaobei-throw-animation.jsx`
After Effects 脚本，用于自动创建筊杯投掷动画的所有图层和关键帧。

## 🚀 使用方法

### 步骤 1: 运行脚本

1. 打开 After Effects
2. 选择菜单：`File > Scripts > Run Script File...`
3. 选择 `jiaobei-throw-animation.jsx` 文件
4. 脚本会自动创建：
   - 新合成（1920x1080，60fps，3秒）
   - 背景图层
   - 地面图层
   - 两个筊杯图层（3D）
   - 阴影图层
   - 相机和灯光
   - 所有关键帧动画

### 步骤 2: 调整动画

脚本创建基础动画后，你可以：

1. **调整关键帧**：
   - 修改投掷轨迹
   - 调整旋转角度
   - 改变落地位置

2. **优化缓动曲线**：
   - 选择关键帧
   - 右键 > `Keyframe Assistant > Easy Ease`
   - 或手动调整速度曲线

3. **添加效果**：
   - 运动模糊（Motion Blur）
   - 景深效果
   - 粒子效果
   - 光效

4. **材质和光照**：
   - 调整筊杯材质
   - 添加反射
   - 优化光照效果

### 步骤 3: 导出为 Lottie

1. **安装 Bodymovin 插件**：
   - 下载地址：https://github.com/airbnb/lottie-web
   - 或通过 Adobe Exchange 安装

2. **导出动画**：
   - 打开 `Window > Extensions > Bodymovin`
   - 选择要导出的合成
   - 点击 `Render` 按钮
   - 选择导出路径
   - 等待渲染完成

3. **优化设置**：
   - 勾选 `Compress` 压缩文件大小
   - 设置 `Quality` 质量（建议 2-3）
   - 勾选 `Export as GIF`（如果需要）

## 📦 在 Web 项目中使用

### 安装依赖

项目已包含 `lottie-web`，无需额外安装。

### 集成到 Vue 组件

```vue
<template>
  <div ref="lottieContainer" class="lottie-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import lottie from 'lottie-web'

const lottieContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  if (lottieContainer.value) {
    const animation = lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: '/animations/jiaobei-throw.json' // 导出的 Lottie JSON 路径
    })
    
    // 控制播放
    animation.play()
    
    // 监听完成事件
    animation.addEventListener('complete', () => {
      console.log('动画完成')
    })
  }
})
</script>
```

## 🎨 动画参数说明

### 时间轴
- **0.0s**: 初始位置
- **0.3s**: 向上投掷
- **0.6s**: 最高点（旋转）
- **1.5s**: 落地
- **2.0s**: 弹跳结束

### 筊杯结果对应
- **圣杯**: 两个筊杯都正面朝上（rotation: 0, 0, 0）
- **阴杯**: 两个筊杯都反面朝上（rotation: 180, 0, 0）
- **笑杯**: 一个正面，一个反面（rotation: 0, 0, 0 和 180, 0, 0）
- **立杯**: 两个筊杯都立起（rotation: 90, 0, 0）

## 🔧 自定义修改

### 修改投掷轨迹

在脚本中找到以下部分并修改：

```javascript
// 筊杯1落地位置
cup1Pos.setValueAtTime(timeLand, [compWidth / 2 - 200, compHeight * 0.75, 0]);

// 筊杯2落地位置
cup2Pos.setValueAtTime(timeLand, [compWidth / 2 + 200, compHeight * 0.75, 0]);
```

### 修改旋转速度

```javascript
// 增加旋转圈数
cup1Rot.setValueAtTime(timePeak, [360, 180, 1440]); // 最后一位是 Z 轴旋转
```

### 修改动画时长

```javascript
var timeUp = 0.3;    // 向上投掷时间
var timePeak = 0.6;  // 最高点时间
var timeLand = 1.5;  // 落地时间
var timeEnd = 2.0;   // 结束时间
```

## 📝 注意事项

1. **3D 图层**: 脚本创建的筊杯图层已启用 3D，可以调整 Z 轴位置
2. **相机**: 脚本包含相机，可以调整视角
3. **灯光**: 脚本包含主光源，可以添加更多灯光增强效果
4. **性能**: 复杂的 3D 效果可能影响 Lottie 导出性能，建议简化

## 🐛 故障排除

### 脚本无法运行
- 确保在 After Effects 中运行，不是在外部编辑器
- 检查 AE 版本（建议 CC 2018 或更高）

### 动画不流畅
- 检查帧率设置（建议 60fps）
- 优化关键帧数量
- 简化 3D 效果

### Lottie 导出失败
- 确保安装了最新版本的 Bodymovin
- 检查是否有不支持的 AE 效果
- 尝试简化动画

## 📚 相关资源

- [Lottie 官方文档](https://airbnb.io/lottie/)
- [Bodymovin GitHub](https://github.com/airbnb/lottie-web)
- [After Effects 脚本指南](https://helpx.adobe.com/after-effects/using/scripts.html)

## 💡 提示

- 可以先在 AE 中制作一个简单的版本，测试 Lottie 导出
- 逐步添加复杂效果，确保兼容性
- 使用 `lottie-web` 的 `renderer: 'canvas'` 选项可以提高性能
- 考虑创建多个版本的动画（不同结果对应不同动画）

---

**祝制作顺利！** 🎬



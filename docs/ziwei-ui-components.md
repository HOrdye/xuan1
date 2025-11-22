# 紫微斗数UI组件使用指南

## 📋 概述

本文档介绍紫微斗数模块的UI组件，包括圆形星盘展示、宫位详情卡片等组件。

---

## 🎨 组件列表

### 1. ZiweiChart.vue - 圆形星盘组件

#### 功能
- 传统的圆形星盘布局展示
- 12个宫位均匀分布在圆周上
- 中心显示命盘基本信息
- 支持主星、辅星、四化标记展示
- 支持命宫、身宫高亮显示

#### 使用方法

```vue
<template>
  <ZiweiChart 
    :chart="ziweiChart" 
    :is-dark-mode="false" 
  />
</template>

<script setup>
import { ZiweiChart } from '@/features/ziwei/components';
import type { ZiweiChart as ZiweiChartType } from '@/features/ziwei/types';

const ziweiChart: ZiweiChartType = {
  // ... 命盘数据
};
</script>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| chart | ZiweiChart | 必填 | 紫微命盘数据 |
| isDarkMode | boolean | false | 是否使用深色模式 |

#### 特性

- **圆形布局**：12个宫位按传统方式环形排列
- **中心信息**：显示五行局、命宫、身宫
- **星曜展示**：主星和辅星分别展示，颜色区分
- **四化标记**：化禄、化权、化科、化忌用不同颜色标记
- **交互效果**：悬停时宫位放大显示
- **响应式设计**：适配不同屏幕尺寸

---

### 2. PalaceDetailCard.vue - 宫位详情卡片

#### 功能
- 详细展示单个宫位的所有信息
- 主星和辅星分类展示
- 四化信息详细说明
- 星曜性格特征展示

#### 使用方法

```vue
<template>
  <PalaceDetailCard 
    :palace="palace"
    :is-ming-gong="index === 0"
    :is-shen-gong="isShenGong(index)"
  />
</template>

<script setup>
import { PalaceDetailCard } from '@/features/ziwei/components';
import type { Palace } from '@/features/ziwei/types';

const palace: Palace = {
  // ... 宫位数据
};
</script>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| palace | Palace | 必填 | 宫位数据 |
| isMingGong | boolean | false | 是否为命宫 |
| isShenGong | boolean | false | 是否为身宫 |

#### 特性

- **分类展示**：主星和辅星分开展示
- **详细信息**：显示星曜的亮度、属性、性格特征
- **四化说明**：四化的含义和影响
- **视觉区分**：不同类别的星曜用不同颜色标识

---

### 3. ChartDisplay.vue - 星盘展示页面（已更新）

#### 功能
- 整合所有展示组件
- 支持三种视图切换
- 统一的头部信息展示
- 格局识别结果展示

#### 视图模式

1. **圆形星盘视图**（默认）
   - 使用 `ZiweiChart` 组件
   - 传统圆形布局
   - 适合整体查看

2. **列表视图**
   - 网格布局展示所有宫位
   - 简洁的卡片式设计
   - 适合快速浏览

3. **详细视图**
   - 使用 `PalaceDetailCard` 组件
   - 每个宫位详细信息
   - 适合深入研究

#### 使用方法

```vue
<template>
  <ChartDisplay />
</template>

<script setup>
import ChartDisplay from '@/features/ziwei/views/ChartDisplay.vue';
</script>
```

---

## 🎯 使用示例

### 完整示例

```vue
<template>
  <div class="ziwei-page">
    <!-- 使用完整的展示页面 -->
    <ChartDisplay />
    
    <!-- 或者单独使用组件 -->
    <div class="custom-layout">
      <ZiweiChart :chart="chart" />
      
      <div class="palaces-detail">
        <PalaceDetailCard
          v-for="(palace, index) in chart.palaces"
          :key="index"
          :palace="palace"
          :is-ming-gong="index === 0"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChartDisplay, ZiweiChart, PalaceDetailCard } from '@/features/ziwei/components';
import { ZiweiChartCalculator } from '@/features/ziwei/utils/chartCalculator';
import type { ZiweiChart as ZiweiChartType } from '@/features/ziwei/types';

const calculator = new ZiweiChartCalculator();
const chart = ref<ZiweiChartType | null>(null);

// 生成命盘
const generateChart = () => {
  chart.value = calculator.calculate({
    year: 1990,
    month: 5,
    day: 15,
    hour: 10,
    gender: 'male'
  });
};
</script>
```

---

## 🎨 样式定制

### 主题颜色

组件使用以下主题颜色：

- **主色**：`#9333EA` (紫色) - 命宫、主星
- **次色**：`#3B82F6` (蓝色) - 身宫、辅星
- **成功色**：`#10B981` (绿色) - 化禄、吉星
- **警告色**：`#F59E0B` (橙色) - 化权
- **信息色**：`#3B82F6` (蓝色) - 化科
- **错误色**：`#EF4444` (红色) - 化忌、煞星

### 自定义样式

可以通过 CSS 变量或直接覆盖样式来自定义：

```vue
<style scoped>
/* 自定义星盘容器 */
.ziwei-chart-container {
  --primary-color: #9333EA;
  --secondary-color: #3B82F6;
}

/* 自定义宫位卡片 */
.palace-detail-card {
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
</style>
```

---

## 📱 响应式设计

所有组件都支持响应式设计：

- **桌面端** (> 768px)：完整布局，多列展示
- **平板端** (768px - 480px)：自适应列数
- **移动端** (< 480px)：单列布局，优化触摸体验

---

## 🔧 技术实现

### 圆形布局算法

使用极坐标系统计算宫位位置：

```typescript
const getPalacePosition = (index: number) => {
  const angle = (index * 30 - 90) * (Math.PI / 180);
  const radius = 280;
  const x = 50 + (radius / 10) * Math.cos(angle);
  const y = 50 + (radius / 10) * Math.sin(angle);
  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%, -50%) rotate(${index * 30}deg)`
  };
};
```

### 星曜分类

自动区分主星和辅星：

```typescript
const mainStars = stars.filter(star => star.category === '主星');
const auxiliaryStars = stars.filter(star => star.category !== '主星');
```

---

## 📝 注意事项

1. **数据格式**：确保传入的 `chart` 数据格式正确
2. **性能优化**：大量数据时考虑虚拟滚动
3. **浏览器兼容**：使用现代浏览器特性（CSS Grid、Flexbox）
4. **无障碍访问**：添加适当的 ARIA 标签

---

## 🚀 下一步

- [ ] 添加动画效果（星盘生成动画）
- [ ] 添加交互功能（点击宫位查看详情）
- [ ] 添加导出功能（导出为图片）
- [ ] 添加打印功能
- [ ] 添加分享功能









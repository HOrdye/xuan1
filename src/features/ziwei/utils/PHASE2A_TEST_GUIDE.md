# Phase 2A 功能测试指南

## 📋 测试范围

Phase 2A 排盘算法完善阶段实现的功能测试：

1. ✅ 流年岁前十二星安放算法
2. ✅ 大限四化飞入各宫位
3. ✅ 支持查看不同时间的命盘（UI时间选择器）

---

## 🧪 测试方法

### 方法1: 手动测试（推荐）

#### 1. 测试流年岁前十二星安放

**步骤**：
1. 打开浏览器，访问紫微斗数排盘页面
2. 输入生辰信息，生成命盘
3. 在浏览器控制台执行以下代码：

```javascript
// 测试流年岁前十二星
const { placeSuiqianTwelve } = await import('/src/features/ziwei/utils/auxiliaryStars.ts');
const stars = placeSuiqianTwelve('子'); // 测试子年
console.log('流年岁前十二星位置:', stars);
// 应该看到12个宫位都有星曜，岁建在子宫（索引0）
```

**预期结果**：
- 应该有12个宫位包含星曜
- 岁建应该在流年地支所在宫位
- 12颗星应该分别是：岁建、晦气、丧门、贯索、官符、小耗、大耗、龙德、白虎、天德、吊客、病符

#### 2. 测试大限四化飞星

**步骤**：
1. 生成命盘后，在控制台检查大限数据：

```javascript
const chart = ziweiStore.currentChart;
console.log('大限数据:', chart.daxian);
// 检查每个大限是否有feixing字段
chart.daxian.forEach((daxian, index) => {
  console.log(`大限${index + 1} (${daxian.startAge}-${daxian.endAge}岁):`, {
    sihua: daxian.sihua,
    feixing: daxian.feixing
  });
});
```

**预期结果**：
- 每个大限都应该有 `sihua` 字段（大限四化）
- 每个大限都应该有 `feixing` 字段（大限四化飞星）
- `feixing` 应该包含 `lu`、`quan`、`ke`、`ji` 四个数组

#### 3. 测试时间选择器功能

**步骤**：
1. 在命盘展示页面，找到"查看流年流月流日"区域
2. 点击日期选择器，选择一个日期（例如：2025年1月1日）
3. 观察流年、流月、流日信息是否正确显示
4. 点击"重置为今天"按钮，验证是否重置为当前日期

**预期结果**：
- 日期选择器可以正常选择日期
- 选择日期后，流年、流月、流日信息立即更新
- 显示的天干地支信息正确
- "重置为今天"按钮功能正常

---

### 方法2: 代码验证

#### 检查关键函数是否存在

在浏览器控制台执行：

```javascript
// 检查流年岁前十二星函数
const auxiliaryStars = await import('/src/features/ziwei/utils/auxiliaryStars.ts');
console.log('placeSuiqianTwelve:', typeof auxiliaryStars.placeSuiqianTwelve);

// 检查流年算法
const liunianCalc = await import('/src/features/ziwei/utils/liunianCalculator.ts');
console.log('calculateLiunianInfo:', typeof liunianCalc.calculateLiunianInfo);
console.log('calculateLiumonthInfo:', typeof liunianCalc.calculateLiumonthInfo);
console.log('calculateLiudayInfo:', typeof liunianCalc.calculateLiudayInfo);

// 检查四化飞星函数
const feixingCalc = await import('/src/features/ziwei/utils/sihuaFeixingCalculator.ts');
console.log('calculateSihuaFeixing:', typeof feixingCalc.calculateSihuaFeixing);
```

---

## ✅ 测试检查清单

### 流年岁前十二星
- [ ] 函数 `placeSuiqianTwelve()` 存在
- [ ] 可以正确安放12颗星
- [ ] 岁建在流年地支所在宫位
- [ ] 流年信息中包含 `suiqianStars` 字段

### 大限四化飞星
- [ ] 大限数据包含 `feixing` 字段
- [ ] 每个大限都有四化飞星结果
- [ ] 飞星结果结构正确（lu, quan, ke, ji）

### 时间选择器
- [ ] UI组件正常显示
- [ ] 可以选择日期
- [ ] 日期变化时流年信息更新
- [ ] "重置为今天"按钮功能正常
- [ ] 流年、流月、流日信息正确显示

---

## 🐛 常见问题排查

### 问题1: 流年岁前十二星未显示

**可能原因**：
- 流年信息未正确计算
- UI未正确读取 `suiqianStars` 字段

**解决方法**：
- 检查 `calculateLiunianInfo()` 是否调用了 `placeSuiqianTwelve()`
- 检查流年信息接口是否包含 `suiqianStars` 字段

### 问题2: 大限四化飞星为空

**可能原因**：
- `calculateDaxian()` 未调用 `calculateSihuaFeixing()`
- 四化飞星计算函数有错误

**解决方法**：
- 检查 `chartCalculator.ts` 中的 `calculateDaxian()` 方法
- 验证 `calculateSihuaFeixing()` 函数是否正常工作

### 问题3: 时间选择器不工作

**可能原因**：
- Vue组件未正确导入
- 事件处理函数有错误

**解决方法**：
- 检查 `ChartDisplay.vue` 中的导入语句
- 检查 `handleDateChange()` 函数实现
- 检查浏览器控制台是否有错误信息

---

## 📊 测试结果记录

测试日期：___________

| 功能项 | 测试状态 | 备注 |
|--------|---------|------|
| 流年岁前十二星安放 | ⬜ 通过 / ⬜ 失败 | |
| 大限四化飞星计算 | ⬜ 通过 / ⬜ 失败 | |
| 时间选择器UI | ⬜ 通过 / ⬜ 失败 | |
| 流年信息显示 | ⬜ 通过 / ⬜ 失败 | |
| 流月信息显示 | ⬜ 通过 / ⬜ 失败 | |
| 流日信息显示 | ⬜ 通过 / ⬜ 失败 | |

---

## 🎯 下一步

如果所有测试通过，Phase 2A 功能开发完成！

可以继续进行 Phase 2B（融合增强）的开发工作。





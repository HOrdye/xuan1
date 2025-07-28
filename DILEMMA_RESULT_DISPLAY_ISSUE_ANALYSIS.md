# 两难抉择结果显示问题分析

## 问题现象
- 两难抉择功能点击"生成测试结果"后显示空白内容
- 界面显示"()"占位符而非实际结果
- 控制台显示得分计算完成但界面未正确渲染
- 推荐选项和得分显示区域为空

## 根本原因

### 1. 结果类型标识错误 (核心逻辑缺陷)
- **错误标识方法类型**：
  - 两难抉择结果使用`method: 'plumBlossom'`或`'coin'`标识
  - 结果组件依赖`method === 'dilemma'`条件渲染特有UI
  ```vue
  <div v-if="result.method === 'dilemma'">...</div>
  ```

### 2. 数据结构不匹配
- **组件预期字段缺失**：
  - 结果组件需要`optionA`/`optionB`/`optionA_score`等字段
  - 实际生成结果对象缺少这些字段:
  ```typescript
  divinationResult.value = {
    hexagram: ...,
    changingLines: ...,
    analysis: ...,
    // 缺少optionA/optionB等两难抉择特有字段
  }
  ```

### 3. 空值处理机制缺失
- **未实现空状态兜底逻辑**：
  - 当`optionA_analysis`等字段为空时直接显示"()"
  - 未提供默认值或空状态提示:
  ```vue
  <p v-if="result.optionA_analysis">{{ result.optionA_analysis }}</p>
  <!-- 未处理空值情况 -->
  ```

### 4. 渲染逻辑冲突
- **单一组件处理多类型结果**：
  - 普通占卜和两难抉择使用相同组件渲染
  - 未设计类型守卫区分数据结构
  - 缺少结果类型适配层

## 影响范围
- `src/features/dilemma/utils/hexagramGenerator.ts` 结果生成逻辑
- `src/features/dilemma/components/DivinationResult.vue` 结果展示组件
- `src/features/dilemma/views/HexagramDivination.vue` 占卜流程控制

## 解决方案方向
1. 专用数据类型：
   - 创建`DilemmaResult`独立数据结构
   - 与普通占卜结果类型分离
2. 明确类型标识：
   - 设置`method: 'dilemma'`标识两难抉择
3. 组件逻辑重构：
   - 增加结果类型检测守卫
   - 分离普通占卜和两难抉择渲染逻辑
4. 空值兜底处理：
   - 增加字段存在性检查
   - 提供默认提示文本
5. 结果生成适配：
   - 确保hexagramGenerator返回完整两难结果

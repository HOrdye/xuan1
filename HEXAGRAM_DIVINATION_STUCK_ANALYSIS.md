# 易经占卜卡在AI思考动画问题分析

## 问题现象
- 用户进行易经占卜时，界面卡在"AI思考中"动画状态
- 无法进入解读结果界面
- 控制台显示LLM分析已完成但界面未更新

## 根本原因

### 1. 状态流转不完整 (关键路径缺陷)
- **状态机缺失"completed"状态处理**：
  - LLM服务状态机仅有preparing/calling/processing状态
  - 缺少最终完成状态(completed)的转换逻辑
- **状态更新未闭环**：
  - 成功获取解读后未触发完成状态更新
  - 仅设置`isGenerating.value = false`，未重置`loadingStage`和`loadingProgress`

### 2. 订阅回调处理不完整
- 仅处理loading状态变更：
  ```typescript
  unsubscribeFromLLM = LLMService.onLoadingStateChange((state) => {
    isGenerating.value = state.isLoading;
    loadingProgress.value = state.progress;
    loadingStage.value = state.stage;
  });
  ```
- 未处理服务返回的"completed"或"error"状态

### 3. 错误处理流程缺陷
- LLM失败时使用备用解读但未更新加载状态：
  ```typescript
  } catch (llmError) {
    console.error('LLM解读失败，使用基本解读:', llmError);
    divinationResult.value = { ... } // 使用备用解读
    // 缺少状态重置：isGenerating.value = false 等
  }
  ```

## 影响范围
- `src/features/dilemma/views/HexagramDivination.vue` 文件中的占卜流程
- LLM状态管理组件 (`src/components/LLMLoadingIndicator.vue`)
- LLM服务状态机 (`src/services/LLMService.ts`)

## 解决方案方向
1. 完善状态机流转：
   - 增加"completed"状态
   - 确保每个状态转换都更新界面
2. 加强错误处理：
   - 捕获所有可能的异常路径
   - 确保任何情况下都重置加载状态
3. 增加状态超时保护：
   - 设置最大处理时间阈值
   - 超时后自动重置状态并提示用户

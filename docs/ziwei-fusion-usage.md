# 紫微融合接口使用指南

## 📋 概述

本文档说明如何在现有功能（运势、两难抉择、易经占卜）中使用紫微融合接口。

---

## 🚀 快速开始

### 1. 导入融合服务

```typescript
import { ZiweiFusionService } from '@/features/ziwei/services/fusionService';
import type { ZiweiChart } from '@/features/ziwei/types';
```

### 2. 获取用户命盘

```typescript
// 假设用户已经排盘，获得命盘数据
const chart: ZiweiChart = await getUserChart(userId);
```

---

## 💡 使用场景

### 场景1：今日运势融合

在运势生成时，添加紫微增强数据：

```typescript
import type { FortuneResult } from '@/features/fortune/types/fortune';
import { ZiweiFusionService } from '@/features/ziwei/services/fusionService';

async function generateFortuneWithZiwei(
  birthDate: Date,
  chart: ZiweiChart
): Promise<FortuneResult> {
  // 生成基础运势
  const baseFortune = await generateBaseFortune(birthDate);
  
  // 生成紫微增强数据
  const ziweiEnhancement = ZiweiFusionService.generateFortuneEnhancement(
    chart,
    new Date()
  );
  
  // 合并结果
  return {
    ...baseFortune,
    ziwei: ziweiEnhancement, // 添加紫微增强字段
  };
}
```

**在UI中显示**：

```vue
<template>
  <div v-if="fortuneResult.ziwei" class="ziwei-enhancement">
    <h3>紫微流年分析</h3>
    <p>流年：{{ fortuneResult.ziwei.flowYear }}</p>
    <p>整体能量：{{ fortuneResult.ziwei.overallEnergy }}%</p>
    <p>幸运宫位：{{ fortuneResult.ziwei.luckyPalace }}</p>
    
    <div v-for="advice in fortuneResult.ziwei.palaceAdvice" :key="advice.palace">
      <h4>{{ advice.palace }}</h4>
      <p>{{ advice.advice }}</p>
      <p>适配度：{{ advice.score }}%</p>
    </div>
  </div>
</template>
```

---

### 场景2：两难抉择增强

在两难抉择分析时，添加紫微匹配分析：

```typescript
import type { AnalysisResult } from '@/features/dilemma/types';
import { ZiweiFusionService } from '@/features/ziwei/services/fusionService';
import { classifyQuestion } from '@/shared/utils/questionClassifier';

async function analyzeDilemmaWithZiwei(
  optionA: string,
  optionB: string,
  question: string,
  chart: ZiweiChart
): Promise<AnalysisResult> {
  // 生成基础易经分析
  const baseAnalysis = await generateYijingAnalysis(optionA, optionB, question);
  
  // 识别问题类型
  const classification = classifyQuestion(question);
  
  // 生成紫微匹配分析
  const ziweiMatch = ZiweiFusionService.generateMatchAnalysis(
    chart,
    optionA,
    optionB,
    classification.type
  );
  
  // 合并结果
  return {
    ...baseAnalysis,
    ziweiMatch, // 添加紫微匹配分析
  };
}
```

**在UI中显示**：

```vue
<template>
  <div v-if="analysisResult.ziweiMatch" class="ziwei-match">
    <h3>命格适配度分析</h3>
    
    <div class="option-comparison">
      <div class="option-a">
        <h4>选项A</h4>
        <p>匹配度：{{ analysisResult.ziweiMatch.optionA.matchScore }}%</p>
        <p>成功概率：{{ analysisResult.ziweiMatch.optionA.successProbability }}%</p>
        <p>{{ analysisResult.ziweiMatch.optionA.analysis }}</p>
      </div>
      
      <div class="option-b">
        <h4>选项B</h4>
        <p>匹配度：{{ analysisResult.ziweiMatch.optionB.matchScore }}%</p>
        <p>成功概率：{{ analysisResult.ziweiMatch.optionB.successProbability }}%</p>
        <p>{{ analysisResult.ziweiMatch.optionB.analysis }}</p>
      </div>
    </div>
    
    <div class="recommendation">
      <p>{{ analysisResult.ziweiMatch.overallAnalysis }}</p>
    </div>
  </div>
</template>
```

---

### 场景3：易经占卜增强

在易经占卜结果中，添加命盘视角：

```typescript
import type { AnalysisResult } from '@/features/dilemma/types';
import { ZiweiFusionService } from '@/features/ziwei/services/fusionService';

async function enhanceYijingWithZiwei(
  question: string,
  hexagramName: string,
  chart: ZiweiChart
): Promise<AnalysisResult> {
  // 生成基础易经分析
  const baseAnalysis = await generateYijingAnalysis(question);
  
  // 生成紫微命盘视角
  const palacePerspective = ZiweiFusionService.generatePalacePerspective(
    chart,
    question,
    hexagramName
  );
  
  // 合并结果
  return {
    ...baseAnalysis,
    palacePerspective, // 添加命盘视角
  };
}
```

**在UI中显示**：

```vue
<template>
  <div v-if="analysisResult.palacePerspective" class="palace-perspective">
    <h3>命盘视角</h3>
    <p>相关宫位：{{ analysisResult.palacePerspective.relatedPalace }}</p>
    <p>主星：{{ analysisResult.palacePerspective.mainStars.join('、') }}</p>
    <p>{{ analysisResult.palacePerspective.palaceAnalysis }}</p>
    <p>{{ analysisResult.palacePerspective.hexagramConnection }}</p>
    <p>{{ analysisResult.palacePerspective.integratedAdvice }}</p>
    <p>能量匹配度：{{ analysisResult.palacePerspective.energyMatch }}%</p>
  </div>
</template>
```

---

### 场景4：三维解读系统

整合易经、紫微、塔罗三个系统：

```typescript
import { CrossSystemAnalyzerService } from '@/shared/services/crossSystemService';
import { ZiweiFusionService } from '@/features/ziwei/services/fusionService';
import type { CrossSystemAnalysis } from '@/shared/types/cross-system';

async function generateTripleAnalysis(
  question: string,
  chart: ZiweiChart
): Promise<CrossSystemAnalysis> {
  // 1. 生成易经结果
  const yijingResult = await generateYijingResult(question);
  
  // 2. 生成紫微结果
  const ziweiResult = ZiweiFusionService.generateZiweiResult(chart, question);
  
  // 3. 生成塔罗结果
  const tarotResult = await generateTarotResult(question);
  
  // 4. 生成综合洞察
  const analysis: CrossSystemAnalysis = {
    question,
    questionType: classifyQuestion(question).type,
    timestamp: Date.now(),
    yijing: yijingResult,
    ziwei: ziweiResult,
    tarot: tarotResult,
  };
  
  // 5. 生成综合洞察
  const integratedInsight = CrossSystemAnalyzerService.generateIntegratedInsight(analysis);
  analysis.integratedInsight = integratedInsight;
  
  return analysis;
}
```

---

## 🔧 类型适配

如果需要在中文和英文标识符之间转换：

```typescript
import {
  convertPalaceNameToId,
  convertPalaceIdToName,
  convertMainStarNameToId,
  convertMainStarIdToName,
} from '@/features/ziwei/utils/typeAdapter';

// 中文 -> 英文
const palaceId = convertPalaceNameToId('命宫'); // 'ming'

// 英文 -> 中文
const palaceName = convertPalaceIdToName('ming'); // '命宫'

// 主星转换
const starId = convertMainStarNameToId('紫微'); // 'ziwei'
const starName = convertMainStarIdToName('ziwei'); // '紫微'
```

---

## 📝 注意事项

1. **可选字段**：所有紫微增强字段都是可选的，不会影响现有功能
2. **类型安全**：使用 TypeScript 类型定义确保类型安全
3. **向后兼容**：现有代码无需修改即可使用
4. **性能考虑**：融合服务计算可能较耗时，建议异步调用

---

## 🎯 下一步

- [ ] 完善融合算法，提升分析准确性
- [ ] 优化性能，减少计算时间
- [ ] 添加缓存机制，避免重复计算
- [ ] 完善UI组件，展示紫微增强数据









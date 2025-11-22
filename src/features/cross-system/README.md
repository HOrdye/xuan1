# 三维决策系统（Cross-System Analysis）

## 功能概述

三维决策系统是天玄Web的核心差异化功能，整合了三个古老的智慧系统：
- **易经占卜**：判断"何时做"，动态时机分析
- **紫微命盘**：分析"适合做什么"，静态特质分析
- **塔罗指引**：探索"内心真实想法"，情感层面分析

## 功能特点

1. **独立分析模式**：各个系统可以独立运行，互不干扰
2. **综合分析模式**：多个系统协同分析，生成统一的决策建议
3. **用户自主选择**：用户可以选择是否启用综合分析决策
4. **智能问题分类**：自动识别问题类型并匹配相关宫位
5. **一致性分析**：分析三个系统结果的一致性，提供置信度评分
6. **AI综合洞察**：生成综合建议和优先行动清单

## 架构设计

### 接口框架

系统采用**接口框架设计**，支持后续逐步开发实现：

```
src/features/cross-system/
├── services/
│   ├── analysisService.ts              # 核心接口定义和服务管理器
│   ├── implementations/                 # 具体实现（可逐步开发）
│   │   ├── yijingAnalysisService.ts     # 易经分析服务实现
│   │   ├── ziweiAnalysisService.ts     # 紫微分析服务实现
│   │   ├── tarotAnalysisService.ts     # 塔罗分析服务实现
│   │   └── integratedAnalysisService.ts # 综合分析服务实现
│   └── index.ts                        # 服务初始化和导出
├── views/
│   └── TripleAnalysisPage.vue          # 主页面组件
└── README.md                           # 本文档
```

### 核心接口

1. **IAnalysisService**：基础分析服务接口
2. **IYijingAnalysisService**：易经分析服务接口
3. **IZiweiAnalysisService**：紫微分析服务接口
4. **ITarotAnalysisService**：塔罗分析服务接口
5. **IIntegratedAnalysisService**：综合分析服务接口

### 服务管理器

`AnalysisServiceManager` 负责：
- 服务注册和管理
- 独立分析执行（`performIndependentAnalysis`）
- 综合分析执行（`performIntegratedAnalysis`）

## 文件结构

```
src/features/cross-system/
├── views/
│   └── TripleAnalysisPage.vue          # 主页面组件
├── services/
│   ├── analysisService.ts              # 核心接口定义和服务管理器
│   ├── implementations/                # 具体实现
│   │   ├── yijingAnalysisService.ts    # 易经分析服务实现
│   │   ├── ziweiAnalysisService.ts     # 紫微分析服务实现
│   │   ├── tarotAnalysisService.ts     # 塔罗分析服务实现
│   │   └── integratedAnalysisService.ts # 综合分析服务实现
│   └── index.ts                        # 服务初始化和导出
└── index.ts                            # 模块导出
```

## 使用方式

### 路由访问
访问 `/triple-analysis` 路由即可使用三维决策系统。

### 两种分析模式

#### 1. 独立分析模式
- **特点**：各个系统独立运行，互不干扰
- **适用场景**：用户只想查看某个系统的分析结果
- **结果**：只显示各个系统的独立分析结果，不生成综合洞察

#### 2. 综合分析模式
- **特点**：多个系统协同分析，生成统一的决策建议
- **适用场景**：用户需要综合多个系统的建议做出决策
- **结果**：显示各个系统的分析结果 + 一致性分析 + AI综合洞察 + 优先行动清单
- **启用条件**：需要选择2个或以上系统，并开启"综合分析决策"开关

### API集成状态

✅ **已完成基础实现**：

1. **易经占卜API** ✅
   - 实现类：`YijingAnalysisService`
   - 实现：使用 `generateHexagramFromLines` 根据问题生成卦象，使用 `generateAnalysisAsync` 生成LLM解读
   - 状态：已实现，正常工作

2. **紫微命盘API** ✅
   - 实现类：`ZiweiAnalysisService`
   - 实现：使用 `useZiweiStore` 获取用户命盘，使用 `ZiweiFusionService.generatePalacePerspective` 生成命盘视角
   - 状态：已实现，需要用户先生成命盘才能使用

3. **塔罗占卜API** ✅
   - 实现类：`TarotAnalysisService`
   - 实现：使用 `drawCards` 抽取塔罗牌，使用 `TarotReader.performReading` 进行解读
   - 状态：已实现，正常工作

4. **综合分析API** ✅ **已优化**
   - 实现类：`IntegratedAnalysisService`
   - 实现：
     - 优先使用LLM生成智能综合分析（如果配置了LLM API）
     - 降级到增强的多维度分析算法（包含一致性、冲突性、互补性分析）
     - 支持JSON格式解析和错误处理
   - 状态：已实现并优化，支持LLM和降级方案

## 后续开发计划

### Phase 1: 接口框架 ✅ **已完成**
- [x] 建立核心接口框架（`analysisService.ts`）
- [x] 实现服务管理器（`AnalysisServiceManager`）
- [x] 实现各个分析服务的基础版本
- [x] 实现综合分析服务的基础版本
- [x] 添加用户选择综合分析的功能

### Phase 2: 服务实现优化 ✅ **已完成**
- [x] 易经分析服务基础实现
- [x] 紫微分析服务基础实现
- [x] 塔罗分析服务基础实现
- [x] **优化综合分析算法**：使用LLM生成更智能的综合分析
- [x] **添加多维度分析**：一致性、冲突性、互补性分析
- [x] **各系统独立加载状态**：实时显示各系统的分析进度
- [x] **错误处理和降级**：完善的错误处理和降级机制

### Phase 3: 功能增强
- [ ] 添加结果保存功能
- [ ] 添加历史记录查看
- [ ] 添加分享功能
- [ ] 添加结果对比功能（同一问题的多次分析）

### Phase 4: 用户体验优化 ✅ **部分完成**
- [x] 添加各系统独立的加载状态指示
- [x] 优化错误处理和提示
- [x] 添加分析进度显示（通过进度回调）
- [ ] 添加结果导出功能
- [ ] 移动端适配优化（基础适配已完成）

## 扩展开发指南

### 添加新的分析服务

1. 创建实现类，实现对应的接口：
```typescript
export class NewAnalysisService implements INewAnalysisService {
  async analyze(question: string, options?: any): Promise<NewResult | undefined> {
    // 实现分析逻辑
  }
}
```

2. 在 `services/index.ts` 中注册服务：
```typescript
const newService = new NewAnalysisService();
AnalysisServiceManager.registerNewService(newService);
```

3. 更新页面组件，添加新系统的选择选项

### 优化综合分析算法 ✅ **已完成**

`IntegratedAnalysisService.generateInsight` 方法已优化：
- ✅ 集成LLM生成更智能的综合分析（优先使用，失败时降级）
- ✅ 添加多维度分析（一致性、冲突性、互补性）
- ✅ 生成详细的优先行动清单
- ✅ 完善的错误处理和降级机制

### 多维度分析说明

综合分析现在包含三个维度：

1. **一致性分析**
   - 分析三个系统结果的一致性程度
   - 提供一致性评分（0-100分）
   - 判断一致性级别（高/中/低）

2. **冲突性分析**
   - 检测系统间是否存在观点冲突
   - 分析冲突的原因和如何调和
   - 提供冲突解决建议

3. **互补性分析**
   - 分析三个系统如何互补
   - 说明各系统提供的不同视角
   - 强调三维决策系统的完整价值

## 相关文档

- [开发计划](../../../memory-bank/ziwei-development-plan.md)
- [类型定义](../../shared/types/cross-system.ts)
- [跨系统服务](../../shared/services/crossSystemService.ts)


# 天玄Web系统设计模式

## 架构模式

### 特性驱动设计 (Feature-Driven Design)
天玄Web采用特性驱动的文件夹结构，每个主要功能模块都在`src/features`下有独立目录：

```
src/features/
├── divination/     # 占卜功能
├── dilemma/        # 两难抉择
├── fortune/        # 运势功能
├── jiao-bei/       # 笅杯功能
├── tarot/          # 塔罗功能
└── van/            # 通用功能
```

这种模式的优势：
- 相关代码集中管理，提高可维护性
- 更好的代码隔离，减少跨模块依赖
- 便于团队协作，不同团队成员可专注不同功能
- 支持按需加载，优化性能

### 组合式API模式 (Composition API Pattern)
基于Vue 3的Composition API，使用组合式函数(composables)抽取和重用逻辑：

```
src/composables/
├── useHexagram.js  # 卦象相关逻辑
├── useDivination.js # 占卜相关逻辑
└── useAnimation.js  # 动画控制逻辑
```

优势：
- 更好的代码重用
- 关注点分离
- 类型推断增强
- 代码组织更灵活

### 单向数据流 (Unidirectional Data Flow)
通过Pinia实现的状态管理确保数据单向流动：

```
Actions → State → Views → User Interactions → Actions
```

优势：
- 状态变化可预测
- 调试更容易
- 组件间通信更清晰

## 设计模式

### 1. 工厂模式 (Factory Pattern)
用于创建不同类型的占卜方法和结果生成器：

```typescript
// 占卜方法工厂
class DivinationMethodFactory {
  static createMethod(type: DivinationType): DivinationMethod {
    switch(type) {
      case 'coin': return new CoinDivination();
      case 'meihua': return new MeihuaDivination();
      case 'random': return new RandomDivination();
      // 将来添加笅杯占卜等
      default: throw new Error(`Unknown divination type: ${type}`);
    }
  }
}
```

### 2. 策略模式 (Strategy Pattern)
用于实现不同的卦象生成算法：

```typescript
// 卦象生成策略接口
interface HexagramGenerationStrategy {
  generate(input: any): Hexagram;
}

// 具体策略实现
class CharacterBasedStrategy implements HexagramGenerationStrategy {
  generate(text: string): Hexagram {
    // 基于文本特征生成卦象
  }
}

class RandomStrategy implements HexagramGenerationStrategy {
  generate(): Hexagram {
    // 随机生成卦象
  }
}
```

### 3. 观察者模式 (Observer Pattern)
用于UI动画与状态变化的联动：

```typescript
// 通过Vue的响应式系统实现观察者模式
const hexagramState = ref(null);

// 观察者 - 当卦象变化时触发动画
watch(hexagramState, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    animateHexagramChange(oldValue, newValue);
  }
});
```

### 4. 装饰器模式 (Decorator Pattern)
用于增强卦象解读功能：

```typescript
// 基础解读
class BasicHexagramReading {
  interpret(hexagram: Hexagram): Reading {
    // 提供基础解读
  }
}

// 装饰器 - 增加现代语境解读
class ModernContextDecorator {
  constructor(private reader: BasicHexagramReading) {}
  
  interpret(hexagram: Hexagram): Reading {
    const basicReading = this.reader.interpret(hexagram);
    return {
      ...basicReading,
      modernContext: this.generateModernContext(hexagram)
    };
  }
  
  private generateModernContext(hexagram: Hexagram): string {
    // 生成现代语境下的解读
  }
}
```

### 5. 命令模式 (Command Pattern)
用于实现用户操作的历史记录和重做功能：

```typescript
// 命令接口
interface DivinationCommand {
  execute(): void;
  undo(): void;
}

// 具体命令
class PerformDivinationCommand implements DivinationCommand {
  constructor(
    private divinationService: DivinationService,
    private params: DivinationParams,
    private resultCallback: (result: DivinationResult) => void
  ) {}
  
  execute(): void {
    const result = this.divinationService.perform(this.params);
    this.resultCallback(result);
  }
  
  undo(): void {
    // 清除结果或回到上一状态
  }
}
```

## 模块交互模式

### 1. 事件总线 (Event Bus)
用于模块间的松耦合通信：

```typescript
// 创建事件总线
const eventBus = mitt();

// 发布事件
eventBus.emit('divination-completed', result);

// 订阅事件
eventBus.on('divination-completed', (result) => {
  // 处理占卜完成事件
});
```

### 2. 依赖注入 (Dependency Injection)
通过Vue的provide/inject API实现组件间依赖共享：

```typescript
// 在应用级别提供服务
app.provide('divinationService', new DivinationService());

// 在组件中注入服务
const divinationService = inject('divinationService');
```

### 3. 共享状态 (Shared State)
通过Pinia实现的全局状态管理：

```typescript
// 定义store
export const useUserStore = defineStore('user', {
  state: () => ({
    preferences: {},
    history: [],
    favorites: []
  }),
  actions: {
    addToHistory(item) {
      this.history.push(item);
    },
    toggleFavorite(item) {
      // 添加或删除收藏
    }
  },
  persist: true // 通过插件实现持久化
});
```

## 响应式设计模式

### 1. 移动优先设计 (Mobile-First Design)
使用Tailwind CSS的响应式类实现移动优先设计：

```html
<div class="w-full md:w-2/3 lg:w-1/2 p-4 md:p-6 lg:p-8">
  <!-- 内容从移动视图开始，随着屏幕尺寸增加而适应 -->
</div>
```

### 2. 组件自适应 (Responsive Components)
创建能够适应不同环境的自适应组件：

```typescript
// 定义组件尺寸适配逻辑
const { width } = useWindowSize();
const layoutMode = computed(() => {
  if (width.value < 640) return 'compact';
  if (width.value < 1024) return 'medium';
  return 'full';
});
```

### 3. 渐进增强 (Progressive Enhancement)
根据用户设备能力提供不同级别的功能：

```typescript
// 检测设备能力并相应调整
const supportsAdvancedAnimations = checkDeviceCapabilities();
const animationStrategy = supportsAdvancedAnimations
  ? new ComplexAnimationStrategy()
  : new SimpleAnimationStrategy();
```

## API设计模式

### 1. REST风格API (RESTful API Design)
为后端交互设计REST风格的API结构：

```typescript
// API服务
export const userService = {
  getPreferences: () => api.get('/user/preferences'),
  updatePreferences: (data) => api.put('/user/preferences', data),
  getDivinationHistory: () => api.get('/user/history/divination'),
  saveDivinationResult: (result) => api.post('/user/history/divination', result)
};
```

### 2. 数据传输对象 (Data Transfer Objects)
定义清晰的数据结构用于前后端交互：

```typescript
// DTO定义
interface DivinationResultDTO {
  id: string;
  type: DivinationType;
  timestamp: string;
  hexagram: {
    upperTrigram: string;
    lowerTrigram: string;
    changingLines: number[];
  };
  question: string;
  reading: {
    title: string;
    summary: string;
    details: string;
  };
}
```

## 性能优化模式

### 1. 懒加载 (Lazy Loading)
通过Vue Router实现路由组件的懒加载：

```typescript
const routes = [
  {
    path: '/divination',
    component: () => import('@/features/divination/views/DivinationPage.vue')
  },
  {
    path: '/tarot',
    component: () => import('@/features/tarot/views/TarotPage.vue')
  }
];
```

### 2. 虚拟列表 (Virtual Scrolling)
用于高效渲染大量数据：

```typescript
// 使用虚拟滚动渲染大量卦象列表
const visibleItems = computed(() => {
  const start = Math.max(0, scrollPosition.value - buffer);
  const end = Math.min(allItems.value.length, scrollPosition.value + visibleCount.value + buffer);
  return allItems.value.slice(start, end);
});
```

### 3. 资源预加载 (Resource Preloading)
预加载用户可能需要的资源：

```typescript
// 路由切换时预加载相关资源
router.beforeEach((to, from, next) => {
  if (to.path.includes('/divination')) {
    // 预加载占卜相关资源
    import('@/features/divination/assets/coins.svg');
    import('@/features/divination/assets/hexagram-sprites.png');
  }
  next();
});
```

## 安全与数据模式

### 1. 本地存储加密 (Local Storage Encryption)
用于保护用户本地存储的敏感数据：

```typescript
// 简单加密工具
const secureStorage = {
  set(key, value) {
    const encrypted = encrypt(JSON.stringify(value), SECRET_KEY);
    localStorage.setItem(key, encrypted);
  },
  get(key) {
    const value = localStorage.getItem(key);
    if (!value) return null;
    return JSON.parse(decrypt(value, SECRET_KEY));
  }
};
```

### 2. 状态不可变性 (State Immutability)
确保状态变更的可预测性：

```typescript
// 使用不可变更新模式
function updateUserPreferences(state, newPreferences) {
  return {
    ...state,
    preferences: {
      ...state.preferences,
      ...newPreferences
    }
  };
}
```

## 结论

天玄Web的系统设计采用现代前端架构和设计模式，确保代码可维护性、可扩展性和性能。通过特性驱动设计和组合式API，我们创建了模块化、可复用的代码结构。通过设计模式的合理应用，我们解决了特定领域的问题，并通过响应式设计确保了良好的用户体验。

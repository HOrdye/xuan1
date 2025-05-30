# 天玄 Web (TianXuan Web) ✨ - 你的专属网页版玄学决策助手

## 项目简介

欢迎来到天玄 Web！这是"天玄"项目的网页版应用，专为90后、00后年轻人打造的玄学决策助手。我们相信，玄学不是宿命的枷锁，而是启迪思路、辅助决策的有趣工具。天玄 Web 致力于通过现代化的网页技术，为你提供一个在浏览器中即可轻松访问的、充满互动乐趣的玄学体验平台。

我们的核心理念：**告别刻板，拥抱"玄"妙乐趣，让每一次选择都有迹可循！**

## 开发计划 📋

### 已完成功能 ✅
1. **六十四卦占卜系统**
   - 易经铜钱占卜法
   - 梅花易数法
   - 随机起卦法
   - 六十四卦浏览器

2. **玄选两难系统**
   - 两个选项分析对比
   - 基于卦象的决策建议

3. **功能入口优化**
   - 完善导航系统，添加易经占卜下拉菜单
   - 在主页和各功能页面添加直观的占卜方法入口
   - 优化用户发现和访问功能的路径

### 开发阶段 (按优先级排序) 🚀

#### 第一阶段：核心功能完善 (1-2周)
1. **今日运势模块**
   - 基本运势生成算法开发
   - 用户生日信息（可选）采集
   - 开运/避坑小提示生成
   - 运势页面UI设计与实现

2. **笅杯占卜功能**
   - 笅杯模拟动画开发
   - 笅杯结果解读系统
   - 与现有占卜系统整合

#### 第二阶段：个性化体验 (2-3周)
1. **玄学画像系统**
   - 用户基础信息采集
   - 本命星盘/八字简析算法
   - 能量趋势分析模块
   - 专属守护符号生成器

2. **DIY开运潮物**
   - 玄学元素库构建
   - 组合规则设计
   - 电子御守生成器
   - 壁纸定制功能

3. **数据持久化**
   - 用户数据存储系统
   - 历史记录功能
   - 收藏功能实现

#### 第三阶段：AI赋能 (3-4周)
1. **AI解梦师/智能塔罗解读**
   - 塔罗牌组件开发
   - DeepSeek API集成
   - 提示词优化
   - 心情打卡系统

2. **后端服务整合**
   - Supabase整合
   - 用户认证系统
   - 云函数开发

3. **智能匹配系统（预研）**
   - 匹配算法研究
   - 隐私保护方案设计

#### 第四阶段：游戏化互动 (2-3周)
1. **玄学知识大挑战**
   - 题库建设
   - 关卡设计
   - 游戏化界面开发

2. **心情塔罗打卡**
   - 打卡界面开发
   - 成就系统设计
   - 奖励机制实现

3. **玄境漂流瓶/心愿祈福墙**
   - 社区互动功能
   - 内容审核系统
   - 分享功能

### 技术实现计划 🛠️

#### 前端架构
- **布局规划**：使用Tailwind CSS维护一致的UI风格
- **状态管理**：使用Pinia管理全局状态，特别是用户偏好和历史记录
- **组件设计**：采用原子化设计，开发可复用的卡片、按钮、输入框等基础组件
- **动画系统**：引入Anime.js，重点优化占卜流程的动画效果

#### 后端整合
- **数据存储**：Supabase作为主要后端服务
- **API设计**：构建RESTful API服务
- **AI集成**：通过云函数调用DeepSeek API，保护API密钥

#### 部署与测试
- **自动化测试**：单元测试和E2E测试
- **CI/CD**：GitHub Actions自动化部署
- **性能优化**：代码分割、懒加载、图片优化

### 阶段性里程碑 🏁

1. **MVP版本**（当前）：已完成六十四卦核心功能
2. **Alpha版本**（+4周）：完成第一阶段所有功能
3. **Beta版本**（+8周）：完成第二阶段，开始用户测试
4. **1.0版本**（+12周）：完成第三阶段核心功能，可公开使用
5. **2.0版本**（+16周）：完成所有功能，全面上线

## 核心功能 🚀

天玄 Web 将提供以下核心功能：

1.  **🔮 互动式场景决策模块：**
    * "To be, or not to be: that is the question:"：面临选择时，输入困惑，获取结合趣味玄学指引的选项分析。
    * "今天我左眼皮在跳"：每日专属运势签及轻松可执行的开运/避坑小提示。结合用户（可选）的生日信息或每日随机抽取"运势签"，给出一些轻松的、可执行的当日小建议，例如"宜穿绿色"、"宜喝一杯燕麦拿铁"、"忌与人争论鸡毛蒜皮的小事"。
    * "待我掐指一算"：供用户选择3种传统占卜方式：随机起卦法、易经铜钱占卜法、梅花易数法
    * "我跟关圣帝君请示过"：笅杯占卜，观察正反面来定吉凶
2.  **🌌 个性化与定制化玄学体验：**
    * "我的玄学画像"：生成专属的、现代感的"玄学画像"，解读本命亮点与能量趋势。画像可以包含："本命星盘/八字简析"： 用更现代化、年轻化的语言解读，突出性格优势、潜能和需要注意的小"bug"。"年度/月度能量趋势"： 简明扼要地提示近期的能量走向和机会点。"专属守护符号/图腾"： 根据用户画像生成独特的、可分享的守护符号或可爱图腾。
    * "DIY我的开运潮物"：提供多种玄学元素（如幸运色、符号、符文、塔罗牌元素等），用户可以自由组合，生成个性化的电子御守或手机壁纸。未来可链接周边饰品。
3.  **🤖 AI赋能的智能解读与陪伴：**
    * "AI解梦师 / 智能塔罗解读"：用户每日打卡记录心情、抽一张"心情塔罗牌"，系统给予简短的反馈和鼓励。长期坚持可以解锁特殊成就或虚拟奖励。
    * "智能匹配能量伙伴"（待未来考虑开发模块，需注重隐私）：基于玄学画像匿名匹配潜在"玄友"。
4.  **🎮 趣味性与游戏化互动：**
    * "玄学知识大挑战"（待未来开发）：通过趣味答题闯关，了解玄学文化。
    * "每日运势/心情塔罗打卡"：记录心情，获取反馈，解锁成就。
    * "玄境漂流瓶 / 心愿祈福墙"：匿名分享困惑、许下心愿，传递祝福。

## 核心算法
六十四卦算法：为"互动式场景决策"功能提供基础支持（方案选择：基于字符特征的确定性算法 + 仪式感，结合确定性算法和交互式"仪式"，基于选项的字符特征生成卦象，同时保留占卜的仪式感。）


## 现代审美与用户体验：

UI设计： 采用年轻人喜欢的简约、清新、ins风、赛博朋克风或国潮风等，避免传统玄学网站的陈旧感。
交互体验： 流程简洁明了，动画效果有趣流畅。
文案风格： 幽默、接地气、网感强，多用年轻人熟悉的表达方式。

## 目标用户 🎯

* 对玄学（星座、塔罗、占卜、命理等）有好奇心和兴趣的90后、00后年轻人。
* 在学习、工作、情感等方面面临选择，希望获得趣味性参考和积极心理暗示的用户。
* 追求个性化、娱乐化、智能化体验的互联网新生代。

## 技术栈 (Tech Stack) 🛠️

### 前端 (Frontend)
* **JavaScript 框架：** `Vue.js 3`
* **构建工具：** `Vite`
* **动画库：** `Anime.js` (核心) + `CSS Animations & Transitions` (辅助)
* **UI 组件库 (推荐)：** `Element Plus` 或 `Naive UI`
* **CSS 方案：** `Tailwind CSS` 或 `UnoCSS` (推荐原子化) / SCSS
* **状态管理：** `Pinia`
* **路由：** `Vue Router`

### 后端 (Backend)
* **推荐方案 (新手友好，快速原型)：**
    * `Supabase` (PostgreSQL, Auth, Storage, Edge Functions) **或**
    * `Firebase` (Firestore/Realtime Database, Auth, Storage, Cloud Functions)
* **备选方案 (更多控制权)：**
    * `Node.js` (使用 `Express.js` 或 `Fastify` 框架)
    * 数据库：`PostgreSQL` (配合 ORM 如 `Prisma` 或 `Sequelize`)

### AI 模块集成
* **模型：** `DeepSeek V3 0324` (或其他类似API)
* **集成方式：** 通过后端服务 (Node.js 或 BaaS 云函数) 调用 DeepSeek API，前端不直接暴露 API Key。
    * Node.js: 使用 `axios` 或 `node-fetch`
    * Supabase Functions / Firebase Cloud Functions: 使用对应环境的 HTTP 请求库。

## 开发设置 (Getting Started)

```bash
# 克隆仓库
git clone [你的仓库地址]
cd tianxuan-web

# 安装前端依赖
# cd frontend (如果前端代码在子目录)
npm install # 或 yarn install 或 pnpm install

# 启动前端开发服务器 (通常Vite会自动处理)
npm run dev # 或 yarn dev 或 pnpm dev
# 后端设置 (根据你选择的后端方案)
# 如果是 Supabase/Firebase，请参考其官方文档进行项目初始化和配置
# 如果是 Node.js 后端：
# cd backend (如果后端代码在子目录)
# npm install
# npm run dev (或你的启动命令)
# 天玄Web 项目结构与说明

## 1. 顶层目录结构（src/）

- `App.vue`：全局应用入口，包含头部、底部、主内容区（<router-view />）。
- `main.ts`：Vue应用启动文件。
- `router/`：路由配置，决定每个页面路径对应的组件。
- `assets/`：静态资源（如图片、样式）。
- `components/`：全局可复用UI组件（如导航栏、卡片等）。
- `composables/`：全局组合式函数（如useFortune、useHexagram等，提供状态和逻辑复用）。
- `features/`：核心业务模块，按功能分子目录（fortune、dilemma、tarot、jiao-bei等）。
- `shared/`：全局共享组件和工具。
- `store/`：全局状态管理（如Pinia）。
- `core/`：核心服务和类型。
- `utils/`：全局工具函数。
- `views/`：主路由页面（如Home、About、Profile等）。

## 2. 业务模块结构（以 fortune 为例）

`src/features/fortune/`
- `views/`：运势相关页面组件（如 FortuneView.vue、FortunePage.vue）。
- `components/`：运势相关UI组件（如 FortuneCard.vue、FortuneTips.vue、DateSelector.vue）。
- `composables/`：运势相关组合式函数（如 useFortune.ts）。
- `utils/`：运势算法和工具（如 fortuneGenerator.ts）。
- `types/`：运势相关类型定义（如 fortune.ts）。

## 3. 路由与页面渲染关系

- 路由配置在 `src/router/index.ts`。
- 例如 `/fortune` 路径，实际渲染的是 `src/features/fortune/views/FortuneView.vue`。
- 其他如 `/dilemma`、`/tarot`、`/jiaobei` 等，分别对应不同业务模块下的页面文件。

## 4. 常见开发/排查问题

### 4.1 页面无变化/调试区未消失？
- **实际渲染的页面文件要和路由配置一致！**
- `/fortune` 路由只会渲染 `FortuneView.vue`，不会渲染 `FortunePage.vue`，后者仅为备选或测试用。
- 如果你改了 FortunePage.vue 页面无变化，说明你改错了文件。
- 调试区、分项卡片等内容在 FortuneView.vue 里，需在该文件中删除或注释。

### 4.2 组件与页面关系
- 页面（如 FortuneView.vue）通过引入 FortuneCard、FortuneTips 等组件进行内容展示。
- 组件 props 需与实际数据结构一致，否则页面渲染异常。

### 4.3 组合式函数
- 运势相关状态和逻辑由 useFortune.ts 提供，页面通过解构获得 fortune、loading、error、generate 等。

## 5. 主要文件作用说明

- `FortuneView.vue`：今日运势主页面，负责渲染所有运势相关内容（调试区、分项卡片、总览卡片等）。
- `FortunePage.vue`：历史遗留/测试页面，实际路由不会渲染此文件。
- `FortuneCard.vue`：运势卡片组件，支持分项和总览两种用法。
- `FortuneTips.vue`：宜忌事项组件。
- `fortuneGenerator.ts`：运势生成算法，核心逻辑。
- `fortune.ts`：运势相关类型定义。
- `useFortune.ts`：运势状态管理和数据获取逻辑。

## 6. 建议

- **开发时务必确认你编辑的页面文件和实际路由渲染的文件一致。**
- 推荐全局搜索页面内容关键字，快速定位实际渲染文件。
- 修改页面结构时，优先在 FortuneView.vue 进行，删除调试区和分项卡片后刷新页面即可生效。

---

如有更多结构或开发问题，建议在 readme.md 持续补充说明，方便团队协作和新成员快速上手。

## 问题修复：卦象SVG黑框问题

### 问题描述

在应用的占卜功能中，卦象展示组件（`HexagramDisplay.vue`）无法正确加载卦象SVG图像，导致卦象显示为黑框或无法显示。

### 主要原因

1. 部分卦象在`hexagrams.json`中使用了"第X卦"的临时名称（如"第45卦"），而没有正确设置卦名、属性和爻辞
2. 图像路径引用方式不一致，导致图像无法正确加载
3. SVG文件不存在或存储位置不正确

### 修复措施

#### 1. 修复数据文件

完善`hexagrams.json`中的卦象数据，特别是：
- 修正所有使用"第X卦"格式的卦象条目
- 补充正确的卦名、五行属性和爻辞内容
- 确保每个卦象的sequence值正确对应

#### 2. 生成SVG文件

创建`scripts/generateHexagramSvgs.cjs`脚本，根据卦象数据自动生成所有64卦的SVG图像：
```javascript
// 使用方法：
node scripts/generateHexagramSvgs.cjs
```

生成的SVG文件保存在`public/static/hexagrams/`目录下，以卦象序号命名（如`1.svg`、`45.svg`等）。

#### 3. 优化组件加载逻辑

改进`HexagramDisplay.vue`组件中的图像加载逻辑：
- 统一使用`static/hexagrams/{sequence}.svg`路径格式
- 简化错误处理逻辑，在图像加载失败时使用爻线直接渲染
- 减少不必要的调试输出，仅在debug模式下输出详细信息

### 测试工具

为便于验证修复效果，创建了以下测试页面：

1. `public/test-svg.html` - 测试所有64卦SVG文件是否能正确加载
2. `public/debug-hexagrams.html` - 特别关注第45卦问题的调试页面

## 使用指南

### 卦象展示组件

`HexagramDisplay.vue`组件可用于显示任何一个卦象，使用方法：

```vue
<HexagramDisplay 
  :hexagram="hexagramData"
  :showDescription="true"
  :showOverall="true"
  :showYaoTexts="true"
  :debug="false"
/>
```

#### 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| hexagram | Object | null | 卦象数据对象 |
| imageUrl | String | '' | 自定义图像URL（可选） |
| isLoading | Boolean | false | 加载状态 |
| emptyText | String | '暂无卦象数据' | 空状态文本 |
| showDescription | Boolean | true | 是否显示卦辞 |
| showOverall | Boolean | true | 是否显示解读 |
| showYaoTexts | Boolean | true | 是否显示爻辞 |
| themeColor | String | 'currentColor' | 主题颜色 |
| debug | Boolean | false | 调试模式 |

### 卦象数据格式

```json
{
  "name": "萃",
  "sequence": 45,
  "nature": "泽地",
  "element": "金",
  "description": "萃：亨。王假有庙，利见大人，亨利贞。用大牲吉，利有攸往。",
  "overall": "精英荟萃，聚合有利",
  "yao_texts": [
    "初六：有孚不终，乃乱乃萃，若号一握为笑，勿恤，往无咎。",
    "六二：引吉，无咎，孚乃利用禴。",
    "六三：萃如嗟如，无攸利，往无咎，小吝。",
    "九四：大吉，无咎。",
    "九五：萃有位，无咎。匪孚，元永贞，悔亡。",
    "上六：赍咨涕洟，无咎。"
  ],
  "lines": [1, 0, 1, 1, 0, 0]
}
```

## 开发提示

1. 如需添加新的卦象SVG，请修改`hexagrams.json`数据后运行生成脚本
2. 确保SVG文件具有透明背景，以避免黑框问题
3. 在调试卦象显示问题时，可传入`debug="true"`启用调试模式

---

## 项目结构

```
├── public/
│   ├── hexagrams.json        # 卦象数据
│   ├── static/
│   │   └── hexagrams/        # 卦象SVG图像
│   ├── test-svg.html         # SVG测试页面
│   └── debug-hexagrams.html  # 调试页面
├── scripts/
│   └── generateHexagramSvgs.cjs  # SVG生成脚本
└── src/
    └── components/
        └── hexagram/
            └── HexagramDisplay.vue  # 卦象展示组件
```

## 常见问题

**问：为什么某些卦象会显示为空白或黑框？**  
答：检查以下几点：
1. 确认卦象的sequence值正确对应SVG文件名
2. 验证SVG文件是否存在于正确位置
3. 确保SVG文件具有透明背景
4. 使用调试页面测试特定卦象的加载情况

**问：如何自定义卦象样式？**  
答：可以通过传入themeColor参数，或直接修改组件中的CSS变量来自定义样式。

## 最新调试：加载动画显示问题 (2024-12-29)

### 问题现象
用户反馈加载动画仍然没有显示，即使在进行占卜分析时也看不到动画效果。

### 调试步骤

#### 1. 验证LLMLoadingIndicator组件
创建了独立的动画测试页面 `src/debug/AnimationTest.vue`：
- 可以通过访问 `/debug/animation` 路径进行测试
- 独立测试LLMLoadingIndicator组件的显示效果
- 模拟不同的加载阶段和状态变化

#### 2. 检查LLMService状态订阅机制
在DilemmaPage中添加了详细的调试日志：
- 组件挂载时的订阅状态
- LLM状态变化时的回调执行
- startAnalysis过程中的状态变化

#### 3. 验证调用链路
确认占卜流程的完整调用链：
```
DilemmaPage.startAnalysis() 
  → generateHexagram() 
  → generateOverallAnalysis() 
  → LLMService.getHexagramInterpretation()
  → updateLoadingState()
  → 订阅回调触发
  → 更新组件状态
```

### 测试方法

#### 独立动画测试
1. 访问 `http://localhost:5173/debug/animation`
2. 点击"开始测试动画"按钮
3. 观察是否能看到八卦旋转动画和进度条

#### 集成功能测试
1. 访问 `http://localhost:5173/dilemma`
2. 输入两个选择选项
3. 点击"开始分析"
4. 检查浏览器控制台的调试信息
5. 观察是否出现加载动画

### 预期结果
- 独立测试：应该能看到完整的动画效果
- 集成测试：在分析过程中应该显示加载动画
- 控制台日志：应该显示完整的状态变化过程

### 如果动画仍不显示

#### 检查项目
1. **组件引用**：确认DilemmaPage正确引入了LLMLoadingIndicator
2. **样式加载**：检查CSS动画是否被正确加载
3. **z-index层级**：确认loading组件的层级没有被其他元素覆盖
4. **浏览器兼容性**：测试不同浏览器的兼容性

#### 调试方法
```javascript
// 在浏览器控制台中手动测试
// 1. 检查组件实例
console.log('Loading component visible:', document.querySelector('.llm-loading-overlay'));

// 2. 手动触发状态变化
import { LLMService } from './src/services/LLMService.ts';
LLMService.getConfig(); // 检查服务是否正常
```

#### 备用方案
如果问题持续存在，可以：
1. 使用简化版的loading指示器
2. 添加基础的CSS loading spinner
3. 检查Vue3的响应式系统是否正常工作

### 技术细节

#### LLMLoadingIndicator组件特点
- 全屏遮罩层 (z-index: 9999)
- 八卦旋转动画和阴阳鱼效果
- 多阶段进度指示
- 响应式状态管理

#### 状态管理机制
- 使用Vue3的响应式系统
- 基于观察者模式的状态订阅
- 自动状态同步和清理

# 六十四卦占卜应用

一个基于Vue 3和TypeScript开发的传统易经六十四卦占卜应用，结合现代AI技术提供专业的卦象解读。

## ✨ 主要功能

### 🎯 占卜方法
- **铜钱占卜法** - 模拟传统蓍草起卦法，最传统的占卜方式
- **梅花易数法** - 基于时间或数字起卦，数术与易学结合的精妙方法  
- **随机起卦法** - 简化的现代方法，快速获得指引

### 🧠 AI智能解读
- **多LLM支持** - 支持通义千问、OpenAI、文心一言、Claude等主流AI模型
- **专业解读** - 结合传统易学理论与现代生活场景
- **个性化分析** - 针对用户具体问题提供精准指导
- **本地备用** - 无API时自动使用本地基础解读

### 📊 数据完整性
- **完整卦象数据** - 包含六十四卦的彖辞、象辞、爻辞
- **精美SVG图像** - 传统卦象的现代化展示
- **数据一致性** - JSON数据与SVG图像完全匹配

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发运行
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 🔧 LLM API配置

### 方式一：界面配置（推荐）
1. 访问应用主页面
2. 找到"AI解读配置"面板
3. 选择LLM提供商（推荐通义千问）
4. 输入API密钥
5. 点击"测试连接"验证配置
6. 保存配置即可使用

### 方式二：环境变量配置
创建`.env`文件：
```env
# LLM服务提供商
VITE_LLM_PROVIDER=qianwen

# API密钥
VITE_LLM_API_KEY=your_api_key_here

# 自定义API地址（可选）
VITE_LLM_BASE_URL=

# 模型名称（可选）
VITE_LLM_MODEL=qwen-plus
```

### 支持的LLM提供商

#### 通义千问（推荐）
- **获取密钥**: [阿里云控制台](https://dashscope.console.aliyun.com/)
- **性价比**: ⭐⭐⭐⭐⭐
- **稳定性**: ⭐⭐⭐⭐⭐
- **默认模型**: qwen-plus

#### OpenAI
- **获取密钥**: [OpenAI Platform](https://platform.openai.com/)
- **性价比**: ⭐⭐⭐
- **稳定性**: ⭐⭐⭐⭐
- **默认模型**: gpt-3.5-turbo

#### 文心一言
- **获取密钥**: [百度智能云](https://console.bce.baidu.com/)
- **性价比**: ⭐⭐⭐⭐
- **稳定性**: ⭐⭐⭐⭐
- **默认模型**: ernie-3.5-8k

#### Claude
- **获取密钥**: [Anthropic Console](https://console.anthropic.com/)
- **性价比**: ⭐⭐⭐
- **稳定性**: ⭐⭐⭐⭐
- **默认模型**: claude-3-sonnet-20240229

## 🔒 隐私安全

- **本地存储**: API密钥仅存储在浏览器本地，不会上传到服务器
- **安全传输**: 所有API调用均使用HTTPS加密
- **最小权限**: 仅请求卦象解读所需的最少信息

## 🛠️ 项目结构

```
src/
├── public/
│   ├── hexagrams.json        # 卦象数据
│   ├── static/
│   │   └── hexagrams/        # 卦象SVG图像
│   ├── test-svg.html         # SVG测试页面
│   └── debug-hexagrams.html  # 调试页面
├── scripts/
│   └── generateHexagramSvgs.cjs  # SVG生成脚本
└── src/
    └── components/
        └── hexagram/
            └── HexagramDisplay.vue  # 卦象展示组件
```

## 🎨 特色功能

### 水墨风格UI
- 采用传统水墨画风格设计
- 动态墨滴效果和渐现动画
- 响应式布局，支持移动端

### 智能变爻分析
- 自动计算变爻位置
- 生成对应变卦
- 详细解读爻位变化意义

### 多维度解读
- 卦象基本含义
- 针对具体问题分析
- 行动建议和时机把握
- 变化趋势预测

## 🛠️ 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **状态管理**: Vue Composition API
- **图像**: SVG矢量图形
- **AI集成**: 多LLM提供商支持

## 📝 开发说明

### 数据流程
1. `hexagrams.txt` → Python脚本 → `hexagrams.json`
2. `hexagrams.json` → SVG生成脚本 → `public/static/hexagrams/`
3. 前端组件读取JSON数据和SVG图像
4. LLM API提供智能解读

### 核心组件
- `HexagramDivination.vue` - 主要占卜界面
- `HexagramDisplay.vue` - 卦象展示组件
- `LLMConfigPanel.vue` - AI配置面板
- `LLMService.ts` - AI服务封装

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢传统易学文化的智慧传承
- 感谢现代AI技术的赋能支持
- 感谢开源社区的无私贡献

## 🔄 最新修复 (2024-12-29)

### 玄选两难核心问题修复 (最新)
- ✅ **修复推荐逻辑错误**: 解决选项B匹配度85%但推荐选项A的问题
- ✅ **改进得分计算算法**: 
  - 新增64个卦象的性质修正值（主动性vs被动性）
  - 优化阴阳爻比例分析逻辑
  - 增强选项文本关键词分析
  - 改进变爻影响计算
- ✅ **修复选项分析混乱**: 基于实际得分生成准确的分析文本
- ✅ **增强本地回退分析**: LLM调用失败时提供高质量的本地解读
- ✅ **完善调试系统**: 添加详细的得分计算日志，便于问题排查

### API调用问题修复
- ✅ **修复通义千问API**: 使用OpenAI兼容接口格式
- ✅ **修复CORS代理**: 重新配置Vite代理规则
- ✅ **修复响应解析**: 统一响应数据结构处理
- ✅ **修复类型错误**: 解决LLMConfigPanel的TypeScript类型问题

### 动画系统修复
- ✅ **动画测试界面**: 完善`AnimationTest.vue`，支持多种动画效果预览
- ✅ **LLM调试面板**: 新增`LLMDebugPanel.vue`，实时监控LLM服务状态
- ✅ **动画集成修复**: 修复DilemmaPage中的LLM状态订阅机制
- ✅ **测试工具**: 在开发模式下添加动画测试按钮，方便调试

### 卦象数据问题诊断
- 🔧 **调试工具**: 新增`HexagramDataDebug.vue`专门诊断"卦象未找到"问题
- 🔧 **增强日志**: 在`hexagramGenerator.ts`中添加详细的调试日志
- 🔧 **错误追踪**: 改进错误处理机制，提供更准确的问题定位
- 🔧 **数据验证**: 加强数据加载状态检查和竞态条件处理

### 调试和测试工具
- 访问 `http://localhost:5173/#/debug/hexagram` 进行卦象数据调试
- 访问 `http://localhost:5173/#/debug/animation` 进行动画测试  
- 访问 `http://localhost:5173/test-api.html` 进行API测试验证
- 在DilemmaPage的开发模式下使用"🎭 测试LLM动画效果"按钮

### 技术改进
- 代理配置使用官方推荐的OpenAI兼容端点
- 统一API调用格式，提高稳定性
- 增强错误处理和用户反馈
- 完善动画状态管理和订阅机制
- 优化卦象数据加载和查找算法

## 🎲 使用方法

### 基础占卜
1. 在首页选择"六十四卦占卜"
2. 输入你想咨询的问题
3. 选择起卦方式（时间起卦/手动起卦）
4. 查看卦象解读

### 玄选两难
1. 选择"玄选两难"功能
2. 输入面临的两个选择
3. 描述当前困境
4. 获得基于易经智慧的分析和建议

### AI解读配置
1. 点击"展开AI配置"
2. 选择AI服务提供商
3. 输入API密钥
4. 可选：配置自定义模型和参数
5. 测试连接并保存

## 📁 项目结构

```
src/
├── components/          # 通用组件
│   ├── hexagram/       # 卦象显示组件
│   └── layout/         # 布局组件
├── features/           # 功能模块
│   └── dilemma/       # 占卜功能
│       ├── components/ # 占卜相关组件
│       ├── views/     # 占卜页面
│       └── types/     # 类型定义
├── services/          # 服务层
│   └── LLMService.ts  # AI服务接口
├── data/             # 数据文件
│   └── hexagrams.json # 六十四卦数据
└── shared/           # 共享资源
    ├── components/   # 共享组件
    └── utils/       # 工具函数
```

## 🔒 隐私与安全

- **本地存储**：API密钥仅存储在浏览器本地，不会上传到服务器
- **安全传输**：所有API调用都通过HTTPS加密传输
- **数据隔离**：每个用户的配置和历史记录完全独立
- **开源透明**：所有代码开源，可审计安全性

## 🛠️ 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **AI集成**: 多LLM提供商 (阿里云通义千问、OpenAI、百度文心一言、Anthropic Claude)
- **卦象数据**: 完整的六十四卦体系，包含卦辞、爻辞、象辞

## 📚 易经知识

本系统基于《周易》六十四卦体系，包含：
- **卦象**：六爻组合形成的六十四种基本卦象
- **卦辞**：对整个卦象的总体判断
- **爻辞**：对每一爻的具体说明
- **变爻**：发生变化的爻位，用于推演变卦
- **象辞**：《象传》中对卦象和爻象的解释

## 🤝 贡献指南

欢迎提交Issue和Pull Request：
1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

本项目基于MIT许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## ⚠️ 免责声明

本系统提供的占卜结果仅供娱乐和参考，不应作为重大决策的唯一依据。易经占卜是中华传统文化的一部分，请以理性态度对待占卜结果。

---

*"天行健，君子以自强不息；地势坤，君子以厚德载物。"*
```

本项目基于MIT许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## ⚠️ 免责声明

本系统提供的占卜结果仅供娱乐和参考，不应作为重大决策的唯一依据。易经占卜是中华传统文化的一部分，请以理性态度对待占卜结果。

---

*"天行健，君子以自强不息；地势坤，君子以厚德载物。"*
```

本项目基于MIT许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## ⚠️ 免责声明

本系统提供的占卜结果仅供娱乐和参考，不应作为重大决策的唯一依据。易经占卜是中华传统文化的一部分，请以理性态度对待占卜结果。

---

*"天行健，君子以自强不息；地势坤，君子以厚德载物。"*
```

2. 选择AI服务提供商
3. 输入API密钥
4. 可选：配置自定义模型和参数
5. 测试连接并保存

## 📁 项目结构

```
src/
├── components/          # 通用组件
│   ├── hexagram/       # 卦象显示组件
│   └── layout/         # 布局组件
├── features/           # 功能模块
│   └── dilemma/       # 占卜功能
│       ├── components/ # 占卜相关组件
│       ├── views/     # 占卜页面
│       └── types/     # 类型定义
├── services/          # 服务层
│   └── LLMService.ts  # AI服务接口
├── data/             # 数据文件
│   └── hexagrams.json # 六十四卦数据
└── shared/           # 共享资源
    ├── components/   # 共享组件
    └── utils/       # 工具函数
```

## 🔒 隐私与安全

- **本地存储**：API密钥仅存储在浏览器本地，不会上传到服务器
- **安全传输**：所有API调用都通过HTTPS加密传输
- **数据隔离**：每个用户的配置和历史记录完全独立
- **开源透明**：所有代码开源，可审计安全性

## 🛠️ 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **AI集成**: 多LLM提供商 (阿里云通义千问、OpenAI、百度文心一言、Anthropic Claude)
- **卦象数据**: 完整的六十四卦体系，包含卦辞、爻辞、象辞

## 📚 易经知识

本系统基于《周易》六十四卦体系，包含：
- **卦象**：六爻组合形成的六十四种基本卦象
- **卦辞**：对整个卦象的总体判断
- **爻辞**：对每一爻的具体说明
- **变爻**：发生变化的爻位，用于推演变卦
- **象辞**：《象传》中对卦象和爻象的解释

## 🤝 贡献指南

欢迎提交Issue和Pull Request：
1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

本项目基于MIT许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## ⚠️ 免责声明

本系统提供的占卜结果仅供娱乐和参考，不应作为重大决策的唯一依据。易经占卜是中华传统文化的一部分，请以理性态度对待占卜结果。

---

*"天行健，君子以自强不息；地势坤，君子以厚德载物。"*
```

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

### hexagrams.json 字段说明

- sequence：卦序号（1~64）
- name：卦名
- nature：卦象（如“乾上乾下”）
- description：卦辞
- tuan_text：彖辞（对卦象的哲学解读）
- xiang_text：象辞（对卦象和爻辞的象征解读）
- yao_texts：六爻辞
- lines：阴阳线（1为阳，0为阴）
- binary_representation：二进制表示

#### 示例
```json
{
  "1": {
    "sequence": 1,
    "name": "乾",
    "nature": "乾上乾下",
    "description": "元，亨，利，贞。",
    "tuan_text": "...",
    "xiang_text": "...",
    "yao_texts": [...],
    "lines": [1,1,1,1,1,1],
    "binary_representation": "111111"
  }
}
```
```

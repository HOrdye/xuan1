# 天玄 Web 设计提示词总表（用于 Google Stitch）

- 项目栈：Vue 3 + Vite，TypeScript，Vue Router，Pinia；界面有全局头/脚、导航栏与一套神秘风格视觉。
- 数据与主题：易经六十四卦（public/hexagrams.json 与 src/features/dilemma/utils/*），塔罗牌、求签（掷筊），个性化运势与历史记录。
- 目标：生成高一致性的现代东方神秘学 UI，适配移动优先，暗色为主，轻微霓虹与玻璃拟态，强调神秘符号与质感动效。
- 设计基调关键词：神秘、仪式感、东方符号、丝绸/纸纹理、细颗粒噪点、紫/靛/青绿点缀、柔和发光、卡片分层、3D 轻动效。

---

## 全局设计系统（Design System）

Prompt（复制到 Stitch）：
- 为一款名为“天玄 TianXuan”的玄学占卜应用创建一套暗色、神秘气质的 UI 设计系统。
- 色彩：深靛蓝（#0b1020）、乌曜黑（#0a0f14）、霓虹紫（#7a5cff）、翡翠青（#27e1c1）、柔金色（#d4b87b）。提供浅色模式映射与 90% 透明覆盖层方案。
- 字体：标题采用具有宋体风格的衬线展示字体，正文字体使用现代无衬线，层级分明，良好的中文排版支持。
- 组件风格：玻璃拟态卡片（轻颗粒噪点）、幽灵按钮、胶囊开关、分段控制、模态与抽屉面板。
- 图标语汇：八卦与六爻线、塔罗花色、铜钱/令牌、香烟雾元素。
- 动效：200–300ms 柔和缓出，主视图符印有视差；成功时微粒/闪光的细微交互。
- 布局：移动优先，4/8 间距栅格；安全区；移动端底部标签栏，桌面端左侧导航。
- 状态：提供加载骨架、空状态、错误状态，配以简短诗性文案。
- 交付：输出颜色/圆角/阴影/间距/层级等 Design Tokens。

---

## 导航与框架（Layout & Navigation）

文件参考：`src/components/AppNavbar.vue`、`src/shared/components/layout/AppHeader.vue`、`src/shared/components/layout/AppFooter.vue`、`src/router/index.ts`

Prompt：
- 设计吸顶头部：左侧为神秘符印与“天玄 TianXuan”字样，右侧为极简操作区（登录/头像、分享、设置）。
- 移动端：底部标签栏 5 项——首页、六十四卦、塔罗、掷筊、我的；高亮态发光指示。
- 桌面端：左侧导航栏同样的入口；内容区居中并限制最大宽度。
- 页脚：柔和品牌文案与 About/设置链接。

---

## 首页 `Home`（`src/views/Home.vue` / `HomePage.vue`）

Prompt：
- 英雄区使用神秘背景（`magic-sigil.svg`），主召唤卡片 CTA：“开始占卜”。
- 快速入口：六十四卦、塔罗占卜、掷筊求签、个性化运势。
- 若存在最近一次运势，展示摘要卡片与“查看历史”按钮。
- 使用柔和光晕渐变与轻微漂浮粒子。

---

## 六十四卦浏览 `Hexagram Explorer`（`src/views/HexagramExplorer.vue` + `public/hexagrams.json`）

Prompt：
- 64 张卦象卡片网格；每卡展示中文/英文名、卦号、上下卦图形。
- 顶部筛选：元素、属性、主题标签（参考 `hexagramAttributes.ts`）。
- 详情抽屉：卦辞、爻辞、现代解读（参考 `enhanceModernInterpretations.ts`）。
- 线性卦图优雅呈现，可选择变爻；提供复制/分享操作。

---

## 占卜引导与结果 `Dilemma / Hexagram Divination`（`src/features/dilemma`）

页面：`HexagramDivination.vue`、`DilemmaPage.vue`、`ScenarioAnalysisResult.vue`

Prompt：
- 分步流程：1）设定问题与场景；2）硬币投掷动画；3）生成本卦/变卦；4）AI 场景分析与建议。
- 硬币投掷动画具有金属质感与柔和高光（参考 `CoinDivinationAnimation.vue`），完成后呈现轻烟/火花特效。
- 结果页：左右双卡片（本卦 vs 变卦），下方为情景建议卡片流（行动建议、风险提示、时机判断）。
- 支持保存结果与生成分享图（包含卦象与摘要语）。

---

## 个性化运势 `Fortune`（`src/features/fortune`）

页面：`FortunePage.vue`、`FortuneView.vue`；组件：`FortuneCard.vue`、`FortuneEnvelope.vue`、`AIAnalysisDisplay.vue`

Prompt：
- 信笺开封仪式：“信封展开”动画露出运势卡片。
- 日期选择（阳历/阴历切换），最小化用户信息表单。
- 运势卡片包含今日/本周/本月建议，并分栏展示情感/事业/健康，使用轻量图标。
- 一键保存到历史；生成带品牌元素的可分享长图。

---

## 塔罗牌 `Tarot`（`src/features/tarot`）

页面：`TarotPage.vue`；组件：`TarotSpread.vue`、`TarotCard.vue`、`LovePyramidLayout.vue`

Prompt：
- 牌组选择（标准/故事/完整），包含洗牌动效与翻牌交互。
- 牌阵类型：三张牌（过去/现在/未来）、恋爱金字塔牌阵等。
- 卡面设计：金边、布纹、浮雕图案；翻面时发光描边高亮。
- 解读面板：正位/逆位含义、AI 建议与行动清单。

---

## 掷筊求签 `JiaoBei`（`src/features/jiao-bei` 与 `src/features/divination`）

页面：`JiaoBeiPage.vue`；组件：`JiaoBei3DAnimation.vue`、`JiaoBei.vue`

Prompt：
- 3D 木质筊杯，布面案几，柔和体积光；抛掷具物理落地与轻烟特效。
- 结果态：圣杯 / 笑杯 / 阴杯，附简短签文与引导建议。
- 行为：再试一次、保存结果、分享。

---

## 历史与收藏 `History`（`src/views/HistoryPage.vue`、`HistoryDetail.vue`、`Favorites.vue`）

Prompt：
- 历史列表：按时间分组的卡片时间线，展示类型图标（卦/塔罗/筊杯）。
- 详情页：完整记录、生成时上下文、AI 建议摘要、再次解读按钮。
- 收藏夹：固定展示常用卡片与置顶条目。

---

## 个人中心与设置 `Profile / Settings`（`src/views/Profile.vue`、`ProfileEdit.vue`、`NotificationSettings.vue`）

组件：`AvatarSelector.vue`、`GlobalLLMConfig.vue`、`ModernAuthModal.vue`

Prompt：
- 个人资料卡：头像（符印式选择器）、昵称、签名；神秘框体与细金边装饰。
- 设置页：通知开关、主题切换（暗/亮/自动）、LLM 提示词与模型选择（参考 `GlobalLLMConfig.vue`）。
- 登录/注册模态：半透明幕布、呼吸光圈的主要按钮。

---

## 共享与社交 `Share`（`src/components/common/SharePanel.vue`、`src/utils/shareUtils.ts`）

Prompt：
- “分享长图”模板：顶部品牌标识，中部核心结论与卦/牌视觉，要点 bullet 列表，底部二维码/链接。
- 快速分享：复制摘要、一键保存图片、朋友圈适配留白。

---

## 系统与调试 `System / Debug`（`src/views/LLMDebug.vue`、`src/components/debug/DebugPanel.vue`）

Prompt：
- LLM 请求/响应查看面板，Token 计数条，错误高亮与定位。
- 网络状态与重试按钮；整体采用简洁、工程化风格（无需神秘化）。

---

## 404 与 About（`src/views/NotFound.vue`、`About.vue`）

Prompt：
- 404：漂浮纸片与消散烟雾，提供“返回首页”。
- About：品牌故事与理念（“以东方智慧照亮抉择”）、版权与版本号。

---

## 全局空/错/载状态（跨页通用）

Prompt：
- Skeleton：卡片骨架屏与文本占位，含光带闪烁。
- Empty：诗性短句与淡化符号（卦/牌/符印），一键开始引导。
- Error：温和红色点缀与重试；提供“复制错误详情”。

---

## 设计交付要求（给 Stitch 的输出）

- 提供 Design Tokens（颜色/半径/阴影/层级/动效）。
- 组件库：Button、Card、Tabs、Chips、Modal、Drawer、Stepper、Toast、Skeleton、SharePanel、LLMConfig、AuthModal。
- 屏幕模板：上述每个页面至少 1–2 个状态（默认/加载/结果）。
- 响应式断点：320 / 375 / 390 / 768 / 1024 / 1280。
- 资源导出：PNG + SVG 图标与插图；动效以 Lottie 或 CSS 可实现为准。

---

## 关键文件线索（供设计联动参考）

- 路由与页面：`src/router/index.ts`，`src/views/*`
- 功能域：`src/features/dilemma/*`、`src/features/fortune/*`、`src/features/tarot/*`、`src/features/jiao-bei/*`
- 共享组件：`src/components/*`、`src/shared/components/layout/*`
- 数据：`public/hexagrams.json`；`src/services/*`（AI、用户、历史等）
- 品牌与背景：`src/assets/*`（sigil、卡背、全局纹理）

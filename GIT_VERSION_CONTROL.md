# Git版本控制配置指南

## 📋 项目概述

**项目名称**: 天玄Web - 玄学决策助手  
**版本**: v1.0.0  
**技术栈**: Vue.js 3 + TypeScript + Tailwind CSS  

## 🔧 Git配置

### 分支策略

```
main (主分支)
├── develop (开发分支)
├── feature/功能名称 (功能分支)
├── hotfix/修复名称 (热修复分支)
└── release/版本号 (发布分支)
```

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### 提交类型 (type)

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动
- `perf`: 性能优化
- `ci`: CI/CD相关
- `build`: 构建系统或外部依赖变更

#### 示例

```bash
# 新功能
git commit -m "feat(dilemma): 添加玄选两难AI分析功能"

# 修复bug
git commit -m "fix(animation): 修复AI加载动画卡住问题"

# 文档更新
git commit -m "docs: 更新README文档"

# 代码重构
git commit -m "refactor(llm): 重构LLM服务加载状态管理"
```

## 🚀 工作流程

### 1. 初始化项目

```bash
# 克隆项目
git clone <repository-url>
cd windsurf-xuan

# 安装依赖
npm install

# 创建开发分支
git checkout -b develop
```

### 2. 开发新功能

```bash
# 从develop分支创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/新功能名称

# 开发完成后提交
git add .
git commit -m "feat(scope): 新功能描述"

# 推送到远程
git push origin feature/新功能名称
```

### 3. 合并功能分支

```bash
# 切换到develop分支
git checkout develop
git pull origin develop

# 合并功能分支
git merge feature/新功能名称

# 推送到远程
git push origin develop
```

### 4. 发布版本

```bash
# 从develop创建发布分支
git checkout develop
git checkout -b release/v1.0.0

# 版本号更新
# 修改package.json中的version
# 更新CHANGELOG.md

# 提交版本更新
git add .
git commit -m "chore(release): 发布v1.0.0版本"

# 合并到main分支
git checkout main
git merge release/v1.0.0

# 打标签
git tag -a v1.0.0 -m "版本v1.0.0发布"

# 推送
git push origin main
git push origin v1.0.0
```

## 📁 文件结构说明

### 需要版本控制的文件

- `src/` - 源代码
- `public/` - 静态资源
- `package.json` - 项目配置
- `vite.config.ts` - 构建配置
- `tailwind.config.js` - 样式配置
- `tsconfig.json` - TypeScript配置
- `README.md` - 项目文档
- `docs/` - 文档目录

### 不需要版本控制的文件

- `node_modules/` - 依赖包
- `dist/` - 构建输出
- `.env` - 环境变量
- `*.log` - 日志文件
- `debug/` - 调试文件

## 🔒 安全注意事项

1. **环境变量**: 确保 `.env` 文件不被提交到版本控制
2. **API密钥**: 不要在代码中硬编码API密钥
3. **敏感信息**: 避免提交包含敏感信息的文件

## 📝 版本历史

### v1.0.0 (当前版本)
- ✅ 玄选两难功能
- ✅ 六十四卦占卜
- ✅ 塔罗牌解读
- ✅ 今日运势
- ✅ AI智能分析
- ✅ 用户认证系统
- ✅ 历史记录管理

## 🛠️ 常用Git命令

```bash
# 查看状态
git status

# 查看分支
git branch -a

# 查看提交历史
git log --oneline

# 查看文件变更
git diff

# 撤销工作区修改
git checkout -- <file>

# 撤销暂存区修改
git reset HEAD <file>

# 创建并切换分支
git checkout -b <branch-name>

# 删除分支
git branch -d <branch-name>

# 查看远程仓库
git remote -v

# 拉取最新代码
git pull origin <branch-name>

# 推送代码
git push origin <branch-name>
```

## 📞 联系信息

如有问题，请联系项目维护者。 
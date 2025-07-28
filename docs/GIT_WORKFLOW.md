# Git工作流程指南

## 🎯 概述

本文档详细说明了天玄Web项目的Git工作流程，确保团队协作的规范性和代码质量。

## 🌿 分支策略

### 主要分支

- **main**: 主分支，用于生产环境
- **develop**: 开发分支，用于集成功能
- **feature/***: 功能分支，用于开发新功能
- **hotfix/***: 热修复分支，用于紧急修复
- **release/***: 发布分支，用于版本发布

### 分支命名规范

```
feature/功能名称
hotfix/修复描述
release/版本号
```

示例：
- `feature/dilemma-ai-analysis`
- `hotfix/animation-stuck-issue`
- `release/v1.0.0`

## 📝 提交规范

### Conventional Commits

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 提交类型

| 类型 | 描述 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(dilemma): 添加AI分析功能` |
| `fix` | 修复bug | `fix(animation): 修复加载动画卡住问题` |
| `docs` | 文档更新 | `docs: 更新README文档` |
| `style` | 代码格式调整 | `style: 格式化代码` |
| `refactor` | 代码重构 | `refactor(llm): 重构LLM服务` |
| `test` | 测试相关 | `test: 添加单元测试` |
| `chore` | 构建过程或辅助工具 | `chore: 更新依赖包` |
| `perf` | 性能优化 | `perf: 优化渲染性能` |
| `ci` | CI/CD相关 | `ci: 配置GitHub Actions` |
| `build` | 构建系统变更 | `build: 更新Vite配置` |

### 作用域 (Scope)

- `dilemma`: 玄选两难功能
- `tarot`: 塔罗牌功能
- `fortune`: 运势功能
- `auth`: 认证系统
- `ui`: 用户界面
- `llm`: AI服务
- `animation`: 动画效果

## 🚀 工作流程

### 1. 开始新功能开发

```bash
# 确保在develop分支
git checkout develop
git pull origin develop

# 创建功能分支
git checkout -b feature/新功能名称

# 开始开发...
```

### 2. 开发过程中的提交

```bash
# 使用提交脚本
./scripts/git-commit.sh feat scope "功能描述"

# 或手动提交
git add .
git commit -m "feat(scope): 功能描述"
```

### 3. 完成功能开发

```bash
# 推送到远程
git push origin feature/新功能名称

# 创建Pull Request到develop分支
# 在GitHub/GitLab上创建PR
```

### 4. 代码审查

- 至少需要1个审查者批准
- 所有CI检查必须通过
- 解决所有审查意见

### 5. 合并到develop

```bash
# 合并PR后，删除功能分支
git checkout develop
git pull origin develop
git branch -d feature/新功能名称
```

### 6. 发布版本

```bash
# 从develop创建发布分支
git checkout develop
git checkout -b release/v1.0.0

# 更新版本号
# 修改package.json中的version
# 更新CHANGELOG.md

# 提交版本更新
git add .
git commit -m "chore(release): 发布v1.0.0版本"

# 合并到main
git checkout main
git merge release/v1.0.0

# 打标签
git tag -a v1.0.0 -m "版本v1.0.0发布"

# 推送
git push origin main
git push origin v1.0.0

# 删除发布分支
git branch -d release/v1.0.0
```

### 7. 热修复

```bash
# 从main创建热修复分支
git checkout main
git checkout -b hotfix/紧急修复描述

# 修复问题
# 提交修复
git add .
git commit -m "fix: 紧急修复描述"

# 合并到main和develop
git checkout main
git merge hotfix/紧急修复描述

git checkout develop
git merge hotfix/紧急修复描述

# 删除热修复分支
git branch -d hotfix/紧急修复描述
```

## 🛠️ 工具和脚本

### 提交脚本

使用提供的提交脚本确保提交信息规范：

```bash
./scripts/git-commit.sh feat dilemma "添加AI分析功能"
```

### Git钩子

项目配置了pre-commit钩子，会在提交前自动运行：

- ESLint代码检查
- TypeScript类型检查

### 常用命令

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

# 查看远程仓库
git remote -v

# 拉取最新代码
git pull origin <branch-name>

# 推送代码
git push origin <branch-name>
```

## 📋 检查清单

### 提交前检查

- [ ] 代码通过ESLint检查
- [ ] TypeScript类型检查通过
- [ ] 所有测试通过
- [ ] 提交信息符合规范
- [ ] 没有调试代码
- [ ] 没有敏感信息

### 合并前检查

- [ ] 代码审查通过
- [ ] CI/CD检查通过
- [ ] 功能测试通过
- [ ] 文档已更新
- [ ] 版本号已更新（如需要）

## 🔒 安全注意事项

1. **环境变量**: 确保 `.env` 文件不被提交
2. **API密钥**: 不要在代码中硬编码API密钥
3. **敏感信息**: 避免提交包含敏感信息的文件
4. **大文件**: 避免提交大文件到Git仓库

## 📞 问题解决

### 常见问题

1. **提交被拒绝**: 检查pre-commit钩子输出
2. **合并冲突**: 手动解决冲突后重新提交
3. **分支混乱**: 使用 `git log --graph` 查看分支图

### 获取帮助

- 查看 [Git文档](https://git-scm.com/doc)
- 参考 [Conventional Commits](https://www.conventionalcommits.org/)
- 联系项目维护者 
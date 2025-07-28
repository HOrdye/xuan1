# Windows环境下的Git版本控制指南

## 🖥️ Windows环境配置

### 系统要求
- Windows 10/11
- PowerShell 5.1+ 或 PowerShell Core 7+
- Git for Windows 2.30+
- Node.js 16+

### 安装Git for Windows
1. 访问 [Git for Windows](https://gitforwindows.org/)
2. 下载并安装最新版本
3. 安装时选择默认选项即可

## 🚀 快速开始

### 1. 检查Git状态
```cmd
# 使用批处理脚本
.\scripts\check-git-status.bat

# 或使用npm脚本
npm run git:check
```

### 2. 执行Git版本控制
```cmd
# 使用批处理脚本
.\scripts\execute-git-control.bat

# 或使用npm脚本
npm run git:init
```

### 3. 规范化提交
```cmd
# 使用批处理脚本
.\scripts\git-commit.bat feat dilemma "添加AI分析功能"

# 或使用npm脚本
npm run git:commit-msg feat dilemma "添加AI分析功能"
```

### 4. 创建版本发布
```cmd
# 使用批处理脚本
.\scripts\create-release.bat v1.0.0

# 或使用npm脚本
npm run git:release v1.0.0
```

## 📋 可用的脚本

### 批处理脚本 (.bat)
| 脚本 | 功能 | 使用方法 |
|------|------|----------|
| `check-git-status.bat` | 检查Git状态 | `.\scripts\check-git-status.bat` |
| `execute-git-control.bat` | 执行Git版本控制 | `.\scripts\execute-git-control.bat` |
| `git-commit.bat` | 规范化提交 | `.\scripts\git-commit.bat <type> <scope> <description>` |
| `create-release.bat` | 创建版本发布 | `.\scripts\create-release.bat <version>` |

### NPM脚本
| 脚本 | 功能 | 使用方法 |
|------|------|----------|
| `git:check` | 检查Git状态 | `npm run git:check` |
| `git:init` | 执行Git版本控制 | `npm run git:init` |
| `git:commit-msg` | 规范化提交 | `npm run git:commit-msg <type> <scope> <description>` |
| `git:release` | 创建版本发布 | `npm run git:release <version>` |

## 📝 提交规范

### 提交类型 (type)
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具

### 作用域 (scope)
- `core`: 核心功能
- `dilemma`: 玄选两难功能
- `divination`: 占卜功能
- `tarot`: 塔罗牌功能
- `fortune`: 运势功能
- `auth`: 认证功能
- `ui`: 用户界面
- `api`: API接口

### 示例
```cmd
# 新功能
.\scripts\git-commit.bat feat dilemma "添加AI分析功能"

# 修复bug
.\scripts\git-commit.bat fix ui "修复导航栏显示问题"

# 文档更新
.\scripts\git-commit.bat docs core "更新README文档"

# 代码重构
.\scripts\git-commit.bat refactor api "重构LLM服务接口"
```

## 🔧 常见问题

### 1. 脚本无法执行
**问题**: 双击.bat文件没有反应
**解决方案**: 
- 右键点击.bat文件 → "以管理员身份运行"
- 或在PowerShell中运行: `.\scripts\script-name.bat`

### 2. 中文显示乱码
**问题**: 脚本中的中文显示为乱码
**解决方案**:
- 确保PowerShell使用UTF-8编码
- 运行: `chcp 65001`
- 或在脚本开头添加: `@echo off` 和 `chcp 65001 >nul`

### 3. Git命令找不到
**问题**: `git` 命令无法识别
**解决方案**:
- 重新安装Git for Windows
- 确保Git已添加到系统PATH
- 重启PowerShell或命令提示符

### 4. 权限不足
**问题**: 无法创建文件或执行操作
**解决方案**:
- 以管理员身份运行PowerShell
- 检查文件夹权限
- 确保有写入权限

## 🎯 最佳实践

### 1. 工作流程
1. 开发前拉取最新代码: `git pull origin main`
2. 创建功能分支: `git checkout -b feature/功能名称`
3. 开发完成后提交: `.\scripts\git-commit.bat feat scope "功能描述"`
4. 推送到远程: `git push origin feature/功能名称`
5. 创建Pull Request

### 2. 版本管理
1. 开发完成后合并到develop分支
2. 测试通过后合并到main分支
3. 创建版本标签: `.\scripts\create-release.bat v1.0.0`
4. 推送标签: `git push origin v1.0.0`

### 3. 代码质量
- 提交前运行代码检查: `npm run lint`
- 确保所有测试通过: `npm run test`
- 遵循代码规范

## 📚 相关文档

- [Git版本控制配置](./GIT_VERSION_CONTROL.md)
- [Git工作流程](./GIT_WORKFLOW.md)
- [项目变更日志](../CHANGELOG.md)
- [Conventional Commits规范](https://www.conventionalcommits.org/)

## 🆘 获取帮助

如果遇到问题，可以：
1. 查看错误信息
2. 检查Git状态: `.\scripts\check-git-status.bat`
3. 查看项目文档
4. 联系开发团队 
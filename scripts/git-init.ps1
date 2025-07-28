# Git版本控制脚本 (PowerShell版本)
# 使用方法: .\scripts\git-init.ps1

# 设置控制台编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "🚀 开始执行Git版本控制..." -ForegroundColor Blue
Write-Host "================================" -ForegroundColor Blue

# 检查Git是否初始化
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git未初始化" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host "✅ Git已初始化" -ForegroundColor Green

# 检查当前分支
$currentBranch = git branch --show-current 2>$null
Write-Host "📋 当前分支: $currentBranch" -ForegroundColor Blue

# 添加所有文件
Write-Host "📁 添加文件到暂存区..." -ForegroundColor Blue
git add .

# 检查是否有内容需要提交
$stagedFiles = git diff --cached --name-only
if ($stagedFiles.Count -eq 0) {
    Write-Host "⚠️  暂存区为空，没有需要提交的文件" -ForegroundColor Yellow
} else {
    Write-Host "✅ 文件已添加到暂存区" -ForegroundColor Green
    Write-Host "📁 将要提交 $($stagedFiles.Count) 个文件" -ForegroundColor Blue
    
    # 显示主要文件
    Write-Host "📋 主要文件:" -ForegroundColor Blue
    $stagedFiles | Select-Object -First 5 | ForEach-Object { Write-Host "  $_" }
    
    Write-Host ""
    Write-Host "💾 正在提交..." -ForegroundColor Blue
    
    # 创建提交信息
    $commitMessage = @"
feat(core): 完善Git版本控制配置

- 📝 更新.gitignore文件，添加Vue.js项目标准忽略规则
- 📚 创建Git版本控制配置文档 (GIT_VERSION_CONTROL.md)
- 📋 创建项目变更日志 (CHANGELOG.md)
- 🔧 更新package.json版本信息和Git脚本
- 🛠️ 创建Git提交脚本 (scripts/git-commit.sh)
- 🔗 创建Git钩子配置 (.husky/pre-commit)
- 📖 创建详细工作流程文档 (docs/GIT_WORKFLOW.md)
- 🏷️ 创建版本发布脚本 (scripts/create-release.sh)
- 🎯 实现规范化提交和分支管理策略

技术改进:
- 规范化Git工作流程
- 自动化版本管理
- 代码质量检查
- 团队协作规范
"@
    
    # 执行提交
    $commitMessage | git commit -F -
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 提交成功!" -ForegroundColor Green
        
        # 显示提交信息
        Write-Host "📝 提交信息:" -ForegroundColor Blue
        git log --oneline -1
    } else {
        Write-Host "❌ 提交失败" -ForegroundColor Red
        Read-Host "按任意键退出"
        exit 1
    }
}

# 创建develop分支（如果不存在）
$branches = git branch --format="%(refname:short)"
if ($branches -notcontains "develop") {
    Write-Host "🌿 创建develop分支..." -ForegroundColor Blue
    git checkout -b develop
    Write-Host "✅ develop分支创建成功" -ForegroundColor Green
} else {
    Write-Host "✅ develop分支已存在" -ForegroundColor Green
}

# 显示最终状态
Write-Host ""
Write-Host "📊 Git状态:" -ForegroundColor Blue
git status --short

Write-Host ""
Write-Host "📝 最近的提交:" -ForegroundColor Blue
git log --oneline -3

Write-Host ""
Write-Host "🎉 Git版本控制执行完成!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Blue
Write-Host ""
Write-Host "📋 下一步操作建议:" -ForegroundColor Blue
Write-Host "1. 设置远程仓库: git remote add origin <your-repository-url>"
Write-Host "2. 推送代码: git push -u origin main"
Write-Host "3. 推送develop分支: git push -u origin develop"
Write-Host "4. 查看Git状态: .\scripts\check-git-status.bat"
Write-Host ""
Write-Host "✅ 所有Git版本控制配置已完成!" -ForegroundColor Green

Read-Host "按任意键退出" 
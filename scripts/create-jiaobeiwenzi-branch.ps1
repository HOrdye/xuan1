# 创建筊杯文字优化分支脚本
# 使用方法: .\scripts\create-jiaobeiwenzi-branch.ps1

Write-Host "🎯 创建筊杯文字优化分支" -ForegroundColor Magenta
Write-Host "=================================" -ForegroundColor Blue

# 检查Git是否初始化
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git未初始化，请先初始化Git仓库" -ForegroundColor Red
    Read-Host "按任意键继续"
    exit 1
}
Write-Host "✅ Git已初始化" -ForegroundColor Green

# 获取当前分支
$currentBranch = git branch --show-current
Write-Host "📋 当前分支: $currentBranch" -ForegroundColor Blue

# 检查是否有未提交的更改
$hasChanges = git diff-index --quiet HEAD --
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  检测到未提交的更改，正在添加所有文件..." -ForegroundColor Yellow
    git add .
    
    # 显示将要提交的文件
    Write-Host "📁 将要提交的文件:" -ForegroundColor Blue
    git diff --cached --name-only | Select-Object -First 5 | ForEach-Object { Write-Host "  $_" -ForegroundColor Cyan }
    
    # 创建提交信息
    $commitMsg = @"
feat(jiaobei): 优化筊杯界面文字和布局

- 🎨 去除"3D"、"AI"等技术词汇，使用神秘专业语言
- 📝 优化传统礼仪部分，提炼重点步骤
- 🔍 简化筊杯结果说明，去除抽象图案
- 🎯 统一字体样式，与项目整体保持一致
- 🏗️  优化布局结构，提升信息层次清晰度
"@
    
    # 提交更改
    Write-Host "📝 正在提交更改..." -ForegroundColor Blue
    $commitMsg | git commit -F -
    
    # 显示提交结果
    Write-Host "✅ 提交完成!" -ForegroundColor Green
    git log --oneline -1
} else {
    Write-Host "✅ 工作区干净，无需提交" -ForegroundColor Green
}

# 创建并切换到新分支
Write-Host "🌿 正在创建 jiaobeiwenzi 分支..." -ForegroundColor Blue
git checkout -b jiaobeiwenzi

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 成功创建并切换到 jiaobeiwenzi 分支" -ForegroundColor Green
    $newBranch = git branch --show-current
    Write-Host "📋 当前分支: $newBranch" -ForegroundColor Blue
} else {
    Write-Host "❌ 创建分支失败" -ForegroundColor Red
    Read-Host "按任意键继续"
    exit 1
}

# 显示分支状态
Write-Host "📊 分支状态:" -ForegroundColor Blue
git status --short

Write-Host ""
Write-Host "🎉 筊杯文字优化分支创建完成!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Blue
Write-Host "📋 下一步操作建议:" -ForegroundColor Cyan
Write-Host "1. 推送新分支到远程: git push -u origin jiaobeiwenzi" -ForegroundColor Yellow
Write-Host "2. 继续开发或测试功能" -ForegroundColor Yellow
Write-Host "3. 完成后合并到主分支" -ForegroundColor Yellow
Write-Host "4. 删除临时分支: git branch -d jiaobeiwenzi" -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ 所有操作已完成!" -ForegroundColor Green

Read-Host "按任意键继续"


















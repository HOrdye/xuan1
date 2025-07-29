# PowerShell脚本：创建dev-ui2分支并提交UI优化修改
# 使用方法: .\scripts\create-dev-ui2.ps1

Write-Host "🚀 开始创建dev-ui2分支并提交UI优化修改..." -ForegroundColor Cyan

# 检查Git是否初始化
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git未初始化，请先初始化Git仓库" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git已初始化" -ForegroundColor Green

# 获取当前分支
$currentBranch = git branch --show-current
Write-Host "📋 当前分支: $currentBranch" -ForegroundColor Blue

# 检查是否有未提交的修改
$hasChanges = git diff-index --quiet HEAD --
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ 检测到未提交的修改，正在添加所有文件..." -ForegroundColor Yellow
    git add .
    
    # 显示修改的文件
    Write-Host "📝 修改的文件:" -ForegroundColor Blue
    $modifiedFiles = git diff --cached --name-only
    $modifiedFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
    
    # 创建提交信息
    $commitMsg = @"
feat(ui): 易经占卜界面年轻化重构与交互优化

🎨 易经占卜界面年轻化创意重构
- 主标题改为"待我掐指一算"，增加趣味性和仪式感
- 副标题改为"三种传统占卜方式，仪式感满满"
- 方法选择标题改为"Pick Your Magic"，增加国际化元素
- 占卜方法描述改为年轻化表达，如"仪式感拉满"、"精妙绝伦"
- 问题输入区域改为"说出你的困惑"，更贴近年轻人表达
- 按钮文字改为"掐指一算"，增加神秘感和趣味性
- 解决文字模糊问题，采用深色文字配合浅色背景
- 采用年轻化的设计风格，白色半透明卡片配合紫色主题

🔧 梅花易数法选项与AI动画年轻化优化
- 梅花易数法起卦方式选项重构为卡片式设计
- 时间起卦和数字起卦选项采用图标+描述的形式
- 选项交互效果优化，悬停和选中状态更加明显
- AI加载动画背景改为浅色渐变，符合年轻化风格
- AI动画文字颜色改为深色，确保清晰可读
- AI动画标题改为"正在掐指一算"等年轻化表达
- AI动画提示文字增加年轻化内容

📋 技术实现
- 背景重构：从深色星空背景改为浅色渐变背景
- 卡片设计：白色半透明卡片配合紫色边框和阴影
- 文字优化：深色文字确保清晰可读，增加字重提升层次
- 交互反馈：悬停效果更加明显，选中状态更加突出
- 响应式设计：保持在不同设备上的良好显示效果
- 性能优化：简化背景动画，提升页面加载速度
"@
    
    # 提交修改
    $commitMsg | git commit -F -
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 修改已提交到 $currentBranch 分支" -ForegroundColor Green
        git log --oneline -1
    } else {
        Write-Host "❌ 提交失败" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ 工作区干净，无需提交" -ForegroundColor Green
}

# 创建并切换到dev-ui2分支
Write-Host "🌿 创建并切换到dev-ui2分支..." -ForegroundColor Blue
git checkout -b dev-ui2
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 已切换到dev-ui2分支" -ForegroundColor Green
} else {
    Write-Host "⚠️ dev-ui2分支可能已存在，正在切换..." -ForegroundColor Yellow
    git checkout dev-ui2
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 切换到dev-ui2分支失败" -ForegroundColor Red
        exit 1
    }
}

# 显示分支状态
Write-Host "📊 当前分支状态:" -ForegroundColor Blue
git branch --show-current
Write-Host ""

# 显示最近的提交
Write-Host "📝 最近的提交记录:" -ForegroundColor Blue
git log --oneline -3
Write-Host ""

# 显示文件状态
Write-Host "📋 文件状态:" -ForegroundColor Blue
git status --short
Write-Host ""

Write-Host "🎉 dev-ui2分支创建完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 下一步操作建议:" -ForegroundColor Cyan
Write-Host "1. 推送dev-ui2分支到远程: git push -u origin dev-ui2" -ForegroundColor White
Write-Host "2. 在远程仓库创建Pull Request" -ForegroundColor White
Write-Host "3. 代码审查通过后合并到主分支" -ForegroundColor White
Write-Host "4. 删除临时分支: git branch -d dev-ui2" -ForegroundColor White
Write-Host ""
Write-Host "✅ dev-ui2分支创建和UI优化提交完成！" -ForegroundColor Green 
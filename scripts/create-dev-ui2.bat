@echo off
setlocal enabledelayedexpansion

REM 设置颜色代码
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "MAGENTA=[95m"
set "CYAN=[96m"
set "NC=[0m"

echo %CYAN%🚀 开始创建dev-ui2分支并提交UI优化修改...%NC%

REM 检查Git是否初始化
if not exist ".git" (
    echo %RED%❌ Git未初始化，请先初始化Git仓库%NC%
    exit /b 1
)

echo %GREEN%✅ Git已初始化%NC%

REM 获取当前分支
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set CURRENT_BRANCH=%%i
echo %BLUE%📋 当前分支: %CURRENT_BRANCH%%NC%

REM 检查是否有未提交的修改
git diff-index --quiet HEAD --
if !errorlevel! neq 0 (
    echo %YELLOW%⚠️ 检测到未提交的修改，正在添加所有文件...%NC%
    git add .
    
    REM 显示修改的文件
    echo %BLUE%📝 修改的文件:%NC%
    git diff --cached --name-only | findstr /n "^" | findstr "^[1-5]:"
    
    REM 创建提交信息
    echo feat(ui): 易经占卜界面年轻化重构与交互优化 > commit_msg.txt
    echo. >> commit_msg.txt
    echo 🎨 易经占卜界面年轻化创意重构 >> commit_msg.txt
    echo - 主标题改为"待我掐指一算"，增加趣味性和仪式感 >> commit_msg.txt
    echo - 副标题改为"三种传统占卜方式，仪式感满满" >> commit_msg.txt
    echo - 方法选择标题改为"Pick Your Magic"，增加国际化元素 >> commit_msg.txt
    echo - 占卜方法描述改为年轻化表达，如"仪式感拉满"、"精妙绝伦" >> commit_msg.txt
    echo - 问题输入区域改为"说出你的困惑"，更贴近年轻人表达 >> commit_msg.txt
    echo - 按钮文字改为"掐指一算"，增加神秘感和趣味性 >> commit_msg.txt
    echo - 解决文字模糊问题，采用深色文字配合浅色背景 >> commit_msg.txt
    echo - 采用年轻化的设计风格，白色半透明卡片配合紫色主题 >> commit_msg.txt
    echo. >> commit_msg.txt
    echo 🔧 梅花易数法选项与AI动画年轻化优化 >> commit_msg.txt
    echo - 梅花易数法起卦方式选项重构为卡片式设计 >> commit_msg.txt
    echo - 时间起卦和数字起卦选项采用图标+描述的形式 >> commit_msg.txt
    echo - 选项交互效果优化，悬停和选中状态更加明显 >> commit_msg.txt
    echo - AI加载动画背景改为浅色渐变，符合年轻化风格 >> commit_msg.txt
    echo - AI动画文字颜色改为深色，确保清晰可读 >> commit_msg.txt
    echo - AI动画标题改为"正在掐指一算"等年轻化表达 >> commit_msg.txt
    echo - AI动画提示文字增加年轻化内容 >> commit_msg.txt
    echo. >> commit_msg.txt
    echo 📋 技术实现 >> commit_msg.txt
    echo - 背景重构：从深色星空背景改为浅色渐变背景 >> commit_msg.txt
    echo - 卡片设计：白色半透明卡片配合紫色边框和阴影 >> commit_msg.txt
    echo - 文字优化：深色文字确保清晰可读，增加字重提升层次 >> commit_msg.txt
    echo - 交互反馈：悬停效果更加明显，选中状态更加突出 >> commit_msg.txt
    echo - 响应式设计：保持在不同设备上的良好显示效果 >> commit_msg.txt
    echo - 性能优化：简化背景动画，提升页面加载速度 >> commit_msg.txt
    
    REM 提交修改
    git commit -F commit_msg.txt
    if !errorlevel! equ 0 (
        echo %GREEN%✅ 修改已提交到 %CURRENT_BRANCH% 分支%NC%
        git log --oneline -1
    ) else (
        echo %RED%❌ 提交失败%NC%
        exit /b 1
    )
) else (
    echo %GREEN%✅ 工作区干净，无需提交%NC%
)

REM 创建并切换到dev-ui2分支
echo %BLUE%🌿 创建并切换到dev-ui2分支...%NC%
git checkout -b dev-ui2
if !errorlevel! equ 0 (
    echo %GREEN%✅ 已切换到dev-ui2分支%NC%
) else (
    echo %YELLOW%⚠️ dev-ui2分支可能已存在，正在切换...%NC%
    git checkout dev-ui2
    if !errorlevel! neq 0 (
        echo %RED%❌ 切换到dev-ui2分支失败%NC%
        exit /b 1
    )
)

REM 显示分支状态
echo %BLUE%📊 当前分支状态:%NC%
git branch --show-current
echo.

REM 显示最近的提交
echo %BLUE%📝 最近的提交记录:%NC%
git log --oneline -3
echo.

REM 显示文件状态
echo %BLUE%📋 文件状态:%NC%
git status --short
echo.

echo %GREEN%🎉 dev-ui2分支创建完成！%NC%
echo.
echo %CYAN%📋 下一步操作建议:%NC%
echo 1. 推送dev-ui2分支到远程: git push -u origin dev-ui2
echo 2. 在远程仓库创建Pull Request
echo 3. 代码审查通过后合并到主分支
echo 4. 删除临时分支: git branch -d dev-ui2
echo.
echo %GREEN%✅ dev-ui2分支创建和UI优化提交完成！%NC%

endlocal 
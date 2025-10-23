@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 设置颜色代码
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "PURPLE=[95m"
set "CYAN=[96m"
set "NC=[0m"

echo %PURPLE%🎯 创建筊杯文字优化分支%NC%
echo %BLUE%================================%NC%

REM 检查Git是否初始化
if not exist ".git" (
    echo %RED%❌ Git未初始化，请先初始化Git仓库%NC%
    pause
    exit /b 1
)
echo %GREEN%✅ Git已初始化%NC%

REM 获取当前分支
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set CURRENT_BRANCH=%%i
echo %BLUE%📋 当前分支: %CURRENT_BRANCH%%NC%

REM 检查是否有未提交的更改
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    echo %YELLOW%⚠️  检测到未提交的更改，正在添加所有文件...%NC%
    git add .
    
    REM 显示将要提交的文件
    echo %BLUE%📁 将要提交的文件:%NC%
    git diff --cached --name-only | findstr /n "^" | findstr "^[1-5]:"
    
    REM 创建提交信息
    echo feat(jiaobei): 优化筊杯界面文字和布局 > commit_msg.txt
    echo. >> commit_msg.txt
    echo - 🎨 去除"3D"、"AI"等技术词汇，使用神秘专业语言 >> commit_msg.txt
    echo - 📝 优化传统礼仪部分，提炼重点步骤 >> commit_msg.txt
    echo - 🔍 简化筊杯结果说明，去除抽象图案 >> commit_msg.txt
    echo - 🎯 统一字体样式，与项目整体保持一致 >> commit_msg.txt
    echo - 🏗️  优化布局结构，提升信息层次清晰度 >> commit_msg.txt
    
    REM 提交更改
    echo %BLUE%📝 正在提交更改...%NC%
    git commit -F commit_msg.txt
    
    REM 显示提交结果
    echo %GREEN%✅ 提交完成!%NC%
    git log --oneline -1
    
    REM 清理临时文件
    del commit_msg.txt
) else (
    echo %GREEN%✅ 工作区干净，无需提交%NC%
)

REM 创建并切换到新分支
echo %BLUE%🌿 正在创建 jiaobeiwenzi 分支...%NC%
git checkout -b jiaobeiwenzi

if %errorlevel% equ 0 (
    echo %GREEN%✅ 成功创建并切换到 jiaobeiwenzi 分支%NC%
    git branch --show-current
) else (
    echo %RED%❌ 创建分支失败%NC%
    pause
    exit /b 1
)

REM 显示分支状态
echo %BLUE%📊 分支状态:%NC%
git status --short

echo.
echo %GREEN%🎉 筊杯文字优化分支创建完成!%NC%
echo %BLUE%================================%NC%
echo %CYAN%📋 下一步操作建议:%NC%
echo %YELLOW%1. 推送新分支到远程: git push -u origin jiaobeiwenzi%NC%
echo %YELLOW%2. 继续开发或测试功能%NC%
echo %YELLOW%3. 完成后合并到主分支%NC%
echo %YELLOW%4. 删除临时分支: git branch -d jiaobeiwenzi%NC%
echo.
echo %GREEN%✅ 所有操作已完成!%NC%

pause


















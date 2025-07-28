@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 开始执行Git版本控制...
echo ================================

REM 颜色定义
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM 检查Git是否初始化
if not exist ".git" (
    echo %RED%❌ Git未初始化%NC%
    pause
    exit /b 1
)

echo %GREEN%✅ Git已初始化%NC%

REM 检查当前分支
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set CURRENT_BRANCH=%%i
echo %BLUE%📋 当前分支: !CURRENT_BRANCH!%NC%

REM 添加所有文件
echo %BLUE%📁 添加文件到暂存区...%NC%
git add .

REM 检查是否有内容需要提交
git diff --cached --quiet
if !errorlevel! equ 0 (
    echo %YELLOW%⚠️  暂存区为空，没有需要提交的文件%NC%
) else (
    echo %GREEN%✅ 文件已添加到暂存区%NC%
    
    REM 显示将要提交的文件数量
    for /f %%i in ('git diff --cached --name-only ^| find /c /v ""') do set FILE_COUNT=%%i
    echo %BLUE%📁 将要提交 !FILE_COUNT! 个文件%NC%
    
    REM 显示主要文件
    echo %BLUE%📋 主要文件:%NC%
    git diff --cached --name-only | findstr /n "^" | findstr "^[1-5]:"
    
    echo.
    echo %BLUE%💾 正在提交...%NC%
    
    REM 使用简单的提交信息
    git commit -m "feat(core): 完善Git版本控制配置 - 添加Windows批处理脚本和文档"
    
    if !errorlevel! equ 0 (
        echo %GREEN%✅ 提交成功!%NC%
        
        REM 显示提交信息
        echo %BLUE%📝 提交信息:%NC%
        git log --oneline -1
    ) else (
        echo %RED%❌ 提交失败%NC%
        pause
        exit /b 1
    )
)

REM 创建develop分支（如果不存在）
git branch | findstr "develop" >nul
if !errorlevel! neq 0 (
    echo %BLUE%🌿 创建develop分支...%NC%
    git checkout -b develop
    echo %GREEN%✅ develop分支创建成功%NC%
) else (
    echo %GREEN%✅ develop分支已存在%NC%
)

REM 显示最终状态
echo.
echo %BLUE%📊 Git状态:%NC%
git status --short

echo.
echo %BLUE%📝 最近的提交:%NC%
git log --oneline -3

echo.
echo %GREEN%🎉 Git版本控制执行完成!%NC%
echo ================================
echo.
echo %BLUE%📋 下一步操作建议:%NC%
echo 1. 设置远程仓库: git remote add origin ^<your-repository-url^>
echo 2. 推送代码: git push -u origin main
echo 3. 推送develop分支: git push -u origin develop
echo 4. 查看Git状态: .\scripts\check-git-status.bat
echo.
echo %GREEN%✅ 所有Git版本控制配置已完成!%NC%

pause 
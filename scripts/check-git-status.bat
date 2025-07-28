@echo off
chcp 65001 >nul

echo 🔍 检查Git状态...
echo ==================

REM 检查Git是否初始化
if not exist ".git" (
    echo ❌ Git未初始化
    pause
    exit /b 1
)

echo ✅ Git已初始化

REM 检查当前分支
echo 📋 当前分支:
git branch --show-current

REM 检查远程仓库
echo.
echo 🌐 远程仓库:
git remote -v

REM 检查状态
echo.
echo 📊 文件状态:
git status --short

REM 检查未跟踪的文件
echo.
echo 📁 未跟踪的文件:
git ls-files --others --exclude-standard | findstr /n "^" | findstr "^[1-5]:"

REM 检查最近的提交
echo.
echo 📝 最近的提交:
git log --oneline -5

echo.
echo ✅ Git状态检查完成
pause 
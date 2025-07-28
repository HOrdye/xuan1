@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 版本发布脚本 (Windows版本)
REM 使用方法: create-release.bat <version>

REM 颜色定义
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM 检查参数
if "%~1"=="" (
    echo %RED%错误: 请提供版本号%NC%
    echo 使用方法: %0 ^<version^>
    echo 示例: %0 v1.0.0
    pause
    exit /b 1
)

set VERSION=%~1

REM 验证版本号格式
echo !VERSION! | findstr /r "^v[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*$" >nul
if !errorlevel! neq 0 (
    echo %RED%错误: 版本号格式不正确%NC%
    echo 正确格式: v主版本.次版本.修订版本
    echo 示例: v1.0.0, v2.1.3
    pause
    exit /b 1
)

echo %BLUE%🚀 开始创建版本 !VERSION!%NC%
echo ================================

REM 检查当前分支
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set CURRENT_BRANCH=%%i
echo %BLUE%📋 当前分支: !CURRENT_BRANCH!%NC%

REM 确保在main分支
if not "!CURRENT_BRANCH!"=="main" (
    echo %YELLOW%⚠️  当前不在main分支，切换到main分支...%NC%
    git checkout main
    git pull origin main
)

REM 检查是否有未提交的更改
git diff-index --quiet HEAD --
if !errorlevel! neq 0 (
    echo %RED%❌ 有未提交的更改，请先提交或暂存%NC%
    git status --short
    pause
    exit /b 1
)

REM 更新package.json版本号
echo %BLUE%📝 更新package.json版本号...%NC%
set VERSION_NUMBER=!VERSION:v=!
powershell -Command "(Get-Content package.json) -replace '\"version\": \".*\"', '\"version\": \"!VERSION_NUMBER!\"' | Set-Content package.json"

REM 更新CHANGELOG.md
echo %BLUE%📝 更新CHANGELOG.md...%NC%
for /f "tokens=1-3 delims=/" %%a in ('date /t') do set TODAY=%%c-%%a-%%b
powershell -Command "(Get-Content CHANGELOG.md) -replace '## \[未发布\]', '## [!VERSION_NUMBER!] - !TODAY!' | Set-Content CHANGELOG.md"

REM 提交版本更新
echo %BLUE%💾 提交版本更新...%NC%
git add package.json CHANGELOG.md
git commit -m "chore(release): 发布!VERSION!版本

- 更新版本号为 !VERSION_NUMBER!
- 更新CHANGELOG.md"

REM 创建标签
echo %BLUE%🏷️  创建版本标签...%NC%

REM 创建标签信息文件
echo 版本 !VERSION! 发布 > tag_msg.txt
echo. >> tag_msg.txt
echo 天玄Web玄学决策助手 !VERSION! 版本发布 >> tag_msg.txt
echo. >> tag_msg.txt
echo 主要功能: >> tag_msg.txt
echo - 🎯 玄选两难功能 >> tag_msg.txt
echo - 🔮 六十四卦占卜 >> tag_msg.txt
echo - 🃏 塔罗牌解读 >> tag_msg.txt
echo - 🌟 今日运势 >> tag_msg.txt
echo - 🤖 AI智能分析 >> tag_msg.txt
echo - 👤 用户认证系统 >> tag_msg.txt
echo - 📚 历史记录管理 >> tag_msg.txt
echo. >> tag_msg.txt
echo 技术栈: Vue.js 3 + TypeScript + Tailwind CSS >> tag_msg.txt

git tag -a !VERSION! -F tag_msg.txt

REM 清理临时文件
del tag_msg.txt

REM 推送代码和标签
echo %BLUE%📤 推送代码和标签...%NC%
git push origin main
git push origin !VERSION!

echo %GREEN%✅ 版本 !VERSION! 发布成功!%NC%
echo.
echo %BLUE%📋 发布信息:%NC%
echo 版本: !VERSION!
echo 日期: !TODAY!
echo 分支: main
echo.
echo %BLUE%📋 下一步操作:%NC%
echo 1. 在GitHub/GitLab上创建Release
echo 2. 更新部署配置
echo 3. 通知团队成员

echo.
echo %GREEN%🎉 版本发布完成!%NC%
pause 
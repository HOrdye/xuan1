@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM Git规范化提交脚本 (Windows版本)
REM 使用方法: git-commit.bat <type> <scope> <description>

REM 颜色定义
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM 检查参数
if "%~3"=="" (
    echo %RED%错误: 参数不足%NC%
    echo 使用方法: %0 ^<type^> ^<scope^> ^<description^>
    echo 示例: %0 feat dilemma "添加AI分析功能"
    echo.
    echo 可用的type:
    echo   feat     - 新功能
    echo   fix      - 修复bug
    echo   docs     - 文档更新
    echo   style    - 代码格式调整
    echo   refactor - 代码重构
    echo   test     - 测试相关
    echo   chore    - 构建过程或辅助工具
    pause
    exit /b 1
)

set TYPE=%~1
set SCOPE=%~2
set DESCRIPTION=%~3

REM 验证type
set VALID_TYPES=feat fix docs style refactor test chore
set IS_VALID=0
for %%t in (%VALID_TYPES%) do (
    if "!TYPE!"=="%%t" set IS_VALID=1
)

if !IS_VALID! equ 0 (
    echo %RED%错误: 无效的type '%TYPE%'%NC%
    echo 有效的type: %VALID_TYPES%
    pause
    exit /b 1
)

REM 检查是否有文件需要提交
git diff --cached --quiet
if !errorlevel! equ 0 (
    echo %YELLOW%⚠️  暂存区为空，请先添加文件%NC%
    echo 使用: git add .
    pause
    exit /b 1
)

REM 生成提交信息
set COMMIT_MSG=!TYPE!(!SCOPE!): !DESCRIPTION!

echo %BLUE%📝 提交信息: %COMMIT_MSG%%NC%
echo.

REM 确认提交
set /p CONFIRM="确认提交? (y/N): "
if /i not "!CONFIRM!"=="y" (
    echo %YELLOW%提交已取消%NC%
    pause
    exit /b 0
)

REM 执行提交
echo %BLUE%💾 正在提交...%NC%
git commit -m "!COMMIT_MSG!"

if !errorlevel! equ 0 (
    echo %GREEN%✅ 提交成功!%NC%
    echo.
    echo %BLUE%📝 提交详情:%NC%
    git log --oneline -1
) else (
    echo %RED%❌ 提交失败%NC%
)

echo.
pause 
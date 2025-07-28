@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 开始执行Git版本控制...
echo ================================

REM 颜色定义（Windows批处理中的简单实现）
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM 步骤1: 检查Git状态
echo %BLUE%📋 步骤1: 检查Git状态%NC%
echo ------------------------

REM 检查Git是否初始化
if not exist ".git" (
    echo %RED%❌ Git未初始化%NC%
    exit /b 1
)

echo %GREEN%✅ Git已初始化%NC%

REM 检查当前分支
for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do set CURRENT_BRANCH=%%i
echo %BLUE%📋 当前分支: !CURRENT_BRANCH!%NC%

REM 检查远程仓库
echo %BLUE%🌐 远程仓库:%NC%
git remote -v

REM 步骤2: 添加文件到暂存区
echo.
echo %BLUE%📋 步骤2: 添加文件到暂存区%NC%
echo ------------------------

REM 添加所有文件
git add .

REM 检查暂存区状态
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
)

REM 步骤3: 检查是否有未跟踪的文件
echo.
echo %BLUE%📋 步骤3: 检查未跟踪的文件%NC%
echo ------------------------

for /f %%i in ('git ls-files --others --exclude-standard ^| find /c /v ""') do set UNTRACKED_COUNT=%%i
if !UNTRACKED_COUNT! gtr 0 (
    echo %YELLOW%⚠️  发现 !UNTRACKED_COUNT! 个未跟踪的文件%NC%
    git ls-files --others --exclude-standard | findstr /n "^" | findstr "^[1-5]:"
) else (
    echo %GREEN%✅ 没有未跟踪的文件%NC%
)

REM 步骤4: 检查是否有修改
echo.
echo %BLUE%📋 步骤4: 检查文件修改%NC%
echo ------------------------

git diff-index --quiet HEAD --
if !errorlevel! equ 0 (
    echo %YELLOW%⚠️  没有需要提交的更改%NC%
) else (
    echo %BLUE%📝 发现未提交的更改%NC%
    git status --short
)

REM 步骤5: 执行提交
echo.
echo %BLUE%📋 步骤5: 执行提交%NC%
echo ------------------------

REM 检查是否有内容需要提交
git diff --cached --quiet
set CACHED_EMPTY=!errorlevel!
git diff-index --quiet HEAD --
set INDEX_EMPTY=!errorlevel!

if !CACHED_EMPTY! equ 0 if !INDEX_EMPTY! equ 0 (
    echo %YELLOW%⚠️  没有内容需要提交%NC%
) else (
    echo %BLUE%💾 正在提交...%NC%
    
    REM 生成提交信息（使用临时文件）
    echo feat(core): 完善Git版本控制配置 > commit_msg.txt
    echo. >> commit_msg.txt
    echo - 📝 更新.gitignore文件，添加Vue.js项目标准忽略规则 >> commit_msg.txt
    echo - 📚 创建Git版本控制配置文档 (GIT_VERSION_CONTROL.md) >> commit_msg.txt
    echo - 📋 创建项目变更日志 (CHANGELOG.md) >> commit_msg.txt
    echo - 🔧 更新package.json版本信息和Git脚本 >> commit_msg.txt
    echo - 🛠️ 创建Git提交脚本 (scripts/git-commit.sh) >> commit_msg.txt
    echo - 🔗 创建Git钩子配置 (.husky/pre-commit) >> commit_msg.txt
    echo - 📖 创建详细工作流程文档 (docs/GIT_WORKFLOW.md) >> commit_msg.txt
    echo - 🏷️ 创建版本发布脚本 (scripts/create-release.sh) >> commit_msg.txt
    echo - 🎯 实现规范化提交和分支管理策略 >> commit_msg.txt
    echo. >> commit_msg.txt
    echo 技术改进: >> commit_msg.txt
    echo - 规范化Git工作流程 >> commit_msg.txt
    echo - 自动化版本管理 >> commit_msg.txt
    echo - 代码质量检查 >> commit_msg.txt
    echo - 团队协作规范 >> commit_msg.txt

    REM 执行提交
    git commit -F commit_msg.txt
    
    REM 清理临时文件
    del commit_msg.txt
    
    if !errorlevel! equ 0 (
        echo %GREEN%✅ 提交成功!%NC%
        
        REM 显示提交信息
        echo %BLUE%📝 提交信息:%NC%
        git log --oneline -1
    ) else (
        echo %RED%❌ 提交失败%NC%
        exit /b 1
    )
)

REM 步骤6: 创建develop分支（如果不存在）
echo.
echo %BLUE%📋 步骤6: 检查分支结构%NC%
echo ------------------------

git branch | findstr "develop" >nul
if !errorlevel! neq 0 (
    echo %BLUE%🌿 创建develop分支...%NC%
    git checkout -b develop
    echo %GREEN%✅ develop分支创建成功%NC%
) else (
    echo %GREEN%✅ develop分支已存在%NC%
)

REM 步骤7: 显示最终状态
echo.
echo %BLUE%📋 步骤7: 最终状态%NC%
echo ------------------------

echo %BLUE%📊 Git状态:%NC%
git status --short

echo.
echo %BLUE%📝 最近的提交:%NC%
git log --oneline -3

echo.
echo %BLUE%🌿 分支列表:%NC%
git branch -a

REM 步骤8: 提供下一步操作建议
echo.
echo %GREEN%🎉 Git版本控制执行完成!%NC%
echo ================================
echo.
echo %BLUE%📋 下一步操作建议:%NC%
echo 1. 设置远程仓库:
echo    git remote add origin ^<your-repository-url^>
echo.
echo 2. 推送代码到远程仓库:
echo    git push -u origin main
echo    git push -u origin develop
echo.
echo 3. 创建版本标签:
echo    .\scripts\create-release.bat v1.0.0
echo.
echo 4. 使用规范化提交:
echo    .\scripts\git-commit.bat feat scope "功能描述"
echo.
echo 5. 查看Git状态:
echo    .\scripts\check-git-status.bat
echo.
echo %GREEN%✅ 所有Git版本控制配置已完成!%NC%

pause 
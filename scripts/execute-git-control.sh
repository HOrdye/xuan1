#!/bin/bash

# 综合Git版本控制执行脚本
# 自动执行完整的Git版本控制流程

echo "🚀 开始执行Git版本控制..."
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 步骤1: 检查Git状态
echo -e "${BLUE}📋 步骤1: 检查Git状态${NC}"
echo "------------------------"

# 检查Git是否初始化
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Git未初始化${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Git已初始化${NC}"

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}📋 当前分支: $CURRENT_BRANCH${NC}"

# 检查远程仓库
echo -e "${BLUE}🌐 远程仓库:${NC}"
git remote -v

# 步骤2: 添加文件到暂存区
echo ""
echo -e "${BLUE}📋 步骤2: 添加文件到暂存区${NC}"
echo "------------------------"

# 添加所有文件
git add .

# 检查暂存区状态
if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  暂存区为空，没有需要提交的文件${NC}"
else
    echo -e "${GREEN}✅ 文件已添加到暂存区${NC}"
    
    # 显示将要提交的文件数量
    FILE_COUNT=$(git diff --cached --name-only | wc -l)
    echo -e "${BLUE}📁 将要提交 $FILE_COUNT 个文件${NC}"
    
    # 显示主要文件
    echo -e "${BLUE}📋 主要文件:${NC}"
    git diff --cached --name-only | head -10
fi

# 步骤3: 检查是否有未跟踪的文件
echo ""
echo -e "${BLUE}📋 步骤3: 检查未跟踪的文件${NC}"
echo "------------------------"

UNTRACKED_COUNT=$(git ls-files --others --exclude-standard | wc -l)
if [ $UNTRACKED_COUNT -gt 0 ]; then
    echo -e "${YELLOW}⚠️  发现 $UNTRACKED_COUNT 个未跟踪的文件${NC}"
    git ls-files --others --exclude-standard | head -5
else
    echo -e "${GREEN}✅ 没有未跟踪的文件${NC}"
fi

# 步骤4: 检查是否有修改
echo ""
echo -e "${BLUE}📋 步骤4: 检查文件修改${NC}"
echo "------------------------"

if git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  没有需要提交的更改${NC}"
else
    echo -e "${BLUE}📝 发现未提交的更改${NC}"
    git status --short
fi

# 步骤5: 执行提交
echo ""
echo -e "${BLUE}📋 步骤5: 执行提交${NC}"
echo "------------------------"

# 检查是否有内容需要提交
if git diff --cached --quiet && git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  没有内容需要提交${NC}"
else
    echo -e "${BLUE}💾 正在提交...${NC}"
    
    # 生成提交信息
    COMMIT_MSG="feat(core): 完善Git版本控制配置

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
- 团队协作规范"

    # 执行提交
    git commit -m "$COMMIT_MSG"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 提交成功!${NC}"
        
        # 显示提交信息
        echo -e "${BLUE}📝 提交信息:${NC}"
        git log --oneline -1
    else
        echo -e "${RED}❌ 提交失败${NC}"
        exit 1
    fi
fi

# 步骤6: 创建develop分支（如果不存在）
echo ""
echo -e "${BLUE}📋 步骤6: 检查分支结构${NC}"
echo "------------------------"

if ! git branch | grep -q "develop"; then
    echo -e "${BLUE}🌿 创建develop分支...${NC}"
    git checkout -b develop
    echo -e "${GREEN}✅ develop分支创建成功${NC}"
else
    echo -e "${GREEN}✅ develop分支已存在${NC}"
fi

# 步骤7: 显示最终状态
echo ""
echo -e "${BLUE}📋 步骤7: 最终状态${NC}"
echo "------------------------"

echo -e "${BLUE}📊 Git状态:${NC}"
git status --short

echo ""
echo -e "${BLUE}📝 最近的提交:${NC}"
git log --oneline -3

echo ""
echo -e "${BLUE}🌿 分支列表:${NC}"
git branch -a

# 步骤8: 提供下一步操作建议
echo ""
echo -e "${GREEN}🎉 Git版本控制执行完成!${NC}"
echo "================================"
echo ""
echo -e "${BLUE}📋 下一步操作建议:${NC}"
echo "1. 设置远程仓库:"
echo "   git remote add origin <your-repository-url>"
echo ""
echo "2. 推送代码到远程仓库:"
echo "   git push -u origin main"
echo "   git push -u origin develop"
echo ""
echo "3. 创建版本标签:"
echo "   ./scripts/create-release.sh v1.0.0"
echo ""
echo "4. 使用规范化提交:"
echo "   ./scripts/git-commit.sh feat scope '功能描述'"
echo ""
echo "5. 查看Git状态:"
echo "   ./scripts/check-git-status.sh"
echo ""
echo -e "${GREEN}✅ 所有Git版本控制配置已完成!${NC}" 
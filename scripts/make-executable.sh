#!/bin/bash

# 给所有脚本添加执行权限

echo "🔧 设置脚本执行权限..."
echo "========================"

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 设置scripts目录下所有.sh文件的执行权限
echo -e "${BLUE}📁 设置scripts目录权限...${NC}"
chmod +x scripts/*.sh

# 设置.husky目录下所有文件的执行权限
echo -e "${BLUE}📁 设置.husky目录权限...${NC}"
chmod +x .husky/*

echo -e "${GREEN}✅ 所有脚本权限设置完成!${NC}"
echo ""
echo -e "${BLUE}📋 可用的脚本:${NC}"
echo "  ./scripts/check-git-status.sh     - 检查Git状态"
echo "  ./scripts/init-git.sh             - 初始化Git"
echo "  ./scripts/git-commit.sh           - 规范化提交"
echo "  ./scripts/create-release.sh       - 创建版本发布"
echo "  ./scripts/execute-git-control.sh  - 执行Git版本控制"
echo "  .husky/pre-commit                 - 提交前检查" 
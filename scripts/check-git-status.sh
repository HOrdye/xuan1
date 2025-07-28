#!/bin/bash

echo "🔍 检查Git状态..."
echo "=================="

# 检查Git是否初始化
if [ ! -d ".git" ]; then
    echo "❌ Git未初始化"
    exit 1
fi

echo "✅ Git已初始化"

# 检查当前分支
echo "📋 当前分支:"
git branch --show-current

# 检查远程仓库
echo ""
echo "🌐 远程仓库:"
git remote -v

# 检查状态
echo ""
echo "📊 文件状态:"
git status --short

# 检查未跟踪的文件
echo ""
echo "📁 未跟踪的文件:"
git ls-files --others --exclude-standard | head -10

# 检查最近的提交
echo ""
echo "📝 最近的提交:"
git log --oneline -5

echo ""
echo "✅ Git状态检查完成" 
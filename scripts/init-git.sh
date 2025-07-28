#!/bin/bash

# Git初始化脚本
# 用于项目的首次Git版本控制设置

echo "🚀 开始Git版本控制初始化..."
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查Git是否已初始化
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Git未初始化，正在初始化...${NC}"
    git init
    echo -e "${GREEN}✅ Git初始化完成${NC}"
else
    echo -e "${GREEN}✅ Git已初始化${NC}"
fi

# 检查是否有未提交的更改
if git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  没有需要提交的更改${NC}"
else
    echo -e "${BLUE}📝 发现未提交的更改${NC}"
fi

# 添加所有文件到暂存区
echo -e "${BLUE}📁 添加文件到暂存区...${NC}"
git add .

# 检查暂存区状态
if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  暂存区为空${NC}"
else
    echo -e "${GREEN}✅ 文件已添加到暂存区${NC}"
    
    # 显示将要提交的文件
    echo -e "${BLUE}📋 将要提交的文件:${NC}"
    git diff --cached --name-only | head -10
    
    # 确认提交
    echo ""
    read -p "确认提交这些文件? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # 执行提交
        echo -e "${BLUE}💾 正在提交...${NC}"
        git commit -m "feat(core): 初始化项目 - 天玄Web玄学决策助手

- 🎯 玄选两难功能 - 基于易经六十四卦的智能决策助手
- 🔮 六十四卦占卜功能 - 支持铜钱占卜、梅花易数、随机起卦
- 🃏 塔罗牌解读功能 - AI智能塔罗牌正逆位解读
- 🌟 今日运势功能 - 个性化运势分析
- 🤖 AI智能分析系统 - 集成多种LLM服务
- 👤 用户认证系统 - 本地用户管理
- 📚 历史记录管理 - 占卜历史保存和查看
- 🎨 现代化UI设计 - 基于Tailwind CSS的响应式界面
- 📱 移动端适配 - 完美支持移动设备
- 🔧 调试工具清理 - 移除开发调试界面

技术栈: Vue.js 3 + TypeScript + Tailwind CSS + Vite"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ 提交成功!${NC}"
            
            # 显示提交信息
            echo -e "${BLUE}📝 提交信息:${NC}"
            git log --oneline -1
            
            # 创建develop分支
            echo -e "${BLUE}🌿 创建develop分支...${NC}"
            git checkout -b develop
            
            echo -e "${GREEN}✅ Git版本控制初始化完成!${NC}"
            echo ""
            echo -e "${BLUE}📋 下一步操作:${NC}"
            echo "1. 设置远程仓库: git remote add origin <repository-url>"
            echo "2. 推送代码: git push -u origin main"
            echo "3. 推送develop分支: git push -u origin develop"
        else
            echo -e "${RED}❌ 提交失败${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}提交已取消${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Git版本控制初始化完成!${NC}" 
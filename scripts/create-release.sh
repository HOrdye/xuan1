#!/bin/bash

# 版本发布脚本
# 使用方法: ./scripts/create-release.sh <version>

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查参数
if [ $# -lt 1 ]; then
    echo -e "${RED}错误: 请提供版本号${NC}"
    echo "使用方法: $0 <version>"
    echo "示例: $0 v1.0.0"
    exit 1
fi

VERSION=$1

# 验证版本号格式
if [[ ! $VERSION =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${RED}错误: 版本号格式不正确${NC}"
    echo "正确格式: v主版本.次版本.修订版本"
    echo "示例: v1.0.0, v2.1.3"
    exit 1
fi

echo -e "${BLUE}🚀 开始创建版本 $VERSION${NC}"
echo "================================"

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}📋 当前分支: $CURRENT_BRANCH${NC}"

# 确保在main分支
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠️  当前不在main分支，切换到main分支...${NC}"
    git checkout main
    git pull origin main
fi

# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ 有未提交的更改，请先提交或暂存${NC}"
    git status --short
    exit 1
fi

# 更新package.json版本号
echo -e "${BLUE}📝 更新package.json版本号...${NC}"
VERSION_NUMBER=${VERSION#v}
sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION_NUMBER\"/" package.json

# 更新CHANGELOG.md
echo -e "${BLUE}📝 更新CHANGELOG.md...${NC}"
TODAY=$(date +%Y-%m-%d)
sed -i "s/## \[未发布\]/## \[$VERSION_NUMBER\] - $TODAY/" CHANGELOG.md

# 提交版本更新
echo -e "${BLUE}💾 提交版本更新...${NC}"
git add package.json CHANGELOG.md
git commit -m "chore(release): 发布$VERSION版本

- 更新版本号为 $VERSION_NUMBER
- 更新CHANGELOG.md"

# 创建标签
echo -e "${BLUE}🏷️  创建版本标签...${NC}"
git tag -a $VERSION -m "版本 $VERSION 发布

天玄Web玄学决策助手 $VERSION 版本发布

主要功能:
- 🎯 玄选两难功能
- 🔮 六十四卦占卜
- 🃏 塔罗牌解读
- 🌟 今日运势
- 🤖 AI智能分析
- 👤 用户认证系统
- 📚 历史记录管理

技术栈: Vue.js 3 + TypeScript + Tailwind CSS"

# 推送代码和标签
echo -e "${BLUE}📤 推送代码和标签...${NC}"
git push origin main
git push origin $VERSION

echo -e "${GREEN}✅ 版本 $VERSION 发布成功!${NC}"
echo ""
echo -e "${BLUE}📋 发布信息:${NC}"
echo "版本: $VERSION"
echo "日期: $TODAY"
echo "分支: main"
echo ""
echo -e "${BLUE}📋 下一步操作:${NC}"
echo "1. 在GitHub/GitLab上创建Release"
echo "2. 更新部署配置"
echo "3. 通知团队成员"

echo ""
echo -e "${GREEN}🎉 版本发布完成!${NC}" 
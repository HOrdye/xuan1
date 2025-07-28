#!/bin/bash

# Git提交脚本
# 使用方法: ./scripts/git-commit.sh <type> <scope> <description>

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查参数
if [ $# -lt 3 ]; then
    echo -e "${RED}错误: 参数不足${NC}"
    echo "使用方法: $0 <type> <scope> <description>"
    echo ""
    echo "类型 (type):"
    echo "  feat     - 新功能"
    echo "  fix      - 修复bug"
    echo "  docs     - 文档更新"
    echo "  style    - 代码格式调整"
    echo "  refactor - 代码重构"
    echo "  test     - 测试相关"
    echo "  chore    - 构建过程或辅助工具的变动"
    echo "  perf     - 性能优化"
    echo "  ci       - CI/CD相关"
    echo "  build    - 构建系统或外部依赖变更"
    echo ""
    echo "示例:"
    echo "  $0 feat dilemma '添加玄选两难AI分析功能'"
    echo "  $0 fix animation '修复AI加载动画卡住问题'"
    exit 1
fi

TYPE=$1
SCOPE=$2
DESCRIPTION=$3

# 验证类型
VALID_TYPES=("feat" "fix" "docs" "style" "refactor" "test" "chore" "perf" "ci" "build")
VALID_TYPE=false

for valid_type in "${VALID_TYPES[@]}"; do
    if [ "$TYPE" = "$valid_type" ]; then
        VALID_TYPE=true
        break
    fi
done

if [ "$VALID_TYPE" = false ]; then
    echo -e "${RED}错误: 无效的类型 '$TYPE'${NC}"
    echo "有效类型: ${VALID_TYPES[*]}"
    exit 1
fi

# 构建提交信息
if [ -n "$SCOPE" ]; then
    COMMIT_MSG="$TYPE($SCOPE): $DESCRIPTION"
else
    COMMIT_MSG="$TYPE: $DESCRIPTION"
fi

echo -e "${BLUE}准备提交...${NC}"
echo -e "${YELLOW}提交信息: $COMMIT_MSG${NC}"
echo ""

# 检查Git状态
if ! git status --porcelain | grep -q .; then
    echo -e "${RED}错误: 没有需要提交的更改${NC}"
    exit 1
fi

# 显示将要提交的文件
echo -e "${BLUE}将要提交的文件:${NC}"
git status --short
echo ""

# 确认提交
read -p "确认提交? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}提交已取消${NC}"
    exit 0
fi

# 执行提交
echo -e "${BLUE}正在提交...${NC}"
git add .
git commit -m "$COMMIT_MSG"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 提交成功!${NC}"
    echo -e "${BLUE}提交信息: $COMMIT_MSG${NC}"
    
    # 显示最近的提交
    echo ""
    echo -e "${BLUE}最近的提交:${NC}"
    git log --oneline -3
else
    echo -e "${RED}❌ 提交失败${NC}"
    exit 1
fi 
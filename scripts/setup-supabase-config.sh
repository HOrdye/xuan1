#!/bin/bash
# Supabase配置脚本
# 此脚本用于更新.env文件中的Supabase配置

ENV_FILE=".env"
PROJECT_URL="https://vdxxpsjdiswztipauhwb.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkeHhwc2pkaXN3enRpcGF1aHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4ODc3ODQsImV4cCI6MjA3NzQ2Mzc4NH0.zR77zqdH3EW9cFSkKJb8OlC2lrfNzS-knm-dQkI8yuk"

echo "🔧 开始更新Supabase配置..."

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ .env文件不存在，请先创建.env文件"
    exit 1
fi

# 替换Supabase URL
sed -i.bak "s|^VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=$PROJECT_URL|" "$ENV_FILE"

# 替换Supabase Anon Key
sed -i.bak "s|^VITE_SUPABASE_ANON_KEY=.*|VITE_SUPABASE_ANON_KEY=$ANON_KEY|" "$ENV_FILE"

echo "✅ Supabase配置已更新！"
echo ""
echo "配置信息："
echo "  URL: $PROJECT_URL"
echo "  Anon Key: $ANON_KEY"
echo ""
echo "📝 提示：请验证.env文件中的配置是否正确"







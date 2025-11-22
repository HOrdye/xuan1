# Supabase配置脚本
# 此脚本用于更新.env文件中的Supabase配置

$envFile = ".env"
$projectUrl = "https://vdxxpsjdiswztipauhwb.supabase.co"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkeHhwc2pkaXN3enRpcGF1aHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4ODc3ODQsImV4cCI6MjA3NzQ2Mzc4NH0.zR77zqdH3EW9cFSkKJb8OlC2lrfNzS-knm-dQkI8yuk"

Write-Host "🔧 开始更新Supabase配置..." -ForegroundColor Cyan

if (-not (Test-Path $envFile)) {
    Write-Host "❌ .env文件不存在，请先创建.env文件" -ForegroundColor Red
    exit 1
}

# 读取.env文件内容
$content = Get-Content $envFile -Raw

# 替换Supabase URL
$content = $content -replace '(?m)^VITE_SUPABASE_URL=.*', "VITE_SUPABASE_URL=$projectUrl"

# 替换Supabase Anon Key
$content = $content -replace '(?m)^VITE_SUPABASE_ANON_KEY=.*', "VITE_SUPABASE_ANON_KEY=$anonKey"

# 写回文件
Set-Content -Path $envFile -Value $content -NoNewline

Write-Host "✅ Supabase配置已更新！" -ForegroundColor Green
Write-Host ""
Write-Host "配置信息：" -ForegroundColor Yellow
Write-Host "  URL: $projectUrl"
Write-Host "  Anon Key: $anonKey"
Write-Host ""
Write-Host "📝 提示：请验证.env文件中的配置是否正确" -ForegroundColor Cyan















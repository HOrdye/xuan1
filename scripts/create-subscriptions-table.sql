-- 创建会员订阅表
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'premium', 'advanced')),
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'cancelled', 'trial')),
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  trial_end_date TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 确保每个用户只有一个活跃订阅
  CONSTRAINT unique_active_subscription UNIQUE NULLS NOT DISTINCT (user_id, status) WHERE status = 'active'
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tier ON subscriptions(tier);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptions_updated_at();

-- 启用行级安全策略
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能查看自己的订阅
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- 创建策略：用户只能插入自己的订阅
CREATE POLICY "Users can insert their own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 创建策略：用户只能更新自己的订阅
CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- 创建使用日志表（用于记录功能使用次数）
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature TEXT NOT NULL CHECK (feature IN ('tripleAnalysis', 'chartGeneration', 'aiInsight')),
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 确保每天每个功能只记录一次（简化版）
  UNIQUE(user_id, feature, usage_date)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_date ON usage_logs(user_id, usage_date);
CREATE INDEX IF NOT EXISTS idx_usage_logs_feature ON usage_logs(feature);

-- 启用行级安全策略
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能查看自己的使用日志
CREATE POLICY "Users can view their own usage logs"
  ON usage_logs FOR SELECT
  USING (auth.uid() = user_id);

-- 创建策略：用户只能插入自己的使用日志
CREATE POLICY "Users can insert their own usage logs"
  ON usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 为每个新用户自动创建免费订阅
CREATE OR REPLACE FUNCTION create_free_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, tier, status, start_date, end_date, auto_renew)
  VALUES (NEW.id, 'free', 'active', NOW(), NULL, false)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：新用户注册时自动创建免费订阅
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_free_subscription();



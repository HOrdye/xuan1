-- ============================================
-- Supabase 阶段二：数据库表结构设计和创建
-- ============================================
-- 执行说明：
-- 1. 登录 Supabase Dashboard
-- 2. 进入 SQL Editor
-- 3. 创建新查询
-- 4. 复制粘贴此文件全部内容
-- 5. 点击执行
-- ============================================

-- ============================================
-- 第一部分：创建用户资料表（profiles）
-- ============================================

-- 创建用户资料表
-- 此表用于存储用户的扩展信息，关联auth.users表
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  birthday DATE,
  gender TEXT,
  phone TEXT,
  website TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 为username创建索引（用于用户名查询）
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);

-- 为created_at创建索引（用于时间排序）
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at);

-- 添加表注释
COMMENT ON TABLE public.profiles IS '用户资料表，存储用户的扩展信息';
COMMENT ON COLUMN public.profiles.id IS '用户ID，关联auth.users表';
COMMENT ON COLUMN public.profiles.username IS '用户名';
COMMENT ON COLUMN public.profiles.avatar_url IS '头像URL';
COMMENT ON COLUMN public.profiles.preferences IS '用户偏好设置（JSON格式）';

-- ============================================
-- 第二部分：创建历史记录表（divination_history）
-- ============================================

-- 创建历史记录表
-- 此表用于存储用户的占卜/决策历史记录
CREATE TABLE IF NOT EXISTS public.divination_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'yijing', 'dilemma', 'tarot', 'jiaobei'
  question TEXT,
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 为user_id创建索引（用于查询用户的历史记录）
CREATE INDEX IF NOT EXISTS divination_history_user_id_idx ON public.divination_history(user_id);

-- 为type创建索引（用于按类型查询）
CREATE INDEX IF NOT EXISTS divination_history_type_idx ON public.divination_history(type);

-- 为created_at创建索引（用于时间排序）
CREATE INDEX IF NOT EXISTS divination_history_created_at_idx ON public.divination_history(created_at);

-- 为user_id和created_at创建复合索引（用于查询用户最近的历史记录）
CREATE INDEX IF NOT EXISTS divination_history_user_created_idx ON public.divination_history(user_id, created_at DESC);

-- 添加表注释
COMMENT ON TABLE public.divination_history IS '占卜/决策历史记录表';
COMMENT ON COLUMN public.divination_history.user_id IS '用户ID，关联auth.users表';
COMMENT ON COLUMN public.divination_history.type IS '占卜类型：yijing(易经)、dilemma(两难抉择)、tarot(塔罗)、jiaobei(筊杯)';
COMMENT ON COLUMN public.divination_history.question IS '用户提出的问题';
COMMENT ON COLUMN public.divination_history.result IS '占卜结果（JSON格式）';

-- ============================================
-- 第三部分：配置Row Level Security (RLS)策略
-- ============================================

-- ============================================
-- profiles表的RLS策略
-- ============================================

-- 启用profiles表的RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 策略1：任何人都可以读取公开资料
CREATE POLICY "公开资料可读" ON public.profiles
  FOR SELECT
  USING (true);

-- 策略2：用户只能更新自己的资料
CREATE POLICY "用户可更新自己资料" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 策略3：用户只能插入自己的资料
CREATE POLICY "用户可插入自己资料" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 策略4：用户只能删除自己的资料（可选，根据需求决定是否启用）
-- CREATE POLICY "用户可删除自己资料" ON public.profiles
--   FOR DELETE
--   USING (auth.uid() = id);

-- ============================================
-- divination_history表的RLS策略
-- ============================================

-- 启用divination_history表的RLS
ALTER TABLE public.divination_history ENABLE ROW LEVEL SECURITY;

-- 策略1：用户只能查看自己的历史记录
CREATE POLICY "用户查看自己历史" ON public.divination_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- 策略2：用户只能插入自己的历史记录
CREATE POLICY "用户插入自己历史" ON public.divination_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 策略3：用户只能更新自己的历史记录
CREATE POLICY "用户更新自己历史" ON public.divination_history
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 策略4：用户只能删除自己的历史记录
CREATE POLICY "用户删除自己历史" ON public.divination_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 第四部分：创建触发器
-- ============================================

-- ============================================
-- 触发器1：自动更新updated_at字段
-- ============================================

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为profiles表添加更新时间触发器
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 触发器2：新用户自动创建profile
-- ============================================

-- 创建自动创建用户资料的函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, preferences)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    jsonb_build_object(
      'theme', 'default',
      'language', 'zh-CN',
      'notifications', true
    )
  )
  ON CONFLICT (id) DO NOTHING; -- 如果已存在则不做任何操作
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：当auth.users表有新用户时，自动创建profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 验证和测试
-- ============================================

-- 验证表是否创建成功
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    RAISE NOTICE '✅ profiles表创建成功';
  ELSE
    RAISE EXCEPTION '❌ profiles表创建失败';
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'divination_history') THEN
    RAISE NOTICE '✅ divination_history表创建成功';
  ELSE
    RAISE EXCEPTION '❌ divination_history表创建失败';
  END IF;

  RAISE NOTICE '✅ 所有表创建完成！';
END $$;

-- ============================================
-- 脚本执行完成
-- ============================================
-- 如果看到以上所有✅消息，说明脚本执行成功
-- 接下来可以：
-- 1. 测试注册新用户，验证profile是否自动创建
-- 2. 测试插入历史记录
-- 3. 验证RLS策略是否生效
-- ============================================







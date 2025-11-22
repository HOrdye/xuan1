# Supabase 登录系统实装计划

## 📊 当前系统分析

### ✅ 已完成的部分

#### 1. **Supabase 客户端基础设施** (`src/core/services/supabaseClient.ts`)
- ✅ Supabase客户端管理器已实现
- ✅ 支持环境变量配置
- ✅ 健康检查功能
- ✅ 配置更新和重置功能
- ✅ 自动会话刷新和持久化

#### 2. **认证服务层** (`src/core/services/authService.ts`)
- ✅ 完整的登录/注册功能
- ✅ 降级机制（Supabase不可用时使用本地存储）
- ✅ 错误处理和用户友好提示
- ✅ 邮箱验证、密码重置功能
- ✅ 会话管理功能
- ✅ 认证状态监听

#### 3. **前端UI组件** (`src/components/auth/ModernAuthModal.vue`)
- ✅ 现代化认证界面
- ✅ 登录/注册模式切换
- ✅ 第三方登录按钮（微信、支付宝、抖音 - UI已完成）
- ✅ 表单验证
- ✅ 密码显示/隐藏切换
- ✅ 错误和成功消息提示

#### 4. **环境配置管理** (`src/utils/envConfig.ts`)
- ✅ 环境变量管理器
- ✅ localStorage持久化
- ✅ 配置验证功能

#### 5. **依赖和配置**
- ✅ `@supabase/supabase-js@^2.51.0` 已安装
- ✅ `.env.example` 文件已创建（包含Supabase配置示例）
- ✅ `.env` 文件存在（但为占位符配置）

### ⚠️ 需要完成的部分

#### 1. **Supabase 项目配置**
- ❌ 缺少真实的Supabase项目URL和API密钥
- ❌ 未配置Supabase数据库表结构
- ❌ 未配置认证策略（邮箱验证、OAuth等）
- ❌ 未配置Row Level Security (RLS)策略

#### 2. **环境变量配置**
- ⚠️ `.env` 文件中的配置为占位符
- ⚠️ 需要填入真实的Supabase凭证

#### 3. **数据库表设计**
- ❌ 用户表结构未定义
- ❌ 用户元数据表未创建
- ❌ 历史记录表未设计
- ❌ 会话管理表未设计

#### 4. **第三方登录集成**
- ⚠️ UI已完成，但后端逻辑未实现
- ❌ 微信OAuth未配置
- ❌ 支付宝OAuth未配置
- ❌ 抖音OAuth未配置

#### 5. **安全策略**
- ❌ RLS策略未配置
- ❌ API密钥权限未验证
- ❌ 密码重置流程未测试

---

## 🎯 Supabase 实装计划

### 阶段一：Supabase 项目初始化（1-2天）

#### 1.1 创建 Supabase 项目
**任务清单**：
- [ ] 访问 https://supabase.com 注册/登录账户
- [ ] 创建新项目（建议名称：`tianxuan-web`）
- [ ] 记录项目URL和API密钥
- [ ] 配置项目地区（建议选择离用户最近的区域）

**输出**：
- Supabase项目URL
- Anon Key（公开密钥）
- Service Role Key（服务端密钥，仅后端使用）

#### 1.2 配置环境变量
**任务清单**：
- [ ] 更新 `.env` 文件，填入真实的Supabase配置
  ```env
  VITE_SUPABASE_URL=https://your-project-id.supabase.co
  VITE_SUPABASE_ANON_KEY=your-real-anon-key
  ```
- [ ] 验证 `.env` 文件未被提交到Git（已在 `.gitignore` 中）
- [ ] 创建 `.env.local` 文件用于本地开发（如需要）

**验证步骤**：
```bash
# 检查环境变量是否正确加载
npm run dev
# 在浏览器控制台检查 Supabase 客户端是否初始化成功
```

---

### 阶段二：数据库表结构设计（2-3天）

#### 2.1 用户相关表设计

**profiles 表**（扩展用户信息）
```sql
-- 创建用户资料表
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
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

-- 创建索引
CREATE INDEX profiles_username_idx ON public.profiles(username);
CREATE INDEX profiles_created_at_idx ON public.profiles(created_at);
```

**历史记录表**（占卜/决策历史）
```sql
-- 创建历史记录表
CREATE TABLE public.divination_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'yijing', 'dilemma', 'tarot', 'jiaobei'
  question TEXT,
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX divination_history_user_id_idx ON public.divination_history(user_id);
CREATE INDEX divination_history_type_idx ON public.divination_history(type);
CREATE INDEX divination_history_created_at_idx ON public.divination_history(created_at);
```

#### 2.2 Row Level Security (RLS) 策略配置

**profiles 表 RLS**
```sql
-- 启用RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 任何人都可以读取公开资料
CREATE POLICY "公开资料可读" ON public.profiles
  FOR SELECT USING (true);

-- 用户只能更新自己的资料
CREATE POLICY "用户可更新自己资料" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 用户只能插入自己的资料
CREATE POLICY "用户可插入自己资料" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

**divination_history 表 RLS**
```sql
-- 启用RLS
ALTER TABLE public.divination_history ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的历史记录
CREATE POLICY "用户查看自己历史" ON public.divination_history
  FOR SELECT USING (auth.uid() = user_id);

-- 用户只能插入自己的历史记录
CREATE POLICY "用户插入自己历史" ON public.divination_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的历史记录
CREATE POLICY "用户更新自己历史" ON public.divination_history
  FOR UPDATE USING (auth.uid() = user_id);

-- 用户只能删除自己的历史记录
CREATE POLICY "用户删除自己历史" ON public.divination_history
  FOR DELETE USING (auth.uid() = user_id);
```

#### 2.3 触发器设置（自动更新updated_at）

```sql
-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为profiles表添加触发器
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

### 阶段三：认证流程验证和优化（1-2天）

#### 3.1 基础认证流程测试

**测试清单**：
- [ ] 用户注册测试
  - 邮箱格式验证
  - 密码强度验证
  - 邮箱验证邮件发送
- [ ] 用户登录测试
  - 正确凭证登录
  - 错误凭证处理
  - 会话持久化
- [ ] 会话管理测试
  - 刷新token
  - 登出功能
  - 会话过期处理

**验证代码示例**：
```typescript
// 在浏览器控制台测试
import { SupabaseManager } from './src/core/services/supabaseClient';
const client = await SupabaseManager.initialize();

// 测试注册
const { data, error } = await client.auth.signUp({
  email: 'test@example.com',
  password: 'test123456'
});

// 测试登录
const { data, error } = await client.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'test123456'
});

// 测试获取用户
const { data: { user } } = await client.auth.getUser();
```

#### 3.2 用户资料自动创建

**创建数据库函数**：
```sql
-- 自动创建用户资料
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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

#### 3.3 优化错误处理

**需要改进的点**：
- [ ] 统一错误消息格式
- [ ] 添加网络错误重试机制
- [ ] 优化加载状态提示
- [ ] 添加离线模式提示

---

### 阶段四：第三方登录集成（可选，3-5天）

#### 4.1 Supabase OAuth 配置

**配置步骤**：
1. 在Supabase Dashboard中配置OAuth提供商
2. 获取OAuth应用ID和密钥
3. 配置回调URL
4. 更新前端代码

**微信登录**：
- [ ] 注册微信开放平台账号
- [ ] 创建网站应用
- [ ] 在Supabase中配置微信OAuth
- [ ] 更新 `ModernAuthModal.vue` 中的微信登录处理

**支付宝登录**：
- [ ] 注册支付宝开放平台账号
- [ ] 创建网页应用
- [ ] 在Supabase中配置支付宝OAuth
- [ ] 更新 `ModernAuthModal.vue` 中的支付宝登录处理

**抖音登录**：
- [ ] 注册抖音开放平台账号
- [ ] 创建应用
- [ ] 在Supabase中配置抖音OAuth
- [ ] 更新 `ModernAuthModal.vue` 中的抖音登录处理

---

### 阶段五：数据迁移和兼容性处理（1-2天）

#### 5.1 本地存储数据迁移

**任务清单**：
- [ ] 创建数据迁移脚本
- [ ] 将 `tianxuan_local_users` 中的数据迁移到Supabase
- [ ] 将用户历史记录迁移到Supabase
- [ ] 验证迁移数据完整性

**迁移脚本示例**：
```typescript
// src/utils/migrateLocalData.ts
export async function migrateLocalUsersToSupabase() {
  const localUsers = JSON.parse(
    localStorage.getItem('tianxuan_local_users') || '[]'
  );
  
  for (const user of localUsers) {
    // 创建Supabase用户
    // 迁移用户资料
    // 迁移历史记录
  }
}
```

#### 5.2 降级机制优化

**当前降级机制问题**：
- 本地存储不安全（密码明文编码）
- 无法跨设备同步
- 无法恢复密码

**优化方案**：
- [ ] 改进降级提示（明确告知用户使用本地模式）
- [ ] 添加Supabase连接状态检测
- [ ] 提供手动重连功能

---

### 阶段六：测试和部署（2-3天）

#### 6.1 功能测试清单

**认证功能**：
- [ ] 注册新用户
- [ ] 登录现有用户
- [ ] 邮箱验证
- [ ] 密码重置
- [ ] 登出
- [ ] 会话刷新
- [ ] 多设备登录

**数据功能**：
- [ ] 保存历史记录
- [ ] 读取历史记录
- [ ] 更新用户资料
- [ ] RLS策略验证

**错误处理**：
- [ ] 网络错误处理
- [ ] Supabase不可用时降级
- [ ] 无效凭证处理
- [ ] 重复注册处理

#### 6.2 性能优化

**优化点**：
- [ ] 添加请求缓存
- [ ] 优化数据库查询
- [ ] 添加加载状态优化
- [ ] 减少不必要的API调用

#### 6.3 安全加固

**安全检查清单**：
- [ ] 验证RLS策略生效
- [ ] 检查API密钥权限范围
- [ ] 验证密码加密存储
- [ ] 检查会话token过期时间
- [ ] 验证CORS配置

---

## 📋 实施步骤总结

### 第一步：立即执行（今天）
1. ✅ 创建Supabase项目
2. ✅ 配置环境变量
3. ✅ 验证客户端连接

### 第二步：数据库设计（明天-后天）
1. ✅ 设计表结构
2. ✅ 创建数据库表
3. ✅ 配置RLS策略
4. ✅ 创建触发器

### 第三步：功能验证（第3-4天）
1. ✅ 测试注册/登录流程
2. ✅ 验证用户资料自动创建
3. ✅ 测试历史记录保存

### 第四步：优化和迁移（第5-6天）
1. ✅ 优化错误处理
2. ✅ 迁移本地数据（如有）
3. ✅ 完善用户体验

### 第五步：测试和部署（第7-9天）
1. ✅ 全面功能测试
2. ✅ 性能优化
3. ✅ 安全验证
4. ✅ 部署到生产环境

---

## 🎯 成功标准

### 功能标准
- ✅ 用户可以使用邮箱和密码注册/登录
- ✅ 用户资料自动创建
- ✅ 历史记录可以保存和读取
- ✅ 会话可以持久化
- ✅ 密码重置功能正常

### 安全标准
- ✅ RLS策略正确配置
- ✅ 用户只能访问自己的数据
- ✅ API密钥权限最小化
- ✅ 密码加密存储

### 用户体验标准
- ✅ 注册/登录流程顺畅
- ✅ 错误提示清晰友好
- ✅ 加载状态明确
- ✅ 降级机制不影响基本使用

---

## 📝 注意事项

### 开发环境
- ⚠️ 不要将 `.env` 文件提交到Git
- ⚠️ 使用 `.env.example` 作为配置模板
- ⚠️ 在本地和测试环境使用不同的Supabase项目

### 安全性
- ⚠️ Anon Key可以在前端使用，但要注意RLS策略
- ⚠️ Service Role Key只能在服务器端使用，绝不要暴露给前端
- ⚠️ 定期更新Supabase依赖包

### 成本控制
- ⚠️ Supabase免费版有使用限制，注意监控用量
- ⚠️ 数据库查询优化以减少API调用
- ⚠️ 考虑使用缓存减少数据库压力

---

## 🔗 参考资源

- [Supabase官方文档](https://supabase.com/docs)
- [Supabase Auth文档](https://supabase.com/docs/guides/auth)
- [Supabase RLS文档](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase OAuth文档](https://supabase.com/docs/guides/auth/social-login)

---

**创建时间**: 2024年12月
**最后更新**: 2024年12月
**负责人**: 开发团队
**状态**: 📋 待开始















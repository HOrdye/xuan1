# Supabase 阶段二执行指南

## 📋 阶段二任务概述

**目标**：创建数据库表结构并配置安全策略

**包含内容**：
1. ✅ 创建用户资料表（profiles）
2. ✅ 创建历史记录表（divination_history）
3. ✅ 配置Row Level Security (RLS)策略
4. ✅ 创建触发器（自动更新updated_at、新用户自动创建profile）

**预计时间**：30-60分钟

---

## 🚀 执行步骤

### 第一步：登录Supabase Dashboard

1. 访问 https://supabase.com
2. 登录您的账户
3. 选择项目：`vdxxpsjdiswztipauhwb` (或点击项目URL: https://vdxxpsjdiswztipauhwb.supabase.co)

### 第二步：打开SQL Editor

1. 在左侧菜单中找到 **"SQL Editor"**
2. 点击进入
3. 点击 **"New query"** 按钮创建新查询

### 第三步：执行SQL脚本

1. **打开SQL脚本文件**
   - 文件路径：`scripts/supabase-stage2-create-tables.sql`
   - 可以在此文件中查看完整的SQL脚本

2. **复制SQL脚本**
   - 打开 `scripts/supabase-stage2-create-tables.sql` 文件
   - 全选并复制所有内容（Ctrl+A, Ctrl+C）

3. **粘贴到SQL Editor**
   - 在Supabase Dashboard的SQL Editor中
   - 粘贴复制的SQL脚本（Ctrl+V）

4. **执行脚本**
   - 点击右下角的 **"Run"** 按钮
   - 或使用快捷键 `Ctrl+Enter`

5. **查看执行结果**
   - 脚本执行完成后，会在底部显示结果
   - 应该看到类似以下的消息：
     ```
     ✅ profiles表创建成功
     ✅ divination_history表创建成功
     ✅ 所有表创建完成！
     ```

---

## ✅ 验证步骤

### 验证1：检查表是否创建成功

在SQL Editor中执行以下查询：

```sql
-- 检查profiles表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'divination_history');
```

**预期结果**：应该返回两行数据，分别是 `profiles` 和 `divination_history`

### 验证2：检查RLS策略

在SQL Editor中执行以下查询：

```sql
-- 检查profiles表的RLS策略
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'profiles';

-- 检查divination_history表的RLS策略
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'divination_history';
```

**预期结果**：
- `profiles` 表应该有3个策略（SELECT、UPDATE、INSERT）
- `divination_history` 表应该有4个策略（SELECT、INSERT、UPDATE、DELETE）

### 验证3：检查触发器

在SQL Editor中执行以下查询：

```sql
-- 检查触发器
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public' 
OR event_object_schema = 'auth';
```

**预期结果**：
- 应该看到 `update_profiles_updated_at` 触发器（在profiles表上）
- 应该看到 `on_auth_user_created` 触发器（在auth.users表上）

---

## 🧪 功能测试

### 测试1：新用户自动创建profile

1. **在前端注册新用户**
   - 打开应用，点击注册
   - 输入邮箱和密码
   - 完成注册

2. **验证profile是否自动创建**
   在SQL Editor中执行：
   ```sql
   SELECT * FROM public.profiles WHERE id IN (
     SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1
   );
   ```
   
   **预期结果**：应该看到新创建的profile记录，包含：
   - `id`: 新用户的UUID
   - `username`: 自动从邮箱生成
   - `preferences`: 默认设置（theme、language、notifications）

### 测试2：插入历史记录

在SQL Editor中执行（需要替换为实际的user_id）：

```sql
-- 注意：需要先登录获取user_id，或使用auth.uid()
INSERT INTO public.divination_history (user_id, type, question, result)
VALUES (
  auth.uid(), -- 如果已登录，会使用当前用户ID
  'yijing',
  '测试问题：今天适合出门吗？',
  '{"hexagram": "乾", "interpretation": "大吉"}'::jsonb
);
```

**预期结果**：应该成功插入记录

### 测试3：验证RLS策略

**测试查看权限**：
```sql
-- 使用anon key测试（应该可以读取）
SET ROLE anon;
SELECT * FROM public.profiles LIMIT 1;
RESET ROLE;
```

**测试更新权限**：
```sql
-- 尝试更新其他人的profile（应该失败）
-- 先获取一个user_id
SELECT id FROM auth.users LIMIT 1;
-- 然后尝试更新（使用anon角色，应该被RLS阻止）
SET ROLE anon;
UPDATE public.profiles SET username = 'test' WHERE id = '某个user_id';
RESET ROLE;
```

---

## ⚠️ 常见问题

### 问题1：执行SQL脚本时出错

**可能原因**：
- 表已存在（之前执行过脚本）
- 权限不足

**解决方法**：
- 脚本已经包含 `IF NOT EXISTS` 和 `DROP TRIGGER IF EXISTS`，应该可以重复执行
- 如果仍有问题，可以手动删除表后重新执行：
  ```sql
  DROP TABLE IF EXISTS public.divination_history CASCADE;
  DROP TABLE IF EXISTS public.profiles CASCADE;
  ```
  然后重新执行脚本

### 问题2：触发器未执行

**检查方法**：
```sql
-- 检查触发器是否存在
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

**解决方法**：
- 确保触发器已创建
- 注册新用户测试触发器是否工作

### 问题3：RLS策略阻止操作

**检查方法**：
- 查看错误消息，确认是否是RLS策略阻止
- 在SQL Editor中执行查询时，默认使用service_role，不受RLS限制
- 前端应用使用anon key时，会受RLS限制

---

## 📊 执行结果检查清单

完成阶段二后，请确认以下项目：

- [ ] profiles表创建成功
- [ ] divination_history表创建成功
- [ ] profiles表的RLS策略已配置（3个策略）
- [ ] divination_history表的RLS策略已配置（4个策略）
- [ ] update_profiles_updated_at触发器已创建
- [ ] on_auth_user_created触发器已创建
- [ ] 测试注册新用户，profile自动创建成功
- [ ] 测试插入历史记录成功
- [ ] 验证RLS策略正常工作

---

## 🎯 下一步

完成阶段二后，可以继续：

**阶段三：认证流程验证和优化**（1-2天）
- 测试注册/登录流程
- 验证用户资料自动创建
- 优化错误处理

详细步骤请参考：`memory-bank/Supabase实施计划.md`

---

**执行时间**：请记录完成时间  
**执行人**：开发团队  
**状态**：📋 待执行








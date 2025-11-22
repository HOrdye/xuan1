# Supabase 验证 Role 权限说明

## 🔍 问题分析

您遇到了两个问题：

### 问题1：Postgres Role 下只显示最终状态
- **现象**：使用 `postgres role` 执行验证脚本时，只显示了最终状态，没有显示14个检查项的详细列表
- **可能原因**：Supabase SQL Editor 在某些情况下只显示最后一个 SELECT 的结果

### 问题2：Anon Role 显示组件缺失
- **现象**：使用 `anon role` 执行验证脚本时，显示"部分组件缺失"
- **原因**：`anon role` **没有权限**访问系统表（如 `pg_tables`, `pg_policies`, `pg_indexes` 等）
- **这是正常的**：anon role 设计为匿名访问角色，权限受限

---

## ✅ 解决方案

### 方法一：使用 Postgres Role（推荐）

**重要**：验证脚本必须在 **`postgres role`** 下执行！

**原因**：
- `postgres role` 是超级用户角色，有完整权限
- 可以访问所有系统表（`pg_*`, `information_schema`）
- 可以绕过 RLS 策略进行验证

**执行步骤**：
1. 在 SQL Editor 底部，点击 "Role: postgres" 下拉菜单
2. 选择 **"postgres role"**
3. 执行验证脚本 `scripts/supabase-stage2-verify-final.sql`

---

### 方法二：分步验证

如果统一脚本仍然只显示最终状态，可以分步执行：

#### 步骤1：验证表是否存在
```sql
SELECT 
  'profiles表' as 检查项,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'profiles'
    ) THEN '✅ 存在'
    ELSE '❌ 不存在'
  END as 状态
UNION ALL
SELECT 
  'divination_history表',
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'divination_history'
    ) THEN '✅ 存在'
    ELSE '❌ 不存在'
  END;
```

#### 步骤2：验证RLS策略
```sql
SELECT 
  tablename as 表名,
  COUNT(*) as 策略数量,
  CASE 
    WHEN tablename = 'profiles' AND COUNT(*) >= 3 THEN '✅ 足够'
    WHEN tablename = 'divination_history' AND COUNT(*) >= 4 THEN '✅ 足够'
    ELSE '❌ 不足'
  END as 状态
FROM pg_policies
WHERE tablename IN ('profiles', 'divination_history')
GROUP BY tablename;
```

#### 步骤3：验证触发器
```sql
SELECT 
  trigger_name as 触发器名称,
  event_object_table as 表名,
  CASE WHEN trigger_name IS NOT NULL THEN '✅ 存在' ELSE '❌ 不存在' END as 状态
FROM information_schema.triggers
WHERE trigger_name IN ('update_profiles_updated_at', 'on_auth_user_created');
```

---

## 📊 Role 权限对比

| Role | 权限级别 | 可以访问系统表 | 可以绕过RLS | 适用场景 |
|------|---------|---------------|------------|---------|
| **postgres** | 超级用户 | ✅ 是 | ✅ 是 | 管理和验证 |
| **anon** | 匿名访问 | ❌ 否 | ❌ 否 | 前端应用（未登录） |
| **authenticated** | 已认证用户 | ❌ 否 | ❌ 否 | 前端应用（已登录） |

---

## 🎯 验证成功标准

在 **postgres role** 下执行验证，应该看到：

### 最小成功标准：
- ✅ profiles表存在
- ✅ divination_history表存在
- ✅ profiles表有至少3个RLS策略
- ✅ divination_history表有至少4个RLS策略
- ✅ 两个触发器都存在（update_profiles_updated_at, on_auth_user_created）

### 完整成功标准（14个检查项）：
如果使用新的验证脚本 `supabase-stage2-verify-final.sql`，应该看到：
1. profiles表 ✅
2. divination_history表 ✅
3. profiles表索引 ✅
4. divination_history表索引 ✅
5. profiles表RLS启用 ✅
6. divination_history表RLS启用 ✅
7. profiles表RLS策略 ✅
8. divination_history表RLS策略 ✅
9. updated_at触发器 ✅
10. 新用户自动创建profile触发器 ✅
11. update_updated_at_column函数 ✅
12. handle_new_user函数 ✅
13. profiles表字段数 ✅
14. divination_history表字段数 ✅

---

## ⚠️ 关于 Anon Role 的说明

**重要**：使用 `anon role` 验证时会显示"组件缺失"是**正常的**！

**原因**：
- `anon role` 没有权限访问 `pg_tables`, `pg_policies` 等系统表
- 验证脚本中的 `EXISTS` 查询会失败，导致显示"不存在"
- **这不代表表真的不存在**，只是 anon role 看不到系统信息

**结论**：
- ✅ **验证脚本必须在 postgres role 下执行**
- ❌ **不要在 anon role 或 authenticated role 下验证**

---

## 🔧 如何确保看到所有检查项

如果使用 `postgres role` 仍然只看到最终状态，可以：

1. **使用新的验证脚本**：`scripts/supabase-stage2-verify-final.sql`
   - 这个脚本将检查项和最终状态分为两个独立的查询
   - 应该会显示两个结果表

2. **检查是否选择了正确的 Role**：
   - 确保 SQL Editor 底部显示 "Role: postgres"
   - 如果显示 "Role: anon"，点击下拉菜单选择 "postgres role"

3. **分步执行**：
   - 先执行检查项部分（第一个 SELECT）
   - 再执行最终状态部分（第二个 SELECT）

---

## 📝 快速验证清单

使用以下简单查询快速验证（在 postgres role 下）：

```sql
-- 快速验证（所有内容在一行显示）
SELECT 
  '表' as 类型,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('profiles', 'divination_history')) as 数量,
  CASE WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('profiles', 'divination_history')) = 2 
    THEN '✅' ELSE '❌' END as 状态
UNION ALL
SELECT 'RLS策略', 
  (SELECT COUNT(*) FROM pg_policies WHERE tablename IN ('profiles', 'divination_history')),
  CASE WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename IN ('profiles', 'divination_history')) >= 7 
    THEN '✅' ELSE '❌' END
UNION ALL
SELECT '触发器',
  (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_name IN ('update_profiles_updated_at', 'on_auth_user_created')),
  CASE WHEN (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_name IN ('update_profiles_updated_at', 'on_auth_user_created')) = 2 
    THEN '✅' ELSE '❌' END;
```

这个查询会显示3行结果，每个都有数量和状态。

---

**重要提示**：
- ✅ 始终在 **postgres role** 下执行验证
- ❌ 不要在 anon role 下验证（会显示错误结果）
- 📊 如果只看到最终状态，可能是 Supabase UI 的限制，可以分步执行验证








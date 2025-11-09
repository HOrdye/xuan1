# Supabase 阶段二验证指南

## 🔍 如何判断验证是否成功

### 方法一：使用简单验证脚本（推荐）

我已经创建了一个更清晰的验证脚本：`scripts/supabase-stage2-verify-simple.sql`

**执行步骤**：

1. 在Supabase Dashboard的SQL Editor中
2. 创建新查询或打开新标签页
3. 复制 `scripts/supabase-stage2-verify-simple.sql` 的全部内容
4. 粘贴并执行

**如何阅读结果**：

脚本会执行**14个独立的检查**，每个检查会显示一行结果，格式如下：

```
检查项                    状态
1. profiles表             ✅ 存在
2. divination_history表   ✅ 存在
3. profiles表索引         ✅ 存在 (2个索引)
4. divination_history表索引 ✅ 存在 (4个索引)
...
📊 最终状态               🎉 阶段二配置成功！所有组件都已创建
```

**判断标准**：
- ✅ **成功**：所有检查项都显示"✅"
- ❌ **失败**：任何检查项显示"❌"或"⚠️"

---

### 方法二：手动快速检查

在SQL Editor中依次执行以下查询：

#### 1. 检查表是否存在

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'divination_history');
```

**预期结果**：应该返回2行
- `profiles`
- `divination_history`

#### 2. 检查RLS策略

```sql
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN ('profiles', 'divination_history')
GROUP BY tablename;
```

**预期结果**：
- `profiles` 应该有 **3个策略**
- `divination_history` 应该有 **4个策略**

#### 3. 检查触发器

```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name IN ('update_profiles_updated_at', 'on_auth_user_created');
```

**预期结果**：应该返回2行
- `update_profiles_updated_at` (在 `profiles` 表上)
- `on_auth_user_created` (在 `users` 表上)

---

## ✅ 验证成功的标准

阶段二配置成功的标志是：

| 组件 | 要求 | 验证方法 |
|------|------|----------|
| **表** | profiles和divination_history都存在 | 查询information_schema.tables |
| **索引** | profiles有≥2个索引，divination_history有≥4个索引 | 查询pg_indexes |
| **RLS** | 两个表的RLS都已启用 | 查询pg_tables的rowsecurity字段 |
| **策略** | profiles有≥3个策略，divination_history有≥4个策略 | 查询pg_policies |
| **触发器** | update_profiles_updated_at和on_auth_user_created都存在 | 查询information_schema.triggers |
| **函数** | update_updated_at_column和handle_new_user都存在 | 查询information_schema.routines |

---

## 🔧 如果验证失败

### 问题1：表不存在

**症状**：查询表时返回0行或报错"relation does not exist"

**解决方法**：
1. 检查是否执行了创建脚本 `supabase-stage2-create-tables.sql`
2. 检查执行过程中是否有错误
3. 重新执行创建脚本

### 问题2：RLS策略不足

**症状**：策略数量少于预期

**解决方法**：
1. 查看具体的策略名称：
   ```sql
   SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles';
   ```
2. 如果缺少策略，重新执行创建脚本的RLS部分

### 问题3：触发器不存在

**症状**：查询触发器时返回0行

**解决方法**：
1. 检查函数是否存在（触发器依赖函数）
2. 重新执行创建脚本的触发器部分

---

## 📊 完整的验证清单

使用以下清单逐项检查：

- [ ] profiles表存在
- [ ] divination_history表存在
- [ ] profiles表有索引（至少2个）
- [ ] divination_history表有索引（至少4个）
- [ ] profiles表RLS已启用
- [ ] divination_history表RLS已启用
- [ ] profiles表有RLS策略（至少3个）
- [ ] divination_history表有RLS策略（至少4个）
- [ ] update_profiles_updated_at触发器存在
- [ ] on_auth_user_created触发器存在
- [ ] update_updated_at_column函数存在
- [ ] handle_new_user函数存在

**如果以上所有项目都打勾，说明阶段二配置成功！** ✅

---

## 🎯 下一步

验证成功后，可以：

1. **测试注册新用户**
   - 在前端注册一个新用户
   - 验证profile是否自动创建

2. **开始阶段三**
   - 认证流程验证和优化
   - 测试完整的注册/登录流程

---

**提示**：如果使用简单验证脚本，最终状态会显示一个总结，明确告知配置是否成功。







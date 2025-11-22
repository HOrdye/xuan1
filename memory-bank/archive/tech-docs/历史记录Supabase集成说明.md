# 历史记录Supabase集成说明

## ✅ 已完成的工作

### 1. 创建Supabase历史记录服务

**文件**：`src/services/divinationHistoryService.ts`

**功能**：
- ✅ 保存历史记录到Supabase
- ✅ 从Supabase获取历史记录
- ✅ 从Supabase删除历史记录
- ✅ 类型转换（本地格式 ↔ Supabase格式）

### 2. 修改历史记录服务

**文件**：`src/services/historyService.ts`

**改进**：
- ✅ `addHistoryItem`：保存时同时保存到Supabase和localStorage
- ✅ `removeHistoryItem`：删除时同时从Supabase和localStorage删除
- ✅ 降级机制：Supabase失败不影响localStorage保存

---

## 🔧 工作原理

### 保存流程

1. **先保存到localStorage**（确保即使Supabase失败也能保存）
2. **然后尝试保存到Supabase**（如果用户已登录）
3. **如果Supabase保存成功**，更新localStorage中的`supabase_id`

### 类型映射

| 本地类型 | Supabase类型 | 说明 |
|---------|-------------|------|
| `fortune` | `yijing` | 今日运势/易经占卜 |
| `divination` | `yijing` | 易经占卜 |
| `jiaoBei` | `jiaobei` | 筊杯占卜 |
| `tarot` | `tarot` | 塔罗牌 |

**注意**：`dilemma`（两难抉择）在本地类型中没有对应，可以映射到`yijing`

---

## 🧪 测试步骤

### 测试1：保存历史记录到Supabase

**步骤**：
1. 登录用户
2. 进行一次占卜操作（易经占卜、塔罗牌等）
3. 检查控制台日志
4. 在Supabase Dashboard中验证

**预期结果**：
- ✅ 控制台显示：`✅ 历史记录已保存到Supabase: [id]`
- ✅ 在Supabase Dashboard → Table Editor → divination_history 中能看到新记录
- ✅ 记录的`user_id`对应当前登录用户

**验证SQL查询**：
```sql
SELECT 
  h.id,
  h.type,
  h.question,
  h.result,
  h.created_at,
  u.email
FROM public.divination_history h
JOIN auth.users u ON h.user_id = u.id
ORDER BY h.created_at DESC
LIMIT 5;
```

### 测试2：未登录时的行为

**步骤**：
1. 登出用户
2. 进行一次占卜操作
3. 检查结果

**预期结果**：
- ✅ 仍然保存到localStorage
- ✅ 控制台显示：`⚠️ 用户未登录，跳过保存到Supabase`
- ✅ 功能正常，不影响使用

### 测试3：删除历史记录

**步骤**：
1. 登录用户
2. 删除一条历史记录
3. 验证Supabase中的记录也被删除

**预期结果**：
- ✅ 从localStorage删除
- ✅ 从Supabase删除（如果记录有`supabase_id`）
- ✅ 控制台显示删除成功

---

## 📊 数据同步状态

历史记录现在支持：

1. **双重保存**：
   - localStorage（离线可用）
   - Supabase（云端同步）

2. **降级机制**：
   - Supabase失败不影响localStorage保存
   - 未登录时只保存到localStorage

3. **数据完整性**：
   - 如果Supabase保存成功，记录`supabase_id`
   - 删除时同时从两个地方删除

---

## 🔍 验证历史记录是否保存成功

### 方法1：在Supabase Dashboard中查看

1. 登录 Supabase Dashboard
2. 进入 **Table Editor → divination_history**
3. 检查是否有新记录

### 方法2：使用SQL查询

```sql
-- 查看最新5条历史记录
SELECT 
  h.id,
  h.type,
  h.question,
  LEFT(h.result::text, 100) as result_preview,
  h.created_at,
  u.email
FROM public.divination_history h
JOIN auth.users u ON h.user_id = u.id
ORDER BY h.created_at DESC
LIMIT 5;
```

### 方法3：检查浏览器控制台

保存时应该看到：
```
✅ History item saved to localStorage
✅ 历史记录已保存到Supabase: [id]
```

---

## ⚠️ 注意事项

1. **RLS策略**：
   - 用户只能看到和删除自己的历史记录
   - RLS策略已配置，安全性有保障

2. **类型转换**：
   - 本地类型和Supabase类型可能不完全一致
   - 转换逻辑在`DivinationHistoryService.convertTypeToSupabase`中

3. **数据迁移**：
   - 现有的localStorage历史记录不会自动同步到Supabase
   - 如果需要迁移，需要手动实现迁移脚本

---

## 🐛 故障排除

### 问题1：历史记录未保存到Supabase

**可能原因**：
- 用户未登录
- Supabase连接失败
- RLS策略阻止

**解决方法**：
1. 检查用户是否登录
2. 检查控制台错误信息
3. 验证RLS策略配置

### 问题2：类型不匹配

**可能原因**：
- 类型转换逻辑有误

**解决方法**：
1. 检查控制台日志
2. 查看`DivinationHistoryService.convertTypeToSupabase`方法
3. 必要时调整类型映射

---

**创建时间**：2024年12月  
**状态**：✅ 已实现，待测试








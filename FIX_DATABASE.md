# 数据库修复指南

## 🚨 问题描述
错误：`column "created_by" does not exist`

这是因为现有的数据库表结构缺少新增的字段和表。

## 🔧 解决方案

### 方法一：执行迁移脚本（推荐）

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 进入你的项目
3. 点击左侧菜单的 **SQL Editor**
4. 创建新查询
5. 复制并执行 `database/migration-add-topic-features.sql` 中的所有内容

### 方法二：重新创建数据库

如果你的数据库中没有重要数据，可以：

1. 在 Supabase Dashboard 中删除现有表：
   - `messages`
   - `topics` 
   - `message_likes`

2. 执行完整的 `database/schema.sql`

## 📋 迁移脚本内容

迁移脚本会执行以下操作：

1. ✅ 为 `topics` 表添加 `created_by` 字段
2. ✅ 创建 `topic_messages` 表
3. ✅ 创建 `topic_message_likes` 表
4. ✅ 添加必要的索引
5. ✅ 设置触发器和安全策略
6. ✅ 更新现有数据

## 🎯 验证修复

执行迁移后，你应该能看到：

- `topics` 表有 `created_by` 字段
- 新的 `topic_messages` 表
- 新的 `topic_message_likes` 表

## 🚀 重启项目

修复数据库后：

```bash
pnpm dev:full
```

现在话题讨论功能应该可以正常工作了！

## 📞 如果还有问题

1. 检查 Supabase 控制台的错误日志
2. 确认所有表都已创建
3. 验证 RLS 策略已启用
4. 检查环境变量配置
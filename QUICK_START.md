# 快速启动指南

## 当前状态 ✅

- ✅ 依赖已安装 (`@supabase/supabase-js`)
- ✅ TypeScript 编译无错误
- ✅ 社区服务已配置使用 Supabase
- ✅ 抽奖服务继续使用原 API

## 下一步操作

### 1. 配置 Supabase（必需）

在 `.env.local` 文件中添加你的 Supabase 配置：

```env
# 现有配置
VITE_API_URL=http://localhost:3001

# 添加 Supabase 配置
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 创建数据库表

1. 登录 [Supabase](https://supabase.com)
2. 创建新项目
3. 在 SQL Editor 中执行 `database/schema.sql` 中的所有语句

### 3. 启动项目

```bash
# 启动前端 + 后端
pnpm dev:full

# 或者分别启动
pnpm dev        # 前端
pnpm dev:server # 后端 API
```

## 功能说明

### 🟢 使用 Supabase 的功能
- 社区留言（发布、查看、点赞）
- 话题讨论

### 🔵 使用原 API 的功能  
- 抽奖系统（用户ID生成、抽奖记录等）

## 测试连接

如果配置了 Supabase，可以运行测试脚本：

```bash
node test-supabase.js
```

## 故障排除

### 如果遇到 Supabase 连接问题：
1. 检查 `.env.local` 中的配置是否正确
2. 确认 Supabase 项目已创建并运行
3. 确认数据库表已创建

### 如果遇到抽奖 API 问题：
1. 确保后端服务器在运行 (`pnpm dev:server`)
2. 检查 `http://localhost:3001/api/health` 是否可访问

## 当前架构

```
前端 (React + Vite)
├── 社区功能 → Supabase 数据库
└── 抽奖功能 → Express API 服务器
```

这样的混合架构让你可以：
- 体验 Supabase 的实时数据库功能
- 保持现有的抽奖 API 实现
- 根据需要逐步迁移其他功能
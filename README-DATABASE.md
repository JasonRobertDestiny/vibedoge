# VibeDoge 抽奖系统 - 数据库集成指南

## 🎉 项目概述

这是一个基于React + Node.js + Supabase的现代化抽奖系统，集成了真实的数据库功能，支持用户注册、抽奖记录存储和统计分析。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制环境变量模板：
```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的Supabase配置：
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
PORT=3001
NODE_ENV=development
```

### 3. 数据库设置

在Supabase SQL编辑器中执行 `database-setup.sql` 文件中的SQL命令来创建所需的表：

```sql
-- 复制 database-setup.sql 文件的内容到 Supabase SQL 编辑器中执行
```

### 4. 启动开发服务器

启动后端API服务器：
```bash
node server.cjs
```

启动前端开发服务器（在新终端中）：
```bash
npm run dev
```

或者同时启动前后端：
```bash
npm run dev:full
```

## 🎯 功能特性

### 🔐 用户系统
- **MCP用户ID生成**: 自动生成唯一用户标识符
- **数据库注册**: 将用户信息保存到Supabase数据库
- **会话管理**: 支持用户会话持久化

### 🎲 抽奖系统
- **抽奖ID生成**: 为每个用户生成唯一的抽奖ID
- **真实数据存储**: 抽奖记录保存到数据库
- **抽奖执行**: 支持真实抽奖逻辑和奖品分配
- **状态管理**: 跟踪抽奖状态（active/completed/cancelled）

### 📊 统计分析
- **用户统计**: 个人抽奖次数、成功率等
- **全局统计**: 总用户数、总抽奖数等
- **实时数据**: 支持数据实时刷新

### 🎨 用户界面
- **三种视图模式**:
  - 参与抽奖: 传统的抽奖体验
  - API演示: 原始API功能演示
  - 数据库视图: 真实数据管理界面
- **响应式设计**: 支持移动端和桌面端
- **实时反馈**: 操作状态实时显示

## 🏗️ 技术架构

### 前端技术栈
- **React 18** + **TypeScript** - 现代化前端框架
- **Vite** - 快速构建工具
- **Zustand** - 轻量级状态管理
- **Tailwind CSS** - 实用优先的CSS框架
- **Framer Motion** - 动画库
- **Lucide React** - 图标库

### 后端技术栈
- **Node.js** + **Express.js** - 服务器框架
- **Supabase** - PostgreSQL数据库和API
- **UUID** - 唯一标识符生成

### 数据库表结构

```sql
-- 用户表
users (
  id UUID PRIMARY KEY,
  mcp_user_id VARCHAR(255) UNIQUE,
  username VARCHAR(100),
  email VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- 抽奖记录表
lottery_records (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  lottery_id VARCHAR(255) UNIQUE,
  status VARCHAR(50),
  prize_name VARCHAR(255),
  prize_value VARCHAR(100),
  prize_rarity VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## 📁 项目结构

```
vibedoge/
├── src/
│   ├── components/          # React组件
│   │   ├── ui/             # 基础UI组件
│   │   └── business/       # 业务组件
│   ├── pages/              # 页面组件
│   ├── store/              # Zustand状态管理
│   ├── services/           # 服务层
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript类型定义
│   └── hooks/              # 自定义Hooks
├── api/
│   ├── routes/             # API路由
│   ├── controllers/        # 业务控制器
│   └── services/          # 数据库服务
├── config/
│   └── supabase.cjs       # Supabase配置
├── public/                # 静态资源
├── database-setup.sql     # 数据库初始化脚本
├── test-database.js       # 数据库连接测试
├── server.cjs            # Express服务器
├── vite.config.ts        # Vite配置
└── package.json          # 项目依赖
```

## 🔧 API端点

### 用户相关
- `POST /api/lottery/generate-user-id` - 生成用户ID并注册
- `GET /api/lottery/user-stats/:userId` - 获取用户统计

### 抽奖相关
- `POST /api/lottery/generate-lottery-id` - 生成抽奖ID
- `GET /api/lottery/user-lotteries/:userId` - 获取用户抽奖记录
- `GET /api/lottery/info/:lotteryId` - 获取抽奖详细信息
- `POST /api/lottery/draw` - 执行抽奖

### 统计相关
- `GET /api/lottery/global-stats` - 获取全局统计
- `GET /api/lottery/health` - 健康检查

## 🧪 测试

### 数据库连接测试
```bash
node test-database.js
```

### API测试
启动服务器后，可以测试以下端点：
```bash
# 健康检查
curl http://localhost:3001/api/lottery/health

# 生成用户ID
curl -X POST http://localhost:3001/api/lottery/generate-user-id

# 生成抽奖ID
curl -X POST http://localhost:3001/api/lottery/generate-lottery-id \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id"}'
```

## 🚀 部署

### Vercel部署
1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署

### 环境变量
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
NODE_ENV=production
```

## 🐛 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查Supabase URL和密钥是否正确
   - 确认数据库表已创建
   - 运行 `node test-database.js` 测试连接

2. **API请求失败**
   - 确认后端服务器正在运行
   - 检查CORS设置
   - 查看服务器日志

3. **前端页面无法加载**
   - 确认依赖已安装
   - 检查环境变量配置
   - 查看浏览器控制台错误

### 调试模式

开发模式下，可以查看详细的错误信息：
- 后端日志：控制台输出
- 前端日志：浏览器开发者工具
- 数据库日志：Supabase控制台

## 📝 开发说明

### 添加新功能
1. 在相应的服务层添加业务逻辑
2. 更新API路由和控制器
3. 修改前端状态管理
4. 更新UI组件

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint规则
- 使用Prettier格式化代码
- 编写组件和函数文档

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License

---

**注意**: 这是一个演示项目，在生产环境使用前请确保充分测试并加强安全措施。
# VibeDoge交易所Demo版 - API文档

## 目录

1. [项目概述](#项目概述)
2. [API接口规范](#api接口规范)
3. [技术栈](#技术栈)
4. [本地开发配置](#本地开发配置)
5. [部署说明](#部署说明)

---

## 项目概述

VibeDoge交易所Demo版是一个展示性的Web应用，主要功能包括：

### 核心功能

- **用户ID管理**: 通过MCP服务自动生成用户唯一标识
- **抽奖系统**: 基础的抽奖功能演示
- **社区互动**: 留言板和社区功能
- **全球统计**: 平台数据展示
- **响应式设计**: 支持桌面端和移动端

### 技术特点

- **前后端分离**: React前端 + Express后端
- **模拟数据**: 使用模拟数据，无需真实数据库
- **快速部署**: 支持Vercel等平台部署
- **开发友好**: 热重载、TypeScript支持

---

## API接口规范

### 基础信息

- **Base URL**: `http://localhost:3001/api`
- **数据格式**: JSON
- **字符编码**: UTF-8
- **认证方式**: 无需认证（Demo版本）

### 1. 用户ID生成接口

#### POST /api/lottery/generate-user-id

生成用户唯一ID，用于标识用户身份。

**请求体**: 无

**响应**:
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Vibe Coding抽奖用户ID生成成功"
}
```

### 2. 抽奖ID生成接口

#### POST /api/lottery/generate-lottery-id

为用户生成抽奖ID，支持多次生成。

**请求体**:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "lotteryId": "660e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Vibe Coding抽奖ID生成成功"
}
```

### 3. 用户抽奖记录查询接口

#### GET /api/lottery/user-lotteries/{userId}

获取指定用户的所有抽奖记录。

**路径参数**:
- `userId`: 用户ID

**响应**:
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "lotteries": [
      {
        "lotteryId": "660e8400-e29b-41d4-a716-446655440001",
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "status": "active"
      }
    ],
    "total": 1
  },
  "message": "获取Vibe Coding抽奖记录成功"
}
```

### 4. 抽奖信息查询接口

#### GET /api/lottery/info/{lotteryId}

获取指定抽奖的详细信息。

**路径参数**:
- `lotteryId`: 抽奖ID

**响应**:
```json
{
  "success": true,
  "data": {
    "lotteryId": "660e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "status": "active",
    "type": "demo",
    "description": "Vibe Coding抽奖Demo"
  },
  "message": "获取Vibe Coding抽奖信息成功"
}
```

### 5. API健康检查接口

#### GET /api/lottery/health

API服务健康状态检查。

**响应**:
```json
{
  "success": true,
  "message": "Vibe Coding抽奖API服务正常",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0-demo"
}
```

### 错误响应格式

所有API在出错时返回统一的错误格式：

```json
{
  "success": false,
  "message": "错误描述信息",
  "error": "详细错误信息"
}
```

### HTTP状态码

- `200`: 请求成功
- `400`: 请求参数错误
- `404`: 资源不存在
- `500`: 服务器内部错误

---

## 技术栈

### 前端技术

- **React**: 18.2.0 - 用户界面框架
- **TypeScript**: 5.2.2 - 类型安全的JavaScript
- **Vite**: 5.0.0 - 构建工具和开发服务器
- **Tailwind CSS**: 3.3.6 - CSS框架
- **React Router**: 6.20.1 - 路由管理
- **Framer Motion**: 10.16.16 - 动画库
- **Zustand**: 4.4.7 - 状态管理
- **Lucide React**: 0.294.0 - 图标库

### 后端技术

- **Node.js**: 运行时环境
- **Express**: 5.1.0 - Web框架
- **UUID**: 13.0.0 - 唯一标识符生成

### 开发工具

- **ESLint**: 代码质量检查
- **TypeScript**: 类型检查
- **Concurrently**: 并发运行多个命令

---

## 本地开发配置

### 环境要求

- **Node.js**: 18.0.0 或更高版本
- **pnpm**: 最新版本（推荐）
- **操作系统**: macOS, Windows, Linux

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd vibedoge2
```

2. **安装依赖**
```bash
pnpm install
```

3. **启动开发服务器**

启动前端开发服务器：
```bash
pnpm dev
```

启动后端API服务器：
```bash
pnpm dev:server
```

同时启动前后端：
```bash
pnpm dev:full
```

### 开发服务器地址

- **前端**: http://localhost:5173
- **后端API**: http://localhost:3001

### 项目结构

```
vibedoge2/
├── src/                    # 前端源码
│   ├── components/         # React组件
│   ├── pages/             # 页面组件
│   ├── services/          # 服务层
│   ├── utils/             # 工具函数
│   ├── types/             # TypeScript类型
│   └── main.tsx           # 入口文件
├── api/                   # 后端API
│   └── routes/            # API路由
├── public/                # 静态资源
├── docs/                  # 文档
└── .trae/                 # 项目文档
    └── documents/
```

---

## 部署说明

### Vercel部署（推荐）

1. **前端部署**
   - 连接GitHub仓库到Vercel
   - 自动检测Vite项目配置
   - 自动部署和更新

2. **后端部署**
   - 可以部署到Vercel Functions
   - 或使用其他Node.js托管服务

### 构建命令

```bash
# 构建前端
pnpm build

# 预览构建结果
pnpm preview
```

### 环境变量

目前项目不需要特殊的环境变量配置，所有功能都使用模拟数据。

### 注意事项

- 当前版本使用模拟数据，适合演示和开发
- 生产环境需要集成真实的数据库
- API接口需要添加适当的认证和授权机制
- 建议添加API限流和安全防护

---

## MCP服务集成

### MCP用户管理

项目集成了MCP（Model Context Protocol）服务用于用户身份管理：

```typescript
// 生成MCP用户
const user = await mcpService.createUser();

// 恢复用户会话
const user = mcpService.restoreFromStorage();

// 更新活跃状态
mcpService.heartbeat();

// 清除会话
mcpService.clearSession();
```

### 用户数据结构

```typescript
interface MCPUser {
  id: string;           // 用户唯一标识
  createdAt: string;    // 创建时间
  lastActiveAt: string; // 最后活跃时间
  sessionToken: string; // 会话令牌
}
```

### 本地存储

- 用户信息自动保存到localStorage
- 页面刷新后自动恢复用户状态
- 支持手动清除会话数据

---

## 开发指南

### 添加新的API接口

1. 在 `api/routes/lottery.cjs` 中添加新路由
2. 定义请求和响应格式
3. 添加错误处理
4. 更新API文档

### 添加新的前端页面

1. 在 `src/pages/` 中创建新组件
2. 在路由配置中添加路径
3. 更新导航菜单
4. 添加相应的类型定义

### 代码规范

- 使用TypeScript进行类型检查
- 遵循ESLint规则
- 组件使用函数式写法
- 使用Tailwind CSS进行样式设计

### 调试技巧

- 使用浏览器开发者工具
- 检查网络请求和响应
- 查看控制台错误信息
- 使用React Developer Tools

---

## 常见问题

### Q: 如何修改API端口？
A: 修改 `server.cjs` 中的端口配置。

### Q: 如何添加新的模拟数据？
A: 在 `src/utils/mockData.ts` 中添加新的数据。

### Q: 如何自定义主题样式？
A: 修改 `tailwind.config.js` 中的主题配置。

### Q: 部署后API无法访问？
A: 检查API路径配置和CORS设置。

---

*最后更新: 2024年1月*
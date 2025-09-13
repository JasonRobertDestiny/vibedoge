const express = require('express');
const path = require('path');
const lotteryRoutes = require('./api/routes/lottery.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 中间件
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// API 路由
app.use('/api/lottery', lotteryRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Vibe Coding抽奖API服务运行正常',
        timestamp: new Date().toISOString(),
        version: '1.0.0-demo'
    });
});

// 静态文件服务（用于生产环境）
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err.stack);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : '服务器错误'
    });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '接口不存在',
        path: req.originalUrl
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 Vibe Coding抽奖API服务器运行在端口 ${PORT}`);
    console.log(`📡 API地址: http://localhost:${PORT}/api`);
    console.log(`🏥 健康检查: http://localhost:${PORT}/api/health`);
    console.log(`🎲 Vibe Coding抽奖API: http://localhost:${PORT}/api/lottery`);
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('收到 SIGTERM 信号，正在关闭服务器...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('收到 SIGINT 信号，正在关闭服务器...');
    process.exit(0);
});

module.exports = app;
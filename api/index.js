const express = require('express');
const lotteryRoutes = require('./routes/lottery.cjs');

const app = express();

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

module.exports = app;
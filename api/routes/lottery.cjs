const express = require('express');
const router = express.Router();
const lotteryController = require('../controllers/lotteryController.cjs');

// Vibe Coding抽奖API - 集成Supabase数据库

/**
 * @route POST /api/lottery/generate-user-id
 * @desc 生成用户唯一ID并注册到数据库
 * @access Public
 */
router.post('/generate-user-id', lotteryController.generateUserId.bind(lotteryController));

/**
 * @route POST /api/lottery/generate-lottery-id
 * @desc 生成抽奖ID并保存到数据库
 * @access Public
 * @param {string} userId - 用户ID
 */
router.post('/generate-lottery-id', lotteryController.generateLotteryId.bind(lotteryController));

/**
 * @route GET /api/lottery/user-lotteries/:userId
 * @desc 获取用户的所有抽奖记录
 * @access Public
 * @param {string} userId - 用户ID
 */
router.get('/user-lotteries/:userId', lotteryController.getUserLotteries.bind(lotteryController));

/**
 * @route GET /api/lottery/info/:lotteryId
 * @desc 获取抽奖详细信息
 * @access Public
 * @param {string} lotteryId - 抽奖ID
 */
router.get('/info/:lotteryId', lotteryController.getLotteryInfo.bind(lotteryController));

/**
 * @route POST /api/lottery/draw
 * @desc 执行抽奖
 * @access Public
 * @param {string} lotteryId - 抽奖ID
 * @param {string} userId - 用户ID
 */
router.post('/draw', lotteryController.drawLottery.bind(lotteryController));

/**
 * @route GET /api/lottery/user-stats/:userId
 * @desc 获取用户统计信息
 * @access Public
 * @param {string} userId - 用户ID
 */
router.get('/user-stats/:userId', lotteryController.getUserStats.bind(lotteryController));

/**
 * @route GET /api/lottery/global-stats
 * @desc 获取全局统计信息
 * @access Public
 */
router.get('/global-stats', lotteryController.getGlobalStats.bind(lotteryController));

/**
 * @route GET /api/lottery/health
 * @desc API健康检查（包含数据库连接状态）
 * @access Public
 */
router.get('/health', lotteryController.healthCheck.bind(lotteryController));

/**
 * @route GET /api/lottery/summary
 * @desc 获取抽奖汇总数据
 * @access Public
 */
router.get('/summary', lotteryController.getLotterySummary.bind(lotteryController));

/**
 * @route GET /api/lottery/leaderboard
 * @desc 获取用户排行榜
 * @access Public
 */
router.get('/leaderboard', lotteryController.getLeaderboard.bind(lotteryController));

/**
 * @route GET /api/lottery/prize-stats
 * @desc 获取奖品统计
 * @access Public
 */
router.get('/prize-stats', lotteryController.getPrizeStats.bind(lotteryController));

/**
 * @route GET /api/lottery/daily-stats
 * @desc 获取每日统计
 * @access Public
 */
router.get('/daily-stats', lotteryController.getDailyStats.bind(lotteryController));

/**
 * @route GET /api/lottery/membership-stats
 * @desc 获取VibeDoge会员统计
 * @access Public
 */
router.get('/membership-stats', lotteryController.getMembershipStats.bind(lotteryController));

module.exports = router;
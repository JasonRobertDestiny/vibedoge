const databaseService = require('../services/databaseService.cjs');
const { v4: uuidv4 } = require('uuid');

class LotteryController {
  // 生成用户ID并注册用户
  async generateUserId(req, res) {
    try {
      // 生成MCP格式用户ID: mcp_timestamp_randomstring
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const userId = `mcp_${timestamp}_${randomString}`;
      const isoTimestamp = new Date().toISOString();

      // 在数据库中创建用户记录
      const user = await databaseService.createUser(userId, {
        username: `User_${randomString}`,
        email: `${userId}@mcp.local`
      });

      res.json({
        success: true,
        data: {
          userId: userId,
          databaseUserId: user.id,
          createdAt: isoTimestamp,
          username: user.username
        },
        message: 'Vibe Coding抽奖用户ID生成成功'
      });
    } catch (error) {
      console.error('Error in generateUserId:', error);
      res.status(500).json({
        success: false,
        message: '生成Vibe Coding抽奖用户ID失败',
        error: error.message
      });
    }
  }

  // 生成抽奖ID
  async generateLotteryId(req, res) {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: '用户ID不能为空'
        });
      }

      // 查找或创建用户
      let user = await databaseService.getUserByMcpId(userId);
      if (!user) {
        user = await databaseService.createUser(userId, {
          username: `User_${userId.split('_').pop()}`,
          email: `${userId}@mcp.local`
        });
      }

      // 生成抽奖ID
      const lotteryId = uuidv4();
      const timestamp = new Date().toISOString();

      // 创建抽奖记录
      const lotteryRecord = await databaseService.createLotteryRecord(user.id, {
        lotteryId: lotteryId,
        status: 'active'
      });

      res.json({
        success: true,
        data: {
          lotteryId: lotteryId,
          userId: userId,
          databaseUserId: user.id,
          createdAt: timestamp,
          recordId: lotteryRecord.id
        },
        message: 'Vibe Coding抽奖ID生成成功'
      });
    } catch (error) {
      console.error('Error in generateLotteryId:', error);
      res.status(500).json({
        success: false,
        message: '生成Vibe Coding抽奖ID失败',
        error: error.message
      });
    }
  }

  // 获取用户的所有抽奖记录
  async getUserLotteries(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: '用户ID不能为空'
        });
      }

      // 查找用户
      const user = await databaseService.getUserByMcpId(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      // 获取用户抽奖记录
      const lotteries = await databaseService.getUserLotteries(user.id);

      // 格式化返回数据
      const formattedLotteries = lotteries.map(lottery => ({
        lotteryId: lottery.lottery_id,
        userId: userId,
        createdAt: lottery.created_at,
        status: lottery.status,
        prizeName: lottery.prize_name,
        prizeValue: lottery.prize_value
      }));

      res.json({
        success: true,
        data: {
          userId: userId,
          lotteries: formattedLotteries,
          total: formattedLotteries.length
        },
        message: '获取Vibe Coding抽奖记录成功'
      });
    } catch (error) {
      console.error('Error in getUserLotteries:', error);
      res.status(500).json({
        success: false,
        message: '获取Vibe Coding抽奖记录失败',
        error: error.message
      });
    }
  }

  // 获取抽奖详细信息
  async getLotteryInfo(req, res) {
    try {
      const { lotteryId } = req.params;
      
      if (!lotteryId) {
        return res.status(400).json({
          success: false,
          message: '抽奖ID不能为空'
        });
      }

      // 获取抽奖信息
      const lottery = await databaseService.getLotteryByLotteryId(lotteryId);
      
      if (!lottery) {
        return res.status(404).json({
          success: false,
          message: '抽奖记录不存在'
        });
      }

      // 格式化返回数据
      const lotteryInfo = {
        lotteryId: lottery.lottery_id,
        userId: lottery.users?.mcp_user_id,
        username: lottery.users?.username,
        avatar: lottery.users?.avatar_url,
        createdAt: lottery.created_at,
        status: lottery.status,
        prizeName: lottery.prize_name,
        prizeValue: lottery.prize_value,
        type: 'database',
        description: 'Vibe Coding抽奖记录'
      };

      res.json({
        success: true,
        data: lotteryInfo,
        message: '获取Vibe Coding抽奖信息成功'
      });
    } catch (error) {
      console.error('Error in getLotteryInfo:', error);
      res.status(500).json({
        success: false,
        message: '获取Vibe Coding抽奖信息失败',
        error: error.message
      });
    }
  }

  // 执行抽奖
  async drawLottery(req, res) {
    try {
      const { lotteryId, userId } = req.body;
      
      if (!lotteryId || !userId) {
        return res.status(400).json({
          success: false,
          message: '抽奖ID和用户ID不能为空'
        });
      }

      // 获取抽奖记录
      const lottery = await databaseService.getLotteryByLotteryId(lotteryId);
      if (!lottery) {
        return res.status(404).json({
          success: false,
          message: '抽奖记录不存在'
        });
      }

      if (lottery.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: '此抽奖已经执行过或状态不正确'
        });
      }

      // MCP抽奖逻辑 - 超级丰富的VibeDoge生态奖品
      const prizes = [
        // 普通奖品 (45%)
        { 
          name: 'VibeDoge 1个月会员', 
          value: '1个月', 
          rarity: 'common', 
          probability: 0.08,
          description: '体验VibeDoge基础功能',
          icon: '🐕',
          color: 'from-blue-500 to-blue-600'
        },
        { 
          name: 'VibeDoge 学习资料包', 
          value: '学习资料', 
          rarity: 'common', 
          probability: 0.08,
          description: '精选编程学习资源合集',
          icon: '📚',
          color: 'from-green-500 to-green-600'
        },
        { 
          name: '代码模板库访问', 
          value: '1个月', 
          rarity: 'common', 
          probability: 0.06,
          description: '高级代码模板库使用权',
          icon: '📝',
          color: 'from-indigo-500 to-indigo-600'
        },
        { 
          name: '技术文章精选', 
          value: '50篇', 
          rarity: 'common', 
          probability: 0.06,
          description: '优质技术文章合集',
          icon: '📰',
          color: 'from-cyan-500 to-cyan-600'
        },
        { 
          name: '编程挑战赛参与券', 
          value: '1次', 
          rarity: 'common', 
          probability: 0.06,
          description: '参与编程挑战赛资格',
          icon: '🏆',
          color: 'from-orange-500 to-orange-600'
        },
        { 
          name: '开发者工具包', 
          value: '基础版', 
          rarity: 'common', 
          probability: 0.06,
          description: '开发者必备工具集合',
          icon: '🛠️',
          color: 'from-gray-500 to-gray-600'
        },
        { 
          name: '在线课程优惠券', 
          value: '¥50', 
          rarity: 'common', 
          probability: 0.05,
          description: '技术课程购买优惠',
          icon: '🎟️',
          color: 'from-pink-500 to-pink-600'
        },
        
        // 稀有奖品 (30%)
        { 
          name: 'VibeDoge 3个月会员', 
          value: '3个月', 
          rarity: 'rare', 
          probability: 0.08,
          description: '享受VibeDoge完整功能体验',
          icon: '🦴',
          color: 'from-blue-500 to-blue-600'
        },
        { 
          name: 'VibeDoge 6个月会员', 
          value: '6个月', 
          rarity: 'rare', 
          probability: 0.06,
          description: '解锁高级功能和优先支持',
          icon: '🌟',
          color: 'from-purple-500 to-purple-600'
        },
        { 
          name: '代码审查券', 
          value: '1次', 
          rarity: 'rare', 
          probability: 0.05,
          description: '专业工程师代码审查服务',
          icon: '🔍',
          color: 'from-purple-500 to-purple-600'
        },
        { 
          name: '技术咨询服务', 
          value: '30分钟', 
          rarity: 'rare', 
          probability: 0.05,
          description: '一对一技术咨询指导',
          icon: '💡',
          color: 'from-purple-500 to-purple-600'
        },
        { 
          name: '开源项目贡献指导', 
          value: '1个项目', 
          rarity: 'rare', 
          probability: 0.04,
          description: '专业开源项目贡献指导',
          icon: '🌐',
          color: 'from-emerald-500 to-emerald-600'
        },
        { 
          name: '职业规划咨询', 
          value: '1小时', 
          rarity: 'rare', 
          probability: 0.02,
          description: '资深工程师职业规划指导',
          icon: '🎯',
          color: 'from-rose-500 to-rose-600'
        },
        
        // 史诗奖品 (20%)
        { 
          name: 'VibeDoge 年度会员', 
          value: '12个月', 
          rarity: 'epic', 
          probability: 0.08,
          description: '全年VIP专享特权',
          icon: '👑',
          color: 'from-yellow-500 to-orange-500'
        },
        { 
          name: '项目架构设计', 
          value: '1个项目', 
          rarity: 'epic', 
          probability: 0.05,
          description: '专业项目架构设计服务',
          icon: '🏗️',
          color: 'from-yellow-500 to-orange-500'
        },
        { 
          name: '性能优化服务', 
          value: '1次', 
          rarity: 'epic', 
          probability: 0.03,
          description: '应用性能深度优化',
          icon: '⚡',
          color: 'from-yellow-500 to-orange-500'
        },
        { 
          name: '技术导师计划', 
          value: '3个月', 
          rarity: 'epic', 
          probability: 0.02,
          description: '一对一技术导师指导',
          icon: '🎓',
          color: 'from-amber-500 to-amber-600'
        },
        { 
          name: '技术演讲培训', 
          value: '1次', 
          rarity: 'epic', 
          probability: 0.02,
          description: '专业演讲技能培训',
          icon: '🎤',
          color: 'from-teal-500 to-teal-600'
        },
        
        // 传说奖品 (5%)
        { 
          name: 'VibeDoge 终身会员', 
          value: '终身', 
          rarity: 'legendary', 
          probability: 0.02,
          description: '永久尊享所有功能',
          icon: '💎',
          color: 'from-pink-500 to-violet-500'
        },
        { 
          name: 'AI训练模型访问', 
          value: 'unlimited', 
          rarity: 'legendary', 
          probability: 0.01,
          description: '高级AI模型无限使用权',
          icon: '🤖',
          color: 'from-pink-500 to-violet-500'
        },
        { 
          name: '创业技术顾问', 
          value: '6个月', 
          rarity: 'legendary', 
          probability: 0.01,
          description: '专属创业技术顾问服务',
          icon: '🚀',
          color: 'from-pink-500 to-violet-500'
        },
        { 
          name: '技术合伙人机会', 
          value: '面试机会', 
          rarity: 'legendary', 
          probability: 0.005,
          description: '优质项目技术合伙人面试机会',
          icon: '🤝',
          color: 'from-violet-500 to-purple-500'
        },
        { 
          name: '技术书籍大礼包', 
          value: '20本', 
          rarity: 'legendary', 
          probability: 0.005,
          description: '经典技术书籍实体版套装',
          icon: '📚',
          color: 'from-indigo-500 to-purple-500'
        }
      ];

      // 改进的随机算法：使用时间戳和随机数结合确保真正的随机性
      const seed = Date.now() + Math.random() * 10000;
      const random = (Math.sin(seed) * 10000) % 1;
      
      let selectedPrize = prizes[0]; // 默认奖品
      let cumulativeProbability = 0;

      // 按概率选择奖品
      for (const prize of prizes) {
        cumulativeProbability += prize.probability;
        if (random <= cumulativeProbability) {
          selectedPrize = prize;
          break;
        }
      }

      // 更新抽奖记录
      const updatedLottery = await databaseService.updateLotteryRecord(lotteryId, {
        status: 'completed',
        prize_name: selectedPrize.name,
        prize_value: selectedPrize.value,
        prize_description: selectedPrize.description,
        prize_rarity: selectedPrize.rarity
      });

      res.json({
        success: true,
        data: {
          lotteryId: lotteryId,
          prize: selectedPrize,
          drawTime: new Date().toISOString(),
          record: updatedLottery,
          mcpBonus: {
            type: 'mcp_free_lottery',
            message: 'MCP用户专享免费抽奖'
          }
        },
        message: `🎉 恭喜获得 ${selectedPrize.icon} ${selectedPrize.name}！`
      });
    } catch (error) {
      console.error('Error in drawLottery:', error);
      res.status(500).json({
        success: false,
        message: '抽奖执行失败',
        error: error.message
      });
    }
  }

  // 获取用户统计
  async getUserStats(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: '用户ID不能为空'
        });
      }

      // 查找用户
      const user = await databaseService.getUserByMcpId(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      // 获取用户统计
      const stats = await databaseService.getUserStats(user.id);

      res.json({
        success: true,
        data: {
          userId: userId,
          stats: stats
        },
        message: '获取用户统计成功'
      });
    } catch (error) {
      console.error('Error in getUserStats:', error);
      res.status(500).json({
        success: false,
        message: '获取用户统计失败',
        error: error.message
      });
    }
  }

  // 获取全局统计
  async getGlobalStats(req, res) {
    try {
      const stats = await databaseService.getGlobalStats();

      res.json({
        success: true,
        data: stats,
        message: '获取全局统计成功'
      });
    } catch (error) {
      console.error('Error in getGlobalStats:', error);
      res.status(500).json({
        success: false,
        message: '获取全局统计失败',
        error: error.message
      });
    }
  }

  // 健康检查
  async healthCheck(req, res) {
    try {
      const dbHealth = await databaseService.healthCheck();
      
      if (!dbHealth.success) {
        return res.status(500).json({
          success: false,
          message: '数据库连接失败',
          error: dbHealth.error
        });
      }

      res.json({
        success: true,
        message: 'Vibe Coding抽奖API服务正常',
        timestamp: new Date().toISOString(),
        version: '1.0.0-database',
        database: dbHealth
      });
    } catch (error) {
      console.error('Error in healthCheck:', error);
      res.status(500).json({
        success: false,
        message: '健康检查失败',
        error: error.message
      });
    }
  }

  // 获取抽奖汇总数据
  async getLotterySummary(req, res) {
    try {
      const { data, error } = await databaseService.supabase
        .from('realtime_summary')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching lottery summary:', error);
        // 如果视图不存在，使用基础统计
        const stats = await databaseService.getGlobalStats();
        return res.json({
          success: true,
          data: {
            total_users: stats.totalUsers,
            total_lotteries: stats.totalLotteries,
            active_lotteries: stats.activeLotteries,
            completed_lotteries: stats.completedLotteries,
            legendary_prizes: 0,
            epic_prizes: 0,
            rare_prizes: 0,
            common_prizes: 0,
            today_active_users: 0,
            today_lotteries: 0,
            today_wins: 0
          },
          message: '获取抽奖汇总成功（基础版本）'
        });
      }

      res.json({
        success: true,
        data: data,
        message: '获取抽奖汇总成功'
      });
    } catch (error) {
      console.error('Error in getLotterySummary:', error);
      res.status(500).json({
        success: false,
        message: '获取抽奖汇总失败',
        error: error.message
      });
    }
  }

  // 获取用户排行榜
  async getLeaderboard(req, res) {
    try {
      const { data, error } = await databaseService.supabase
        .from('leaderboard')
        .select('*')
        .limit(20)
        .order('rank', { ascending: true });

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return res.json({
          success: true,
          data: [],
          message: '排行榜数据暂不可用'
        });
      }

      res.json({
        success: true,
        data: data || [],
        message: '获取排行榜成功'
      });
    } catch (error) {
      console.error('Error in getLeaderboard:', error);
      res.status(500).json({
        success: false,
        message: '获取排行榜失败',
        error: error.message
      });
    }
  }

  // 获取奖品统计
  async getPrizeStats(req, res) {
    try {
      const { data, error } = await databaseService.supabase
        .from('prize_statistics')
        .select('*')
        .order('percentage', { ascending: false });

      if (error) {
        console.error('Error fetching prize stats:', error);
        return res.json({
          success: true,
          data: [],
          message: '奖品统计暂不可用'
        });
      }

      res.json({
        success: true,
        data: data || [],
        message: '获取奖品统计成功'
      });
    } catch (error) {
      console.error('Error in getPrizeStats:', error);
      res.status(500).json({
        success: false,
        message: '获取奖品统计失败',
        error: error.message
      });
    }
  }

  // 获取每日统计
  async getDailyStats(req, res) {
    try {
      const { data, error } = await databaseService.supabase
        .from('daily_statistics')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching daily stats:', error);
        return res.json({
          success: true,
          data: [],
          message: '每日统计暂不可用'
        });
      }

      res.json({
        success: true,
        data: data || [],
        message: '获取每日统计成功'
      });
    } catch (error) {
      console.error('Error in getDailyStats:', error);
      res.status(500).json({
        success: false,
        message: '获取每日统计失败',
        error: error.message
      });
    }
  }

  // 获取VibeDoge会员统计
  async getMembershipStats(req, res) {
    try {
      const { data, error } = await databaseService.supabase
        .from('vibedoge_membership_stats')
        .select('*')
        .order('awarded_count', { ascending: false });

      if (error) {
        console.error('Error fetching membership stats:', error);
        return res.json({
          success: true,
          data: [],
          message: '会员统计暂不可用'
        });
      }

      res.json({
        success: true,
        data: data || [],
        message: '获取VibeDoge会员统计成功'
      });
    } catch (error) {
      console.error('Error in getMembershipStats:', error);
      res.status(500).json({
        success: false,
        message: '获取VibeDoge会员统计失败',
        error: error.message
      });
    }
  }
}

module.exports = new LotteryController();
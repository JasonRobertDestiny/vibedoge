import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  Trophy, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Zap,
  Database,
  BarChart3,
  Dog,
  Shield,
  Play
} from 'lucide-react';
import { useLotteryStore, useUserStore } from '../store';
import { Link } from 'react-router-dom';
import Carousel from '../components/ui/Carousel';

// VibeDoge奖品列表 - 按稀有度分组
const PRIZE_CATEGORIES = {
  common: {
    title: '普通奖品',
    description: '45% 概率获得',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-400',
    icon: '🐕',
    prizes: [
      {
        name: 'VibeDoge 1个月会员',
        description: '体验VibeDoge基础功能',
        value: '1个月',
        icon: '🐕',
        benefits: ['基础功能', '社区访问', '学习资源']
      },
      {
        name: 'VibeDoge 学习资料包',
        description: '精选编程学习资源合集',
        value: '学习资料',
        icon: '📚',
        benefits: ['视频教程', '代码示例', '实战项目']
      },
      {
        name: '代码模板库访问',
        description: '高级代码模板库使用权',
        value: '1个月',
        icon: '📝',
        benefits: ['模板下载', '自定义修改', '社区分享']
      },
      {
        name: '开发者工具包',
        description: '开发者必备工具集合',
        value: '基础版',
        icon: '🛠️',
        benefits: ['开发工具', '调试插件', '效率提升']
      }
    ]
  },
  rare: {
    title: '稀有奖品',
    description: '30% 概率获得',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-400',
    icon: '🌟',
    prizes: [
      {
        name: 'VibeDoge 6个月会员',
        description: '解锁高级功能和优先支持',
        value: '6个月',
        icon: '🌟',
        benefits: ['高级功能', '优先支持', '专属内容', 'VIP社群']
      },
      {
        name: '代码审查券',
        description: '专业工程师代码审查服务',
        value: '1次',
        icon: '🔍',
        benefits: ['深度分析', '优化建议', '最佳实践']
      },
      {
        name: '技术咨询服务',
        description: '一对一技术咨询指导',
        value: '30分钟',
        icon: '💡',
        benefits: ['问题诊断', '方案设计', '实施指导']
      },
      {
        name: '开源项目贡献指导',
        description: '专业开源项目贡献指导',
        value: '1个项目',
        icon: '🌐',
        benefits: ['贡献指导', '社区建设', '技术提升']
      }
    ]
  },
  epic: {
    title: '史诗奖品',
    description: '20% 概率获得',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'from-yellow-50 to-orange-50',
    borderColor: 'border-yellow-400',
    icon: '👑',
    prizes: [
      {
        name: 'VibeDoge 年度会员',
        description: '全年VIP专享特权',
        value: '12个月',
        icon: '👑',
        benefits: ['所有功能', 'VIP支持', '线下活动', '专属顾问']
      },
      {
        name: '项目架构设计',
        description: '专业项目架构设计服务',
        value: '1个项目',
        icon: '🏗️',
        benefits: ['架构设计', '技术选型', '性能优化', '安全方案']
      },
      {
        name: '技术导师计划',
        description: '一对一技术导师指导',
        value: '3个月',
        icon: '🎓',
        benefits: ['定期指导', '职业规划', '技能提升', '项目实战']
      },
      {
        name: '技术演讲培训',
        description: '专业演讲技能培训',
        value: '1次',
        icon: '🎤',
        benefits: ['演讲技巧', '表达训练', '自信提升']
      }
    ]
  },
  legendary: {
    title: '传说奖品',
    description: '5% 概率获得',
    color: 'from-pink-500 to-violet-500',
    bgColor: 'from-pink-50 to-violet-50',
    borderColor: 'border-pink-400',
    icon: '💎',
    prizes: [
      {
        name: 'VibeDoge 终身会员',
        description: '永久尊享所有功能',
        value: '终身',
        icon: '💎',
        benefits: ['终身权限', '专属顾问', '股权奖励', '优先体验新功能']
      },
      {
        name: 'AI训练模型访问',
        description: '高级AI模型无限使用权',
        value: 'unlimited',
        icon: '🤖',
        benefits: ['无限使用', '模型定制', 'API访问', '技术支持']
      },
      {
        name: '创业技术顾问',
        description: '专属创业技术顾问服务',
        value: '6个月',
        icon: '🚀',
        benefits: ['技术战略', '团队建设', '融资指导', '资源对接']
      },
      {
        name: '技术合伙人机会',
        description: '优质项目技术合伙人面试机会',
        value: '面试机会',
        icon: '🤝',
        benefits: ['项目合作', '股权机会', '人脉拓展', '职业发展']
      }
    ]
  }
};

// 奖品轮播组件
const PrizeCarousel: React.FC<{ category: keyof typeof PRIZE_CATEGORIES }> = ({ category }) => {
  const categoryData = PRIZE_CATEGORIES[category];
  
  return (
    <div className={`p-6 rounded-xl border-2 ${categoryData.borderColor} bg-gradient-to-br ${categoryData.bgColor}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{categoryData.icon}</div>
          <div>
            <h4 className="text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${categoryData.color.split(' ')[0].replace('from-', '#')}, ${categoryData.color.split(' ')[1].replace('to-', '#')})` }}>
              {categoryData.title}
            </h4>
            <p className="text-sm text-gray-600">{categoryData.description}</p>
          </div>
        </div>
        <div className="text-xs font-medium px-3 py-1 rounded-full bg-white/60">
          {categoryData.prizes.length} 个奖品
        </div>
      </div>
      
      <Carousel 
        autoPlay={false}
        showDots={true}
        showArrows={true}
        className="h-64"
      >
        {categoryData.prizes.map((prize, index) => (
          <div key={index} className="h-full flex flex-col justify-between">
            <div className="flex items-start space-x-4">
              <div className="text-5xl">{prize.icon}</div>
              <div className="flex-1">
                <h5 className="text-lg font-semibold text-gray-900 mb-2">{prize.name}</h5>
                <p className="text-sm text-gray-600 mb-3">{prize.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {prize.benefits.map((benefit, idx) => (
                    <span key={idx} className="text-xs bg-white/80 px-3 py-1 rounded-full text-gray-700 font-medium">
                      {benefit}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900 bg-white/60 px-3 py-1 rounded-lg">
                    {prize.value}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

const LotteryDetailPage: React.FC = () => {
  const { 
    userLotteries, 
    globalStats,
    drawLottery,
    generateLotteryId,
    loadUserLotteries: getUserLotteries,
    loadGlobalStats: getGlobalStats
  } = useLotteryStore();

  const { mcpUser, initializeMCPUser, registerUser, remainingDraws, useDraw } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [drawResult, setDrawResult] = useState<any>(null);
  const [isGeneratingLottery, setIsGeneratingLottery] = useState(false);

  // MCP用户状态
  const isMcpUser = !!mcpUser;

  useEffect(() => {
    // 初始化MCP用户
    if (!isMcpUser) {
      initializeMCPUser();
    }
  }, []);

  useEffect(() => {
    if (isMcpUser) {
      loadUserData();
    }
  }, [isMcpUser]);

  const loadUserData = async () => {
    if (!mcpUser?.id) return;
    
    try {
      await Promise.all([
        getUserLotteries(mcpUser.id),
        getGlobalStats()
      ]);
      
      // 获取最新的抽奖记录
      await fetch(`/api/lottery/user-lotteries/${mcpUser.id}`).then(res => res.json());
    } catch (error) {
      console.error('加载用户数据失败:', error);
    }
  };

  const handleRegisterMCPUser = async () => {
    setLoading(true);
    try {
      const result = await registerUser();
      if (result.success) {
        await loadUserData();
      } else {
        alert(result.error || '注册失败');
      }
    } catch (error) {
      console.error('注册失败:', error);
      alert('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };


  const handleDrawLottery = async () => {
    if (!mcpUser?.isRegistered) {
      alert('请先注册以获得抽奖机会');
      return;
    }

    if (remainingDraws <= 0) {
      alert('您已经用完了所有抽奖机会');
      return;
    }

    setLoading(true);
    setIsGeneratingLottery(true);
    try {
      // 生成抽奖ID
      const lotteryResult = await generateLotteryId(mcpUser.id);
      if (!lotteryResult.success || !lotteryResult.lotteryId) {
        alert(lotteryResult.error || '生成抽奖ID失败');
        return;
      }

      // 使用一次抽奖机会
      const success = useDraw();
      if (!success) {
        alert('使用抽奖机会失败');
        return;
      }

      // 执行抽奖
      const result = await drawLottery(lotteryResult.lotteryId, mcpUser.id);
      if (result.success && result.prize) {
        setDrawResult({
          prize: result.prize,
          drawTime: new Date().toISOString()
        });
        setShowResult(true);
        await loadUserData();
        
        // 5秒后自动关闭结果
        setTimeout(() => {
          setShowResult(false);
          setDrawResult(null);
        }, 5000);
      } else {
        alert(result.error || '抽奖失败');
      }
    } catch (error) {
      console.error('抽奖失败:', error);
      alert('抽奖失败，请稍后重试');
    } finally {
      setLoading(false);
      setIsGeneratingLottery(false);
    }
  };

  
  const completedLotteries = userLotteries.filter(lottery => lottery.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                返回首页
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <Dog className="h-8 w-8 text-amber-600" />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                    VibeDoge MCP抽奖
                  </h1>
                  <p className="text-sm text-gray-600">Model Context Protocol专享</p>
                </div>
              </div>
            </div>
            
            {isMcpUser && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">MCP用户</span>
                <span className="text-xs text-green-600">{mcpUser.id.slice(-8)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* MCP特色介绍 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 mb-8 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <Zap className="h-8 w-8 mr-3" />
                MCP专享免费抽奖
              </h2>
              <p className="text-lg text-amber-100 mb-4">
                作为Model Context Protocol用户，您专享免费参与VibeDoge生态抽奖的特权
              </p>
              <div className="flex items-center space-x-6 text-amber-100">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">完全免费</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">即时开奖</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">真实有效</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="text-6xl">🎁</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：用户信息和操作 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 用户状态 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-600" />
                用户状态
              </h3>
              
              {!isMcpUser ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">您还不是MCP用户</p>
                  <button 
                    onClick={handleRegisterMCPUser}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? '注册中...' : '注册MCP用户'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800">注册状态</span>
                    <span className={`text-green-600 font-medium ${mcpUser.isRegistered ? '' : 'text-yellow-600'}`}>
                      {mcpUser.isRegistered ? '已注册' : '未注册'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-800">剩余抽奖次数</span>
                    <span className="text-blue-600 font-bold text-lg">{remainingDraws}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-purple-800">总抽奖次数</span>
                    <span className="text-purple-600 font-bold">{userLotteries.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <span className="text-amber-800">获奖次数</span>
                    <span className="text-amber-600 font-bold">{completedLotteries.length}</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* 抽奖操作 */}
            {isMcpUser && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Play className="h-5 w-5 mr-2 text-green-600" />
                  抽奖操作
                </h3>
                
                <div className="space-y-4">
                  {!mcpUser.isRegistered ? (
                    <button
                      onClick={handleRegisterMCPUser}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Gift className="h-5 w-5" />
                          <span>注册获得3次抽奖机会</span>
                        </>
                      )}
                    </button>
                  ) : remainingDraws > 0 ? (
                    <>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-sm text-green-800 mb-1">剩余抽奖机会</div>
                        <div className="text-2xl font-bold text-green-600">{remainingDraws}</div>
                        <div className="text-xs text-green-600 mt-1">每次抽奖消耗1次机会</div>
                      </div>
                      
                      <button
                        onClick={handleDrawLottery}
                        disabled={loading || isGeneratingLottery}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {loading || isGeneratingLottery ? (
                          <RefreshCw className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <Zap className="h-5 w-5" />
                            <span>立即抽奖</span>
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">您的抽奖机会已用完</p>
                      <div className="text-sm text-gray-500">
                        总共抽奖 {userLotteries.length} 次，获奖 {completedLotteries.length} 次
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* 中间：奖品展示 */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 h-full"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
                VibeDoge会员奖品
              </h3>
              
              <div className="space-y-6">
                <PrizeCarousel category="common" />
                <PrizeCarousel category="rare" />
                <PrizeCarousel category="epic" />
                <PrizeCarousel category="legendary" />
              </div>
            </motion.div>
          </div>

          {/* 右侧：统计数据和抽奖记录 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 全局统计 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                抽奖汇总
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{globalStats?.totalUsers || 0}</div>
                  <div className="text-sm text-blue-800">参与用户</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{globalStats?.totalLotteries || 0}</div>
                  <div className="text-sm text-green-800">总抽奖次数</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{globalStats?.activeLotteries || 0}</div>
                  <div className="text-sm text-yellow-800">待抽奖</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{globalStats?.completedLotteries || 0}</div>
                  <div className="text-sm text-purple-800">已完成抽奖</div>
                </div>
              </div>
            </motion.div>

            {/* 我的抽奖记录 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2 text-indigo-600" />
                我的抽奖记录
              </h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {userLotteries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Gift className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>暂无抽奖记录</p>
                    <p className="text-sm">生成抽奖ID后记录会显示在这里</p>
                  </div>
                ) : (
                  userLotteries.map((record, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono text-gray-600">{record.lotteryId.slice(-12)}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          record.status === 'active' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {record.status === 'active' ? '待抽奖' : '已完成'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(record.createdAt).toLocaleString()}
                      </div>
                      {record.prizeName && (
                        <div className="mt-2 text-sm text-green-600 font-medium">
                          🎁 {record.prizeName}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 抽奖结果弹窗 */}
      <AnimatePresence>
        {showResult && drawResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowResult(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">{drawResult.prize.icon}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 恭喜中奖！</h2>
              <div className={`text-lg font-semibold mb-2 bg-gradient-to-r ${drawResult.prize.color} bg-clip-text text-transparent`}>
                {drawResult.prize.name}
              </div>
              <p className="text-gray-600 mb-4">{drawResult.prize.description}</p>
              <div className="text-sm text-gray-500 mb-6">
                抽奖时间: {new Date(drawResult.drawTime).toLocaleString()}
              </div>
              <button
                onClick={() => setShowResult(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              >
                确定
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LotteryDetailPage;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  Trophy, 
  Ticket, 
  Users, 
  Clock, 
  Sparkles, 
  User as UserIcon, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Target,
  Award,
  Timer,
  Zap
} from 'lucide-react';
import { useLotteryStore } from '../store';
import { mockLotteryActivities, getRandomLotteryResult } from '../utils/mockData';
import { LotteryPrize } from '../types';
import UserProfileForm from '../components/UserProfileForm';
import { Link } from 'react-router-dom';

interface UserProfile {
  nickname: string;
  techLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  programmingLanguages: string[];
  experience: string;
  interests: string[];
  goals: string[];
}

interface LotteryRecord {
  lotteryId: string;
  userId: string;
  createdAt: string;
  status: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}

const LotteryDetailPage: React.FC = () => {
  const { currentActivity, isDrawing, setActivities, setCurrentActivity, setIsDrawing } = useLotteryStore();
  
  // 原LotteryPage状态
  const [selectedTickets, setSelectedTickets] = useState(1);
  const [drawResult, setDrawResult] = useState<LotteryPrize | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userTickets, setUserTickets] = useState(0);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  
  // 原DemoLotteryPage状态
  const [userId, setUserId] = useState<string>('');
  const [lotteryRecords, setLotteryRecords] = useState<LotteryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // 页面模式切换
  const [viewMode, setViewMode] = useState<'participate' | 'api-demo'>('participate');

  useEffect(() => {
    setActivities(mockLotteryActivities);
    setCurrentActivity(mockLotteryActivities[0]);
    
    // 检查用户是否已经提交过资料
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    
    // 从本地存储加载用户ID
    const savedUserId = localStorage.getItem('demo_user_id');
    if (savedUserId) {
      setUserId(savedUserId);
      loadUserLotteries(savedUserId);
    }
  }, [setActivities, setCurrentActivity]);

  // 显示消息
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // 生成用户ID
  const generateUserId = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/lottery/generate-user-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: ApiResponse<{ userId: string; createdAt: string }> = await response.json();
      
      if (result.success) {
        setUserId(result.data.userId);
        localStorage.setItem('demo_user_id', result.data.userId);
        showMessage('success', '用户ID生成成功！');
        setLotteryRecords([]); // 清空之前的记录
      } else {
        showMessage('error', result.message || '生成用户ID失败');
      }
    } catch (error) {
      showMessage('error', '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 生成抽奖ID
  const generateLotteryId = async () => {
    if (!userId) {
      showMessage('error', '请先生成用户ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/lottery/generate-lottery-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const result: ApiResponse<{ lotteryId: string; userId: string; createdAt: string }> = await response.json();
      
      if (result.success) {
        showMessage('success', '抽奖ID生成成功！');
        // 重新加载用户抽奖记录
        await loadUserLotteries(userId);
      } else {
        showMessage('error', result.message || '生成抽奖ID失败');
      }
    } catch (error) {
      showMessage('error', '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 加载用户抽奖记录
  const loadUserLotteries = async (userIdToLoad: string) => {
    try {
      const response = await fetch(`/api/lottery/user-lotteries/${userIdToLoad}`);
      const result: ApiResponse<{ userId: string; lotteries: LotteryRecord[]; total: number }> = await response.json();
      
      if (result.success) {
        setLotteryRecords(result.data.lotteries);
      }
    } catch (error) {
      console.error('加载抽奖记录失败:', error);
    }
  };

  // 刷新记录
  const refreshRecords = () => {
    if (userId) {
      loadUserLotteries(userId);
      showMessage('success', '记录已刷新');
    }
  };

  // 格式化时间
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const handleBuyTickets = () => {
    if (!userProfile) {
      setShowProfileForm(true);
      return;
    }
    
    if (currentActivity) {
      setUserTickets(prev => prev + selectedTickets);
      alert(`成功购买 ${selectedTickets} 张抽奖券！`);
    }
  };
  
  const handleProfileSubmit = async (profileData: any) => {
    setIsSubmittingProfile(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 保存用户资料
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      setUserProfile(profileData);
      setShowProfileForm(false);
      
      // 自动购买抽奖券
      if (currentActivity) {
        setUserTickets(prev => prev + selectedTickets);
        alert(`成功购买 ${selectedTickets} 张抽奖券！`);
      }
    } catch (error) {
      console.error('提交用户资料失败:', error);
    } finally {
      setIsSubmittingProfile(false);
    }
  };
  
  const handleProfileCancel = () => {
    setShowProfileForm(false);
  };

  const handleDraw = async () => {
    if (!userProfile) {
      setShowProfileForm(true);
      return;
    }
    
    if (!currentActivity || userTickets === 0) return;
    
    setIsDrawing(true);
    setShowResult(false);
    
    // 模拟抽奖过程
    setTimeout(() => {
      const result = getRandomLotteryResult(currentActivity.prizes);
      setDrawResult(result);
      setUserTickets(prev => Math.max(0, prev - 1));
      setIsDrawing(false);
      setShowResult(true);
    }, 3000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-500 bg-yellow-50';
      case 'epic': return 'text-purple-500 bg-purple-50';
      case 'rare': return 'text-blue-500 bg-blue-50';
      case 'common': return 'text-gray-500 bg-gray-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '👑';
      case 'epic': return '💎';
      case 'rare': return '⭐';
      case 'common': return '🎁';
      default: return '🎁';
    }
  };

  if (!currentActivity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">暂无活动</h2>
          <p className="text-gray-600">请稍后再来查看最新的抽奖活动</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 页面头部 */}
      <section className="bg-white/20 backdrop-blur-md text-slate-800 py-12 relative overflow-hidden border-b border-white/20">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-pink-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-400 rounded-full animate-ping"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* 返回按钮 */}
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回首页
            </Link>
          </div>
          
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center mb-6"
            >
              <Sparkles className="h-10 w-10 mr-4 text-yellow-500 animate-spin" />
              <h1 className="text-5xl font-bold text-slate-800">
                Vibe Coding 抽奖详情
              </h1>
              <Sparkles className="h-10 w-10 ml-4 text-yellow-500 animate-spin" />
            </motion.div>
            <p className="text-xl text-slate-600 mb-8">{currentActivity.description}</p>
            
            {/* 模式切换按钮 */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setViewMode('participate')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  viewMode === 'participate'
                    ? 'bg-white/85 backdrop-blur-md text-slate-800 shadow-lg border border-white/90'
                    : 'bg-white/60 backdrop-blur-sm text-slate-700 hover:bg-white/75 border border-white/70'
                }`}
              >
                <Target className="h-5 w-5" />
                <span>参与抽奖</span>
              </button>
              <button
                onClick={() => setViewMode('api-demo')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  viewMode === 'api-demo'
                    ? 'bg-white/85 backdrop-blur-md text-slate-800 shadow-lg border border-white/90'
                    : 'bg-white/60 backdrop-blur-sm text-slate-700 hover:bg-white/75 border border-white/70'
                }`}
              >
                <Zap className="h-5 w-5" />
                <span>API演示</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 消息提示 */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className={`px-6 py-4 rounded-lg flex items-center gap-3 shadow-lg ${
              message.type === 'success' 
                ? 'bg-green-500/20 backdrop-blur-md border border-green-400/30 text-green-700'
                : 'bg-red-500/20 backdrop-blur-md border border-red-400/30 text-red-700'
            }`}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {message.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {viewMode === 'participate' ? (
          // 参与抽奖模式
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：活动信息 */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Trophy className="h-6 w-6 mr-2 text-yellow-400" />
                  活动详情
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">抽奖券价格</span>
                    <span className="font-semibold text-white">${currentActivity.ticketPrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">总券数</span>
                    <span className="font-semibold text-white">{currentActivity.maxTickets}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">已售出</span>
                    <span className="font-semibold text-blue-400">{currentActivity.soldTickets}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(currentActivity.soldTickets / currentActivity.maxTickets) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>

              {/* 用户信息 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/75 backdrop-blur-md rounded-xl p-6 border border-white/90 shadow-xl"
              >
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                  <Users className="h-6 w-6 mr-2 text-blue-500" />
                  我的信息
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/75 backdrop-blur-sm rounded-lg border border-white/90">
                    <span className="text-slate-600">我的抽奖券</span>
                    <span className="text-2xl font-bold text-yellow-600">{userTickets}</span>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/75 backdrop-blur-sm rounded-lg border border-white/90">
                    <span className="text-slate-600">购买数量</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedTickets(Math.max(1, selectedTickets - 1))}
                        className="w-8 h-8 rounded-full bg-blue-600/90 backdrop-blur-sm hover:bg-blue-700/95 text-white flex items-center justify-center transition-colors border border-blue-700/90 shadow-lg"
                      >
                        -
                      </button>
                      <span className="text-xl font-bold text-slate-800 w-12 text-center">{selectedTickets}</span>
                      <button
                        onClick={() => setSelectedTickets(selectedTickets + 1)}
                        className="w-8 h-8 rounded-full bg-blue-600/90 backdrop-blur-sm hover:bg-blue-700/95 text-white flex items-center justify-center transition-colors border border-blue-700/90 shadow-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleBuyTickets}
                    className="w-full bg-blue-600/90 backdrop-blur-md hover:bg-blue-700/95 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-blue-700/90 shadow-lg"
                  >
                    <Ticket className="h-5 w-5" />
                    <span>购买抽奖券</span>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* 中间：奖品展示 */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/75 backdrop-blur-md rounded-xl p-6 border border-white/90 h-full"
              >
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                  <Award className="h-6 w-6 mr-2 text-yellow-500" />
                  奖品列表
                </h3>
                <div className="space-y-4">
                  {currentActivity.prizes.map((prize, index) => (
                    <motion.div
                      key={prize.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 ${getRarityColor(prize.rarity)} bg-white/75 backdrop-blur-sm`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getRarityIcon(prize.rarity)}</span>
                          <div>
                            <h4 className="font-semibold text-slate-800">{prize.name}</h4>
                            <p className="text-sm text-slate-600">{prize.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-800">{prize.value}</p>
                          <p className="text-xs text-slate-500">概率: {prize.rarity === 'common' ? '50' : prize.rarity === 'rare' ? '30' : prize.rarity === 'epic' ? '15' : '5'}%</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* 右侧：抽奖操作 */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/75 backdrop-blur-md rounded-xl p-6 border border-white/90 text-center shadow-xl"
              >
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center justify-center">
                  <Timer className="h-6 w-6 mr-2 text-pink-500" />
                  开始抽奖
                </h3>
                
                {isDrawing ? (
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 rounded-full animate-spin flex items-center justify-center">
                        <div className="w-28 h-28 bg-white/75 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Sparkles className="h-12 w-12 text-white animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-800 font-semibold">抽奖进行中...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <button
                      onClick={handleDraw}
                      disabled={userTickets === 0 || !userProfile}
                      className="w-full bg-yellow-500/90 backdrop-blur-md hover:bg-yellow-600/95 disabled:bg-gray-600/90 text-white disabled:text-gray-300 font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2 border border-yellow-600/90 disabled:border-gray-500/90 shadow-lg"
                    >
                      <Gift className="h-6 w-6" />
                      <span>立即抽奖</span>
                    </button>
                    
                    {userTickets === 0 && (
                      <p className="text-yellow-600 text-sm">请先购买抽奖券</p>
                    )}
                    
                    {!userProfile && (
                      <p className="text-yellow-600 text-sm">请先完善个人资料</p>
                    )}
                  </div>
                )}
                
                {/* 抽奖结果 */}
                <AnimatePresence>
                  {showResult && drawResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="mt-6 p-6 bg-gradient-to-r from-yellow-400/75 to-pink-400/75 rounded-lg border border-yellow-400/90"
                    >
                      <h4 className="text-lg font-bold text-slate-800 mb-2">🎉 恭喜中奖！</h4>
                      <p className="text-yellow-600 font-semibold">{drawResult.name}</p>
                      <p className="text-slate-700 text-sm mt-1">{drawResult.description}</p>
                      <p className="text-yellow-600 font-bold mt-2">{drawResult.value}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        ) : (
          // API演示模式
          <div className="space-y-8">
            {/* 用户信息卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/75 backdrop-blur-md rounded-xl p-6 border border-white/90"
            >
              <div className="flex items-center gap-3 mb-4">
                <UserIcon className="text-blue-400" size={24} />
                <h2 className="text-xl font-semibold text-white">用户信息</h2>
              </div>
              
              {userId ? (
                <div className="space-y-3">
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-gray-300 text-sm mb-1">用户ID:</p>
                    <p className="text-white font-mono text-sm break-all">{userId}</p>
                  </div>
                  <button
                    onClick={generateUserId}
                    disabled={loading}
                    className="bg-blue-600/90 hover:bg-blue-700/95 disabled:bg-gray-600/90 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-blue-700/90 disabled:border-gray-500/90 shadow-lg"
                  >
                    <RefreshCw className={`${loading ? 'animate-spin' : ''}`} size={16} />
                    重新生成用户ID
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-300 mb-4">还没有用户ID</p>
                  <button
                    onClick={generateUserId}
                    disabled={loading}
                    className="bg-blue-600/90 hover:bg-blue-700/95 disabled:bg-gray-600/90 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto border border-blue-700/90 disabled:border-gray-500/90 shadow-lg"
                  >
                    <UserIcon size={16} />
                    {loading ? '生成中...' : '生成用户ID'}
                  </button>
                </div>
              )}
            </motion.div>

            {/* 抽奖操作卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/75 backdrop-blur-md rounded-xl p-6 border border-white/90"
            >
              <div className="flex items-center gap-3 mb-4">
                <Gift className="text-green-400" size={24} />
                <h2 className="text-xl font-semibold text-white">抽奖操作</h2>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={generateLotteryId}
                  disabled={loading || !userId}
                  className="w-full bg-green-600/90 hover:bg-green-700/95 disabled:bg-gray-600/90 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 border border-green-700/90 disabled:border-gray-500/90 shadow-lg"
                >
                  <Gift size={16} />
                  {loading ? '生成中...' : '生成抽奖ID'}
                </button>
                
                {!userId && (
                  <p className="text-yellow-300 text-sm text-center">请先生成用户ID</p>
                )}
              </div>
            </motion.div>

            {/* 抽奖记录卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/75 backdrop-blur-md rounded-xl p-6 border border-white/90"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="text-purple-400" size={24} />
                  <h2 className="text-xl font-semibold text-white">抽奖记录</h2>
                </div>
                <button
                  onClick={refreshRecords}
                  disabled={!userId}
                  className="bg-purple-600/90 hover:bg-purple-700/95 disabled:bg-gray-600/90 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-purple-700/90 disabled:border-gray-500/90 shadow-lg"
                >
                  <RefreshCw size={16} />
                  刷新
                </button>
              </div>
              
              {lotteryRecords.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {lotteryRecords.map((record, index) => (
                    <div key={index} className="bg-black/20 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-mono text-sm">{record.lotteryId}</p>
                          <p className="text-gray-300 text-xs mt-1">{formatTime(record.createdAt)}</p>
                        </div>
                        <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                          {record.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-300">暂无抽奖记录</p>
                  <p className="text-gray-400 text-sm mt-1">生成抽奖ID后记录会显示在这里</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* 用户资料表单弹窗 */}
      <AnimatePresence>
        {showProfileForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/75 backdrop-blur-md rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/90 shadow-xl"
            >
              <UserProfileForm
                onSubmit={handleProfileSubmit}
                onCancel={handleProfileCancel}
                isSubmitting={isSubmittingProfile}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LotteryDetailPage;
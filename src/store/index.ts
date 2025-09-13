import { create } from 'zustand';
import { User, Product, LotteryActivity, MarketOverview } from '../types';
import { mcpService, MCPUser, getMCPUserId, restoreMCPUser } from '../services/mcpService';

// 数据库用户信息
interface DatabaseUser {
  id: string;
  mcp_user_id: string;
  username: string;
  email: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

// 用户状态
interface UserState {
  user: User | null;
  databaseUser: DatabaseUser | null;
  mcpUser: MCPUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isRegistered: boolean; // 是否已在数据库中注册
  remainingDraws: number; // 剩余抽奖次数
  initializeMCPUser: () => Promise<void>;
  registerUser: () => Promise<{ success: boolean; error?: string }>;
  login: (user: User) => void;
  logout: () => void;
  updateUserActivity: () => void;
  useDraw: () => boolean; // 使用一次抽奖机会
  getRemainingDraws: () => number; // 获取剩余抽奖次数
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  databaseUser: null,
  mcpUser: null,
  isAuthenticated: false,
  isInitialized: false,
  isRegistered: false,
  remainingDraws: 0,
  
  // 初始化MCP用户
  initializeMCPUser: async () => {
    try {
      // 首先尝试恢复现有用户
      let mcpUser = restoreMCPUser();
      
      if (!mcpUser) {
        // 如果没有现有用户，生成新的
        mcpUser = await getMCPUserId();
      }
      
      // 创建对应的User对象
      const user: User = {
        id: mcpUser.id,
        username: `User_${mcpUser.id.split('_').pop()}`,
        email: `${mcpUser.id}@mcp.local`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mcpUser.id}`,
        createdAt: mcpUser.createdAt,
        updatedAt: mcpUser.lastActiveAt
      };
      
      set({ 
        mcpUser, 
        user, 
        isAuthenticated: true, 
        isInitialized: true,
        isRegistered: mcpUser.isRegistered,
        remainingDraws: mcpUser.remainingDraws
      });
      
      console.log('MCP User initialized:', mcpUser.id);
    } catch (error) {
      console.error('Failed to initialize MCP user:', error);
      set({ isInitialized: true });
    }
  },
  
  // 注册用户到数据库
  registerUser: async () => {
    try {
      const { mcpUser } = get();
      if (!mcpUser) {
        return { success: false, error: 'MCP用户未初始化' };
      }
      
      const response = await fetch('/api/lottery/generate-user-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        const databaseUser: DatabaseUser = {
          id: result.data.databaseUserId,
          mcp_user_id: result.data.userId,
          username: result.data.username,
          email: `${result.data.userId}@mcp.local`,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.data.userId}`,
          created_at: result.data.createdAt,
          updated_at: result.data.createdAt
        };
        
        // 注册成功，发放抽奖次数
        mcpService.registerSuccess(3); // 给予3次抽奖机会
        
        set({ 
          databaseUser, 
          isRegistered: true,
          remainingDraws: 3,
          user: {
            ...get().user!,
            id: result.data.userId,
            username: result.data.username,
            avatar: databaseUser.avatar_url
          }
        });
        
        return { success: true };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, error: '网络错误，请稍后重试' };
    }
  },
  
  login: (user) => set({ user, isAuthenticated: true }),
  
  logout: () => {
    mcpService.clearSession();
    set({ 
      user: null, 
      databaseUser: null, 
      mcpUser: null, 
      isAuthenticated: false,
      isRegistered: false 
    });
  },
  
  // 更新用户活跃状态
  updateUserActivity: () => {
    const { mcpUser } = get();
    if (mcpUser) {
      mcpService.heartbeat();
    }
  },

  // 使用一次抽奖机会
  useDraw: () => {
    const success = mcpService.useDraw();
    if (success) {
      const remainingDraws = mcpService.getRemainingDraws();
      set({ remainingDraws });
    }
    return success;
  },

  // 获取剩余抽奖次数
  getRemainingDraws: () => {
    return mcpService.getRemainingDraws();
  }
}));

// 市场数据状态
interface MarketState {
  products: Product[];
  marketOverview: MarketOverview | null;
  selectedProduct: Product | null;
  setProducts: (products: Product[]) => void;
  setMarketOverview: (overview: MarketOverview) => void;
  setSelectedProduct: (product: Product | null) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  products: [],
  marketOverview: null,
  selectedProduct: null,
  setProducts: (products) => set({ products }),
  setMarketOverview: (marketOverview) => set({ marketOverview }),
  setSelectedProduct: (selectedProduct) => set({ selectedProduct }),
}));

// 数据库抽奖记录类型
interface DatabaseLotteryRecord {
  lotteryId: string;
  userId: string;
  createdAt: string;
  status: string;
  prizeName?: string;
  prizeValue?: string;
}

// 抽奖状态
interface LotteryState {
  activities: LotteryActivity[];
  currentActivity: LotteryActivity | null;
  isDrawing: boolean;
  userLotteries: DatabaseLotteryRecord[];
  lotteryStats: {
    total: number;
    active: number;
    completed: number;
  } | null;
  globalStats: {
    totalUsers: number;
    totalLotteries: number;
    activeLotteries: number;
    completedLotteries: number;
  } | null;
  setActivities: (activities: LotteryActivity[]) => void;
  setCurrentActivity: (activity: LotteryActivity | null) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setUserLotteries: (lotteries: DatabaseLotteryRecord[]) => void;
  setLotteryStats: (stats: LotteryState['lotteryStats']) => void;
  setGlobalStats: (stats: LotteryState['globalStats']) => void;
  loadUserLotteries: (userId: string) => Promise<void>;
  loadUserStats: (userId: string) => Promise<void>;
  loadGlobalStats: () => Promise<void>;
  generateLotteryId: (userId: string) => Promise<{ success: boolean; lotteryId?: string; error?: string }>;
  drawLottery: (lotteryId: string, userId: string) => Promise<{ success: boolean; prize?: any; error?: string }>;
}

export const useLotteryStore = create<LotteryState>((set, get) => ({
  activities: [],
  currentActivity: null,
  isDrawing: false,
  userLotteries: [],
  lotteryStats: null,
  globalStats: null,
  
  setActivities: (activities) => set({ activities }),
  setCurrentActivity: (currentActivity) => set({ currentActivity }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  setUserLotteries: (userLotteries) => set({ userLotteries }),
  setLotteryStats: (lotteryStats) => set({ lotteryStats }),
  setGlobalStats: (globalStats) => set({ globalStats }),
  
  // 加载用户抽奖记录
  loadUserLotteries: async (userId: string) => {
    try {
      const response = await fetch(`/api/lottery/user-lotteries/${userId}`);
      const result = await response.json();
      
      if (result.success) {
        set({ userLotteries: result.data.lotteries });
      } else {
        console.error('Failed to load user lotteries:', result.message);
      }
    } catch (error) {
      console.error('Error loading user lotteries:', error);
    }
  },
  
  // 加载用户统计
  loadUserStats: async (userId: string) => {
    try {
      const response = await fetch(`/api/lottery/user-stats/${userId}`);
      const result = await response.json();
      
      if (result.success) {
        set({ lotteryStats: result.data.stats });
      } else {
        console.error('Failed to load user stats:', result.message);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  },
  
  // 加载全局统计
  loadGlobalStats: async () => {
    try {
      const response = await fetch('/api/lottery/global-stats');
      const result = await response.json();
      
      if (result.success) {
        set({ globalStats: result.data });
      } else {
        console.error('Failed to load global stats:', result.message);
      }
    } catch (error) {
      console.error('Error loading global stats:', error);
    }
  },
  
  // 生成抽奖ID
  generateLotteryId: async (userId: string) => {
    try {
      const response = await fetch('/api/lottery/generate-lottery-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();
      
      if (result.success) {
        // 重新加载用户抽奖记录
        await get().loadUserLotteries(userId);
        return { success: true, lotteryId: result.data.lotteryId };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('Error generating lottery ID:', error);
      return { success: false, error: '网络错误，请稍后重试' };
    }
  },
  
  // 执行抽奖
  drawLottery: async (lotteryId: string, userId: string) => {
    try {
      set({ isDrawing: true });
      
      const response = await fetch('/api/lottery/draw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lotteryId, userId }),
      });

      const result = await response.json();
      
      if (result.success) {
        // 重新加载用户抽奖记录和统计
        await get().loadUserLotteries(userId);
        await get().loadUserStats(userId);
        await get().loadGlobalStats();
        set({ isDrawing: false });
        return { success: true, prize: result.data.prize };
      } else {
        set({ isDrawing: false });
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('Error drawing lottery:', error);
      set({ isDrawing: false });
      return { success: false, error: '网络错误，请稍后重试' };
    }
  }
}));

// UI状态
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  theme: 'light',
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setTheme: (theme) => set({ theme }),
}));

// 留言板状态
interface Message {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface MessageBoardState {
  messages: Message[];
  isLoading: boolean;
  newMessageCount: number;
  addMessage: (content: string, user: User) => void;
  likeMessage: (messageId: string) => void;
  loadMessages: () => void;
  clearNewMessageCount: () => void;
}

export const useMessageBoardStore = create<MessageBoardState>((set) => ({
  messages: [],
  isLoading: false,
  newMessageCount: 0,
  
  addMessage: (content: string, user: User) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };
    
    set((state) => ({
      messages: [newMessage, ...state.messages].slice(0, 100), // 保持最新100条消息
      newMessageCount: state.newMessageCount + 1
    }));
  },
  
  likeMessage: (messageId: string) => {
    set((state) => ({
      messages: state.messages.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1,
              isLiked: !msg.isLiked 
            }
          : msg
      )
    }));
  },
  
  loadMessages: () => {
    set({ isLoading: true });
    
    // 模拟加载初始消息
    setTimeout(() => {
      const mockMessages: Message[] = [
        {
          id: 'msg_1',
          userId: 'user_1',
          username: 'CryptoTrader',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trader1',
          content: '欢迎来到Vibe交易所！这里有最新的加密货币交易机会！',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          likes: 12,
          isLiked: false
        },
        {
          id: 'msg_2',
          userId: 'user_2',
          username: 'BlockchainFan',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fan1',
          content: '今天的抽奖活动太棒了！已经参与了，期待中奖！',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          likes: 8,
          isLiked: false
        },
        {
          id: 'msg_3',
          userId: 'user_3',
          username: 'DeFiExplorer',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=explorer1',
          content: '这个平台的用户体验真的很棒，界面设计很现代化！',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          likes: 15,
          isLiked: false
        }
      ];
      
      set({ messages: mockMessages, isLoading: false });
    }, 1000);
  },
  
  clearNewMessageCount: () => set({ newMessageCount: 0 })
}));
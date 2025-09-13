import { create } from 'zustand';
import { User, Product, LotteryActivity, MarketOverview } from '../types';
import { mcpService, MCPUser, getMCPUserId, restoreMCPUser } from '../services/mcpService';

// 用户状态
interface UserState {
  user: User | null;
  mcpUser: MCPUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  initializeMCPUser: () => Promise<void>;
  login: (user: User) => void;
  logout: () => void;
  updateUserActivity: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  mcpUser: null,
  isAuthenticated: false,
  isInitialized: false,
  
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
        isInitialized: true 
      });
      
      console.log('MCP User initialized:', mcpUser.id);
    } catch (error) {
      console.error('Failed to initialize MCP user:', error);
      set({ isInitialized: true });
    }
  },
  
  login: (user) => set({ user, isAuthenticated: true }),
  
  logout: () => {
    mcpService.clearSession();
    set({ user: null, mcpUser: null, isAuthenticated: false });
  },
  
  // 更新用户活跃状态
  updateUserActivity: () => {
    const { mcpUser } = get();
    if (mcpUser) {
      mcpService.heartbeat();
    }
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

// 抽奖状态
interface LotteryState {
  activities: LotteryActivity[];
  currentActivity: LotteryActivity | null;
  isDrawing: boolean;
  setActivities: (activities: LotteryActivity[]) => void;
  setCurrentActivity: (activity: LotteryActivity | null) => void;
  setIsDrawing: (isDrawing: boolean) => void;
}

export const useLotteryStore = create<LotteryState>((set) => ({
  activities: [],
  currentActivity: null,
  isDrawing: false,
  setActivities: (activities) => set({ activities }),
  setCurrentActivity: (currentActivity) => set({ currentActivity }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
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
// 用户相关类型
export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
  role?: 'user' | 'admin' | 'moderator';
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  nickname?: string;
  techLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  programmingLanguages?: string[];
}

// 产品相关类型
export interface Product {
  id: string;
  symbol: string;
  name: string;
  description: string;
  price: number;
  marketCap: number;
  change24h: number;
  volume24h: number;
  isActive: boolean;
  category: 'code' | 'data' | 'service' | 'prompt';
  icon?: string;
}

// 订单相关类型
export interface Order {
  id: string;
  userId: string;
  productId: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  quantity: number;
  price?: number;
  filledQuantity: number;
  status: 'pending' | 'filled' | 'cancelled' | 'partial';
  createdAt: string;
}

// 抽奖相关类型
export interface LotteryActivity {
  id: string;
  title: string;
  description: string;
  ticketPrice: number;
  maxTickets: number;
  soldTickets: number;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'ended' | 'cancelled';
  prizes: LotteryPrize[];
}

export interface LotteryPrize {
  id: string;
  name: string;
  description: string;
  value: number;
  quantity: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LotteryTicket {
  id: string;
  activityId: string;
  userId: string;
  ticketNumber: string;
  purchasedAt: string;
}

// 市场数据类型
export interface MarketOverview {
  totalMarketCap: number;
  totalVolume24h: number;
  activeTraders: number;
  topGainers: Product[];
  topLosers: Product[];
}

// 数字员工类型
export interface DigitalEmployee {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  personality: string;
  skills: string[];
  isActive: boolean;
  category: 'professional' | 'fun';
}
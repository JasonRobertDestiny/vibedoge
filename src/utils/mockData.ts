import { Product, MarketOverview, LotteryActivity, LotteryPrize, DigitalEmployee } from '../types';

// 模拟产品数据
export const mockProducts: Product[] = [
  {
    id: '1',
    symbol: 'VIBE',
    name: 'Vibe Token',
    description: 'Vibe交易所原生代币',
    price: 1.25,
    marketCap: 125000000,
    change24h: 5.67,
    volume24h: 2500000,
    isActive: true,
    category: 'code',
    icon: '🚀'
  },
  {
    id: '2',
    symbol: 'DOGE',
    name: 'Dogecoin',
    description: '最受欢迎的模因币',
    price: 0.08,
    marketCap: 11500000000,
    change24h: -2.34,
    volume24h: 890000000,
    isActive: true,
    category: 'code',
    icon: '🐕'
  },
  {
    id: '3',
    symbol: 'CODE',
    name: 'Code Assistant',
    description: 'AI编程助手服务',
    price: 15.99,
    marketCap: 15990000,
    change24h: 12.45,
    volume24h: 450000,
    isActive: true,
    category: 'service',
    icon: '💻'
  }
];

// 模拟市场概览数据
export const mockMarketOverview: MarketOverview = {
  totalMarketCap: 2500000000,
  totalVolume24h: 125000000,
  activeTraders: 15420,
  topGainers: mockProducts.filter(p => p.change24h > 0),
  topLosers: mockProducts.filter(p => p.change24h < 0)
};

// 模拟抽奖奖品
const mockPrizes: LotteryPrize[] = [
  {
    id: '1',
    name: '1000 VIBE代币',
    description: '价值1250美元的VIBE代币',
    value: 1250,
    quantity: 1,
    rarity: 'legendary'
  },
  {
    id: '2',
    name: '500 VIBE代币',
    description: '价值625美元的VIBE代币',
    value: 625,
    quantity: 2,
    rarity: 'epic'
  },
  {
    id: '3',
    name: '100 VIBE代币',
    description: '价值125美元的VIBE代币',
    value: 125,
    quantity: 5,
    rarity: 'rare'
  },
  {
    id: '4',
    name: '10 VIBE代币',
    description: '价值12.5美元的VIBE代币',
    value: 12.5,
    quantity: 20,
    rarity: 'common'
  }
];

// 模拟抽奖活动
export const mockLotteryActivities: LotteryActivity[] = [
  {
    id: '1',
    title: 'Vibe Coding 新年抽奖',
    description: '庆祝Vibe Coding平台上线，参与抽奖赢取丰厚奖励！',
    ticketPrice: 5,
    maxTickets: 1000,
    soldTickets: 756,
    startTime: '2024-01-01T00:00:00Z',
    endTime: '2024-01-31T23:59:59Z',
    status: 'active',
    prizes: mockPrizes
  },
  {
    id: '2',
    title: 'AI编程助手体验抽奖',
    description: '体验最新AI编程助手，参与抽奖获得免费使用权限！',
    ticketPrice: 3,
    maxTickets: 500,
    soldTickets: 234,
    startTime: '2024-02-01T00:00:00Z',
    endTime: '2024-02-28T23:59:59Z',
    status: 'upcoming',
    prizes: mockPrizes.slice(1)
  }
];

// 模拟数字员工数据
export const mockDigitalEmployees: DigitalEmployee[] = [
  {
    id: '1',
    name: 'Alice',
    role: 'AI编程助手',
    description: '专业的代码审查和优化专家',
    avatar: '👩‍💻',
    personality: '严谨、专业、高效',
    skills: ['代码审查', '性能优化', '架构设计'],
    isActive: true,
    category: 'professional'
  },
  {
    id: '2',
    name: 'Bob',
    role: '数据分析师',
    description: '擅长数据挖掘和可视化分析',
    avatar: '👨‍📊',
    personality: '细致、逻辑性强、善于发现问题',
    skills: ['数据分析', '机器学习', '报表制作'],
    isActive: true,
    category: 'professional'
  },
  {
    id: '3',
    name: 'Charlie',
    role: '创意助手',
    description: '提供创意灵感和设计建议',
    avatar: '🎨',
    personality: '活泼、有创意、思维发散',
    skills: ['创意设计', '文案撰写', '品牌策划'],
    isActive: true,
    category: 'fun'
  }
];

// 获取随机抽奖结果
export const getRandomLotteryResult = (prizes: LotteryPrize[]): LotteryPrize => {
  const weights = {
    legendary: 1,
    epic: 5,
    rare: 15,
    common: 79
  };
  
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (const [rarity, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (random <= cumulative) {
      const availablePrizes = prizes.filter(p => p.rarity === rarity && p.quantity > 0);
      if (availablePrizes.length > 0) {
        return availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
      }
    }
  }
  
  // 如果没有找到合适的奖品，返回最常见的奖品
  const commonPrizes = prizes.filter(p => p.rarity === 'common' && p.quantity > 0);
  return commonPrizes[Math.floor(Math.random() * commonPrizes.length)] || prizes[0];
};
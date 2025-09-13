// 国际化配置

export interface Translations {
  [key: string]: string | Translations;
}

export const translations = {
  zh: {
    common: {
      loading: '加载中...',
      error: '错误',
      success: '成功',
      confirm: '确认',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      view: '查看',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      submit: '提交',
      reset: '重置'
    },
    home: {
      hero: {
        title: '欢迎来到 Vibe 交易所',
        subtitle: '探索数字资产的无限可能',
        description: '安全、高效、创新的数字资产交易平台，为您提供专业的交易体验。',
        cta: '开始交易',
        learnMore: '了解更多'
      },
      business: {
        title: '我们的业务',
        subtitle: '多元化的数字资产服务',
        trading: {
          title: '现货交易',
          description: '提供主流数字货币的现货交易服务'
        },
        futures: {
          title: '合约交易',
          description: '专业的衍生品交易平台'
        },
        staking: {
          title: '质押挖矿',
          description: '安全稳定的数字资产增值服务'
        }
      },
      values: {
        title: '我们的价值观',
        security: {
          title: '安全第一',
          description: '采用银行级安全措施保护用户资产'
        },
        innovation: {
          title: '持续创新',
          description: '不断推出新产品和服务满足用户需求'
        },
        transparency: {
          title: '透明公正',
          description: '公开透明的交易环境和费率结构'
        },
        service: {
          title: '优质服务',
          description: '7x24小时专业客服支持'
        }
      },
      lottery: {
        title: '幸运抽奖',
        subtitle: '参与抽奖，赢取丰厚奖品',
        participate: '立即参与',
        viewDetails: '查看详情',
        participants: '参与人数',
        timeLeft: '剩余时间',
        prizes: '奖品池'
      },
      messageBoard: {
        title: '社区留言板',
        subtitle: '与社区成员实时交流',
        placeholder: '分享你的想法...',
        send: '发送',
        userWall: '用户墙',
        hotTopics: '热门话题',
        communityStats: '社区统计',
        onlineUsers: '在线用户',
        totalMessages: '总消息数',
        activeTopics: '活跃话题'
      },
      mcp: {
        title: 'MCP 服务器集成',
        subtitle: '连接智能服务，提升交易体验',
        description: '通过 Model Context Protocol 集成各种智能服务，为您提供更智能的交易辅助。',
        features: {
          analysis: '智能分析',
          alerts: '价格提醒',
          automation: '自动化交易',
          insights: '市场洞察'
        },
        cta: '了解更多'
      }
    }
  },
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      reset: 'Reset'
    },
    home: {
      hero: {
        title: 'Welcome to Vibe Exchange',
        subtitle: 'Explore Infinite Possibilities of Digital Assets',
        description: 'Secure, efficient, and innovative digital asset trading platform providing professional trading experience.',
        cta: 'Start Trading',
        learnMore: 'Learn More'
      },
      business: {
        title: 'Our Business',
        subtitle: 'Diversified Digital Asset Services',
        trading: {
          title: 'Spot Trading',
          description: 'Spot trading services for mainstream cryptocurrencies'
        },
        futures: {
          title: 'Futures Trading',
          description: 'Professional derivatives trading platform'
        },
        staking: {
          title: 'Staking',
          description: 'Safe and stable digital asset appreciation services'
        }
      },
      values: {
        title: 'Our Values',
        security: {
          title: 'Security First',
          description: 'Bank-level security measures to protect user assets'
        },
        innovation: {
          title: 'Continuous Innovation',
          description: 'Continuously launching new products and services to meet user needs'
        },
        transparency: {
          title: 'Transparency',
          description: 'Open and transparent trading environment and fee structure'
        },
        service: {
          title: 'Quality Service',
          description: '7x24 professional customer support'
        }
      },
      lottery: {
        title: 'Lucky Draw',
        subtitle: 'Participate in lottery and win great prizes',
        participate: 'Participate Now',
        viewDetails: 'View Details',
        participants: 'Participants',
        timeLeft: 'Time Left',
        prizes: 'Prize Pool'
      },
      messageBoard: {
        title: 'Community Message Board',
        subtitle: 'Real-time communication with community members',
        placeholder: 'Share your thoughts...',
        send: 'Send',
        userWall: 'User Wall',
        hotTopics: 'Hot Topics',
        communityStats: 'Community Stats',
        onlineUsers: 'Online Users',
        totalMessages: 'Total Messages',
        activeTopics: 'Active Topics'
      },
      mcp: {
        title: 'MCP Server Integration',
        subtitle: 'Connect Smart Services, Enhance Trading Experience',
        description: 'Integrate various smart services through Model Context Protocol to provide smarter trading assistance.',
        features: {
          analysis: 'Smart Analysis',
          alerts: 'Price Alerts',
          automation: 'Automated Trading',
          insights: 'Market Insights'
        },
        cta: 'Learn More'
      }
    }
  }
};

// 获取翻译文本的辅助函数
export function getTranslation(key: string, language: 'zh' | 'en' = 'zh'): string {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // 如果找不到翻译，返回原始key
    }
  }
  
  return typeof value === 'string' ? value : key;
}

// React Hook for translations
export function useTranslation(language: 'zh' | 'en' = 'zh') {
  return {
    t: (key: string) => getTranslation(key, language),
    language
  };
}
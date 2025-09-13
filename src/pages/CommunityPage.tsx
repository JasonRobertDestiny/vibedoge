import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Heart, Send, TrendingUp, Clock } from 'lucide-react';

interface Message {
    id: string;
    username: string;
    content: string;
    timestamp: Date;
    likes: number;
    replies: number;
}

interface Topic {
    id: string;
    title: string;
    description: string;
    messages: number;
    participants: number;
    lastActivity: Date;
    trending: boolean;
}

const CommunityPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            username: 'VibeTrader',
            content: '今天的抽奖活动太精彩了！恭喜所有中奖的朋友们 🎉',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            likes: 12,
            replies: 3
        },
        {
            id: '2',
            username: 'CryptoExplorer',
            content: 'Vibe交易所的用户体验真的很棒，界面设计很现代化！',
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
            likes: 8,
            replies: 1
        },
        {
            id: '3',
            username: 'BlockchainFan',
            content: '期待更多有趣的功能上线，社区氛围越来越好了 💪',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            likes: 15,
            replies: 5
        }
    ]);

    const [topics] = useState<Topic[]>([
        {
            id: '1',
            title: '抽奖活动讨论',
            description: '分享你的抽奖体验和建议',
            messages: 156,
            participants: 42,
            lastActivity: new Date(Date.now() - 1000 * 60 * 2),
            trending: true
        },
        {
            id: '2',
            title: '交易策略分享',
            description: '交流交易心得和市场分析',
            messages: 89,
            participants: 28,
            lastActivity: new Date(Date.now() - 1000 * 60 * 10),
            trending: true
        },
        {
            id: '3',
            title: '新手指南',
            description: '帮助新用户快速上手',
            messages: 234,
            participants: 67,
            lastActivity: new Date(Date.now() - 1000 * 60 * 45),
            trending: false
        }
    ]);

    const [newMessage, setNewMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'messages' | 'topics'>('messages');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message: Message = {
                id: Date.now().toString(),
                username: 'You',
                content: newMessage,
                timestamp: new Date(),
                likes: 0,
                replies: 0
            };
            setMessages([message, ...messages]);
            setNewMessage('');
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        
        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前`;
        return `${Math.floor(minutes / 1440)}天前`;
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                            社区广场
                            <span className="block text-2xl md:text-3xl text-slate-600 mt-2">
                                Community Plaza
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            连接全球用户，分享交易心得，共建活跃社区
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white/75 backdrop-blur-md rounded-full p-1 border border-white/90">
                        <button
                            onClick={() => setActiveTab('messages')}
                            className={`px-6 py-3 rounded-full transition-all duration-300 ${
                                activeTab === 'messages'
                                    ? 'bg-blue-600/90 backdrop-blur-sm text-white shadow-lg border border-blue-700/90'
                                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/75'
                            }`}
                        >
                            <MessageSquare className="w-5 h-5 inline-block mr-2" />
                            实时留言
                        </button>
                        <button
                            onClick={() => setActiveTab('topics')}
                            className={`px-6 py-3 rounded-full transition-all duration-300 ${
                                activeTab === 'topics'
                                    ? 'bg-blue-600/90 backdrop-blur-sm text-white shadow-lg border border-blue-700/90'
                                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/75'
                            }`}
                        >
                            <Users className="w-5 h-5 inline-block mr-2" />
                            话题讨论
                        </button>
                    </div>
                </div>

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        {/* Message Input */}
                        <div className="bg-white/75 backdrop-blur-md rounded-2xl p-6 border border-white/90">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="分享你的想法..."
                                        className="w-full bg-white/85 border border-gray-700/80 rounded-xl px-4 py-3 text-slate-800 placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:bg-white/90 backdrop-blur-sm"
                                        rows={3}
                                    />
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-blue-600/90 backdrop-blur-sm border border-blue-700/90 hover:bg-blue-700/95 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 h-fit shadow-lg"
                                >
                                    <Send className="w-5 h-5" />
                                    发送
                                </button>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white/75 backdrop-blur-md rounded-2xl p-6 hover:bg-white/85 transition-all duration-300 border border-white/90"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm border border-blue-200/30 rounded-full flex items-center justify-center text-slate-800 font-bold">
                                            {message.username[0]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-slate-800 font-semibold">{message.username}</h3>
                                                <span className="text-slate-500 text-sm flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {formatTime(message.timestamp)}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 mb-3">{message.content}</p>
                                            <div className="flex items-center gap-4">
                                                <button className="flex items-center gap-1 text-slate-500 hover:text-pink-500 transition-colors">
                                                    <Heart className="w-4 h-4" />
                                                    {message.likes}
                                                </button>
                                                <button className="flex items-center gap-1 text-slate-500 hover:text-blue-500 transition-colors">
                                                    <MessageSquare className="w-4 h-4" />
                                                    {message.replies}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Topics Tab */}
                {activeTab === 'topics' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {topics.map((topic) => (
                            <motion.div
                                key={topic.id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/75 backdrop-blur-md rounded-2xl p-6 hover:bg-white/85 transition-all duration-300 cursor-pointer border border-white/90"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-slate-800 font-bold text-lg">{topic.title}</h3>
                                    {topic.trending && (
                                        <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-200/30 text-orange-600 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            热门
                                        </div>
                                    )}
                                </div>
                                <p className="text-slate-600 mb-4">{topic.description}</p>
                                <div className="flex items-center justify-between text-sm text-slate-500">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <MessageSquare className="w-4 h-4" />
                                            {topic.messages}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {topic.participants}
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {formatTime(topic.lastActivity)}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CommunityPage;
import React from 'react';
import { BarChart3, Users, TrendingUp, Globe } from 'lucide-react';

const GlobalStatsPage: React.FC = () => {
    // 用户增长趋势数据（最近12个月）
    const userGrowthData = [
        { month: '2024-01', users: 1200000, label: '1月' },
        { month: '2024-02', users: 1350000, label: '2月' },
        { month: '2024-03', users: 1480000, label: '3月' },
        { month: '2024-04', users: 1620000, label: '4月' },
        { month: '2024-05', users: 1780000, label: '5月' },
        { month: '2024-06', users: 1950000, label: '6月' },
        { month: '2024-07', users: 2100000, label: '7月' },
        { month: '2024-08', users: 2280000, label: '8月' },
        { month: '2024-09', users: 2450000, label: '9月' },
        { month: '2024-10', users: 2620000, label: '10月' },
        { month: '2024-11', users: 2750000, label: '11月' },
        { month: '2024-12', users: 2800000, label: '12月' },
    ];

    // 地区分布数据
    const regionData = [
        { region: '亚洲', users: 1120000, percentage: 40, color: 'bg-blue-500' },
        { region: '北美', users: 840000, percentage: 30, color: 'bg-green-500' },
        { region: '欧洲', users: 560000, percentage: 20, color: 'bg-purple-500' },
        { region: '南美', users: 168000, percentage: 6, color: 'bg-yellow-500' },
        { region: '非洲', users: 84000, percentage: 3, color: 'bg-red-500' },
        { region: '大洋洲', users: 28000, percentage: 1, color: 'bg-cyan-500' },
    ];

    const maxUsers = Math.max(...userGrowthData.map(d => d.users));
    const maxRegionUsers = Math.max(...regionData.map(d => d.users));

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-16">
                {/* 页面标题 */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-slate-800 mb-6">
                        全球统计
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        实时展示Vibe交易所全球用户活动数据和平台运营统计
                    </p>
                </div>

                {/* 统计卡片网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {/* 全球用户数 */}
                    <div className="bg-white/75 backdrop-blur-md rounded-2xl p-8 border border-white/90">
                        <div className="flex items-center justify-between mb-4">
                            <Users className="w-12 h-12 text-blue-500" />
                            <span className="text-green-500 text-sm font-medium">+12.5%</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-2">2.8M</h3>
                        <p className="text-slate-600">全球用户</p>
                    </div>

                    {/* 日活跃用户 */}
                    <div className="bg-white/75 backdrop-blur-md rounded-2xl p-8 border border-white/90">
                        <div className="flex items-center justify-between mb-4">
                            <TrendingUp className="w-12 h-12 text-green-500" />
                            <span className="text-green-500 text-sm font-medium">+8.3%</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-2">456K</h3>
                        <p className="text-slate-600">日活跃用户</p>
                    </div>

                    {/* 抽奖参与次数 */}
                    <div className="bg-white/75 backdrop-blur-md rounded-2xl p-8 border border-white/90">
                        <div className="flex items-center justify-between mb-4">
                            <BarChart3 className="w-12 h-12 text-purple-500" />
                            <span className="text-green-500 text-sm font-medium">+25.7%</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-2">1.2M</h3>
                        <p className="text-slate-600">抽奖参与次数</p>
                    </div>

                    {/* 覆盖国家 */}
                    <div className="bg-white/75 backdrop-blur-md rounded-2xl p-8 border border-white/90">
                        <div className="flex items-center justify-between mb-4">
                            <Globe className="w-12 h-12 text-cyan-500" />
                            <span className="text-green-500 text-sm font-medium">+2</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 mb-2">180+</h3>
                        <p className="text-slate-600">覆盖国家</p>
                    </div>
                </div>

                {/* 实时活动图表 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 用户增长趋势 */}
                    <div className="bg-white/75 backdrop-blur-md rounded-2xl p-8 border border-white/90">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">用户增长趋势</h3>
                        <div className="h-64 relative">
                            {/* 折线图容器 */}
                            <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
                                {userGrowthData.map((data, index) => {
                                    const height = (data.users / maxUsers) * 180;
                                    const isLast = index === userGrowthData.length - 1;
                                    return (
                                        <div key={data.month} className="flex flex-col items-center relative group">
                                            {/* 数据点 */}
                                            <div 
                                                className="w-3 h-3 bg-blue-500 rounded-full relative z-10 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-600"
                                                style={{ marginBottom: `${height}px` }}
                                            >
                                                {/* 悬浮提示 */}
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {(data.users / 1000000).toFixed(1)}M
                                                </div>
                                            </div>
                                            {/* 连接线 */}
                                            {!isLast && (
                                                <div 
                                                    className="absolute top-0 left-1/2 w-px bg-blue-400 transform -translate-x-1/2"
                                                    style={{ 
                                                        height: `${height}px`,
                                                        transform: `translateX(${100 / userGrowthData.length}%) rotate(${Math.atan2(
                                                            (userGrowthData[index + 1].users - data.users) / maxUsers * 180,
                                                            100 / userGrowthData.length
                                                        )}rad)`,
                                                        transformOrigin: 'bottom'
                                                    }}
                                                />
                                            )}
                                            {/* 月份标签 */}
                                            <span className="text-xs text-slate-600 mt-2 transform -rotate-45">
                                                {data.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Y轴标签 */}
                            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500 py-8">
                                <span>{(maxUsers / 1000000).toFixed(1)}M</span>
                                <span>{(maxUsers / 2000000).toFixed(1)}M</span>
                                <span>0</span>
                            </div>
                        </div>
                    </div>

                    {/* 地区分布 */}
                    <div className="bg-white/75 backdrop-blur-md rounded-2xl p-8 border border-white/90">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">地区分布</h3>
                        <div className="h-64">
                            {/* 柱状图 */}
                            <div className="flex items-end justify-between h-48 mb-4">
                                {regionData.map((data) => {
                                    const height = (data.users / maxRegionUsers) * 160;
                                    return (
                                        <div key={data.region} className="flex flex-col items-center group cursor-pointer">
                                            {/* 柱子 */}
                                            <div className="relative">
                                                <div 
                                                    className={`w-8 ${data.color} rounded-t transition-all duration-500 group-hover:opacity-80`}
                                                    style={{ height: `${height}px` }}
                                                />
                                                {/* 悬浮数据 */}
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {(data.users / 1000).toFixed(0)}K ({data.percentage}%)
                                                </div>
                                            </div>
                                            {/* 地区标签 */}
                                            <span className="text-xs text-slate-600 mt-2 transform -rotate-45 whitespace-nowrap">
                                                {data.region}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* 图例 */}
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {regionData.map((data) => (
                                    <div key={data.region} className="flex items-center">
                                        <div className={`w-3 h-3 ${data.color} rounded mr-2`} />
                                        <span className="text-slate-600 text-xs">
                                            {data.region}: {data.percentage}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalStatsPage;
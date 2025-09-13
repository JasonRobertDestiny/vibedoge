import React from 'react';
import { Heart, Target, Users, Zap, User, Phone, Mail, Github, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-16">
                {/* 页面标题 */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-slate-800 mb-6">
                        关于Vibe交易所
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        致力于打造全球领先的数字资产交易平台，为用户提供安全、便捷、创新的交易体验
                    </p>
                </div>

                {/* 愿景使命 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div className="bg-white/75 backdrop-blur-lg rounded-2xl p-8 border border-white/90">
                        <div className="flex items-center mb-6">
                            <Target className="w-12 h-12 text-blue-400 mr-4" />
                            <h2 className="text-3xl font-bold text-slate-800">我们的愿景</h2>
                        </div>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            成为全球最受信赖的数字资产交易平台，推动区块链技术的普及和应用，
                            让每个人都能轻松参与到数字经济的发展中来。
                        </p>
                    </div>

                    <div className="bg-white/75 backdrop-blur-lg rounded-2xl p-8 border border-white/90">
                        <div className="flex items-center mb-6">
                            <Heart className="w-12 h-12 text-red-400 mr-4" />
                            <h2 className="text-3xl font-bold text-slate-800">我们的使命</h2>
                        </div>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            通过创新的技术和优质的服务，为全球用户提供安全、高效、透明的数字资产交易环境，
                            促进数字经济的健康发展。
                        </p>
                    </div>
                </div>

                {/* 核心价值观 */}
                <div className="mb-16">
                    <h2 className="text-4xl font-bold text-slate-800 text-center mb-12">核心价值观</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-white/75 backdrop-blur-lg rounded-2xl p-8 border border-white/90">
                                <Users className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-slate-800 mb-4">用户至上</h3>
                                <p className="text-slate-600">
                                    始终将用户需求放在首位，持续优化产品体验，
                                    为用户创造最大价值。
                                </p>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="bg-white/75 backdrop-blur-lg rounded-2xl p-8 border border-white/90">
                                <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-slate-800 mb-4">创新驱动</h3>
                                <p className="text-slate-600">
                                    拥抱新技术，勇于创新，不断探索区块链技术的
                                    无限可能。
                                </p>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="bg-white/75 backdrop-blur-lg rounded-2xl p-8 border border-white/90">
                                <Heart className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-slate-800 mb-4">诚信透明</h3>
                                <p className="text-slate-600">
                                    坚持诚信经营，保持透明运营，建立用户信任，
                                    共建健康生态。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 创始人介绍 */}
                <div className="mb-16">
                    <h2 className="text-4xl font-bold text-slate-800 text-center mb-12">创始人团队</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* 陈星 */}
                        <div className="bg-white/75 backdrop-blur-lg rounded-2xl p-8 border border-white/90 hover:bg-white/85 transition-all duration-300">
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 bg-blue-500/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center border border-blue-300/30">
                                    <User className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">陈星</h3>
                                <p className="text-slate-500 text-sm">aimagic.plus</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center text-slate-600">
                                    <Phone className="w-4 h-4 mr-2 text-blue-500" />
                                    <span className="text-sm">13141305408</span>
                                </div>
                                <div className="text-slate-600 text-sm leading-relaxed">
                                    <p className="mb-2">• WaytoAGI社区共建者</p>
                                    <p className="mb-2">• AI短剧《众神之战》制片人及创作者</p>
                                    <p className="mb-2">• 娱动未来联合创始人</p>
                                    <p>• 前新浪VR总经理</p>
                                </div>
                            </div>
                        </div>

                        {/* 喵喵南巷飘雪 */}
                        <div className="bg-white/75 backdrop-blur-lg rounded-2xl p-8 border border-white/90 hover:bg-white/85 transition-all duration-300">
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 bg-green-500/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center border border-green-300/30">
                                    <User className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">喵喵南巷飘雪</h3>
                                <p className="text-slate-500 text-sm">后端开发专家</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center text-slate-600">
                                    <Phone className="w-4 h-4 mr-2 text-green-500" />
                                    <span className="text-sm">18647688609</span>
                                </div>
                                <div className="flex items-center text-slate-600">
                                    <Mail className="w-4 h-4 mr-2 text-green-500" />
                                    <span className="text-sm break-all">csm@ashes.vip</span>
                                </div>
                                <div className="flex items-center text-slate-600">
                                    <Github className="w-4 h-4 mr-2 text-green-500" />
                                    <a href="https://github.com/lovelinesmoe" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-slate-800 transition-colors">
                                        lovelinesmoe
                                    </a>
                                </div>
                                <div className="flex items-center text-slate-600">
                                    <Globe className="w-4 h-4 mr-2 text-green-500" />
                                    <a href="https://blog.ashes.vip" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-slate-800 transition-colors">
                                        blog.ashes.vip
                                    </a>
                                </div>
                                <div className="text-slate-600 text-sm leading-relaxed">
                                    <p className="mb-2">• 企业Java后端开发社畜</p>
                                    <p>• 最近在做企业的AI开票</p>
                                </div>
                            </div>
                        </div>

                        {/* Jason */}
                        <div className="bg-white/75 backdrop-blur-lg rounded-2xl p-8 border border-white/90 hover:bg-white/85 transition-all duration-300">
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 bg-yellow-500/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center border border-yellow-300/30">
                                    <User className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Jason</h3>
                                <p className="text-slate-500 text-sm">AI & Agent 爱好者</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center text-slate-600">
                                    <Phone className="w-4 h-4 mr-2 text-yellow-500" />
                                    <span className="text-sm">17385668067</span>
                                </div>
                                <div className="flex items-center text-slate-600">
                                    <Github className="w-4 h-4 mr-2 text-yellow-500" />
                                    <a href="https://github.com/JasonRobertDestiny" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-slate-800 transition-colors">
                                        JasonRobertDestiny
                                    </a>
                                </div>
                                <div className="text-slate-600 text-sm leading-relaxed">
                                    <p className="mb-2">• 大二在读学生</p>
                                    <p>• vibecoding&Agent 爱好者</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 团队介绍 */}
                <div className="bg-white/75 backdrop-blur-lg rounded-2xl p-8 border border-white/90">
                    <h2 className="text-4xl font-bold text-slate-800 text-center mb-8">我们的团队</h2>
                    <div className="text-center">
                        <p className="text-slate-600 text-lg leading-relaxed max-w-4xl mx-auto mb-8">
                            Vibe交易所由一支充满激情的国际化团队打造，团队成员来自全球顶尖的科技公司和金融机构，
                            拥有丰富的区块链技术开发经验和金融市场运营经验。我们致力于为用户提供最优质的服务，
                            推动数字资产行业的健康发展。
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                                <div className="text-slate-600">团队成员</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-green-500 mb-2">15+</div>
                                <div className="text-slate-600">国家地区</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-yellow-500 mb-2">10+</div>
                                <div className="text-slate-600">年平均经验</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-pink-500 mb-2">24/7</div>
                                <div className="text-slate-600">全天候服务</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutPage;
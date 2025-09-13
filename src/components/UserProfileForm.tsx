import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    User, 
    Code, 
    Github, 
    Heart, 
    Lightbulb, 
    BookOpen, 
    TrendingUp,
    Check,
    AlertCircle
} from 'lucide-react';

interface UserProfileData {
    // 基础信息
    nickname: string;
    avatar?: string;
    bio: string;
    
    // 技能信息
    programmingLanguages: string[];
    projectExperience: string;
    techLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    githubProfile?: string;
    portfolioUrl?: string;
    
    // 社交信息
    socialLinks: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        website?: string;
    };
    
    // 互动信息
    wishContent: string;
    shareReason: string;
    referralCode?: string;
    
    // 创意内容
    lotterySlogan: string;
    luckyNumber: number;
    personalTags: string[];
    
    // 贡献信息
    platformContribution: number;
    activityLevel: number;
    reputationLevel: number;
    
    // 学习信息
    learningGoals: string[];
    currentProjects: string;
    skillChallengeAnswer?: string;
    
    // 投资信息
    tradingExperience: 'none' | 'beginner' | 'intermediate' | 'advanced';
    investmentGoals: string;
    riskTolerance: 'low' | 'medium' | 'high';
}

interface UserProfileFormProps {
    onSubmit: (data: UserProfileData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ 
    onSubmit, 
    onCancel, 
    isSubmitting = false 
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<UserProfileData>({
        nickname: '',
        bio: '',
        programmingLanguages: [],
        projectExperience: '',
        techLevel: 'beginner',
        socialLinks: {},
        wishContent: '',
        shareReason: '',
        lotterySlogan: '',
        luckyNumber: Math.floor(Math.random() * 100) + 1,
        personalTags: [],
        platformContribution: 0,
        activityLevel: 0,
        reputationLevel: 0,
        learningGoals: [],
        currentProjects: '',
        tradingExperience: 'none',
        investmentGoals: '',
        riskTolerance: 'medium'
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const totalSteps = 6;
    
    const programmingLanguageOptions = [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 
        'Rust', 'Swift', 'Kotlin', 'PHP', 'Ruby', 'Solidity', 'React', 
        'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Spring'
    ];
    
    const learningGoalOptions = [
        '前端开发', '后端开发', '全栈开发', '移动开发', '区块链开发',
        '人工智能', '数据科学', '云计算', '网络安全', '游戏开发',
        '产品管理', '项目管理', '创业', '投资理财'
    ];
    
    const personalTagOptions = [
        '技术极客', '创新者', '学习狂', '开源贡献者', '团队合作者',
        '问题解决者', '创意思考者', '效率达人', '完美主义者', '乐观主义者',
        '冒险家', '实用主义者', '理想主义者', '领导者', '追随者'
    ];
    
    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // 清除该字段的错误
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    
    const toggleArrayItem = (array: string[], item: string) => {
        return array.includes(item) 
            ? array.filter(i => i !== item)
            : [...array, item];
    };
    
    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};
        
        switch (step) {
            case 1: // 基础信息
                if (!formData.nickname.trim()) {
                    newErrors.nickname = '请输入昵称';
                }
                if (!formData.bio.trim()) {
                    newErrors.bio = '请输入个人简介';
                }
                break;
                
            case 2: // 技能信息
                if (formData.programmingLanguages.length === 0) {
                    newErrors.programmingLanguages = '请至少选择一种编程语言';
                }
                if (!formData.projectExperience.trim()) {
                    newErrors.projectExperience = '请描述您的项目经验';
                }
                break;
                
            case 3: // 互动信息
                if (!formData.wishContent.trim()) {
                    newErrors.wishContent = '请输入您的许愿内容';
                }
                if (!formData.shareReason.trim()) {
                    newErrors.shareReason = '请分享参与理由';
                }
                break;
                
            case 4: // 创意内容
                if (!formData.lotterySlogan.trim()) {
                    newErrors.lotterySlogan = '请输入抽奖口号';
                }
                if (formData.personalTags.length === 0) {
                    newErrors.personalTags = '请至少选择一个个性标签';
                }
                break;
                
            case 5: // 学习信息
                if (formData.learningGoals.length === 0) {
                    newErrors.learningGoals = '请至少选择一个学习目标';
                }
                if (!formData.currentProjects.trim()) {
                    newErrors.currentProjects = '请描述您当前的项目';
                }
                break;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };
    
    const handlePrev = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };
    
    const handleSubmit = () => {
        if (validateStep(currentStep)) {
            onSubmit(formData);
        }
    };
    
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-6">
                            <User className="h-12 w-12 text-vibe-blue mx-auto mb-3" />
                            <h3 className="text-xl font-bold text-gray-900">基础信息</h3>
                            <p className="text-gray-600">让我们了解一下您的基本情况</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                昵称 *
                            </label>
                            <input
                                type="text"
                                value={formData.nickname}
                                onChange={(e) => updateFormData('nickname', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-vibe-blue focus:border-transparent ${
                                    errors.nickname ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="输入您的昵称"
                            />
                            {errors.nickname && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.nickname}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                个人简介 *
                            </label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => updateFormData('bio', e.target.value)}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-vibe-blue focus:border-transparent ${
                                    errors.bio ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="简单介绍一下自己，让大家认识您..."
                            />
                            {errors.bio && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.bio}
                                </p>
                            )}
                        </div>
                    </motion.div>
                );
                
            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-6">
                            <Code className="h-12 w-12 text-vibe-blue mx-auto mb-3" />
                            <h3 className="text-xl font-bold text-gray-900">技能信息</h3>
                            <p className="text-gray-600">展示您的技术技能和经验</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                编程语言 * (可多选)
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {programmingLanguageOptions.map(lang => (
                                    <button
                                        key={lang}
                                        type="button"
                                        onClick={() => updateFormData('programmingLanguages', 
                                            toggleArrayItem(formData.programmingLanguages, lang)
                                        )}
                                        className={`px-3 py-2 text-sm rounded-lg border transition-all shadow-sm ${
                                            formData.programmingLanguages.includes(lang)
                                                ? 'bg-blue-600/90 text-white border-blue-700/90 shadow-md'
                                                : 'bg-white/90 text-gray-800 border-gray-400/90 hover:border-blue-600/90 hover:bg-blue-50/90 hover:shadow-md'
                                        }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                            {errors.programmingLanguages && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.programmingLanguages}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                技术水平
                            </label>
                            <select
                                value={formData.techLevel}
                                onChange={(e) => updateFormData('techLevel', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibe-blue focus:border-transparent"
                            >
                                <option value="beginner">初学者</option>
                                <option value="intermediate">中级</option>
                                <option value="advanced">高级</option>
                                <option value="expert">专家</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                项目经验 *
                            </label>
                            <textarea
                                value={formData.projectExperience}
                                onChange={(e) => updateFormData('projectExperience', e.target.value)}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-vibe-blue focus:border-transparent ${
                                    errors.projectExperience ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="描述您参与过的项目，包括技术栈、角色、成果等..."
                            />
                            {errors.projectExperience && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.projectExperience}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                GitHub 链接
                            </label>
                            <div className="flex items-center">
                                <Github className="h-5 w-5 text-gray-400 mr-2" />
                                <input
                                    type="url"
                                    value={formData.socialLinks.github || ''}
                                    onChange={(e) => updateFormData('socialLinks', {
                                        ...formData.socialLinks,
                                        github: e.target.value
                                    })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibe-blue focus:border-transparent"
                                    placeholder="https://github.com/yourusername"
                                />
                            </div>
                        </div>
                    </motion.div>
                );
                
            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-6">
                            <Heart className="h-12 w-12 text-vibe-blue mx-auto mb-3" />
                            <h3 className="text-xl font-bold text-gray-900">互动信息</h3>
                            <p className="text-gray-600">分享您的想法和参与动机</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                许愿内容 *
                            </label>
                            <textarea
                                value={formData.wishContent}
                                onChange={(e) => updateFormData('wishContent', e.target.value)}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-vibe-blue focus:border-transparent ${
                                    errors.wishContent ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="说说您的愿望或期待..."
                            />
                            {errors.wishContent && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.wishContent}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                参与理由 *
                            </label>
                            <textarea
                                value={formData.shareReason}
                                onChange={(e) => updateFormData('shareReason', e.target.value)}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-vibe-blue focus:border-transparent ${
                                    errors.shareReason ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="为什么想参与这次抽奖活动？"
                            />
                            {errors.shareReason && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.shareReason}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                推荐码 (可选)
                            </label>
                            <input
                                type="text"
                                value={formData.referralCode || ''}
                                onChange={(e) => updateFormData('referralCode', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibe-blue focus:border-transparent"
                                placeholder="如果有朋友推荐，请输入推荐码"
                            />
                        </div>
                    </motion.div>
                );
                
            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-6">
                            <Lightbulb className="h-12 w-12 text-vibe-blue mx-auto mb-3" />
                            <h3 className="text-xl font-bold text-gray-900">创意内容</h3>
                            <p className="text-gray-600">展现您的创意和个性</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                抽奖口号 *
                            </label>
                            <input
                                type="text"
                                value={formData.lotterySlogan}
                                onChange={(e) => updateFormData('lotterySlogan', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-vibe-blue focus:border-transparent ${
                                    errors.lotterySlogan ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="创造一个有趣的抽奖口号！"
                            />
                            {errors.lotterySlogan && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.lotterySlogan}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                幸运数字
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={formData.luckyNumber}
                                onChange={(e) => updateFormData('luckyNumber', parseInt(e.target.value) || 1)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibe-blue focus:border-transparent"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                个性标签 * (可多选)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {personalTagOptions.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => updateFormData('personalTags', 
                                            toggleArrayItem(formData.personalTags, tag)
                                        )}
                                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                            formData.personalTags.includes(tag)
                                                ? 'bg-vibe-blue text-white border-vibe-blue'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-vibe-blue'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                            {errors.personalTags && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.personalTags}
                                </p>
                            )}
                        </div>
                    </motion.div>
                );
                
            case 5:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-6">
                            <BookOpen className="h-12 w-12 text-vibe-blue mx-auto mb-3" />
                            <h3 className="text-xl font-bold text-gray-900">学习信息</h3>
                            <p className="text-gray-600">了解您的学习目标和当前项目</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                学习目标 * (可多选)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {learningGoalOptions.map(goal => (
                                    <button
                                        key={goal}
                                        type="button"
                                        onClick={() => updateFormData('learningGoals', 
                                            toggleArrayItem(formData.learningGoals, goal)
                                        )}
                                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                            formData.learningGoals.includes(goal)
                                                ? 'bg-vibe-blue text-white border-vibe-blue'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-vibe-blue'
                                        }`}
                                    >
                                        {goal}
                                    </button>
                                ))}
                            </div>
                            {errors.learningGoals && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.learningGoals}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                当前项目 *
                            </label>
                            <textarea
                                value={formData.currentProjects}
                                onChange={(e) => updateFormData('currentProjects', e.target.value)}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-vibe-blue focus:border-transparent ${
                                    errors.currentProjects ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="描述您当前正在进行的项目或学习计划..."
                            />
                            {errors.currentProjects && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.currentProjects}
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                技能挑战答案 (可选)
                            </label>
                            <textarea
                                value={formData.skillChallengeAnswer || ''}
                                onChange={(e) => updateFormData('skillChallengeAnswer', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibe-blue focus:border-transparent"
                                placeholder="如果有技能挑战题目，请在这里回答。详细的答案可能会增加您的中奖权重！"
                            />
                        </div>
                    </motion.div>
                );
                
            case 6:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-6">
                            <TrendingUp className="h-12 w-12 text-vibe-blue mx-auto mb-3" />
                            <h3 className="text-xl font-bold text-gray-900">投资信息</h3>
                            <p className="text-gray-600">了解您的投资经验和目标</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                交易经验
                            </label>
                            <select
                                value={formData.tradingExperience}
                                onChange={(e) => updateFormData('tradingExperience', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibe-blue focus:border-transparent"
                            >
                                <option value="none">无经验</option>
                                <option value="beginner">初学者</option>
                                <option value="intermediate">中级</option>
                                <option value="advanced">高级</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                投资目标
                            </label>
                            <textarea
                                value={formData.investmentGoals}
                                onChange={(e) => updateFormData('investmentGoals', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibe-blue focus:border-transparent"
                                placeholder="描述您的投资目标和期望..."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                风险承受能力
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { value: 'low', label: '保守型', desc: '优先保本' },
                                    { value: 'medium', label: '平衡型', desc: '适度风险' },
                                    { value: 'high', label: '激进型', desc: '高风险高收益' }
                                ].map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => updateFormData('riskTolerance', option.value)}
                                        className={`p-3 text-center rounded-lg border transition-all shadow-sm ${
                                            formData.riskTolerance === option.value
                                                ? 'bg-blue-600/90 text-white border-blue-700/90 shadow-md'
                                                : 'bg-white/90 text-gray-800 border-gray-400/90 hover:border-blue-600/90 hover:bg-blue-50/90 hover:shadow-md'
                                        }`}
                                    >
                                        <div className="font-semibold">{option.label}</div>
                                        <div className="text-xs mt-1 opacity-75">{option.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">📊 信息完整度</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>基础信息</span>
                                    <span className="text-green-600">✓ 完成</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>技能信息</span>
                                    <span className="text-green-600">✓ 完成</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>互动信息</span>
                                    <span className="text-green-600">✓ 完成</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>创意内容</span>
                                    <span className="text-green-600">✓ 完成</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>学习信息</span>
                                    <span className="text-green-600">✓ 完成</span>
                                </div>
                                <div className="flex justify-between font-semibold pt-2 border-t">
                                    <span>预估中奖权重</span>
                                    <span className="text-vibe-blue">⭐⭐⭐⭐⭐</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
                
            default:
                return null;
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* 头部 */}
                <div className="bg-vibe-blue text-white p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">完善个人资料</h2>
                        <button
                            onClick={onCancel}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                    
                    {/* 进度条 */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm">步骤 {currentStep} / {totalSteps}</span>
                        <div className="flex-1 bg-blue-600 rounded-full h-2">
                            <div 
                                className="bg-white h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
                
                {/* 内容区域 */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {renderStepContent()}
                </div>
                
                {/* 底部按钮 */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between">
                    <button
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                        className={`px-4 py-2 rounded-lg transition-colors shadow-md ${
                            currentStep === 1
                                ? 'bg-gray-400/90 text-gray-600 cursor-not-allowed border border-gray-500/90'
                                : 'bg-gray-700/90 text-white hover:bg-gray-800/95 border border-gray-800/90 hover:shadow-lg'
                        }`}
                    >
                        上一步
                    </button>
                    
                    <div className="flex space-x-3">
                        {currentStep < totalSteps ? (
                            <button
                                onClick={handleNext}
                                className="px-6 py-2 bg-blue-600/90 text-white rounded-lg hover:bg-blue-700/95 transition-colors border border-blue-700/90 shadow-md hover:shadow-lg"
                            >
                                下一步
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`px-6 py-2 rounded-lg transition-colors flex items-center shadow-md ${
                                    isSubmitting
                                        ? 'bg-gray-600/90 text-white cursor-not-allowed border border-gray-700/90'
                                        : 'bg-green-600/90 text-white hover:bg-green-700/95 border border-green-700/90 hover:shadow-lg'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                        />
                                        提交中...
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4 mr-2" />
                                        完成提交
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileForm;
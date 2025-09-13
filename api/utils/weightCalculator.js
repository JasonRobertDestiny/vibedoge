/**
 * 权重计算器 - 根据用户资料计算抽奖权重
 * 支持多种抽奖类型的权重计算策略
 */

class WeightCalculator {
    constructor() {
        // 基础权重配置
        this.baseWeights = {
            basicInfo: 0.15,      // 基础信息权重
            skillInfo: 0.25,      // 技能信息权重
            socialInfo: 0.20,     // 社交信息权重
            interactionInfo: 0.15, // 互动信息权重
            creativeInfo: 0.10,   // 创意信息权重
            contributionInfo: 0.10, // 贡献信息权重
            learningInfo: 0.03,   // 学习信息权重
            investmentInfo: 0.02  // 投资信息权重
        };

        // 不同抽奖类型的权重调整系数
        this.typeMultipliers = {
            normal: {
                basicInfo: 1.0,
                skillInfo: 1.0,
                socialInfo: 1.0,
                interactionInfo: 1.2,
                creativeInfo: 1.0,
                contributionInfo: 1.1,
                learningInfo: 1.0,
                investmentInfo: 1.0
            },
            skill: {
                basicInfo: 0.8,
                skillInfo: 1.5,
                socialInfo: 1.2,
                interactionInfo: 0.9,
                creativeInfo: 0.8,
                contributionInfo: 1.3,
                learningInfo: 1.4,
                investmentInfo: 0.7
            },
            creative: {
                basicInfo: 0.9,
                skillInfo: 0.8,
                socialInfo: 1.1,
                interactionInfo: 1.3,
                creativeInfo: 1.8,
                contributionInfo: 1.0,
                learningInfo: 1.1,
                investmentInfo: 0.6
            },
            social: {
                basicInfo: 1.1,
                skillInfo: 0.9,
                socialInfo: 1.6,
                interactionInfo: 1.4,
                creativeInfo: 1.2,
                contributionInfo: 1.2,
                learningInfo: 1.0,
                investmentInfo: 0.8
            },
            investment: {
                basicInfo: 1.0,
                skillInfo: 1.1,
                socialInfo: 1.0,
                interactionInfo: 0.9,
                creativeInfo: 0.7,
                contributionInfo: 1.0,
                learningInfo: 0.9,
                investmentInfo: 1.8
            }
        };

        // 奖励系数
        this.bonusMultipliers = {
            loyalty: 0.1,        // 忠诚度奖励
            referral: 0.05,      // 推荐奖励
            activity: 0.08,      // 活跃度奖励
            quality: 0.12,       // 质量奖励
            completeness: 0.15   // 完整度奖励
        };
    }

    /**
     * 计算用户权重
     * @param {Object} userProfile - 用户资料
     * @param {string} lotteryType - 抽奖类型
     * @returns {Object} 权重计算结果
     */
    calculateWeight(userProfile, lotteryType = 'normal') {
        if (!userProfile) {
            return {
                baseWeight: 1.0,
                bonusWeight: 0,
                totalWeight: 1.0,
                breakdown: {}
            };
        }

        // 计算各部分权重
        const basicInfoWeight = this.calculateBasicInfoWeight(userProfile);
        const skillInfoWeight = this.calculateSkillInfoWeight(userProfile);
        const socialInfoWeight = this.calculateSocialInfoWeight(userProfile);
        const interactionWeight = this.calculateInteractionWeight(userProfile);
        const creativeWeight = this.calculateCreativeWeight(userProfile);
        const contributionWeight = this.calculateContributionWeight(userProfile);
        const learningWeight = this.calculateLearningWeight(userProfile);
        const investmentWeight = this.calculateInvestmentWeight(userProfile);

        // 获取类型调整系数
        const multipliers = this.typeMultipliers[lotteryType] || this.typeMultipliers.normal;

        // 计算加权基础分数
        const weightedScores = {
            basicInfo: basicInfoWeight * this.baseWeights.basicInfo * multipliers.basicInfo,
            skillInfo: skillInfoWeight * this.baseWeights.skillInfo * multipliers.skillInfo,
            socialInfo: socialInfoWeight * this.baseWeights.socialInfo * multipliers.socialInfo,
            interactionInfo: interactionWeight * this.baseWeights.interactionInfo * multipliers.interactionInfo,
            creativeInfo: creativeWeight * this.baseWeights.creativeInfo * multipliers.creativeInfo,
            contributionInfo: contributionWeight * this.baseWeights.contributionInfo * multipliers.contributionInfo,
            learningInfo: learningWeight * this.baseWeights.learningInfo * multipliers.learningInfo,
            investmentInfo: investmentWeight * this.baseWeights.investmentInfo * multipliers.investmentInfo
        };

        // 计算基础权重
        const baseWeight = 1.0 + Object.values(weightedScores).reduce((sum, score) => sum + score, 0);

        // 计算奖励权重
        const bonusWeights = this.calculateBonusWeights(userProfile, lotteryType);
        const totalBonusWeight = Object.values(bonusWeights).reduce((sum, bonus) => sum + bonus, 0);

        // 计算最终权重
        const totalWeight = Math.max(baseWeight + totalBonusWeight, 0.1); // 最小权重0.1

        return {
            baseWeight: Math.round(baseWeight * 1000) / 1000,
            bonusWeight: Math.round(totalBonusWeight * 1000) / 1000,
            totalWeight: Math.round(totalWeight * 1000) / 1000,
            breakdown: {
                ...weightedScores,
                ...bonusWeights
            },
            // 详细分解
            basicInfoWeight,
            skillInfoWeight,
            socialInfoWeight,
            interactionWeight,
            creativeWeight,
            contributionWeight,
            learningWeight,
            investmentWeight,
            ...bonusWeights
        };
    }

    /**
     * 计算基础信息权重
     */
    calculateBasicInfoWeight(profile) {
        let score = 0;
        const maxScore = 1.0;

        // 基础字段完整性 (0.4)
        const basicFields = ['nickname', 'bio', 'location', 'occupation'];
        const completedBasic = basicFields.filter(field => profile[field] && profile[field].trim()).length;
        score += (completedBasic / basicFields.length) * 0.4;

        // 个人信息丰富度 (0.3)
        if (profile.birth_year) score += 0.1;
        if (profile.gender) score += 0.1;
        if (profile.interests && profile.interests.length > 0) {
            score += Math.min(profile.interests.length * 0.02, 0.1);
        }

        // 头像和个性化 (0.3)
        if (profile.avatar_url) score += 0.15;
        if (profile.bio && profile.bio.length > 50) score += 0.15;

        return Math.min(score, maxScore);
    }

    /**
     * 计算技能信息权重
     */
    calculateSkillInfoWeight(profile) {
        let score = 0;
        const maxScore = 1.0;

        // 编程语言 (0.3)
        if (profile.programming_languages && profile.programming_languages.length > 0) {
            score += Math.min(profile.programming_languages.length * 0.05, 0.3);
        }

        // 技术等级和经验 (0.25)
        if (profile.tech_level) {
            const levelScores = { beginner: 0.05, intermediate: 0.1, advanced: 0.15, expert: 0.25 };
            score += levelScores[profile.tech_level] || 0;
        }

        // 项目经验 (0.2)
        if (profile.project_experience) {
            const expScores = { none: 0, '1-2': 0.05, '3-5': 0.1, '6-10': 0.15, '10+': 0.2 };
            score += expScores[profile.project_experience] || 0;
        }

        // 专业技能和认证 (0.15)
        if (profile.specialties && profile.specialties.length > 0) {
            score += Math.min(profile.specialties.length * 0.02, 0.08);
        }
        if (profile.certifications && profile.certifications.length > 0) {
            score += Math.min(profile.certifications.length * 0.02, 0.07);
        }

        // 工具和框架 (0.1)
        const toolsCount = (profile.frameworks?.length || 0) + (profile.tools?.length || 0);
        score += Math.min(toolsCount * 0.01, 0.1);

        return Math.min(score, maxScore);
    }

    /**
     * 计算社交信息权重
     */
    calculateSocialInfoWeight(profile) {
        let score = 0;
        const maxScore = 1.0;

        // 主要社交平台 (0.5)
        const majorPlatforms = ['github_url', 'portfolio_url', 'linkedin_url'];
        const majorCount = majorPlatforms.filter(platform => profile[platform] && profile[platform].trim()).length;
        score += (majorCount / majorPlatforms.length) * 0.5;

        // 其他社交平台 (0.3)
        const otherPlatforms = ['twitter_handle', 'discord_id', 'telegram_handle', 'personal_website', 'blog_url'];
        const otherCount = otherPlatforms.filter(platform => profile[platform] && profile[platform].trim()).length;
        score += Math.min(otherCount * 0.06, 0.3);

        // GitHub质量评估 (0.2)
        if (profile.github_url) {
            score += 0.1; // 基础分
            // 这里可以集成GitHub API来评估仓库质量
            score += 0.1; // 假设的质量分
        }

        return Math.min(score, maxScore);
    }

    /**
     * 计算互动信息权重
     */
    calculateInteractionWeight(profile) {
        let score = 0;
        const maxScore = 1.0;

        // 许愿和分享 (0.3)
        if (profile.wish_content && profile.wish_content.trim()) {
            score += 0.15;
            if (profile.wish_content.length > 100) score += 0.05;
        }
        if (profile.share_reason && profile.share_reason.trim()) {
            score += 0.1;
        }

        // 推荐和社区参与 (0.4)
        if (profile.referral_code) score += 0.1;
        if (profile.community_contribution && profile.community_contribution.trim()) {
            score += 0.15;
            if (profile.community_contribution.length > 200) score += 0.05;
        }
        if (profile.helpful_content && profile.helpful_content.trim()) score += 0.1;

        // 导师和改进建议 (0.3)
        if (profile.mentorship_offer) score += 0.15;
        if (profile.improvement_suggestion && profile.improvement_suggestion.trim()) {
            score += 0.1;
            if (profile.improvement_suggestion.length > 100) score += 0.05;
        }

        return Math.min(score, maxScore);
    }

    /**
     * 计算创意信息权重
     */
    calculateCreativeWeight(profile) {
        let score = 0;
        const maxScore = 1.0;

        // 口号和标签 (0.3)
        if (profile.lottery_slogan && profile.lottery_slogan.trim()) {
            score += 0.15;
            if (profile.lottery_slogan.length > 20) score += 0.05;
        }
        if (profile.personal_tags && profile.personal_tags.length > 0) {
            score += Math.min(profile.personal_tags.length * 0.02, 0.1);
        }

        // 个人理念 (0.4)
        if (profile.motto && profile.motto.trim()) score += 0.1;
        if (profile.favorite_quote && profile.favorite_quote.trim()) score += 0.1;
        if (profile.dream_project && profile.dream_project.trim()) {
            score += 0.1;
            if (profile.dream_project.length > 100) score += 0.1;
        }

        // 创意问答 (0.3)
        if (profile.superpower && profile.superpower.trim()) score += 0.1;
        if (profile.time_travel && profile.time_travel.trim()) score += 0.1;
        if (profile.lucky_number) score += 0.1;

        return Math.min(score, maxScore);
    }

    /**
     * 计算贡献信息权重
     */
    calculateContributionWeight(profile) {
        let score = 0;
        const maxScore = 1.0;

        // 平台贡献度 (0.4)
        const contribution = profile.platform_contribution || 0;
        score += Math.min(contribution / 1000, 0.4); // 假设1000为满分

        // 活跃度等级 (0.3)
        const activityScores = { low: 0.05, medium: 0.15, high: 0.25, very_high: 0.3 };
        score += activityScores[profile.activity_level] || 0;

        // 声誉分数 (0.3)
        const reputation = profile.reputation_score || 0;
        score += Math.min(reputation / 100, 0.3); // 假设100为满分

        return Math.min(score, maxScore);
    }

    /**
     * 计算学习信息权重
     */
    calculateLearningWeight(profile) {
        let score = 0;
        const maxScore = 1.0;

        // 当前学习和完成课程 (0.4)
        const currentLearning = profile.current_learning?.length || 0;
        const completedCourses = profile.completed_courses?.length || 0;
        score += Math.min((currentLearning + completedCourses) * 0.02, 0.4);

        // 学习目标和技能提升 (0.3)
        const learningGoals = profile.learning_goals?.length || 0;
        const skillsToImprove = profile.skills_to_improve?.length || 0;
        score += Math.min((learningGoals + skillsToImprove) * 0.03, 0.3);

        // 知识分享和导师 (0.3)
        if (profile.knowledge_sharing) score += 0.15;
        const mentors = profile.mentors?.length || 0;
        score += Math.min(mentors * 0.05, 0.15);

        return Math.min(score, maxScore);
    }

    /**
     * 计算投资信息权重
     */
    calculateInvestmentWeight(profile) {
        let score = 0;
        const maxScore = 1.0;

        // 风险承受能力和经验 (0.4)
        const riskScores = { conservative: 0.1, moderate: 0.2, aggressive: 0.3, very_aggressive: 0.4 };
        score += riskScores[profile.risk_tolerance] || 0;

        // 投资经验 (0.3)
        const expScores = { beginner: 0.05, intermediate: 0.15, advanced: 0.25, expert: 0.3 };
        score += expScores[profile.investment_experience] || 0;

        // DeFi经验和代币偏好 (0.3)
        if (profile.defi_experience) score += 0.15;
        const favoriteTokens = profile.favorite_tokens?.length || 0;
        score += Math.min(favoriteTokens * 0.03, 0.15);

        return Math.min(score, maxScore);
    }

    /**
     * 计算奖励权重
     */
    calculateBonusWeights(profile, lotteryType) {
        const bonuses = {};

        // 忠诚度奖励
        bonuses.loyaltyBonus = this.calculateLoyaltyBonus(profile);

        // 推荐奖励
        bonuses.referralBonus = this.calculateReferralBonus(profile);

        // 活跃度奖励
        bonuses.activityBonus = this.calculateActivityBonus(profile);

        // 质量奖励
        bonuses.qualityBonus = this.calculateQualityBonus(profile);

        // 完整度奖励
        bonuses.completenessBonus = this.calculateCompletenessBonus(profile);

        return bonuses;
    }

    /**
     * 计算忠诚度奖励
     */
    calculateLoyaltyBonus(profile) {
        // 基于用户注册时间、活跃天数等
        const activityLevel = profile.activity_level || 'low';
        const levelBonus = { low: 0, medium: 0.05, high: 0.1, very_high: 0.15 };
        return (levelBonus[activityLevel] || 0) * this.bonusMultipliers.loyalty;
    }

    /**
     * 计算推荐奖励
     */
    calculateReferralBonus(profile) {
        // 基于推荐码使用情况
        if (profile.referral_code) {
            return 0.5 * this.bonusMultipliers.referral;
        }
        return 0;
    }

    /**
     * 计算活跃度奖励
     */
    calculateActivityBonus(profile) {
        const contribution = profile.platform_contribution || 0;
        const helpfulAnswers = profile.helpful_answers || 0;
        const tutorialsCreated = profile.tutorials_created || 0;
        
        const activityScore = (contribution / 100) + (helpfulAnswers / 10) + (tutorialsCreated / 5);
        return Math.min(activityScore, 1.0) * this.bonusMultipliers.activity;
    }

    /**
     * 计算质量奖励
     */
    calculateQualityBonus(profile) {
        const reputation = profile.reputation_score || 0;
        const qualityScore = Math.min(reputation / 100, 1.0);
        return qualityScore * this.bonusMultipliers.quality;
    }

    /**
     * 计算完整度奖励
     */
    calculateCompletenessBonus(profile) {
        // 计算资料完整度
        const allFields = [
            'nickname', 'bio', 'location', 'occupation',
            'programming_languages', 'tech_level', 'project_experience',
            'github_url', 'portfolio_url',
            'wish_content', 'share_reason',
            'lottery_slogan', 'personal_tags',
            'platform_contribution', 'activity_level'
        ];
        
        const completedFields = allFields.filter(field => {
            const value = profile[field];
            if (Array.isArray(value)) return value.length > 0;
            return value && value.toString().trim();
        }).length;
        
        const completeness = completedFields / allFields.length;
        return completeness * this.bonusMultipliers.completeness;
    }

    /**
     * 获取权重说明
     */
    getWeightExplanation(weights, lotteryType) {
        const explanation = {
            totalWeight: weights.totalWeight,
            baseWeight: weights.baseWeight,
            bonusWeight: weights.bonusWeight,
            lotteryType,
            breakdown: [],
            tips: []
        };

        // 添加各部分权重说明
        const sections = [
            { key: 'basicInfo', name: '基础信息', weight: weights.breakdown.basicInfo },
            { key: 'skillInfo', name: '技能信息', weight: weights.breakdown.skillInfo },
            { key: 'socialInfo', name: '社交信息', weight: weights.breakdown.socialInfo },
            { key: 'interactionInfo', name: '互动信息', weight: weights.breakdown.interactionInfo },
            { key: 'creativeInfo', name: '创意信息', weight: weights.breakdown.creativeInfo },
            { key: 'contributionInfo', name: '贡献信息', weight: weights.breakdown.contributionInfo }
        ];

        sections.forEach(section => {
            if (section.weight > 0) {
                explanation.breakdown.push({
                    section: section.name,
                    weight: section.weight,
                    percentage: Math.round((section.weight / weights.totalWeight) * 100)
                });
            }
        });

        // 添加改进建议
        if (weights.breakdown.basicInfo < 0.1) {
            explanation.tips.push('完善基础信息可以提升权重');
        }
        if (weights.breakdown.skillInfo < 0.15) {
            explanation.tips.push('添加技能信息可以显著提升权重');
        }
        if (weights.breakdown.socialInfo < 0.1) {
            explanation.tips.push('添加GitHub等社交链接可以提升权重');
        }

        return explanation;
    }
}

module.exports = new WeightCalculator();
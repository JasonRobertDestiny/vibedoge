/**
 * 抽奖算法模块 - 实现多种抽奖算法
 * 支持加权随机、技能挑战、创意评选等多种抽奖方式
 */

const crypto = require('crypto');

class LotteryAlgorithm {
    constructor() {
        // 算法配置
        this.algorithms = {
            weighted_random: this.weightedRandomDraw.bind(this),
            skill_challenge: this.skillChallengeDraw.bind(this),
            creative_contest: this.creativeContestDraw.bind(this),
            fair_random: this.fairRandomDraw.bind(this),
            hybrid: this.hybridDraw.bind(this)
        };

        // 防作弊配置
        this.antiCheat = {
            maxSameIPParticipants: 5,
            minAccountAge: 7, // 天
            minActivityScore: 10
        };
    }

    /**
     * 执行抽奖
     * @param {Array} participants - 参与者列表
     * @param {Array} prizes - 奖品列表
     * @param {string} algorithm - 抽奖算法
     * @param {Object} options - 额外选项
     * @returns {Array} 中奖结果
     */
    draw(participants, prizes, algorithm = 'weighted_random', options = {}) {
        try {
            // 验证输入
            if (!participants || participants.length === 0) {
                throw new Error('没有有效的参与者');
            }
            if (!prizes || prizes.length === 0) {
                throw new Error('没有配置奖品');
            }

            // 过滤有效参与者
            const validParticipants = this.filterValidParticipants(participants);
            if (validParticipants.length === 0) {
                throw new Error('没有符合条件的参与者');
            }

            // 生成抽奖种子
            const seed = this.generateSeed(validParticipants, prizes);
            
            // 执行指定算法
            const drawFunction = this.algorithms[algorithm];
            if (!drawFunction) {
                throw new Error(`不支持的抽奖算法: ${algorithm}`);
            }

            const results = drawFunction(validParticipants, prizes, { ...options, seed });
            
            // 验证结果
            this.validateResults(results, prizes);
            
            return results;

        } catch (error) {
            console.error('抽奖执行失败:', error);
            throw error;
        }
    }

    /**
     * 加权随机抽奖
     */
    weightedRandomDraw(participants, prizes, options) {
        const results = [];
        const availableParticipants = [...participants];
        const { seed } = options;
        
        // 按奖品等级排序（从高到低）
        const sortedPrizes = prizes.sort((a, b) => a.rank - b.rank);
        
        for (const prize of sortedPrizes) {
            for (let i = 0; i < prize.quantity; i++) {
                if (availableParticipants.length === 0) break;
                
                // 计算累积权重
                const totalWeight = availableParticipants.reduce((sum, p) => sum + p.total_weight, 0);
                
                // 生成随机数
                const random = this.seededRandom(seed + results.length) * totalWeight;
                
                // 选择中奖者
                let currentWeight = 0;
                let winner = null;
                let winnerIndex = -1;
                
                for (let j = 0; j < availableParticipants.length; j++) {
                    currentWeight += availableParticipants[j].total_weight;
                    if (random <= currentWeight) {
                        winner = availableParticipants[j];
                        winnerIndex = j;
                        break;
                    }
                }
                
                if (winner) {
                    results.push({
                        participationId: winner.id,
                        userId: winner.user_id,
                        prizeId: prize.id,
                        winningNumber: this.generateWinningNumber(seed, results.length),
                        algorithm: 'weighted_random',
                        weight: winner.total_weight,
                        seed: seed + results.length
                    });
                    
                    // 移除已中奖者（如果不允许重复中奖）
                    if (!options.allowMultipleWins) {
                        availableParticipants.splice(winnerIndex, 1);
                    }
                }
            }
        }
        
        return results;
    }

    /**
     * 技能挑战抽奖
     */
    skillChallengeDraw(participants, prizes, options) {
        const results = [];
        const { seed } = options;
        
        // 按技能分数排序
        const skillSortedParticipants = participants
            .filter(p => p.skill_challenge_answer)
            .map(p => ({
                ...p,
                skillScore: this.evaluateSkillAnswer(p.skill_challenge_answer)
            }))
            .sort((a, b) => b.skillScore - a.skillScore);
        
        if (skillSortedParticipants.length === 0) {
            // 如果没有技能挑战答案，回退到加权随机
            return this.weightedRandomDraw(participants, prizes, options);
        }
        
        // 技能分数权重 + 原有权重的混合
        const hybridParticipants = skillSortedParticipants.map(p => ({
            ...p,
            total_weight: p.total_weight * 0.3 + p.skillScore * 0.7
        }));
        
        return this.weightedRandomDraw(hybridParticipants, prizes, options);
    }

    /**
     * 创意评选抽奖
     */
    creativeContestDraw(participants, prizes, options) {
        const results = [];
        const { seed } = options;
        
        // 按创意分数排序
        const creativeSortedParticipants = participants
            .filter(p => p.creative_submission)
            .map(p => ({
                ...p,
                creativeScore: this.evaluateCreativeSubmission(p.creative_submission)
            }))
            .sort((a, b) => b.creativeScore - a.creativeScore);
        
        if (creativeSortedParticipants.length === 0) {
            // 如果没有创意提交，回退到加权随机
            return this.weightedRandomDraw(participants, prizes, options);
        }
        
        // 创意分数权重 + 原有权重的混合
        const hybridParticipants = creativeSortedParticipants.map(p => ({
            ...p,
            total_weight: p.total_weight * 0.2 + p.creativeScore * 0.8
        }));
        
        return this.weightedRandomDraw(hybridParticipants, prizes, options);
    }

    /**
     * 公平随机抽奖（忽略权重）
     */
    fairRandomDraw(participants, prizes, options) {
        const results = [];
        const availableParticipants = [...participants];
        const { seed } = options;
        
        // 所有参与者权重设为1
        const equalWeightParticipants = availableParticipants.map(p => ({
            ...p,
            total_weight: 1.0
        }));
        
        return this.weightedRandomDraw(equalWeightParticipants, prizes, options);
    }

    /**
     * 混合抽奖算法
     */
    hybridDraw(participants, prizes, options) {
        const results = [];
        const { seed } = options;
        
        // 将奖品分为不同类型
        const topPrizes = prizes.filter(p => p.rank <= 3); // 前三名奖品
        const regularPrizes = prizes.filter(p => p.rank > 3);
        
        // 顶级奖品使用技能+创意评选
        if (topPrizes.length > 0) {
            const topResults = this.skillChallengeDraw(participants, topPrizes, options);
            results.push(...topResults);
            
            // 移除已中奖者
            const winnerIds = topResults.map(r => r.userId);
            const remainingParticipants = participants.filter(p => !winnerIds.includes(p.user_id));
            
            // 普通奖品使用加权随机
            if (regularPrizes.length > 0 && remainingParticipants.length > 0) {
                const regularResults = this.weightedRandomDraw(remainingParticipants, regularPrizes, {
                    ...options,
                    seed: seed + results.length
                });
                results.push(...regularResults);
            }
        } else {
            // 如果没有顶级奖品，全部使用加权随机
            return this.weightedRandomDraw(participants, prizes, options);
        }
        
        return results;
    }

    /**
     * 过滤有效参与者
     */
    filterValidParticipants(participants) {
        return participants.filter(participant => {
            // 检查基本状态
            if (participant.status !== 'active') {
                return false;
            }
            
            // 检查权重
            if (!participant.total_weight || participant.total_weight <= 0) {
                return false;
            }
            
            // 防作弊检查
            if (!this.passAntiCheatCheck(participant)) {
                return false;
            }
            
            return true;
        });
    }

    /**
     * 防作弊检查
     */
    passAntiCheatCheck(participant) {
        // 这里可以添加更多的防作弊逻辑
        // 例如：检查IP地址、账户年龄、活跃度等
        
        // 检查活跃度分数
        const activityScore = participant.platform_contribution || 0;
        if (activityScore < this.antiCheat.minActivityScore) {
            return false;
        }
        
        return true;
    }

    /**
     * 评估技能挑战答案
     */
    evaluateSkillAnswer(answer) {
        if (!answer || typeof answer !== 'string') {
            return 0;
        }
        
        let score = 0;
        
        // 基础分数（答案长度）
        score += Math.min(answer.length / 100, 0.3);
        
        // 关键词检查
        const techKeywords = [
            'algorithm', 'data structure', 'optimization', 'performance',
            'scalability', 'security', 'testing', 'debugging',
            'react', 'vue', 'node', 'python', 'javascript', 'typescript'
        ];
        
        const foundKeywords = techKeywords.filter(keyword => 
            answer.toLowerCase().includes(keyword)
        ).length;
        
        score += Math.min(foundKeywords * 0.1, 0.4);
        
        // 代码片段检查
        if (answer.includes('```') || answer.includes('function') || answer.includes('class')) {
            score += 0.2;
        }
        
        // 详细程度检查
        if (answer.length > 500) {
            score += 0.1;
        }
        
        return Math.min(score, 1.0);
    }

    /**
     * 评估创意提交
     */
    evaluateCreativeSubmission(submission) {
        if (!submission || typeof submission !== 'string') {
            return 0;
        }
        
        let score = 0;
        
        // 基础分数（创意长度）
        score += Math.min(submission.length / 200, 0.2);
        
        // 创意关键词
        const creativeKeywords = [
            'innovative', 'unique', 'creative', 'original', 'inspiring',
            'future', 'vision', 'dream', 'imagine', 'breakthrough'
        ];
        
        const foundCreativeWords = creativeKeywords.filter(keyword => 
            submission.toLowerCase().includes(keyword)
        ).length;
        
        score += Math.min(foundCreativeWords * 0.1, 0.3);
        
        // 表情符号和特殊字符（增加趣味性）
        const emojiCount = (submission.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []).length;
        score += Math.min(emojiCount * 0.05, 0.2);
        
        // 结构化内容（列表、段落等）
        if (submission.includes('\n') || submission.includes('•') || submission.includes('-')) {
            score += 0.1;
        }
        
        // 个人故事或经历
        const personalWords = ['my', 'i', 'me', 'experience', 'journey', 'story'];
        const personalCount = personalWords.filter(word => 
            submission.toLowerCase().includes(word)
        ).length;
        
        score += Math.min(personalCount * 0.05, 0.2);
        
        return Math.min(score, 1.0);
    }

    /**
     * 生成抽奖种子
     */
    generateSeed(participants, prizes) {
        const participantIds = participants.map(p => p.id).sort().join(',');
        const prizeIds = prizes.map(p => p.id).sort().join(',');
        const timestamp = Date.now();
        
        const seedString = `${participantIds}-${prizeIds}-${timestamp}`;
        const hash = crypto.createHash('sha256').update(seedString).digest('hex');
        
        // 转换为数字种子
        return parseInt(hash.substring(0, 8), 16);
    }

    /**
     * 基于种子的随机数生成器
     */
    seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    /**
     * 生成中奖号码
     */
    generateWinningNumber(seed, index) {
        const combinedSeed = seed + index * 1000;
        const hash = crypto.createHash('md5')
            .update(combinedSeed.toString())
            .digest('hex');
        return `WIN-${hash.substring(0, 8).toUpperCase()}`;
    }

    /**
     * 验证抽奖结果
     */
    validateResults(results, prizes) {
        // 检查奖品数量是否超出限制
        const prizeCount = {};
        
        for (const result of results) {
            const prizeId = result.prizeId;
            prizeCount[prizeId] = (prizeCount[prizeId] || 0) + 1;
        }
        
        for (const prize of prizes) {
            const awarded = prizeCount[prize.id] || 0;
            if (awarded > prize.quantity) {
                throw new Error(`奖品 ${prize.name} 分配数量超出限制`);
            }
        }
        
        // 检查是否有重复中奖者（如果不允许）
        const userIds = results.map(r => r.userId);
        const uniqueUserIds = [...new Set(userIds)];
        
        if (userIds.length !== uniqueUserIds.length) {
            console.warn('检测到重复中奖者');
        }
    }

    /**
     * 获取算法统计信息
     */
    getAlgorithmStats(participants, algorithm) {
        const stats = {
            algorithm,
            totalParticipants: participants.length,
            validParticipants: this.filterValidParticipants(participants).length,
            weightDistribution: {},
            averageWeight: 0,
            maxWeight: 0,
            minWeight: Infinity
        };
        
        const validParticipants = this.filterValidParticipants(participants);
        
        if (validParticipants.length > 0) {
            const weights = validParticipants.map(p => p.total_weight);
            stats.averageWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;
            stats.maxWeight = Math.max(...weights);
            stats.minWeight = Math.min(...weights);
            
            // 权重分布
            const ranges = [
                { min: 0, max: 1, label: '0-1' },
                { min: 1, max: 2, label: '1-2' },
                { min: 2, max: 3, label: '2-3' },
                { min: 3, max: Infinity, label: '3+' }
            ];
            
            ranges.forEach(range => {
                const count = weights.filter(w => w >= range.min && w < range.max).length;
                stats.weightDistribution[range.label] = {
                    count,
                    percentage: Math.round((count / weights.length) * 100)
                };
            });
        }
        
        return stats;
    }

    /**
     * 模拟抽奖（用于测试）
     */
    simulateDraw(participants, prizes, algorithm, iterations = 1000) {
        const simulation = {
            algorithm,
            iterations,
            results: {},
            fairnessScore: 0
        };
        
        const userWinCounts = {};
        
        for (let i = 0; i < iterations; i++) {
            try {
                const results = this.draw(participants, prizes, algorithm, {
                    seed: i * 12345 // 不同的种子
                });
                
                results.forEach(result => {
                    const userId = result.userId;
                    userWinCounts[userId] = (userWinCounts[userId] || 0) + 1;
                });
            } catch (error) {
                console.warn(`模拟第${i}次抽奖失败:`, error.message);
            }
        }
        
        // 计算公平性分数
        const winCounts = Object.values(userWinCounts);
        if (winCounts.length > 0) {
            const avgWins = winCounts.reduce((sum, count) => sum + count, 0) / winCounts.length;
            const variance = winCounts.reduce((sum, count) => sum + Math.pow(count - avgWins, 2), 0) / winCounts.length;
            simulation.fairnessScore = Math.max(0, 100 - Math.sqrt(variance) * 10);
        }
        
        simulation.results = userWinCounts;
        return simulation;
    }
}

module.exports = new LotteryAlgorithm();
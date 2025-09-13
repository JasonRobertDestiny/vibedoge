const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const weightCalculator = require('../utils/weightCalculator');
const lotteryAlgorithm = require('../utils/lotteryAlgorithm');

// 初始化Supabase客户端
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

class LotteryController {
    // 上传用户资料
    async uploadUserProfile(req, res) {
        try {
            const { userId, basicInfo, skillInfo, socialInfo, interactionInfo, creativeInfo, contributionInfo, learningInfo, investmentInfo } = req.body;
            
            // 验证用户权限
            if (req.user.id !== userId) {
                return res.status(403).json({
                    success: false,
                    error: {
                        code: 'FORBIDDEN',
                        message: '无权限修改其他用户Vibe Coding抽奖资料'
                    }
                });
            }

            // 准备数据
            const profileData = {
                user_id: userId,
                // 基础信息
                nickname: basicInfo?.nickname,
                avatar_url: basicInfo?.avatar,
                bio: basicInfo?.bio,
                location: basicInfo?.location,
                birth_year: basicInfo?.birthYear,
                gender: basicInfo?.gender,
                occupation: basicInfo?.occupation,
                interests: basicInfo?.interests || [],
                
                // 技能信息
                programming_languages: skillInfo?.programmingLanguages || [],
                tech_level: skillInfo?.techLevel,
                project_experience: skillInfo?.projectExperience,
                specialties: skillInfo?.specialties || [],
                certifications: skillInfo?.certifications || [],
                years_of_experience: skillInfo?.yearsOfExperience,
                frameworks: skillInfo?.frameworks || [],
                tools: skillInfo?.tools || [],
                
                // 社交信息
                github_url: socialInfo?.githubUrl,
                portfolio_url: socialInfo?.portfolioUrl,
                linkedin_url: socialInfo?.linkedinUrl,
                twitter_handle: socialInfo?.twitterHandle,
                discord_id: socialInfo?.discordId,
                telegram_handle: socialInfo?.telegramHandle,
                personal_website: socialInfo?.personalWebsite,
                blog_url: socialInfo?.blogUrl,
                
                // 互动信息
                wish_content: interactionInfo?.wishContent,
                share_reason: interactionInfo?.shareReason,
                referral_code: interactionInfo?.referralCode,
                favorite_feature: interactionInfo?.favoriteFeature,
                improvement_suggestion: interactionInfo?.improvementSuggestion,
                community_contribution: interactionInfo?.communityContribution,
                helpful_content: interactionInfo?.helpfulContent,
                mentorship_offer: interactionInfo?.mentorshipOffer || false,
                
                // 创意信息
                lottery_slogan: creativeInfo?.lotterySlogan,
                lucky_number: creativeInfo?.luckyNumber,
                personal_tags: creativeInfo?.personalTags || [],
                motto: creativeInfo?.motto,
                favorite_quote: creativeInfo?.favoriteQuote,
                dream_project: creativeInfo?.dreamProject,
                superpower: creativeInfo?.superpower,
                time_travel: creativeInfo?.timeTravel,
                
                // 贡献信息
                platform_contribution: contributionInfo?.platformContribution || 0,
                activity_level: contributionInfo?.activityLevel || 'low',
                reputation_score: contributionInfo?.reputationScore || 0,
                community_role: contributionInfo?.communityRole,
                helpful_answers: contributionInfo?.helpfulAnswers || 0,
                tutorials_created: contributionInfo?.tutorialsCreated || 0,
                bugs_reported: contributionInfo?.bugsReported || 0,
                feature_requests: contributionInfo?.featureRequests || 0,
                
                // 学习信息
                current_learning: learningInfo?.currentLearning || [],
                completed_courses: learningInfo?.completedCourses || [],
                reading_list: learningInfo?.readingList || [],
                learning_goals: learningInfo?.learningGoals || [],
                skills_to_improve: learningInfo?.skillsToImprove || [],
                mentors: learningInfo?.mentors || [],
                learning_style: learningInfo?.learningStyle,
                knowledge_sharing: learningInfo?.knowledgeSharing || false,
                
                // 投资信息
                risk_tolerance: investmentInfo?.riskTolerance,
                investment_experience: investmentInfo?.investmentExperience,
                favorite_tokens: investmentInfo?.favoriteTokens || [],
                trading_strategy: investmentInfo?.tradingStrategy,
                portfolio_size: investmentInfo?.portfolioSize,
                investment_goals: investmentInfo?.investmentGoals || [],
                market_analysis: investmentInfo?.marketAnalysis,
                defi_experience: investmentInfo?.defiExperience || false
            };

            // 使用upsert插入或更新数据
            const { data, error } = await supabase
                .from('user_profiles')
                .upsert(profileData, { onConflict: 'user_id' })
                .select('id, completeness_score, quality_score, bonus_weight')
                .single();

            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({
                    success: false,
                    error: {
                        code: 'DATABASE_ERROR',
                        message: '数据库操作失败',
                        details: error.message
                    }
                });
            }

            res.json({
                success: true,
                message: 'Vibe Coding抽奖用户信息上传成功',
                data: {
                    profileId: data.id,
                    completeness: data.completeness_score,
                    bonusWeight: data.bonus_weight
                }
            });

        } catch (error) {
            console.error('Upload profile error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: '服务器内部错误',
                    details: error.message
                }
            });
        }
    }

    // 参与抽奖
    async participateInLottery(req, res) {
        try {
            const { userId, lotteryId, participationType, additionalData } = req.body;
            
            // 验证用户权限
            if (req.user.id !== userId) {
                return res.status(403).json({
                    success: false,
                    error: {
                        code: 'FORBIDDEN',
                        message: '无权限代替其他用户参与Vibe Coding抽奖'
                    }
                });
            }

            // 检查抽奖活动是否存在且可参与
            const { data: lottery, error: lotteryError } = await supabase
                .from('lottery_activities')
                .select('*')
                .eq('id', lotteryId)
                .single();

            if (lotteryError || !lottery) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'LOTTERY_NOT_FOUND',
                        message: 'Vibe Coding抽奖活动不存在'
                    }
                });
            }

            if (lottery.status !== 'active') {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'LOTTERY_NOT_ACTIVE',
                        message: 'Vibe Coding抽奖活动未开始或已结束'
                    }
                });
            }

            // 检查是否已经参与
            const { data: existingParticipation } = await supabase
                .from('lottery_participations')
                .select('id')
                .eq('lottery_id', lotteryId)
                .eq('user_id', userId)
                .single();

            if (existingParticipation) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'ALREADY_PARTICIPATED',
                        message: '您已经参与了此次Vibe Coding抽奖'
                    }
                });
            }

            // 获取用户资料计算权重
            const { data: userProfile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            const weights = weightCalculator.calculateWeight(userProfile, participationType);
            
            // 生成票号
            const ticketNumber = this.generateTicketNumber(lotteryId, userId);

            // 插入参与记录
            const participationData = {
                lottery_id: lotteryId,
                user_id: userId,
                participation_type: participationType,
                ticket_number: ticketNumber,
                base_weight: weights.baseWeight,
                bonus_weight: weights.bonusWeight,
                total_weight: weights.totalWeight,
                skill_challenge_answer: additionalData?.skillChallenge,
                creative_submission: additionalData?.creativeSubmission,
                additional_data: additionalData || {}
            };

            const { data: participation, error: participationError } = await supabase
                .from('lottery_participations')
                .insert(participationData)
                .select('id, ticket_number, total_weight')
                .single();

            if (participationError) {
                console.error('Participation error:', participationError);
                return res.status(500).json({
                    success: false,
                    error: {
                        code: 'PARTICIPATION_FAILED',
                        message: '参与Vibe Coding抽奖失败',
                        details: participationError.message
                    }
                });
            }

            // 记录权重计算日志
            await this.logWeightCalculation(participation.id, userId, weights);

            res.json({
                success: true,
                message: '参与Vibe Coding抽奖成功',
                data: {
                    participationId: participation.id,
                    ticketNumber: participation.ticket_number,
                    winningProbability: this.calculateWinningProbability(weights.totalWeight)
                }
            });

        } catch (error) {
            console.error('Participate error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: '服务器内部错误',
                    details: error.message
                }
            });
        }
    }

    // 获取抽奖结果
    async getLotteryResult(req, res) {
        try {
            const { lotteryId } = req.params;

            // 获取抽奖活动信息
            const { data: lottery, error: lotteryError } = await supabase
                .from('lottery_activities')
                .select('*')
                .eq('id', lotteryId)
                .single();

            if (lotteryError || !lottery) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'LOTTERY_NOT_FOUND',
                        message: 'Vibe Coding抽奖活动不存在'
                    }
                });
            }

            // 获取中奖结果
            const { data: results, error: resultsError } = await supabase
                .from('lottery_results')
                .select(`
                    *,
                    lottery_prizes(name, description, value, currency),
                    user_profiles(nickname)
                `)
                .eq('lottery_id', lotteryId)
                .order('drawn_at', { ascending: true });

            if (resultsError) {
                console.error('Results error:', resultsError);
                return res.status(500).json({
                    success: false,
                    error: {
                        code: 'DATABASE_ERROR',
                        message: '获取结果失败'
                    }
                });
            }

            // 获取参与统计
            const { data: stats } = await supabase
                .from('lottery_statistics')
                .select('total_participants')
                .eq('lottery_id', lotteryId)
                .single();

            const winners = results.map(result => ({
                userId: result.user_id,
                nickname: result.user_profiles?.nickname || '匿名用户',
                prize: result.lottery_prizes?.name,
                prizeValue: result.lottery_prizes?.value,
                currency: result.lottery_prizes?.currency,
                winningTime: result.drawn_at
            }));

            res.json({
                success: true,
                data: {
                    lotteryId: lottery.id,
                    status: lottery.status,
                    winners,
                    totalParticipants: stats?.total_participants || 0,
                    drawTime: lottery.draw_time
                }
            });

        } catch (error) {
            console.error('Get result error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: '服务器内部错误',
                    details: error.message
                }
            });
        }
    }

    // 获取用户抽奖历史
    async getUserLotteryHistory(req, res) {
        try {
            const { userId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            // 验证用户权限
            if (req.user.id !== userId) {
                return res.status(403).json({
                    success: false,
                    error: {
                        code: 'FORBIDDEN',
                        message: '无权限查看其他用户Vibe Coding抽奖历史'
                    }
                });
            }

            // 获取用户汇总信息
            const { data: summary } = await supabase
                .from('user_lottery_summary')
                .select('*')
                .eq('user_id', userId)
                .single();

            // 获取参与历史
            const { data: history, error: historyError } = await supabase
                .from('lottery_participations')
                .select(`
                    *,
                    lottery_activities(id, name, type, status),
                    lottery_results(prize_id, lottery_prizes(name, value, currency))
                `)
                .eq('user_id', userId)
                .order('participated_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (historyError) {
                console.error('History error:', historyError);
                return res.status(500).json({
                    success: false,
                    error: {
                        code: 'DATABASE_ERROR',
                        message: '获取历史记录失败'
                    }
                });
            }

            const formattedHistory = history.map(record => ({
                lotteryId: record.lottery_activities?.id,
                lotteryName: record.lottery_activities?.name,
                participationTime: record.participated_at,
                result: record.lottery_results ? 'won' : 
                       (record.lottery_activities?.status === 'completed' ? 'lost' : 'pending'),
                prize: record.lottery_results?.lottery_prizes?.name || null,
                prizeValue: record.lottery_results?.lottery_prizes?.value || null
            }));

            res.json({
                success: true,
                data: {
                    totalParticipations: summary?.total_participations || 0,
                    totalWins: summary?.total_wins || 0,
                    winRate: summary?.win_rate || 0,
                    history: formattedHistory
                }
            });

        } catch (error) {
            console.error('Get history error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: '服务器内部错误',
                    details: error.message
                }
            });
        }
    }

    // 获取抽奖活动列表
    async getLotteryActivities(req, res) {
        try {
            const { status, type, page = 1, limit = 20 } = req.query;
            const offset = (parseInt(page) - 1) * parseInt(limit);

            let query = supabase
                .from('lottery_activities')
                .select(`
                    *,
                    lottery_prizes(name, value, currency, quantity),
                    lottery_statistics(total_participants)
                `);

            if (status) {
                query = query.eq('status', status);
            }
            if (type) {
                query = query.eq('type', type);
            }

            const { data: activities, error } = await query
                .order('created_at', { ascending: false })
                .range(offset, offset + parseInt(limit) - 1);

            if (error) {
                console.error('Activities error:', error);
                return res.status(500).json({
                    success: false,
                    error: {
                        code: 'DATABASE_ERROR',
                        message: '获取活动列表失败'
                    }
                });
            }

            const formattedActivities = activities.map(activity => ({
                lotteryId: activity.id,
                name: activity.name,
                description: activity.description,
                type: activity.type,
                startTime: activity.start_time,
                endTime: activity.end_time,
                prizes: activity.lottery_prizes.map(prize => ({
                    name: prize.name,
                    value: `${prize.value} ${prize.currency}`,
                    quantity: prize.quantity
                })),
                participantCount: activity.lottery_statistics?.[0]?.total_participants || 0,
                maxParticipants: activity.max_participants,
                status: activity.status
            }));

            res.json({
                success: true,
                data: formattedActivities
            });

        } catch (error) {
            console.error('Get activities error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: '服务器内部错误',
                    details: error.message
                }
            });
        }
    }

    // 获取抽奖统计
    async getLotteryStats(req, res) {
        try {
            const { lotteryId } = req.params;

            const { data: stats, error } = await supabase
                .from('lottery_statistics')
                .select('*')
                .eq('lottery_id', lotteryId)
                .single();

            if (error) {
                console.error('Stats error:', error);
                return res.status(500).json({
                    success: false,
                    error: {
                        code: 'DATABASE_ERROR',
                        message: '获取统计信息失败'
                    }
                });
            }

            res.json({
                success: true,
                data: {
                    lotteryId: stats.lottery_id,
                    currentParticipants: stats.total_participants,
                    topContributors: stats.top_contributors || [],
                    skillDistribution: stats.skill_distribution || {},
                    popularTags: stats.popular_tags || []
                }
            });

        } catch (error) {
            console.error('Get stats error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: '服务器内部错误',
                    details: error.message
                }
            });
        }
    }

    // 执行抽奖
    async drawLottery(req, res) {
        try {
            const { lotteryId } = req.params;
            const { algorithm = 'weighted_random' } = req.body;

            // 检查抽奖活动状态
            const { data: lottery, error: lotteryError } = await supabase
                .from('lottery_activities')
                .select('*')
                .eq('id', lotteryId)
                .single();

            if (lotteryError || !lottery) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'LOTTERY_NOT_FOUND',
                        message: '抽奖活动不存在'
                    }
                });
            }

            if (lottery.status !== 'active') {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'LOTTERY_NOT_READY',
                        message: '抽奖活动未准备好进行抽奖'
                    }
                });
            }

            // 获取所有参与者
            const { data: participants, error: participantsError } = await supabase
                .from('lottery_participations')
                .select('*')
                .eq('lottery_id', lotteryId)
                .eq('status', 'active');

            if (participantsError || !participants.length) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'NO_PARTICIPANTS',
                        message: '没有有效的参与者'
                    }
                });
            }

            // 获取奖品信息
            const { data: prizes, error: prizesError } = await supabase
                .from('lottery_prizes')
                .select('*')
                .eq('lottery_id', lotteryId)
                .order('rank', { ascending: true });

            if (prizesError || !prizes.length) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'NO_PRIZES',
                        message: '没有配置奖品'
                    }
                });
            }

            // 执行抽奖算法
            const winners = lotteryAlgorithm.draw(participants, prizes, algorithm);

            // 保存抽奖结果
            const results = [];
            for (const winner of winners) {
                const resultData = {
                    lottery_id: lotteryId,
                    participation_id: winner.participationId,
                    prize_id: winner.prizeId,
                    user_id: winner.userId,
                    winning_number: winner.winningNumber,
                    draw_algorithm: algorithm,
                    draw_seed: winner.seed
                };

                const { data: result, error: resultError } = await supabase
                    .from('lottery_results')
                    .insert(resultData)
                    .select('*')
                    .single();

                if (!resultError) {
                    results.push(result);
                }
            }

            // 更新抽奖活动状态
            await supabase
                .from('lottery_activities')
                .update({
                    status: 'completed',
                    draw_time: new Date().toISOString()
                })
                .eq('id', lotteryId);

            res.json({
                success: true,
                message: '抽奖完成',
                data: {
                    lotteryId,
                    winnersCount: results.length,
                    algorithm,
                    drawTime: new Date().toISOString()
                }
            });

        } catch (error) {
            console.error('Draw lottery error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: '抽奖执行失败',
                    details: error.message
                }
            });
        }
    }

    // 创建抽奖活动
    async createLotteryActivity(req, res) {
        try {
            const { name, description, type, startTime, endTime, maxParticipants, prizes } = req.body;

            // 创建抽奖活动
            const activityData = {
                name,
                description,
                type,
                start_time: startTime,
                end_time: endTime,
                max_participants: maxParticipants,
                created_by: req.user.id,
                status: new Date(startTime) > new Date() ? 'upcoming' : 'active'
            };

            const { data: activity, error: activityError } = await supabase
                .from('lottery_activities')
                .insert(activityData)
                .select('*')
                .single();

            if (activityError) {
                console.error('Create activity error:', activityError);
                return res.status(500).json({
                    success: false,
                    error: {
                        code: 'CREATE_FAILED',
                        message: '创建抽奖活动失败',
                        details: activityError.message
                    }
                });
            }

            // 创建奖品
            if (prizes && prizes.length > 0) {
                const prizeData = prizes.map((prize, index) => ({
                    lottery_id: activity.id,
                    name: prize.name,
                    description: prize.description,
                    value: prize.value,
                    currency: prize.currency || 'USD',
                    quantity: prize.quantity || 1,
                    prize_type: prize.type || 'token',
                    image_url: prize.imageUrl,
                    rank: index + 1
                }));

                await supabase
                    .from('lottery_prizes')
                    .insert(prizeData);
            }

            // 初始化统计记录
            await supabase
                .from('lottery_statistics')
                .insert({
                    lottery_id: activity.id,
                    total_participants: 0,
                    total_tickets: 0
                });

            res.json({
                success: true,
                message: '抽奖活动创建成功',
                data: {
                    lotteryId: activity.id,
                    name: activity.name,
                    status: activity.status
                }
            });

        } catch (error) {
            console.error('Create lottery error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: '服务器内部错误',
                    details: error.message
                }
            });
        }
    }

    // 获取用户资料完整度
    async getProfileCompleteness(req, res) {
        try {
            const { userId } = req.params;

            const { data: profile, error } = await supabase
                .from('user_profiles')
                .select('completeness_score, quality_score, bonus_weight')
                .eq('user_id', userId)
                .single();

            if (error) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'PROFILE_NOT_FOUND',
                        message: '用户资料不存在'
                    }
                });
            }

            res.json({
                success: true,
                data: {
                    completeness: profile.completeness_score,
                    quality: profile.quality_score,
                    bonusWeight: profile.bonus_weight
                }
            });

        } catch (error) {
            console.error('Get completeness error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: '服务器内部错误',
                    details: error.message
                }
            });
        }
    }

    // 获取权重详情
    async getWeightDetails(req, res) {
        try {
            const { userId, lotteryId } = req.params;

            const { data: weightLog, error } = await supabase
                .from('lottery_weight_logs')
                .select('*')
                .eq('user_id', userId)
                .eq('participation_id', lotteryId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'WEIGHT_LOG_NOT_FOUND',
                        message: '权重记录不存在'
                    }
                });
            }

            res.json({
                success: true,
                data: {
                    basicInfoWeight: weightLog.basic_info_weight,
                    skillInfoWeight: weightLog.skill_info_weight,
                    socialInfoWeight: weightLog.social_info_weight,
                    interactionWeight: weightLog.interaction_weight,
                    creativeWeight: weightLog.creative_weight,
                    contributionWeight: weightLog.contribution_weight,
                    learningWeight: weightLog.learning_weight,
                    investmentWeight: weightLog.investment_weight,
                    loyaltyBonus: weightLog.loyalty_bonus,
                    referralBonus: weightLog.referral_bonus,
                    activityBonus: weightLog.activity_bonus,
                    totalWeight: weightLog.total_weight
                }
            });

        } catch (error) {
            console.error('Get weight details error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: '服务器内部错误',
                    details: error.message
                }
            });
        }
    }

    // 辅助方法：生成票号
    generateTicketNumber(lotteryId, userId) {
        const timestamp = Date.now();
        const hash = crypto.createHash('md5')
            .update(`${lotteryId}-${userId}-${timestamp}`)
            .digest('hex');
        return `TICKET-${hash.substring(0, 8).toUpperCase()}`;
    }

    // 辅助方法：计算中奖概率
    calculateWinningProbability(weight) {
        // 简化的概率计算，实际应该基于所有参与者的权重
        const baseProb = 0.1; // 10%基础概率
        const weightBonus = (weight - 1.0) * 0.05; // 权重加成
        return Math.min(baseProb + weightBonus, 0.5); // 最高50%
    }

    // 辅助方法：记录权重计算日志
    async logWeightCalculation(participationId, userId, weights) {
        try {
            const logData = {
                participation_id: participationId,
                user_id: userId,
                basic_info_weight: weights.basicInfoWeight || 0,
                skill_info_weight: weights.skillInfoWeight || 0,
                social_info_weight: weights.socialInfoWeight || 0,
                interaction_weight: weights.interactionWeight || 0,
                creative_weight: weights.creativeWeight || 0,
                contribution_weight: weights.contributionWeight || 0,
                learning_weight: weights.learningWeight || 0,
                investment_weight: weights.investmentWeight || 0,
                loyalty_bonus: weights.loyaltyBonus || 0,
                referral_bonus: weights.referralBonus || 0,
                activity_bonus: weights.activityBonus || 0,
                total_weight: weights.totalWeight,
                calculation_version: '1.0'
            };

            await supabase
                .from('lottery_weight_logs')
                .insert(logData);
        } catch (error) {
            console.error('Log weight calculation error:', error);
        }
    }
}

module.exports = new LotteryController();
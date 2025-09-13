-- VibeDoge抽奖系统 - 数据库视图和统计汇总

-- 1. 抽奖汇总视图
CREATE OR REPLACE VIEW lottery_summary AS
SELECT 
    lr.id,
    lr.lottery_id,
    lr.status,
    lr.prize_name,
    lr.prize_value,
    lr.prize_rarity,
    lr.created_at,
    lr.updated_at,
    u.mcp_user_id,
    u.username,
    u.avatar_url
FROM lottery_records lr
JOIN users u ON lr.user_id = u.id
ORDER BY lr.created_at DESC;

-- 2. 用户统计视图
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    u.id,
    u.mcp_user_id,
    u.username,
    u.created_at,
    COUNT(lr.id) as total_lotteries,
    COUNT(CASE WHEN lr.status = 'completed' THEN 1 END) as completed_lotteries,
    COUNT(CASE WHEN lr.status = 'active' THEN 1 END) as active_lotteries,
    MAX(lr.created_at) as last_lottery_date,
    COUNT(CASE WHEN lr.prize_rarity = 'legendary' THEN 1 END) as legendary_prizes,
    COUNT(CASE WHEN lr.prize_rarity = 'epic' THEN 1 END) as epic_prizes,
    COUNT(CASE WHEN lr.prize_rarity = 'rare' THEN 1 END) as rare_prizes,
    COUNT(CASE WHEN lr.prize_rarity = 'common' THEN 1 END) as common_prizes
FROM users u
LEFT JOIN lottery_records lr ON u.id = lr.user_id
GROUP BY u.id, u.mcp_user_id, u.username, u.created_at;

-- 3. 奖品统计视图
CREATE OR REPLACE VIEW prize_statistics AS
SELECT 
    lr.prize_name,
    lr.prize_value,
    lr.prize_rarity,
    COUNT(lr.id) as total_count,
    ROUND(COUNT(lr.id) * 100.0 / SUM(COUNT(lr.id)) OVER (), 2) as percentage,
    MIN(lr.created_at) as first_win,
    MAX(lr.created_at) as last_win
FROM lottery_records lr
WHERE lr.status = 'completed' AND lr.prize_name IS NOT NULL
GROUP BY lr.prize_name, lr.prize_value, lr.prize_rarity
ORDER BY 
    CASE lr.prize_rarity
        WHEN 'legendary' THEN 1
        WHEN 'epic' THEN 2
        WHEN 'rare' THEN 3
        WHEN 'common' THEN 4
        ELSE 5
    END;

-- 4. 每日统计视图
CREATE OR REPLACE VIEW daily_statistics AS
SELECT 
    DATE(lr.created_at) as date,
    COUNT(lr.id) as total_lotteries,
    COUNT(CASE WHEN lr.status = 'completed' THEN 1 END) as completed_lotteries,
    COUNT(DISTINCT lr.user_id) as unique_users,
    COUNT(CASE WHEN lr.prize_rarity = 'legendary' THEN 1 END) as legendary_wins,
    COUNT(CASE WHEN lr.prize_rarity = 'epic' THEN 1 END) as epic_wins,
    COUNT(CASE WHEN lr.prize_rarity = 'rare' THEN 1 END) as rare_wins,
    COUNT(CASE WHEN lr.prize_rarity = 'common' THEN 1 END) as common_wins
FROM lottery_records lr
GROUP BY DATE(lr.created_at)
ORDER BY date DESC;

-- 5. 排行榜视图
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
    u.mcp_user_id,
    u.username,
    u.avatar_url,
    COUNT(lr.id) as total_participations,
    COUNT(CASE WHEN lr.status = 'completed' THEN 1 END) as total_wins,
    COUNT(CASE WHEN lr.prize_rarity = 'legendary' THEN 1 END) as legendary_count,
    COUNT(CASE WHEN lr.prize_rarity = 'epic' THEN 1 END) as epic_count,
    COUNT(CASE WHEN lr.prize_rarity = 'rare' THEN 1 END) as rare_count,
    COUNT(CASE WHEN lr.prize_rarity = 'common' THEN 1 END) as common_count,
    ROW_NUMBER() OVER (ORDER BY COUNT(CASE WHEN lr.status = 'completed' THEN 1 END) DESC) as rank,
    ROW_NUMBER() OVER (ORDER BY COUNT(lr.id) DESC) as participation_rank
FROM users u
LEFT JOIN lottery_records lr ON u.id = lr.user_id
GROUP BY u.id, u.mcp_user_id, u.username, u.avatar_url
ORDER BY total_wins DESC, total_participations DESC;

-- 6. VibeDoge会员统计
CREATE OR REPLACE VIEW vibedoge_membership_stats AS
SELECT 
    CASE 
        WHEN lr.prize_name LIKE '%3个月%' THEN '3个月会员'
        WHEN lr.prize_name LIKE '%6个月%' THEN '6个月会员'
        WHEN lr.prize_name LIKE '%年度%' OR lr.prize_name LIKE '%12个月%' THEN '年度会员'
        WHEN lr.prize_name LIKE '%终身%' THEN '终身会员'
        ELSE '其他'
    END as membership_type,
    COUNT(lr.id) as awarded_count,
    ROUND(COUNT(lr.id) * 100.0 / SUM(COUNT(lr.id)) OVER (), 2) as percentage,
    COUNT(DISTINCT lr.user_id) as unique_winners
FROM lottery_records lr
WHERE lr.status = 'completed' AND lr.prize_name IS NOT NULL
GROUP BY 
    CASE 
        WHEN lr.prize_name LIKE '%3个月%' THEN '3个月会员'
        WHEN lr.prize_name LIKE '%6个月%' THEN '6个月会员'
        WHEN lr.prize_name LIKE '%年度%' OR lr.prize_name LIKE '%12个月%' THEN '年度会员'
        WHEN lr.prize_name LIKE '%终身%' THEN '终身会员'
        ELSE '其他'
    END
ORDER BY 
    CASE 
        WHEN lr.prize_name LIKE '%终身%' THEN 1
        WHEN lr.prize_name LIKE '%年度%' OR lr.prize_name LIKE '%12个月%' THEN 2
        WHEN lr.prize_name LIKE '%6个月%' THEN 3
        WHEN lr.prize_name LIKE '%3个月%' THEN 4
        ELSE 5
    END;

-- 7. 实时统计汇总
CREATE OR REPLACE VIEW realtime_summary AS
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM lottery_records) as total_lotteries,
    (SELECT COUNT(*) FROM lottery_records WHERE status = 'active') as active_lotteries,
    (SELECT COUNT(*) FROM lottery_records WHERE status = 'completed') as completed_lotteries,
    (SELECT COUNT(*) FROM lottery_records WHERE status = 'completed' AND prize_rarity = 'legendary') as legendary_prizes,
    (SELECT COUNT(*) FROM lottery_records WHERE status = 'completed' AND prize_rarity = 'epic') as epic_prizes,
    (SELECT COUNT(*) FROM lottery_records WHERE status = 'completed' AND prize_rarity = 'rare') as rare_prizes,
    (SELECT COUNT(*) FROM lottery_records WHERE status = 'completed' AND prize_rarity = 'common') as common_prizes,
    (SELECT COUNT(DISTINCT user_id) FROM lottery_records WHERE created_at >= CURRENT_DATE) as today_active_users,
    (SELECT COUNT(*) FROM lottery_records WHERE created_at >= CURRENT_DATE) as today_lotteries,
    (SELECT COUNT(*) FROM lottery_records WHERE status = 'completed' AND created_at >= CURRENT_DATE) as today_wins;

-- 8. 用户活跃度分析
CREATE OR REPLACE VIEW user_activity_analysis AS
SELECT 
    u.mcp_user_id,
    u.username,
    u.created_at as user_join_date,
    MAX(lr.created_at) as last_activity_date,
    COUNT(lr.id) as total_activities,
    COUNT(CASE WHEN lr.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as activities_last_7_days,
    COUNT(CASE WHEN lr.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as activities_last_30_days,
    CASE 
        WHEN MAX(lr.created_at) >= CURRENT_DATE - INTERVAL '7 days' THEN '活跃'
        WHEN MAX(lr.created_at) >= CURRENT_DATE - INTERVAL '30 days' THEN '一般'
        ELSE '不活跃'
    END as activity_level
FROM users u
LEFT JOIN lottery_records lr ON u.id = lr.user_id
GROUP BY u.id, u.mcp_user_id, u.username, u.created_at;

-- 创建函数：获取最新的汇总统计数据
CREATE OR REPLACE FUNCTION get_lottery_summary()
RETURNS TABLE (
    total_users BIGINT,
    total_lotteries BIGINT,
    active_lotteries BIGINT,
    completed_lotteries BIGINT,
    legendary_prizes BIGINT,
    epic_prizes BIGINT,
    rare_prizes BIGINT,
    common_prizes BIGINT,
    today_active_users BIGINT,
    today_lotteries BIGINT,
    today_wins BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM realtime_summary;
END;
$$ LANGUAGE plpgsql;

-- 创建函数：获取用户个人统计
CREATE OR REPLACE FUNCTION get_user_stats(p_mcp_user_id VARCHAR)
RETURNS TABLE (
    total_lotteries BIGINT,
    completed_lotteries BIGINT,
    active_lotteries BIGINT,
    legendary_prizes BIGINT,
    epic_prizes BIGINT,
    rare_prizes BIGINT,
    common_prizes BIGINT,
    last_lottery_date TIMESTAMP,
    win_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        total_lotteries,
        completed_lotteries,
        active_lotteries,
        legendary_prizes,
        epic_prizes,
        rare_prizes,
        common_prizes,
        last_lottery_date,
        CASE 
            WHEN total_lotteries > 0 THEN ROUND((completed_lotteries::DECIMAL / total_lotteries) * 100, 2)
            ELSE 0
        END as win_rate
    FROM user_statistics 
    WHERE mcp_user_id = p_mcp_user_id;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器：自动更新统计时间
CREATE OR REPLACE FUNCTION update_stats_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    -- 这里可以添加更新统计缓存表的逻辑
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为统计视图添加注释
COMMENT ON VIEW lottery_summary IS 'VibeDoge抽奖系统汇总视图，包含所有抽奖记录的详细信息';
COMMENT ON VIEW user_statistics IS '用户个人统计数据，包含抽奖次数、获奖情况等';
COMMENT ON VIEW prize_statistics IS '奖品统计信息，展示各种奖品的发放数量和比例';
COMMENT ON VIEW daily_statistics IS '每日抽奖统计，用于分析用户活跃度趋势';
COMMENT ON VIEW leaderboard IS '用户排行榜，按获奖次数和参与次数排序';
COMMENT ON VIEW vibedoge_membership_stats IS 'VibeDoge会员类型统计，分析不同会员等级的发放情况';
COMMENT ON VIEW realtime_summary IS '实时统计汇总，提供系统整体运行状况';
COMMENT ON VIEW user_activity_analysis IS '用户活跃度分析，识别用户参与模式';
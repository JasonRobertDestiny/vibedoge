-- Vibe Coding 抽奖系统数据库表结构

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mcp_user_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 抽奖记录表
CREATE TABLE IF NOT EXISTS lottery_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lottery_id VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    prize_name VARCHAR(255),
    prize_description TEXT,
    prize_value VARCHAR(100),
    prize_rarity VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_mcp_user_id ON users(mcp_user_id);
CREATE INDEX IF NOT EXISTS idx_lottery_records_user_id ON lottery_records(user_id);
CREATE INDEX IF NOT EXISTS idx_lottery_records_lottery_id ON lottery_records(lottery_id);
CREATE INDEX IF NOT EXISTS idx_lottery_records_status ON lottery_records(status);
CREATE INDEX IF NOT EXISTS idx_lottery_records_created_at ON lottery_records(created_at);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为users表创建更新时间触发器
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 为lottery_records表创建更新时间触发器
DROP TRIGGER IF EXISTS update_lottery_records_updated_at ON lottery_records;
CREATE TRIGGER update_lottery_records_updated_at
    BEFORE UPDATE ON lottery_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 插入一些测试数据（可选）
INSERT INTO users (mcp_user_id, username, email, avatar_url) VALUES
('mcp_test_001', 'TestUser1', 'test1@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=test1'),
('mcp_test_002', 'TestUser2', 'test2@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=test2')
ON CONFLICT (mcp_user_id) DO NOTHING;

-- 插入一些测试抽奖记录（可选）
INSERT INTO lottery_records (user_id, lottery_id, status, prize_name, prize_value, prize_rarity) VALUES
((SELECT id FROM users WHERE mcp_user_id = 'mcp_test_001'), 'test_lottery_001', 'completed', 'Vibe Coding 学习会员', '$99', 'common'),
((SELECT id FROM users WHERE mcp_user_id = 'mcp_test_002'), 'test_lottery_002', 'active', NULL, NULL, NULL)
ON CONFLICT (lottery_id) DO NOTHING;
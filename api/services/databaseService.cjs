const supabase = require('../../config/supabase.cjs');
const { v4: uuidv4 } = require('uuid');

class DatabaseService {
  constructor() {
    this.supabase = supabase;
  }

  // 用户相关操作
  async createUser(mcpUserId, userData = {}) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .insert([{
          id: uuidv4(),
          mcp_user_id: mcpUserId,
          username: userData.username || `User_${mcpUserId.split('_').pop()}`,
          email: userData.email || `${mcpUserId}@mcp.local`,
          avatar_url: userData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mcpUserId}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  async getUserByMcpId(mcpUserId) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('mcp_user_id', mcpUserId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        console.error('Error getting user by MCP ID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserByMcpId:', error);
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }

  // 抽奖记录相关操作
  async createLotteryRecord(userId, lotteryData) {
    try {
      const { data, error } = await this.supabase
        .from('lottery_records')
        .insert([{
          id: uuidv4(),
          user_id: userId,
          lottery_id: lotteryData.lotteryId,
          status: lotteryData.status || 'active',
          prize_name: lotteryData.prizeName || null,
          prize_value: lotteryData.prizeValue || null,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating lottery record:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createLotteryRecord:', error);
      throw error;
    }
  }

  async getUserLotteries(userId) {
    try {
      const { data, error } = await this.supabase
        .from('lottery_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting user lotteries:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserLotteries:', error);
      throw error;
    }
  }

  async getLotteryByLotteryId(lotteryId) {
    try {
      const { data, error } = await this.supabase
        .from('lottery_records')
        .select(`
          *,
          users (
            id,
            mcp_user_id,
            username,
            email,
            avatar_url
          )
        `)
        .eq('lottery_id', lotteryId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error getting lottery by lottery ID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getLotteryByLotteryId:', error);
      throw error;
    }
  }

  async updateLotteryRecord(lotteryId, updateData) {
    try {
      const { data, error } = await this.supabase
        .from('lottery_records')
        .update(updateData)
        .eq('lottery_id', lotteryId)
        .select()
        .single();

      if (error) {
        console.error('Error updating lottery record:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateLotteryRecord:', error);
      throw error;
    }
  }

  // 统计相关操作
  async getUserStats(userId) {
    try {
      const { data, error } = await this.supabase
        .from('lottery_records')
        .select('status', { count: 'exact' })
        .eq('user_id', userId);

      if (error) {
        console.error('Error getting user stats:', error);
        throw error;
      }

      const stats = {
        total: data?.length || 0,
        active: data?.filter(item => item.status === 'active').length || 0,
        completed: data?.filter(item => item.status === 'completed').length || 0
      };

      return stats;
    } catch (error) {
      console.error('Error in getUserStats:', error);
      throw error;
    }
  }

  async getGlobalStats() {
    try {
      const { data, error } = await this.supabase
        .from('lottery_records')
        .select('status', { count: 'exact' });

      if (error) {
        console.error('Error getting global stats:', error);
        throw error;
      }

      const { count: userCount, error: userError } = await this.supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (userError) {
        console.error('Error getting user count:', userError);
        throw userError;
      }

      const stats = {
        totalUsers: userCount || 0,
        totalLotteries: data?.length || 0,
        activeLotteries: data?.filter(item => item.status === 'active').length || 0,
        completedLotteries: data?.filter(item => item.status === 'completed').length || 0
      };

      return stats;
    } catch (error) {
      console.error('Error in getGlobalStats:', error);
      throw error;
    }
  }

  // 健康检查
  async healthCheck() {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('count', { count: 'exact', head: true });

      if (error) {
        console.error('Database health check failed:', error);
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        message: 'Database connection healthy',
        userCount: data || 0
      };
    } catch (error) {
      console.error('Error in healthCheck:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new DatabaseService();
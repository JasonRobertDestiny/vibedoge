// MCP (Model Context Protocol) 服务
// 用于生成和管理用户ID

export interface MCPUser {
  id: string;
  createdAt: string;
  lastActiveAt: string;
  sessionToken: string;
}

class MCPService {
  private storageKey = 'mcp_user_session';
  private currentUser: MCPUser | null = null;

  // 生成唯一的MCP用户ID
  generateUserId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `mcp_${timestamp}_${random}`;
  }

  // 创建新的MCP用户
  async createUser(): Promise<MCPUser> {
    const now = new Date().toISOString();
    const user: MCPUser = {
      id: this.generateUserId(),
      createdAt: now,
      lastActiveAt: now,
      sessionToken: this.generateSessionToken()
    };

    this.currentUser = user;
    this.saveToStorage(user);
    return user;
  }

  // 生成会话令牌
  private generateSessionToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // 保存到本地存储
  private saveToStorage(user: MCPUser): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
    } catch (error) {
      console.warn('Failed to save MCP user to localStorage:', error);
    }
  }

  // 从本地存储恢复
  restoreFromStorage(): MCPUser | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const user = JSON.parse(stored) as MCPUser;
        this.currentUser = user;
        return user;
      }
    } catch (error) {
      console.warn('Failed to restore MCP user from localStorage:', error);
    }
    return null;
  }

  // 更新用户活跃时间
  heartbeat(): void {
    if (this.currentUser) {
      this.currentUser.lastActiveAt = new Date().toISOString();
      this.saveToStorage(this.currentUser);
    }
  }

  // 清除会话
  clearSession(): void {
    this.currentUser = null;
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear MCP session:', error);
    }
  }

  // 获取当前用户
  getCurrentUser(): MCPUser | null {
    return this.currentUser;
  }
}

// 导出单例实例
export const mcpService = new MCPService();

// 便捷函数
export async function getMCPUserId(): Promise<MCPUser> {
  return mcpService.createUser();
}

export function restoreMCPUser(): MCPUser | null {
  return mcpService.restoreFromStorage();
}

export function clearMCPSession(): void {
  mcpService.clearSession();
}
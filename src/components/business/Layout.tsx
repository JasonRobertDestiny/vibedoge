import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Gift, BarChart3, Info, Users, Menu, X } from 'lucide-react';
import { useUIStore } from '../../store';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const navigation = [
    { name: '首页', href: '/', icon: Home, current: false },
    { name: '抽奖详情', href: '/lottery/detail', icon: Gift, current: false },
    { name: '社区广场', href: '/community', icon: Users, current: false },
    { name: '全球统计', href: '/global-stats', icon: BarChart3, current: false },
    { name: '关于我们', href: '/about', icon: Info, current: false },
  ];

  // 添加调试日志
  const handleNavClick = (href: string, name: string) => {
    console.log(`Navigation clicked: ${name} -> ${href}`);
    console.log('Current location:', location.pathname);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 顶部导航栏 */}
      <nav className="backdrop-blur-md bg-white/20 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-800 hover:bg-white/30 backdrop-blur-sm border border-white/20"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link to="/" className="flex items-center" onClick={() => handleNavClick('/', 'Logo')}>
                <div className="text-2xl font-bold text-blue-600 ml-2">
                  🐕 VibeDoge
                </div>
              </Link>
            </div>
            
            {/* 桌面端导航 */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => handleNavClick(item.href, item.name)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                      location.pathname === item.href
                        ? 'text-blue-600 bg-white/30 backdrop-blur-md border border-white/30 shadow-sm'
                        : 'text-slate-700 hover:text-blue-600 hover:bg-white/20 hover:backdrop-blur-sm border border-transparent hover:border-white/20'
                    }`}
                    style={{ pointerEvents: 'auto', zIndex: 10 }}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* 用户操作区 - 已移除登录注册按钮，用户通过MCP服务接入 */}
            <div className="flex items-center space-x-4">
              {/* 预留空间用于未来功能扩展 */}
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端侧边栏 */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white/20 backdrop-blur-md border-r border-white/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="text-xl font-bold text-blue-600 mb-8">
                🐕 VibeDoge
              </div>
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => {
                        handleNavClick(item.href, item.name);
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                        location.pathname === item.href
                          ? 'text-blue-600 bg-white/30 backdrop-blur-md border border-white/30 shadow-sm'
                          : 'text-slate-700 hover:text-blue-600 hover:bg-white/20 hover:backdrop-blur-sm border border-transparent hover:border-white/20'
                      }`}
                      style={{ pointerEvents: 'auto' }}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      <main className="flex-1">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="backdrop-blur-md bg-white/20 border-t border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-slate-600 text-sm">
            <p>&copy; 2025 VibeDoge交易所. 保留所有权利.</p>
            <p className="mt-2">基于Vibe时代技术架构构建</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
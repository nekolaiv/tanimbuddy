'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AuthService } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = AuthService.getToken();
    
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Verify token is still valid
    fetch('/api/admin/stats', {
      headers: AuthService.getAuthHeaders(),
    }).then(response => {
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        AuthService.removeToken();
        router.push('/admin/login');
      }
      setLoading(false);
    });
  }, [router]);

  const handleLogout = () => {
    AuthService.removeToken();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-2xl flex items-center justify-center animate-pulse">
            <span className="text-2xl text-white">🌾</span>
          </div>
          <div className="w-8 h-8 border-2 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊', color: 'from-blue-500 to-blue-600' },
    { name: 'Messages', href: '/admin/messages', icon: '💬', color: 'from-green-500 to-green-600' },
    { name: 'Broadcast', href: '/admin/broadcast', icon: '📢', color: 'from-purple-500 to-purple-600' },
    { name: 'Farmers', href: '/admin/farmers', icon: '🤠', color: 'from-amber-500 to-amber-600' },
    { name: 'Analytics', href: '/admin/analytics', icon: '📈', color: 'from-pink-500 to-pink-600' },
    { name: 'System', href: '/admin/system', icon: '⚙️', color: 'from-gray-500 to-gray-600' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* Enhanced Sidebar */}
      <aside className="sticky top-0 w-80 max-h-max bg-white/70 backdrop-blur-sm border-r border-white/20 shadow-xl">
        <div className="p-6">
          {/* Enhanced Logo */}
          <div className="flex items-center gap-4 mb-8 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl">
            <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🌾</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">TanimBuddy</h1>
              <p className="text-sm text-green-600 font-medium">Admin Panel</p>
              <p className="text-xs text-gray-500">v1.0 • BantayANI Engine</p>
            </div>
          </div>
          
          {/* Enhanced Navigation */}
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-medium transition-all duration-300 hover:shadow-lg',
                  pathname === item.href
                    ? 'bg-white shadow-lg text-gray-900 scale-105'
                    : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300',
                  pathname === item.href 
                    ? `bg-gradient-to-r ${item.color}` 
                    : 'bg-gray-400'
                )}>
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs opacity-70">
                    {item.name === 'Dashboard' && 'Overview & stats'}
                    {item.name === 'Messages' && 'SMS conversations'}
                    {item.name === 'Broadcast' && 'Send alerts'}
                    {item.name === 'Farmers' && 'User management'}
                    {item.name === 'Analytics' && 'Usage insights'}
                    {item.name === 'System' && 'Health & logs'}
                  </div>
                </div>
                {pathname === item.href && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </Link>
            ))}
            <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">System Status</span>
            </div>
            <div className="text-xs text-gray-600">
              <div className="flex justify-between">
                <span>SMS Service:</span>
                <span className="text-green-600">Online</span>
              </div>
              <div className="flex justify-between">
                <span>AI Engine:</span>
                <span className="text-green-600">Active</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-12 bg-white/60 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
          >
            <span className="mr-2">🚪</span>
            Logout
          </Button>
        </div>
          </nav>
        </div>
        
        {/* Enhanced Footer */}
        
      </aside>

      {/* Enhanced Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
        <header className="h-20 bg-white/70 backdrop-blur-sm border-b border-white/20 shadow-sm">
          <div className="h-full px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">
                  {navigation.find(item => item.href === pathname)?.icon || '📊'}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {navigation.find(item => item.href === pathname)?.name || 'Admin Panel'}
                </h2>
                <p className="text-sm text-gray-500">
                  Manage TanimBuddy farming advisory system
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-green-100 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">All Systems Operational</span>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">Last login: Today</p>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
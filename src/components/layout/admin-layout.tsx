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
  

  // Ensure we always have a valid Record<string, string>
  const headers: Record<string, string> = AuthService.getAuthHeaders() || {};

  if (Object.keys(headers).length === 0) {
    router.push('/admin/login');
    return;
  }

  fetch('/api/admin/stats', { headers })
    .then(response => {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Messages', href: '/admin/messages', icon: '💬' },
    { name: 'Broadcast', href: '/admin/broadcast', icon: '📢' },
    { name: 'Farmers', href: '/admin/farmers', icon: '👨‍🌾' },
    { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
    { name: 'System', href: '/admin/system', icon: '⚙️' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🌾</span>
            <div>
              <h1 className="font-bold text-lg">TanimBuddy</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold">
            {navigation.find(item => item.href === pathname)?.name || 'Admin Panel'}
          </h2>
          <div className="text-sm text-gray-500">
            TanimBuddy v1.0 | BantayANI Engine
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
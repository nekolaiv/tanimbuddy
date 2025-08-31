'use client';

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: '🏠',
      description: 'Overview & quick actions' 
    },
    { 
      name: 'Messages', 
      href: '/messages', 
      icon: '💬',
      description: 'SMS conversations' 
    },
    { 
      name: 'Alerts', 
      href: '/alerts', 
      icon: '📢',
      description: 'Broadcast notifications' 
    },
    { 
      name: 'Analytics', 
      href: '/analytics', 
      icon: '📊',
      description: 'Usage statistics' 
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* Enhanced Sidebar */}
      <aside className="w-72 bg-white/70 backdrop-blur-sm border-r border-white/20 shadow-xl">
        <div className="p-6">
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🌾</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">TanimBuddy</h1>
              <p className="text-sm text-green-600 font-medium">AI Farming Assistant</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-green-100 text-green-700 shadow-sm'
                    : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm'
                )}
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </span>
                <div>
                  <div>{item.name}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">Helping Filipino Farmers</p>
            <p className="text-xs text-gray-500">Powered by BantayANI</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
        <header className="h-16 bg-white/70 backdrop-blur-sm border-b border-white/20 shadow-sm">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🌱</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Welcome to TanimBuddy
                </h2>
                <p className="text-sm text-gray-500">
                  Empowering farmers with AI-powered advice
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">System Active</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
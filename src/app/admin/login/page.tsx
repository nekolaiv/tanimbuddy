'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AuthService } from '@/lib/auth';

const TEST_CREDENTIALS = {
  username: 'admin@tanimbuddy.ph',
  password: 'demo123'
};

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setError('Both fields are required');
      return;
    }

    // Simple mock authentication
    if (credentials.username === TEST_CREDENTIALS.username && 
        credentials.password === TEST_CREDENTIALS.password) {
      setLoading(true);
      
      // Simulate login delay
      setTimeout(() => {
        AuthService.setToken('mock-admin-token');
        router.push('/admin');
      }, 1500);
    } else {
      setError('Invalid credentials');
    }
  };

  const autoFillTestAccount = () => {
    setCredentials(TEST_CREDENTIALS);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Login Card */}
        <div className="relative bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 animate-slide-up">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 gradient-bg rounded-3xl flex items-center justify-center shadow-lg">
              <span className="text-3xl text-white">🌾</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">TanimBuddy Admin</h1>
            <p className="text-gray-600">Access the administrative dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username / Email
              </label>
              <input
                type="text"
                id="username"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-4 bg-white/60 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg"
                placeholder="Enter your username"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-4 bg-white/60 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-xl">🔐</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm animate-scale-in">
                <div className="flex items-center gap-2">
                  <span>❌</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-xl">🚀</span>
                  <span>Access Dashboard</span>
                </div>
              )}
            </Button>
          </form>

          {/* Auto-fill Test Account */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <div className="text-center">
              <p className="text-sm text-blue-700 mb-3">Demo/Testing Purpose</p>
              <Button
                onClick={autoFillTestAccount}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                disabled={loading}
              >
                <span className="mr-2">🔧</span>
                Auto-fill Test Admin Account
              </Button>
              <p className="text-xs text-blue-600 mt-2">
                Username: {TEST_CREDENTIALS.username}<br/>
                Password: {TEST_CREDENTIALS.password}
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              TanimBuddy v1.0 • Powered by BantayANI Engine
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Empowering Filipino farmers with AI technology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
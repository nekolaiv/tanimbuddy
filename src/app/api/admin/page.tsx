'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layout/admin-layout';
import { AuthService } from '@/lib/auth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Stats {
  totalFarmers: number;
  activeFarmers: number;
  messagesThisWeek: number;
  inboundMessages: number;
  outboundMessages: number;
}

interface IntentData {
  intent: string;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [intentData, setIntentData] = useState<IntentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: AuthService.getAuthHeaders() as Record<string, string>,
      });

      if (!response.ok) throw new Error('Failed to fetch stats');

      const data = await response.json();
      setStats(data.stats);
      setIntentData(data.intentAnalytics);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
          <Button onClick={fetchDashboardData} className="ml-4" size="sm">
            Retry
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor TanimBuddy&apos;s performance and farmer engagement</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">👨‍🌾</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Farmers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalFarmers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active Farmers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeFarmers}</p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">💬</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Messages This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.messagesThisWeek}</p>
                  <p className="text-xs text-gray-500">
                    ↗️ {stats.inboundMessages} in, ↖️ {stats.outboundMessages} out
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-2xl">🧠</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">AI Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.inboundMessages > 0 ? Math.round((stats.outboundMessages / stats.inboundMessages) * 100) : 0}%
                  </p>
                  <p className="text-xs text-gray-500">BantayANI responses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Intent Distribution */}
          {intentData.length > 0 && (
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Popular Farmer Questions</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                    data={intentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ intent, percent }) => {
                        const safeIntent = intent ?? '';
                        const safePercent = percent ?? 0;
                        return `${safeIntent.replace('_', ' ')} ${(safePercent * 100).toFixed(0)}%`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    >
                    {intentData.map((entry, index) => (
                        <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Message Volume */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Message Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Inbound', messages: stats?.inboundMessages || 0, fill: '#0088FE' },
                  { name: 'Outbound', messages: stats?.outboundMessages || 0, fill: '#00C49F' },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="messages" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 mt-2">Messages from the last 7 days</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center">
              <span className="text-xl mb-1">📢</span>
              <span className="text-sm">Send Broadcast</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-xl mb-1">💬</span>
              <span className="text-sm">View Messages</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-xl mb-1">📊</span>
              <span className="text-sm">Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-xl mb-1">⚙️</span>
              <span className="text-sm">System Health</span>
            </Button>
          </div>
        </div>

        {/* Recent Activity Preview */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <Button variant="outline" size="sm">
              View All Messages
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-500">2 min ago</span>
              <span>Farmer asked about rice planting schedule</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-500">5 min ago</span>
              <span>BantayANI provided pest control advice</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-500">12 min ago</span>
              <span>Weather alert sent to 45 farmers</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
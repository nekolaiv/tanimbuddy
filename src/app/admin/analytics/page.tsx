'use client';

import AdminLayout from '@/components/layout/admin-layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Mock analytics data
const messageVolumeData = [
  { name: 'Jan', inbound: 234, outbound: 267, total: 501 },
  { name: 'Feb', inbound: 456, outbound: 423, total: 879 },
  { name: 'Mar', inbound: 678, outbound: 645, total: 1323 },
  { name: 'Apr', inbound: 789, outbound: 756, total: 1545 },
  { name: 'May', inbound: 567, outbound: 534, total: 1101 },
  { name: 'Jun', inbound: 890, outbound: 867, total: 1757 },
];

const intentDistributionData = [
  { name: 'Planting Advice', value: 35, count: 1234 },
  { name: 'Pest Control', value: 28, count: 987 },
  { name: 'Weather Inquiry', value: 20, count: 706 },
  { name: 'Fertilizer Advice', value: 12, count: 423 },
  { name: 'Market Prices', value: 5, count: 176 }
];

const languageDistributionData = [
  { name: 'Tagalog', value: 45, count: 1281 },
  { name: 'Cebuano', value: 32, count: 910 },
  { name: 'Ilocano', value: 15, count: 427 },
  { name: 'English', value: 8, count: 228 }
];

const regionData = [
  { region: 'Luzon', farmers: 1234, messages: 5678 },
  { region: 'Visayas', farmers: 892, messages: 4123 },
  { region: 'Mindanao', farmers: 721, messages: 3456 }
];

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600">Track TanimBuddy usage and performance metrics</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">+24.5%</p>
                <p className="text-xs text-green-600">↗ Last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">94.2%</p>
                <p className="text-xs text-green-600">↗ +2.1%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">2.3s</p>
                <p className="text-xs text-green-600">↗ Improved</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Daily Active Users</p>
                <p className="text-2xl font-bold text-gray-900">1,456</p>
                <p className="text-xs text-green-600">↗ +15.2%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Message Volume Trends */}
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Message Volume Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={messageVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="inbound" fill="#3b82f6" name="Inbound" />
                <Bar dataKey="outbound" fill="#22c55e" name="Outbound" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Question Types Distribution */}
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Popular Question Types</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={intentDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {intentDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Language Distribution */}
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Language Usage</h3>
            <div className="space-y-4">
              {languageDistributionData.map((lang, index) => (
                <div key={lang.name} className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900">{lang.name}</span>
                      <span className="text-sm text-gray-600">{lang.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ backgroundColor: COLORS[index], width: `${lang.value}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{lang.count} messages</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Distribution */}
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Regional Coverage</h3>
            <div className="space-y-6">
              {regionData.map((region) => (
                <div key={region.region} className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-lg text-gray-900">{region.region}</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-600">Farmers</p>
                      <p className="text-xl font-bold text-gray-900">{region.farmers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Messages</p>
                      <p className="text-xl font-bold text-gray-900">{region.messages.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Analytics Table */}
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="p-8 border-b">
            <h3 className="text-xl font-semibold text-gray-900">Detailed Metrics</h3>
            <p className="text-gray-600 mt-1">Comprehensive breakdown of system performance</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900">Metric</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Current</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Previous</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Change</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-4 font-medium text-gray-900">Total Messages</td>
                  <td className="p-4 text-gray-900">45,621</td>
                  <td className="p-4 text-gray-600">38,742</td>
                  <td className="p-4 text-green-600">+17.8%</td>
                  <td className="p-4">📈</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-900">Active Farmers</td>
                  <td className="p-4 text-gray-900">2,847</td>
                  <td className="p-4 text-gray-600">2,291</td>
                  <td className="p-4 text-green-600">+24.3%</td>
                  <td className="p-4">📈</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-900">AI Success Rate</td>
                  <td className="p-4 text-gray-900">94.2%</td>
                  <td className="p-4 text-gray-600">92.1%</td>
                  <td className="p-4 text-green-600">+2.1%</td>
                  <td className="p-4">📈</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-900">Average Response Time</td>
                  <td className="p-4 text-gray-900">2.3s</td>
                  <td className="p-4 text-gray-600">2.8s</td>
                  <td className="p-4 text-green-600">-17.9%</td>
                  <td className="p-4">📈</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-900">Error Rate</td>
                  <td className="p-4 text-gray-900">1.2%</td>
                  <td className="p-4 text-gray-600">2.1%</td>
                  <td className="p-4 text-green-600">-42.9%</td>
                  <td className="p-4">📈</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-900">SMS Delivery Rate</td>
                  <td className="p-4 text-gray-900">98.7%</td>
                  <td className="p-4 text-gray-600">97.9%</td>
                  <td className="p-4 text-green-600">+0.8%</td>
                  <td className="p-4">📈</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
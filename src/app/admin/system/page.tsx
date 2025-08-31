/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';

// Mock system health data
const SYSTEM_HEALTH = {
  overall: 'healthy',
  services: {
    smsGateway: { status: 'online', uptime: '99.8%', lastCheck: '2 min ago' },
    aiEngine: { status: 'online', uptime: '99.9%', lastCheck: '1 min ago' },
    database: { status: 'online', uptime: '100%', lastCheck: '30 sec ago' },
    webServer: { status: 'online', uptime: '99.7%', lastCheck: '15 sec ago' }
  },
  metrics: {
    cpuUsage: 45,
    memoryUsage: 68,
    diskUsage: 34,
    networkLatency: 23
  }
};

// Mock system logs
const SYSTEM_LOGS = [
  {
    id: 1,
    timestamp: '2024-01-20 14:30:25',
    level: 'info',
    category: 'sms',
    message: 'SMS delivered successfully to +639171234567',
    metadata: { messageId: 'msg_001', farmer: 'Juan Santos' }
  },
  {
    id: 2,
    timestamp: '2024-01-20 14:29:45',
    level: 'info',
    category: 'ai',
    message: 'BantayANI processed farming question about rice planting',
    metadata: { intent: 'PLANTING_ADVICE', confidence: 95.2, language: 'tagalog' }
  },
  {
    id: 3,
    timestamp: '2024-01-20 14:28:12',
    level: 'warning',
    category: 'system',
    message: 'High memory usage detected: 78%',
    metadata: { threshold: 75, current: 78 }
  },
  {
    id: 4,
    timestamp: '2024-01-20 14:25:33',
    level: 'error',
    category: 'sms',
    message: 'SMS delivery failed to +639221234568 - invalid number',
    metadata: { messageId: 'msg_002', error: 'INVALID_NUMBER' }
  },
  {
    id: 5,
    timestamp: '2024-01-20 14:22:18',
    level: 'info',
    category: 'webhook',
    message: 'Received inbound SMS from farmer',
    metadata: { from: '+639331234569', content: 'Kailan magtanim ng mais?' }
  }
];

export default function SystemPage() {
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warning' | 'error'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredLogs = logFilter === 'all' 
    ? SYSTEM_LOGS 
    : SYSTEM_LOGS.filter(log => log.level === logFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Health & Logs</h1>
            <p className="text-gray-600">Monitor system performance and troubleshoot issues</p>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-green-600 hover:bg-green-700"
          >
            {refreshing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Refreshing...</span>
              </div>
            ) : (
              <>
                <span className="mr-2">🔄</span>
                Refresh Status
              </>
            )}
          </Button>
        </div>

        {/* Overall System Health */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">System Overview</h2>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 font-medium">All Systems Operational</span>
            </div>
          </div>

          {/* Service Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="p-6 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📱</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">SMS Gateway</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(SYSTEM_HEALTH.services.smsGateway.status)}`}>
                    {SYSTEM_HEALTH.services.smsGateway.status}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>Uptime: {SYSTEM_HEALTH.services.smsGateway.uptime}</div>
                <div>Last check: {SYSTEM_HEALTH.services.smsGateway.lastCheck}</div>
              </div>
            </div>

            <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🧠</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Engine</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(SYSTEM_HEALTH.services.aiEngine.status)}`}>
                    {SYSTEM_HEALTH.services.aiEngine.status}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>Uptime: {SYSTEM_HEALTH.services.aiEngine.uptime}</div>
                <div>Last check: {SYSTEM_HEALTH.services.aiEngine.lastCheck}</div>
              </div>
            </div>

            <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">💾</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Database</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(SYSTEM_HEALTH.services.database.status)}`}>
                    {SYSTEM_HEALTH.services.database.status}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>Uptime: {SYSTEM_HEALTH.services.database.uptime}</div>
                <div>Last check: {SYSTEM_HEALTH.services.database.lastCheck}</div>
              </div>
            </div>

            <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🌐</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Web Server</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(SYSTEM_HEALTH.services.webServer.status)}`}>
                    {SYSTEM_HEALTH.services.webServer.status}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>Uptime: {SYSTEM_HEALTH.services.webServer.uptime}</div>
                <div>Last check: {SYSTEM_HEALTH.services.webServer.lastCheck}</div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{SYSTEM_HEALTH.metrics.cpuUsage}%</div>
              <div className="text-sm text-gray-600 mb-2">CPU Usage</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${SYSTEM_HEALTH.metrics.cpuUsage}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{SYSTEM_HEALTH.metrics.memoryUsage}%</div>
              <div className="text-sm text-gray-600 mb-2">Memory Usage</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${SYSTEM_HEALTH.metrics.memoryUsage}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{SYSTEM_HEALTH.metrics.diskUsage}%</div>
              <div className="text-sm text-gray-600 mb-2">Disk Usage</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${SYSTEM_HEALTH.metrics.diskUsage}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{SYSTEM_HEALTH.metrics.networkLatency}ms</div>
              <div className="text-sm text-gray-600 mb-2">Network Latency</div>
              <div className="text-green-600 text-sm">Excellent</div>
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="p-8 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">System Logs</h2>
                <p className="text-gray-600 mt-1">Recent system events and messages</p>
              </div>
              
              <div className="flex items-center gap-4">
                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Logs</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
                
                <Button variant="outline" size="sm">
                  <span className="mr-2">📥</span>
                  Export Logs
                </Button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">{log.category}</span>
                      <span className="text-sm text-gray-400">{log.timestamp}</span>
                    </div>
                    
                    <p className="text-gray-900 mb-2">{log.message}</p>
                    
                    {log.metadata && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs font-medium text-gray-700 mb-1">Additional Details:</div>
                        <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <div className={`w-3 h-3 rounded-full ${
                      log.level === 'error' ? 'bg-red-500' :
                      log.level === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-gray-500">No logs found for the selected filter</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">System Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <span className="text-xl mb-1">🔄</span>
              <span className="text-sm">Restart Services</span>
            </Button>
            
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <span className="text-xl mb-1">🧹</span>
              <span className="text-sm">Clear Cache</span>
            </Button>
            
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <span className="text-xl mb-1">📊</span>
              <span className="text-sm">Generate Report</span>
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
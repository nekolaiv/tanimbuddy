/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import { AuthService } from '@/lib/auth';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  direction: 'inbound' | 'outbound';
  content: string;
  intent?: string;
  confidence?: number;
  language?: string;
  timestamp: string;
  farmer: {
    phoneNumber: string;
    name?: string;
    location?: string;
  };
  error?: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'inbound' | 'outbound' | 'errors'>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages', {
        headers: AuthService.getAuthHeaders() as Record<string, string>,
      });

      if (!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      setError('Failed to load messages');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(msg => {
    switch (filter) {
      case 'inbound': return msg.direction === 'inbound';
      case 'outbound': return msg.direction === 'outbound';
      case 'errors': return !!msg.error;
      default: return true;
    }
  });

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-PH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getIntentBadge = (intent?: string) => {
    if (!intent) return null;
    
    const colors: Record<string, string> = {
      'PLANTING_ADVICE': 'bg-green-100 text-green-800',
      'PEST_DISEASE': 'bg-red-100 text-red-800',
      'WEATHER_INQUIRY': 'bg-blue-100 text-blue-800',
      'FERTILIZER_ADVICE': 'bg-yellow-100 text-yellow-800',
      'MARKET_PRICES': 'bg-purple-100 text-purple-800',
      'GENERAL_QUESTION': 'bg-gray-100 text-gray-800',
      'UNKNOWN': 'bg-orange-100 text-orange-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[intent] || 'bg-gray-100 text-gray-800'}`}>
        {intent.replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading messages...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600">View and monitor farmer conversations</p>
          </div>
          <Button onClick={fetchMessages}>
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['all', 'inbound', 'outbound', 'errors'].map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption as any)}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              {filterOption === 'all' && ` (${messages.length})`}
              {filterOption === 'inbound' && ` (${messages.filter(m => m.direction === 'inbound').length})`}
              {filterOption === 'outbound' && ` (${messages.filter(m => m.direction === 'outbound').length})`}
              {filterOption === 'errors' && ` (${messages.filter(m => m.error).length})`}
            </Button>
          ))}
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-lg border">
          {error && (
            <div className="p-4 bg-red-100 text-red-700 border-b">
              {error}
            </div>
          )}

          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No messages found for the selected filter.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <div key={message.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          message.direction === 'inbound' 
                            ? 'bg-blue-500' 
                            : message.error
                            ? 'bg-red-500'
                            : 'bg-green-500'
                        }`}></div>
                        
                        <span className="font-medium text-sm">
                          {message.farmer.name || message.farmer.phoneNumber}
                        </span>
                        
                        {message.farmer.location && (
                          <span className="text-xs text-gray-500">
                            📍 {message.farmer.location}
                          </span>
                        )}
                        
                        <span className={`text-xs px-2 py-1 rounded ${
                          message.direction === 'inbound'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {message.direction}
                        </span>
                        
                        {message.language && (
                          <span className="text-xs text-gray-500 uppercase">
                            {message.language}
                          </span>
                        )}
                        
                        {getIntentBadge(message.intent)}
                      </div>
                      
                      <p className="text-gray-900 mb-2">
                        {message.content}
                      </p>
                      
                      {message.error && (
                        <div className="bg-red-50 text-red-700 p-2 rounded text-sm">
                          <strong>Error:</strong> {message.error}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 text-right">
                      <div className="text-xs text-gray-500">
                        {formatTimestamp(message.timestamp)}
                      </div>
                      {message.confidence && (
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round(message.confidence)}% confidence
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
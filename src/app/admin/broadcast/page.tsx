/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import { AuthService } from '@/lib/auth';
import { Button } from '@/components/ui/button';

interface BroadcastData {
  title: string;
  content: string;
  alertType: 'weather' | 'pest' | 'market' | 'planting' | 'general';
  urgency: 'low' | 'medium' | 'high';
  language: 'tagalog' | 'cebuano' | 'ilocano' | 'english';
  sendImmediately: boolean;
}

export default function BroadcastPage() {
  const [formData, setFormData] = useState<BroadcastData>({
    title: '',
    content: '',
    alertType: 'general',
    urgency: 'medium',
    language: 'tagalog',
    sendImmediately: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...AuthService.getAuthHeaders(),
        } as Record<string, string>,
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create broadcast');

      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        // Reset form on success
        setFormData({
          title: '',
          content: '',
          alertType: 'general',
          urgency: 'medium',
          language: 'tagalog',
          sendImmediately: true,
        });
      }
    } catch (error) {
      setError('Failed to send broadcast. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSampleContent = (type: string, language: string) => {
    const samples = {
      weather: {
        tagalog: 'BABALA: Malakas na ulan sa susunod na 3 araw. Mag-ingat sa pagbaha at gumawa ng drainage sa inyong mga pananim. 🌧️',
        cebuano: 'PASIDAAN: Kusog nga ulan sa sunod nga 3 ka adlaw. Pag-amping sa pagbaha ug himoa ang drainage sa inyong mga tanum. 🌧️',
        english: 'WARNING: Heavy rains expected in next 3 days. Watch for flooding and prepare drainage for your crops. 🌧️'
      },
      pest: {
        tagalog: 'ALERTO: May outbreak ng brown planthopper sa Region IV. Mag-inspect ng mga palay at gumamit ng organic pesticide. 🐛',
        cebuano: 'ALERTO: Adunay outbreak sa brown planthopper sa Region IV. Pag-inspect sa mga humay ug gamita ang organic pesticide. 🐛',
        english: 'ALERT: Brown planthopper outbreak in Region IV. Inspect rice crops and use organic pesticides. 🐛'
      }
    };
    
    return samples[type as keyof typeof samples]?.[language as keyof typeof samples.weather] || '';
  };

  const characterCount = formData.content.length;
  const isOverSMSLimit = characterCount > 160;

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Send Broadcast Alert</h1>
          <p className="text-gray-600">Send important farming alerts to all registered farmers</p>
        </div>

        {/* Success/Error Messages */}
        {result && (
          <div className={`p-4 rounded-md ${
            result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {result.success ? (
              <div>
                <p className="font-medium">✅ Broadcast sent successfully!</p>
                {result.broadcast && (
                  <p className="text-sm mt-1">
                    Delivered to {result.broadcast.successCount} farmers 
                    {result.broadcast.errorCount > 0 && ` (${result.broadcast.errorCount} failed)`}
                  </p>
                )}
              </div>
            ) : (
              <p>❌ {result.error}</p>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            {error}
          </div>
        )}

        {/* Broadcast Form */}
        <div className="bg-white p-6 rounded-lg border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Title (Internal)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Weather Alert - Heavy Rains Expected"
              />
            </div>

            {/* Alert Type & Urgency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Type
                </label>
                <select
                  value={formData.alertType}
                  onChange={(e) => setFormData({...formData, alertType: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="weather">Weather</option>
                  <option value="pest">Pest/Disease</option>
                  <option value="market">Market Prices</option>
                  <option value="planting">Planting Schedule</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({...formData, urgency: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="tagalog">Tagalog</option>
                <option value="cebuano">Cebuano</option>
                <option value="ilocano">Ilocano</option>
                <option value="english">English</option>
              </select>
            </div>

            {/* Sample Content Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Templates
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({
                    ...formData, 
                    content: getSampleContent('weather', formData.language)
                  })}
                >
                  Weather Alert
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({
                    ...formData, 
                    content: getSampleContent('pest', formData.language)
                  })}
                >
                  Pest Alert
                </Button>
              </div>
            </div>

            {/* Message Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Content
                <span className={`ml-2 text-xs ${
                  isOverSMSLimit ? 'text-red-600' : 'text-gray-500'
                }`}>
                  ({characterCount}/160 characters)
                </span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  isOverSMSLimit ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your farming alert message here..."
              />
              {isOverSMSLimit && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ Message is over SMS limit. Consider shortening for better delivery.
                </p>
              )}
            </div>

            {/* Send Options */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendImmediately"
                checked={formData.sendImmediately}
                onChange={(e) => setFormData({...formData, sendImmediately: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="sendImmediately" className="text-sm text-gray-700">
                Send immediately to all farmers
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !formData.title || !formData.content}
              className="w-full"
            >
              {loading ? 'Sending...' : formData.sendImmediately ? 'Send Broadcast Now' : 'Save as Draft'}
            </Button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
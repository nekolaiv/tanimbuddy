/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layout/admin-layout';

// AI message templates for broadcast
const BROADCAST_TEMPLATES = [
  {
    id: 'weather_warning_tagalog',
    language: 'Tagalog',
    category: 'Weather Alert',
    title: 'Babala - Malakas na Ulan',
    message: 'BABALA: Malakas na ulan sa susunod na 3 araw. Mag-ingat sa pagbaha at gumawa ng drainage sa inyong pananim. Stay safe! 🌧️',
    urgency: 'high'
  },
  {
    id: 'planting_advice_cebuano',
    language: 'Cebuano',
    category: 'Planting Advice',
    title: 'Panahon sa Pagtanom',
    message: 'Maayong panahon karon para sa pagtanom og mais. Pag-andam sa yuta ug gamita ang organic fertilizer. Maayo pa! 🌽',
    urgency: 'medium'
  },
  {
    id: 'pest_alert_ilocano',
    language: 'Ilocano',
    category: 'Pest Alert',
    title: 'Babala ti Peste',
    message: 'ALERTO: Adda brown planthopper iti pagay. Ispray ti organic pesticide iti agsapa. Bantayan dagiti mula! 🐛',
    urgency: 'high'
  },
  {
    id: 'market_price_tagalog',
    language: 'Tagalog',
    category: 'Market Update',
    title: 'Presyo ng Palay Ngayon',
    message: 'Update: Presyo ng palay ₱25-28/kilo sa Cabanatuan market. Magandang timing para sa benta. Salamat! 💰',
    urgency: 'low'
  },
  {
    id: 'fertilizer_reminder_cebuano',
    language: 'Cebuano',
    category: 'Farming Tips',
    title: 'Panahon sa Pataba',
    message: 'Reminder: Panahon na para sa 2nd application sa fertilizer sa inyong mais. Gamita ang 14-14-14. Salamat! 🌱',
    urgency: 'medium'
  },
  {
    id: 'harvest_season_ilocano',
    language: 'Ilocano',
    category: 'Harvest Alert',
    title: 'Tiempo ti Panagapit',
    message: 'Tiempo ti panagapit! Nasayaat nga aldaw para kadagiti pagay. Mangaramidkayo ti preparation para harvest. Naimbag! 🌾',
    urgency: 'medium'
  }
];

interface DeliveryResult {
  phoneNumber: string;
  status: 'success' | 'failed';
  messageId?: string;
  error?: string;
  timestamp: string;
}

interface BroadcastResponse {
  success: boolean;
  broadcast?: {
    totalSent: number;
    successCount: number;
    errorCount: number;
    successRate: string;
    template?: any;
  };
  results?: DeliveryResult[];
  summary?: {
    message: string;
    characterCount: number;
    timestamp: string;
  };
  error?: string;
  invalidNumbers?: string[];
}

export default function BroadcastSMS() {
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(BROADCAST_TEMPLATES[0]);
  const [customMessage, setCustomMessage] = useState('');
  const [useCustomMessage, setUseCustomMessage] = useState(false);
  const [sending, setSending] = useState(false);
  const [deliveryResults, setDeliveryResults] = useState<DeliveryResult[]>([]);
  const [broadcastSummary, setBroadcastSummary] = useState<BroadcastResponse['broadcast'] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Philippine phone number validation
  const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s+/g, '');
    // Philippine formats: +639XXXXXXXXX, 09XXXXXXXXX, or 639XXXXXXXXX
    const philippinePattern = /^(\+63|63|0)?9\d{9}$/;
    return philippinePattern.test(cleanPhone);
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.startsWith('+63')) return cleanPhone;
    if (cleanPhone.startsWith('63')) return '+' + cleanPhone;
    if (cleanPhone.startsWith('09')) return '+63' + cleanPhone.substring(1);
    if (cleanPhone.startsWith('9')) return '+639' + cleanPhone.substring(1);
    return cleanPhone;
  };

  const parsePhoneNumbers = (): string[] => {
    if (!phoneNumbers.trim()) return [];
    
    return phoneNumbers
      .split(/[,\n]/)
      .map(phone => phone.trim())
      .filter(phone => phone.length > 0);
  };

  const validateAllNumbers = (): { valid: string[], invalid: string[] } => {
    const numbers = parsePhoneNumbers();
    const valid: string[] = [];
    const invalid: string[] = [];

    numbers.forEach(phone => {
      if (validatePhoneNumber(phone)) {
        valid.push(formatPhoneNumber(phone));
      } else {
        invalid.push(phone);
      }
    });

    return { valid, invalid };
  };

  const getCurrentMessage = (): string => {
    return useCustomMessage ? customMessage : selectedTemplate.message;
  };

  const sendBroadcast = async () => {
    const { valid, invalid } = validateAllNumbers();
    
    if (invalid.length > 0) {
      setErrors(invalid.map(phone => `Invalid phone number: ${phone}`));
      return;
    }

    if (valid.length === 0) {
      setErrors(['Please enter at least one valid phone number']);
      return;
    }

    const message = getCurrentMessage();
    if (!message.trim()) {
      setErrors(['Please enter a message or select a template']);
      return;
    }

    setErrors([]);
    setSending(true);
    setDeliveryResults([]);
    setBroadcastSummary(null);

    try {
      // Call the updated broadcast API
      const response = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumbers: valid,
          message: message,
          template: useCustomMessage ? null : {
            id: selectedTemplate.id,
            title: selectedTemplate.title,
            language: selectedTemplate.language,
            category: selectedTemplate.category,
            urgency: selectedTemplate.urgency,
          }
        }),
      });

      const data: BroadcastResponse = await response.json();
      
      if (!response.ok) {
        if (data.invalidNumbers && data.invalidNumbers.length > 0) {
          setErrors([
            data.error || 'Broadcast failed',
            ...data.invalidNumbers.map(phone => `Invalid: ${phone}`)
          ]);
        } else {
          setErrors([data.error || 'Failed to send broadcast']);
        }
        return;
      }

      if (data.success && data.results) {
        setDeliveryResults(data.results);
        setBroadcastSummary(data.broadcast || null);
        
        // Show success message
        if (data.broadcast) {
          console.log(`✅ Broadcast completed: ${data.broadcast.successCount}/${data.broadcast.totalSent} sent successfully`);
        }
      } else {
        setErrors([data.error || 'Unknown error occurred']);
      }

    } catch (error) {
      console.error('Broadcast error:', error);
      setErrors([
        'Network error: ' + (error instanceof Error ? error.message : 'Unable to connect to server')
      ]);
    } finally {
      setSending(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-300 bg-red-50';
      case 'medium': return 'border-yellow-300 bg-yellow-50';
      case 'low': return 'border-green-300 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return 'ℹ️';
      default: return '📢';
    }
  };

  const currentMessage = getCurrentMessage();
  const characterCount = currentMessage.length;
  const phoneCount = validateAllNumbers().valid.length;

  return (
    <AdminLayout>
      <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">📢</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Broadcast SMS to Farmers</h3>
            <p className="text-sm text-gray-500">Send alerts to multiple farmers at once</p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Phone Numbers Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Numbers (Philippine format)
              {phoneCount > 0 && (
                <span className="ml-2 text-green-600 font-normal">
                  ({phoneCount} valid numbers)
                </span>
              )}
            </label>
            <textarea
              value={phoneNumbers}
              onChange={(e) => setPhoneNumbers(e.target.value)}
              placeholder="Enter phone numbers separated by commas or new lines:&#10;+639171234567&#10;09221234568&#10;639331234569"
              rows={4}
              className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none placeholder-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formats: +639171234567, 09171234567, or 639171234567
            </p>
          </div>

          {/* Message Type Toggle */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center">
              <input
                type="radio"
                id="useTemplate"
                name="messageType"
                checked={!useCustomMessage}
                onChange={() => setUseCustomMessage(false)}
                className="mr-2"
              />
              <label htmlFor="useTemplate" className="text-sm font-medium text-gray-700">
                Use Template
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="useCustom"
                name="messageType"
                checked={useCustomMessage}
                onChange={() => setUseCustomMessage(true)}
                className="mr-2"
              />
              <label htmlFor="useCustom" className="text-sm font-medium text-gray-700">
                Custom Message
              </label>
            </div>
          </div>

          {/* Template Selector */}
          {!useCustomMessage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Message Template
              </label>
              <div className="grid grid-cols-1 gap-3">
                {BROADCAST_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedTemplate.id === template.id
                        ? `border-green-300 bg-green-50 ${getUrgencyColor(template.urgency)}`
                        : `border-gray-200 bg-white/60 hover:border-green-200 hover:bg-green-25`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getUrgencyIcon(template.urgency)}</span>
                        <span className="font-medium text-gray-900">{template.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {template.language}
                        </span>
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                          {template.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">{template.message}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      {template.message.length}/160 characters
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Message Input */}
          {useCustomMessage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Message ({customMessage.length}/160)
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Enter your custom message here..."
                rows={4}
                className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none placeholder-gray-400"
              />
            </div>
          )}

          {/* Message Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Preview ({characterCount}/160)
            </label>
            <div className="bg-gray-50 p-4 rounded-xl border">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">🌾</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">
                    TanimBuddy → {phoneCount} farmer{phoneCount !== 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-gray-900">{currentMessage}</div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    {!useCustomMessage && (
                      <>
                        <span>{selectedTemplate.language}</span>
                        <span>•</span>
                        <span>{selectedTemplate.category}</span>
                        <span>•</span>
                        <span className="capitalize">{selectedTemplate.urgency} priority</span>
                      </>
                    )}
                    {useCustomMessage && <span>Custom Message</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <span className="text-red-500 text-lg mt-0.5">❌</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 mb-1">Errors:</p>
                  <ul className="text-xs text-red-600 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Send Button */}
          <Button 
            onClick={sendBroadcast}
            disabled={sending || phoneCount === 0 || !currentMessage.trim()}
            className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {sending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Broadcasting to {phoneCount} farmer{phoneCount !== 1 ? 's' : ''}...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">📢</span>
                <span className="font-medium">
                  Send Broadcast to {phoneCount} Farmer{phoneCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </Button>

          {/* Broadcast Summary */}
          {broadcastSummary && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-500 text-lg">📊</span>
                <h4 className="font-semibold text-blue-800">Broadcast Summary</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-blue-600">Total Sent</p>
                  <p className="font-bold text-blue-800">{broadcastSummary.totalSent}</p>
                </div>
                <div>
                  <p className="text-green-600">Successful</p>
                  <p className="font-bold text-green-800">{broadcastSummary.successCount}</p>
                </div>
                <div>
                  <p className="text-red-600">Failed</p>
                  <p className="font-bold text-red-800">{broadcastSummary.errorCount}</p>
                </div>
                <div>
                  <p className="text-purple-600">Success Rate</p>
                  <p className="font-bold text-purple-800">{broadcastSummary.successRate}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Results */}
          {deliveryResults.length > 0 && (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span>📋</span>
                  Delivery Results ({deliveryResults.length} recipients)
                </h4>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b sticky top-0">
                    <tr>
                      <th className="text-left p-3 font-medium text-gray-700">Phone Number</th>
                      <th className="text-left p-3 font-medium text-gray-700">Status</th>
                      <th className="text-left p-3 font-medium text-gray-700">Message ID</th>
                      <th className="text-left p-3 font-medium text-gray-700">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {deliveryResults.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 font-mono text-xs text-gray-900">
                          {result.phoneNumber}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.status === 'success' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.status === 'success' ? '✅ Delivered' : '❌ Failed'}
                          </span>
                          {result.error && (
                            <div className="text-xs text-red-600 mt-1">{result.error}</div>
                          )}
                        </td>
                        <td className="p-3 text-xs text-gray-500 font-mono">
                          {result.messageId || 'N/A'}
                        </td>
                        <td className="p-3 text-xs text-gray-500">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Info Card */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">💡</span>
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">Production Ready SMS Broadcast</p>
                <p className="text-xs text-blue-600">
                  This broadcast system connects to your Semaphore SMS gateway for real delivery to farmers. 
                  Each message is sent individually with proper error handling and delivery tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
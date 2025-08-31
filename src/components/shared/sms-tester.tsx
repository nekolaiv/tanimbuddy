/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SMSTester() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sendTestSMS = async () => {
    if (!phoneNumber || !message) {
      alert('Please enter both phone number and message');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message,
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        setMessage(''); // Clear message on success
      }
    } catch (error) {
      setResult({ success: false, error: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const sampleMessages = [
    "Kailan magtanim ng palay?",
    "May peste sa kamatis ko",
    "Anong pataba para sa mais?",
    "Kelan ang harvest season?"
  ];

  const characterCount = message.length;
  const isOverLimit = characterCount > 160;

  return (
    <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
          <span className="text-white text-sm">📱</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">SMS Tester</h3>
      </div>
      
      <div className="space-y-6">
        {/* Phone Number Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+639171234567"
              className="w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-lg">🇵🇭</span>
            </div>
          </div>
        </div>

        {/* Sample Messages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Test Messages
          </label>
          <div className="grid grid-cols-1 gap-2">
            {sampleMessages.map((sample, index) => (
              <button
                key={index}
                onClick={() => setMessage(sample)}
                className="text-left p-2 text-xs bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-lg hover:from-green-100 hover:to-blue-100 transition-all duration-200 text-gray-700"
              >
                &quot;{sample}&quot;
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
            <span className={`ml-2 text-xs ${
              isOverLimit ? 'text-red-500' : 'text-gray-500'
            }`}>
              ({characterCount}/160)
            </span>
          </label>
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your farming question here..."
              rows={4}
              className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none placeholder-gray-400 ${
                isOverLimit ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            {isOverLimit && (
              <div className="absolute top-2 right-2">
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                  Too long
                </span>
              </div>
            )}
          </div>
          {isOverLimit && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <span>⚠️</span>
              Message may be split into multiple SMS
            </p>
          )}
        </div>

        {/* Send Button */}
        <Button 
          onClick={sendTestSMS} 
          disabled={loading || !phoneNumber || !message}
          className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Sending SMS...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg group-hover:scale-110 transition-transform duration-300">📤</span>
              <span className="font-medium">Send Test SMS</span>
            </div>
          )}
        </Button>
      </div>

      {/* Results */}
      {result && (
        <div className={`mt-6 p-4 rounded-xl border animate-scale-in ${
          result.success 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800' 
            : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">
              {result.success ? '✅' : '❌'}
            </span>
            <div className="flex-1">
              {result.success ? (
                <div>
                  <p className="font-medium text-sm mb-1">SMS Sent Successfully!</p>
                  <p className="text-xs opacity-80">
                    Message delivered to {phoneNumber}
                  </p>
                  {result.messageId && (
                    <p className="text-xs opacity-60 mt-1">
                      ID: {result.messageId}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="font-medium text-sm mb-1">Send Failed</p>
                  <p className="text-xs opacity-80">
                    {result.error || 'Unknown error occurred'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5">💡</span>
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">Test BantayANI AI</p>
            <p className="text-xs text-blue-600">
              Send a farming question to see how our AI responds. 
              Try asking in Tagalog, Cebuano, or English!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
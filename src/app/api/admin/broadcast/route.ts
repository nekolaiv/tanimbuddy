import { NextRequest, NextResponse } from 'next/server';
import { semaphoreClient } from '@/lib/semaphore';

interface BulkBroadcastRequest {
  phoneNumbers: string[];
  message: string;
  template?: {
    id: string;
    title: string;
    language: string;
    category: string;
    urgency: string;
  };
}

interface BroadcastResult {
  phoneNumber: string;
  status: 'success' | 'failed';
  messageId?: string;
  error?: string;
  timestamp: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: BulkBroadcastRequest = await req.json();
    const { phoneNumbers, message, template } = body;

    // Validate input
    if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Phone numbers array is required' },
        { status: 400 }
      );
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Validate phone numbers format (basic validation)
    const invalidNumbers = phoneNumbers.filter(phone => {
      const cleanPhone = phone.replace(/\s+/g, '');
      const philippinePattern = /^(\+63|63|0)?9\d{9}$/;
      return !philippinePattern.test(cleanPhone);
    });

    if (invalidNumbers.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid phone numbers detected',
          invalidNumbers: invalidNumbers
        },
        { status: 400 }
      );
    }

    // Send SMS to each number
    const results: BroadcastResult[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (const phoneNumber of phoneNumbers) {
      try {
        // Format phone number for API
        const formattedPhone = formatPhoneNumber(phoneNumber);
        
        // Send via Semaphore using the same endpoint as code #1
        const smsResult = await semaphoreClient.sendSMS({
          number: formattedPhone,
          message: message,
          sendername: 'TanimBuddy', // Optional sender name
        });

        console.log(`📤 Broadcast SMS sent to ${formattedPhone}:`, smsResult);

        const result: BroadcastResult = {
          phoneNumber: formattedPhone,
          status: 'success',
          messageId: smsResult.message_id.toString(),
          timestamp: new Date().toISOString(),
        };

        results.push(result);
        successCount++;

      } catch (error) {
        console.error(`❌ SMS failed for ${phoneNumber}:`, error);
        
        const result: BroadcastResult = {
          phoneNumber: phoneNumber,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        };

        results.push(result);
        errorCount++;
      }

      // Small delay to prevent rate limiting (optional)
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Return comprehensive results
    return NextResponse.json({
      success: true,
      broadcast: {
        totalSent: phoneNumbers.length,
        successCount,
        errorCount,
        successRate: ((successCount / phoneNumbers.length) * 100).toFixed(1),
        template: template || null,
      },
      results: results,
      summary: {
        message: message,
        characterCount: message.length,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Bulk Broadcast API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process broadcast request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to format phone numbers consistently
function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/\s+/g, '');
  
  if (cleanPhone.startsWith('+63')) return cleanPhone;
  if (cleanPhone.startsWith('63')) return '+' + cleanPhone;
  if (cleanPhone.startsWith('09')) return '+63' + cleanPhone.substring(1);
  if (cleanPhone.startsWith('9')) return '+639' + cleanPhone.substring(1);
  
  return cleanPhone;
}
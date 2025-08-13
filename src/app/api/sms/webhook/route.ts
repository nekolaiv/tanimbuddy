import { NextRequest, NextResponse } from "next/server";
import { IncomingSMSData } from "@/types/sms";

export async function POST(req: NextRequest) {
  try {
    // Semaphore sends JSON payload for incoming messages
    const payload = await req.json();
    
    console.log('📩 Incoming SMS Webhook:', payload);

    // Extract SMS data from Semaphore payload
    const smsData: IncomingSMSData = {
      from: payload.from || payload.number || payload.recipient,
      message: payload.message || payload.text || '',
      timestamp: payload.created_at || new Date().toISOString(),
      messageId: payload.message_id,
    };

    console.log(`📱 SMS from ${smsData.from}: ${smsData.message}`);

    // TODO: Step 6 - This is where BantayANI will process the message
    const response = await processIncomingSMS(smsData);

    return NextResponse.json({ 
      success: true, 
      processed: true,
      response: response 
    });

  } catch (error) {
    console.error('SMS Webhook Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process SMS webhook' },
      { status: 500 }
    );
  }
}

// Temporary echo processing (will be replaced with BantayANI in Step 6)
async function processIncomingSMS(smsData: IncomingSMSData): Promise<string> {
  const { from, message } = smsData;
  
  // Simple echo response for now
  const response = `Hello! You said: "${message}". TanimBuddy will help you soon! 🌾`;
  
  // Auto-reply via Semaphore
  try {
    // Import here to avoid circular dependency
    const { semaphoreClient } = await import('@/lib/semaphore');
    
    await semaphoreClient.sendSMS({
      number: from,
      message: response,
    });
    
    console.log(`✅ Auto-replied to ${from}`);
    return response;
    
  } catch (error) {
    console.error('Failed to send auto-reply:', error);
    return 'Processing failed';
  }
}
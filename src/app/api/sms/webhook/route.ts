import { NextRequest, NextResponse } from "next/server";
import { IncomingSMSData } from "@/types/sms";
import { bantayANI } from "@/lib/bantayani";
import { semaphoreClient } from "@/lib/semaphore";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    console.log('📩 Incoming SMS Webhook:', payload);

    const smsData: IncomingSMSData = {
      from: payload.from || payload.number || payload.recipient,
      message: payload.message || payload.text || '',
      timestamp: payload.created_at || new Date().toISOString(),
      messageId: payload.message_id,
    };

    console.log(`📱 SMS from ${smsData.from}: ${smsData.message}`);

    // 🧠 Process with BantayANI instead of echo
    const aiResponse = await bantayANI.processMessage({
      message: smsData.message,
      phoneNumber: smsData.from,
      timestamp: smsData.timestamp
    });

    console.log(`🤖 BantayANI Response (${aiResponse.intent}): ${aiResponse.reply}`);

    // Send intelligent reply via Semaphore
    try {
      await semaphoreClient.sendSMS({
        number: smsData.from,
        message: aiResponse.reply,
      });
      
      console.log(`✅ Smart reply sent to ${smsData.from}`);
      
    } catch (smsError) {
      console.error('Failed to send AI reply:', smsError);
    }

    return NextResponse.json({ 
      success: true, 
      processed: true,
      intent: aiResponse.intent,
      confidence: aiResponse.confidence,
      language: aiResponse.language,
      response: aiResponse.reply 
    });

  } catch (error) {
    console.error('SMS Webhook Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process SMS webhook' },
      { status: 500 }
    );
  }
}
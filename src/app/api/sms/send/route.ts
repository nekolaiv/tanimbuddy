import { NextRequest, NextResponse } from "next/server";
import { semaphoreClient } from "@/lib/semaphore";
import { OutgoingSMSData } from "@/types/sms";

export async function POST(req: NextRequest) {
  try {
    const body: OutgoingSMSData = await req.json();
    const { to, message, sendername } = body;

    // Validate input
    if (!to || !message) {
      return NextResponse.json(
        { success: false, error: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    // Send via Semaphore
    const result = await semaphoreClient.sendSMS({
      number: to,
      message: message,
      sendername: sendername,
    });

    console.log(`📤 SMS sent to ${to}:`, result);

    return NextResponse.json({
      success: true,
      messageId: result.message_id,
      recipient: result.recipient,
      status: result.status,
    });

  } catch (error) {
    console.error('Send SMS Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send SMS' },
      { status: 500 }
    );
  }
}
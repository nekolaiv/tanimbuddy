import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const from = formData.get('From') as string;
  const body = formData.get('Body') as string;

  console.log(`📩 SMS from ${from}: ${body}`);

  // Twilio XML response
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(`Hello! You said: "${body}"`);

  return new NextResponse(twiml.toString(), {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}
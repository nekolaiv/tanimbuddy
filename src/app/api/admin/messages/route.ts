/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { DatabaseService } from '@/lib/database';

async function handler(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    
    const messages = await DatabaseService.getRecentMessages(limit);
    
    return NextResponse.json({
      success: true,
      messages: messages.map((msg: { id: any; direction: any; content: any; intent: any; confidence: any; language: any; timestamp: any; farmer: { phoneNumber: any; name: any; location: any; }; error: any; }) => ({
        id: msg.id,
        direction: msg.direction,
        content: msg.content,
        intent: msg.intent,
        confidence: msg.confidence,
        language: msg.language,
        timestamp: msg.timestamp,
        farmer: {
          phoneNumber: msg.farmer.phoneNumber,
          name: msg.farmer.name,
          location: msg.farmer.location,
        },
        error: msg.error,
      })),
    });
  } catch (error) {
    console.error('Messages API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handler);
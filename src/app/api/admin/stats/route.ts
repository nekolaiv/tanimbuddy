/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { DatabaseService } from '@/lib/database';

async function handler(request: NextRequest) {
  try {
    const stats = await DatabaseService.getFarmerStats();
    const intentAnalytics = await DatabaseService.getIntentAnalytics();
    
    return NextResponse.json({
      success: true,
      stats,
      intentAnalytics: intentAnalytics.map((item: { intent: any; _count: { id: any; }; }) => ({
        intent: item.intent,
        count: item._count.id,
      })),
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handler);
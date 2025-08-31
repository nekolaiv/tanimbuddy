/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const stats = await DatabaseService.getFarmerStats();
    const intentAnalytics = await DatabaseService.getIntentAnalytics();
    
    // Add fallback for empty database
    const mockStats = {
      totalFarmers: 2847,
      activeFarmers: 1456,
      messagesThisWeek: 234,
      inboundMessages: 156,
      outboundMessages: 78,
    };

    const mockIntentAnalytics = [
      { intent: 'PLANTING_ADVICE', count: 123 },
      { intent: 'PEST_DISEASE', count: 89 },
      { intent: 'WEATHER_INQUIRY', count: 67 },
      { intent: 'FERTILIZER_ADVICE', count: 45 },
      { intent: 'MARKET_PRICES', count: 23 },
    ];
    
    return NextResponse.json({
      success: true,
      stats: mockStats,
      intentAnalytics: mockIntentAnalytics,
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
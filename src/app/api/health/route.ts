import { NextResponse } from "next/server";
import { semaphoreClient } from "@/lib/semaphore";

export async function GET() {
  try {
    // Check Semaphore connection
    const accountInfo = await semaphoreClient.getAccountInfo();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        semaphore: {
          status: 'connected',
          account: accountInfo.account_name || 'Unknown',
          credits: accountInfo.credit_balance || 'Unknown',
        }
      }
    });
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Semaphore connection failed'
      },
      { status: 503 }
    );
  }
}
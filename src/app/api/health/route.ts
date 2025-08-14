/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { semaphoreClient } from "@/lib/semaphore";
import { testOpenAIConnection } from "@/lib/bantayani/openai-client";

export async function GET() {
  try {
    // Test all service connections
    const [semaphoreHealthy, openaiHealthy] = await Promise.allSettled([
      semaphoreClient.getAccountInfo(),
      testOpenAIConnection()
    ]);
    
    const semaphoreStatus = semaphoreHealthy.status === 'fulfilled';
    const openaiStatus = openaiHealthy.status === 'fulfilled' && openaiHealthy.value;
    
    const overallHealthy = semaphoreStatus && openaiStatus;
    
    return NextResponse.json({
      status: overallHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        semaphore: {
          status: semaphoreStatus ? 'connected' : 'failed',
          account: semaphoreStatus ? (semaphoreHealthy as any).value?.account_name : 'Unknown',
          credits: semaphoreStatus ? (semaphoreHealthy as any).value?.credit_balance : 'Unknown',
        },
        bantayani: {
          status: openaiStatus ? 'connected' : 'failed',
          engine: 'OpenAI GPT-4o-mini'
        }
      }
    }, {
      status: overallHealthy ? 200 : 503
    });
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Multiple service failures'
      },
      { status: 503 }
    );
  }
}
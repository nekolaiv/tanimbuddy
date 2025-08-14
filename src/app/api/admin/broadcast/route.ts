import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/database';
import { semaphoreClient } from '@/lib/semaphore';

interface BroadcastRequest {
  title: string;
  content: string;
  alertType: 'weather' | 'pest' | 'market' | 'planting' | 'general';
  urgency: 'low' | 'medium' | 'high';
  targetCrops?: string[];
  targetRegions?: string[];
  language: 'tagalog' | 'cebuano' | 'ilocano' | 'english';
  sendImmediately: boolean;
}

async function handler(request: NextRequest) {
  try {
    const data: BroadcastRequest = await request.json();
    
    // Create alert record
    const alert = await db.alert.create({
      data: {
        title: data.title,
        content: data.content,
        alertType: data.alertType,
        urgency: data.urgency,
        targetCrops: data.targetCrops ? JSON.stringify(data.targetCrops) : null,
        targetRegions: data.targetRegions ? JSON.stringify(data.targetRegions) : null,
        language: data.language,
        createdBy: 'admin', // TODO: Add proper admin user system
        status: data.sendImmediately ? 'sent' : 'draft',
        sentAt: data.sendImmediately ? new Date() : null,
      }
    });
    
    if (data.sendImmediately) {
      // Get target farmers
      const farmers = await db.farmer.findMany({
        where: {
          isActive: true,
          language: data.language, // Filter by language
        }
      });
      
      // Send broadcast
      let successCount = 0;
      let errorCount = 0;
      
      for (const farmer of farmers) {
        try {
          await semaphoreClient.sendSMS({
            number: farmer.phoneNumber,
            message: data.content,
          });
          
          // Log successful delivery
          await db.alertRecipient.create({
            data: {
              alertId: alert.id,
              farmerId: farmer.id,
              sentAt: new Date(),
              delivered: true,
            }
          });
          
          successCount++;
        } catch (error) {
          // Log failed delivery
          await db.alertRecipient.create({
            data: {
              alertId: alert.id,
              farmerId: farmer.id,
              delivered: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            }
          });
          
          errorCount++;
        }
      }
      
      return NextResponse.json({
        success: true,
        alertId: alert.id,
        broadcast: {
          totalFarmers: farmers.length,
          successCount,
          errorCount,
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      alertId: alert.id,
      status: 'draft',
    });
    
  } catch (error) {
    console.error('Broadcast API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create broadcast' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(handler);
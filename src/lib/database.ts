/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// Helper functions for common operations
export class DatabaseService {
  
  static async findOrCreateFarmer(phoneNumber: string, additionalData?: {
    name?: string;
    location?: string; 
    language?: string;
  }) {
    return await db.farmer.upsert({
      where: { phoneNumber },
      update: { 
        lastActive: new Date(),
        ...additionalData
      },
      create: {
        phoneNumber,
        lastActive: new Date(),
        ...additionalData
      },
    });
  }
  
  static async logMessage(data: {
    phoneNumber: string;
    direction: 'inbound' | 'outbound';
    content: string;
    intent?: string;
    confidence?: number;
    language?: string;
    metadata?: any;
    error?: string;
  }) {
    const farmer = await this.findOrCreateFarmer(data.phoneNumber);
    
    return await db.message.create({
      data: {
        farmerId: farmer.id,
        direction: data.direction,
        content: data.content,
        intent: data.intent,
        confidence: data.confidence,
        language: data.language,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        error: data.error,
        processed: !data.error,
      },
    });
  }
  
  static async getRecentMessages(limit = 50) {
    return await db.message.findMany({
      take: limit,
      orderBy: { timestamp: 'desc' },
      include: {
        farmer: {
          select: {
            phoneNumber: true,
            name: true,
            location: true,
            language: true,
          }
        }
      }
    });
  }
  
  static async getFarmerStats() {
    const totalFarmers = await db.farmer.count();
    const activeFarmers = await db.farmer.count({
      where: {
        lastActive: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });
    
    const messageStats = await db.message.groupBy({
      by: ['direction'],
      _count: {
        id: true
      },
      where: {
        timestamp: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    });
    
    return {
      totalFarmers,
      activeFarmers,
      messagesThisWeek: messageStats.reduce((sum: any, stat: { _count: { id: any; }; }) => sum + stat._count.id, 0),
      inboundMessages: messageStats.find((s: { direction: string; }) => s.direction === 'inbound')?._count.id || 0,
      outboundMessages: messageStats.find((s: { direction: string; }) => s.direction === 'outbound')?._count.id || 0,
    };
  }
  
  static async getIntentAnalytics() {
    return await db.message.groupBy({
      by: ['intent'],
      _count: {
        id: true
      },
      where: {
        direction: 'inbound',
        intent: {
          not: null
        },
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });
  }
  
  static async logSystemEvent(level: 'info' | 'warn' | 'error' | 'debug', category: string, message: string, metadata?: any) {
    return await db.systemLog.create({
      data: {
        level,
        category,
        message,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  }
}
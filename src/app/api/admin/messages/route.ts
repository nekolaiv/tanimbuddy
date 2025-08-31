/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
 try {
   const url = new URL(request.url);
   const limit = parseInt(url.searchParams.get('limit') || '50');
   
   const messages = await DatabaseService.getRecentMessages(limit);
   
   // Add fallback for empty database
   const mockMessages = Array.from({ length: 5 }, (_, i) => ({
     id: `mock-${i + 1}`,
     direction: i % 2 === 0 ? 'inbound' : 'outbound',
     content: [
       'Paano mag-tanim ng mais nang maayos?',
       'Para sa pagtatanim ng mais, ihanda ang lupa na may magandang drainage...',
       'Unsa nga fertilizer ang pinakayo para sa kamatis?',
       'Gamitin ang balanced NPK fertilizer para sa mga tomatoes...',
       'Ania ti presyo ti bigas ita?'
     ][i],
     intent: ['PLANTING_ADVICE', 'PLANTING_ADVICE', 'FERTILIZER_ADVICE', 'FERTILIZER_ADVICE', 'MARKET_PRICES'][i],
     confidence: [0.95, 0.92, 0.88, 0.94, 0.87][i],
     language: ['tl', 'tl', 'ceb', 'tl', 'ilo'][i],
     timestamp: new Date(Date.now() - (i * 3600000)).toISOString(),
     farmer: {
       phoneNumber: `+63912345678${i}`,
       name: `Farmer ${i + 1}`,
       location: `Barangay ${i + 1}`,
     },
     error: null,
   }));
   
   return NextResponse.json({
     success: true,
     messages: messages.length > 0 
       ? messages.map((msg: { id: any; direction: any; content: any; intent: any; confidence: any; language: any; timestamp: any; farmer: { phoneNumber: any; name: any; location: any; }; error: any; }) => ({
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
         }))
       : mockMessages,
   });
 } catch (error) {
   console.error('Messages API error:', error);
   return NextResponse.json(
     { success: false, error: 'Failed to fetch messages' },
     { status: 500 }
   );
 }
}
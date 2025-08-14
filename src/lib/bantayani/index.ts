/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { openai } from './openai-client';
import { classifyIntent, FarmerIntent } from './intent-classifier';
import { generateCropAdvice } from './crop-advisor';
import { generateWeatherAlert } from './weather-advisor';
import { localizeMesage } from './localizer';
import { detectLanguage, SupportedLanguage } from './language-detector';

export interface BantayANIRequest {
  message: string;
  phoneNumber: string;
  timestamp: string;
}

export interface BantayANIResponse {
  reply: string;
  intent: FarmerIntent;
  confidence: number;
  language: SupportedLanguage;
  metadata?: {
    crop?: string;
    location?: string;
    urgency?: 'low' | 'medium' | 'high';
  };
}

export class BantayANI {
  /**
   * Main processing function - the brain of TanimBuddy
   */
  async processMessage(request: BantayANIRequest): Promise<BantayANIResponse> {
    const { message, phoneNumber, timestamp } = request;
    
    console.log(`🧠 BantayANI processing: "${message}" from ${phoneNumber}`);
    
    try {
      // Step 1: Detect language (Tagalog, Cebuano, Ilocano, English)
      const language = detectLanguage(message);
      console.log(`🗣️ Detected language: ${language}`);
      
      // Step 2: Classify farmer's intent
      const intentResult = await classifyIntent(message, language);
      console.log(`🎯 Intent: ${intentResult.intent} (${intentResult.confidence}%)`);
      
      // Step 3: Generate appropriate response based on intent
      let response: string;
      let metadata: any = {};
      
      switch (intentResult.intent) {
        case 'PLANTING_ADVICE':
          response = await generateCropAdvice(message, language, intentResult.entities);
          metadata.crop = intentResult.entities.crop;
          break;
          
        case 'PEST_DISEASE':
          response = await this.handlePestDisease(message, language, intentResult.entities);
          metadata.urgency = 'high';
          break;
          
        case 'WEATHER_INQUIRY':
          response = await generateWeatherAlert(intentResult.entities.location || 'General', language);
          metadata.location = intentResult.entities.location;
          break;
          
        case 'FERTILIZER_ADVICE':
          response = await this.handleFertilizerAdvice(message, language, intentResult.entities);
          metadata.crop = intentResult.entities.crop;
          break;
          
        case 'MARKET_PRICES':
          response = await this.handleMarketPrices(message, language, intentResult.entities);
          metadata.crop = intentResult.entities.crop;
          break;
          
        case 'GENERAL_QUESTION':
          response = await this.handleGeneralQuestion(message, language);
          break;
          
        default:
          response = await this.handleUnknownIntent(message, language);
          break;
      }
      
      // Step 4: Localize and optimize for SMS (160 char limit awareness)
      const localizedResponse = await localizeMesage(response, language);
      
      return {
        reply: localizedResponse,
        intent: intentResult.intent,
        confidence: intentResult.confidence,
        language: language,
        metadata: metadata
      };
      
    } catch (error) {
      console.error('BantayANI Error:', error);
      
      // Fallback response in detected language
      const language = detectLanguage(message);
      const fallbackMessage = this.getFallbackMessage(language);
      
      return {
        reply: fallbackMessage,
        intent: 'UNKNOWN',
        confidence: 0,
        language: language
      };
    }
  }
  
  private async handlePestDisease(message: string, language: SupportedLanguage, entities: any): Promise<string> {
    const prompt = this.buildPrompt('PEST_DISEASE', message, language, entities);
    return await this.generateResponse(prompt);
  }
  
  private async handleFertilizerAdvice(message: string, language: SupportedLanguage, entities: any): Promise<string> {
    const prompt = this.buildPrompt('FERTILIZER_ADVICE', message, language, entities);
    return await this.generateResponse(prompt);
  }
  
  private async handleMarketPrices(message: string, language: SupportedLanguage, entities: any): Promise<string> {
    const prompt = this.buildPrompt('MARKET_PRICES', message, language, entities);
    return await this.generateResponse(prompt);
  }
  
  private async handleGeneralQuestion(message: string, language: SupportedLanguage): Promise<string> {
    const prompt = this.buildPrompt('GENERAL_QUESTION', message, language);
    return await this.generateResponse(prompt);
  }
  
  private async handleUnknownIntent(message: string, language: SupportedLanguage): Promise<string> {
    const prompt = this.buildPrompt('UNKNOWN', message, language);
    return await this.generateResponse(prompt);
  }
  
  private buildPrompt(intent: string, message: string, language: SupportedLanguage, entities?: any): ChatCompletionMessageParam[] {
    const systemPrompt = this.getSystemPrompt(intent, language);
    
    return [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: message
      }
    ];
  }
  
  private getSystemPrompt(intent: string, language: SupportedLanguage): string {
    const baseContext = `You are BantayANI, a helpful Filipino farming assistant. You provide practical, actionable advice to smallholder farmers in the Philippines.

CRITICAL RULES:
- Keep responses SHORT (max 160 characters when possible, never exceed 300)
- Use simple, respectful Filipino language appropriate for farmers
- Be encouraging and supportive ("Kaya mo yan!", "Maganda yan!")
- Include relevant emojis sparingly (🌾🌱💧)
- Give specific, actionable advice
- Consider Philippine climate and farming practices
- Use local crop varieties and farming methods when relevant`;

    const languageContext = language === 'tagalog' 
      ? 'Respond primarily in Tagalog with some English terms farmers commonly use.'
      : language === 'cebuano'
      ? 'Respond primarily in Cebuano with some English terms farmers commonly use.'
      : language === 'ilocano'
      ? 'Respond primarily in Ilocano with some English terms farmers commonly use.'
      : 'Respond in simple English with some Filipino terms farmers understand.';

    const intentContext = this.getIntentSpecificContext(intent);
    
    return `${baseContext}\n\n${languageContext}\n\n${intentContext}`;
  }
  
  private getIntentSpecificContext(intent: string): string {
    switch (intent) {
      case 'PLANTING_ADVICE':
        return 'Focus on planting schedules, seed varieties, land preparation, and timing based on Philippine seasons (wet/dry season).';
        
      case 'PEST_DISEASE':
        return 'Provide immediate, practical solutions for pest/disease problems. Include organic/natural remedies when possible. Be urgent but reassuring.';
        
      case 'WEATHER_INQUIRY':
        return 'Give weather-related farming advice. Consider typhoon season, El Niño/La Niña effects on Philippine agriculture.';
        
      case 'FERTILIZER_ADVICE':
        return 'Recommend appropriate fertilizers (organic preferred), application timing, and dosage for specific crops and Philippine soil conditions.';
        
      case 'MARKET_PRICES':
        return 'Provide general market advice, best practices for selling, and timing recommendations. Acknowledge you may not have current price data.';
        
      case 'GENERAL_QUESTION':
        return 'Answer general farming questions with practical, Philippines-specific advice. Stay within your agricultural knowledge scope.';
        
      default:
        return 'Help the farmer as best you can, or politely redirect them to ask about specific farming topics you can help with.';
    }
  }
  
  private async generateResponse(messages: ChatCompletionMessageParam[]): Promise<string> {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: messages,
      max_tokens: 150, // Keep responses short
      temperature: 0.7,
    });
    
    return completion.choices[0]?.message?.content || 'Hindi ko po maintindihan. Magtanong na lang ulit. 🌾';
  }
  
  private getFallbackMessage(language: SupportedLanguage): string {
    switch (language) {
      case 'tagalog':
        return 'Pasensya po, may problema sa system. Subukan nyo ulit mamaya. Salamat! 🌾';
      case 'cebuano':
        return 'Pasaylo, adunay problema sa sistema. Sulayi pag-usab unya. Salamat! 🌾';
      case 'ilocano':
        return 'Pakawan yo, adda problema ti sistema. Padasenyo manen inton damdama. Agyaman! 🌾';
      default:
        return 'Sorry, system problem. Please try again later. Thank you! 🌾';
    }
  }
}

// Singleton instance
export const bantayANI = new BantayANI();
import { openai } from './openai-client';
import { SupportedLanguage } from './language-detector';

export type FarmerIntent = 
  | 'PLANTING_ADVICE'
  | 'PEST_DISEASE' 
  | 'WEATHER_INQUIRY'
  | 'FERTILIZER_ADVICE'
  | 'MARKET_PRICES'
  | 'GENERAL_QUESTION'
  | 'UNKNOWN';

export interface IntentResult {
  intent: FarmerIntent;
  confidence: number;
  entities: {
    crop?: string;
    location?: string;
    pest?: string;
    disease?: string;
    fertilizer?: string;
  };
}

export async function classifyIntent(message: string, language: SupportedLanguage): Promise<IntentResult> {
  try {
    const prompt = `Classify this Filipino farmer's message and extract entities.

Message: "${message}"
Language: ${language}

Respond with JSON only:
{
  "intent": "PLANTING_ADVICE|PEST_DISEASE|WEATHER_INQUIRY|FERTILIZER_ADVICE|MARKET_PRICES|GENERAL_QUESTION|UNKNOWN",
  "confidence": 0-100,
  "entities": {
    "crop": "crop name if mentioned",
    "location": "location if mentioned", 
    "pest": "pest name if mentioned",
    "disease": "disease if mentioned",
    "fertilizer": "fertilizer type if mentioned"
  }
}

Examples:
- "Kailan magtanim ng palay?" → {"intent": "PLANTING_ADVICE", "confidence": 95, "entities": {"crop": "palay"}}
- "May sakit ang mais ko" → {"intent": "PEST_DISEASE", "confidence": 90, "entities": {"crop": "mais", "disease": "unknown"}}
- "Magkano ba ang kamatis ngayon?" → {"intent": "MARKET_PRICES", "confidence": 85, "entities": {"crop": "kamatis"}}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.1, // Low temperature for consistent classification
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from OpenAI');

    const result = JSON.parse(response) as IntentResult;
    
    // Validate result
    if (!result.intent || typeof result.confidence !== 'number') {
      throw new Error('Invalid classification result');
    }

    return result;

  } catch (error) {
    console.error('Intent classification failed:', error);
    
    // Fallback to rule-based classification
    return fallbackClassification(message);
  }
}

function fallbackClassification(message: string): IntentResult {
  const lowerMessage = message.toLowerCase();
  
  // Simple keyword-based fallback
  if (lowerMessage.includes('tanim') || lowerMessage.includes('plant')) {
    return {
      intent: 'PLANTING_ADVICE',
      confidence: 60,
      entities: {}
    };
  }
  
  if (lowerMessage.includes('peste') || lowerMessage.includes('sakit') || lowerMessage.includes('pest')) {
    return {
      intent: 'PEST_DISEASE', 
      confidence: 60,
      entities: {}
    };
  }
  
  if (lowerMessage.includes('ulan') || lowerMessage.includes('weather') || lowerMessage.includes('panahon')) {
    return {
      intent: 'WEATHER_INQUIRY',
      confidence: 60, 
      entities: {}
    };
  }
  
  if (lowerMessage.includes('pataba') || lowerMessage.includes('fertilizer')) {
    return {
      intent: 'FERTILIZER_ADVICE',
      confidence: 60,
      entities: {}
    };
  }
  
  if (lowerMessage.includes('presyo') || lowerMessage.includes('magkano') || lowerMessage.includes('price')) {
    return {
      intent: 'MARKET_PRICES',
      confidence: 60,
      entities: {}
    };
  }
  
  return {
    intent: 'GENERAL_QUESTION',
    confidence: 30,
    entities: {}
  };
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupportedLanguage } from './language-detector';
import { openai } from './openai-client';

export async function generateCropAdvice(
  message: string, 
  language: SupportedLanguage, 
  entities: any
): Promise<string> {
  const crop = entities.crop || 'general crops';
  
  const prompt = `You are BantayANI, a Filipino farming expert. A farmer asks: "${message}"

Provide SHORT, practical planting advice for ${crop} in the Philippines.

Consider:
- Philippine seasons (wet: June-November, dry: December-May)
- Common Filipino farming practices
- Local crop varieties 
- Smallholder farmer resources

Respond in ${language} language, max 160 characters.
Be encouraging and specific.
Include timing, preparation, or variety recommendations.`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || getDefaultCropAdvice(crop, language);
  } catch (error) {
    console.error('Crop advice generation failed:', error);
    return getDefaultCropAdvice(crop, language);
  }
}

function getDefaultCropAdvice(crop: string, language: SupportedLanguage): string {
  switch (language) {
    case 'tagalog':
      return `Para sa ${crop}: Mag-prepare ng lupa, piliin ang magandang binhi, at sundin ang tamang spacing. Kaya mo yan! 🌱`;
    case 'cebuano':
      return `Para sa ${crop}: Pag-andam sa yuta, pilia ang maayong liso, ug sunda ang hustong gilay-on. Kaya nimo! 🌱`;
    case 'ilocano':
      return `Para ti ${crop}: Isagana ti daga, piliem ti nasayaat a bukel, ken tungpalen ti umno a panagkaadayo. Kabaelam! 🌱`;
    default:
      return `For ${crop}: Prepare soil, choose good seeds, follow proper spacing. You can do it! 🌱`;
  }
}
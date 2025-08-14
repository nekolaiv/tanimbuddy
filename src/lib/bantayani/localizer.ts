import { SupportedLanguage } from './language-detector';

export async function localizeMesage(message: string, language: SupportedLanguage): Promise<string> {
  // Ensure message fits SMS character limits
  let localizedMessage = message;
  
  // Truncate if too long, preserving meaning
  if (localizedMessage.length > 160) {
    localizedMessage = localizedMessage.substring(0, 157) + '...';
  }
  
  // Add respectful closing based on language
  if (localizedMessage.length < 140) {
    const closing = getPoliteClosing(language);
    if (localizedMessage.length + closing.length <= 160) {
      localizedMessage += ` ${closing}`;
    }
  }
  
  return localizedMessage;
}

function getPoliteClosing(language: SupportedLanguage): string {
  switch (language) {
    case 'tagalog':
      return 'Salamat po! 🌾';
    case 'cebuano':
      return 'Salamat! 🌾';
    case 'ilocano':
      return 'Agyaman! 🌾';
    default:
      return 'Thank you! 🌾';
  }
}
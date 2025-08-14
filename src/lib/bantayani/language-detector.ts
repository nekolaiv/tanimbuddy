export type SupportedLanguage = 'tagalog' | 'cebuano' | 'ilocano' | 'english';

export function detectLanguage(message: string): SupportedLanguage {
  const lowerMessage = message.toLowerCase();
  
  // Tagalog indicators
  const tagalogKeywords = [
    'ako', 'ikaw', 'siya', 'namin', 'kayo', 'sila',
    'ang', 'ng', 'mga', 'sa', 'at', 'o',
    'tanim', 'pananim', 'ani', 'bukid', 'magsasaka',
    'ulan', 'araw', 'gabi', 'umaga',
    'kamatis', 'palay', 'mais', 'saging'
  ];
  
  // Cebuano indicators
  const cebuanoKeywords = [
    'ako', 'ikaw', 'siya', 'nato', 'ninyo', 'sila',
    'ang', 'sa', 'mga', 'ug', 'o',
    'tanom', 'ani', 'uma', 'mag-uuma',
    'ulan', 'adlaw', 'gabii', 'buntag',
    'kamatis', 'humay', 'mais', 'saging'
  ];
  
  // Ilocano indicators  
  const ilocanoKeywords = [
    'siak', 'sika', 'isuna', 'datayo', 'dakayo', 'isuda',
    'ti', 'iti', 'dagiti', 'ken', 'wenno',
    'mula', 'apit', 'taltalon', 'mannalon',
    'tudo', 'aldaw', 'rabii', 'bigat',
    'kamatis', 'pagay', 'mais', 'saba'
  ];
  
  let tagalogScore = 0;
  let cebuanoScore = 0; 
  let ilocanoScore = 0;
  
  // Count keyword matches
  tagalogKeywords.forEach(keyword => {
    if (lowerMessage.includes(keyword)) tagalogScore++;
  });
  
  cebuanoKeywords.forEach(keyword => {
    if (lowerMessage.includes(keyword)) cebuanoScore++;
  });
  
  ilocanoKeywords.forEach(keyword => {
    if (lowerMessage.includes(keyword)) ilocanoScore++;
  });
  
  // Determine language based on highest score
  if (tagalogScore >= cebuanoScore && tagalogScore >= ilocanoScore && tagalogScore > 0) {
    return 'tagalog';
  }
  
  if (cebuanoScore >= ilocanoScore && cebuanoScore > 0) {
    return 'cebuano';
  }
  
  if (ilocanoScore > 0) {
    return 'ilocano';
  }
  
  // Default to English if no local language detected
  return 'english';
}
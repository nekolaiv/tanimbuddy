import { SupportedLanguage } from './language-detector';

export async function generateWeatherAlert(
  location: string, 
  language: SupportedLanguage
): Promise<string> {
  // For now, return general weather farming advice
  // TODO: Integrate with actual weather APIs (PAGASA, OpenWeather)
  
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const isWetSeason = currentMonth >= 6 && currentMonth <= 11;
  
  return getSeasonalAdvice(isWetSeason, location, language);
}

function getSeasonalAdvice(isWetSeason: boolean, location: string, language: SupportedLanguage): string {
  if (isWetSeason) {
    // Wet season advice (June-November)
    switch (language) {
      case 'tagalog':
        return 'Tag-ulan ngayon. Mag-ingat sa sobrang tubig, gumawa ng drainage, at bantayan ang fungal diseases. 🌧️';
      case 'cebuano':
        return 'Ting-ulan karon. Pag-amping sa sobrang tubig, himoa drainage, ug bantayi ang sakit sa tanum. 🌧️';
      case 'ilocano':
        return 'Tiempo ti tudo ita. Agannad ti sobra a danum, mangaramid ti pagayusan ti danum, ken bantayan ti sakit dagiti mula. 🌧️';
      default:
        return 'Rainy season now. Watch for excess water, make drainage, monitor plant diseases. 🌧️';
    }
  } else {
    // Dry season advice (December-May)
    switch (language) {
      case 'tagalog':
        return 'Tag-init ngayon. Mag-ipon ng tubig, gumamit ng mulch, at mag-irrigate ng regular. ☀️';
      case 'cebuano':
        return 'Ting-init karon. Mag-tipig ug tubig, gamita ang mulch, ug regular nga tubig. ☀️';
      case 'ilocano':
        return 'Tiempo ti pudot ita. Mangurnong ti danum, agusar ti mulch, ken regular nga sibog. ☀️';
      default:
        return 'Dry season now. Conserve water, use mulch, irrigate regularly. ☀️';
    }
  }
}
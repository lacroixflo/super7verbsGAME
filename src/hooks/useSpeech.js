import { useState, useEffect } from 'react';

export const useSpeech = () => {
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const speak = (text, lang = 'fr-FR') => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang;
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.volume = 1;
          
          const voices = window.speechSynthesis.getVoices();
          const frenchVoice = voices.find(voice => voice.lang.includes('fr'));
          if (frenchVoice) utterance.voice = frenchVoice;
          
          utterance.onend = () => {
            setHasPlayedAudio(true);
            resolve();
          };
          
          utterance.onerror = () => {
            setHasPlayedAudio(true);
            resolve();
          };
          
          try {
            window.speechSynthesis.speak(utterance);
          } catch (error) {
            console.error('Speech error:', error);
            setHasPlayedAudio(true);
            resolve();
          }
        }, 100);
      } else {
        setHasPlayedAudio(true);
        resolve();
      }
    });
  };

  return { speak, hasPlayedAudio };
};

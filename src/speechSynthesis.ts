import type Step from "types/Step";
import type SpeechSynthesisOptions from 'types/SpeechSynthesisOptions'

export const getSpeakText = (step:Step):string => {
  const { message, metadata = {} }:Step = step;
  
  if(typeof metadata.speak === 'string') {
    return metadata.speak;
  }

  if(typeof message === 'string') {
    return message;
  }

  return '';
  
};

export const speakFn: (speechSynthesisOptions:SpeechSynthesisOptions) => (step:Step, previousValue:string) => void = (speechSynthesisOptions) => (step, previousValue) => {
  const { lang, voice, enable } = speechSynthesisOptions;
  const { user } = step;

  if (!window.SpeechSynthesisUtterance || !window.speechSynthesis) {
    return;
  }

  if (user) {
    return;
  }
  
  if (!enable) {
    return;
  }
  const text = getSpeakText(step);
  const msg = new window.SpeechSynthesisUtterance();

  msg.text = text.replace(/{previousValue}/g, previousValue);
  msg.lang = lang;
  msg.voice = voice;

  window.speechSynthesis.speak(msg);
};
import { pitchSlider, rateSlider } from "./dom";

let synth: SpeechSynthesis;
let voices: SpeechSynthesisVoice[];

export const initSpeech = () => {
  synth = window.speechSynthesis;
  // It's possible that the voices are not loaded yet.
  // We need to listen for the voiceschanged event.
  synth.onvoiceschanged = () => {
    voices = synth.getVoices();
  };
  voices = synth.getVoices();
};

export const speak = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!synth) {
      const err = "Speech synthesis not initialized.";
      console.error(err);
      return reject(err);
    }
    // Cancel any pending speech to prevent overlap.
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const koreanVoice = voices.find((voice) => voice.lang === "ko-KR");
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    } else {
      console.warn("Korean voice not found. Using default voice.");
    }
    utterance.pitch = parseFloat(pitchSlider.value);
    utterance.rate = parseFloat(rateSlider.value);

    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      reject(event.error);
    };

    synth.speak(utterance);
  });
};

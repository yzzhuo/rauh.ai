"use client";
import { useState } from 'react';

export const usePlayVoice = () => {
  const [audio] = useState(new Audio());
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const play = () => {
    if (audioSrc) {
      audio.src = audioSrc;
      audio.play();
    }
  };

  const playSpeech = async (text: string) => {
    const res = await fetch('/api/textToSpeech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    const data = await res.blob();
    const url = URL.createObjectURL(data);
    setAudioSrc(url);
    play();
  };


  return { playSpeech };
};
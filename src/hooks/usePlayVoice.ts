"use client";
import { useEffect, useState } from 'react';

export const usePlayVoice = () => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 仅在客户端环境中执行
      const audioElement = new Audio('');
      setAudio(audioElement);
      // 清理函数，防止组件卸载时出现内存泄漏
      return () => {
        audioElement.pause();
        setAudio(null);
      };
    }
  }, []);

  const play = async (url: string) => {
    // finish when audio finish playing
    return new Promise((resolve) => {
      const audio = new Audio();
      if (url) {
        audio.src = url;
        audio.play();
      }
      audio.onended = () => {
        resolve(true);
      };
    });
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
    await play(url);
  };


  return { playSpeech };
};
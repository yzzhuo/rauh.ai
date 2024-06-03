"use client";
import { useEffect, useRef } from 'react';

export const usePlayVoice = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 仅在客户端环境中执行
      const audioElement = new Audio('');
      audioRef.current = audioElement;
      // 清理函数，防止组件卸载时出现内存泄漏
      return () => {
        audioElement.pause();
        audioRef.current = null;
      };
    }
  }, []);

  const play = async (url: string) => {
    // finish when audio finish playing
    return new Promise((resolve) => {
      if (!audioRef.current) {
        audioRef.current = new Audio('');
      }
      if (url) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
      audioRef.current.onended = () => {
        resolve(true);
      };
    });
  };

  const playSpeech = async (text: string) => {
    if (process.env.NEXT_PUBLIC_NO_VOICE === 'true') return;
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
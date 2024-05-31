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

  const play = (url: string) => {
    const audio = new Audio();
    console.log('22audioSrc', url);
    console.log('audio', audio);
    if (url) {
      audio.src = url;
      console.log('33audioSrc', url);
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
    console.log('audio data===', data);
    const url = URL.createObjectURL(data);
    play(url);
  };


  return { playSpeech };
};
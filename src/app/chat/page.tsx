"use client";
import Image from "next/image";
import { IconButton, Flex, Text } from "@radix-ui/themes";
import { MessageProps, useVoiceChat } from "../../hooks/useVoiceChat";
import { useEffect, useRef, useState } from "react";

import { Mic, X } from "lucide-react";
import { Waveform } from "../components/wave-shape";
import { BackgroundBeams } from "../components/beams-bg";
import HumeAI from "../hume/page";
import SmileyFace from "../components/smell-face";

export default function Home() {
  const {
    startRecording,
    stopRecording,
    recording,
    inputDisabled,
    // threadId,
    messages,
    input,
    handleSubmit,
    setInput,
  } = useVoiceChat();
  const inputRef = useRef<HTMLInputElement>(null);

  // 处理音频相关逻辑，主要是自动开启/停止录音
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const data = new Uint8Array(analyser.frequencyBinCount);

    let timeoutId: NodeJS.Timeout | null = null;

    const checkVolume = (volume: number) => {
      if (volume > 10 && !recording) {
        // timeoutId = setTimeout(startRecording, 2000);
        console.log("start recording");
      } else if (volume < 10 && recording) {
        // timeoutId = setTimeout(stopRecording, 2000);
        console.log("stop recording");
      }
    };

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const intervalId = setInterval(() => {
        analyser.getByteFrequencyData(data);
        const volume = data.reduce((a, b) => a + b, 0) / data.length;
        setVolume(volume);
        checkVolume(volume);
      }, 100);

      return () => {
        clearInterval(intervalId);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        audioContext.close();
      };
    });
  }, [recording]);



  // When text change, set the text to the input and submit the message
  const handleClickRecord = () => {
    if (!recording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  return (
    <main className="flex h-screen">
      <div className="flex flex-auto overflow-hidden flex-col items-center justify-between p-24">

        <SmileyFace />

        <div className="flex flex-col items-center mt-8 gap-4">

          <Waveform />

          <p>
            {recording
              ? "Recording..."
              : "Click the microphone to start recording"}
          </p>
          <p>Volume: {volume.toFixed(2)}</p>
        </div>

        <div className="mb-32 mt-24 flex text-center justify-center lg:mb-0 lg:w-full lg:max-w-5xl gap-12">
          <IconButton
            radius="full"
            size="4"
            variant="soft"
            color="gray"
            onClick={handleClickRecord}
          >
            <Mic width="24" height="24" />
          </IconButton>

          <IconButton
            radius="full"
            variant="soft"
            color="red"
            size="4"
          // onClick={handlePlay}
          >
            <X width="24" height="24" />
          </IconButton>
        </div>
      </div>

      <aside className="w-1/4 bg-gray-100 rounded-md m-4">


        <div className="p-4">
          <div className="flex flex-col w-full max-w-md mx-auto justify-start">
            {messages.map((m: MessageProps, index) => (
              <div key={index} className="whitespace-pre-wrap">
                <strong>{`${m.role}: `}</strong>
                {/* <div className="h-4 m-2 bg-yellow-500 rounded-sm">{m.text}</div> */}
                <ChatBubble text={m.text} />
                <br />
              </div>
            ))}

            {inputDisabled && (
              <div className="w-full h-8 max-w-md p-2 mb-8 bg-gray-300 rounded-lg dark:bg-gray-600 animate-pulse" />
            )}

            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                disabled={inputDisabled}
                className="fixed  p-2 mb-8 border border-gray-300 rounded  bottom-14 ax-w-md"
                value={input}
                placeholder="What is the temperature in the living room?"
                onChange={(e) => setInput(e.target.value)}
              />
            </form>

            <button
              className="fixed bottom-0 p-2 mb-8 text-white bg-red-500 rounded-lg"
              onClick={() => {

              }}
            >
              Stop
            </button>
          </div>
        </div>
        {/* <HumeAI /> */}
      </aside>
    </main>
  );
}

const ChatBubble = ({ text }: { text: string }) => (
  <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-blue-200 rounded-e-xl rounded-es-xl">
    <p className="text-sm font-normal text-gray-900"> {text}</p>
  </div>
);

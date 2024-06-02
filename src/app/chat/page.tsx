"use client";
import Image from "next/image";
import { IconButton, Flex, Text } from "@radix-ui/themes";
import { MessageProps, useVoiceChat } from "../../hooks/useVoiceChat";
import { useEffect, useRef } from "react";

import { Mic, X } from "lucide-react";
import { Waveform } from "../components/wave-shape";
import { BackgroundBeams } from "../components/beams-bg";
import HumeAI from "../hume/page";

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

  // When text change, set the text to the input and submit the message
  const handleClickRecord = () => {
    if (!recording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const handlePlay = () => {
    // use text to speech api to play "Bye bye!"
  };

  return (
    <main className="flex h-screen">
      <div className="flex flex-auto h-screen overflow-hidden flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          {/* Background */}

          {/* <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none"></div> */}
        </div>

        <div className="relative z-[-1] flex flex-col place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
          <h2 className="text-4xl font-semibold">
            Practice Mindfulness with AI Guide
          </h2>
          <div className="flex flex-col items-center my-2 gap-2">
            <Waveform />
            <p>
              {recording
                ? "Recording..."
                : "Click the microphone to start recording"}
            </p>
          </div>
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
            onClick={handlePlay}
          >
            <X width="24" height="24" />
          </IconButton>
        </div>
      </div>

      <aside className="w-1/4 bg-gray-100 rounded-md m-4">
        <header className="px-4 py-4 w-full border-solid border-b w-9/10 border-gray-200">
          <h4 className="font-bold text-xl">Transcript</h4>
        </header>

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
                className="fixed w-full max-w-md p-2 mb-8 border border-gray-300 rounded  bottom-14 ax-w-md"
                value={input}
                placeholder="What is the temperature in the living room?"
                onChange={(e) => setInput(e.target.value)}
              />
            </form>

            <button
              className="fixed bottom-0 w-full max-w-md p-2 mb-8 text-white bg-red-500 rounded-lg"
              onClick={stop}
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

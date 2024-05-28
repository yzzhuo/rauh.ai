'use client'
import Image from "next/image";
import { IconButton, Flex, Text } from '@radix-ui/themes';
import { useRecordVoice } from "../../hooks/useRecordVoice"; 
import { usePlayVoice } from "../../hooks/usePlayVoice"; 
import ChatMessage from "../components/chatMessage";

export default function Home() {
  const { startRecording, stopRecording, recording, text} = useRecordVoice();
  const { playSpeech } = usePlayVoice();
  const handleClickRecord = () => {
    if (!recording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const handlePlay = () => {
    // use text to speech api to play "Bye bye!"
    playSpeech("Bye bye!")
  }
  return (
    <main className="flex h-screen">
      <div className="flex flex-auto h-screen overflow-hidden flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
              href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className="dark:invert"
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>
        <div className="relative z-[-1] flex flex-col place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
          <h2 className="text-4xl font-semibold">
            Practice Mindfulness with AI Guide
          </h2>
          <p>{text}</p>
        </div>
        <div className="mb-32 mt-24 flex text-center justify-center lg:mb-0 lg:w-full lg:max-w-5xl gap-12">
          <IconButton radius="full" size="4" variant="soft" color="gray"
            onClick={handleClickRecord} 
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
          </IconButton>
          <IconButton radius="full" color="red" size="4" variant="solid" onClick={handlePlay}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </IconButton>
        </div>
      </div>
      <aside className="w-1/4 bg-gray-100">
        <header className="px-4 py-4 w-full border-solid border-b border-gray-200">
          <h4 className="font-bold text-xl">Transcript</h4>
        </header>
        <div className="p-4">
          <ChatMessage message="Hello, how can I help you?" isUser={false} />
        </div>
      </aside>
    </main>
  );
}

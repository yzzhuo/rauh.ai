"use client";
import Image from "next/image";
import { IconButton, Button } from "@radix-ui/themes";
import { ReaderIcon, ArrowUpIcon } from '@radix-ui/react-icons'
import { MessageProps, useVoiceChat } from "../../hooks/useVoiceChat";
import { useEffect, useRef, useState } from "react";

import { Mic, X, PanelRightClose, PanelLeftClose, MicOff } from "lucide-react";
import LoadingAnimation from "../components/Loading";
import { Waveform } from "../components/wave-shape";
import HumeAI from "../hume/page";

import SmileyFace from "../components/smell-face";

export default function Home() {
  const {
    startRecording,
    stopRecording,
    recording,
    inputDisabled,
    // threadId,
    messagesEndRef,
    messages,
    input,
    handleSubmit,
    setInput,
    cancelRecord,
  } = useVoiceChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [dataArray, setDataArray] = useState<Uint8Array>();
  // 处理音频相关逻辑，主要是自动开启/停止录音
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const data = new Uint8Array(analyser.frequencyBinCount);

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
  
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const update = () => {
        analyser.getByteFrequencyData(dataArray);
        let values = 0;
        for (let i = 0; i < bufferLength; i++) {
          values += dataArray[i];
        }
        const average = values / bufferLength;
        setVolume(recording ? average : 0);
        requestAnimationFrame(update);
      };
      update();
  
      return () => {
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

        <SmileyFace  loading={inputDisabled}/>
        <div className="flex flex-col items-center mt-8 gap-4">

          {/* <Waveform data={dataArray}/> */}
          <p className="text-lg">
            {recording
              ? "Recording...you can click the microphone button to stop recording and send your message"
              : "To start speaking, click the microphone button"}
          </p>
          <p>Input Volume: {volume.toFixed(2)}</p>
        </div>

        <div className="mb-32 mt-24 flex text-center justify-center lg:mb-0 lg:w-full lg:max-w-5xl gap-12">
          <IconButton
            radius="full"
            size="4"
            variant="soft"
            color={recording ? 'grass' : 'gray'}
            onClick={handleClickRecord}
            className={(!inputDisabled && !recording) ? 'animate-bounce' : ''}
          >
            {recording ? <Mic width="24" height="24" /> : <MicOff width="24" height="24" />}
          </IconButton>

          <IconButton
            radius="full"
            variant="soft"
            color="red"
            size="4"
            onClick={cancelRecord}
          >
            <X width="24" height="24" />
          </IconButton>
        </div>
      </div>
      {!isSidebarOpen &&
        <IconButton size={"3"} variant="ghost" className="m-4" onClick={() => setIsSidebarOpen(true)}>
          <PanelLeftClose width="24" height="24" />
        </IconButton>
      }
      {isSidebarOpen && <aside className="w-1/4 bg-gray-100 rounded-md m-4 flex flex-col align-start">
        {isSidebarOpen &&
          <IconButton size={"3"} variant="ghost" className="m-2 flex justify-start" onClick={() => setIsSidebarOpen(false)}>
            <PanelRightClose width="24" height="24" />
          </IconButton>
        }
        <div className="p-4 overflow-y-auto flex-1">
          <div className="flex flex-col w-full max-w-md mx-auto justify-start">
            {messages.map((m: MessageProps, index) => (
              <div key={index} className="whitespace-pre-wrap">
                <strong>{`${m.role.toUpperCase()} `}</strong>
                <ChatBubble text={m.text} />
                <br />
              </div>
            ))}
            <div ref={messagesEndRef} />
            {inputDisabled && (
              <div className="w-full h-8 max-w-md p-2 mb-8 bg-gray-300 rounded-lg dark:bg-gray-600 animate-pulse" />
            )}
          </div>
        </div>
        <form className='w-full flex h-[64px] gap-2 p-4 border-solid border-t-2' onSubmit={handleSubmit}>
          <input onChange={(e) => setInput(e.target.value)} value={input} className='bg-white flex-1 text-sm outline-none p-2' placeholder='Send a message...' />
          <Button type="submit" className="">
            <span className='font-semibold text-sm'>Send</span>
          </Button>
        </form>
        {/* <HumeAI /> */}
      </aside>
      }
    </main>
  );
}

const ChatBubble = ({ text }: { text: string }) => (
  <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-blue-200 rounded-e-xl rounded-es-xl">
    <p className="text-sm font-normal text-gray-900">{text}</p>
  </div>
);

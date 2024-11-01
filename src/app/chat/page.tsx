"use client";
import 'regenerator-runtime/runtime'
import { IconButton, Button } from "@radix-ui/themes";
import { MessageProps, useVoiceChat } from "../../hooks/useVoiceChat";
import { useEffect, useState } from "react";

import { Mic, PanelRightClose, PanelLeftClose, MicOff } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import CircleAnimation from "../components/circleAnimation";

const DURATION_FOR_END_OF_SPEECH = process.env.NEXT_PUBLIC_LISTENING_WAITING_TIME ? parseInt(process.env.NEXT_PUBLIC_LISTENING_WAITING_TIME) : 3000;
console.log('DURATION_FOR_END_OF_SPEECH:', DURATION_FOR_END_OF_SPEECH);
export default function Home() {
  const {
    startRecording,
    sendRecording,
    recording,
    inputDisabled,
    messagesEndRef,
    messages,
    input,
    handleSubmit,
    setInput,
    stopRecording,
  } = useVoiceChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [speechDetectTimer, setSpeechDetectTimer] = useState<NodeJS.Timeout | null>(null);
  const [isStart, setIsStart] = useState(false);

  const [volume, setVolume] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    // Clear the existing timer
    if (speechDetectTimer) {
      clearTimeout(speechDetectTimer);
    }
    // Set a new timer
    setSpeechDetectTimer(setTimeout(() => {
      // Send the voice message
      if (transcript && recording && !inputDisabled) {
        // stopRecord and SendMessage
        sendRecording();
        resetTranscript();
      }
    }, DURATION_FOR_END_OF_SPEECH)); // 3000 milliseconds = 3 seconds
  }, [transcript]);

  
  useEffect(() => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setIsMobile(true);
    }
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support speech recognition software! Please use Chrome');
    }
    
  }, []);

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
      if (!isStart) {
        setIsStart(true);
      }
      startRecording();
      SpeechRecognition.startListening({ continuous: true });
    } else {
      stopRecording();
      resetTranscript();
      SpeechRecognition.abortListening()
    }
  };

  return (
    <main className="flex h-screen relative">
      <div className="flex flex-auto overflow-hidden flex-col items-center justify-between px-4 py-12 md:p-24">
        <CircleAnimation loading={inputDisabled}/>
        {isMobile ? <div className="text-center mb-12">
          <h3 className="font-bold text-2xl">The feature may not work correctly on mobile devices</h3> 
          <p className="my-4">We were unable to connect to your microphone, please use our demo on a PC browser.</p>
        </div>
         :<div className="md:mb-32 md:mt-24 flex text-center justify-center lg:mb-0 lg:w-full lg:max-w-5xl gap-12">
          <IconButton
            radius="full"
            size="4"
            variant="soft"
            color={recording || isStart ? 'grass' : 'gray'}
            onClick={handleClickRecord}
            className={!isStart ? 'animate-bounce' : ''}
          >
            {recording || isStart ? <Mic width="24" height="24" /> : <MicOff width="24" height="24" />}
          </IconButton>
         
        </div>
        }
         {!isMobile && <div className="flex flex-col items-center my-8 gap-4">
          <p className="md:text-xl text-center"> 
            {recording
              ? "Listening..."
              : ""}
          </p>
          <p className="md:text-lg text-sm">Input Volume: {volume.toFixed(2)}</p>
        </div>
        }
      </div>
      {!isSidebarOpen &&
        <IconButton size={"3"} variant="ghost" className="m-4 absolute top-0 right-0" onClick={() => setIsSidebarOpen(true)}>
          <PanelLeftClose width="24" height="24" />
        </IconButton>
      }
      {isSidebarOpen && <aside className="bg-white border-blue-500 md:shadow-inner mb-12 absolute w-full h-screen md:h-auto md:relative md:w-1/3 lg:w-1/4 left-0 flex flex-col align-start">
        {isSidebarOpen &&
          <IconButton size={"3"} variant="ghost" className="m-2 sticky top-0flex justify-start" onClick={() => setIsSidebarOpen(false)}>
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
              <div className="w-full h-8 max-w-md p-2 mb-8 bg-gray-300 rounded:lg dark:bg-gray-600 animate-pulse" />
            )}
          </div>
        </div>
        <form className='mb-16 w-full overflow-hidden flex h-[64px] gap-2 p-4 border-solid border-t-2' onSubmit={handleSubmit}>
          <input onChange={(e) => setInput(e.target.value)} value={input} className='bg-white flex-1 text-sm outline-none p-2' placeholder='Send a message...' />
          <Button type="submit" className="">
            <span className='font-semibold text-sm'>Send</span>
          </Button>
        </form>
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

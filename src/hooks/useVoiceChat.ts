"use client";
import { useEffect, useState, useRef } from "react";
import { blobToBase64 } from "@/utils/blobToBase64";
import { createMediaStream } from "@/utils/createMediaStream";
import { usePlayVoice } from "./usePlayVoice"; 
import { AssistantStream } from "openai/lib/AssistantStream";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";

export type MessageProps = {
  role: "user" | "assistant" | "code";
  text: string;
};

const GREETING = "Welcome! Let’s take a moment to center ourselves and focus on the present. How are you feeling right now?"


export const useVoiceChat = () => {
  const [audioText, setAudioText] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [recording, setRecording] = useState(false);
  const isRecording = useRef(false);
  const isCancelled = useRef(false);
  const chunks = useRef<Blob[]>([]);
  const { playSpeech } = usePlayVoice();
  const messagesRef = useRef<MessageProps[]>([]);

  /**
   * voice recording
    **/
  const initialMediaRecorder = (stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.onstart = () => {
      createMediaStream(stream);
      chunks.current = [];
    };

    mediaRecorder.ondataavailable = (ev) => {
      chunks.current.push(ev.data);
    };

    mediaRecorder.onstop = () => {
      if (isCancelled.current) return;
      const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
      blobToBase64(audioBlob, getText);
    };

    setMediaRecorder(mediaRecorder);
  };

  const startRecording = () => {
    if (mediaRecorder) {
      isRecording.current = true;
      isCancelled.current = false;
      chunks.current = [];
      mediaRecorder.start();
      setRecording(true);
    }
  };

  const sendRecording = () => {
    if (mediaRecorder) {
      setInputDisabled(true);
      isRecording.current = false;
      mediaRecorder.stop();
      setRecording(false);
      console.log('Stop Recording and Send Message');
    }
  };

  const cancelRecord = () => {
    isCancelled.current = true;
    if (isRecording.current) {
      mediaRecorder.stop();
      setRecording(false);
    }
  }

  const getText = async (base64data: string) => {
    try {
      const response = await fetch("/api/speechToText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio: base64data,
        }),
      }).then((res) => res.json());
      const { text } = response;
      setAudioText(text);
    } catch (error) {
      console.log(error);
    }
  };
  /**
  * Chat Assistant
  */ 
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  // automatically scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

    useEffect(() => {
      // create a new threadID when chat component created
      setInputDisabled(true);
      createThread();
      if (typeof window !== "undefined") {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(initialMediaRecorder);
      }
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", text: GREETING },
      ]);
      // play the voice
      playSpeech(GREETING).then(() => {
        setInputDisabled(false);
      })
    }, []);
    
  useEffect(() => {
    if (audioText) {
      console.log('Send Message', audioText);
      setInput(audioText);
      sendMessage(audioText);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", text: audioText },
      ]);
      setInput("");
      setInputDisabled(true);
      scrollToBottom();
    }
  }, [audioText]);

  useEffect(() => {
    scrollToBottom();
    messagesRef.current = messages;
  }, [messages]);


  const createThread = async () => {
    const res = await fetch(`/api/assistants/threads`, {
      method: "POST",
    });
    const data = await res.json();
    setThreadId(data.threadId);
    return data.threadId;
  };

  const sendMessage = async (text: string) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          content: text,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body!);
    handleReadableStream(stream);
  };

  const submitActionResult = async (runId: string, toolCallOutputs: any) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/actions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runId: runId,
          toolCallOutputs: toolCallOutputs,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body!);
    handleReadableStream(stream);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: input },
    ]);
    setInput("");
    setInputDisabled(true);
    scrollToBottom();
  };

  /* Stream Event Handlers */
  // textCreated - create new assistant message
  const handleTextCreated = () => {
    appendMessage("assistant", "");
  };

  // textDelta - append text to last assistant message
  const handleTextDelta = (delta: any) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    };
    if (delta.annotations != null) {
      annotateLastMessage(delta.annotations);
    }
  };

  // toolCallCreated - log new tool call
  const toolCallCreated = (toolCall: any) => {
    if (toolCall.type != "code_interpreter") return;
    appendMessage("code", "");
  };

  // toolCallDelta - log delta and snapshot for the tool call
  const toolCallDelta = (delta: any) => {
    if (delta.type != "code_interpreter") return;
    if (!delta.code_interpreter.input) return;
    appendToLastMessage(delta.code_interpreter.input);
  };

  const functionCallHandler = async (call: any) => {
    console.log('call====', call);
    // implement your own logic here
    if (call?.function?.name == "play_voice") {
      const args = JSON.parse(call.function.arguments);
      await appendMessage("assistant", args.text);
      await playSpeech(args.text);
      return JSON.stringify({
        success: true,
      }) 
    }
    // else if (call?.function?.name == "setTimer") {
    //   // set a timer with promise
    //   const args = JSON.parse(call.function.arguments);
    //   setTimeout(() => {
    //     console.log('timer done');
    //   }, args.duration);
    //   return 'ok';
    // }
    return 'ok';
  }

  // handleRequiresAction - handle function call
  const handleRequiresAction = async (
    event: AssistantStreamEvent.ThreadRunRequiresAction
  ) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    // loop over tool calls and call function handler
    const toolCallOutputs = [];
    for (const toolCall of toolCalls) {
      const result = await functionCallHandler(toolCall);
      console.log('result====', result);
      toolCallOutputs.push({ output: result, tool_call_id: toolCall.id });
    }
    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };

  // handleRunCompleted - re-enable the input form
  const handleRunCompleted = async (event: AssistantStreamEvent.ThreadRunCompleted) => {
    console.log('completed', event);
    const lastMessage = messagesRef.current[messagesRef.current.length - 1];
    await playSpeech(lastMessage.text);
    setInputDisabled(false);
  };

  const handleReadableStream = (stream: AssistantStream) => {
    // messages
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);

    // code interpreter
    stream.on("toolCallCreated", toolCallCreated);
    stream.on("toolCallDelta", toolCallDelta);

    // events without helpers yet (e.g. requires_action and run.done)
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action")
        handleRequiresAction(event);
      if (event.event === "thread.run.completed") handleRunCompleted(event);
    });
  };

  /*
    =======================
    === Utility Helpers ===
    =======================
  */

  const appendToLastMessage = (text: string) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const appendMessage = (role: "user" | "assistant" | "code", text: string) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const annotateLastMessage = (annotations: any) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
      };
      annotations.forEach((annotation: any) => {
        if (annotation.type === 'file_path') {
          updatedLastMessage.text = updatedLastMessage.text.replaceAll(
            annotation.text,
            `/api/files/${annotation.file_path.file_id}`
          );
        }
      })
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
    
  }
  return { recording, startRecording, sendRecording,
      messages,
      input,
      setInput,
      handleSubmit,
      inputDisabled,
      cancelRecord,
      messagesEndRef,
   };
};
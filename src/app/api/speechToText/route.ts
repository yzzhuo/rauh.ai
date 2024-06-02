import { NextResponse } from "next/server";
import OpenAI from "openai";
import { put } from '@vercel/blob';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: any) {
  const body = await req.json();

  const base64Audio = body.audio;
  const filePath = "tmp/audio.wav";
  // Convert the base64 audio data to a Buffer
  const audio = Buffer.from(base64Audio, "base64");
  const {url} = await put(filePath, audio, {
    access: 'public',
  });
  console.log('==url', url);
  try {
    // Create a readable stream from the temporary WAV file
    const res = await fetch(url);
    const data = await openai.audio.transcriptions.create({
      file: res,
      model: "whisper-1",
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.error();
  }
}
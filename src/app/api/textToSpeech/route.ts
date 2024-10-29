import { ElevenLabsClient } from "elevenlabs";
import { NextResponse } from "next/server";
import { openai } from "@/app/openai";

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

let client: null | ElevenLabsClient;

function get_evevenlab_client() {
  if (!client) {
    client = new ElevenLabsClient({
    apiKey: ELEVENLABS_API_KEY,
  });
  }
  return client;
}

export async function POST(req: Request) {
  const { text } = await req.json();
  console.log('sdasd', ELEVENLABS_API_KEY)
  if (ELEVENLABS_API_KEY) {
    const client = get_evevenlab_client();
    try {
      const audio = await client.generate({
        voice: "Emily",
        model_id: "eleven_multilingual_v2",
        text,
      });
      return new Response(audio as any, {
        headers: { "Content-Type": "audio/mpeg" }
      });
    } catch (error) {
      console.error("Error processing audio:", error);
      return NextResponse.error();
    }
  } 
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "nova",
    input: text,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  return new Response(buffer, {
    headers: { "Content-Type": "audio/mpeg" },
  });
};
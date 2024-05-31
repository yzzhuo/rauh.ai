import { ElevenLabsClient } from "elevenlabs";
import { createWriteStream } from "fs";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

export async function POST(req: Request) {
  const { text } = await req.json();
  try {
    const audio = await client.generate({
      voice: "Emily",
      model_id: "eleven_turbo_v2",
      text,
    });
    return new Response(audio as any, {
      headers: { "Content-Type": "audio/mpeg" }
    });
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.error();
  }
};
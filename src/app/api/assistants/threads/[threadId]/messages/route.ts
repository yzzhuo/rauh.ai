import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(request: Request, { params: { threadId } } : { params: { threadId: string } }
) {
  const { content } = await request.json();

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });

  const stream = openai.beta.threads.runs.stream(threadId, {
    assistant_id: process.env.ASSISTANT_ID ??
    (() => {
      throw new Error('ASSISTANT_ID is not set');
    })(),
  });

  return new Response(stream.toReadableStream());
}

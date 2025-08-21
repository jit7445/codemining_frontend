import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
export const maxDuration = 30;
export async function POST(req: Request) {
  const { messages } = await req.json();
  type ChatRole = "system" | "user";
  type Message = { role: ChatRole; content: string };
  const userMessage = Array.isArray(messages)
    ? [...messages].reverse().find((m: Message) => m.role === 'user')
    : null;
  const code = userMessage?.content || '';
  const chatMessages: Message[] = [
    {
      role: "system",
      content:
        "You are a programming assistant. Your task is to find errors (syntax, logical, etc.) in the user's code, explain the issues briefly, and return the corrected version. Be concise and accurate.",
    },
    {
      role: "user",
      content: `Here is my code:\n\n\`\`\`\n${code}\n\`\`\`\nPlease find and fix the errors.`,
    },
  ];

  const result = await streamText({
    model: groq('llama-3.3-70b-versatile'),
    messages: chatMessages,
  });

  return result.toDataStreamResponse();
}
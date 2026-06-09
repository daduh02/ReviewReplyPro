import { NextResponse } from "next/server";
import {
  buildMockReplies,
  replyPromptGuidance,
  type ReplyGenerationInput,
} from "@/lib/providers/ai";

export async function POST(request: Request) {
  const input = (await request.json()) as ReplyGenerationInput;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      provider: "mock",
      replies: buildMockReplies(input),
    });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `${replyPromptGuidance}
Return exactly 3 reply options as a JSON array of strings. Do not include markdown.`,
        },
        {
          role: "user",
          content: JSON.stringify(input),
        },
      ],
    }),
  });

  if (!response.ok) {
    return NextResponse.json({
      provider: "mock",
      replies: buildMockReplies(input),
      warning: "OpenAI request failed, so mock replies were used.",
    });
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content ?? "";

  try {
    const replies = JSON.parse(content) as string[];
    if (Array.isArray(replies) && replies.length === 3) {
      return NextResponse.json({ provider: "openai", replies });
    }
  } catch {
    // Fall through to local-safe replies.
  }

  return NextResponse.json({
    provider: "mock",
    replies: buildMockReplies(input),
    warning: "OpenAI response was not valid JSON, so mock replies were used.",
  });
}

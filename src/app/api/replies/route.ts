import { NextResponse } from "next/server";
import { buildMockReplies, OpenAIReplyProvider, type ReplyGenerationInput } from "@/lib/providers/ai";

export async function POST(request: Request) {
  const input = (await request.json()) as ReplyGenerationInput;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      provider: "mock",
      replies: buildMockReplies(input),
    });
  }

  const result = await new OpenAIReplyProvider().generateReplies(input);

  return NextResponse.json({
    provider: result.source === "openai" ? "openai" : "mock",
    replies: result.replies,
    warning: result.warning,
  });
}

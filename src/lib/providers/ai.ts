import { defaultBrandVoice } from "@/lib/demo-data";
import type { BrandVoiceSettings, ReplyLength, Tone } from "@/lib/types";

export type ReplyGenerationInput = {
  reviewText: string;
  starRating: number;
  customerName?: string;
  businessName: string;
  businessType: string;
  location: string;
  tone: Tone;
  replyLength: ReplyLength;
  brandVoiceSettings?: BrandVoiceSettings;
};

export interface AIReplyProvider {
  generateReplies(input: ReplyGenerationInput): Promise<string[]>;
}

export class MockAIReplyProvider implements AIReplyProvider {
  async generateReplies(input: ReplyGenerationInput) {
    return buildMockReplies(input);
  }
}

export class OpenAIReplyProvider implements AIReplyProvider {
  async generateReplies(input: ReplyGenerationInput) {
    if (!process.env.OPENAI_API_KEY) {
      return new MockAIReplyProvider().generateReplies(input);
    }

    // Placeholder for a future OpenAI SDK call. Keeping this local-safe means
    // the MVP can build and run without network credentials.
    return buildMockReplies(input);
  }
}

export function getAIReplyProvider(): AIReplyProvider {
  return process.env.OPENAI_API_KEY
    ? new OpenAIReplyProvider()
    : new MockAIReplyProvider();
}

export function buildMockReplies(input: ReplyGenerationInput) {
  const brand = input.brandVoiceSettings ?? defaultBrandVoice;
  const firstName = input.customerName?.split(" ")[0] ?? "there";
  const isComplaint = input.starRating <= 3;
  const signOff =
    brand.signOffStyle || `Thanks from the ${input.businessName} team`;

  if (isComplaint) {
    return [
      `Hi ${firstName}, thank you for taking the time to share this. We are sorry to hear your experience with ${input.businessName} did not meet expectations. Please contact the business directly so the team can look into this calmly and respond properly.`,
      `Hello ${firstName}, we appreciate your feedback. We understand this was frustrating and we would like the opportunity to review what happened. Please get in touch with ${input.businessName} so the team can discuss the details with you.`,
      `Hi ${firstName}, thank you for letting us know. We are disappointed to hear about your experience and will take your comments seriously. Please contact us directly so we can understand the situation and see how best to help.`,
    ];
  }

  const compact =
    input.replyLength === "Short" || brand.keepRepliesShortByDefault;

  return [
    compact
      ? `Thanks ${firstName}, we really appreciate your lovely review. ${signOff}.`
      : `Hi ${firstName}, thank you for such a kind review. We are delighted you had a good experience with ${input.businessName} in ${input.location}, and we really appreciate you taking the time to recommend us. ${signOff}.`,
    `Thank you, ${firstName}. It is brilliant to hear your feedback and the team will be pleased to know the service stood out. We hope to welcome you back soon.`,
    `Hi ${firstName}, thanks for choosing ${input.businessName}. Reviews like this mean a lot to local teams like ours, and we are glad we could help.`,
  ];
}

export const replyPromptGuidance = `
Write in British English for a UK local business. For complaints, be polite,
acknowledge the issue, avoid arguing, avoid admitting legal liability, invite
the customer to contact the business directly, and keep the tone professional
and calm.
`;

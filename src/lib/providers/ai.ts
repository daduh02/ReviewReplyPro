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
  const isLegal =
    input.businessType.toLowerCase().includes("solicitor") ||
    input.businessType.toLowerCase().includes("legal");
  const isRestaurant =
    input.businessType.toLowerCase().includes("restaurant") ||
    input.businessType.toLowerCase().includes("takeaway");
  const signOff =
    brand.signOffStyle || `Thanks from the ${input.businessName} team`;

  if (isLegal && isComplaint) {
    return [
      `Dear ${firstName}, thank you for your feedback. We are sorry to hear that your experience did not meet your expectations. To avoid discussing details publicly, please contact the ${input.location} office directly so your concerns can be reviewed appropriately. ${signOff}.`,
      `Dear ${firstName}, we appreciate you taking the time to share your experience. We understand that clear communication is important and would welcome the opportunity to look into your concerns directly. ${signOff}.`,
      `Thank you, ${firstName}. We are disappointed to hear about your experience and will treat your comments carefully. Please contact the firm directly so this can be discussed in the appropriate setting. ${signOff}.`,
    ];
  }

  if (isLegal) {
    return [
      `Dear ${firstName}, thank you for your kind review. We are pleased to hear that you found the team professional and supportive. ${signOff}.`,
      `Thank you, ${firstName}. We are grateful for your feedback and pleased that our ${input.location} team provided clear, helpful support. ${signOff}.`,
      `Dear ${firstName}, thank you for taking the time to share your experience. Clear communication and discreet professional service are very important to us. ${signOff}.`,
    ];
  }

  if (isComplaint) {
    return [
      `Hi ${firstName}, thank you for letting us know. We are sorry your experience with ${input.businessName} did not meet expectations. Please contact the restaurant directly with your order details so the team can look into this for you. ${signOff}.`,
      `Hello ${firstName}, we are sorry to hear about this experience. A delay or issue with an order can be frustrating, and we would like to review what happened. Please get in touch with ${input.businessName} directly so the team can help.`,
      `Hi ${firstName}, thank you for your feedback. We apologise that your order experience was not as expected. Please contact the restaurant directly and we will look into it carefully.`,
    ];
  }

  const compact =
    input.replyLength === "Short" || brand.keepRepliesShortByDefault;

  return [
    compact
      ? `Thanks ${firstName}, we really appreciate your lovely review. ${signOff}.`
      : `Hi ${firstName}, thank you for such a kind review. We are delighted you had a good experience with ${input.businessName} in ${input.location}, and we really appreciate your feedback. ${signOff}.`,
    isRestaurant
      ? `Thank you, ${firstName}. It is brilliant to hear you enjoyed the food and service. The team will be pleased to know your visit stood out. ${signOff}.`
      : `Thank you, ${firstName}. It is brilliant to hear your feedback and the team will be pleased to know the service stood out. We hope to welcome you back soon.`,
    isRestaurant
      ? `Hi ${firstName}, thanks for choosing ${input.businessName}. We are glad you enjoyed the flavours and service, and we hope to see you again soon.`
      : `Hi ${firstName}, thanks for choosing ${input.businessName}. Reviews like this mean a lot to local teams like ours, and we are glad we could help.`,
  ];
}

export const replyPromptGuidance = `
Write in British English for a UK local business. For complaints, be polite,
acknowledge the issue, avoid arguing, avoid admitting legal liability, invite
the customer to contact the business directly, and keep the tone professional
and calm.
`;

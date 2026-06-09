import type { BrandVoiceSettings, ReplyLength, Tone } from "@/lib/types";

export type ReplyGenerationSource = "openai" | "fallback";

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

export type ReplyGenerationResult = {
  replies: string[];
  source: ReplyGenerationSource;
  warning?: string;
};

type OpenAIChatResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

export interface AIReplyProvider {
  generateReplies(input: ReplyGenerationInput): Promise<ReplyGenerationResult>;
}

export class MockAIReplyProvider implements AIReplyProvider {
  async generateReplies(input: ReplyGenerationInput): Promise<ReplyGenerationResult> {
    return {
      replies: buildMockReplies(input),
      source: "fallback" as const,
    };
  }
}

export class OpenAIReplyProvider implements AIReplyProvider {
  async generateReplies(input: ReplyGenerationInput): Promise<ReplyGenerationResult> {
    if (!process.env.OPENAI_API_KEY) {
      return new MockAIReplyProvider().generateReplies(input);
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
          temperature: 0.55,
          messages: [
            {
              role: "system",
              content: buildSystemPrompt(),
            },
            {
              role: "user",
              content: JSON.stringify(buildPromptPayload(input)),
            },
          ],
        }),
      });

      if (!response.ok) {
        const fallback = await new MockAIReplyProvider().generateReplies(input);
        return {
          ...fallback,
          warning: `OpenAI request failed with status ${response.status}.`,
        };
      }

      const data = (await response.json()) as OpenAIChatResponse;
      const content = data.choices?.[0]?.message?.content ?? "";
      const replies = parseReplyOptions(content);

      if (replies.length === 3) {
        return { replies, source: "openai" };
      }

      const fallback = await new MockAIReplyProvider().generateReplies(input);
      return {
        ...fallback,
        warning: "OpenAI response did not contain three valid reply options.",
      };
    } catch (error) {
      const fallback = await new MockAIReplyProvider().generateReplies(input);
      return {
        ...fallback,
        warning:
          error instanceof Error
            ? `OpenAI request failed: ${error.message}`
            : "OpenAI request failed.",
      };
    }
  }
}

export function getAIReplyProvider(): AIReplyProvider {
  return process.env.OPENAI_API_KEY
    ? new OpenAIReplyProvider()
    : new MockAIReplyProvider();
}

function buildSystemPrompt() {
  return `${replyPromptGuidance}

Return exactly 3 distinct reply options as a JSON array of strings.
Do not include markdown, numbering, explanations, labels, or surrounding prose.
Each reply must sound specific to the business, review content, rating and selected tone.
Avoid fake placeholders, vague generic praise, and claims about actions the business has not taken.
Keep wording suitable for a real UK business replying publicly to a customer review.`;
}

function buildPromptPayload(input: ReplyGenerationInput) {
  const brand = input.brandVoiceSettings;

  return {
    business: {
      name: input.businessName,
      type: input.businessType,
      location: input.location,
    },
    review: {
      customerName: input.customerName ?? "Customer",
      rating: input.starRating,
      content: input.reviewText,
    },
    requestedReply: {
      tone: input.tone,
      length: input.replyLength,
      language: "UK English",
    },
    brandVoice: brand
      ? {
          preferredTone: brand.preferredTone,
          defaultLength: brand.defaultLength,
          greetingStyle: brand.greetingStyle,
          signOffStyle: brand.signOffStyle,
          wordsToUse: brand.wordsToUse,
          wordsToAvoid: brand.wordsToAvoid,
          complaintHandlingStyle: brand.complaintHandlingStyle,
          useEmojis: brand.useEmojis,
          mentionBusinessName: brand.mentionBusinessName,
          apologiseForPoorExperiences: brand.apologiseForPoorExperiences,
          inviteUnhappyCustomersToContact:
            brand.inviteUnhappyCustomersToContact,
          keepRepliesShortByDefault: brand.keepRepliesShortByDefault,
        }
      : null,
  };
}

function parseReplyOptions(content: string) {
  const trimmed = content.trim();
  const jsonText = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(jsonText) as unknown;
    const candidates = Array.isArray(parsed)
      ? parsed
      : parsed &&
          typeof parsed === "object" &&
          "replies" in parsed &&
          Array.isArray((parsed as { replies: unknown }).replies)
        ? (parsed as { replies: unknown[] }).replies
        : [];
    const cleaned = candidates
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);

    return distinctReplies(cleaned).slice(0, 3);
  } catch {
    return [];
  }
}

function distinctReplies(replies: string[]) {
  const seen = new Set<string>();
  const distinct: string[] = [];

  for (const reply of replies) {
    const key = reply.toLowerCase().replace(/\s+/g, " ");
    if (!seen.has(key)) {
      seen.add(key);
      distinct.push(reply);
    }
  }

  return distinct;
}

export function buildMockReplies(input: ReplyGenerationInput) {
  const brand = input.brandVoiceSettings ?? {
    businessName: input.businessName,
    businessType: input.businessType as BrandVoiceSettings["businessType"],
    location: input.location,
    preferredTone: input.tone,
    defaultLength: input.replyLength,
    greetingStyle: "Use a polite greeting",
    signOffStyle: `Thanks, the ${input.businessName} team`,
    wordsToUse: "",
    wordsToAvoid: "",
    complaintHandlingStyle:
      "Acknowledge feedback, avoid arguing, and invite direct contact.",
    useEmojis: false,
    mentionBusinessName: true,
    apologiseForPoorExperiences: true,
    inviteUnhappyCustomersToContact: true,
    keepRepliesShortByDefault: input.replyLength === "Short",
  };
  const firstName = input.customerName?.split(" ")[0] ?? "there";
  const isComplaint = input.starRating <= 3;
  const isLegal =
    input.businessType.toLowerCase().includes("solicitor") ||
    input.businessType.toLowerCase().includes("legal");
  const isRestaurant =
    input.businessType.toLowerCase().includes("restaurant") ||
    input.businessType.toLowerCase().includes("takeaway");
  const isCommunity =
    input.businessType.toLowerCase().includes("mosque") ||
    input.businessType.toLowerCase().includes("community");
  const signOff =
    brand.signOffStyle || `Thanks from the ${input.businessName} team`;

  if (isCommunity && isComplaint) {
    return [
      `Dear ${firstName}, thank you for letting us know. We are sorry your experience at ${input.businessName} was disappointing. Please contact the masjid directly so we can understand what happened and improve this for the community. ${signOff}.`,
      `Thank you ${firstName}, we appreciate you raising this with us. Clear information and a welcoming environment matter, and we would welcome the chance to speak with you directly. ${signOff}.`,
      `Dear ${firstName}, we are sorry to hear this affected your visit. Please get in touch with the masjid so the team can look into the details properly and respond with care.`,
    ];
  }

  if (isCommunity) {
    return [
      `Thank you ${firstName}, we really appreciate your kind words. It is lovely to hear that ${input.businessName} feels welcoming and helpful for the community. ${signOff}.`,
      `Dear ${firstName}, thank you for taking the time to leave such thoughtful feedback. We are grateful for your support and pleased the masjid has been a positive place for you.`,
      `Thank you ${firstName}. Your feedback means a great deal to the volunteers and the wider community. We are grateful for your support. ${signOff}.`,
    ];
  }

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
    const contactTarget = isRestaurant ? "restaurant" : "business";
    return [
      `Hi ${firstName}, thank you for letting us know. We are sorry your experience with ${input.businessName} did not meet expectations. Please contact the ${contactTarget} directly with the details so the team can look into this for you. ${signOff}.`,
      `Hello ${firstName}, we are sorry to hear about this experience. A delay or issue with an order can be frustrating, and we would like to review what happened. Please get in touch with ${input.businessName} directly so the team can help.`,
      `Hi ${firstName}, thank you for your feedback. We apologise that your experience was not as expected. Please contact the ${contactTarget} directly and we will look into it carefully.`,
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
and calm. For mosque or community organisation reviews, use respectful, warm
community wording and avoid sounding too corporate.
`;

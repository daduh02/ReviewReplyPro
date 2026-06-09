export type ReviewStatus =
  | "New"
  | "Draft ready"
  | "Edited"
  | "Copied"
  | "Posted"
  | "Archived";

export type Tone =
  | "Friendly"
  | "Professional"
  | "Empathetic"
  | "Short & Simple";

export type ReplyLength = "Short" | "Standard" | "Detailed";

export type Sentiment = "Positive" | "Negative" | "Complaint";

export type BusinessType =
  | "Salon"
  | "Barber"
  | "Dentist"
  | "Restaurant"
  | "Takeaway"
  | "Takeaway / Restaurant"
  | "Garage"
  | "Trade"
  | "Estate agent"
  | "Legal services / Solicitors"
  | "Law firm / Solicitors"
  | "Local service";

export type BrandVoiceSettings = {
  businessName: string;
  businessType: BusinessType;
  location: string;
  preferredTone: Tone;
  defaultLength: ReplyLength;
  greetingStyle: string;
  signOffStyle: string;
  wordsToUse: string;
  wordsToAvoid: string;
  complaintHandlingStyle: string;
  useEmojis: boolean;
  mentionBusinessName: boolean;
  apologiseForPoorExperiences: boolean;
  inviteUnhappyCustomersToContact: boolean;
  keepRepliesShortByDefault: boolean;
};

export type Review = {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  source: "Google" | "Facebook" | "Tripadvisor" | "Manual";
  businessName: string;
  businessType: BusinessType;
  location: string;
  address?: string;
  phone?: string;
  website?: string;
  googleRating?: number;
  googleReviewCount?: number;
  priceRange?: string;
  dateReceived: string;
  status: ReviewStatus;
  sentiment: Sentiment;
  draftReplies: string[];
};

export type SavedReply = {
  id: string;
  reviewId: string;
  originalReviewSnippet: string;
  replyPreview: string;
  tone: Tone;
  businessType: BusinessType;
  dateSaved: string;
  usageCount: number;
  sentiment: Sentiment;
};

export type GoogleBusinessLocation = {
  id: string;
  businessName: string;
  location: string;
  address: string;
  phone?: string;
  website?: string;
  googleRating?: number;
  googleReviewCount?: number;
  priceRange?: string;
  status: "Connected" | "Sync paused";
};

export type Plan = {
  id: "free" | "starter" | "pro";
  name: string;
  price: string;
  description: string;
  features: string[];
  monthlyReplies: number;
};

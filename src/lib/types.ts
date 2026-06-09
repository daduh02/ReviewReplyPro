export type ReviewStatus =
  | "new"
  | "draft_ready"
  | "edited"
  | "copied"
  | "posted"
  | "archived";

export type Tone =
  | "Friendly"
  | "Professional"
  | "Empathetic"
  | "Short & Simple";

export type ReplyLength = "Short" | "Standard" | "Detailed";

export type Sentiment = "Positive" | "Negative" | "Complaint";

export type AccountType = "demo" | "pilot" | "customer";

export type BillingStatus = "mock_billing" | "exempt" | "active" | "past_due";

export type BusinessType =
  | "Salon"
  | "Barber"
  | "Dentist"
  | "Restaurant"
  | "Takeaway"
  | "Takeaway / Restaurant"
  | "Mosque / community organisation"
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
  selectedReplyIndex?: number;
  selectedReply?: string;
  editedReply?: string;
};

export type Workspace = {
  id: string;
  name: string;
  accountType?: AccountType;
  plan?: "Demo Free" | "Pilot" | "Free for Life" | "Paid";
  billingStatus?: BillingStatus;
  active?: boolean;
};

export type Business = {
  id: string;
  workspaceId: string;
  name: string;
  businessType: BusinessType;
  accountType?: AccountType;
  active?: boolean;
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
  status:
    | "Demo Google-style reviews"
    | "Google Business Profile connection coming next"
    | "Google Business Profile integration coming soon";
  plan?: "Demo Free" | "Pilot" | "Free for Life";
  billingStatus?: "mock billing" | "permanently free" | "exempt";
  pilotStatus?: "demo" | "active";
  accountType?: AccountType;
  active?: boolean;
  gbpConnectionStatus?:
    | "demo reviews"
    | "connection coming next"
    | "Google Business Profile integration coming soon";
};

export type CustomerAccount = {
  id: string;
  name: string;
  accountType: AccountType;
  plan: "Pilot" | "Free for Life" | "Paid";
  billingStatus: BillingStatus;
  active: boolean;
  locations: Array<GoogleBusinessLocation & { businessType: BusinessType; brandVoice: BrandVoiceSettings }>;
  reviews: Review[];
  savedReplies: SavedReply[];
};

export type Plan = {
  id: "free" | "starter" | "pro";
  name: string;
  price: string;
  description: string;
  features: string[];
  monthlyReplies: number;
};

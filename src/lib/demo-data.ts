import type {
  BrandVoiceSettings,
  GoogleBusinessLocation,
  Review,
  SavedReply,
} from "@/lib/types";

export const defaultBrandVoice: BrandVoiceSettings = {
  businessName: "Glow Salon Leeds",
  businessType: "Salon",
  location: "Leeds",
  preferredTone: "Friendly",
  defaultLength: "Standard",
  greetingStyle: "Use the customer's first name where appropriate",
  signOffStyle: "Warm thanks from the team",
  wordsToUse: "friendly, helpful, local, professional",
  wordsToAvoid: "cheap, fault, blame, guaranteed",
  complaintHandlingStyle:
    "Acknowledge the concern calmly, avoid legal admissions, and invite the customer to contact the business directly.",
  useEmojis: false,
  mentionBusinessName: true,
  apologiseForPoorExperiences: true,
  inviteUnhappyCustomersToContact: true,
  keepRepliesShortByDefault: false,
};

export const demoReviews: Review[] = [
  {
    id: "rev_glow_sarah",
    customerName: "Sarah M",
    rating: 5,
    reviewText:
      "Absolutely brilliant service and a really friendly team. My haircut looks great and I'll definitely be back. Highly recommend.",
    source: "Google",
    businessName: "Glow Salon Leeds",
    businessType: "Salon",
    location: "Leeds",
    dateReceived: "2026-06-08",
    status: "Draft ready",
    sentiment: "Positive",
    draftReplies: [
      "Hi Sarah, thank you for such a lovely review. We are delighted you enjoyed your visit and that you are happy with your haircut. The Glow Salon Leeds team look forward to seeing you again soon.",
      "Thank you, Sarah. It is brilliant to hear that the team made you feel welcome and that you love your haircut. We really appreciate the recommendation.",
      "Hi Sarah, thanks so much for taking the time to review us. We are so pleased you had a great experience at Glow Salon Leeds and we will be very happy to welcome you back.",
    ],
  },
  {
    id: "rev_smile_james",
    customerName: "James R",
    rating: 1,
    reviewText:
      "Waited nearly 45 minutes past my appointment time and no one explained the delay. Very poor experience and I won't be returning.",
    source: "Google",
    businessName: "Smile Studio Manchester",
    businessType: "Dentist",
    location: "Manchester",
    dateReceived: "2026-06-07",
    status: "New",
    sentiment: "Complaint",
    draftReplies: [
      "Hi James, thank you for raising this. We are sorry to hear your appointment did not run to time and that the delay was not explained clearly. Please contact Smile Studio Manchester directly so we can look into what happened and discuss this with you.",
      "Hello James, we appreciate you taking the time to share your experience. We understand how frustrating a long wait can be, especially without an update from the team. Please get in touch with the practice manager so we can review the appointment flow and respond properly.",
      "Hi James, thank you for your feedback. We are disappointed to hear this was your experience and we would like the opportunity to understand it in more detail. Please contact the practice directly at your convenience.",
    ],
  },
  {
    id: "rev_bradford_imran",
    customerName: "Imran K",
    rating: 5,
    reviewText:
      "Quick MOT, fair price and no messing about. Really happy with the service.",
    source: "Google",
    businessName: "Bradford Auto Repairs",
    businessType: "Garage",
    location: "Bradford",
    dateReceived: "2026-06-06",
    status: "Posted",
    sentiment: "Positive",
    draftReplies: [
      "Thanks Imran, we really appreciate the review. It is great to hear you were happy with the MOT service, pricing, and straightforward approach at Bradford Auto Repairs.",
      "Hi Imran, thank you for choosing Bradford Auto Repairs. We are pleased the MOT was quick and clear, and we hope to help again whenever you need us.",
      "Thank you, Imran. Fair, straightforward service is exactly what we aim for, so your feedback means a lot to the team.",
    ],
  },
  {
    id: "rev_curry_priya",
    customerName: "Priya S",
    rating: 2,
    reviewText:
      "Food was nice but delivery was over an hour late and the order was missing one item.",
    source: "Google",
    businessName: "The Curry House Birmingham",
    businessType: "Restaurant",
    location: "Birmingham",
    dateReceived: "2026-06-05",
    status: "Edited",
    sentiment: "Complaint",
    draftReplies: [
      "Hi Priya, thank you for your feedback. We are pleased you enjoyed the food, but we are sorry to hear the delivery was late and an item was missing. Please contact The Curry House Birmingham directly so we can look into the order and help put this right.",
      "Hello Priya, thanks for letting us know. A late delivery and missing item is not the experience we want customers to have. Please get in touch with your order details and our team will review this for you.",
      "Hi Priya, we appreciate your review and are glad the food was nice. We understand the delay and missing item were frustrating. Please contact the restaurant directly so we can follow this up with the delivery team.",
    ],
  },
  {
    id: "rev_estate_amelia",
    customerName: "Amelia T",
    rating: 4,
    reviewText:
      "Good communication throughout our valuation and a clear explanation of the local market.",
    source: "Google",
    businessName: "North Leeds Estate Agents",
    businessType: "Estate agent",
    location: "Leeds",
    dateReceived: "2026-06-04",
    status: "Copied",
    sentiment: "Positive",
    draftReplies: [
      "Thank you, Amelia. We are pleased the valuation was clear and that the team kept you well informed throughout. We appreciate you choosing North Leeds Estate Agents.",
      "Hi Amelia, thanks for your kind review. Clear local advice is really important to us, so it is great to hear the valuation was helpful.",
      "Thank you for taking the time to review us, Amelia. We are glad the communication and market guidance were useful.",
    ],
  },
  {
    id: "rev_plumbing_david",
    customerName: "David L",
    rating: 5,
    reviewText:
      "Turned up when promised, fixed the leak quickly and left everything tidy. Would recommend.",
    source: "Google",
    businessName: "Yorkshire Plumbing Co.",
    businessType: "Trade",
    location: "Wakefield",
    dateReceived: "2026-06-03",
    status: "Draft ready",
    sentiment: "Positive",
    draftReplies: [
      "Hi David, thank you for the recommendation. We are glad the leak was sorted quickly and that everything was left tidy. The Yorkshire Plumbing Co. team really appreciates your review.",
      "Thanks David. Turning up on time and leaving things tidy matters to us, so it is great to hear you were happy with the work.",
      "Thank you for choosing Yorkshire Plumbing Co., David. We are pleased we could help with the leak and appreciate you taking the time to leave a review.",
    ],
  },
];

export const mockLocations: GoogleBusinessLocation[] = [
  {
    id: "loc_glow_leeds",
    businessName: "Glow Salon Leeds",
    address: "14 Albion Street, Leeds LS1",
    status: "Connected",
  },
  {
    id: "loc_smile_mcr",
    businessName: "Smile Studio Manchester",
    address: "22 Deansgate, Manchester M3",
    status: "Connected",
  },
  {
    id: "loc_auto_bradford",
    businessName: "Bradford Auto Repairs",
    address: "Unit 6 Canal Road, Bradford BD1",
    status: "Sync paused",
  },
];

export const savedReplies: SavedReply[] = demoReviews.slice(0, 4).map((review, index) => ({
  id: `saved_${review.id}`,
  reviewId: review.id,
  originalReviewSnippet: review.reviewText,
  replyPreview: review.draftReplies[0],
  tone: index === 1 || index === 3 ? "Empathetic" : "Friendly",
  businessType: review.businessType,
  dateSaved: `2026-06-0${8 - index}`,
  usageCount: [12, 5, 9, 3][index],
  sentiment: review.sentiment,
}));

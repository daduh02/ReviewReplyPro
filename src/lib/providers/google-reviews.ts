import { demoReviews, mockLocations } from "@/lib/demo-data";
import type { GoogleBusinessLocation, Review } from "@/lib/types";

export interface GoogleReviewsProvider {
  connect(): Promise<{ connected: boolean; message: string }>;
  disconnect(): Promise<{ connected: boolean }>;
  listLocations(): Promise<GoogleBusinessLocation[]>;
  syncLatestReviews(): Promise<{ reviews: Review[]; syncedAt: string }>;
}

export class MockGoogleReviewsProvider implements GoogleReviewsProvider {
  async connect() {
    return {
      connected: true,
      message:
        "Demo Google-style reviews. Manual review entry is active now.",
    };
  }

  async disconnect() {
    return { connected: false };
  }

  async listLocations() {
    return mockLocations;
  }

  async syncLatestReviews() {
    return {
      reviews: demoReviews,
      syncedAt: "9 June 2026, 12:15",
    };
  }
}

export class GoogleBusinessProfileProvider implements GoogleReviewsProvider {
  async connect() {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return new MockGoogleReviewsProvider().connect();
    }

    return {
      connected: false,
      message:
        "Real Google OAuth is scaffolded but not enabled in this MVP build.",
    };
  }

  async disconnect() {
    return { connected: false };
  }

  async listLocations() {
    return new MockGoogleReviewsProvider().listLocations();
  }

  async syncLatestReviews() {
    return new MockGoogleReviewsProvider().syncLatestReviews();
  }
}

export function getGoogleReviewsProvider(): GoogleReviewsProvider {
  return process.env.GOOGLE_CLIENT_ID
    ? new GoogleBusinessProfileProvider()
    : new MockGoogleReviewsProvider();
}

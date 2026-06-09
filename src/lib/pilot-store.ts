"use client";

import { useEffect, useMemo, useState } from "react";
import {
  demoLocations,
  demoReviews,
  savedReplies as demoSavedReplies,
} from "@/lib/demo-data";
import type {
  BrandVoiceSettings,
  Business,
  Review,
  ReviewStatus,
  SavedReply,
  Workspace,
} from "@/lib/types";

type PilotState = {
  workspaces: Workspace[];
  businesses: Business[];
  locations: typeof demoLocations;
  reviews: Review[];
  savedReplies: SavedReply[];
  brandVoices: Record<string, BrandVoiceSettings>;
};

const STORAGE_KEY = "reviewreply_pro_pilot_state_v2";

function createInitialState(): PilotState {
  const workspaceId = "workspace_demo";

  return {
    workspaces: [{ id: workspaceId, name: "Fictional demo workspace" }],
    businesses: demoLocations.map((location) => ({
      id: `business_${location.id}`,
      workspaceId,
      name: location.businessName,
      businessType: location.businessType,
    })),
    locations: demoLocations,
    reviews: demoReviews,
    savedReplies: demoSavedReplies,
    brandVoices: Object.fromEntries(
      demoLocations.map((location) => [location.id, location.brandVoice]),
    ),
  };
}

function readState(): PilotState {
  if (typeof window === "undefined") {
    return createInitialState();
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return createInitialState();
    }

    return { ...createInitialState(), ...JSON.parse(stored) } as PilotState;
  } catch {
    return createInitialState();
  }
}

function writeState(state: PilotState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getLocationKey(review: Pick<Review, "businessName" | "location">) {
  return `${review.businessName} — ${review.location}`;
}

export function usePilotStore() {
  const [state, setState] = useState<PilotState>(() => createInitialState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setState(readState());
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function commit(updater: (current: PilotState) => PilotState) {
    setState((current) => {
      const next = updater(current);
      if (typeof window !== "undefined") {
        writeState(next);
      }
      return next;
    });
  }

  const locationsByKey = useMemo(
    () =>
      Object.fromEntries(
        state.locations.map((location) => [
          `${location.businessName} — ${location.location}`,
          location,
        ]),
      ),
    [state.locations],
  );

  function updateReview(id: string, patch: Partial<Review>) {
    commit((current) => ({
      ...current,
      reviews: current.reviews.map((review) =>
        review.id === id ? { ...review, ...patch } : review,
      ),
    }));
  }

  return {
    ...state,
    hydrated,
    locationsByKey,
    addReview(review: Review) {
      commit((current) => ({
        ...current,
        reviews: [review, ...current.reviews],
      }));
    },
    updateReview,
    updateReviewStatus(id: string, status: ReviewStatus) {
      updateReview(id, { status });
    },
    saveReply(reply: SavedReply) {
      commit((current) => {
        const existing = current.savedReplies.some((item) => item.id === reply.id);
        return {
          ...current,
          savedReplies: existing
            ? current.savedReplies.map((item) =>
                item.id === reply.id ? reply : item,
              )
            : [reply, ...current.savedReplies],
        };
      });
    },
    updateBrandVoice(locationId: string, settings: BrandVoiceSettings) {
      commit((current) => ({
        ...current,
        brandVoices: {
          ...current.brandVoices,
          [locationId]: settings,
        },
        locations: current.locations.map((location) =>
          location.id === locationId
            ? { ...location, brandVoice: settings }
            : location,
        ),
      }));
    },
    resetDemoData() {
      const next = createInitialState();
      setState(next);
      if (typeof window !== "undefined") {
        writeState(next);
      }
    },
  };
}

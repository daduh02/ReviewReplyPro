"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type DemoLocation,
  demoLocations,
  demoReviews,
  savedReplies as demoSavedReplies,
} from "@/lib/demo-data";
import {
  customerAccounts,
  customerLocations,
  customerReviews,
  customerSavedReplies,
} from "@/lib/customer-data";
import type {
  AccountType,
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
  locations: DemoLocation[];
  reviews: Review[];
  savedReplies: SavedReply[];
  brandVoices: Record<string, BrandVoiceSettings>;
};

const STORAGE_KEY = "reviewreply_pro_pilot_state_v2";
const protectedAccountTypes: AccountType[] = ["pilot", "customer"];
const knownPilotBusinessNames = new Set([
  "Ashpazi - Charcoal Kitchen",
  "Gardner Champion Solicitors Ltd",
  "Masjid As-Salaam",
]);

function isKnownPilotRecord(item: { businessName?: string; name?: string }) {
  return (
    knownPilotBusinessNames.has(item.businessName ?? "") ||
    knownPilotBusinessNames.has(item.name ?? "")
  );
}

function getMigratedPilotPlan(
  item: { businessName?: string; name?: string },
): "Pilot" | "Free for Life" {
  return item.businessName === "Masjid As-Salaam" || item.name === "Masjid As-Salaam"
    ? "Free for Life"
    : "Pilot";
}

function isProtectedLocation(location: DemoLocation) {
  return (
    protectedAccountTypes.includes(location.accountType ?? "demo") ||
    isKnownPilotRecord(location)
  );
}

function isProtectedBusiness(business: Business) {
  return (
    protectedAccountTypes.includes(business.accountType ?? "demo") ||
    isKnownPilotRecord(business)
  );
}

function isProtectedReview(review: Review) {
  return isKnownPilotRecord(review);
}

function isProtectedWorkspace(workspace: Workspace) {
  return (
    protectedAccountTypes.includes(workspace.accountType ?? "demo") ||
    isKnownPilotRecord(workspace)
  );
}

function createInitialState(): PilotState {
  const workspaceId = "workspace_demo";
  const customerWorkspaces: Workspace[] = customerAccounts.map((account) => ({
    id: `workspace_${account.id}`,
    name: account.name,
    accountType: account.accountType,
    plan: account.plan,
    billingStatus: account.billingStatus,
    active: account.active,
  }));
  const customerBusinesses: Business[] = customerAccounts.flatMap((account) =>
    account.locations.map((location) => ({
      id: `business_${location.id}`,
      workspaceId: `workspace_${account.id}`,
      name: location.businessName,
      businessType: location.businessType,
      accountType: account.accountType,
      active: account.active,
    })),
  );

  return {
    workspaces: [
      {
        id: workspaceId,
        name: "Fictional product testing workspace",
        accountType: "demo",
        plan: "Demo Free",
        billingStatus: "mock_billing",
        active: true,
      },
      ...customerWorkspaces,
    ],
    businesses: [
      ...demoLocations.map((location): Business => ({
        id: `business_${location.id}`,
        workspaceId,
        name: location.businessName,
        businessType: location.businessType,
        accountType: "demo",
        active: true,
      })),
      ...customerBusinesses,
    ],
    locations: [
      ...demoLocations.map((location) => ({
        ...location,
        accountType: "demo" as const,
        active: true,
      })),
      ...customerLocations,
    ],
    reviews: [...demoReviews, ...customerReviews],
    savedReplies: [...demoSavedReplies, ...customerSavedReplies],
    brandVoices: Object.fromEntries(
      [...demoLocations, ...customerLocations].map((location) => [
        location.id,
        location.brandVoice,
      ]),
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

    return mergeWithInitialState(JSON.parse(stored) as Partial<PilotState>);
  } catch {
    return createInitialState();
  }
}

function writeState(state: PilotState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function mergeById<T extends { id: string }>(seeded: T[], stored: T[] = []) {
  const storedIds = new Set(stored.map((item) => item.id));
  return [...stored, ...seeded.filter((item) => !storedIds.has(item.id))];
}

function mergeWithInitialState(stored: Partial<PilotState>): PilotState {
  const initial = createInitialState();
  const storedLocations = (stored.locations ?? []).map((location) =>
    isKnownPilotRecord(location)
      ? {
          ...location,
          accountType: "pilot" as const,
          plan: getMigratedPilotPlan(location),
          billingStatus: "exempt" as const,
          pilotStatus: "active" as const,
          active: true,
        }
      : location,
  );
  const storedBusinesses = (stored.businesses ?? []).map((business) =>
    isKnownPilotRecord(business)
      ? { ...business, accountType: "pilot" as const, active: true }
      : business,
  );
  const storedWorkspaces = (stored.workspaces ?? []).map((workspace) =>
    isKnownPilotRecord(workspace)
      ? {
          ...workspace,
          accountType: "pilot" as const,
          plan: getMigratedPilotPlan(workspace),
          billingStatus: "exempt" as const,
          active: true,
        }
      : workspace,
  );
  const locations = mergeById(initial.locations, storedLocations);

  return {
    workspaces: mergeById(initial.workspaces, storedWorkspaces),
    businesses: mergeById(initial.businesses, storedBusinesses),
    locations,
    reviews: mergeById(initial.reviews, stored.reviews),
    savedReplies: mergeById(initial.savedReplies, stored.savedReplies),
    brandVoices: {
      ...Object.fromEntries(
        locations.map((location) => [location.id, location.brandVoice]),
      ),
      ...stored.brandVoices,
    },
  };
}

export function getLocationKey(review: Pick<Review, "businessName" | "location">) {
  return `${review.businessName} — ${review.location}`;
}

export function usePilotStore({ includeCustomerAccounts = false } = {}) {
  const [state, setState] = useState<PilotState>(() => createInitialState());
  const [hydrated, setHydrated] = useState(false);
  const visibleLocations = useMemo(
    () =>
      includeCustomerAccounts
        ? state.locations
        : state.locations.filter((location) => !isProtectedLocation(location)),
    [includeCustomerAccounts, state.locations],
  );
  const visibleBusinesses = useMemo(
    () =>
      includeCustomerAccounts
        ? state.businesses
        : state.businesses.filter((business) => !isProtectedBusiness(business)),
    [includeCustomerAccounts, state.businesses],
  );
  const visibleWorkspaces = useMemo(
    () =>
      includeCustomerAccounts
        ? state.workspaces
        : state.workspaces.filter((workspace) => !isProtectedWorkspace(workspace)),
    [includeCustomerAccounts, state.workspaces],
  );
  const visibleReviews = useMemo(
    () =>
      includeCustomerAccounts
        ? state.reviews
        : state.reviews.filter((review) => !isProtectedReview(review)),
    [includeCustomerAccounts, state.reviews],
  );
  const visibleSavedReplies = useMemo(
    () =>
      includeCustomerAccounts
        ? state.savedReplies
        : state.savedReplies.filter((reply) =>
            visibleReviews.some((review) => review.id === reply.reviewId),
          ),
    [includeCustomerAccounts, state.savedReplies, visibleReviews],
  );

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
        visibleLocations.map((location) => [
          `${location.businessName} — ${location.location}`,
          location,
        ]),
      ),
    [visibleLocations],
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
    workspaces: visibleWorkspaces,
    businesses: visibleBusinesses,
    locations: visibleLocations,
    reviews: visibleReviews,
    savedReplies: visibleSavedReplies,
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
      const protectedState = {
        workspaces: state.workspaces.filter(isProtectedWorkspace),
        businesses: state.businesses.filter(isProtectedBusiness),
        locations: state.locations.filter(isProtectedLocation),
        reviews: state.reviews.filter(isProtectedReview),
        savedReplies: state.savedReplies.filter((reply) =>
          state.reviews.some(
            (review) => review.id === reply.reviewId && isProtectedReview(review),
          ),
        ),
      };
      const mergedNext: PilotState = {
        ...next,
        workspaces: mergeById(next.workspaces, protectedState.workspaces),
        businesses: mergeById(next.businesses, protectedState.businesses),
        locations: mergeById(next.locations, protectedState.locations),
        reviews: mergeById(next.reviews, protectedState.reviews),
        savedReplies: mergeById(next.savedReplies, protectedState.savedReplies),
        brandVoices: {
          ...next.brandVoices,
          ...Object.fromEntries(
            protectedState.locations.map((location) => [
              location.id,
              state.brandVoices[location.id] ?? location.brandVoice,
            ]),
          ),
        },
      };
      setState(mergedNext);
      if (typeof window !== "undefined") {
        writeState(mergedNext);
      }
    },
  };
}

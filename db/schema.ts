export const haaltTriggers = [
  "Hungry",
  "Angry",
  "Alone",
  "Lonely",
  "Tired",
] as const;

export const usageRoutes = [
  "bowl",
  "joint",
  "blunt",
  "vape",
  "edible",
  "dab",
  "tincture",
  "other",
] as const;

export const usageAmounts = ["small", "medium", "large"] as const;

export type HaaltTrigger = (typeof haaltTriggers)[number];
export type UsageRoute = (typeof usageRoutes)[number];
export type UsageAmount = (typeof usageAmounts)[number];

export type CravingEntry = {
  id: string;
  user_id: string;
  intensity: number;
  triggers: string[];
  location: string | null;
  notes: string | null;
  created_at: string;
};

export type UsageEntry = {
  id: string;
  user_id: string;
  route: UsageRoute;
  amount: UsageAmount;
  triggers: string[];
  notes: string | null;
  created_at: string;
};

export type HistoryEntry =
  | {
      id: string;
      type: "craving";
      created_at: string;
      triggers: string[];
      intensity: number;
      location: string | null;
      notes: string | null;
    }
  | {
      id: string;
      type: "usage";
      created_at: string;
      triggers: string[];
      route: UsageRoute;
      amount: UsageAmount;
      notes: string | null;
    };

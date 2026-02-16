import { z } from "zod";
import { haaltTriggers, usageAmounts, usageRoutes } from "@/db/schema";

export const cravingSchema = z.object({
  intensity: z.coerce.number().min(1).max(10),
  triggers: z.array(z.string()).default([]),
  location: z.string().max(120).optional(),
  notes: z.string().max(1000).optional(),
});

export const usageSchema = z.object({
  route: z.enum(usageRoutes),
  amount: z.enum(usageAmounts),
  triggers: z.array(z.string()).default([]),
  notes: z.string().max(1000).optional(),
});

export const onboardingSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  streakStart: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  motivation: z.string().trim().min(8).max(280),
  topTriggers: z.array(z.string()).max(5),
});

export const triggerOptions = [...haaltTriggers, "Custom"] as const;

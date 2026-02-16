import { describe, expect, it } from "vitest";
import { cravingSchema, onboardingSchema, usageSchema } from "@/lib/validation";

describe("cravingSchema", () => {
  it("parses a valid payload", () => {
    const result = cravingSchema.parse({
      intensity: 7,
      triggers: ["Hungry"],
      location: "Home",
      notes: "Strong urge after work",
    });

    expect(result.intensity).toBe(7);
    expect(result.triggers).toEqual(["Hungry"]);
  });

  it("rejects intensity outside 1..10", () => {
    expect(() => cravingSchema.parse({ intensity: 0, triggers: [] })).toThrow();
    expect(() => cravingSchema.parse({ intensity: 11, triggers: [] })).toThrow();
  });
});

describe("usageSchema", () => {
  it("parses valid route and amount", () => {
    const result = usageSchema.parse({
      route: "vape",
      amount: "medium",
      triggers: ["Tired"],
    });

    expect(result.route).toBe("vape");
    expect(result.amount).toBe("medium");
  });

  it("rejects invalid route and amount", () => {
    expect(() => usageSchema.parse({ route: "pipe", amount: "small", triggers: [] })).toThrow();
    expect(() => usageSchema.parse({ route: "vape", amount: "xl", triggers: [] })).toThrow();
  });
});

describe("onboardingSchema", () => {
  it("parses valid onboarding payload", () => {
    const result = onboardingSchema.parse({
      displayName: "Manav",
      streakStart: "2026-02-10",
      motivation: "I want to improve focus and sleep quality.",
      topTriggers: ["Tired", "Alone"],
    });

    expect(result.displayName).toBe("Manav");
    expect(result.streakStart).toBe("2026-02-10");
  });

  it("rejects too-short display names and invalid date format", () => {
    expect(() =>
      onboardingSchema.parse({
        displayName: "A",
        streakStart: "10-02-2026",
        motivation: "I need support right now.",
        topTriggers: [],
      }),
    ).toThrow();
  });
});

import { describe, expect, it } from "vitest";
import { haaltTriggers, usageAmounts, usageRoutes } from "@/db/schema";

describe("domain constants", () => {
  it("includes standard HAALT trigger set", () => {
    expect(haaltTriggers).toEqual(["Hungry", "Angry", "Alone", "Lonely", "Tired"]);
  });

  it("includes supported usage routes", () => {
    expect(usageRoutes).toContain("vape");
    expect(usageRoutes).toContain("edible");
    expect(usageRoutes).toContain("other");
  });

  it("has exactly three usage amount buckets", () => {
    expect(usageAmounts).toEqual(["small", "medium", "large"]);
  });
});

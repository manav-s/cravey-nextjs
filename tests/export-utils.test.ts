import { describe, expect, it } from "vitest";
import { boundReportDays, rowsToCsv } from "@/lib/export-utils";

describe("rowsToCsv", () => {
  it("returns empty string for empty rows", () => {
    expect(rowsToCsv([])).toBe("");
  });

  it("serializes rows and escapes quotes", () => {
    const csv = rowsToCsv([
      {
        type: "craving",
        notes: "He said \"pause\"",
        triggers: ["Hungry", "Alone"],
      },
    ]);

    expect(csv).toContain("type,notes,triggers");
    expect(csv).toContain('"craving","He said ""pause""","Hungry|Alone"');
  });
});

describe("boundReportDays", () => {
  it("accepts valid day windows", () => {
    expect(boundReportDays(30)).toBe(30);
    expect(boundReportDays(60)).toBe(60);
    expect(boundReportDays(90)).toBe(90);
  });

  it("falls back to 30 for invalid values", () => {
    expect(boundReportDays(0)).toBe(30);
    expect(boundReportDays(120)).toBe(30);
    expect(boundReportDays(Number.NaN)).toBe(30);
  });
});

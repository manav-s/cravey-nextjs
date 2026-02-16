"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { haaltTriggers, usageAmounts, usageRoutes } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const amountDescriptions: Record<(typeof usageAmounts)[number], string> = {
  small: "Small amount",
  medium: "Medium amount",
  large: "Large amount",
};

export function UsageForm() {
  const router = useRouter();
  const [route, setRoute] = useState<(typeof usageRoutes)[number]>("bowl");
  const [amount, setAmount] = useState<(typeof usageAmounts)[number]>("small");
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [customTrigger, setCustomTrigger] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggers = useMemo(() => {
    const custom = customTrigger.trim();
    return custom ? [...selectedTriggers, custom] : selectedTriggers;
  }, [customTrigger, selectedTriggers]);

  function toggleTrigger(trigger: string) {
    setSelectedTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((item) => item !== trigger) : [...prev, trigger],
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route, amount, triggers, notes }),
      });

      if (!response.ok) {
        throw new Error("Unable to save usage entry");
      }

      router.push("/dashboard?saved=usage");
    } catch {
      setError("Could not save your usage log right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Usage</CardTitle>
        <CardDescription>Track route, amount, and context.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="route">Route</Label>
            <select
              id="route"
              value={route}
              onChange={(event) => setRoute(event.target.value as (typeof usageRoutes)[number])}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {usageRoutes.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <select
              id="amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value as (typeof usageAmounts)[number])}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {usageAmounts.map((item) => (
                <option value={item} key={item}>
                  {item} — {amountDescriptions[item]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Triggers (HAALT)</Label>
            <div className="grid grid-cols-2 gap-2">
              {haaltTriggers.map((trigger) => {
                const checked = selectedTriggers.includes(trigger);
                return (
                  <label
                    key={trigger}
                    className="flex items-center gap-2 rounded-md border border-border p-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTrigger(trigger)}
                    />
                    {trigger}
                  </label>
                );
              })}
            </div>
            <Input
              placeholder="Custom trigger (optional)"
              value={customTrigger}
              onChange={(event) => setCustomTrigger(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any context to remember"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button className="w-full" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save Usage"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

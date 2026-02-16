"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { haaltTriggers } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CravingForm() {
  const router = useRouter();
  const [intensity, setIntensity] = useState(5);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [customTrigger, setCustomTrigger] = useState("");
  const [location, setLocation] = useState("");
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
      const response = await fetch("/api/cravings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intensity,
          triggers,
          location,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save craving entry");
      }

      router.push("/dashboard?saved=craving");
    } catch {
      setError("Could not save your craving right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Craving</CardTitle>
        <CardDescription>Capture this moment in under 15 seconds.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="intensity">Intensity: {intensity}/10</Label>
            <input
              id="intensity"
              type="range"
              min={1}
              max={10}
              value={intensity}
              onChange={(event) => setIntensity(Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-primary"
            />
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
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              placeholder="Where are you right now?"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="What are you feeling?"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button className="w-full" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save Craving"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

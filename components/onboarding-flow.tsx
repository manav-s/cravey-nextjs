"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { triggerOptions } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type OnboardingFlowProps = {
  initialDisplayName: string;
  initialStreakStart: string;
};

const steps = ["Profile", "Context", "Triggers", "Finish"] as const;

export function OnboardingFlow({ initialDisplayName, initialStreakStart }: OnboardingFlowProps) {
  const router = useRouter();

  const [stepIndex, setStepIndex] = useState(0);
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [streakStart, setStreakStart] = useState(initialStreakStart);
  const [motivation, setMotivation] = useState("");
  const [topTriggers, setTopTriggers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = useMemo(() => ((stepIndex + 1) / steps.length) * 100, [stepIndex]);

  const canContinue = useMemo(() => {
    if (stepIndex === 0) {
      return displayName.trim().length >= 2;
    }
    if (stepIndex === 1) {
      return motivation.trim().length >= 8;
    }
    if (stepIndex === 2) {
      return topTriggers.length > 0;
    }
    return true;
  }, [displayName, motivation, stepIndex, topTriggers.length]);

  function toggleTrigger(trigger: string) {
    setTopTriggers((current) => {
      if (current.includes(trigger)) {
        return current.filter((item) => item !== trigger);
      }
      if (current.length >= 5) {
        return current;
      }
      return [...current, trigger];
    });
  }

  async function completeOnboarding() {
    setSaving(true);
    setError(null);

    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: displayName.trim(),
        streakStart: streakStart ? streakStart : null,
        motivation: motivation.trim(),
        topTriggers,
      }),
    });

    if (!response.ok) {
      setError("Could not save onboarding. Please try again.");
      setSaving(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader className="space-y-3">
        <CardTitle>Set up your recovery profile</CardTitle>
        <CardDescription>
          Quick 4-step onboarding so Cravey can personalize your experience better than a one-click login.
        </CardDescription>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Step {stepIndex + 1} of {steps.length}
            </span>
            <span>{steps[stepIndex]}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {stepIndex === 0 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">What should we call you?</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Your name"
                maxLength={80}
              />
            </div>
          </div>
        ) : null}

        {stepIndex === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="streakStart">When was your last use? (optional)</Label>
              <Input
                id="streakStart"
                type="date"
                value={streakStart}
                onChange={(event) => setStreakStart(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivation">Why are you making this change right now?</Label>
              <Textarea
                id="motivation"
                value={motivation}
                onChange={(event) => setMotivation(event.target.value)}
                rows={4}
                maxLength={280}
                placeholder="Sleep, focus, anxiety, relationships, energy..."
              />
              <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
            </div>
          </div>
        ) : null}

        {stepIndex === 2 ? (
          <div className="space-y-3">
            <Label>What usually triggers cravings? (pick up to 5)</Label>
            <div className="grid grid-cols-2 gap-2">
              {triggerOptions.map((trigger) => {
                const active = topTriggers.includes(trigger);
                return (
                  <button
                    key={trigger}
                    type="button"
                    onClick={() => toggleTrigger(trigger)}
                    className={[
                      "rounded-md border px-3 py-2 text-left text-sm transition-colors",
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-accent",
                    ].join(" ")}
                  >
                    {trigger}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">Selected: {topTriggers.length}/5</p>
          </div>
        ) : null}

        {stepIndex === 3 ? (
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">Review before entering your dashboard:</p>
            <div className="rounded-md border border-border bg-muted/40 p-3">
              <p>
                <span className="font-medium">Name:</span> {displayName.trim()}
              </p>
              <p>
                <span className="font-medium">Last use date:</span> {streakStart || "Not set"}
              </p>
              <p>
                <span className="font-medium">Motivation:</span> {motivation.trim()}
              </p>
              <p>
                <span className="font-medium">Top triggers:</span> {topTriggers.join(", ")}
              </p>
            </div>
          </div>
        ) : null}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
            disabled={stepIndex === 0 || saving}
          >
            Back
          </Button>

          {stepIndex < steps.length - 1 ? (
            <Button
              type="button"
              onClick={() => setStepIndex((current) => Math.min(steps.length - 1, current + 1))}
              disabled={!canContinue || saving}
            >
              Continue
            </Button>
          ) : (
            <Button type="button" onClick={completeOnboarding} disabled={saving || !canContinue}>
              {saving ? "Saving..." : "Finish onboarding"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

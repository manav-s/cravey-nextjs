import { redirect } from "next/navigation";
import { Nav } from "@/components/nav";
import { OnboardingFlow } from "@/components/onboarding-flow";
import { getUserOnboardingState } from "@/db";
import { requireUser } from "@/lib/session";

export default async function OnboardingPage() {
  const user = await requireUser();
  const onboarding = await getUserOnboardingState(user.id);

  if (onboarding.onboardingCompleted) {
    redirect("/dashboard");
  }

  const initialStreakStart = onboarding.streakStart
    ? onboarding.streakStart.slice(0, 10)
    : "";

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-xl space-y-4 px-4 py-6">
        <OnboardingFlow
          initialDisplayName={onboarding.displayName ?? ""}
          initialStreakStart={initialStreakStart}
        />
      </main>
    </>
  );
}

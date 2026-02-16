import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LandingPage } from "@/components/landing-page";
import { getUserOnboardingState } from "@/db";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    const onboarding = await getUserOnboardingState(session.user.id);
    redirect(onboarding.onboardingCompleted ? "/dashboard" : "/onboarding");
  }

  return <LandingPage />;
}

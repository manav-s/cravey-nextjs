import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserOnboardingState } from "@/db";

export async function requireUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session.user;
}

export async function requireOnboardedUser() {
  const user = await requireUser();
  const onboarding = await getUserOnboardingState(user.id);

  if (!onboarding.onboardingCompleted) {
    redirect("/onboarding");
  }

  return user;
}

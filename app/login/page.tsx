import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
import { getUserOnboardingState } from "@/db";

type LoginPageProps = {
  searchParams: Promise<{ checkEmail?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    const onboarding = await getUserOnboardingState(session.user.id);
    redirect(onboarding.onboardingCompleted ? "/dashboard" : "/onboarding");
  }

  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <div className="w-full space-y-3">
        {params.checkEmail ? (
          <div className="rounded-md border border-border bg-muted p-3 text-sm text-muted-foreground">
            Check your email for the sign-in link.
          </div>
        ) : null}
        <LoginForm />
      </div>
    </main>
  );
}

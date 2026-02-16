import { NextResponse } from "next/server";
import { completeUserOnboarding } from "@/db";
import { requireUser } from "@/lib/session";
import { onboardingSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const user = await requireUser();
  const payload = await request.json();
  const parsed = onboardingSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid onboarding payload" }, { status: 400 });
  }

  await completeUserOnboarding({
    userId: user.id,
    displayName: parsed.data.displayName,
    streakStart: parsed.data.streakStart,
  });

  return NextResponse.json({ ok: true });
}

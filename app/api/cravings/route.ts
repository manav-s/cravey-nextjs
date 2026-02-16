import { NextResponse } from "next/server";
import { createCravingEntry } from "@/db";
import { requireOnboardedUser } from "@/lib/session";
import { cravingSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const user = await requireOnboardedUser();
  const payload = await request.json();
  const parsed = cravingSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await createCravingEntry({
    userId: user.id,
    intensity: parsed.data.intensity,
    triggers: parsed.data.triggers,
    location: parsed.data.location,
    notes: parsed.data.notes,
  });

  return NextResponse.json({ ok: true });
}

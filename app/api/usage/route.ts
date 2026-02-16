import { NextResponse } from "next/server";
import { createUsageEntry } from "@/db";
import { requireOnboardedUser } from "@/lib/session";
import { usageSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const user = await requireOnboardedUser();
  const payload = await request.json();
  const parsed = usageSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await createUsageEntry({
    userId: user.id,
    route: parsed.data.route,
    amount: parsed.data.amount,
    triggers: parsed.data.triggers,
    notes: parsed.data.notes,
  });

  return NextResponse.json({ ok: true });
}

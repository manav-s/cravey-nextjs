import { NextResponse } from "next/server";
import { deleteAllUserData } from "@/db";
import { requireOnboardedUser } from "@/lib/session";

export async function DELETE() {
  const user = await requireOnboardedUser();
  await deleteAllUserData(user.id);
  return NextResponse.json({ ok: true });
}

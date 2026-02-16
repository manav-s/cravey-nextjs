import { NextResponse } from "next/server";
import { getHistory } from "@/db";
import { requireOnboardedUser } from "@/lib/session";

export async function GET(request: Request) {
  const user = await requireOnboardedUser();
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get("type") ?? "all") as "all" | "craving" | "usage";
  const page = Number(searchParams.get("page") ?? "1");

  const items = await getHistory({
    userId: user.id,
    type: type === "craving" || type === "usage" ? type : "all",
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 20,
  });

  return NextResponse.json({ items });
}

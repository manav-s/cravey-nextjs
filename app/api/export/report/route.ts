import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getDashboardStats } from "@/db";
import { boundReportDays } from "@/lib/export-utils";
import { requireOnboardedUser } from "@/lib/session";

export async function GET(request: Request) {
  const user = await requireOnboardedUser();
  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") ?? "30");
  const boundedDays = boundReportDays(days);

  const dashboard = await getDashboardStats(user.id);

  const [usageFrequency] = await sql<{ count: number }>`
    SELECT COUNT(*)::int AS count
    FROM usage_entries
    WHERE user_id = ${user.id}
      AND created_at >= now() - (${boundedDays} * interval '1 day');
  `;

  return NextResponse.json({
    days: boundedDays,
    generatedAt: new Date().toISOString(),
    streakDays: dashboard.streakDays,
    topTriggers: dashboard.topTriggers,
    cravingTrend: dashboard.cravingTrend,
    weeklySummary: dashboard.weeklySummary,
    usageFrequency: usageFrequency?.count ?? 0,
  });
}

import { getDashboardStats } from "@/db";
import { DashboardCharts } from "@/components/dashboard-charts";
import { Nav } from "@/components/nav";
import { SosButton } from "@/components/sos-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireOnboardedUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await requireOnboardedUser();
  const stats = await getDashboardStats(user.id);

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-5xl space-y-4 px-4 py-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.streakDays}</p>
              <p className="text-sm text-muted-foreground">days since last usage</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Cravings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{stats.weeklySummary.cravingsThisWeek}</p>
              <p className="text-sm text-muted-foreground">
                Last week: {stats.weeklySummary.cravingsLastWeek}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{stats.weeklySummary.usageThisWeek}</p>
              <p className="text-sm text-muted-foreground">Last week: {stats.weeklySummary.usageLastWeek}</p>
            </CardContent>
          </Card>
        </div>

        <DashboardCharts cravingTrend={stats.cravingTrend} topTriggers={stats.topTriggers} />

        <SosButton />
      </main>
    </>
  );
}

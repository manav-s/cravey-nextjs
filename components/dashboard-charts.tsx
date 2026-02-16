"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DashboardChartsProps = {
  cravingTrend: Array<{ date: string; averageIntensity: number }>;
  topTriggers: Array<{ trigger: string; count: number }>;
};

export function DashboardCharts({ cravingTrend, topTriggers }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-border p-4">
        <h3 className="mb-3 text-sm font-medium">Craving Intensity (30 days)</h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cravingTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="averageIntensity" stroke="currentColor" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-border p-4">
        <h3 className="mb-3 text-sm font-medium">Top Triggers</h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topTriggers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="trigger" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="currentColor" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

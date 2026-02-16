import { sql } from "@/lib/db";
import { usageAmounts, usageRoutes } from "./schema";

export type DashboardStats = {
  streakDays: number;
  cravingTrend: Array<{ date: string; averageIntensity: number }>;
  topTriggers: Array<{ trigger: string; count: number }>;
  weeklySummary: {
    cravingsThisWeek: number;
    cravingsLastWeek: number;
    usageThisWeek: number;
    usageLastWeek: number;
  };
};

export type UserOnboardingState = {
  onboardingCompleted: boolean;
  displayName: string | null;
  streakStart: string | null;
};

export async function getUserOnboardingState(userId: string): Promise<UserOnboardingState> {
  const [row] = await sql<{
    onboardingCompleted: boolean;
    displayName: string | null;
    streakStart: string | null;
  }>`
    SELECT
      onboarding_completed AS "onboardingCompleted",
      display_name AS "displayName",
      streak_start::text AS "streakStart"
    FROM users
    WHERE id = ${userId}
    LIMIT 1;
  `;

  return (
    row ?? {
      onboardingCompleted: false,
      displayName: null,
      streakStart: null,
    }
  );
}

export async function completeUserOnboarding(input: {
  userId: string;
  displayName: string;
  streakStart: string | null;
}) {
  const [row] = await sql<{
    onboardingCompleted: boolean;
  }>`
    UPDATE users
    SET
      display_name = ${input.displayName},
      streak_start = ${input.streakStart},
      onboarding_completed = true
    WHERE id = ${input.userId}
    RETURNING onboarding_completed AS "onboardingCompleted";
  `;

  return row ?? { onboardingCompleted: false };
}

export async function createCravingEntry(input: {
  userId: string;
  intensity: number;
  triggers: string[];
  location?: string;
  notes?: string;
}) {
  const [row] = await sql<{
    id: string;
  }>`
    INSERT INTO craving_entries (user_id, intensity, triggers, location, notes)
    VALUES (
      ${input.userId},
      ${input.intensity},
      ${input.triggers},
      ${input.location ?? null},
      ${input.notes ?? null}
    )
    RETURNING id;
  `;

  return row;
}

export async function createUsageEntry(input: {
  userId: string;
  route: string;
  amount: string;
  triggers: string[];
  notes?: string;
}) {
  if (!usageRoutes.includes(input.route as (typeof usageRoutes)[number])) {
    throw new Error("Invalid route");
  }

  if (!usageAmounts.includes(input.amount as (typeof usageAmounts)[number])) {
    throw new Error("Invalid amount");
  }

  const [row] = await sql<{
    id: string;
  }>`
    INSERT INTO usage_entries (user_id, route, amount, triggers, notes)
    VALUES (
      ${input.userId},
      ${input.route},
      ${input.amount},
      ${input.triggers},
      ${input.notes ?? null}
    )
    RETURNING id;
  `;

  return row;
}

export async function getHistory(input: {
  userId: string;
  type: "all" | "craving" | "usage";
  page: number;
  pageSize: number;
}) {
  const offset = (input.page - 1) * input.pageSize;

  if (input.type === "craving") {
    return sql`
      SELECT
        id,
        'craving' AS type,
        created_at,
        triggers,
        intensity,
        location,
        notes,
        NULL::text AS route,
        NULL::text AS amount
      FROM craving_entries
      WHERE user_id = ${input.userId}
      ORDER BY created_at DESC
      LIMIT ${input.pageSize}
      OFFSET ${offset};
    `;
  }

  if (input.type === "usage") {
    return sql`
      SELECT
        id,
        'usage' AS type,
        created_at,
        triggers,
        NULL::integer AS intensity,
        NULL::text AS location,
        notes,
        route,
        amount
      FROM usage_entries
      WHERE user_id = ${input.userId}
      ORDER BY created_at DESC
      LIMIT ${input.pageSize}
      OFFSET ${offset};
    `;
  }

  return sql`
    SELECT * FROM (
      SELECT
        id,
        'craving' AS type,
        created_at,
        triggers,
        intensity,
        location,
        notes,
        NULL::text AS route,
        NULL::text AS amount
      FROM craving_entries
      WHERE user_id = ${input.userId}

      UNION ALL

      SELECT
        id,
        'usage' AS type,
        created_at,
        triggers,
        NULL::integer AS intensity,
        NULL::text AS location,
        notes,
        route,
        amount
      FROM usage_entries
      WHERE user_id = ${input.userId}
    ) combined
    ORDER BY created_at DESC
    LIMIT ${input.pageSize}
    OFFSET ${offset};
  `;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [lastUsage] = await sql<{ created_at: string }>`
    SELECT created_at
    FROM usage_entries
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 1;
  `;

  const streakDays = lastUsage
    ? Math.floor(
        (new Date().getTime() - new Date(lastUsage.created_at).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  const cravingTrend = await sql<{ date: string; averageIntensity: number }>`
    SELECT
      to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS date,
      ROUND(AVG(intensity)::numeric, 2)::float AS "averageIntensity"
    FROM craving_entries
    WHERE user_id = ${userId}
      AND created_at >= now() - interval '30 days'
    GROUP BY date_trunc('day', created_at)
    ORDER BY date_trunc('day', created_at) ASC;
  `;

  const topTriggers = await sql<{ trigger: string; count: number }>`
    SELECT trigger, COUNT(*)::int AS count
    FROM (
      SELECT unnest(triggers) AS trigger
      FROM craving_entries
      WHERE user_id = ${userId}
      UNION ALL
      SELECT unnest(triggers) AS trigger
      FROM usage_entries
      WHERE user_id = ${userId}
    ) t
    GROUP BY trigger
    ORDER BY count DESC
    LIMIT 5;
  `;

  const [weekly] = await sql<{
    cravingsThisWeek: number;
    cravingsLastWeek: number;
    usageThisWeek: number;
    usageLastWeek: number;
  }>`
    SELECT
      (
        SELECT COUNT(*)::int
        FROM craving_entries
        WHERE user_id = ${userId}
          AND created_at >= date_trunc('week', now())
      ) AS "cravingsThisWeek",
      (
        SELECT COUNT(*)::int
        FROM craving_entries
        WHERE user_id = ${userId}
          AND created_at >= date_trunc('week', now()) - interval '1 week'
          AND created_at < date_trunc('week', now())
      ) AS "cravingsLastWeek",
      (
        SELECT COUNT(*)::int
        FROM usage_entries
        WHERE user_id = ${userId}
          AND created_at >= date_trunc('week', now())
      ) AS "usageThisWeek",
      (
        SELECT COUNT(*)::int
        FROM usage_entries
        WHERE user_id = ${userId}
          AND created_at >= date_trunc('week', now()) - interval '1 week'
          AND created_at < date_trunc('week', now())
      ) AS "usageLastWeek";
  `;

  return {
    streakDays,
    cravingTrend,
    topTriggers,
    weeklySummary: weekly ?? {
      cravingsThisWeek: 0,
      cravingsLastWeek: 0,
      usageThisWeek: 0,
      usageLastWeek: 0,
    },
  };
}

export async function getExportData(userId: string) {
  const cravings = await sql`
    SELECT id, intensity, triggers, location, notes, created_at
    FROM craving_entries
    WHERE user_id = ${userId}
    ORDER BY created_at DESC;
  `;

  const usage = await sql`
    SELECT id, route, amount, triggers, notes, created_at
    FROM usage_entries
    WHERE user_id = ${userId}
    ORDER BY created_at DESC;
  `;

  return { cravings, usage };
}

export async function deleteAllUserData(userId: string) {
  await sql`DELETE FROM recordings WHERE user_id = ${userId};`;
  await sql`DELETE FROM craving_entries WHERE user_id = ${userId};`;
  await sql`DELETE FROM usage_entries WHERE user_id = ${userId};`;
}

import Link from "next/link";
import { Nav } from "@/components/nav";
import { SettingsActions } from "@/components/settings-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireOnboardedUser } from "@/lib/session";

export default async function SettingsPage() {
  await requireOnboardedUser();

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-xl space-y-4 px-4 py-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/settings/export"
              className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
            >
              Export Data
            </Link>
            <SettingsActions />
          </CardContent>
        </Card>
      </main>
    </>
  );
}

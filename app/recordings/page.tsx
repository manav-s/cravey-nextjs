import { Nav } from "@/components/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireOnboardedUser } from "@/lib/session";

export default async function RecordingsPage() {
  await requireOnboardedUser();

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-xl space-y-4 px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Recordings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Recording playback and capture are planned for Phase 2.
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

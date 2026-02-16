import { Nav } from "@/components/nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireOnboardedUser } from "@/lib/session";
import { ExportClient } from "./export-client";

export default async function ExportPage() {
  await requireOnboardedUser();

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-xl space-y-4 px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
            <CardDescription>
              Export all your data as JSON/CSV or generate a PDF report for 30, 60, or 90 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExportClient />
          </CardContent>
        </Card>
      </main>
    </>
  );
}

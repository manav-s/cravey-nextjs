import { HistoryClient } from "@/components/history-client";
import { Nav } from "@/components/nav";
import { requireOnboardedUser } from "@/lib/session";

export default async function HistoryPage() {
  await requireOnboardedUser();

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-3xl space-y-4 px-4 py-6">
        <h1 className="text-2xl font-semibold">History</h1>
        <HistoryClient />
      </main>
    </>
  );
}

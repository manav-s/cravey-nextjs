import Link from "next/link";
import { CravingForm } from "@/components/craving-form";
import { Nav } from "@/components/nav";
import { requireOnboardedUser } from "@/lib/session";

export default async function LogCravingPage() {
  await requireOnboardedUser();

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-xl space-y-4 px-4 py-6">
        <CravingForm />
        <Link
          href="/recordings"
          className="inline-flex h-10 w-full items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
        >
          Play a recording
        </Link>
      </main>
    </>
  );
}

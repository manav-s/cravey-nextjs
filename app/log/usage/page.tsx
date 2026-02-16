import { UsageForm } from "@/components/usage-form";
import { Nav } from "@/components/nav";
import { requireOnboardedUser } from "@/lib/session";

export default async function LogUsagePage() {
  await requireOnboardedUser();

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-xl space-y-4 px-4 py-6">
        <UsageForm />
      </main>
    </>
  );
}

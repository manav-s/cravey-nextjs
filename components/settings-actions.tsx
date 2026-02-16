"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SettingsActions() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onDeleteData() {
    setLoading(true);
    try {
      const response = await fetch("/api/user/delete-data", { method: "DELETE" });
      if (response.ok) {
        setOpen(false);
        router.push("/dashboard?deleted=true");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete All My Data
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-background p-5">
            <h3 className="text-base font-semibold">Delete all data?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This permanently deletes your craving logs, usage logs, and recordings.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={onDeleteData} disabled={loading}>
                {loading ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

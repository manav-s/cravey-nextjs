"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SosButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Button variant="secondary" onClick={() => setOpen((v) => !v)}>
        SOS
      </Button>
      {open ? (
        <div className="rounded-md border border-border p-3 text-sm text-muted-foreground">
          Add support contacts in a future phase. For now, use your phone contacts to call or text someone you trust.
        </div>
      ) : null}
    </div>
  );
}

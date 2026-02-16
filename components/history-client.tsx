"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HistoryFeed } from "@/components/history-feed";

type Item = {
  id: string;
  type: "craving" | "usage";
  created_at: string;
  triggers: string[];
  intensity: number | null;
  route: string | null;
  amount: string | null;
  notes: string | null;
};

export function HistoryClient() {
  const [type, setType] = useState<"all" | "craving" | "usage">("all");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const response = await fetch(`/api/history?type=${type}&page=${page}`);
      const data = (await response.json()) as { items: Item[] };
      if (!cancelled) {
        setItems(data.items);
      }
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [type, page]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant={type === "all" ? "default" : "outline"} onClick={() => { setType("all"); setPage(1); }}>
          All
        </Button>
        <Button variant={type === "craving" ? "default" : "outline"} onClick={() => { setType("craving"); setPage(1); }}>
          Cravings
        </Button>
        <Button variant={type === "usage" ? "default" : "outline"} onClick={() => { setType("usage"); setPage(1); }}>
          Usage
        </Button>
      </div>

      {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : <HistoryFeed items={items} />}

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <Button variant="outline" onClick={() => setPage((value) => value + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

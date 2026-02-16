import { Badge } from "@/components/ui/badge";

type FeedItem = {
  id: string;
  type: "craving" | "usage";
  created_at: string;
  triggers: string[];
  intensity: number | null;
  route: string | null;
  amount: string | null;
  notes: string | null;
};

export function HistoryFeed({ items }: { items: FeedItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No entries yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={`${item.type}-${item.id}`} className="rounded-xl border border-border p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-sm font-medium">
              {item.type === "craving"
                ? `Craving • Intensity ${item.intensity ?? "-"}/10`
                : `Usage • ${item.route ?? "-"} (${item.amount ?? "-"})`}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(item.created_at).toLocaleString()}
            </span>
          </div>
          <div className="mb-2 flex flex-wrap gap-2">
            {(item.triggers ?? []).map((trigger) => (
              <Badge key={trigger}>{trigger}</Badge>
            ))}
          </div>
          {item.notes ? <p className="text-sm text-muted-foreground">{item.notes}</p> : null}
        </li>
      ))}
    </ul>
  );
}

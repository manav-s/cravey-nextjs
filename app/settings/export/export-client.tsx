"use client";

import { useState } from "react";
import { downloadPdfReport } from "@/lib/pdf-export";
import { Button } from "@/components/ui/button";

export function ExportClient() {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);

  async function downloadJson() {
    const response = await fetch("/api/export?format=json");
    const data = await response.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "cravey-export.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function downloadCsv() {
    const response = await fetch("/api/export?format=csv");
    const csv = await response.text();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "cravey-export.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function generatePdf() {
    setLoading(true);
    try {
      const response = await fetch(`/api/export/report?days=${days}`);
      const report = await response.json();
      downloadPdfReport(report);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={downloadJson} variant="outline">
          Export JSON
        </Button>
        <Button type="button" onClick={downloadCsv} variant="outline">
          Export CSV
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="days">
          PDF window
        </label>
        <select
          id="days"
          value={days}
          onChange={(event) => setDays(Number(event.target.value))}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm md:w-56"
        >
          <option value={30}>Last 30 days</option>
          <option value={60}>Last 60 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <Button type="button" onClick={generatePdf} disabled={loading}>
        {loading ? "Generating..." : "Generate PDF"}
      </Button>
    </div>
  );
}

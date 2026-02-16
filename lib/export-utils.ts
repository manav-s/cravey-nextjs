export function rowsToCsv(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]);
  const lines = rows.map((row) =>
    headers
      .map((header) => {
        const value = row[header];
        const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
        return `"${text.replaceAll("\"", '""')}"`;
      })
      .join(","),
  );

  return [headers.join(","), ...lines].join("\n");
}

export function boundReportDays(daysInput: number) {
  return [30, 60, 90].includes(daysInput) ? daysInput : 30;
}

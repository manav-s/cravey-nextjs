import { jsPDF } from "jspdf";

type ReportData = {
  days: number;
  generatedAt: string;
  streakDays: number;
  usageFrequency: number;
  topTriggers: Array<{ trigger: string; count: number }>;
  weeklySummary: {
    cravingsThisWeek: number;
    cravingsLastWeek: number;
    usageThisWeek: number;
    usageLastWeek: number;
  };
};

export function downloadPdfReport(data: ReportData) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Cravey Patient Report", 14, 20);

  doc.setFontSize(11);
  doc.text(`Generated: ${new Date(data.generatedAt).toLocaleString()}`, 14, 30);
  doc.text(`Time Window: Last ${data.days} days`, 14, 37);
  doc.text(`Streak (days since last usage): ${data.streakDays}`, 14, 44);
  doc.text(`Usage entries in window: ${data.usageFrequency}`, 14, 51);

  doc.text("Weekly Summary", 14, 64);
  doc.text(`Cravings this week: ${data.weeklySummary.cravingsThisWeek}`, 14, 71);
  doc.text(`Cravings last week: ${data.weeklySummary.cravingsLastWeek}`, 14, 78);
  doc.text(`Usage this week: ${data.weeklySummary.usageThisWeek}`, 14, 85);
  doc.text(`Usage last week: ${data.weeklySummary.usageLastWeek}`, 14, 92);

  doc.text("Top Triggers", 14, 105);
  data.topTriggers.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.trigger}: ${item.count}`, 14, 112 + index * 7);
  });

  doc.save(`cravey-report-${data.days}d.pdf`);
}

import { NextResponse } from "next/server";
import { format } from "date-fns";
import { getExportData } from "@/db";
import { rowsToCsv } from "@/lib/export-utils";
import { requireOnboardedUser } from "@/lib/session";

export async function GET(request: Request) {
  const user = await requireOnboardedUser();
  const { searchParams } = new URL(request.url);
  const formatType = searchParams.get("format") ?? "json";

  const data = await getExportData(user.id);

  if (formatType === "csv") {
    const cravingRows = data.cravings.map((row) => ({ type: "craving", ...row }));
    const usageRows = data.usage.map((row) => ({ type: "usage", ...row }));
    const csv = rowsToCsv([...cravingRows, ...usageRows]);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=cravey-export-${format(new Date(), "yyyy-MM-dd")}.csv`,
      },
    });
  }

  return NextResponse.json(data);
}

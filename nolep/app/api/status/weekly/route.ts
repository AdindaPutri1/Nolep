import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { startOfWeek, endOfWeek } from "date-fns";

export async function GET() {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Senin
  const end = endOfWeek(new Date(), { weekStartsOn: 1 }); // Minggu

  const raw = await prisma.status.findMany({
    where: {
      isSleepy: true,
      timestamp: {
        gte: start,
        lte: end,
      },
    },
  });

  // Hitung jumlah per hari
  const countPerDay: Record<string, number> = {};

  for (const r of raw) {
    const day = r.timestamp.toLocaleDateString("en-US", { weekday: "long" });
    countPerDay[day] = (countPerDay[day] || 0) + 1;
  }

  const result = Object.entries(countPerDay).map(([day, alerts]) => ({
    day,
    alerts,
  }));

  return NextResponse.json(result);
}

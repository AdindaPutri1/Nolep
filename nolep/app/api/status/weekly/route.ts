import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from "date-fns";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Senin
    const end = endOfWeek(new Date(), { weekStartsOn: 1 }); // Minggu

    const raw = await prisma.status.findMany({
      where: {
        userId,
        isSleepy: true,
        timestamp: {
          gte: start,
          lte: end,
        },
      },
    });

    // Buat objek untuk semua hari dalam minggu
    const daysOfWeek = eachDayOfInterval({ start, end });
    const countPerDay: Record<string, number> = {};

    // Inisialisasi semua hari dengan 0
    daysOfWeek.forEach((day) => {
      const dayName = format(day, "EEEE"); // e.g. "Monday"
      countPerDay[dayName] = 0;
    });

    // Hitung jumlah per hari
    for (const r of raw) {
      const day = format(r.timestamp, "EEEE");
      countPerDay[day] = (countPerDay[day] || 0) + 1;
    }

    // Konversi ke array dan urutkan berdasarkan hari
    const result = Object.entries(countPerDay).map(([day, alerts]) => ({
      day,
      alerts,
    }));

    // Urutkan berdasarkan hari (Senin-Minggu)
    const dayOrder = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    result.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching weekly status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

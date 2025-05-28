// app/api/drowsiness/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, eyeState } = await req.json();

    // Proses logika deteksi kantuk
    const isDrowsy = eyeState === "closed"; // contoh sederhana

    // Simpan status ke database
    const status = await prisma.status.create({
      data: {
        userId,
        isSleepy: isDrowsy,
      },
    });

    return NextResponse.json({
      isDrowsy,
      message: isDrowsy ? "User mengantuk!" : "User terjaga.",
      statusId: status.id,
    });
  } catch (error) {
    console.error("Error in drowsiness detection:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

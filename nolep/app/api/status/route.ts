import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, isSleepy, confidence, imagePath } = body;

    const status = await prisma.status.create({
      data: {
        userId,
        isSleepy,
        confidence,
        imagePath,
      },
    });

    return NextResponse.json({ success: true, status }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error saving status" },
      { status: 500 }
    );
  }
}

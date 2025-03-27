// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Validasi input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Cek duplikat
    const existingUser = await prisma.user_Account.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Buat user baru
    const user = await prisma.user_Account.create({
      data: { username, email, password: hashedPassword },
    });

    return NextResponse.json(
      { message: "User created", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Login error:", error); // Log error untuk debugging
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error", // Tampilkan pesan error
      },
      { status: 500 }
    );
  }
}

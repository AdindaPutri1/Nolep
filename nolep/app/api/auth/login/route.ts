// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { comparePasswords, generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validasi
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Cek user
    const user = await prisma.user_Account.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Cek password
    const isValid = await comparePasswords(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user.id);

    return NextResponse.json({ token, userId: user.id }, { status: 200 });
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

// app/api/cheese/route.ts

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { nickname, cheese } = await req.json();

    if (typeof nickname !== "string" || typeof cheese !== "number") {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const created = await prisma.cheese.create({
      data: {
        nickname,
        cheese,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/cheese error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const all = await prisma.cheese.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(all);
  } catch (error) {
    console.error("GET /api/cheese error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

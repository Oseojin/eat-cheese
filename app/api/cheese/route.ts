import prisma from "@/lib/prisma";
import { decodeDeviceId } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, nickname } = await req.json();

    const deviceId = decodeDeviceId(token);
    if (!deviceId || typeof nickname !== "string") {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const existing = await prisma.cheese.findUnique({
      where: { deviceId },
    });

    let result;
    if (existing) {
      result = await prisma.cheese.update({
        where: { deviceId },
        data: {
          cheese: { increment: 1 },
          nickname,
        },
      });
    } else {
      result = await prisma.cheese.create({
        data: {
          deviceId,
          nickname,
          cheese: 1,
        },
      });
    }

    return NextResponse.json(result, { status: 201 });
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

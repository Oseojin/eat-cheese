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

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (token) {
      // 🧑‍💻 1. 개별 deviceId에 대한 점수 반환
      const deviceId = decodeDeviceId(token);
      if (!deviceId) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }

      const record = await prisma.cheese.findUnique({
        where: { deviceId },
      });

      return NextResponse.json({ cheese: record?.cheese ?? 0 });
    } else {
      // 🧑‍🤝‍🧑 2. 전체 랭킹 반환
      const all = await prisma.cheese.findMany({
        orderBy: { cheese: "desc" }, // 점수 높은 순으로 정렬
        take: 100, // TOP 100
        select: {
          nickname: true,
          cheese: true,
          createdAt: true,
        },
      });

      return NextResponse.json(all);
    }
  } catch (error) {
    console.error("GET /api/cheese error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

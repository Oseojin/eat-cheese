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
      // 👉 deviceId 복호화
      const deviceId = decodeDeviceId(token);
      if (!deviceId) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }

      // 👉 해당 유저 데이터 조회
      const record = await prisma.cheese.findUnique({
        where: { deviceId },
      });

      if (!record) {
        return NextResponse.json({ cheese: 0, rank: null });
      }

      // 👉 순위 계산: 나보다 점수 높은 사람 수 + 1
      const count = await prisma.cheese.count({
        where: {
          cheese: {
            gt: record.cheese,
          },
        },
      });

      return NextResponse.json({
        cheese: record.cheese,
        rank: count + 1,
      });
    }

    // 👉 랭킹 리스트 (top 10)
    const all = await prisma.cheese.findMany({
      orderBy: { cheese: "desc" },
      take: 10,
      select: {
        nickname: true,
        cheese: true,
        createdAt: true,
      },
    });

    return NextResponse.json(all);
  } catch (error) {
    console.error("GET /api/cheese error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { DraftPickDTO } from "@/types";

// GET /api/draft-order — the base 2026 order (overall 1..257).
export async function GET() {
  const picks = await prisma.draftPick.findMany({
    where: { year: 2026 },
    orderBy: { overall: "asc" },
    select: {
      overall: true,
      round: true,
      originalTeamId: true,
    },
  });

  return NextResponse.json(picks satisfies DraftPickDTO[]);
}

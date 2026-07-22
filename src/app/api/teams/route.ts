import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { TeamDTO } from "@/types";

// GET /api/teams — all 32 teams (reference data).
export async function GET() {
  const teams = await prisma.team.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      abbreviation: true,
      conference: true,
      division: true,
      logoUrl: true,
      primaryColor: true,
    },
  });

  return NextResponse.json(teams satisfies TeamDTO[]);
}

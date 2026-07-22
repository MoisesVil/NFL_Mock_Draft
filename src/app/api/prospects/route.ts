import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ProspectDTO } from "@/types";

// GET /api/prospects — the draft class, ordered by consensus rank (best first).
export async function GET() {
  const prospects = await prisma.prospect.findMany({
    orderBy: { consensusRank: "asc" },
    select: {
      id: true,
      name: true,
      position: true,
      school: true,
      heightInches: true,
      weightLbs: true,
      consensusRank: true,
      grade: true,
      headshotUrl: true,
    },
  });

  return NextResponse.json(prospects satisfies ProspectDTO[]);
}

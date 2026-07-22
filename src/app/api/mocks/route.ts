import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

/**
 * Session data endpoints (build step 5 — persistence).
 *
 * POST /api/mocks — save a completed mock (MockDraft + MockPick[] + Trade[]),
 * returning its shareId. Stubbed until the session tables are in use.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  // TODO(step 5): validate payload, create MockDraft + nested picks/trades,
  // return { shareId }.
  return NextResponse.json(
    { error: "Not implemented yet", received: body },
    { status: 501 },
  );
}

"use client";

/**
 * A single pick row/card on the board. Extracted so the board, trade UI, and
 * results screen can all render a pick consistently. Placeholder for now.
 */

import type { LivePick } from "@/types";

export function PickCard({ pick }: { pick: LivePick }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-white/10 px-3 py-2">
      <span className="w-10 font-mono opacity-60">#{pick.overall}</span>
      <span className="opacity-80">{pick.currentTeamId}</span>
      <span className="ml-auto">
        {pick.prospectId ? pick.prospectId : <span className="opacity-40">— on the clock —</span>}
      </span>
    </div>
  );
}

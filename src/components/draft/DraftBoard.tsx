"use client";

/**
 * The draft board: the ordered list of picks (overall 1..257) showing which
 * team is on the clock and what they selected. Placeholder for build step 1.
 */

import { useDraftOrder } from "@/hooks/useReferenceData";

export function DraftBoard() {
  const { data: order, isLoading, error } = useDraftOrder();

  if (isLoading) return <p className="opacity-70">Loading draft order…</p>;
  if (error) return <p className="text-red-400">Failed to load draft order.</p>;
  if (!order?.length) return <p className="opacity-70">No draft order yet — seed the DB.</p>;

  return (
    <ol className="flex flex-col gap-1">
      {order.map((pick) => (
        <li
          key={pick.overall}
          className="flex items-center gap-3 rounded-md border border-white/10 px-3 py-2"
        >
          <span className="w-10 font-mono opacity-60">#{pick.overall}</span>
          <span className="opacity-80">{pick.originalTeamId}</span>
          {/* TODO: resolve team name, show on-the-clock state + selected prospect */}
        </li>
      ))}
    </ol>
  );
}

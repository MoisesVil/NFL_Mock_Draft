"use client";

/**
 * The available-prospects panel. Shows the remaining board ranked by consensus.
 * Clicking a prospect (later) makes the pick for the team on the clock.
 * Placeholder for build step 1.
 */

import { useProspects } from "@/hooks/useReferenceData";

export function ProspectList() {
  const { data: prospects, isLoading, error } = useProspects();

  if (isLoading) return <p className="opacity-70">Loading prospects…</p>;
  if (error) return <p className="text-red-400">Failed to load prospects.</p>;
  if (!prospects?.length) return <p className="opacity-70">No prospects yet — seed the DB.</p>;

  return (
    <ul className="flex flex-col gap-1">
      {prospects.map((p) => (
        <li
          key={p.id}
          className="flex items-baseline gap-2 rounded-md border border-white/10 px-3 py-2"
        >
          <span className="w-8 font-mono opacity-60">{p.consensusRank}</span>
          <span className="font-medium">{p.name}</span>
          <span className="text-sm opacity-60">
            {p.position} · {p.school}
          </span>
        </li>
      ))}
    </ul>
  );
}

"use client";

/**
 * The main draft screen. For build step 1 this shows the static board and the
 * prospect list, and lets the user make all picks manually. CPU logic, needs
 * weighting, and trades come in later steps (see CLAUDE.md build order).
 */

import { DraftBoard } from "@/components/draft/DraftBoard";
import { ProspectList } from "@/components/draft/ProspectList";

export default function DraftPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_360px]">
      <section aria-label="Draft board">
        <DraftBoard />
      </section>
      <aside aria-label="Available prospects">
        <ProspectList />
      </aside>
    </main>
  );
}

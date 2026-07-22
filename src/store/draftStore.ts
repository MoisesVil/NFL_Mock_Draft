/**
 * Zustand store — the LIVE draft in progress.
 *
 * This is ephemeral client state: which team the user is GM'ing, who is on the
 * clock, the running list of picks, and (later) pending trades. It is only
 * persisted when the user hits "save" (which POSTs to /api/mocks). Reference
 * data (teams/board) is NOT stored here — that comes from TanStack Query.
 */

import { create } from "zustand";
import type { LivePick } from "@/types";

interface DraftState {
  userTeamId: string | null;
  onClockOverall: number; // which overall pick is currently on the clock
  picks: LivePick[]; // running list, ordered by overall

  // actions
  startDraft: (userTeamId: string, picks: LivePick[]) => void;
  makePick: (overall: number, prospectId: string, byCpu: boolean) => void;
  reset: () => void;
}

export const useDraftStore = create<DraftState>((set) => ({
  userTeamId: null,
  onClockOverall: 1,
  picks: [],

  startDraft: (userTeamId, picks) =>
    set({ userTeamId, picks, onClockOverall: picks[0]?.overall ?? 1 }),

  makePick: (overall, prospectId, byCpu) =>
    set((state) => ({
      picks: state.picks.map((p) =>
        p.overall === overall
          ? { ...p, prospectId, pickedByCpu: byCpu }
          : p,
      ),
      onClockOverall: overall + 1,
    })),

  reset: () => set({ userTeamId: null, onClockOverall: 1, picks: [] }),
}));

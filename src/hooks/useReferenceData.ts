"use client";

/**
 * TanStack Query hooks for fetching reference data from our OWN API routes.
 * The browser never talks to Supabase directly (see CLAUDE.md architecture).
 */

import { useQuery } from "@tanstack/react-query";
import type { TeamDTO, ProspectDTO, DraftPickDTO } from "@/types";

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${url} (${res.status})`);
  return res.json() as Promise<T>;
}

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: () => getJSON<TeamDTO[]>("/api/teams"),
  });
}

export function useProspects() {
  return useQuery({
    queryKey: ["prospects"],
    queryFn: () => getJSON<ProspectDTO[]>("/api/prospects"),
  });
}

export function useDraftOrder() {
  return useQuery({
    queryKey: ["draft-order"],
    queryFn: () => getJSON<DraftPickDTO[]>("/api/draft-order"),
  });
}

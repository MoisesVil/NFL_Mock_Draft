/**
 * Shared app-level types.
 *
 * These are the DTO shapes our own API routes return to the browser. They are
 * kept separate from Prisma's generated model types so the client never imports
 * server/Prisma code. Keep them in sync with what the route handlers select.
 */

export interface TeamDTO {
  id: string;
  name: string;
  abbreviation: string;
  conference: string;
  division: string;
  logoUrl: string | null;
  primaryColor: string | null;
}

export interface ProspectDTO {
  id: string;
  name: string;
  position: string;
  school: string;
  heightInches: number | null;
  weightLbs: number | null;
  consensusRank: number;
  grade: number | null;
  headshotUrl: string | null;
}

export interface DraftPickDTO {
  overall: number;
  round: number;
  originalTeamId: string;
}

/** A pick as it exists in a live sim (owner can change via trades). */
export interface LivePick {
  overall: number;
  round: number;
  currentTeamId: string;
  prospectId: string | null;
  pickedByCpu: boolean;
}

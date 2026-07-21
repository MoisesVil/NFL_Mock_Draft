# NFL Mock Draft Simulator

A for-fun project recreating [PFF's NFL Mock Draft Simulator](https://www.pff.com/draft/nfl-mock-draft-simulator) as a web app. Secondary goal: learn an industry-common web stack, so favor conventional, well-documented patterns over clever shortcuts.

## What it does

You act as GM for one NFL team. The other 31 teams draft on their own (simulated logic). When you're on the clock you pick a prospect, and you can offer/accept trades with the CPU teams. The app tracks the full draft and lets you save and share a completed mock.

**Target draft: the completed 2026 NFL Draft.** It's chosen deliberately because the data is recent but final — the board, order, and real results never change. Real 2026 results are stored too, so a user's mock can be scored against what actually happened.

## Tech stack

- **Framework:** Next.js (App Router) with **TypeScript** (TS from day one, not a later migration)
- **Styling:** Tailwind CSS (shadcn/ui optional for prebuilt components)
- **Server state:** TanStack Query (React Query) — fetching/caching board + team data from our own API routes. Reference data never changes, so use a very long `staleTime` (effectively `Infinity`).
- **Client state:** Zustand — the *live draft in progress* (which team the user is GM'ing, who's on the clock, current board with drafted players removed, pending trades, running pick list). This is ephemeral and only persisted on "save".
- **ORM:** Prisma
- **Database:** Supabase (Postgres)
- **Hosting:** Vercel

## Architecture

Layered, on purpose:

```
Browser (React app)  ->  Vercel (Next.js app + API routes)  ->  Supabase (Postgres)
                    HTTPS                              Prisma
```

The browser talks to our **own Next.js API routes**, not to Supabase directly. This is a deliberate choice over the simpler "call Supabase from the browser" pattern — the extra layer is the point, for learning the conventional browser → own API → database structure.

Notes for whoever wires up the DB connection:
- Supabase's connection string is stored as an env var in Vercel (`DATABASE_URL`).
- Vercel functions are serverless, so use Supabase's **pooled** connection string for the app (via Supavisor) and the direct connection only for migrations, to avoid exhausting connection limits.
- Supabase free tier pauses a project after ~1 week of inactivity.

## Data model

The key split: **reference data** (seeded once, never mutated) vs **session data** (written only when a user saves a mock).

- **Reference:** `Team`, `Prospect`, `TeamNeed`, `DraftPick` (the base 2026 order).
- **Session:** `MockDraft`, `MockPick`, `Trade`.

For the first playable version (manual picks, then CPU picks) only the four reference tables are needed. The session tables come in when persistence is added.

### Prisma schema (starting point)

```prisma
// ---------- Reference data (seeded once, never mutated) ----------

model Team {
  id           String @id @default(cuid())
  name         String
  abbreviation String @unique
  conference   String
  division     String
  logoUrl      String?
  primaryColor String?

  needs            TeamNeed[]
  originalPicks    DraftPick[]
  prospectsDrafted Prospect[]
}

model Prospect {
  id            String @id @default(cuid())
  name          String
  position      String
  school        String
  heightInches  Int?
  weightLbs     Int?
  consensusRank Int                // drives CPU "best available"
  grade         Float?
  headshotUrl   String?

  // real 2026 outcome, for scoring a mock against reality
  actualOverallPick Int?
  actualTeamId      String?
  actualTeam        Team?  @relation(fields: [actualTeamId], references: [id])

  @@index([consensusRank])
  @@index([position])
}

model TeamNeed {
  id       String @id @default(cuid())
  teamId   String
  team     Team   @relation(fields: [teamId], references: [id])
  position String
  weight   Int                     // 1 = mild ... 3 = critical

  @@unique([teamId, position])
}

model DraftPick {
  id             String @id @default(cuid())
  year           Int                // 2026
  round          Int
  overall        Int    @unique     // 1..257
  originalTeamId String
  originalTeam   Team   @relation(fields: [originalTeamId], references: [id])
}

// ---------- Session data (written only when a user SAVES a mock) ----------

model MockDraft {
  id         String   @id @default(cuid())
  shareId    String   @unique @default(cuid())
  userId     String?                            // null until auth is added
  userTeamId String
  status     String   @default("complete")      // in_progress | complete
  createdAt  DateTime @default(now())

  picks  MockPick[]
  trades Trade[]
}

model MockPick {
  id            String    @id @default(cuid())
  mockDraftId   String
  mockDraft     MockDraft @relation(fields: [mockDraftId], references: [id], onDelete: Cascade)
  round         Int
  overall       Int
  currentTeamId String              // owner after trades in this sim
  prospectId    String?
  pickedByCpu   Boolean   @default(true)

  @@unique([mockDraftId, overall])
}

model Trade {
  id          String    @id @default(cuid())
  mockDraftId String
  mockDraft   MockDraft @relation(fields: [mockDraftId], references: [id], onDelete: Cascade)
  atOverall   Int
  fromTeamId  String
  toTeamId    String
  assets      Json                // { fromTeam: [overall...], toTeam: [overall...] }
}
```

Schema notes:
- Session tables reference teams by plain string ID (snapshots, not FK relations) to avoid a pile of reverse-relations on `Team`. Tighten to real relations later if referential integrity is wanted.
- `Trade.assets` is JSON for now; a proper `TradeAsset` join table (one row per pick moved) is a good later refactor.

## Data sources

Pull everything into our own DB once via a seed script; the simulator then runs entirely off our data (no live third-party calls).

- **ESPN hidden API** (free, no key, unofficial) — draft prospects, teams, 2026 draft order/results. Snapshot it since it can change without notice.
- **CollegeFootballData.com (CFBD)** (free, needs API key) — enrich prospect profiles (position, school, measurables).
- **nflverse / nfl-data-py** (free) — historical picks and, importantly, **draft pick value charts** (Jimmy Johnson / Fitzgerald-Spielberger). The value chart powers the trade logic. Run offline, export JSON/CSV, seed the DB.
- Avoid paid aggregators (e.g. NFL Mock Draft Database) — their terms forbid rebuilding their site.

## Core simulator logic

- **CPU picks:** best-player-available off the ranked board, weighted by that team's positional `TeamNeed`. Start with pure best-available, then layer in need-weighting.
- **Trades:** score each pick with the value chart. A CPU accepts if value received ≥ value given, within a tolerance tuned by how much it needs to move up/down.

## Build order

1. Static board + draft order; user makes all 32 picks manually, no CPU. (Validates data + UI.)
2. CPU auto-picks (best available).
3. Add team-needs weighting to CPU picks.
4. Add trades using the value chart.
5. Persistence — save and share a completed mock.
6. Auth + leaderboards, then polish and deploy.

Steps 1–2 alone give a playable prototype.

## Current status

Planning complete; no code written yet. **First task: the data seed script** (pull 2026 prospects, teams, and pick order into the schema from ESPN + nflverse) — build this before any UI so the schema is validated against real data.

## Open decisions

- Auth approach (Supabase Auth vs Clerk/Auth.js) — deferred until step 6.
- Whether to add shadcn/ui.
- `Trade.assets` JSON vs normalized `TradeAsset` table.

## Working conventions

- TypeScript everywhere; keep types strict.
- Because the developer knows SQL well (MSSQL background), keep Prisma's query logging on and sanity-check the generated SQL rather than treating the ORM as a black box.
- Prefer conventional, documented patterns over clever ones — learning the standard stack is an explicit goal.

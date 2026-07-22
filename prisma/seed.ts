/**
 * Seed script — the FIRST real task per CLAUDE.md.
 *
 * Pulls the completed 2026 NFL Draft reference data into our own DB:
 *   - Team          (32 teams)
 *   - Prospect      (draft class + real 2026 results for scoring)
 *   - TeamNeed      (positional needs, weighted 1..3)
 *   - DraftPick     (base 2026 order, overall 1..257)
 *
 * Sources (run offline, snapshot the results):
 *   - ESPN hidden API   -> teams, prospects, 2026 order/results
 *   - CFBD              -> prospect measurables/positions (needs CFBD_API_KEY)
 *   - nflverse          -> historical picks + pick value charts
 *
 * Run with:  npm run db:seed
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding reference data…");

  // TODO(step 0): fetch + upsert Teams
  // TODO(step 0): fetch + upsert DraftPicks (2026 order, overall 1..257)
  // TODO(step 0): fetch + upsert Prospects (+ actual 2026 results)
  // TODO(step 0): upsert TeamNeeds

  console.log("Done. (No data seeded yet — this is a stub.)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

# NFL Mock Draft Simulator

A for-fun recreation of PFF's NFL Mock Draft Simulator, targeting the completed
2026 NFL Draft. You act as GM for one team; the other 31 pick on their own, and
you can trade with them. See [CLAUDE.md](./CLAUDE.md) for the full spec and
build order.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · TanStack Query · Zustand ·
Prisma · Supabase (Postgres) · Vercel.

## Getting started

Dependencies are declared in `package.json` but not yet installed. When ready:

```bash
npm install
cp .env.example .env.local   # then fill in Supabase DATABASE_URL / DIRECT_URL
npm run db:generate          # generate the Prisma client
npm run db:migrate           # create tables in Supabase
npm run db:seed              # pull 2026 reference data (WIP)
npm run dev                  # http://localhost:3000
```

## Project structure

```
prisma/
  schema.prisma      # data model (reference + session tables)
  seed.ts            # first real task: seed 2026 reference data
src/
  app/
    layout.tsx       # root layout + providers
    page.tsx         # landing page
    providers.tsx    # TanStack Query client
    draft/page.tsx   # the draft screen
    api/             # our own API routes (browser talks here, not Supabase)
      teams/ prospects/ draft-order/ mocks/
  components/draft/  # DraftBoard, ProspectList, PickCard
  hooks/             # TanStack Query data hooks
  lib/               # prisma client singleton, utils
  store/             # Zustand live-draft store
  types/             # shared DTO types
```

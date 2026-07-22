import { PrismaClient } from "@prisma/client";

// Singleton Prisma client. Next.js dev mode hot-reloads modules, which would
// otherwise spawn a new client (and connection pool) on every reload, so we
// cache it on globalThis.
//
// Query logging is intentionally ON (see CLAUDE.md working conventions) so the
// generated SQL can be sanity-checked rather than treated as a black box.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

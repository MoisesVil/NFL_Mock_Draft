import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold">NFL Mock Draft Simulator</h1>
      <p className="max-w-prose text-lg opacity-80">
        Take control of one NFL team and run your own 2026 mock draft. The other
        31 teams pick on their own — and you can wheel and deal with them.
      </p>
      <Link
        href="/draft"
        className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:opacity-90"
      >
        Start a mock draft
      </Link>
    </main>
  );
}

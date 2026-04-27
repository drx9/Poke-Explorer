"use client";

import * as React from "react";
import { getProviders, signIn } from "next-auth/react";
import { User, KeyRound, ArrowLeft } from "lucide-react";
import Link from "next/link";

type ProviderMap = Awaited<ReturnType<typeof getProviders>>;

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function ProviderIcon({ id }: { id: string }) {
  if (id === "github") return <GithubIcon className="h-5 w-5" />;
  if (id === "google") return <KeyRound className="h-5 w-5" />;
  return <User className="h-5 w-5" />;
}

export default function SignInPage() {
  const [providers, setProviders] = React.useState<ProviderMap>(null);

  React.useEffect(() => {
    void (async () => {
      const p = await getProviders();
      setProviders(p);
    })();
  }, []);

  const list = providers ? Object.values(providers) : [];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,0,80,0.10),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.12),_transparent_48%),linear-gradient(to_bottom,#f8fafc,#ffffff)]">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-50 [background-image:radial-gradient(rgba(0,0,0,0.10)_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="mx-auto max-w-md px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="mt-6 rounded-2xl border border-white/30 bg-white/70 p-6 shadow-sm backdrop-blur">
          <p className="font-display text-3xl text-zinc-900">Sign in</p>
          <p className="mt-1 text-sm text-zinc-600">
            Choose a provider to continue.
          </p>

          <div className="mt-6 space-y-3">
            {providers == null ? (
              <div className="text-sm text-zinc-600">Loading providers…</div>
            ) : list.length === 0 ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                No auth providers are configured. Check your env vars and restart the dev server.
              </div>
            ) : (
              list.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => signIn(p.id, { callbackUrl: "/" })}
                  className="flex w-full items-center justify-between rounded-xl border border-white/40 bg-white/70 px-4 py-3 text-left text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition-colors hover:bg-white"
                >
                  <span className="inline-flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white">
                      <ProviderIcon id={p.id} />
                    </span>
                    Continue with {p.name}
                  </span>
                  <span className="text-zinc-500">→</span>
                </button>
              ))
            )}
          </div>

          <div className="mt-6 text-xs text-zinc-500">
            Tip: for GitHub, ensure your callback URL is{" "}
            <span className="font-mono text-zinc-700">/api/auth/callback/github</span>.
          </div>
        </div>
      </div>
    </div>
  );
}


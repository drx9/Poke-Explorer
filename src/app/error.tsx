"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-lg font-semibold text-red-900">Something went wrong</p>
          <p className="mt-2 text-sm text-red-800">{error.message}</p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-5 rounded-full bg-red-900 px-4 py-2 text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}


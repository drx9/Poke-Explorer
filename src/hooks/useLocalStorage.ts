"use client";

import * as React from "react";

export function useLocalStorageState<T>(key: string, initial: T) {
  // Important: do NOT read localStorage during render.
  // Client components are server-rendered in Next.js; reading localStorage in the initial
  // client render can cause hydration mismatches.
  const [state, setState] = React.useState<T>(initial);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) {
        setState(JSON.parse(raw) as T);
      }
    } catch {
      // ignore
    }
  }, [key]);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [hydrated, key, state]);

  return { state, setState, hydrated } as const;
}


/**
 * Reads/writes the active sessionId to `?session=` query param + localStorage.
 * Enables Phase 10 session resume after navigation.
 */
import { useEffect, useState } from "react";

const KEY = "ai-sql.sessionId";

/** Hook returning a [sessionId, setSessionId] tuple synced to URL + storage. */
export function useSessionStorage(): [string | null, (id: string | null) => void] {
  const [sessionId, setSessionIdState] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const url = new URL(window.location.href);

    return url.searchParams.get("session");
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);

    if (sessionId) {
      url.searchParams.set("session", sessionId);
    } else {
      url.searchParams.delete("session");
    }

    if (window.localStorage.getItem(KEY)) {
      window.localStorage.removeItem(KEY);
    }

    window.history.replaceState({}, "", url.toString());
  }, [sessionId]);

  return [sessionId, setSessionIdState];
}

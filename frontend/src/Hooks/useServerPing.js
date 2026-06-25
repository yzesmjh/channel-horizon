import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BaseUrl } from "../../BaseUrl";

const PING_URL        = `${BaseUrl}ping`;
const RETRY_INTERVAL  = 3000;   // ms between attempts
const REQUEST_TIMEOUT = 8000;   // ms per request
const MAX_ATTEMPTS    = 30;     // 30 × 3 s = 90 s max wait

/**
 * useServerPing
 *
 * Silently wakes the Render backend on first page load.
 * Returns `{ ready }` — true once the server responds with HTTP 2xx.
 *
 * While `ready` is false the caller should show a loading screen;
 * once true it should dismiss it. No failure state is surfaced to
 * the user — after MAX_ATTEMPTS we give up and let the app through
 * anyway so the user is never blocked indefinitely.
 */
const useServerPing = () => {
  const [ready, setReady] = useState(false);
  const attemptsRef = useRef(0);
  const timerRef    = useRef(null);
  const mountedRef  = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const ping = async () => {
      if (!mountedRef.current) return;

      attemptsRef.current += 1;

      try {
        const { status } = await axios.get(PING_URL, {
          timeout: REQUEST_TIMEOUT,
        });

        if (status >= 200 && status < 300) {
          if (mountedRef.current) setReady(true);
          return; // success — stop retrying
        }
      } catch {
        // network error or timeout — fall through to retry
      }

      // Give up after max attempts so the UI isn't blocked forever
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        if (mountedRef.current) setReady(true);
        return;
      }

      // Schedule next attempt
      timerRef.current = setTimeout(ping, RETRY_INTERVAL);
    };

    ping();

    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { ready };
};

export default useServerPing;

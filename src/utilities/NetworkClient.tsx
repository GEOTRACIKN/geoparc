// NetworkClient.tsx
import { useEffect, useRef } from 'react';

export type NetQuality = 'good' | 'poor' | 'offline';

export type NetworkClientConfig = {
  /** Endpoint très léger pour ping (HEAD ou GET). Ex: 'https://geotrackin.com/health' */
  probeUrl: string;
  /** Seuil de latence au-delà duquel on considère "poor" (ms) */
  poorLatencyMs?: number;          // défaut: 350
  /** Timeout d'une requête réseau (ms) */
  timeoutMs?: number;              // défaut: 8000
  /** Nombre de retries côté client */
  retries?: number;                // défaut: 2
  /** Intervalle si "good" (ms) */
  intervalMs?: number;             // défaut: 15000
  /** Intervalle si "poor" ou "offline" (ms) */
  degradedIntervalMs?: number;     // défaut: 6000
  /** Callback sur changement d’état réseau (parfait pour brancher des toasts) */
  onQualityChange?: (q: NetQuality, prev: NetQuality) => void;
};

export type FetchJsonOptions = RequestInit & {
  timeoutMs?: number;
  retries?: number;
};

/** ==== Utilitaires internes ==== */

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return new Promise<T>((resolve, reject) => {
    promise
      .then(v => { clearTimeout(id); resolve(v); })
      .catch(e => { clearTimeout(id); reject(e); });
    // On ajoute le signal d'abort seulement si fetch est utilisé
    // (le caller doit passer un fetch(..., { signal }))
  });
}

/** Fetch avec timeout natif (via AbortController) */
async function timedFetch(input: RequestInfo | URL, init: RequestInit & { timeoutMs?: number } = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), init.timeoutMs ?? 8000);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

/** Mesure la qualité via un ping HEAD (fallback GET si 405) + latence */
async function checkConnectionQualityOnce(
  probeUrl: string,
  poorLatencyMs: number,
  timeoutMs: number
): Promise<NetQuality> {
  if (!navigator.onLine) return 'offline';
  const t0 = performance.now();
  try {
    let resp = await timedFetch(probeUrl, { method: 'HEAD', cache: 'no-store', timeoutMs });
    if (resp.status === 405) {
      resp = await timedFetch(probeUrl, { method: 'GET', cache: 'no-store', timeoutMs });
    }
    const dt = performance.now() - t0;
    // S'il répond (même 4xx/5xx), la connectivité existe : on juge via la latence
    return dt > poorLatencyMs ? 'poor' : 'good';
  } catch {
    // Abort/DNS/Network error
    return navigator.onLine ? 'poor' : 'offline';
  }
}

/** ==== Client principal ==== */

export function createNetworkClient(cfg: NetworkClientConfig) {
  const {
    probeUrl,
    poorLatencyMs = 350,
    timeoutMs = 8000,
    retries = 2,
    intervalMs = 15000,
    degradedIntervalMs = 6000,
    onQualityChange,
  } = cfg;

  let currentQuality: NetQuality = navigator.onLine ? 'good' : 'offline';
  let timer: number | null = null;

  const notify = (next: NetQuality) => {
    if (next !== currentQuality) {
      const prev = currentQuality;
      currentQuality = next;
      onQualityChange?.(next, prev);
    }
  };

  const loop = async () => {
    const q = await checkConnectionQualityOnce(probeUrl, poorLatencyMs, timeoutMs);
    notify(q);
    const nextDelay = q === 'good' ? intervalMs : degradedIntervalMs;
    timer = window.setTimeout(loop, nextDelay) as unknown as number;
  };

  /** Lance la surveillance réseau (à appeler une fois au bootstrap) */
  function start() {
    stop();
    // Evénements natifs
    const onOnline = () => notify(currentQuality === 'offline' ? 'poor' : currentQuality);
    const onOffline = () => notify('offline');
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    // on stocke les handlers sur window pour pouvoir les enlever dans stop()
    (window as any).__ncHandlers = { onOnline, onOffline };

    // run immédiat
    loop();
  }

  /** Stoppe la surveillance */
  function stop() {
    if (timer) { clearTimeout(timer); timer = null; }
    const h = (window as any).__ncHandlers;
    if (h) {
      window.removeEventListener('online', h.onOnline);
      window.removeEventListener('offline', h.onOffline);
      delete (window as any).__ncHandlers;
    }
  }

  /** Expose un check ponctuel si besoin */
  async function checkQuality(): Promise<NetQuality> {
    const q = await checkConnectionQualityOnce(probeUrl, poorLatencyMs, timeoutMs);
    notify(q);
    return q;
  }

  /**
   * fetchJson robuste : timeout + retries + réponse sûre si vide
   * - ne throw pas si /api/me répond vide : retourne {} pour ne pas casser l’app
   * - renvoie { ok, status, data }
   */
  async function fetchJson<T = unknown>(
    url: string,
    options: FetchJsonOptions = {}
  ): Promise<{ ok: boolean; status: number; data: T | Record<string, never> }> {
    const maxRetries = options.retries ?? retries;
    const to = options.timeoutMs ?? timeoutMs;

    let lastErr: any;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const res = await timedFetch(url, { ...options, timeoutMs: to });
        const status = res.status;

        // 204 => vide mais OK
        if (status === 204) return { ok: true, status, data: {} };

        const ct = res.headers.get('content-type') || '';
        let data: any = {};
        if (ct.includes('application/json')) {
          try { data = await res.json(); } catch { data = {}; }
        } else {
          // contenu non-JSON => on normalise
          data = {};
        }

        // /api/me peut renvoyer vide => ne pas fermer l’app
        if ((data == null) || (typeof data === 'object' && Object.keys(data).length === 0)) {
          // on considère la réponse comme "ok" si status < 500
          return { ok: res.ok || status < 500, status, data: {} };
        }

        return { ok: res.ok, status, data };
      } catch (e) {
        lastErr = e;
        await sleep(300 * (attempt + 1)); // petit backoff
      }
    }
    // Échec complet
    notify('poor'); // dégrade l’état si les appels échouent
    return { ok: false, status: 0, data: {} };
  }

  return {
    /** Démarrer/arrêter la surveillance */
    start, stop,
    /** Vérifier ponctuellement */
    checkQuality,
    /** Appels API robustes */
    fetchJson,
    /** Accès lecture à l’état courant (pas réactif) */
    get quality(): NetQuality { return currentQuality; },
  };
}

/** ==== Hook (optionnel) pour React + toasts ==== */
/** Utilise ce hook dans ton App pour afficher des toasts selon l’état réseau */
export function useNetworkToasts(
  client: ReturnType<typeof createNetworkClient>,
  onToast: (q: NetQuality, prev: NetQuality) => void
) {
  const saved = useRef(onToast);
  saved.current = onToast;

  useEffect(() => {
    // on "abonne" le callback via un petit pont
    const original = (client as any)._onQualityChange;
    (client as any)._onQualityChange = (q: NetQuality, prev: NetQuality) => saved.current(q, prev);

    client.start();
    return () => {
      client.stop();
      (client as any)._onQualityChange = original;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);
}
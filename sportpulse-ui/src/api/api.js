// src/api/api.js
const API_BASE = "https://sportpulse-674799915376.us-central1.run.app";

function buildUrl(path, params) {
  const base = API_BASE.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(base + p);

  if (params && typeof params === "object") {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null || v === "") continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

// aceita number OU string numérica
function toEpochSec(v) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return 0;
}

export function normalizePost(p) {
  const obj = p && typeof p === "object" ? p : {};

  const publishedAt = toEpochSec(obj.publishedAt ?? obj.publishedAtEpochSec ?? obj.published_at);
  const updatedAt = toEpochSec(obj.updatedAt ?? obj.updatedAtEpochSec ?? obj.updated_at);

  const createdAt =
    typeof obj.createdAt === "string"
      ? obj.createdAt
      : publishedAt
        ? new Date(publishedAt * 1000).toISOString()
        : new Date().toISOString();

  const tags = Array.isArray(obj.tags) ? obj.tags.map(String) : [];

  return {
    id: String(obj.id ?? obj._id ?? obj.postId ?? ""),
    title: String(obj.title ?? obj.headline ?? "Sem título"),
    summary: String(obj.summary ?? obj.description ?? ""),
    imageUrl: String(obj.imageUrl ?? obj.image_url ?? obj.image ?? ""),
    sourceName: String(obj.sourceName ?? obj.source_name ?? obj.source ?? "SportPulse"),
    sourceUrl: String(obj.sourceUrl ?? obj.source_url ?? ""),
    tags,

    publishedAt,
    updatedAt,
    createdAt,

    sport: String(obj.sport ?? (tags[0] || "Esportes")),
    league: String(obj.league ?? (obj.sourceName || "SportPulse")),
  };
}

export function ensureSeed() {
  return [];
}

export async function fetchFeed({ cursor = "0", limit = 10 } = {}) {
  const url = buildUrl("/posts", { cursor, limit });

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET /posts falhou (${res.status}): ${text}`);
  }

  const data = await res.json().catch(() => ({}));
  const items = (data.items || []).map(normalizePost);

  return {
    items,
    nextCursor: data.nextCursor ?? null,
    serverTime: toEpochSec(data.serverTime),
  };
}

/**
 * Poll updates.
 * - startSince: (opcional) comece do maior publishedAt que você já tem na tela, pra não duplicar
 * - onNewPosts: recebe um array já deduplicado por id
 */
export function subscribeToPulse({ intervalMs = 5000, startSince = 0, onNewPosts, onError } = {}) {
  let since = toEpochSec(startSince);
  let stopped = false;

  const tick = async () => {
    if (stopped) return;

    try {
      const url = buildUrl("/postUpdates", { since, limit: 50 });
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) return;

      const data = await res.json().catch(() => ({}));
      const items = (data.items || []).map(normalizePost);

      if (items.length === 0) return;

      // avança since pelo maior timestamp real recebido
      const maxTs = items.reduce((m, p) => Math.max(m, p.publishedAt || 0, p.updatedAt || 0), since);
      since = maxTs;

      // dedupe dentro do próprio batch (caso backend repita)
      const seen = new Set();
      const dedup = [];
      for (const p of items) {
        if (!p.id) continue;
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        dedup.push(p);
      }

      onNewPosts?.(dedup);
    } catch (e) {
      onError?.(e);
    }
  };

  tick();
  const id = setInterval(tick, intervalMs);

  return () => {
    stopped = true;
    clearInterval(id);
  };
}

export default { fetchFeed, subscribeToPulse, normalizePost, ensureSeed };

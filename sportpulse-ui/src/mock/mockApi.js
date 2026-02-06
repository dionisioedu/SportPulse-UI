const STORAGE_KEY = "sportpulse_posts_v2";

function nowIso() {
  return new Date().toISOString();
}

function uid() {
  return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const sports = [
  { sport: "Futebol", queries: ["football", "soccer stadium", "soccer match"] },
  { sport: "Basquete", queries: ["basketball", "nba arena", "basketball game"] },
  { sport: "Fórmula 1", queries: ["formula 1", "race track", "f1 car"] },
  { sport: "Tênis", queries: ["tennis", "tennis court", "grand slam"] },
  { sport: "UFC", queries: ["mma", "ufc octagon", "combat sports"] }
];

const teams = ["Flamengo", "Palmeiras", "Corinthians", "São Paulo", "Santos", "Grêmio", "Inter", "Cruzeiro", "Vasco"];
const leagues = ["Brasileirão", "Premier League", "LaLiga", "NBA", "UFC", "ATP", "F1"];

const headlineTemplates = [
  (s, t) => `${t} vira assunto após lance decisivo e internet explode`,
  (s, t) => `${s}: bastidores quentes e um detalhe que mudou o jogo`,
  (s, t) => `${t} surpreende e altera o cenário da temporada`,
  (s, t) => `Análise rápida: o que esse momento significa para ${t}`,
  (s, t) => `${s} em alta: tendência que pode dominar as próximas rodadas`
];

const summaryTemplates = [
  (s, t, l) => `Em ${l}, um novo movimento chamou atenção: decisões recentes e reações fortes do público indicam mudança de ritmo. Veja o que realmente importa e o que pode vir a seguir.`,
  (s, t, l) => `O foco está em ${t}: impacto imediato, possíveis desdobramentos e por que isso mexe com ${l}. Um resumo claro do que aconteceu — sem enrolação.`,
  (s, t, l) => `Sinais de virada em ${l}. Entre números, contexto e bastidores, este é o ponto central que explica por que a notícia está dominando o debate em ${s}.`
];

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts.slice(0, 500)));
}

function unsplashUrl(query) {
  // “CDN-like” simples: imagens aleatórias por query
  const q = encodeURIComponent(query);
  return `https://source.unsplash.com/featured/640x480?${q}`;
}

function generatePost() {
  const s = pick(sports);
  const team = pick(teams);
  const league = pick(leagues);
  const title = pick(headlineTemplates)(s.sport, team);
  const summary = pick(summaryTemplates)(s.sport, team, league);
  const query = pick(s.queries);
  return {
    id: uid(),
    createdAt: nowIso(),
    sport: s.sport,
    league,
    title,
    summary,
    imageUrl: unsplashUrl(query),
    tags: [team, league, s.sport]
  };
}

export function ensureSeed(count = 12) {
  const posts = loadPosts();
  if (posts.length >= count) return posts;

  const need = count - posts.length;
  const fresh = Array.from({ length: need }, generatePost);
  const merged = [...fresh, ...posts];
  savePosts(merged);
  return merged;
}

export async function fetchFeed({ cursor = 0, limit = 10 } = {}) {
  // cursor é índice simples
  const posts = loadPosts();
  const slice = posts.slice(cursor, cursor + limit);
  const nextCursor = cursor + slice.length;
  return {
    items: slice,
    nextCursor: nextCursor >= posts.length ? null : nextCursor
  };
}

export function subscribeToPulse({ intervalMs = 5000, onNewPost }) {
  const tick = () => {
    const newPost = generatePost();
    const posts = loadPosts();
    const merged = [newPost, ...posts];
    savePosts(merged);
    onNewPost?.(newPost);
  };

  const id = setInterval(tick, intervalMs);
  return () => clearInterval(id);
}

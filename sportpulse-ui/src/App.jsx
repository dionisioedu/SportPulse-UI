import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PulseHeader from "./components/PulseHeader.jsx";
import PostCard from "./components/PostCard.jsx";
import { ensureSeed, fetchFeed, subscribeToPulse } from "./mock/mockApi.js";

function useInfiniteScroll(onBottom) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) onBottom();
      },
      { rootMargin: "600px" }
    );

    io.observe(ref.current);
    return () => io.disconnect();
  }, [onBottom]);

  return ref;
}

function IconPulse() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M2 12h4l2-5 4 10 2-5h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("sp_theme_v2") || "dark");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(() => ensureSeed(18));
  const [cursor, setCursor] = useState(() => 0);
  const [hasMore, setHasMore] = useState(true);
  const [pulseLabel, setPulseLabel] = useState("Notícias relevantes em tempo real");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "dark");
    localStorage.setItem("sp_theme_v2", theme);
  }, [theme]);

  // Carrega primeira página (mantém seed inicial, mas sincroniza cursor)
  useEffect(() => {
    (async () => {
      const page = await fetchFeed({ cursor: 0, limit: 18 });
      setItems(page.items);
      setCursor(page.nextCursor ?? page.items.length);
      setHasMore(page.nextCursor !== null);
    })();
  }, []);

  // “Pulse” (post novo entra no topo)
  useEffect(() => {
    const unsubscribe = subscribeToPulse({
      intervalMs: 4500,
      onNewPost: (post) => {
        setItems((prev) => [post, ...prev].slice(0, 150));
        setPulseLabel(post.title);
      }
    });
    return unsubscribe;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => {
      const hay = `${p.title} ${p.summary} ${p.sport} ${p.league} ${(p.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  const loadMore = async () => {
    if (!hasMore) return;
    const page = await fetchFeed({ cursor, limit: 12 });
    setItems((prev) => [...prev, ...page.items]);
    setCursor(page.nextCursor ?? cursor + page.items.length);
    setHasMore(page.nextCursor !== null);
  };

  const sentinelRef = useInfiniteScroll(loadMore);

  return (
    <>
      <div className="header">
        <div className="container">
          <div className="headerRow">
            <div className="brand">
              <div className="brandMark" style={{ color: "var(--pulse)" }}>
                <IconPulse />
              </div>
              <div className="brandTitle">
                Sport<span>Pulse</span>
              </div>
            </div>

            <div className="search" role="search">
              <span style={{ color: "var(--muted2)", fontSize: 12 }}>🔎</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar times, ligas, atletas, partidas..."
              />
              <span className="searchHint">{filtered.length} posts</span>
            </div>

            <button className="btn" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}>
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </div>

      <div className="container main">
        <PulseHeader subtitle={pulseLabel} />

        <div className="timeline">
          <AnimatePresence initial={false}>
            {filtered.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {hasMore ? <div ref={sentinelRef} className="loader">Carregando mais…</div> : <div className="loader">Fim do feed (por enquanto).</div>}
      </div>
    </>
  );
}

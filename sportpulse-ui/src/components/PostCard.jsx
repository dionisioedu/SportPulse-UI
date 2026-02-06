import React from "react";

export default function PostCard({ post }) {
  const dt = new Date(post.createdAt);
  const time = dt.toLocaleString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="card">
      <img className="thumb" src={post.imageUrl} alt={post.title} loading="lazy" />
      <div className="content">
        <div className="meta">
          <span className="pill">{post.sport}</span>
          <span className="pill">{post.league}</span>
          <span>•</span>
          <span>{time}</span>
        </div>

        <div className="title">{post.title}</div>
        <div className="desc">{post.summary}</div>

        <div className="footerRow">
          <span>{post.tags?.slice(0, 3).join(" • ")}</span>
          <span style={{ color: "var(--pulse)" }}>LIVE</span>
        </div>
      </div>
    </div>
  );
}

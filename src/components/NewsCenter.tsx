"use client";

import React, { useState, useEffect, useMemo } from "react";

interface NewsItem {
  title: string;
  url: string;
  source: string;
  date: string;
  snippet: string;
}

const SOURCE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "TechCrunch AI": {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  "MIT Technology Review": {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/30",
  },
  "The Verge AI": {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
  "VentureBeat AI": {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  "Ars Technica": {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  "Ars Technica Tech": {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  "Wired AI": {
    bg: "bg-cyan-500/10",
    text: "text-brand-cyan",
    border: "border-cyan-500/30",
  },
  "ZDNet AI": {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/30",
  },
};

function formatDisplayDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffHours < 48) {
      return "Yesterday";
    }

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

interface NewsCenterProps {
  hideHeader?: boolean;
}

export default function NewsCenter({ hideHeader = false }: NewsCenterProps) {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    async function loadNews() {
      try {
        setIsLoading(true);
        const res = await fetch("/news.json", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to load news: ${res.status}`);
        }
        const data: NewsItem[] = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        console.error("Error loading news.json:", err);
        setError("Unable to load latest intelligence. Please check back shortly.");
      } finally {
        setIsLoading(false);
      }
    }

    loadNews();
  }, []);

  // Unique sources list
  const sources = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      if (a.source) set.add(a.source);
    });
    return ["All", ...Array.from(set)];
  }, [articles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((item) => {
      const matchesSource =
        selectedSource === "All" || item.source === selectedSource;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q);
      return matchesSource && matchesQuery;
    });
  }, [articles, selectedSource, searchQuery]);

  const displayedArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  const content = (
    <div className="w-full">
      {/* Header section (if not hidden) */}
      {!hideHeader && (
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-sapphire/20 border border-brand-sky/30 text-xs font-mono text-brand-sky mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan" />
            </span>
            <span>AUTOMATED INTELLIGENCE FEED</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
            AI & ML <span className="text-gradient-cyan">News Center</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl font-light">
            Real-time curated intelligence from the world&apos;s leading AI research labs and tech publications. Zero centralized databases, powered entirely by decentralized static feeds.
          </p>
        </div>
      )}

      {/* Controls: Search & Source filter pills */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Search input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(12);
            }}
            placeholder="Search AI headlines, companies, models, or topics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan/60 transition duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Source Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {sources.map((src) => {
            const isSelected = selectedSource === src;
            return (
              <button
                key={src}
                onClick={() => {
                  setSelectedSource(src);
                  setVisibleCount(12);
                }}
                className={`whitespace-nowrap px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 ${
                  isSelected
                    ? "bg-brand-cyan/20 border border-brand-cyan text-brand-sky shadow-[0_0_12px_rgba(0,242,254,0.25)] font-semibold"
                    : "glass-pill text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {src}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading state skeleton */}
      {isLoading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="glass-panel p-5 rounded-2xl animate-pulse flex flex-col gap-3"
            >
              <div className="flex items-center justify-between w-full">
                <div className="h-5 w-24 bg-slate-800 rounded-md" />
                <div className="h-4 w-16 bg-slate-800 rounded-md" />
              </div>
              <div className="h-6 w-3/4 bg-slate-800 rounded-md" />
              <div className="h-4 w-full bg-slate-800/60 rounded-md" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="glass-panel p-8 rounded-2xl text-center border-red-500/20 text-slate-400">
          <p className="text-red-400 font-mono text-sm mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-1.5 rounded-lg bg-cosmic-800 text-xs text-white hover:bg-cosmic-700 transition"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Empty results */}
      {!isLoading && !error && filteredArticles.length === 0 && (
        <div className="glass-panel p-10 rounded-2xl text-center text-slate-400">
          <p className="text-base font-mono mb-1 text-slate-300">No articles match your criteria.</p>
          <p className="text-xs text-slate-500">Try clearing the search query or choosing another source filter.</p>
        </div>
      )}

      {/* Articles list: Vertical stack of horizontal cards */}
      {!isLoading && !error && filteredArticles.length > 0 && (
        <div className="flex flex-col gap-4">
          {displayedArticles.map((article, idx) => {
            const colors = SOURCE_COLORS[article.source] || {
              bg: "bg-slate-800/50",
              text: "text-brand-sky",
              border: "border-slate-700",
            };

            return (
              <a
                key={article.url || idx}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative glass-panel p-5 sm:p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cyan/40 hover:shadow-[0_4px_24px_rgba(0,242,254,0.12)] cursor-pointer"
              >
                {/* Card Top: Source badge + Formatted date + External Link icon */}
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
                    >
                      {article.source}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {formatDisplayDate(article.date)}
                    </span>
                  </div>

                  <span className="text-slate-500 group-hover:text-brand-cyan transition-colors">
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </div>

                {/* Headline: High contrast, changing accent on hover */}
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-cyan transition-colors duration-200 mb-2 leading-snug">
                  {article.title}
                </h3>

                {/* Body preview: First two sentences with line-clamp-2 */}
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 font-normal">
                  {article.snippet}
                </p>
              </a>
            );
          })}

          {/* Load More Button */}
          {visibleCount < filteredArticles.length && (
            <div className="flex flex-col items-center justify-center pt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 15)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl glass-panel text-xs sm:text-sm font-mono text-slate-300 hover:text-white hover:border-brand-cyan/50 hover:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition-all duration-300"
              >
                <span>Load More Intelligence ({filteredArticles.length - visibleCount} remaining)</span>
                <svg className="w-3.5 h-3.5 text-brand-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <span className="text-[11px] font-mono text-slate-500 mt-2">
                Showing {Math.min(visibleCount, filteredArticles.length)} of {filteredArticles.length} curated stories
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (hideHeader) {
    return content;
  }

  return (
    <section
      id="news-center"
      className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 z-10 scroll-mt-20"
    >
      {content}
    </section>
  );
}

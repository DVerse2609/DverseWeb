"use client";

import React, { useState, useEffect, useMemo } from "react";

interface NewsItem {
  title: string;
  url: string;
  source: string;
  date: string;
  snippet: string;
  image?: string | null;
}

const SOURCE_CONFIG: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    accent: string;
    dot: string;
  }
> = {
  "TechCrunch AI": {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    accent: "from-emerald-500/30 via-emerald-950/20 to-cosmic-950",
    dot: "bg-emerald-400",
  },
  "MIT Technology Review": {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
    accent: "from-rose-500/30 via-rose-950/20 to-cosmic-950",
    dot: "bg-rose-400",
  },
  "The Verge AI": {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
    accent: "from-purple-500/30 via-purple-950/20 to-cosmic-950",
    dot: "bg-purple-400",
  },
  "VentureBeat AI": {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
    accent: "from-blue-500/30 via-blue-950/20 to-cosmic-950",
    dot: "bg-blue-400",
  },
  "Ars Technica": {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    accent: "from-amber-500/30 via-amber-950/20 to-cosmic-950",
    dot: "bg-amber-400",
  },
  "Ars Technica Tech": {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    accent: "from-amber-500/30 via-amber-950/20 to-cosmic-950",
    dot: "bg-amber-400",
  },
  "Wired AI": {
    bg: "bg-cyan-500/10",
    text: "text-brand-cyan",
    border: "border-cyan-500/30",
    accent: "from-cyan-500/30 via-cyan-950/20 to-cosmic-950",
    dot: "bg-brand-cyan",
  },
  "ZDNet AI": {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/30",
    accent: "from-indigo-500/30 via-indigo-950/20 to-cosmic-950",
    dot: "bg-indigo-400",
  },
};

function getSourceConfig(source: string) {
  return (
    SOURCE_CONFIG[source] || {
      bg: "bg-slate-800/60",
      text: "text-brand-sky",
      border: "border-slate-700",
      accent: "from-brand-cyan/30 via-brand-sapphire/20 to-cosmic-950",
      dot: "bg-brand-sky",
    }
  );
}

function formatRelativeTime(dateStr: string): string {
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

function calculateReadingTime(text: string): string {
  const words = text ? text.split(/\s+/).length : 0;
  const mins = Math.max(2, Math.ceil(words / 25) + 1);
  return `${mins} min read`;
}

/** Robust image with smooth error fallback */
function ArticleThumbnail({
  src,
  alt,
  source,
}: {
  src?: string | null;
  alt: string;
  source: string;
}) {
  const [hasError, setHasError] = useState(false);
  const cfg = getSourceConfig(source);

  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br ${cfg.accent} bg-cosmic-900 border border-slate-800/80 relative overflow-hidden`}
      >
        <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center mb-1 text-slate-300">
          ⚡
        </div>
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest text-center line-clamp-1">
          {source}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-cosmic-950">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {/* Subtle darkening overlay for typography contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950/80 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
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
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(12);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

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
        setError("Unable to load latest intelligence wire. Please check back shortly.");
      } finally {
        setIsLoading(false);
      }
    }

    loadNews();
  }, []);

  // Source list with counts
  const sourceStats = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach((a) => {
      if (a.source) {
        counts[a.source] = (counts[a.source] || 0) + 1;
      }
    });
    return counts;
  }, [articles]);

  const uniqueSources = useMemo(() => {
    return ["All", ...Object.keys(sourceStats)];
  }, [sourceStats]);

  // Filtered and sorted articles
  const filteredArticles = useMemo(() => {
    const list = articles.filter((item) => {
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

    return list.sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return sortBy === "latest" ? dateB - dateA : dateA - dateB;
    });
  }, [articles, selectedSource, searchQuery, sortBy]);

  // Hero breaking article
  const isHeroMode = !searchQuery && selectedSource === "All" && filteredArticles.length > 0;
  const featuredArticle = isHeroMode ? filteredArticles[0] : null;
  const remainingArticles = isHeroMode ? filteredArticles.slice(1) : filteredArticles;

  const displayedArticles = useMemo(() => {
    return remainingArticles.slice(0, visibleCount);
  }, [remainingArticles, visibleCount]);

  const handleCopyLink = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header section (if not hidden) */}
      {!hideHeader && (
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
            AI & Machine Learning <span className="text-gradient-cyan">Intelligence Wire</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-3xl font-light leading-relaxed">
            Real-time breakthroughs, foundation models, agent architectures, and decentralized compute trends curated continuously with editorial imagery from the world&apos;s elite AI publishers.
          </p>
        </div>
      )}

      {/* Featured Breaking Hero Card (Prominent Top Story with Editorial Image) */}
      {!isLoading && !error && featuredArticle && (
        <div className="mb-10 w-full">
          <div className="relative group rounded-3xl glass-panel p-6 sm:p-8 lg:p-10 border-brand-cyan/25 hover:border-brand-cyan/50 transition-all duration-300 shadow-[0_8px_32px_rgba(0,242,254,0.12)] overflow-hidden">
            {/* Ambient Background Glow behind Featured Card */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-gradient-to-br from-brand-cyan/20 via-brand-sapphire/15 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Headline, Snippet, Metadata, and CTAs */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Top Row: Tag & Source & Relative Time */}
                  <div className="flex flex-wrap items-center gap-2.5 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 tracking-wider uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
                      Breaking Dispatch
                    </span>

                    {(() => {
                      const cfg = getSourceConfig(featuredArticle.source);
                      return (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {featuredArticle.source}
                        </span>
                      );
                    })()}

                    <span className="text-xs font-mono text-slate-400">
                      {formatRelativeTime(featuredArticle.date)}
                    </span>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                      {calculateReadingTime(featuredArticle.snippet)}
                    </span>
                  </div>

                  {/* Featured Title */}
                  <a
                    href={featuredArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group/title mb-4"
                  >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white group-hover/title:text-brand-cyan transition-colors leading-tight">
                      {featuredArticle.title}
                    </h2>
                  </a>

                  {/* Featured Excerpt */}
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                    {featuredArticle.snippet}
                  </p>
                </div>

                {/* CTA Buttons & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
                  <a
                    href={featuredArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-sapphire text-cosmic-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_28px_rgba(0,242,254,0.5)] transition duration-300 hover:scale-[1.02]"
                  >
                    <span>Read Full Investigation</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>

                  <button
                    onClick={(e) => handleCopyLink(featuredArticle.url, e)}
                    title="Copy Story Link"
                    className="px-3.5 py-2 rounded-xl bg-cosmic-800/80 hover:bg-cosmic-700 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-mono transition flex items-center gap-1.5"
                  >
                    {copiedUrl === featuredArticle.url ? (
                      <>
                        <span className="text-emerald-400">✓</span>
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Hero High-Res Image Frame */}
              <div className="lg:col-span-5 h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden border border-brand-cyan/20 relative shadow-[0_0_24px_rgba(0,242,254,0.12)]">
                <a
                  href={featuredArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <ArticleThumbnail
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    source={featuredArticle.source}
                  />
                  {/* Floating publisher badge over image */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg glass-pill text-[11px] font-mono text-white/90">
                    Source: {featuredArticle.source}
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Control Bar: Search, Source Pills, View & Sort Switcher */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Row 1: Search & Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              placeholder="Search AI breakthroughs, models, labs, authors, or topics..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-panel text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan/60 transition duration-200"
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

          {/* Sort & View Mode Switcher */}
          <div className="flex items-center gap-2 justify-end">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "latest" | "oldest")}
              className="glass-pill px-3 py-2 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-brand-cyan/40 bg-cosmic-900 cursor-pointer"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            <div className="flex items-center glass-pill p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 shadow-[0_0_8px_rgba(0,242,254,0.3)]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                title="List View"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "list"
                    ? "bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 shadow-[0_0_8px_rgba(0,242,254,0.3)]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Source Filter Pills with Counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {uniqueSources.map((src) => {
            const isSelected = selectedSource === src;
            const count = src === "All" ? articles.length : sourceStats[src] || 0;
            const cfg = src === "All" ? null : getSourceConfig(src);

            return (
              <button
                key={src}
                onClick={() => {
                  setSelectedSource(src);
                  setVisibleCount(12);
                }}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 flex items-center gap-2 ${
                  isSelected
                    ? "bg-brand-cyan/20 border border-brand-cyan text-brand-sky shadow-[0_0_14px_rgba(0,242,254,0.25)] font-semibold"
                    : "glass-pill text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                <span>{src}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-brand-cyan/30 text-white" : "bg-slate-800 text-slate-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="glass-panel rounded-2xl animate-pulse flex flex-col h-80 overflow-hidden border-slate-800"
            >
              <div className="h-44 bg-slate-800 w-full" />
              <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                <div className="h-5 w-3/4 bg-slate-800 rounded-md" />
                <div className="h-4 w-full bg-slate-800/60 rounded-md" />
                <div className="h-4 w-1/2 bg-slate-800/40 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="glass-panel p-10 rounded-2xl text-center border-red-500/20 text-slate-400 my-8">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400 text-xl">
            ⚠️
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Wire Signal Interrupted</h3>
          <p className="text-red-400 font-mono text-xs sm:text-sm mb-6 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-xl bg-cosmic-800 hover:bg-cosmic-700 text-xs font-mono text-white border border-slate-700 transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty results */}
      {!isLoading && !error && filteredArticles.length === 0 && (
        <div className="glass-panel p-12 rounded-2xl text-center text-slate-400 my-8 border-slate-800">
          <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-3 text-slate-400 text-xl">
            🔍
          </div>
          <p className="text-base font-mono mb-2 text-slate-200">No stories matching your query.</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
            Try adjusting your search terms or selecting &quot;All&quot; from the source filters above.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedSource("All");
            }}
            className="px-4 py-2 rounded-xl bg-brand-cyan/20 border border-brand-cyan/40 text-brand-sky text-xs font-mono hover:bg-brand-cyan/30 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Main Articles Container: Grid Mode vs List Mode */}
      {!isLoading && !error && displayedArticles.length > 0 && (
        <>
          {viewMode === "grid" ? (
            /* Bento Grid with Media Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedArticles.map((article, idx) => {
                const cfg = getSourceConfig(article.source);
                const isCopied = copiedUrl === article.url;

                return (
                  <div
                    key={article.url || idx}
                    className="group relative glass-panel rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-cyan/40 hover:shadow-[0_12px_32px_rgba(0,242,254,0.14)]"
                  >
                    {/* Top Media Frame */}
                    <div className="relative w-full h-48 overflow-hidden bg-cosmic-950">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                      >
                        <ArticleThumbnail
                          src={article.image}
                          alt={article.title}
                          source={article.source}
                        />
                      </a>

                      {/* Source badge overlay on top-left of image */}
                      <div className="absolute top-3 left-3 z-10">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium backdrop-blur-md border shadow-md ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {article.source}
                        </span>
                      </div>

                      {/* Reading time overlay on top-right of image */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-cosmic-950/80 backdrop-blur-md text-slate-300 border border-slate-700/60">
                          {calculateReadingTime(article.snippet)}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                      <div>
                        {/* Relative Date */}
                        <div className="text-[11px] font-mono text-slate-400 mb-2">
                          {formatRelativeTime(article.date)}
                        </div>

                        {/* Title with Link */}
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mb-2.5"
                        >
                          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-cyan transition-colors duration-200 line-clamp-2 leading-snug">
                            {article.title}
                          </h3>
                        </a>

                        {/* Excerpt */}
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3 font-light mb-4">
                          {article.snippet}
                        </p>
                      </div>

                      {/* Card Bottom Bar */}
                      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs mt-auto">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-brand-sky hover:text-brand-cyan transition-colors font-medium group/link"
                        >
                          <span>Read Story</span>
                          <svg
                            className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </a>

                        <button
                          onClick={(e) => handleCopyLink(article.url, e)}
                          title="Copy link"
                          className="p-1.5 rounded-lg bg-cosmic-800/80 hover:bg-cosmic-700 text-slate-400 hover:text-white transition flex items-center gap-1"
                        >
                          {isCopied ? (
                            <span className="text-[10px] font-mono text-emerald-400">Copied!</span>
                          ) : (
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List Layout with Media Thumbnails */
            <div className="flex flex-col gap-3.5">
              {displayedArticles.map((article, idx) => {
                const cfg = getSourceConfig(article.source);
                const isCopied = copiedUrl === article.url;

                return (
                  <div
                    key={article.url || idx}
                    className="group glass-panel p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 hover:border-brand-cyan/40 hover:bg-cosmic-900/80"
                  >
                    {/* Thumbnail on left */}
                    <div className="w-full sm:w-36 h-28 sm:h-24 shrink-0 rounded-xl overflow-hidden relative bg-cosmic-950">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                      >
                        <ArticleThumbnail
                          src={article.image}
                          alt={article.title}
                          source={article.source}
                        />
                      </a>
                    </div>

                    {/* Middle: Meta, Headline & Snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {article.source}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {formatRelativeTime(article.date)}
                        </span>
                        <span className="text-slate-600 hidden sm:inline">•</span>
                        <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                          {calculateReadingTime(article.snippet)}
                        </span>
                      </div>

                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-cyan transition-colors line-clamp-1 leading-snug">
                          {article.title}
                        </h3>
                      </a>
                      <p className="text-slate-400 text-xs line-clamp-2 mt-1 font-light">
                        {article.snippet}
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={(e) => handleCopyLink(article.url, e)}
                        title="Copy Story Link"
                        className="p-2 rounded-lg bg-cosmic-800 text-slate-400 hover:text-white transition"
                      >
                        {isCopied ? (
                          <span className="text-xs font-mono text-emerald-400">✓</span>
                        ) : (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        )}
                      </button>

                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-cosmic-800 border border-slate-700/60 hover:border-brand-cyan/40 text-brand-sky hover:text-brand-cyan text-xs font-mono font-medium transition inline-flex items-center gap-1.5"
                      >
                        <span>Read</span>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button & Progress Bar */}
          {visibleCount < remainingArticles.length && (
            <div className="flex flex-col items-center justify-center pt-10">
              {/* Progress Bar */}
              <div className="w-48 h-1 bg-slate-800 rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-cyan to-brand-sapphire transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      ((visibleCount + (featuredArticle ? 1 : 0)) /
                        filteredArticles.length) *
                        100
                    )}%`,
                  }}
                />
              </div>

              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl glass-panel text-xs sm:text-sm font-mono text-slate-200 hover:text-white hover:border-brand-cyan/60 hover:shadow-[0_0_20px_rgba(0,242,254,0.2)] transition-all duration-300"
              >
                <span>Load More Intelligence Wire ({remainingArticles.length - visibleCount} more)</span>
                <svg className="w-4 h-4 text-brand-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <span className="text-[11px] font-mono text-slate-500 mt-2.5">
                Showing {Math.min(visibleCount + (featuredArticle ? 1 : 0), filteredArticles.length)} of {filteredArticles.length} curated stories
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

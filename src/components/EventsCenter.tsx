"use client";

import React, { useState, useEffect, useMemo } from "react";

export interface EventItem {
  id: string;
  title: string;
  category: "Crypto" | "AI" | "Crypto x AI" | string;
  badge: string;
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  description: string;
  topics: string[];
  officialUrl: string;
  xHandle: string;
  isFeatured: boolean;
  status: string;
  daysLeft: number;
  formattedDate: string;
  googleCalendarUrl: string;
  image?: string | null;
}

const CATEGORY_STYLES: Record<
  string,
  {
    label: string;
    text: string;
    bg: string;
    border: string;
    dot: string;
    accent: string;
  }
> = {
  Crypto: {
    label: "Crypto & Web3",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
    accent: "from-amber-500/30 via-amber-950/20 to-cosmic-950",
  },
  AI: {
    label: "Artificial Intelligence",
    text: "text-brand-cyan",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    dot: "bg-brand-cyan",
    accent: "from-cyan-500/30 via-cyan-950/20 to-cosmic-950",
  },
  "Crypto x AI": {
    label: "Crypto x AI",
    text: "text-brand-purple",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    dot: "bg-brand-purple",
    accent: "from-purple-500/30 via-purple-950/20 to-cosmic-950",
  },
  DeAI: {
    label: "Crypto x AI",
    text: "text-brand-purple",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    dot: "bg-brand-purple",
    accent: "from-purple-500/30 via-purple-950/20 to-cosmic-950",
  },
};

function getCategoryConfig(category: string) {
  return (
    CATEGORY_STYLES[category] || {
      label: category || "Event",
      text: "text-brand-sky",
      bg: "bg-slate-800/60",
      border: "border-slate-700",
      dot: "bg-brand-sky",
      accent: "from-brand-cyan/30 via-brand-sapphire/20 to-cosmic-950",
    }
  );
}

/** Robust Event Image with smooth fallback */
function EventThumbnail({
  src,
  alt,
  category,
}: {
  src?: string | null;
  alt: string;
  category: string;
}) {
  const [hasError, setHasError] = useState(false);
  const cfg = getCategoryConfig(category);

  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br ${cfg.accent} bg-cosmic-900 border border-slate-800/80 relative overflow-hidden`}
      >
        <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center mb-1 text-slate-300">
          🌐
        </div>
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest text-center line-clamp-1">
          {cfg.label}
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
      <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950/80 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}

interface EventsCenterProps {
  hideHeader?: boolean;
}

export default function EventsCenter({ hideHeader = false }: EventsCenterProps) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [timelineFilter, setTimelineFilter] = useState<"all" | "upcoming" | "completed">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(12);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        const res = await fetch("/events.json", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to load events: ${res.status}`);
        }
        const data: EventItem[] = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        console.error("Error loading events.json:", err);
        setError("Unable to load latest events calendar. Please check back shortly.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  // Category counts
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((ev) => {
      const cat = ev.category || "Crypto";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [events]);

  const uniqueCategories = useMemo(() => {
    return ["All", "Crypto", "AI", "Crypto x AI"];
  }, []);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesCategory =
        selectedCategory === "All" ||
        ev.category === selectedCategory ||
        (selectedCategory === "Crypto x AI" && ev.category === "DeAI");

      let matchesTimeline = true;
      if (timelineFilter === "upcoming") {
        matchesTimeline = ev.status !== "Completed";
      } else if (timelineFilter === "completed") {
        matchesTimeline = ev.status === "Completed";
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.topics?.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesTimeline && matchesQuery;
    });
  }, [events, selectedCategory, timelineFilter, searchQuery]);

  // Featured flagship event (top upcoming or featured event)
  const isHeroMode = !searchQuery && selectedCategory === "All" && timelineFilter === "all" && filteredEvents.length > 0;
  // Pick Solana Breakpoint or first featured event as hero
  const featuredEvent = useMemo(() => {
    if (!isHeroMode) return null;
    return filteredEvents.find((e) => e.isFeatured) || filteredEvents[0];
  }, [isHeroMode, filteredEvents]);

  const remainingEvents = useMemo(() => {
    if (!featuredEvent) return filteredEvents;
    return filteredEvents.filter((e) => e.id !== featuredEvent.id);
  }, [filteredEvents, featuredEvent]);

  const displayedEvents = useMemo(() => {
    return remainingEvents.slice(0, visibleCount);
  }, [remainingEvents, visibleCount]);

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
      {/* Header section with heading and a small body */}
      {!hideHeader && (
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
            Crypto & AI <span className="text-gradient-cyan">Global Events</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-3xl font-light leading-relaxed">
            Curated calendar of 100+ premier summits, developer hackathons, and research conferences across Web3, Artificial Intelligence, and Decentralized Intelligence.
          </p>
        </div>
      )}

      {/* Featured Flagship Event Hero Card (Prominent Card with Scraped Image) */}
      {!isLoading && !error && featuredEvent && (
        <div className="mb-10 w-full">
          <div className="relative group rounded-3xl glass-panel p-6 sm:p-8 lg:p-10 border-brand-cyan/25 hover:border-brand-cyan/50 transition-all duration-300 shadow-[0_8px_32px_rgba(0,242,254,0.12)] overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-gradient-to-br from-brand-cyan/20 via-brand-sapphire/15 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Metadata, Title, Description, and CTAs */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center gap-2.5 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 tracking-wider uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
                      Featured Summit
                    </span>

                    {(() => {
                      const cfg = getCategoryConfig(featuredEvent.category);
                      return (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {featuredEvent.category}
                        </span>
                      );
                    })()}

                    <span className="text-xs font-mono text-slate-400">
                      {featuredEvent.formattedDate}
                    </span>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <span className="text-xs font-mono text-brand-sky hidden sm:inline">
                      📍 {featuredEvent.location}
                    </span>
                  </div>

                  {/* Title */}
                  <a
                    href={featuredEvent.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group/title mb-3"
                  >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white group-hover/title:text-brand-cyan transition-colors leading-tight">
                      {featuredEvent.title}
                    </h2>
                  </a>

                  {/* Small Body / Description */}
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5 font-normal">
                    {featuredEvent.description}
                  </p>

                  {/* Topics Pills */}
                  {featuredEvent.topics && featuredEvent.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {featuredEvent.topics.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-0.5 rounded-md glass-pill text-[11px] font-mono text-slate-300 border-slate-700/60"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <a
                      href={featuredEvent.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-sapphire text-cosmic-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_28px_rgba(0,242,254,0.5)] transition duration-300 hover:scale-[1.02]"
                    >
                      <span>Visit Official Site</span>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </a>

                    {featuredEvent.googleCalendarUrl && (
                      <a
                        href={featuredEvent.googleCalendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-cosmic-800/80 hover:bg-cosmic-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-mono transition flex items-center gap-1.5"
                      >
                        <span>📅 Add to Calendar</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleCopyLink(featuredEvent.officialUrl, e)}
                    title="Copy Event Link"
                    className="p-2.5 rounded-xl bg-cosmic-800/80 hover:bg-cosmic-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition flex items-center gap-1.5"
                  >
                    {copiedUrl === featuredEvent.officialUrl ? (
                      <span className="text-emerald-400">✓ Copied</span>
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

              {/* Right Column: High-Res Scraped Event Banner */}
              <div className="lg:col-span-5 h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden border border-brand-cyan/20 relative shadow-[0_0_24px_rgba(0,242,254,0.12)]">
                <a
                  href={featuredEvent.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <EventThumbnail
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    category={featuredEvent.category}
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg glass-pill text-[11px] font-mono text-white/90">
                    📍 {featuredEvent.venue || featuredEvent.location}
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Control Bar: Search, Category Pills, Timeline & View Mode */}
      <div className="flex flex-col gap-4 mb-8">
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
              placeholder="Search conferences, cities, venues, or topics..."
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

          {/* Timeline & View Switcher */}
          <div className="flex items-center gap-2 justify-end">
            <select
              value={timelineFilter}
              onChange={(e) => setTimelineFilter(e.target.value as "all" | "upcoming" | "completed")}
              className="glass-pill px-3 py-2 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-brand-cyan/40 bg-cosmic-900 cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="upcoming">Upcoming Only</option>
              <option value="completed">Past Events</option>
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

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {uniqueCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === "All"
                ? events.length
                : cat === "Crypto x AI"
                ? (categoryStats["Crypto x AI"] || 0) + (categoryStats["DeAI"] || 0)
                : categoryStats[cat] || 0;
            const cfg = cat === "All" ? null : getCategoryConfig(cat);

            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(12);
                }}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 flex items-center gap-2 ${
                  isSelected
                    ? "bg-brand-cyan/20 border border-brand-cyan text-brand-sky shadow-[0_0_14px_rgba(0,242,254,0.25)] font-semibold"
                    : "glass-pill text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                <span>{cat}</span>
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

      {/* Error State */}
      {!isLoading && error && (
        <div className="glass-panel p-10 rounded-2xl text-center border-red-500/20 text-slate-400 my-8">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400 text-xl">
            ⚠️
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Events Signal Interrupted</h3>
          <p className="text-red-400 font-mono text-xs sm:text-sm mb-6 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-xl bg-cosmic-800 hover:bg-cosmic-700 text-xs font-mono text-white border border-slate-700 transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty Results */}
      {!isLoading && !error && filteredEvents.length === 0 && (
        <div className="glass-panel p-12 rounded-2xl text-center text-slate-400 my-8 border-slate-800">
          <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-3 text-slate-400 text-xl">
            🔍
          </div>
          <p className="text-base font-mono mb-2 text-slate-200">No events matching your query.</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
            Try adjusting your search terms or selecting &quot;All&quot; from the category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setTimelineFilter("all");
            }}
            className="px-4 py-2 rounded-xl bg-brand-cyan/20 border border-brand-cyan/40 text-brand-sky text-xs font-mono hover:bg-brand-cyan/30 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Events Display: Grid Mode vs List Mode */}
      {!isLoading && !error && displayedEvents.length > 0 && (
        <>
          {viewMode === "grid" ? (
            /* Bento Grid with Scraped Event Photos */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedEvents.map((event, idx) => {
                const cfg = getCategoryConfig(event.category);
                const isCopied = copiedUrl === event.officialUrl;

                return (
                  <div
                    key={event.id || idx}
                    className="group relative glass-panel rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-cyan/40 hover:shadow-[0_12px_32px_rgba(0,242,254,0.14)]"
                  >
                    {/* Top Scraped Media Frame */}
                    <div className="relative w-full h-48 overflow-hidden bg-cosmic-950">
                      <a
                        href={event.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                      >
                        <EventThumbnail
                          src={event.image}
                          alt={event.title}
                          category={event.category}
                        />
                      </a>

                      {/* Category Badge overlay on top-left of image */}
                      <div className="absolute top-3 left-3 z-10">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium backdrop-blur-md border shadow-md ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {event.category}
                        </span>
                      </div>

                      {/* Status / Days Left pill floating on top-right */}
                      <div className="absolute top-3 right-3 z-10">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono backdrop-blur-md border ${
                            event.status === "Live Now"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse font-bold"
                              : event.status === "Completed"
                              ? "bg-slate-900/80 text-slate-400 border-slate-700/60"
                              : "bg-brand-cyan/15 text-brand-sky border-brand-cyan/30 font-medium"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                      <div>
                        {/* Date & Location Header */}
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2 gap-2">
                          <span className="text-brand-sky">{event.formattedDate}</span>
                          <span className="truncate max-w-[140px] text-slate-500" title={event.location}>
                            📍 {event.location}
                          </span>
                        </div>

                        {/* Title with Link */}
                        <a
                          href={event.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mb-2"
                        >
                          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-cyan transition-colors duration-200 line-clamp-2 leading-snug">
                            {event.title}
                          </h3>
                        </a>

                        {/* Small Body / Description */}
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 font-light mb-3">
                          {event.description}
                        </p>

                        {/* Topics */}
                        {event.topics && event.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {event.topics.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded text-[10px] font-mono bg-cosmic-800 text-slate-400 border border-slate-700/50"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Bottom Bar */}
                      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs mt-auto">
                        <a
                          href={event.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-brand-sky hover:text-brand-cyan transition-colors font-medium group/link"
                        >
                          <span>Official Site</span>
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

                        <div className="flex items-center gap-1.5">
                          {event.googleCalendarUrl && (
                            <a
                              href={event.googleCalendarUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Add to Google Calendar"
                              className="p-1.5 rounded-lg bg-cosmic-800/80 hover:bg-cosmic-700 text-slate-400 hover:text-white transition"
                            >
                              📅
                            </a>
                          )}

                          <button
                            onClick={(e) => handleCopyLink(event.officialUrl, e)}
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
                  </div>
                );
              })}
            </div>
          ) : (
            /* List Layout with Media Thumbnails */
            <div className="flex flex-col gap-3.5">
              {displayedEvents.map((event, idx) => {
                const cfg = getCategoryConfig(event.category);
                const isCopied = copiedUrl === event.officialUrl;

                return (
                  <div
                    key={event.id || idx}
                    className="group glass-panel p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 hover:border-brand-cyan/40 hover:bg-cosmic-900/80"
                  >
                    {/* Thumbnail on left */}
                    <div className="w-full sm:w-36 h-28 sm:h-24 shrink-0 rounded-xl overflow-hidden relative bg-cosmic-950">
                      <a
                        href={event.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                      >
                        <EventThumbnail
                          src={event.image}
                          alt={event.title}
                          category={event.category}
                        />
                      </a>
                    </div>

                    {/* Middle: Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {event.category}
                        </span>
                        <span className="text-[11px] font-mono text-brand-sky">
                          {event.formattedDate}
                        </span>
                        <span className="text-slate-600 hidden sm:inline">•</span>
                        <span className="text-[11px] font-mono text-slate-400 truncate max-w-xs">
                          📍 {event.location}
                        </span>
                      </div>

                      <a
                        href={event.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-cyan transition-colors line-clamp-1 leading-snug">
                          {event.title}
                        </h3>
                      </a>
                      <p className="text-slate-400 text-xs line-clamp-1 mt-1 font-light">
                        {event.description}
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {event.googleCalendarUrl && (
                        <a
                          href={event.googleCalendarUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Add to Google Calendar"
                          className="p-2 rounded-lg bg-cosmic-800 text-slate-400 hover:text-white transition"
                        >
                          📅
                        </a>
                      )}

                      <button
                        onClick={(e) => handleCopyLink(event.officialUrl, e)}
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
                        href={event.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-cosmic-800 border border-slate-700/60 hover:border-brand-cyan/40 text-brand-sky hover:text-brand-cyan text-xs font-mono font-medium transition inline-flex items-center gap-1.5"
                      >
                        <span>Visit</span>
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
          {visibleCount < remainingEvents.length && (
            <div className="flex flex-col items-center justify-center pt-10">
              <div className="w-48 h-1 bg-slate-800 rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-cyan to-brand-sapphire transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      ((visibleCount + (featuredEvent ? 1 : 0)) /
                        filteredEvents.length) *
                        100
                    )}%`,
                  }}
                />
              </div>

              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl glass-panel text-xs sm:text-sm font-mono text-slate-200 hover:text-white hover:border-brand-cyan/60 hover:shadow-[0_0_20px_rgba(0,242,254,0.2)] transition-all duration-300"
              >
                <span>Load More Events ({remainingEvents.length - visibleCount} more)</span>
                <svg className="w-4 h-4 text-brand-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <span className="text-[11px] font-mono text-slate-500 mt-2.5">
                Showing {Math.min(visibleCount + (featuredEvent ? 1 : 0), filteredEvents.length)} of {filteredEvents.length} global events
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

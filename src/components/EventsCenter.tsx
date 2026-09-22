"use client";

import React, { useState, useEffect, useMemo } from "react";

export interface EventItem {
  id: string;
  title: string;
  category: "Crypto" | "AI" | "DeAI";
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
}

const CATEGORY_STYLES: Record<string, { label: string; text: string; bg: string; border: string; glow: string }> = {
  Crypto: {
    label: "Crypto & Web3",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    glow: "rgba(245, 158, 11, 0.15)",
  },
  AI: {
    label: "Artificial Intelligence",
    text: "text-brand-cyan",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    glow: "rgba(0, 242, 254, 0.15)",
  },
  DeAI: {
    label: "Crypto x AI / DeAI",
    text: "text-brand-purple",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    glow: "rgba(168, 85, 247, 0.15)",
  },
};

export default function EventsCenter() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTimeline, setSelectedTimeline] = useState<"all" | "upcoming" | "past">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal state
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);

  // Load events from static public/events.json
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
        setError("Unable to load global events calendar. Please check back shortly.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  // Keyboard shortcut (Escape) to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModalEvent(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered list of events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Category filter
      const matchesCategory =
        selectedCategory === "All" || ev.category === selectedCategory;

      // Timeline filter
      let matchesTimeline = true;
      if (selectedTimeline === "upcoming") {
        matchesTimeline = ev.status !== "Completed";
      } else if (selectedTimeline === "past") {
        matchesTimeline = ev.status === "Completed";
      }

      // Search query
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q) ||
        ev.badge.toLowerCase().includes(q) ||
        ev.topics.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesTimeline && matchesQuery;
    });
  }, [events, selectedCategory, selectedTimeline, searchQuery]);

  // Generate and download .ics iCalendar file for Apple Calendar / Outlook
  const handleDownloadIcs = (ev: EventItem) => {
    try {
      const cleanStart = ev.startDate.replace(/-/g, "");
      const endDateObj = new Date(ev.endDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      const cleanEnd = endDateObj.toISOString().slice(0, 10).replace(/-/g, "");

      const icsLines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//dataverse.ai//Events Calendar//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${ev.id}@dverse.info`,
        `DTSTAMP:${cleanStart}T000000Z`,
        `DTSTART;VALUE=DATE:${cleanStart}`,
        `DTEND;VALUE=DATE:${cleanEnd}`,
        `SUMMARY:${ev.title}`,
        `DESCRIPTION:${ev.description.replace(/\n/g, "\\n")} \\n\\nOfficial: ${ev.officialUrl}\\nCurated by dataverse.ai ($DVERSE)`,
        `LOCATION:${ev.venue}, ${ev.location}`,
        `URL:${ev.officialUrl}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
      ];

      const blob = new Blob([icsLines.join("\r\n")], {
        type: "text/calendar;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${ev.id}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate ICS file:", err);
    }
  };

  return (
    <div className="w-full">
      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        {/* Category selection pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {["All", "Crypto", "AI", "DeAI"].map((cat) => {
            const isSelected = selectedCategory === cat;
            const label =
              cat === "All"
                ? "All Sectors"
                : cat === "Crypto"
                ? "Crypto & Web3"
                : cat === "AI"
                ? "Artificial Intelligence"
                : "Crypto x AI";

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all duration-200 border ${
                  isSelected
                    ? "bg-brand-sapphire/30 text-brand-cyan border-brand-cyan/50 shadow-[0_0_12px_rgba(0,242,254,0.2)]"
                    : "text-slate-400 hover:text-slate-200 border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Timeline Filter & Search Input */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Timeline filter */}
          <div className="flex items-center p-1 rounded-xl bg-cosmic-900/90 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setSelectedTimeline("all")}
              className={`px-2.5 py-1 rounded-lg transition ${
                selectedTimeline === "all"
                  ? "bg-brand-sapphire/40 text-brand-cyan font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All (2026)
            </button>
            <button
              onClick={() => setSelectedTimeline("upcoming")}
              className={`px-2.5 py-1 rounded-lg transition ${
                selectedTimeline === "upcoming"
                  ? "bg-brand-sapphire/40 text-brand-cyan font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setSelectedTimeline("past")}
              className={`px-2.5 py-1 rounded-lg transition ${
                selectedTimeline === "past"
                  ? "bg-brand-sapphire/40 text-brand-cyan font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Past
            </button>
          </div>

          {/* Quick search */}
          <div className="relative flex-1 md:w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search summit, city..."
              className="w-full px-3 py-1.5 pl-8 rounded-xl bg-cosmic-900/90 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-cyan/50 font-mono"
            />
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl animate-pulse border-white/5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-24 bg-white/5 rounded" />
                <div className="h-4 w-16 bg-white/5 rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-white/10 rounded mb-3" />
              <div className="h-4 w-1/2 bg-white/5 rounded mb-4" />
              <div className="h-12 w-full bg-white/5 rounded mb-4" />
              <div className="flex gap-1.5">
                <div className="h-5 w-14 bg-white/5 rounded-full" />
                <div className="h-5 w-14 bg-white/5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="p-8 text-center glass-panel rounded-2xl border-red-500/20 max-w-lg mx-auto">
          <p className="text-red-400 text-sm mb-3 font-mono">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 text-xs font-mono hover:bg-red-500/30 transition"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredEvents.length === 0 && (
        <div className="p-12 text-center glass-panel rounded-2xl border-white/5 max-w-md mx-auto">
          <span className="text-3xl mb-3 block">🗓️</span>
          <h4 className="text-white font-medium text-base mb-1 font-mono">
            No events found
          </h4>
          <p className="text-slate-400 text-xs mb-4">
            Try adjusting your search terms or filter selection.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedTimeline("all");
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-xl bg-brand-sapphire/20 text-brand-cyan border border-brand-cyan/30 text-xs font-mono hover:bg-brand-sapphire/40 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && !error && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredEvents.map((ev) => {
            const catStyle = CATEGORY_STYLES[ev.category] || CATEGORY_STYLES.Crypto;
            const isLive = ev.status === "Live Now";
            const isCompleted = ev.status === "Completed";

            return (
              <div
                key={ev.id}
                onClick={() => setActiveModalEvent(ev)}
                className="group relative flex flex-col justify-between glass-panel p-5 sm:p-6 rounded-2xl border-brand-sky/15 hover:border-brand-cyan/50 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(0,242,254,0.12)]"
              >
                {/* Subtle top glow indicator */}
                <div
                  className="absolute top-0 left-8 right-8 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${catStyle.text}, transparent)`,
                  }}
                />

                {/* Card Top: Category & Status */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {/* Category pill */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{catStyle.label}</span>
                    </span>

                    {/* Status Pill */}
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                        isLive
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse font-semibold"
                          : isCompleted
                          ? "bg-slate-800/80 text-slate-400 border-slate-700/60"
                          : "bg-brand-sapphire/20 text-brand-sky border-brand-sky/30"
                      }`}
                    >
                      {ev.status}
                    </span>
                  </div>

                  {/* Badge & Title */}
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                    {ev.badge}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-cyan transition-colors duration-200 line-clamp-2 leading-snug mb-3">
                    {ev.title}
                  </h3>

                  {/* Date & Location Rows */}
                  <div className="space-y-1.5 mb-4 text-xs font-mono text-slate-300">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 text-brand-sky shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="truncate">{ev.formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 text-brand-purple shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="truncate text-slate-400">{ev.location}</span>
                    </div>
                  </div>

                  {/* Snippet Description */}
                  <p className="text-slate-400 text-xs font-light leading-relaxed line-clamp-2 mb-4">
                    {ev.description}
                  </p>
                </div>

                {/* Card Bottom: Topic Tags & Action Hint */}
                <div>
                  {/* Topic pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {ev.topics.slice(0, 3).map((topic, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-400 border border-white/5"
                      >
                        #{topic}
                      </span>
                    ))}
                    {ev.topics.length > 3 && (
                      <span className="text-[10px] font-mono text-slate-500 py-0.5">
                        +{ev.topics.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Interactive Trigger Banner */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-brand-sky group-hover:text-brand-cyan transition-colors">
                    <span className="text-[11px]">View Details & Calendar</span>
                    <span className="text-sm transition-transform group-hover:translate-x-1 duration-200">
                      →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* Interactive Glassmorphic Modal with Multi-Actions                         */}
      {/* ========================================================================= */}
      {activeModalEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-cosmic-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveModalEvent(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-cosmic-900/95 border border-brand-sky/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalEvent(null)}
              aria-label="Close modal"
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Header: Category & Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {(() => {
                const style =
                  CATEGORY_STYLES[activeModalEvent.category] ||
                  CATEGORY_STYLES.Crypto;
                return (
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${style.bg} ${style.text} ${style.border}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>{style.label}</span>
                  </span>
                );
              })()}

              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-brand-sapphire/20 text-brand-sky border border-brand-sky/30">
                {activeModalEvent.badge}
              </span>

              <span
                className={`text-xs font-mono uppercase px-2.5 py-1 rounded-full border ${
                  activeModalEvent.status === "Live Now"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse font-semibold"
                    : activeModalEvent.status === "Completed"
                    ? "bg-slate-800/80 text-slate-400 border-slate-700/60"
                    : "bg-brand-sapphire/20 text-brand-cyan border-brand-cyan/30"
                }`}
              >
                {activeModalEvent.status}
              </span>
            </div>

            {/* Event Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
              {activeModalEvent.title}
            </h2>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-6 text-xs font-mono">
              <div className="space-y-1">
                <div className="text-slate-400 uppercase text-[10px]">Dates</div>
                <div className="text-white font-medium flex items-center gap-1.5">
                  <span>🗓️</span>
                  <span>{activeModalEvent.formattedDate}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-400 uppercase text-[10px]">Location</div>
                <div className="text-white font-medium flex items-center gap-1.5 truncate">
                  <span>📍</span>
                  <span>{activeModalEvent.location}</span>
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <div className="text-slate-400 uppercase text-[10px]">Venue</div>
                <div className="text-brand-sky font-medium flex items-center gap-1.5">
                  <span>🏛️</span>
                  <span>{activeModalEvent.venue}</span>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="mb-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                About The Summit
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed font-light">
                {activeModalEvent.description}
              </p>
            </div>

            {/* Topic Tracks */}
            <div className="mb-8">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Key Topics & Tracks
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeModalEvent.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-3 py-1 rounded-xl bg-brand-sapphire/15 border border-brand-sky/20 text-brand-sky"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Multi-Action Button Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-5 border-t border-white/10">
              {/* Primary: Visit Official Site */}
              <a
                href={activeModalEvent.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-cobalt via-brand-sapphire to-brand-cyan text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_25px_rgba(0,242,254,0.5)] transition duration-300"
              >
                <span>🎟️ Visit Official Site</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>

              {/* Secondary: Google Calendar */}
              {activeModalEvent.googleCalendarUrl && (
                <a
                  href={activeModalEvent.googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl glass-panel text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:border-brand-sky/40 transition duration-300"
                >
                  <span>📅 Google Cal</span>
                </a>
              )}

              {/* Secondary: Download .ics */}
              <button
                type="button"
                onClick={() => handleDownloadIcs(activeModalEvent)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl glass-panel text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:border-brand-sky/40 transition duration-300"
              >
                <span>💾 Save .ics</span>
              </button>

              {/* Twitter / X Handle */}
              {activeModalEvent.xHandle && (
                <a
                  href={`https://x.com/${activeModalEvent.xHandle.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl glass-panel text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:border-brand-cyan/40 transition duration-300"
                  aria-label="View on X"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

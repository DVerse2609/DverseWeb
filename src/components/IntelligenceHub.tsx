"use client";

import React, { useState, useEffect } from "react";
import NewsCenter from "@/components/NewsCenter";
import EventsCenter from "@/components/EventsCenter";

export default function IntelligenceHub() {
  const [activeTab, setActiveTab] = useState<"news" | "events">("news");

  // Sync active tab with URL hash on mount and on hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#events") {
        setActiveTab("events");
      } else if (hash === "#news" || hash === "#news-center") {
        setActiveTab("news");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleTabChange = (tab: "news" | "events") => {
    setActiveTab(tab);
    // Smoothly update URL hash without jump
    if (typeof window !== "undefined") {
      window.history.replaceState(
        null,
        "",
        tab === "news" ? "#news-center" : "#events"
      );
    }
  };

  return (
    <section
      id="hub"
      className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 z-10 scroll-mt-20"
    >
      {/* Scroll anchor targets for both #news-center and #events */}
      <div id="news-center" className="absolute -top-24" />
      <div id="events" className="absolute -top-24" />

      {/* Modern High-Tech Tab Switcher */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-cosmic-900/90 border border-brand-sky/25 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.6)]">
          <button
            type="button"
            onClick={() => handleTabChange("news")}
            className={`flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === "news"
                ? "bg-gradient-to-r from-brand-cobalt to-brand-sapphire text-white shadow-[0_0_20px_rgba(37,99,235,0.45)] border border-brand-cyan/40"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <span>📰</span>
            <span>Live AI News</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/25 font-bold">
              100+
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("events")}
            className={`flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all duration-300 ${
              activeTab === "events"
                ? "bg-gradient-to-r from-brand-cobalt to-brand-sapphire text-white shadow-[0_0_20px_rgba(37,99,235,0.45)] border border-brand-cyan/40"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <span>🗓️</span>
            <span>Crypto & AI Events</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30 font-bold">
              100+
            </span>
          </button>
        </div>
      </div>

      {/* Dynamic Header based on active tab */}
      {activeTab === "news" ? (
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
      ) : (
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-xs font-mono text-brand-purple mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-purple opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-purple" />
            </span>
            <span>GLOBAL 2026 RADAR & CALENDAR</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
            Crypto & AI <span className="text-gradient-cyan">Global Events</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl font-light">
            Curated calendar of 100+ premier summits, hackathons, and developer conferences across Web3, Artificial Intelligence, and Decentralized AI. Click any event to view agenda details and save to your calendar.
          </p>
        </div>
      )}

      {/* Tab Content Display */}
      {activeTab === "news" ? (
        <NewsCenter hideHeader={true} />
      ) : (
        <EventsCenter />
      )}
    </section>
  );
}

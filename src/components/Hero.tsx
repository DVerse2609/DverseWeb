"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function Hero() {
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [searchPrompt, setSearchPrompt] = useState("");

  const handleCopyDomain = () => {
    navigator.clipboard.writeText("dverse.info");
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  const triggerSearchAndScroll = (query: string) => {
    const trimmed = query.trim();
    const newsSection = document.getElementById("news-center");
    const newsInput = newsSection?.querySelector<HTMLInputElement>('input[type="text"]');

    if (newsInput && trimmed) {
      // Set input value and dispatch React input event
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;
      nativeSetter?.call(newsInput, trimmed);
      newsInput.dispatchEvent(new Event("input", { bubbles: true }));
    }

    newsSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearchAndScroll(searchPrompt);
  };

  const trendingTopics = [
    { label: "⚡ Frontier Models", query: "OpenAI" },
    { label: "🧠 Autonomous Agents", query: "agents" },
    { label: "🟣 Solana & DePIN", query: "compute" },
    { label: "🛡️ ZK & Privacy", query: "privacy" },
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4 py-8 sm:py-14 my-auto z-10">
      {/* Floating Crystal Logo with Orbital Cosmic Rings */}
      <div className="relative mb-8 sm:mb-10 flex items-center justify-center">
        {/* Orbital Ring */}
        <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-brand-sky/20 border-dashed animate-orbit-slow pointer-events-none">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-brand-violet ring-4 ring-brand-purple/30 shadow-[0_0_10px_#a855f7]" />
        </div>

        {/* Ambient Halo */}
        <div className="absolute inset-0 bg-brand-cyan/20 rounded-full blur-2xl animate-pulse-glow" />

        {/* Levitating Crystal */}
        <div className="relative animate-float z-10 p-2">
          <Image
            src="/logo.png"
            alt="dataverse.ai"
            width={160}
            height={122}
            className="w-28 sm:w-36 h-auto drop-shadow-[0_0_30px_rgba(0,242,254,0.4)]"
            priority
          />
        </div>
      </div>

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-sapphire/15 border border-brand-sky/25 text-xs font-mono text-brand-sky mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
        <span>LIVE INTELLIGENCE PROTOCOL</span>
        <span className="text-slate-500">•</span>
        <span>$DVERSE ON SOLANA</span>
      </div>

      {/* Headline */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
        The World&apos;s First{" "}
        <span className="text-gradient-cyan">Free AI Knowledge Base</span>.
      </h1>

      {/* Clean, authoritative Subtitle */}
      <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mb-8 leading-relaxed font-light">
        Democratizing decentralized intelligence for everyone. Live curated research, zero paywalls, powered by{" "}
        <span className="text-white font-medium font-mono">$DVERSE</span> on Solana.
      </p>

      {/* Interactive AI Knowledge Search Bar */}
      <div className="w-full max-w-xl mx-auto mb-5">
        <form
          onSubmit={handleSearchSubmit}
          className="group relative flex items-center p-1 rounded-2xl glass-panel focus-within:border-brand-cyan/60 focus-within:shadow-[0_0_25px_rgba(0,242,254,0.18)] transition-all duration-300"
        >
          <div className="pl-3.5 pr-2 text-brand-sky pointer-events-none">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <input
            type="text"
            value={searchPrompt}
            onChange={(e) => setSearchPrompt(e.target.value)}
            placeholder="Search 100+ AI breakthroughs, models, or topics..."
            className="w-full py-3 pr-2 bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
          />

          <button
            type="submit"
            className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-cobalt to-brand-sapphire hover:from-brand-sapphire hover:to-brand-cyan text-white font-medium text-xs sm:text-sm transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.35)]"
          >
            <span>Explore Feed</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </button>
        </form>

        {/* Trending Quick-Query Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3">
          <span className="text-[11px] font-mono text-slate-500 mr-1 hidden sm:inline">
            Trending:
          </span>
          {trendingTopics.map((topic) => (
            <button
              key={topic.label}
              onClick={() => {
                setSearchPrompt(topic.query);
                triggerSearchAndScroll(topic.query);
              }}
              className="px-2.5 py-0.5 rounded-lg glass-pill text-[11px] font-mono text-slate-400 hover:text-brand-cyan hover:border-brand-cyan/40 transition duration-200"
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dual High-Conversion Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto mb-10">
        <a
          href="#news-center"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-cobalt via-brand-sapphire to-brand-cyan text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_25px_rgba(0,242,254,0.5)] transition-all duration-300"
        >
          <span>⚡ Browse 100+ Live Stories</span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </a>

        <a
          href="https://t.me"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl glass-panel text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:border-brand-sky/40 transition duration-300"
        >
          <svg className="w-4 h-4 text-brand-sky" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          <span>Join Community</span>
        </a>
      </div>

      {/* Three Solana & Protocol Trust Badges */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-2xl mx-auto mb-8">
        <div className="glass-panel p-3 sm:p-4 rounded-2xl flex flex-col items-center border-brand-sky/15 hover:border-brand-cyan/40 transition duration-300">
          <div className="text-base sm:text-xl font-bold font-mono text-white">100+</div>
          <div className="text-[10px] sm:text-xs font-mono text-brand-sky uppercase mt-0.5">Live AI Feeds</div>
          <div className="text-[9px] sm:text-[10px] text-slate-500 font-sans hidden sm:block mt-0.5">Updated Every 6h</div>
        </div>

        <div className="glass-panel p-3 sm:p-4 rounded-2xl flex flex-col items-center border-brand-sky/15 hover:border-brand-violet/40 transition duration-300">
          <div className="text-base sm:text-xl font-bold font-mono text-white">Solana</div>
          <div className="text-[10px] sm:text-xs font-mono text-brand-purple uppercase mt-0.5">High-Speed Layer</div>
          <div className="text-[9px] sm:text-[10px] text-slate-500 font-sans hidden sm:block mt-0.5">Sub-cent Micro-compute</div>
        </div>

        <div className="glass-panel p-3 sm:p-4 rounded-2xl flex flex-col items-center border-brand-sky/15 hover:border-emerald-500/40 transition duration-300">
          <div className="text-base sm:text-xl font-bold font-mono text-white">100%</div>
          <div className="text-[10px] sm:text-xs font-mono text-emerald-400 uppercase mt-0.5">Free & Open</div>
          <div className="text-[9px] sm:text-[10px] text-slate-500 font-sans hidden sm:block mt-0.5">Zero Central Paywalls</div>
        </div>
      </div>

      {/* Domain Badge */}
      <button
        onClick={handleCopyDomain}
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cosmic-900/80 border border-slate-800 hover:border-brand-sky/40 text-xs font-mono text-slate-400 hover:text-slate-200 transition"
      >
        <span className="text-brand-cyan">official:</span>
        <span>dverse.info</span>
        {copiedDomain ? (
          <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}

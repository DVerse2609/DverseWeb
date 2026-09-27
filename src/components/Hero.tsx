"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function Hero() {
  const [copiedDomain, setCopiedDomain] = useState(false);

  const handleCopyDomain = () => {
    navigator.clipboard.writeText("dverse.info");
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4 py-2 sm:py-6 my-auto z-10 w-full">
      {/* Floating Crystal Logo with Orbital Cosmic Rings */}
      <div className="relative mb-4 sm:mb-6 flex items-center justify-center">
        {/* Orbital Ring */}
        <div className="absolute w-32 h-32 sm:w-44 sm:h-44 rounded-full border border-brand-sky/20 border-dashed animate-orbit-slow pointer-events-none">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-violet ring-4 ring-brand-purple/30 shadow-[0_0_10px_#a855f7]" />
        </div>

        {/* Ambient Halo */}
        <div className="absolute inset-0 bg-brand-cyan/20 rounded-full blur-2xl animate-pulse-glow" />

        {/* Levitating Crystal */}
        <div className="relative animate-float z-10 p-1">
          <Image
            src="/logo.png"
            alt="dataverse.ai"
            width={140}
            height={106}
            className="w-20 sm:w-28 h-auto drop-shadow-[0_0_25px_rgba(0,242,254,0.4)]"
            priority
          />
        </div>
      </div>

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sapphire/15 border border-brand-sky/25 text-[10px] sm:text-xs font-mono text-brand-sky mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
        <span>LIVE INTELLIGENCE PROTOCOL</span>
        <span className="text-slate-500">•</span>
        <span>$DVERSE ON SOLANA</span>
      </div>

      {/* Headline */}
      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2.5 sm:mb-3 leading-tight max-w-3xl">
        The World&apos;s First{" "}
        <span className="text-gradient-cyan">Free AI Knowledge Base</span>.
      </h1>

      {/* Clean, authoritative Subtitle */}
      <p className="text-slate-400 text-xs sm:text-base max-w-2xl mb-5 sm:mb-6 leading-relaxed font-light px-2">
        Democratizing decentralized intelligence for everyone. Live curated research, zero paywalls, powered by{" "}
        <span className="text-white font-medium font-mono">$DVERSE</span> on Solana.
      </p>

      {/* Join Our Community CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 w-full max-w-md mx-auto mb-5 sm:mb-7">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-300 font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Join Our Community
        </span>
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
          <a
            href="https://x.com/DverseAI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-brand-sky/50 text-white text-xs sm:text-sm font-medium shadow-md hover:shadow-[0_0_20px_rgba(0,242,254,0.25)] transition-all duration-300 group"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 group-hover:text-brand-cyan transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>X</span>
          </a>

          <a
            href="https://t.me/dversecommunity"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-brand-cobalt via-brand-sapphire to-brand-cyan text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_25px_rgba(0,242,254,0.5)] transition-all duration-300 group"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <span>Telegram</span>
          </a>
        </div>
      </div>

      {/* Three Solana & Protocol Trust Badges */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3.5 w-full max-w-xl mx-auto mb-4 sm:mb-6">
        <div className="glass-panel p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex flex-col items-center border-brand-sky/15 hover:border-brand-cyan/40 transition duration-300">
          <div className="text-sm sm:text-lg font-bold font-mono text-white">100+</div>
          <div className="text-[9px] sm:text-xs font-mono text-brand-sky uppercase mt-0.5">Live AI Feeds</div>
          <div className="text-[8px] sm:text-[9px] text-slate-500 font-sans hidden sm:block mt-0.5">Updated Every 6h</div>
        </div>

        <div className="glass-panel p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex flex-col items-center border-brand-sky/15 hover:border-brand-violet/40 transition duration-300">
          <div className="text-sm sm:text-lg font-bold font-mono text-white">Solana</div>
          <div className="text-[9px] sm:text-xs font-mono text-brand-purple uppercase mt-0.5">High-Speed Layer</div>
          <div className="text-[8px] sm:text-[9px] text-slate-500 font-sans hidden sm:block mt-0.5">Sub-cent Compute</div>
        </div>

        <div className="glass-panel p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex flex-col items-center border-brand-sky/15 hover:border-emerald-500/40 transition duration-300">
          <div className="text-sm sm:text-lg font-bold font-mono text-white">100%</div>
          <div className="text-[9px] sm:text-xs font-mono text-emerald-400 uppercase mt-0.5">Free & Open</div>
          <div className="text-[8px] sm:text-[9px] text-slate-500 font-sans hidden sm:block mt-0.5">Zero Central Paywalls</div>
        </div>
      </div>

      {/* Domain Badge */}
      <button
        onClick={handleCopyDomain}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-900/80 border border-slate-800 hover:border-brand-sky/40 text-[11px] font-mono text-slate-400 hover:text-slate-200 transition"
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

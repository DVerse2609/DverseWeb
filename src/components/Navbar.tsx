"use client";

import React from "react";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-20">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-cosmic-900 border border-brand-sky/30 flex items-center justify-center p-0.5">
          <Image
            src="/logo.png"
            alt="dataverse"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
        <span className="font-bold tracking-wider text-sm sm:text-base text-white font-mono">
          DATAVERSE<span className="text-brand-cyan">.AI</span>
        </span>
      </div>

      {/* Navigation & Socials */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <a
          href="#news-center"
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-slate-200 bg-cosmic-900/90 border border-brand-sky/25 hover:border-brand-cyan/60 hover:text-brand-cyan transition duration-200 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
          <span>AI News</span>
        </a>

        <a
          href="#events"
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-slate-200 bg-cosmic-900/90 border border-brand-purple/30 hover:border-brand-purple/60 hover:text-brand-purple transition duration-200 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
          <span>Events</span>
          <span className="text-[10px] text-brand-purple bg-brand-purple/15 px-1.5 py-0.2 rounded border border-brand-purple/20 hidden sm:inline-block">
            2026
          </span>
        </a>

        <a
          href="https://x.com/DverseAI"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
          className="text-slate-400 hover:text-brand-cyan transition duration-200"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a
          href="https://t.me/dversecommunity"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
          className="text-slate-400 hover:text-brand-cyan transition duration-200"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </a>
      </div>
    </header>
  );
}

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

      {/* Socials */}
      <div className="flex items-center gap-3">
        <a
          href="https://x.com"
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
          href="https://t.me"
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

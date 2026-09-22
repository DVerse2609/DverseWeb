"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-850/80 text-xs font-mono text-slate-500 z-20">
      <div className="flex items-center gap-2">
        <span className="text-slate-400 font-semibold font-mono">
          DATAVERSE<span className="text-brand-cyan">.AI</span>
        </span>
        <span>•</span>
        <span>dverse.info</span>
      </div>

      {/* Social Links */}
      <div className="flex items-center gap-4">
        <a
          href="https://t.me/dversecommunity"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-brand-cyan transition duration-200"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          <span>Telegram</span>
        </a>

        <a
          href="https://x.com/DverseAI"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-brand-cyan transition duration-200"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>X (Twitter)</span>
        </a>
      </div>

      <div>
        <span>© {new Date().getFullYear()} dataverse.ai. All rights reserved.</span>
      </div>
    </footer>
  );
}

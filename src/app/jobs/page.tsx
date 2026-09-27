"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleCanvas from "@/components/ParticleCanvas";

export default function JobsPage() {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative h-screen max-h-screen bg-cosmic-950 text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Interactive Cursor Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 242, 254, 0.05), transparent 80%)`,
        }}
      />

      {/* Particle Canvas */}
      <ParticleCanvas />

      {/* Ambient background glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-br from-brand-violet/20 via-brand-purple/15 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-0 w-[550px] h-[550px] bg-gradient-to-tl from-brand-cobalt/15 via-brand-sapphire/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Navbar */}
      <Navbar />

      {/* Main Content: Launching Soon Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 w-full max-w-4xl mx-auto overflow-hidden text-center">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/25 text-xs font-mono text-brand-purple mb-4 shadow-[0_0_12px_rgba(168,85,247,0.15)] shrink-0">
          <span className="text-sm">💼</span>
          <span className="tracking-widest uppercase font-medium">CAREERS & ECOSYSTEM BOUNTIES</span>
        </div>

        {/* Big Launching Soon Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-3 shrink-0">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-purple-200 to-white drop-shadow-[0_0_28px_rgba(0,242,254,0.4)]">
            Launching Soon
          </span>
        </h1>

        <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 shrink-0">
          Decentralized AI & Web3 Talent Network
        </h2>

        {/* Narrative Description */}
        <p className="text-slate-300 text-xs sm:text-sm lg:text-base max-w-2xl font-light leading-relaxed mb-6 shrink-0">
          We are curating high-impact remote, hybrid, and onsite opportunities and funded bounties across top-tier Decentralized AI protocols, research labs, and Solana teams.
        </p>

        {/* Upcoming Role Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 shrink-0">
          <span className="px-3 py-1 rounded-lg glass-pill text-[11px] sm:text-xs font-mono text-slate-300 border-brand-violet/20">
            🧠 AI Research Engineers
          </span>
          <span className="px-3 py-1 rounded-lg glass-pill text-[11px] sm:text-xs font-mono text-slate-300 border-brand-violet/20">
            ⚡ Solana Core Architects
          </span>
          <span className="px-3 py-1 rounded-lg glass-pill text-[11px] sm:text-xs font-mono text-slate-300 border-brand-violet/20">
            🌐 DePIN Infrastructure
          </span>
          <span className="px-3 py-1 rounded-lg glass-pill text-[11px] sm:text-xs font-mono text-slate-300 border-brand-violet/20">
            🎯 Open Protocol Bounties
          </span>
        </div>

        {/* Join Our Community Section */}
        <div className="flex flex-col items-center gap-2.5 w-full max-w-sm shrink-0">
          <span className="text-[11px] sm:text-xs font-mono font-medium text-slate-400 tracking-widest uppercase">
            Join Our Community For Hiring Drops
          </span>
          <div className="flex items-center justify-center gap-3 w-full">
            <a
              href="https://x.com/DverseAI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl glass-pill hover:border-brand-sky/60 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] shadow-[0_0_15px_rgba(56,189,248,0.15)] group"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X (Twitter)</span>
            </a>

            <a
              href="https://t.me/dversecommunity"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-cobalt via-brand-sapphire to-brand-cyan text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_25px_rgba(0,242,254,0.5)] transition-all duration-300 group"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span>Telegram</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer compact={true} />
    </div>
  );
}

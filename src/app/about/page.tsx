"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ParticleCanvas from "@/components/ParticleCanvas";

export default function AboutPage() {
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
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-br from-brand-cobalt/20 via-brand-cyan/15 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-0 w-[550px] h-[550px] bg-gradient-to-tl from-brand-violet/15 via-brand-sapphire/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Navbar */}
      <Navbar />

      {/* Main Hero Section: All content visible in single screen without scrolling */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto overflow-hidden">
        {/* Friendly & Stylish Header */}
        <div className="flex flex-col items-center text-center mb-3 sm:mb-4 shrink-0 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/25 text-xs font-mono text-brand-sky mb-2 shadow-[0_0_12px_rgba(0,242,254,0.15)]">
            <span className="text-sm">✨</span>
            <span className="tracking-widest uppercase font-medium">ABOUT DATAVERSE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-black tracking-tight leading-tight mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-teal-200 to-white drop-shadow-[0_0_20px_rgba(0,242,254,0.3)]">
              No Gates, No Paywalls:
            </span>{" "}
            <span className="text-white">
              Building the Open Home for AI and Crypto
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm lg:text-[15px] font-light leading-relaxed max-w-3xl">
            DATAVERSE was built on a very simple conviction: the tools defining our generation, Artificial Intelligence and crypto, should belong to everyone, not just those who can afford expensive courses and paywalled communities.
          </p>
        </div>

        {/* 3 Story Cards (Welcoming, Modern Bento Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 w-full max-w-5xl mb-3 sm:mb-4 shrink-0">
          {/* Card 1: Tearing Down The Walls */}
          <div className="group glass-panel p-4 sm:p-5 rounded-2xl flex flex-col justify-between border-brand-sky/15 hover:border-brand-cyan/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,242,254,0.1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-cyan/60 to-transparent" />
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="w-8 h-8 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan text-sm">
                  🔓
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-sky">
                  Open Homeland
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-2 group-hover:text-brand-cyan transition-colors">
                Tearing Down The Walls
              </h3>
              <p className="text-slate-300 text-xs sm:text-[12.5px] leading-relaxed font-light">
                When you look around today, the gap between people building the future and people trying to break into it is growing fast. Most platforms lock their best insights, career leads, and training behind subscriptions. We started DATAVERSE to tear those walls down and build an open home base where anyone, no matter where they start, can pick up real skills, stay informed, and build something meaningful.
              </p>
            </div>
          </div>

          {/* Card 2: Daily Living Intelligence */}
          <div className="group glass-panel p-4 sm:p-5 rounded-2xl flex flex-col justify-between border-brand-sky/15 hover:border-brand-violet/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(168,85,247,0.1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-violet/60 to-transparent" />
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="w-8 h-8 rounded-xl bg-brand-violet/15 border border-brand-violet/30 flex items-center justify-center text-brand-purple text-sm">
                  ⚡
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-purple">
                  Daily Radar
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-2 group-hover:text-brand-purple transition-colors">
                Real Skills & Opportunities
              </h3>
              <p className="text-slate-300 text-xs sm:text-[12.5px] leading-relaxed font-light">
                Every single day, we bring together the latest developments across AI and Web3, break down major industry shifts, track global events, and curate real job opportunities whether you want to work remotely, locally, or in a hybrid role. You get zero cost access to foundational guides, news updates, and beginner friendly roadmaps to experiment with modern tech.
              </p>
            </div>
          </div>

          {/* Card 3: Powered by dverse */}
          <div className="group glass-panel p-4 sm:p-5 rounded-2xl flex flex-col justify-between border-brand-sky/15 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(16,185,129,0.1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/60 to-transparent" />
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-sm">
                  🚀
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  Community Fuel
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                The Power of dverse
              </h3>
              <p className="text-slate-300 text-xs sm:text-[12.5px] leading-relaxed font-light">
                To take this ecosystem further, we introduced dverse. While all of our core educational materials and community resources will stay free forever, dverse acts as the practical fuel for our platform. As we roll out new products and specialized project builds, members can use the coin to unlock advanced development modules, get hands on support from industry experts, and tap into dedicated launch tools.
              </p>
            </div>
          </div>
        </div>


        {/* Join Our Community Section */}
        <div className="flex flex-col items-center gap-2 w-full max-w-sm shrink-0">
          <span className="text-[10px] sm:text-xs font-mono font-medium text-slate-400 tracking-widest uppercase">
            Join Our Community
          </span>
          <div className="flex items-center justify-center gap-3 w-full">
            <a
              href="https://x.com/DverseAI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl glass-pill hover:border-brand-sky/60 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] shadow-[0_0_15px_rgba(56,189,248,0.15)] group"
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
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-cobalt via-brand-sapphire to-brand-cyan text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:shadow-[0_0_25px_rgba(0,242,254,0.5)] transition-all duration-300 group"
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
    </div>
  );
}

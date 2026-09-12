"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Real-time Countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    targetDate.setHours(18, 0, 0, 0);

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    try {
      const existing = JSON.parse(localStorage.getItem("dataverse_waitlist") || "[]");
      if (!existing.includes(email)) {
        existing.push({ email, timestamp: new Date().toISOString() });
        localStorage.setItem("dataverse_waitlist", JSON.stringify(existing));
      }
    } catch {
      // ignore
    }

    setIsSubmitted(true);
  };

  const handleCopyDomain = () => {
    navigator.clipboard.writeText("dataverse.info");
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4 py-8 sm:py-12 my-auto">
      {/* Floating Logo with Orbital Cosmic Rings */}
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
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sapphire/15 border border-brand-sky/25 text-xs font-mono text-brand-sky mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
        <span>COMING SOON</span>
        <span className="text-slate-500">•</span>
        <span>$DVERSE</span>
      </div>

      {/* Headline */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
        The World&apos;s First{" "}
        <span className="text-gradient-cyan">Free AI Knowledge Base</span>.
      </h1>

      {/* Clean, one-line Subtitle */}
      <p className="text-slate-400 text-sm sm:text-lg max-w-xl mb-8 leading-relaxed font-light">
        Democratizing decentralized intelligence for everyone. Powered by{" "}
        <span className="text-white font-medium font-mono">$DVERSE</span>.
      </p>

      {/* Minimal Waitlist Form */}
      <div className="w-full max-w-md mx-auto mb-10">
        {!isSubmitted ? (
          <form
            onSubmit={handleSubscribe}
            className="flex items-center gap-2 p-1 rounded-2xl glass-panel focus-within:border-brand-cyan/60 transition duration-300"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for early access..."
              className="w-full px-4 py-3 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
            />
            <button
              type="submit"
              className="shrink-0 inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-cobalt to-brand-sapphire hover:from-brand-sapphire hover:to-brand-cyan text-white font-medium text-xs sm:text-sm transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              <span>Notify Me</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 p-3.5 rounded-2xl glass-panel border-emerald-500/40 bg-emerald-950/20 text-emerald-300 text-xs sm:text-sm font-mono animate-fade-in">
            <svg className="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>You&apos;re on the list! We&apos;ll notify you at launch.</span>
          </div>
        )}
      </div>

      {/* Minimal Countdown */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Mins", value: timeLeft.minutes },
          { label: "Secs", value: timeLeft.seconds },
        ].map((item, idx) => (
          <div
            key={idx}
            className="glass-panel px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl flex flex-col items-center min-w-[58px] sm:min-w-[68px] border-brand-sky/15"
          >
            <span className="font-mono text-lg sm:text-xl font-bold text-white">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono uppercase text-slate-400">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Domain Badge */}
      <button
        onClick={handleCopyDomain}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-900/80 border border-slate-800 hover:border-brand-sky/40 text-xs font-mono text-slate-400 hover:text-slate-200 transition"
      >
        <span>dataverse.info</span>
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

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "About Us", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Learning & Development", href: "/learning" },
  { label: "Jobs", href: "/jobs" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between z-30 relative">
      {/* Brand / Logo */}
      <Link
        href="/"
        className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02]"
      >
        <div className="w-8 h-8 rounded-full bg-cosmic-900 border border-brand-sky/30 flex items-center justify-center p-0.5 shadow-[0_0_12px_rgba(0,242,254,0.25)] group-hover:border-brand-cyan/60 transition-colors">
          <Image
            src="/logo.png"
            alt="dataverse.ai"
            width={26}
            height={26}
            className="object-contain"
            priority
          />
        </div>
        <span className="font-bold tracking-wider text-sm sm:text-base text-white font-mono">
          DATAVERSE<span className="text-brand-cyan">.AI</span>
        </span>
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-cosmic-900/80 border border-brand-sky/20 backdrop-blur-md shadow-lg shadow-black/40">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 ${
                isActive
                  ? "bg-brand-sapphire/30 text-brand-cyan border border-brand-cyan/40 font-semibold shadow-[0_0_12px_rgba(0,242,254,0.25)]"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Compact Medium Nav (tablets) */}
      <nav className="hidden md:flex lg:hidden items-center gap-1 p-1 rounded-2xl bg-cosmic-900/80 border border-brand-sky/20 backdrop-blur-md">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const shortLabel =
            item.label === "Learning & Development" ? "L&D" : item.label;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 ${
                isActive
                  ? "bg-brand-sapphire/30 text-brand-cyan border border-brand-cyan/40 font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent"
              }`}
            >
              {shortLabel}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Hamburger Toggle Button */}
      <button
        type="button"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        className="md:hidden w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-slate-300 hover:text-white hover:border-brand-sky/40 transition"
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 p-3 rounded-2xl bg-cosmic-900/95 border border-brand-sky/30 backdrop-blur-xl shadow-2xl flex flex-col gap-1.5 animate-fade-in z-50">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition ${
                  isActive
                    ? "bg-brand-sapphire/30 text-brand-cyan border border-brand-cyan/40 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

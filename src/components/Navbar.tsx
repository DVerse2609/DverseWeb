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
    </header>
  );
}

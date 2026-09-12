"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto px-6 py-5 text-center text-xs font-mono text-slate-500 z-20">
      <span>© {new Date().getFullYear()} dataverse.ai • dataverse.info</span>
    </footer>
  );
}

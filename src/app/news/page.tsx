"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleCanvas from "@/components/ParticleCanvas";
import NewsCenter from "@/components/NewsCenter";

export default function NewsPage() {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-cosmic-950 text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* Interactive Cursor Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 242, 254, 0.04), transparent 80%)`,
        }}
      />

      {/* Particle Canvas */}
      <ParticleCanvas />

      {/* Ambient background glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-br from-brand-cobalt/20 via-brand-cyan/15 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-0 w-[550px] h-[550px] bg-gradient-to-tl from-brand-violet/15 via-brand-sapphire/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Navbar */}
      <Navbar />

      {/* Main Content: News Center Wire */}
      <main className="relative z-10 flex-1 flex flex-col items-center w-full">
        <NewsCenter hideHeader={false} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

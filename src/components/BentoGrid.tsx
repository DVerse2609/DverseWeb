"use client";

import React from "react";
import { Cpu, Database, ShieldCheck, Zap, Activity, Layers } from "lucide-react";

const features = [
  {
    title: "Autonomous Agent Economy",
    tag: "Agentic Mesh",
    description:
      "Native micro-transaction & compute coordination layer enabling autonomous AI agents to negotiate, query, and transact in real-time.",
    icon: Cpu,
    metric: "sub-10ms latency",
    gradient: "from-blue-600/20 via-cyan-500/10 to-transparent",
    glow: "group-hover:border-brand-cyan/50",
  },
  {
    title: "Sovereign Data Liquidity",
    tag: "Decentralized Mesh",
    description:
      "Turn private, high-value proprietary datasets into liquid, monetizable assets protected by cryptographic access primitives.",
    icon: Database,
    metric: "100% Data Sovereignty",
    gradient: "from-brand-sapphire/20 via-brand-violet/10 to-transparent",
    glow: "group-hover:border-brand-sapphire/60",
  },
  {
    title: "Confidential ZK-Inference",
    tag: "Cryptographic Privacy",
    description:
      "Run verifiable model evaluations and collaborative fine-tuning across untrusted distributed nodes with zero raw data exposure.",
    icon: ShieldCheck,
    metric: "Zero-Knowledge Proofs",
    gradient: "from-brand-violet/20 via-brand-cyan/10 to-transparent",
    glow: "group-hover:border-brand-violet/60",
  },
];

export default function BentoGrid() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sapphire/15 border border-brand-sky/25 text-xs font-mono text-brand-sky mb-4">
          <Layers className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Core Protocol Pillars</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Architected for the{" "}
          <span className="text-gradient-cyan">Next Intelligence Frontier</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-3">
          $DVERSE powers the computational incentives and trustless verification required by enterprise AI swarms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className={`group relative glass-panel p-6 sm:p-8 rounded-3xl transition-all duration-500 hover:-translate-y-1.5 ${feature.glow} flex flex-col justify-between overflow-hidden`}
            >
              {/* Subtle top-corner background gradient */}
              <div
                className={`absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-bl ${feature.gradient} rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700`}
              />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-cosmic-900 border border-brand-sky/20 flex items-center justify-center text-brand-cyan group-hover:text-white group-hover:bg-gradient-to-br group-hover:from-brand-cobalt group-hover:to-brand-cyan transition-all duration-300 shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono tracking-wider px-2.5 py-1 rounded-full bg-cosmic-850 border border-slate-700/60 text-slate-300">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-sky transition duration-200">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-brand-sky">
                  <Activity className="w-3.5 h-3.5" />
                  {feature.metric}
                </span>
                <span className="text-slate-500 group-hover:text-brand-cyan transition">
                  Pillar {idx + 1} →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

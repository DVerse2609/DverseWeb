"use client";

import React, { useState } from "react";
import { Coins, Copy, Check, Shield, Globe, Terminal } from "lucide-react";

export default function TokenomicsTeaser() {
  const [copied, setCopied] = useState(false);
  const dummyCA = "0x7a8F...DVERSE_GENESIS_TGE";

  const handleCopy = () => {
    navigator.clipboard.writeText("https://dataverse.info");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl relative overflow-hidden border-brand-sky/20">
        {/* Background glow lines */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-cyan/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-brand-cobalt/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Token info */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sapphire/20 border border-brand-sky/30 text-xs font-mono text-brand-sky mb-4">
              <Coins className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Token Generation Event (TGE) Teaser</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Fueling the <span className="text-gradient-cyan">$DVERSE</span> Protocol
            </h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
              The $DVERSE utility token serves as the computational gas for decentralized agent routing, dataset staking, and cryptographic zero-knowledge proofs.
            </p>

            {/* Metrics pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-cosmic-900/90 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Ticker</div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">$DVERSE</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-cosmic-900/90 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Total Supply</div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">1,000,000,000</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-cosmic-900/90 border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Standard</div>
                <div className="text-lg font-bold text-brand-sky font-mono mt-0.5">Multi-Chain AI</div>
              </div>
            </div>
          </div>

          {/* Right Column: Contract & Portal Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-cosmic-950/80 border border-brand-sky/20 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Terminal className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Verified Portal & CA</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  Pre-Genesis
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cosmic-900 border border-slate-800 flex items-center justify-between font-mono text-xs text-slate-300 my-2 overflow-hidden">
                <div className="truncate text-slate-400">
                  <span className="text-brand-cyan">dataverse.info</span> • {dummyCA}
                </div>
                <button
                  onClick={handleCopy}
                  className="ml-2 p-1.5 rounded-lg bg-cosmic-800 hover:bg-cosmic-700 text-slate-300 hover:text-white transition shrink-0"
                  title="Copy Official Portal Link"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-1">
                <Shield className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span>Beware of impersonators. Only trust links from <b>dataverse.info</b></span>
              </div>
            </div>

            {/* Quick Live Telemetry */}
            <div className="p-4 rounded-2xl bg-cosmic-950/50 border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-brand-sky" />
                <span>Ecosystem Status</span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Nodes Preparing
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

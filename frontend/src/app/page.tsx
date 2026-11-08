import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  Terminal,
  Search,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-16 space-y-16">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Open Agent Ecosystem • NVIDIA SkillSpector Integrated</span>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-3xl space-y-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Discover, Secure & Compose{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            AI Agent Skills
          </span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          The package registry for autonomous coding agents. Discover capabilities by
          intent, inspect transparent static security reports, and compose custom
          skills with immutable SHA-256 provenance.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            href="/discover"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-102"
          >
            <Sparkles className="w-4 h-4" />
            Try AI Discovery
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <Link
            href="/catalog"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-medium text-sm flex items-center justify-center gap-2 transition-all hover:border-zinc-700"
          >
            <Search className="w-4 h-4 text-zinc-400" />
            Explore Catalog
          </Link>
        </div>
      </div>

      {/* Quick Terminal Preview */}
      <div className="w-full max-w-2xl rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-zinc-400">agent-skill install</span>
          </div>
          <span className="text-[10px] text-zinc-400">bash</span>
        </div>
        <div className="pt-3 font-mono text-xs sm:text-sm text-zinc-300 space-y-1.5">
          <p className="text-zinc-400"># Install audited Next.js 15 Agent Skill</p>
          <p className="text-emerald-400 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-indigo-400 shrink-0" />
            agy skill add nextjs-fullstack-dev@1.0.0
          </p>
          <p className="text-[11px] text-zinc-400 pt-1">
            ✔ Verified SHA-256: 64fefaab... • NVIDIA SkillSpector Score: 95/100 (CLEAN)
          </p>
        </div>
      </div>

      {/* 3 Core Architecture Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl pt-4">
        {/* Card 1 */}
        <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-6 space-y-3 hover:border-zinc-700/80 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-white">Intent-Based Discovery</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Describe your project stack in plain English. Our grounded AI engine retrieves
            real indexed skills with zero hallucinations.
          </p>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-6 space-y-3 hover:border-zinc-700/80 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-white">NVIDIA SkillSpector Audits</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Automated static analysis detecting dangerous shell commands, credential
            leaks, and prompt injection threats with transparent scores.
          </p>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-6 space-y-3 hover:border-zinc-700/80 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-white">Provenance Composition</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Combine multiple skills into custom bundles. Harmonizes instructions,
            tracks open-source licenses, and re-scans output safety.
          </p>
        </div>
      </div>
    </div>
  );
}


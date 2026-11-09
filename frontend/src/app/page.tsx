'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  Package,
  CheckCircle2,
  Users,
  UploadCloud,
  Compass,
  Terminal,
  Copy,
  Check,
  Lock,
} from 'lucide-react';
import { HomeHeroStudio } from '@/components/HomeHeroStudio';

export default function HomePage() {
  const router = useRouter();
  const [heroSearch, setHeroSearch] = useState('');
  const [copiedCli, setCopiedCli] = useState(false);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      router.push('/catalog');
    }
  };

  const handleCopyQuickstart = () => {
    navigator.clipboard.writeText('agy skill add nvidia-skillspector@1.2.0');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-24 pb-24 pt-4">
      {/* 1. npmjs-Style Hero Section: Big Search & Quickstart */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center space-y-8">
        {/* Anti-slop category badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono">
          <Package className="w-3.5 h-3.5" />
          <span>THE PACKAGE REGISTRY FOR AUTONOMOUS AI AGENTS</span>
        </div>

        {/* Primary headline (Developer-first, direct like npmjs) */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#f4f4f5] max-w-4xl leading-[1.12]">
          Build reliable AI agents with{' '}
          <span className="bg-gradient-to-r from-teal-400 via-teal-200 to-teal-400 bg-clip-text text-transparent">
            audited packages
          </span>
        </h1>

        {/* Concrete subtext with real engineering specifics */}
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
          Search, install, and publish verified capabilities for autonomous agents.
          Static AST security analysis powered by NVIDIA SkillSpector rules and SHA-256 integrity verification.
        </p>

        {/* npmjs-Style Massive Search Input */}
        <div className="w-full max-w-2xl mx-auto">
          <form onSubmit={handleHeroSearch} className="relative">
            <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Search packages (e.g. nvidia-skillspector, gemini, docker, python)..."
              className="w-full pl-12 pr-28 py-3.5 rounded-xl bg-[#18191e] border border-[#2e3039] text-sm text-[#f4f4f5] placeholder:text-zinc-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40 shadow-xl font-mono transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-[#121316] text-xs font-bold transition-all shadow-sm shadow-teal-500/20"
            >
              Search
            </button>
          </form>

          {/* Quick search tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs font-mono text-zinc-500">
            <span>Popular:</span>
            {['nvidia-skillspector', 'google-gemini-live-api', 'docker-container-manager'].map((pkg) => (
              <button
                key={pkg}
                onClick={() => router.push(`/skills/${pkg}`)}
                className="text-zinc-400 hover:text-teal-400 hover:underline transition-colors"
              >
                {pkg}
              </button>
            ))}
          </div>
        </div>

        {/* npmjs-Style Quickstart CLI Box */}
        <div className="w-full max-w-xl mx-auto p-3 rounded-xl bg-[#18191e] border border-[#2e3039] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-300 truncate mr-2">
            <Terminal className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="truncate">agy skill add nvidia-skillspector@1.2.0</span>
          </div>
          <button
            onClick={handleCopyQuickstart}
            className="px-3 py-1.5 rounded-lg bg-[#262830] hover:bg-[#2e3039] text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 shrink-0"
          >
            {copiedCli ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* npmjs-Style Live Audit Studio */}
        <div className="w-full pt-6">
          <HomeHeroStudio />
        </div>
      </section>

      {/* 2. Registry Stats Ticker (npmjs style) */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#18191e] border border-[#2e3039] text-center font-mono">
          <div className="space-y-1">
            <span className="text-2xl font-bold text-teal-400">100%</span>
            <p className="text-xs text-zinc-400">Static AST Audited</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-bold text-[#f4f4f5]">0-Threat</span>
            <p className="text-xs text-zinc-400">NVIDIA SkillSpector Rules</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-bold text-teal-400">SHA-256</span>
            <p className="text-xs text-zinc-400">Immutable Integrity</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-bold text-[#f4f4f5]">Cross-Agent</span>
            <p className="text-xs text-zinc-400">AGY, Claude, Gemini & Cursor</p>
          </div>
        </div>
      </section>

      {/* 3. Account Roles: "Which Account Fits Your Workflow?" */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-teal-400 uppercase tracking-widest">
            <Users className="w-3.5 h-3.5" />
            <span>ACCOUNT ROLES & ACCESS MODEL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f4f4f5]">
            Which Account Fits Your Workflow?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Engineered for developers consuming capabilities, publishers distributing verified tools, and workspace composers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Persona 1: Developer */}
          <div className="rounded-2xl bg-[#18191e] border border-[#2e3039] p-6 space-y-5 hover:border-teal-500/40 transition-colors flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-teal-400 font-semibold tracking-wider">
                  Role: DEVELOPER
                </span>
                <h3 className="text-lg font-bold text-[#f4f4f5]">The Capability Consumer</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                For engineers building agent applications. Search verified capabilities, inspect security reports,
                save skills to personal collections, leave ratings, and install with one CLI command.
              </p>
            </div>
            <ul className="text-xs text-zinc-300 space-y-2.5 pt-4 border-t border-[#2e3039] font-mono text-[11px]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Search verified public registry</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Submit 1-vote & 1-review per skill</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Bookmark personal skill collections</span>
              </li>
            </ul>
          </div>

          {/* Persona 2: Publisher */}
          <div className="rounded-2xl bg-[#18191e] border border-[#2e3039] p-6 space-y-5 hover:border-teal-500/40 transition-colors flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-teal-400 font-semibold tracking-wider">
                  Role: PUBLISHER
                </span>
                <h3 className="text-lg font-bold text-[#f4f4f5]">The Tool Author</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                For developers and teams distributing agent skills. Register skills, sync from GitHub repos,
                release immutable versions with SHA-256 hashes, and inspect automated security audit reports.
              </p>
            </div>
            <ul className="text-xs text-zinc-300 space-y-2.5 pt-4 border-t border-[#2e3039] font-mono text-[11px]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Publish SemVer versions to registry</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Automated NVIDIA SkillSpector AST scans</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Review community feedback & ratings</span>
              </li>
            </ul>
          </div>

          {/* Persona 3: Skill Composer */}
          <div className="rounded-2xl bg-[#18191e] border border-[#2e3039] p-6 space-y-5 hover:border-teal-500/40 transition-colors flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-teal-400 font-semibold tracking-wider">
                  Workspace Studio
                </span>
                <h3 className="text-lg font-bold text-[#f4f4f5]">The Skill Composer</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Combine multiple existing skills into custom agent bundles. Automatically harmonizes instructions,
                tracks license obligations, and verifies output safety before export.
              </p>
            </div>
            <ul className="text-xs text-zinc-300 space-y-2.5 pt-4 border-t border-[#2e3039] font-mono text-[11px]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Multi-skill bundle composition</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Automated license lineage tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Export standardized SKILL.md bundles</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Featured Real Skills Spotlight */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e3039] pb-4">
          <div>
            <span className="text-xs font-mono text-teal-400 uppercase tracking-wider">
              FEATURED PACKAGES
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#f4f4f5]">
              Trending Production Skills
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-xs text-teal-400 hover:text-teal-300 font-mono flex items-center gap-1 self-start sm:self-center"
          >
            <span>Explore all packages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Skill 1 */}
          <Link
            href="/skills/nvidia-skillspector"
            className="p-5 rounded-2xl bg-[#18191e] border border-[#2e3039] hover:border-teal-500/40 transition-all space-y-3.5 group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-[#262830] text-[#f4f4f5] text-[11px]">
                  v1.2.0
                </span>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[11px] font-medium border border-teal-500/20">
                  100/100 CLEAN
                </span>
              </div>
              <h3 className="font-bold text-[#f4f4f5] group-hover:text-teal-300 transition-colors text-sm">
                NVIDIA SkillSpector Security Auditor
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                Official static security scanner for agent skills, detecting dangerous shell commands, credential exfiltration, and supply chain threats.
              </p>
            </div>
            <div className="pt-3 flex items-center justify-between text-[11px] text-zinc-400 font-mono border-t border-[#2e3039]">
              <span>NVIDIA Security</span>
              <span className="text-zinc-500">Apache-2.0</span>
            </div>
          </Link>

          {/* Skill 2 */}
          <Link
            href="/skills/google-gemini-live-api"
            className="p-5 rounded-2xl bg-[#18191e] border border-[#2e3039] hover:border-teal-500/40 transition-all space-y-3.5 group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-[#262830] text-[#f4f4f5] text-[11px]">
                  v2.0.0
                </span>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[11px] font-medium border border-teal-500/20">
                  96/100 CLEAN
                </span>
              </div>
              <h3 className="font-bold text-[#f4f4f5] group-hover:text-teal-300 transition-colors text-sm">
                Google Gemini Multimodal Live API
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                Real-time bidirectional audio, vision, and text interaction skill with function calling and grounded search integration.
              </p>
            </div>
            <div className="pt-3 flex items-center justify-between text-[11px] text-zinc-400 font-mono border-t border-[#2e3039]">
              <span>Google Antigravity</span>
              <span className="text-zinc-500">Apache-2.0</span>
            </div>
          </Link>

          {/* Skill 3 */}
          <Link
            href="/skills/docker-container-manager"
            className="p-5 rounded-2xl bg-[#18191e] border border-[#2e3039] hover:border-teal-500/40 transition-all space-y-3.5 group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-[#262830] text-[#f4f4f5] text-[11px]">
                  v1.4.2
                </span>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[11px] font-medium border border-teal-500/20">
                  98/100 CLEAN
                </span>
              </div>
              <h3 className="font-bold text-[#f4f4f5] group-hover:text-teal-300 transition-colors text-sm">
                Docker Sandboxed Container Manager
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                Isolated sandbox execution environments with memory cgroups, bridge network namespaces, and rootless user permissions.
              </p>
            </div>
            <div className="pt-3 flex items-center justify-between text-[11px] text-zinc-400 font-mono border-t border-[#2e3039]">
              <span>Docker Inc.</span>
              <span className="text-zinc-500">MIT</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 5. 4-Step Deterministic Pipeline */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 rounded-3xl bg-[#18191e] border border-[#2e3039] p-8 sm:p-10 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-mono text-teal-400 uppercase tracking-widest">
            DETERMINISTIC PIPELINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#f4f4f5]">
            How the Registry Works
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Four automated verification gates execute on every package release.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl bg-[#121316] border border-[#2e3039] space-y-3">
            <span className="text-2xl font-bold font-mono text-teal-400">01</span>
            <h4 className="text-sm font-semibold text-[#f4f4f5]">GitHub Ingestion</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Publishers submit repository URLs. The ingestion engine parses metadata, extracts SKILL.md specs, and binds immutable git commit SHAs.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#121316] border border-[#2e3039] space-y-3">
            <span className="text-2xl font-bold font-mono text-teal-400">02</span>
            <h4 className="text-sm font-semibold text-[#f4f4f5]">AST Security Scan</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              NVIDIA SkillSpector static analysis scans code patterns for destructive commands, secret leaks, reverse shells, and prompt injection signatures.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#121316] border border-[#2e3039] space-y-3">
            <span className="text-2xl font-bold font-mono text-teal-400">03</span>
            <h4 className="text-sm font-semibold text-[#f4f4f5]">Intent Discovery</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Developers describe agent tasks in natural language. Grounded retrieval ranks matching skills with transparent confidence scores and justification notes.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#121316] border border-[#2e3039] space-y-3">
            <span className="text-2xl font-bold font-mono text-teal-400">04</span>
            <h4 className="text-sm font-semibold text-[#f4f4f5]">Compose & Install</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Combine multiple skills into audited agent bundles. Export standardized SKILL.md packages or install immediately with one CLI command.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

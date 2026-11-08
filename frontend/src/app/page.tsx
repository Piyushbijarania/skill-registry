import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  Terminal,
  Search,
  CheckCircle2,
  Users,
  UploadCloud,
  FileCode,
  Lock,
  GitBranch,
  Cpu,
  Compass,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center pt-6 pb-20 space-y-24">
      {/* 1. Hero Section */}
      <div className="flex flex-col items-center text-center max-w-4xl space-y-6 pt-4">
        {/* Subtle Tech Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Package Registry for Autonomous AI Agents</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Discover, Audit & Compose{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">
            AI Agent Skills
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          An open platform for finding trustworthy agent capabilities. Grounded intent discovery,
          transparent static analysis powered by NVIDIA SkillSpector, and license-compliant composition.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 w-full sm:w-auto">
          <Link
            href="/discover"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-102"
          >
            <Sparkles className="w-4 h-4 text-zinc-950" />
            Try Natural Language Discovery
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <Link
            href="/catalog"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-medium text-sm flex items-center justify-center gap-2 transition-all hover:border-zinc-700"
          >
            <Search className="w-4 h-4 text-zinc-400" />
            Explore Verified Catalog
          </Link>
        </div>

        {/* Live Terminal Installation Bar */}
        <div className="w-full max-w-2xl mt-4 rounded-2xl bg-zinc-950 border border-zinc-800/90 p-4 shadow-2xl backdrop-blur-md text-left font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-zinc-400 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-zinc-400">Terminal CLI</span>
            </div>
            <span>Cross-Agent Portable</span>
          </div>
          <div className="pt-3 space-y-1.5 text-zinc-300">
            <p className="text-zinc-400"># Install audited NVIDIA SkillSpector capability</p>
            <p className="text-cyan-400 flex items-center gap-2 font-medium">
              <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
              agy skill add nvidia-skillspector@1.2.0
            </p>
            <p className="text-[11px] text-zinc-400 pt-1">
              ✔ Verified SHA-256: 9c5d1e8a... • Score: 100/100 (CLEAN) • License: Apache-2.0
            </p>
          </div>
        </div>
      </div>

      {/* 2. Explanatory Section: "Which Account is for Whom?" */}
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <Users className="w-3.5 h-3.5" />
            <span>Platform User Types (SRS Section 3)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Which Account is for You?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Our platform serves developers, open-source publishers, and autonomous agent engineers with dedicated roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Persona 1: Developer */}
          <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800 p-6 space-y-4 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase text-cyan-400 font-semibold">Account Role: DEVELOPER</span>
              <h3 className="text-lg font-bold text-white">The Skill Consumer</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              For engineers building agent applications. Search verified capabilities, inspect security reports,
              save skills to personal collections, leave ratings, and install with one CLI command.
            </p>
            <ul className="text-xs text-zinc-300 space-y-2 pt-2 border-t border-zinc-800/80 font-mono text-[11px]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                Browse & Search Registry
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                1-Vote & 1-Review per skill
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                Curate Personal Collections
              </li>
            </ul>
          </div>

          {/* Persona 2: Publisher */}
          <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800 p-6 space-y-4 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase text-emerald-400 font-semibold">Account Role: PUBLISHER</span>
              <h3 className="text-lg font-bold text-white">The Skill Author</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              For developers and teams distributing agent skills. Register skills, sync from GitHub repos,
              release immutable versions with SHA-256 hashes, and inspect automated security audit reports.
            </p>
            <ul className="text-xs text-zinc-300 space-y-2 pt-2 border-t border-zinc-800/80 font-mono text-[11px]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Publish & Release SemVer
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Automated NVIDIA SkillSpector Scans
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Track Community Feedback
              </li>
            </ul>
          </div>

          {/* Persona 3: Custom Creator */}
          <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800 p-6 space-y-4 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Layers className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase text-sky-400 font-semibold">Workspace Feature</span>
              <h3 className="text-lg font-bold text-white">The Skill Composer</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Combine multiple existing skills into custom agent bundles. Automatically harmonizes instructions,
              tracks license obligations, and verifies output safety before export.
            </p>
            <ul className="text-xs text-zinc-300 space-y-2 pt-2 border-t border-zinc-800/80 font-mono text-[11px]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                Multi-Skill Bundle Composition
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                Provenance & License Lineage
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                1-Click Standard SKILL.md Export
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Real Skills Spotlight */}
      <div className="w-full max-w-5xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase">INDEXED IN REGISTRY</span>
            <h2 className="text-xl font-bold text-white">Featured Real-World Agent Skills</h2>
          </div>
          <Link
            href="/catalog"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 self-start sm:self-center"
          >
            View all skills <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Skill 1 */}
          <Link
            href="/skills/nvidia-skillspector"
            className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px]">v1.2.0</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-medium">
                100/100 CLEAN
              </span>
            </div>
            <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm">
              NVIDIA SkillSpector Security Auditor
            </h3>
            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              Official static security scanner for agent skills, detecting dangerous shell commands, credential exfiltration, and supply chain threats.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400 font-mono border-t border-zinc-800/60">
              <span>NVIDIA Security</span>
              <span>Apache-2.0</span>
            </div>
          </Link>

          {/* Skill 2 */}
          <Link
            href="/skills/google-gemini-live-api"
            className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px]">v2.0.0</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-medium">
                96/100 CLEAN
              </span>
            </div>
            <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm">
              Google Gemini Multimodal Live API
            </h3>
            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              Real-time bidirectional audio, vision, and text interaction skill with function calling and grounded search integration.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400 font-mono border-t border-zinc-800/60">
              <span>Google Antigravity</span>
              <span>Apache-2.0</span>
            </div>
          </Link>

          {/* Skill 3 */}
          <Link
            href="/skills/chrome-devtools-automation"
            className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px]">v1.5.0</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-medium">
                94/100 CLEAN
              </span>
            </div>
            <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm">
              Chrome DevTools Automation
            </h3>
            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              Browser automation, end-to-end testing, and DOM inspection agent skill powered by Chrome DevTools Protocol and Puppeteer.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400 font-mono border-t border-zinc-800/60">
              <span>Puppeteer Team</span>
              <span>Apache-2.0</span>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. 4-Step Interactive Lifecycle */}
      <div className="w-full max-w-5xl rounded-3xl bg-zinc-900/30 border border-zinc-800/80 p-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
            REGISTRY PIPELINE
          </span>
          <h2 className="text-2xl font-bold text-white">How the Platform Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <span className="text-xl font-bold font-mono text-cyan-400">01</span>
            <h4 className="text-sm font-semibold text-white">GitHub Ingestion</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Publishers submit public repositories. The pipeline parses metadata, extracts instructions, and records git commit revisions.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xl font-bold font-mono text-cyan-400">02</span>
            <h4 className="text-sm font-semibold text-white">Security Auditing</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              NVIDIA SkillSpector static analysis scans scripts for dangerous commands, secret harvesting, and prompt injection attempts.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xl font-bold font-mono text-cyan-400">03</span>
            <h4 className="text-sm font-semibold text-white">Grounded Discovery</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Users describe tasks in plain English. The AI engine ranks verified records with confidence scores and transparent reasons.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xl font-bold font-mono text-cyan-400">04</span>
            <h4 className="text-sm font-semibold text-white">Compose & Install</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Combine multiple skills into audited bundles. Export standard SKILL.md packages or install directly into your coding agent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

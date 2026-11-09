'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Terminal,
  Check,
  Copy,
  ArrowRight,
  ExternalLink,
  Code2,
  FileCheck,
  Cpu,
} from 'lucide-react';

interface FeaturedSkill {
  id: string;
  slug: string;
  name: string;
  version: string;
  license: string;
  score: number;
  status: 'CLEAN' | 'FINDINGS';
  sha256: string;
  category: string;
  terminalLog: string[];
  cliCommand: string;
}

const FEATURED_SKILLS: FeaturedSkill[] = [
  {
    id: '1',
    slug: 'nvidia-skillspector',
    name: 'NVIDIA SkillSpector Security Auditor',
    version: '1.2.0',
    license: 'Apache-2.0',
    score: 100,
    status: 'CLEAN',
    sha256: '9c5d1e8a2b3f4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d',
    category: 'Security & Static Analysis',
    cliCommand: 'agy skill add nvidia-skillspector@1.2.0',
    terminalLog: [
      '[scanner] Initializing NVIDIA SkillSpector AST rule engine v1.2.0...',
      '[ast-pass] Parsed SKILL.md specification and execution boundaries.',
      '[audit] Checking command execution rules (rm -rf, mkfs, dd)... PASS (0 threats)',
      '[audit] Auditing network egress & reverse shell signatures... PASS (0 threats)',
      '[audit] Secret & credential leak pattern matching... PASS (0 secrets exposed)',
      '[integrity] SHA-256 signature verified: 9c5d1e8a... (MATCH)',
      '[result] Security Assessment: 100/100 (CLEAN). Zero destructive commands detected.',
    ],
  },
  {
    id: '2',
    slug: 'google-gemini-live-api',
    name: 'Google Gemini Multimodal Live API',
    version: '2.0.0',
    license: 'Apache-2.0',
    score: 96,
    status: 'CLEAN',
    sha256: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
    category: 'Real-time Multimodal Stream',
    cliCommand: 'agy skill add google-gemini-live-api@2.0.0',
    terminalLog: [
      '[stream] Establishing WebSocket transport to wss://generativelanguage.googleapis.com',
      '[handshake] Live Bidi streaming channel opened: 24kHz PCM audio & H.264 vision',
      '[schema] Validated function calling tools: searchGrounded(), executeAction()',
      '[security] Enforcing client-side session authentication tokens',
      '[integrity] SHA-256 signature verified: 4a5b6c7d... (MATCH)',
      '[result] Security Assessment: 96/100 (CLEAN). Safe for production agent execution.',
    ],
  },
  {
    id: '3',
    slug: 'docker-container-manager',
    name: 'Docker Sandboxed Container Manager',
    version: '1.4.2',
    license: 'MIT',
    score: 98,
    status: 'CLEAN',
    sha256: '2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d',
    category: 'Isolated Execution Environments',
    cliCommand: 'agy skill add docker-container-manager@1.4.2',
    terminalLog: [
      '[daemon] Connecting to Docker socket: unix:///var/run/docker.sock',
      '[cgroup] Setting container memory limit: 512MB, cpu_quota: 100000',
      '[network] Isolating container network namespace: bridge mode (read-only mount)',
      '[security] Rootless user execution enforced: uid=1000 gid=1000',
      '[integrity] SHA-256 signature verified: 2c3d4e5f... (MATCH)',
      '[result] Security Assessment: 98/100 (CLEAN). Strict containment enforced.',
    ],
  },
];

export function HomeHeroStudio() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentSkill = FEATURED_SKILLS[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSkill.cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl bg-[#18191e] border border-[#2e3039] overflow-hidden shadow-2xl shadow-black/60">
      {/* Studio Top Chrome Bar */}
      <div className="px-4 py-3 bg-[#121316] border-b border-[#2e3039] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 items-center mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3f424e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3f424e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3f424e]" />
          </div>
          <span className="text-[#f4f4f5] font-semibold text-[11px] tracking-wide">
            AUDIT STUDIO
          </span>
          <span className="text-zinc-500">•</span>
          <span className="text-teal-400 text-[11px]">IMMUTABLE REVISION</span>
        </div>

        {/* Skill Selector Tabs */}
        <div className="flex items-center gap-1 bg-[#18191e] p-1 rounded-lg border border-[#2e3039]">
          {FEATURED_SKILLS.map((sk, idx) => (
            <button
              key={sk.id}
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                activeTab === idx
                  ? 'bg-teal-500 text-[#121316] font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-[#f4f4f5]'
              }`}
            >
              {sk.slug}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Body: Asymmetric Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Col: Skill Telemetry Card (5 cols) */}
        <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-[#2e3039] bg-[#18191e]/60 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-teal-400 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                {currentSkill.category}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Score: {currentSkill.score}/100
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight text-[#f4f4f5]">
                {currentSkill.name}
              </h3>
              <p className="font-mono text-xs text-zinc-400">
                v{currentSkill.version} • {currentSkill.license}
              </p>
            </div>

            {/* SHA-256 Digest Box */}
            <div className="p-3 rounded-xl bg-[#121316] border border-[#2e3039] space-y-1 font-mono text-xs">
              <span className="text-zinc-500 text-[10px] block uppercase tracking-wider">
                Cryptographic Integrity
              </span>
              <p className="text-zinc-300 truncate text-[11px]">
                SHA-256: {currentSkill.sha256}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-4 border-t border-[#2e3039]">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121316] border border-[#2e3039] text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-300 truncate">
                <Terminal className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate">{currentSkill.cliCommand}</span>
              </div>
              <button
                onClick={handleCopy}
                className="ml-2 px-2.5 py-1 rounded bg-[#262830] hover:bg-[#2e3039] text-zinc-200 text-xs flex items-center gap-1 transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-zinc-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <Link
              href={`/skills/${currentSkill.slug}`}
              className="w-full py-2.5 px-4 rounded-xl bg-[#262830] hover:bg-[#2e3039] text-[#f4f4f5] text-xs font-semibold flex items-center justify-center gap-2 border border-[#2e3039] transition-all hover:border-teal-500/50"
            >
              <span>Inspect Full Audit & SKILL.md</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
            </Link>
          </div>
        </div>

        {/* Right Col: Live Interactive Terminal (7 cols) */}
        <div className="lg:col-span-7 p-6 bg-[#121316] flex flex-col justify-between font-mono text-xs space-y-4">
          <div className="flex items-center justify-between text-zinc-500 text-[11px] pb-3 border-b border-[#2e3039]">
            <span className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-teal-400" />
              STATIC AST SECURITY SCAN LOGS
            </span>
            <span className="text-emerald-400">PASS (0 VULNERABILITIES)</span>
          </div>

          <div className="space-y-2 py-2 overflow-x-auto text-[11px] leading-relaxed">
            {currentSkill.terminalLog.map((line, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-zinc-600 select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={
                    line.includes('PASS') || line.includes('verified')
                      ? 'text-emerald-400'
                      : line.includes('[scanner]') || line.includes('[stream]') || line.includes('[daemon]')
                      ? 'text-teal-300'
                      : 'text-zinc-300'
                  }
                >
                  {line}
                </span>
              </div>
            ))}
          </div>

          {/* Terminal Footer */}
          <div className="pt-3 border-t border-[#2e3039] flex items-center justify-between text-[11px] text-zinc-500">
            <span>NVIDIA SkillSpector Ruleset v1.2.0</span>
            <span className="text-teal-400 flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" />
              Ready for Agent Ingestion
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

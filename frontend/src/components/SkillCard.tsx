'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  Star,
  Terminal,
  Check,
  Copy,
  User,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export interface SkillItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  publisher?: {
    id: string;
    displayName: string;
    email: string;
  };
  versions?: Array<{
    version: string;
    license?: string;
    securityAssessment?: {
      status: string;
      score: number | null;
    } | null;
    qualityAssessment?: {
      score: number | null;
    } | null;
  }>;
  _count?: {
    reviews: number;
    votes: number;
  };
}

export function SkillCard({ skill }: { skill: SkillItem }) {
  const [copied, setCopied] = useState(false);
  const latestVersion = skill.versions?.[0];
  const versionStr = latestVersion?.version || '1.0.0';
  const secStatus = latestVersion?.securityAssessment?.status || 'NOT_SCANNED';
  const secScore = latestVersion?.securityAssessment?.score;
  const reviewsCount = skill._count?.reviews || 0;
  const votesCount = skill._count?.votes || 0;
  const installCmd = `agy skill add ${skill.slug}@${versionStr}`;

  const handleCopyInstall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex flex-col justify-between p-5 rounded-xl bg-[#18191e] border border-[#2e3039] hover:border-teal-500/40 hover:bg-[#1a1c22] transition-all duration-200">
      <div className="space-y-3">
        {/* Top Meta Line: Package Name & Version Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <Link
              href={`/skills/${skill.slug}`}
              className="text-base font-bold text-[#f4f4f5] group-hover:text-teal-400 transition-colors tracking-tight flex items-center gap-1.5"
            >
              <span>{skill.name}</span>
            </Link>
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
              <span className="text-teal-400/90 font-medium">{skill.slug}</span>
              <span className="text-zinc-600">•</span>
              <span className="px-1.5 py-0.2 rounded bg-[#262830] text-[#f4f4f5]">
                v{versionStr}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="uppercase text-zinc-500">
                {latestVersion?.license || 'MIT'}
              </span>
            </div>
          </div>

          {/* Security Status Pill */}
          {secStatus === 'CLEAN' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-mono font-medium shrink-0">
              <ShieldCheck className="w-3 h-3" />
              {secScore !== null ? `${secScore}/100 CLEAN` : 'CLEAN'}
            </span>
          ) : secStatus === 'FINDINGS_DETECTED' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-mono font-medium shrink-0">
              <AlertTriangle className="w-3 h-3" />
              {secScore !== null ? `${secScore}/100 Risk` : 'FINDINGS'}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-[#262830] text-zinc-400 text-[11px] font-mono shrink-0">
              Unscanned
            </span>
          )}
        </div>

        {/* Package Description */}
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {skill.description}
        </p>

        {/* npmjs-Style Inline Install Snippet */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#121316] border border-[#2e3039] font-mono text-[11px]">
          <div className="flex items-center gap-2 text-zinc-300 truncate mr-2">
            <Terminal className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="truncate">{installCmd}</span>
          </div>
          <button
            onClick={handleCopyInstall}
            className="p-1.5 rounded bg-[#262830] hover:bg-[#2e3039] text-zinc-300 hover:text-white transition-colors shrink-0"
            title="Copy install command"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3 text-zinc-400" />
            )}
          </button>
        </div>
      </div>

      {/* Footer Meta Row: Publisher, Stars, Link */}
      <div className="pt-3 mt-3 border-t border-[#2e3039] flex items-center justify-between text-[11px] text-zinc-400 font-mono">
        <div className="flex items-center gap-2 truncate">
          <span className="flex items-center gap-1 text-zinc-300 truncate">
            <User className="w-3 h-3 text-zinc-500 shrink-0" />
            {skill.publisher?.displayName || 'Unknown Author'}
          </span>
          <span className="text-zinc-600">•</span>
          <span className="flex items-center gap-1 text-zinc-400">
            <Star className="w-3 h-3 text-amber-400/80 fill-amber-400/20" />
            {reviewsCount}
          </span>
        </div>

        <Link
          href={`/skills/${skill.slug}`}
          className="text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1 shrink-0 ml-2 group/link"
        >
          <span>Inspect</span>
          <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

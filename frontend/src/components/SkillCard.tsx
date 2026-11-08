import Link from 'next/link';
import { ShieldCheck, AlertTriangle, Star, ArrowUpRight, User, Terminal } from 'lucide-react';

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
  const latestVersion = skill.versions?.[0];
  const secStatus = latestVersion?.securityAssessment?.status || 'NOT_SCANNED';
  const secScore = latestVersion?.securityAssessment?.score;
  const reviewsCount = skill._count?.reviews || 0;
  const votesCount = skill._count?.votes || 0;

  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/70 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5"
    >
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 text-xs">
          {/* Version & Publisher */}
          <div className="flex items-center gap-1.5 font-mono text-zinc-400">
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/60 text-zinc-300 text-[11px]">
              v{latestVersion?.version || '1.0.0'}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="flex items-center gap-1 text-[11px] truncate max-w-[120px]">
              <User className="w-3 h-3 text-zinc-500" />
              {skill.publisher?.displayName || 'Unknown'}
            </span>
          </div>

          {/* Security Badge (Color Theory: Emerald for Clean, Rose for Findings) */}
          {secStatus === 'CLEAN' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium font-mono">
              <ShieldCheck className="w-3 h-3" />
              {secScore !== null ? `${secScore}/100` : 'CLEAN'}
            </span>
          ) : secStatus === 'FINDINGS_DETECTED' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-medium font-mono">
              <AlertTriangle className="w-3 h-3" />
              {secScore !== null ? `${secScore}/100 Risk` : 'FINDINGS'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[11px] font-mono">
              Unscanned
            </span>
          )}
        </div>

        {/* Skill Title & Slug */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors tracking-tight text-base">
              {skill.name}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="font-mono text-[11px] text-zinc-400">/{skill.slug}</p>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {skill.description}
        </p>
      </div>

      {/* Footer Metrics */}
      <div className="pt-4 mt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-zinc-400">
            <Star className="w-3.5 h-3.5 text-amber-400/80 fill-amber-400/20" />
            {reviewsCount} {reviewsCount === 1 ? 'review' : 'reviews'}
          </span>
          <span className="text-zinc-400">•</span>
          <span className="text-zinc-400">
            ▲ {votesCount}
          </span>
        </div>

        <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
          {latestVersion?.license || 'MIT'}
        </span>
      </div>
    </Link>
  );
}


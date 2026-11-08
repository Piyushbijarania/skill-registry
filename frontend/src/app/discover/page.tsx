'use client';

import { useState } from 'react';
import Link from 'next/link';
import { discoveryApi } from '@/lib/api';
import {
  Sparkles,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Check,
  Copy,
  Layers,
  Cpu,
} from 'lucide-react';

interface Recommendation {
  skillId: string;
  slug: string;
  name: string;
  confidenceScore: number;
  reason: string;
  potentialConflicts?: string[];
}

interface DiscoveryData {
  parsedIntent: {
    primaryGoal: string;
    identifiedTechnologies: string[];
    taskCategories: string[];
  };
  recommendations: Recommendation[];
  explanation: string;
  providerUsed: string;
}

export default function DiscoverPage() {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiscoveryData | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const samplePrompts = [
    'Building Next.js 15 fullstack app with Postgres and need architecture & testing help.',
    'Need automated security tool to scan bash commands and find secret leaks.',
    'Python FastAPI backend development with clean service repository patterns.',
  ];

  const handleDiscover = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || prompt.trim().length < 5) {
      setError('Please provide at least 5 characters describing your task.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await discoveryApi.discover(prompt.trim());
      setResult(res.data);
    } catch (err: any) {
      setError(err.message || 'Discovery engine unavailable.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyInstallCommand = (slug: string) => {
    navigator.clipboard.writeText(`agy skill add ${slug}@1.0.0`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="space-y-10 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Grounded AI Retrieval • Zero Hallucinations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          AI Skill Discovery
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Describe your project stack or goal in natural language. Our grounded discovery engine
          identifies technologies, matches verified registry records, and explains recommendations.
        </p>
      </div>

      {/* Interactive Prompt Box */}
      <form
        onSubmit={handleDiscover}
        className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-2xl backdrop-blur-xl space-y-4"
      >
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
            <span>What are you building?</span>
            <span className="text-zinc-400 text-[11px] font-mono">{prompt.length}/1000 chars</span>
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. I am building a Next.js 15 SaaS application with PostgreSQL and need help with authentication, testing, and production deployment..."
            className="w-full p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
          />
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-zinc-400 font-mono">Try:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPrompt(p)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors truncate max-w-[280px]"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 hover:scale-102"
          >
            {isAnalyzing ? (
              <>
                <Cpu className="w-4 h-4 animate-spin" />
                Analyzing Registry...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Discover Skills
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Analysis Breakdown Header */}
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-zinc-400 font-mono">PARSED GOAL & TECHNOLOGIES</span>
              <span className="text-cyan-400 font-mono text-[11px]">
                Engine: {result.providerUsed}
              </span>
            </div>

            <p className="text-sm text-zinc-200 font-medium">{result.explanation}</p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {result.parsedIntent.identifiedTechnologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono"
                >
                  {tech}
                </span>
              ))}
              {result.parsedIntent.taskCategories.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700/60 text-zinc-300 text-xs font-mono"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Recommendations List */}
          <div className="space-y-4">
            <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-wider">
              Recommended Skills ({result.recommendations.length})
            </h2>

            {result.recommendations.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-zinc-900/20 border border-zinc-800 p-6 space-y-2">
                <p className="text-sm text-zinc-300 font-medium">No matching skills found</p>
                <p className="text-xs text-zinc-400">
                  Try broadening your prompt or checking the public catalog directly.
                </p>
              </div>
            ) : (
              result.recommendations.map((rec) => (
                <div
                  key={rec.skillId}
                  className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all space-y-4"
                >
                  {/* Top Bar: Match Score & Name */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/skills/${rec.slug}`}
                          className="text-base font-bold text-white hover:text-cyan-300 transition-colors"
                        >
                          {rec.name}
                        </Link>
                      </div>
                      <p className="text-xs font-mono text-zinc-400">/{rec.slug}</p>
                    </div>

                    <div className="self-start sm:self-center">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-sky-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
                        {Math.round(rec.confidenceScore * 100)}% Match
                      </span>
                    </div>
                  </div>

                  {/* Why Recommended Explanation */}
                  <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/60 text-xs text-zinc-300 leading-relaxed">
                    <span className="text-cyan-400 font-semibold font-mono mr-1.5">
                      Why Recommended:
                    </span>
                    {rec.reason}
                  </div>

                  {/* Warnings / Limitations */}
                  {rec.potentialConflicts && rec.potentialConflicts.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{rec.potentialConflicts.join(' ')}</span>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800/60 text-xs font-mono">
                    <button
                      onClick={() => copyInstallCommand(rec.slug)}
                      className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1.5 text-xs transition-colors"
                    >
                      {copiedSlug === rec.slug ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied install command!</span>
                        </>
                      ) : (
                        <>
                          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                          <span>agy skill add {rec.slug}@1.0.0</span>
                          <Copy className="w-3 h-3 text-zinc-400 ml-1" />
                        </>
                      )}
                    </button>

                    <Link
                      href={`/skills/${rec.slug}`}
                      className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      View Details & Security Audit
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}


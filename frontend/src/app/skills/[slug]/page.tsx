'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { skillsApi, communityApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  AlertTriangle,
  Star,
  Terminal,
  Check,
  Copy,
  User,
  Calendar,
  Layers,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  MessageSquare,
  FileText,
  GitBranch,
  Lock,
  Code2,
} from 'lucide-react';

export default function SkillDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();

  const [skill, setSkill] = useState<any | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Active view tab: 'readme' | 'security' | 'versions' | 'reviews'
  const [activeTab, setActiveTab] = useState<'readme' | 'security' | 'versions' | 'reviews'>('readme');

  // Community review state
  const [reviews, setReviews] = useState<any[]>([]);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Voting state
  const [userVote, setUserVote] = useState<number | null>(null);
  const [netVotes, setNetVotes] = useState<number>(0);

  const fetchSkillDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await skillsApi.getBySlug(slug);
      const data = res.data;
      setSkill(data);
      if (data.versions && data.versions.length > 0) {
        setSelectedVersion(data.versions[0]);
      }
      setReviews(data.reviews || []);
      setNetVotes(data._count?.votes || 0);
    } catch (err: any) {
      console.error('Failed to load skill details:', err);
      setError(err.message || 'Skill not found or server unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchSkillDetails();
    }
  }, [slug]);

  const copyInstall = () => {
    const ver = selectedVersion?.version || '1.0.0';
    navigator.clipboard.writeText(`agy skill add ${slug}@${ver}`);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const copySha256 = () => {
    if (selectedVersion?.contentHash) {
      navigator.clipboard.writeText(selectedVersion.contentHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleVote = async (value: number) => {
    if (!user) {
      alert('Please sign in to vote on skills.');
      return;
    }
    try {
      const res = await communityApi.vote(slug, value);
      setUserVote(res.data.userVote);
      setNetVotes(res.data.netScore);
    } catch (err: any) {
      alert(err.message || 'Failed to submit vote');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to leave a review.');
      return;
    }
    setIsSubmittingReview(true);
    setReviewError(null);

    try {
      const res = await communityApi.submitReview(slug, {
        rating: ratingInput,
        comment: commentInput.trim() || undefined,
      });

      setReviews((prev) => [res.data.review, ...prev.filter((r) => r.userId !== user.id)]);
      setCommentInput('');
      alert('Review submitted successfully!');
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-6 bg-[#262830] rounded w-1/4" />
        <div className="h-10 bg-[#262830] rounded w-2/3" />
        <div className="h-64 bg-[#18191e] rounded-2xl" />
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h1 className="text-xl font-bold text-white">Package Not Found</h1>
        <p className="text-xs text-zinc-400">{error || 'This skill does not exist or has been removed.'}</p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 pt-2 font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const secAssessment = selectedVersion?.securityAssessment;
  const secStatus = secAssessment?.status || 'NOT_SCANNED';
  const secScore = secAssessment?.score;
  const findings: any[] = secAssessment?.findings
    ? typeof secAssessment.findings === 'string'
      ? JSON.parse(secAssessment.findings)
      : secAssessment.findings
    : [];

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
        <Link href="/catalog" className="hover:text-teal-400 transition-colors">
          packages
        </Link>
        <span>/</span>
        <span className="text-teal-400 font-semibold">{skill.slug}</span>
      </div>

      {/* npmjs-Style Package Top Banner */}
      <div className="p-6 rounded-2xl bg-[#18191e] border border-[#2e3039] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="text-lg sm:text-2xl font-bold text-[#f4f4f5] font-sans">
                {skill.name}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#262830] text-[#f4f4f5] text-[11px] font-medium border border-[#2e3039]">
                v{selectedVersion?.version || '1.0.0'}
              </span>
              <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 text-[11px] font-medium border border-teal-500/20">
                Public
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400 text-[11px]">
                Published {new Date(skill.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
              {skill.description}
            </p>
          </div>

          {/* Quick Vote Score */}
          <div className="flex items-center gap-1.5 self-start p-1 rounded-lg bg-[#121316] border border-[#2e3039] text-xs font-mono shrink-0">
            <button
              onClick={() => handleVote(1)}
              className={`p-1.5 rounded transition-colors ${
                userVote === 1
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-zinc-400 hover:text-emerald-400'
              }`}
              title="Upvote skill"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-bold text-[#f4f4f5]">{netVotes}</span>
            <button
              onClick={() => handleVote(-1)}
              className={`p-1.5 rounded transition-colors ${
                userVote === -1
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'text-zinc-400 hover:text-rose-400'
              }`}
              title="Downvote skill"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* npmjs-Style Tabs Bar */}
        <div className="flex items-center gap-1 border-t border-[#2e3039] pt-3 text-xs font-mono">
          <button
            onClick={() => setActiveTab('readme')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'readme'
                ? 'bg-teal-500 text-[#121316] font-bold'
                : 'text-zinc-400 hover:text-[#f4f4f5] hover:bg-[#262830]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Readme (SKILL.md)</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-teal-500 text-[#121316] font-bold'
                : 'text-zinc-400 hover:text-[#f4f4f5] hover:bg-[#262830]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security Audit</span>
            {secScore !== null && secScore !== undefined && (
              <span className="px-1 py-0.2 rounded text-[10px] bg-[#121316] text-[#f4f4f5]">
                {secScore}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('versions')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'versions'
                ? 'bg-teal-500 text-[#121316] font-bold'
                : 'text-zinc-400 hover:text-[#f4f4f5] hover:bg-[#262830]'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Versions ({skill.versions?.length || 1})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'bg-teal-500 text-[#121316] font-bold'
                : 'text-zinc-400 hover:text-[#f4f4f5] hover:bg-[#262830]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Reviews ({reviews.length})</span>
          </button>
        </div>
      </div>

      {/* npmjs-Style 2-Column Split: Main Content (8 cols) + Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tab Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tab 1: Readme (SKILL.md) */}
          {activeTab === 'readme' && (
            <div className="p-6 rounded-2xl bg-[#18191e] border border-[#2e3039] space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-[#2e3039] pb-3">
                <span className="flex items-center gap-1.5 text-teal-400">
                  <FileText className="w-3.5 h-3.5" />
                  SPECIFICATION: SKILL.md
                </span>
                <span className="text-[11px] text-zinc-500">Standard Antigravity Format</span>
              </div>
              <div className="p-4 rounded-xl bg-[#121316] border border-[#2e3039] font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {selectedVersion?.readmeContent || 'No instructions provided for this version.'}
              </div>
            </div>
          )}

          {/* Tab 2: Security Audit Report */}
          {activeTab === 'security' && (
            <div className="p-6 rounded-2xl bg-[#18191e] border border-[#2e3039] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2e3039] pb-4">
                <div>
                  <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider block">
                    NVIDIA SKILLSPECTOR ENGINE
                  </span>
                  <h3 className="text-base font-bold text-[#f4f4f5]">
                    AST Static Analysis & Sandboxing Report
                  </h3>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-[#121316] border border-[#2e3039] font-mono text-xs">
                  <span className="text-zinc-400">Score:</span>
                  <span
                    className={`font-bold text-sm ${
                      secScore && secScore >= 80
                        ? 'text-teal-400'
                        : secScore && secScore >= 50
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {secScore !== null && secScore !== undefined ? `${secScore}/100` : 'Unassessed'}
                  </span>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 rounded-xl bg-[#121316] border border-[#2e3039] text-[11px] font-mono text-zinc-400">
                Static analysis inspects AST execution paths for destructive commands (rm -rf, mkfs), secret leaks, and reverse shells.
              </div>

              {/* Findings */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Findings ({findings.length})
                </h4>

                {findings.length === 0 ? (
                  <div className="p-6 rounded-xl bg-teal-500/5 border border-teal-500/20 text-center space-y-2">
                    <ShieldCheck className="w-8 h-8 text-teal-400 mx-auto" />
                    <h5 className="text-sm font-semibold text-teal-300">Clean Audit — 0 Threats Detected</h5>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto">
                      No dangerous shell commands or credential exfiltration attempts found in this version.
                    </p>
                  </div>
                ) : (
                  findings.map((f, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-[#121316] border border-[#2e3039] space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          {f.severity}
                        </span>
                        {f.line && (
                          <span className="text-xs font-mono text-zinc-500">Line {f.line}</span>
                        )}
                      </div>
                      <h5 className="text-sm font-semibold text-[#f4f4f5]">{f.title}</h5>
                      <p className="text-xs text-zinc-300">{f.description}</p>
                      {f.remediation && (
                        <div className="p-2.5 rounded-lg bg-[#18191e] border border-[#2e3039] text-xs text-zinc-400">
                          <span className="text-teal-400 font-semibold block">Remediation:</span>
                          <p>{f.remediation}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Versions List */}
          {activeTab === 'versions' && (
            <div className="p-6 rounded-2xl bg-[#18191e] border border-[#2e3039] space-y-4">
              <h3 className="text-sm font-bold text-[#f4f4f5] font-mono uppercase tracking-wider">
                Release History & Provenance
              </h3>
              <div className="space-y-2">
                {skill.versions?.map((v: any) => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVersion(v)}
                    className={`p-3.5 rounded-xl border font-mono text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      selectedVersion?.id === v.id
                        ? 'bg-[#121316] border-teal-500'
                        : 'bg-[#121316]/60 border-[#2e3039] hover:border-zinc-500'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#f4f4f5]">v{v.version}</span>
                        {selectedVersion?.id === v.id && (
                          <span className="px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-400 text-[10px]">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate max-w-sm">
                        SHA-256: {v.contentHash || 'No hash recorded'}
                      </p>
                    </div>
                    <span className="text-zinc-400 text-[11px]">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Form */}
              <form
                onSubmit={handleReviewSubmit}
                className="p-5 rounded-2xl bg-[#18191e] border border-[#2e3039] space-y-4"
              >
                <h4 className="text-sm font-semibold text-[#f4f4f5] flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  Leave a Rating & Review
                </h4>

                {reviewError && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                    {reviewError}
                  </div>
                )}

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingInput(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= ratingInput
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Share your experience using this skill in an AI agent..."
                  className="w-full p-3 rounded-xl bg-[#121316] border border-[#2e3039] text-xs text-[#f4f4f5] placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#121316] font-semibold text-xs shadow-md shadow-teal-500/20 transition-all disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center font-mono">
                    No reviews yet. Be the first to review this skill!
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl bg-[#18191e] border border-[#2e3039] space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#f4f4f5]">
                          {rev.user?.displayName || 'Community Developer'}
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {rev.comment && <p className="text-xs text-zinc-300">{rev.comment}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: npmjs-Style Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Install Box (Exactly like npmjs Install command box) */}
          <div className="p-5 rounded-2xl bg-[#18191e] border border-[#2e3039] space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-teal-400 block font-semibold">
              Install
            </span>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#121316] border border-[#2e3039] font-mono text-xs">
              <div className="flex items-center gap-2 text-zinc-300 truncate mr-2">
                <Terminal className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="truncate">agy skill add {skill.slug}@{selectedVersion?.version || '1.0.0'}</span>
              </div>
              <button
                onClick={copyInstall}
                className="p-1.5 rounded-lg bg-[#262830] hover:bg-[#2e3039] text-[#f4f4f5] transition-colors shrink-0"
                title="Copy install command"
              >
                {copiedInstall ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                )}
              </button>
            </div>
          </div>

          {/* 2. Repository & Source */}
          <div className="p-5 rounded-2xl bg-[#18191e] border border-[#2e3039] space-y-3 font-mono text-xs">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 block">
              Repository
            </span>
            <div className="space-y-2">
              <a
                href="https://github.com/Piyushbijarania/skill-registry"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-teal-400 hover:text-teal-300 hover:underline"
              >
                <span>github.com/{skill.slug}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="flex items-center justify-between text-zinc-400 text-[11px] pt-1 border-t border-[#2e3039]">
                <span>Source Type</span>
                <span className="text-[#f4f4f5] uppercase">{skill.sourceType || 'GITHUB'}</span>
              </div>
            </div>
          </div>

          {/* 3. Metadata & License */}
          <div className="p-5 rounded-2xl bg-[#18191e] border border-[#2e3039] space-y-3 font-mono text-xs">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 block">
              Package Metadata
            </span>
            <div className="space-y-2 text-zinc-400 text-[11px]">
              <div className="flex items-center justify-between">
                <span>Version</span>
                <span className="text-[#f4f4f5] font-bold">
                  {selectedVersion?.version || '1.0.0'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>License</span>
                <span className="text-teal-400 font-semibold uppercase">
                  {selectedVersion?.license || 'Apache-2.0'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Versions</span>
                <span className="text-[#f4f4f5]">
                  {skill.versions?.length || 1}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Security Assessment</span>
                <span className="text-teal-400 font-bold">
                  {secScore ? `${secScore}/100` : 'CLEAN'}
                </span>
              </div>
            </div>

            {/* SHA-256 Digest */}
            {selectedVersion?.contentHash && (
              <div className="pt-2 border-t border-[#2e3039] space-y-1">
                <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase">
                  <span>SHA-256 Provenance</span>
                  <button
                    onClick={copySha256}
                    className="text-teal-400 hover:underline flex items-center gap-1"
                  >
                    {copiedHash ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-400 truncate bg-[#121316] p-2 rounded-lg border border-[#2e3039]">
                  {selectedVersion.contentHash}
                </p>
              </div>
            )}
          </div>

          {/* 4. Publisher Card */}
          <div className="p-5 rounded-2xl bg-[#18191e] border border-[#2e3039] space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">
              Publisher
            </span>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#f4f4f5]">
                  {skill.publisher?.displayName || 'Registered Publisher'}
                </p>
                <p className="text-[11px] text-zinc-500 font-mono">
                  {skill.publisher?.email || 'publisher@registry.local'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

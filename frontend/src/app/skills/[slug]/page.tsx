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
  ChevronDown,
  Layers,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Lock,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export default function SkillDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();

  const [skill, setSkill] = useState<any | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Active view tab: 'instructions' | 'security' | 'reviews'
  const [activeTab, setActiveTab] = useState<'instructions' | 'security' | 'reviews'>('instructions');

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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      // Update reviews list in UI
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
      <div className="py-20 space-y-6 max-w-4xl mx-auto animate-pulse">
        <div className="h-6 bg-zinc-800 rounded w-1/4" />
        <div className="h-10 bg-zinc-800 rounded w-2/3" />
        <div className="h-40 bg-zinc-900 rounded-2xl" />
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h1 className="text-xl font-bold text-white">Skill Not Found</h1>
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
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Back Link */}
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 font-mono transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
      </Link>

      {/* Main Skill Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#18191e]/80 border border-[#2e3039] shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#262830] border border-[#2e3039] font-mono text-[#f4f4f5] text-xs font-medium">
                {selectedVersion?.version ? `v${selectedVersion.version}` : 'v1.0.0'}
              </span>

              {secStatus === 'CLEAN' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {secScore !== null ? `${secScore}/100 CLEAN` : 'CLEAN'}
                </span>
              ) : secStatus === 'FINDINGS_DETECTED' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {secScore !== null ? `${secScore}/100 THREATS` : 'FINDINGS'}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-[#262830] text-zinc-400 text-xs font-mono">
                  Unscanned
                </span>
              )}

              <span className="text-xs text-zinc-400 font-mono uppercase">
                {selectedVersion?.license || 'MIT License'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f4f4f5]">
              {skill.name}
            </h1>
            <p className="font-mono text-xs text-zinc-400">/{skill.slug}</p>
          </div>

          {/* Voting Box */}
          <div className="flex items-center gap-1.5 self-start p-1.5 rounded-xl bg-[#121316] border border-[#2e3039] text-xs font-mono">
            <button
              onClick={() => handleVote(1)}
              className={`p-1.5 rounded-lg transition-colors ${
                userVote === 1
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900'
              }`}
              title="Upvote skill"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-zinc-200">{netVotes}</span>
            <button
              onClick={() => handleVote(-1)}
              className={`p-1.5 rounded-lg transition-colors ${
                userVote === -1
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'text-zinc-400 hover:text-rose-400 hover:bg-zinc-900'
              }`}
              title="Downvote skill"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
          {skill.description}
        </p>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-800/80 text-xs">
          <div>
            <span className="text-zinc-400 block font-mono text-[11px]">Publisher</span>
            <span className="font-medium text-zinc-200">{skill.publisher?.displayName || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-zinc-400 block font-mono text-[11px]">Source</span>
            <span className="font-medium text-zinc-200 capitalize">{skill.sourceType}</span>
          </div>
          <div>
            <span className="text-zinc-400 block font-mono text-[11px]">Created</span>
            <span className="font-medium text-zinc-200">
              {new Date(skill.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-zinc-400 block font-mono text-[11px]">Community</span>
            <span className="font-medium text-zinc-200 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>

        {/* Terminal Install Snippet */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#121316] border border-[#2e3039] font-mono text-xs">
          <div className="flex items-center gap-2 text-zinc-300 overflow-x-auto">
            <Terminal className="w-4 h-4 text-teal-400 shrink-0" />
            <span>agy skill add {skill.slug}@{selectedVersion?.version || '1.0.0'}</span>
          </div>
          <button
            onClick={copyInstall}
            className="px-2.5 py-1 rounded bg-[#262830] hover:bg-[#2e3039] text-[#f4f4f5] text-xs flex items-center gap-1 transition-colors shrink-0"
          >
            {copied ? (
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
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#2e3039] font-medium text-sm">
        <button
          onClick={() => setActiveTab('instructions')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'instructions'
              ? 'border-teal-400 text-[#f4f4f5] font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Instructions (SKILL.md)
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-teal-400 text-[#f4f4f5] font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Security Audit Report
          {findings.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'reviews'
              ? 'border-teal-400 text-[#f4f4f5] font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Reviews ({reviews.length})
        </button>
      </div>

      {/* Tab 1: Instructions / SKILL.md */}
      {activeTab === 'instructions' && (
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-800/80 pb-3">
            <span>SPECIFICATION FORMAT: SKILL.md</span>
            {selectedVersion?.contentHash && (
              <span className="text-[11px] text-zinc-400 truncate max-w-[280px]">
                SHA-256: {selectedVersion.contentHash}
              </span>
            )}
          </div>
          <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {selectedVersion?.readmeContent || 'No instructions provided for this version.'}
          </pre>
        </div>
      )}

      {/* Tab 2: NVIDIA SkillSpector Security Report */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Scanner Header Box */}
          <div className="p-6 rounded-2xl bg-[#18191e]/60 border border-[#2e3039] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-teal-400 block">STATIC SECURITY PIPELINE</span>
                <h3 className="text-lg font-bold text-[#f4f4f5] flex items-center gap-2">
                  Scanner: {secAssessment?.scannerName || 'NVIDIA SkillSpector'} v{secAssessment?.scannerVersion || '1.2.0'}
                </h3>
                <p className="text-xs text-zinc-400 max-w-xl pt-1">
                  Static analysis auditing dangerous shell commands, credential exposure, and prompt injections.
                </p>
              </div>

              {/* Big Score Gauge */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#121316] border border-[#2e3039] shrink-0">
                <div className="text-right">
                  <span className="text-xs font-mono text-zinc-400 block">Security Score</span>
                  <span
                    className={`text-2xl font-bold font-mono ${
                      secScore && secScore >= 80
                        ? 'text-emerald-400'
                        : secScore && secScore >= 50
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {secScore !== null && secScore !== undefined ? `${secScore}/100` : 'Unassessed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Scanner Limitations Notice (SRS FR-006) */}
            <div className="p-3 rounded-xl bg-[#121316] border border-[#2e3039] text-xs text-zinc-400 font-mono">
              ⚠️ Note: A clean scan means no known threats were detected by configured static checks; it does not constitute a guarantee of complete runtime immunity.
            </div>
          </div>

          {/* Findings List */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Detected Findings ({findings.length})
            </h4>

            {findings.length === 0 ? (
              <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <h5 className="text-sm font-semibold text-emerald-300">Clean Audit — Zero Threats Detected</h5>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  No destructive file commands, reverse shells, or sensitive credential exfiltration patterns were detected in this version.
                </p>
              </div>
            ) : (
              findings.map((f, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-[#18191e]/70 border border-[#2e3039] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                        f.severity === 'CRITICAL'
                          ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                          : f.severity === 'HIGH'
                          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                          : 'bg-[#262830] text-zinc-300'
                      }`}
                    >
                      {f.severity}
                    </span>
                    {f.line && (
                      <span className="text-xs font-mono text-zinc-400">Line {f.line}</span>
                    )}
                  </div>

                  <h5 className="text-sm font-semibold text-[#f4f4f5]">{f.title}</h5>
                  <p className="text-xs text-zinc-300">{f.description}</p>

                  {f.matchedPattern && (
                    <pre className="p-2.5 rounded-lg bg-[#121316] font-mono text-xs text-rose-300 overflow-x-auto">
                      {f.matchedPattern}
                    </pre>
                  )}

                  <div className="p-3 rounded-xl bg-[#121316] border border-[#2e3039] text-xs text-zinc-400 space-y-1">
                    <span className="text-teal-400 font-mono font-semibold block">
                      Recommended Remediation:
                    </span>
                    <p>{f.remediation}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Reviews & Community Ratings */}
      {activeTab === 'reviews' && (
        <div className="space-y-8">
          {/* Submit Review Box */}
          <form
            onSubmit={handleReviewSubmit}
            className="p-5 rounded-2xl bg-[#18191e]/80 border border-[#2e3039] space-y-4"
          >
            <h4 className="text-sm font-semibold text-[#f4f4f5] flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Write a Community Review
            </h4>

            {reviewError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {reviewError}
              </div>
            )}

            {/* Star Selector */}
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-mono">Rating (1 to 5 Stars)</label>
              <div className="flex gap-1.5">
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
            </div>

            {/* Comment Textarea */}
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-mono">Review Comments</label>
              <textarea
                rows={2}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Share your experience using this skill in an AI agent..."
                className="w-full p-3 rounded-xl bg-[#121316] border border-[#2e3039] text-xs text-[#f4f4f5] placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all resize-none"
              />
            </div>

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

          {/* Existing Reviews List */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              All Reviews ({reviews.length})
            </h4>

            {reviews.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">
                No reviews yet. Be the first to review this skill!
              </p>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-200">
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
  );
}


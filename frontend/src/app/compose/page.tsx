'use client';

import { useState, useEffect } from 'react';
import { skillsApi, compositionApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  Layers,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Download,
  Check,
  Plus,
  ArrowRight,
  FileCode,
  Copy,
  Info,
} from 'lucide-react';

export default function ComposePage() {
  const { user } = useAuth();

  // Mode: 'compose' (merge 2+ skills) | 'generate' (from prompt)
  const [mode, setMode] = useState<'compose' | 'generate'>('compose');

  // Available skills to choose from
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);

  // Form states for Composition
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedVersionIds, setSelectedVersionIds] = useState<string[]>([]);
  const [customInstructions, setCustomInstructions] = useState('');

  // Form states for Prompt Generation
  const [genName, setGenName] = useState('');
  const [prompt, setPrompt] = useState('');

  // Execution states
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const res = await skillsApi.list({ limit: 50 });
        setAvailableSkills(res.data);
      } catch (err: any) {
        console.error('Failed to fetch candidate skills:', err);
      } finally {
        setIsLoadingSkills(false);
      }
    };
    loadSkills();
  }, []);

  const toggleSelectSkill = (versionId: string) => {
    setSelectedVersionIds((prev) =>
      prev.includes(versionId)
        ? prev.filter((id) => id !== versionId)
        : [...prev, versionId]
    );
  };

  const handleCompose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to compose and export custom skills.');
      return;
    }
    if (selectedVersionIds.length < 2) {
      setError('Please select at least 2 source skills to compose.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const res = await compositionApi.compose({
        name: name.trim(),
        description: description.trim(),
        sourceSkillVersionIds: selectedVersionIds,
        customInstructions: customInstructions.trim() || undefined,
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err.message || 'Composition process failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to generate skills.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const res = await compositionApi.generate({
        name: genName.trim(),
        prompt: prompt.trim(),
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err.message || 'Generation process failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSkillFile = () => {
    if (!result?.exportContent) return;
    const blob = new Blob([result.exportContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'SKILL.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copySkillContent = () => {
    if (!result?.exportContent) return;
    navigator.clipboard.writeText(result.exportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>Composition Engine • Provenance & License Tracking</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f4f4f5]">
          Skill Composer & Builder
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Combine existing audited skills into custom bundles or generate custom agent instructions.
          Preserves open-source license attribution and audits the output.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center">
        <div className="p-1 rounded-xl bg-[#18191e] border border-[#2e3039] flex gap-1">
          <button
            onClick={() => {
              setMode('compose');
              setResult(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'compose'
                ? 'bg-teal-500 text-[#121316] shadow-md shadow-teal-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Compose Multiple Skills
          </button>
          <button
            onClick={() => {
              setMode('generate');
              setResult(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'generate'
                ? 'bg-teal-500 text-[#121316] shadow-md shadow-teal-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Generate from Prompt
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Mode 1: Compose Existing Skills */}
      {mode === 'compose' && (
        <form onSubmit={handleCompose} className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#18191e]/80 border border-[#2e3039] space-y-4 shadow-xl backdrop-blur-xl">
            <h3 className="text-base font-bold text-[#f4f4f5] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 text-xs flex items-center justify-center font-mono">
                1
              </span>
              Select Building Blocks (Choose 2 or more skills)
            </h3>

            {isLoadingSkills ? (
              <div className="text-xs text-zinc-400 animate-pulse">Loading indexed skills...</div>
            ) : availableSkills.length === 0 ? (
              <div className="text-xs text-zinc-400">No skills available to compose yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                {availableSkills.map((sk) => {
                  const ver = sk.versions?.[0];
                  const isSelected = ver && selectedVersionIds.includes(ver.id);

                  return (
                    <div
                      key={sk.id}
                      onClick={() => ver && toggleSelectSkill(ver.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-teal-500/15 border-teal-500 text-[#f4f4f5]'
                          : 'bg-[#121316]/70 border border-[#2e3039] text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-[#f4f4f5]">{sk.name}</div>
                        <div className="font-mono text-[11px] text-zinc-400">
                          v{ver?.version || '1.0.0'} • {ver?.license || 'MIT'}
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-teal-500 border-teal-400 text-[#121316]'
                            : 'border-zinc-700 bg-zinc-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-[11px] text-zinc-400 font-mono">
              Selected: {selectedVersionIds.length} skills (minimum 2 required)
            </p>
          </div>

          {/* Bundle Metadata */}
          <div className="p-6 rounded-2xl bg-[#18191e]/80 border border-[#2e3039] space-y-4 shadow-xl backdrop-blur-xl">
            <h3 className="text-base font-bold text-[#f4f4f5] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 text-xs flex items-center justify-center font-mono">
                2
              </span>
              Bundle Metadata & Custom Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Composed Skill Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Next.js Secure Enterprise Stack"
                  className="w-full p-2.5 rounded-lg bg-[#121316] border border-[#2e3039] text-xs text-[#f4f4f5] placeholder:text-zinc-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Combines Next.js App Router patterns with NVIDIA SkillSpector security checks"
                  className="w-full p-2.5 rounded-lg bg-[#121316] border border-[#2e3039] text-xs text-[#f4f4f5] placeholder:text-zinc-600 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Custom Instructions & Overrides (Optional)
              </label>
              <textarea
                rows={3}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Specify any custom overrides, e.g. 'Always use strict TypeScript types and enforce Zod validation on API endpoints'..."
                className="w-full p-2.5 rounded-lg bg-[#121316] border border-[#2e3039] text-xs text-[#f4f4f5] placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isProcessing || selectedVersionIds.length < 2}
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#121316] font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50"
              >
                {isProcessing ? 'Composing & Auditing...' : 'Compose Skill Bundle'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Mode 2: Generate from Prompt */}
      {mode === 'generate' && (
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#18191e]/80 border border-[#2e3039] space-y-4 shadow-xl backdrop-blur-xl">
            <h3 className="text-base font-bold text-[#f4f4f5] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Describe Desired Capability
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Skill Name</label>
              <input
                type="text"
                required
                value={genName}
                onChange={(e) => setGenName(e.target.value)}
                placeholder="e.g. React Accessibility Enforcer"
                className="w-full p-2.5 rounded-lg bg-[#121316] border border-[#2e3039] text-xs text-[#f4f4f5] placeholder:text-zinc-600 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Prompt / Requirements</label>
              <textarea
                rows={4}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what the AI agent skill should do, what coding patterns it should enforce, and any specific unit test requirements..."
                className="w-full p-2.5 rounded-lg bg-[#121316] border border-[#2e3039] text-xs text-[#f4f4f5] placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isProcessing || !genName || !prompt}
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#121316] font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50"
              >
                {isProcessing ? 'Generating Skill...' : 'Generate Skill'}
                <Sparkles className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Result Inspection & Exporter Section */}
      {result && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="p-6 rounded-2xl bg-[#18191e]/80 border border-[#2e3039] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2e3039] pb-4">
              <div>
                <span className="text-xs font-mono text-teal-400 block">RESULT & PROVENANCE</span>
                <h3 className="text-xl font-bold text-[#f4f4f5]">
                  {result.generatedSkill?.name || 'Composed Skill'}
                </h3>
              </div>

              {/* Action Buttons: Download & Copy */}
              <div className="flex items-center gap-2">
                <button
                  onClick={copySkillContent}
                  className="px-3.5 py-2 rounded-xl bg-[#262830] hover:bg-[#2e3039] text-[#f4f4f5] text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={downloadSkillFile}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all hover:scale-102"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download SKILL.md
                </button>
              </div>
            </div>

            {/* Provenance & Security Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Provenance Box */}
              <div className="p-4 rounded-xl bg-[#121316] border border-[#2e3039] space-y-2 text-xs">
                <span className="text-teal-400 font-mono font-semibold block">
                  Provenance & License Attribution
                </span>
                <p className="text-zinc-300">
                  Combined Licenses:{' '}
                  <span className="font-mono text-[#f4f4f5] font-medium">
                    {result.provenance?.combinedLicenses?.join(', ') || 'MIT'}
                  </span>
                </p>
                {result.provenance?.parentSkills && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] text-zinc-400 block font-mono">Parent Lineage:</span>
                    {result.provenance.parentSkills.map((p: any, idx: number) => (
                      <div key={idx} className="font-mono text-[11px] text-zinc-400 flex items-center gap-1">
                        • {p.name} (v{p.version}) [{p.license}]
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Independent Audit Box */}
              <div className="p-4 rounded-xl bg-[#121316] border border-[#2e3039] space-y-2 text-xs">
                <span className="text-teal-400 font-mono font-semibold block">
                  Independent Security Audit
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-base font-bold ${
                      result.securityAssessment?.score >= 80
                        ? 'text-emerald-400'
                        : result.securityAssessment?.score >= 50
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    Score: {result.securityAssessment?.score}/100
                  </span>
                  <span className="font-mono text-zinc-400 uppercase text-[11px]">
                    ({result.securityAssessment?.status})
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  {result.securityAssessment?.status === 'CLEAN'
                    ? '✔ Zero destructive commands detected in composed output.'
                    : '⚠️ Review detected findings before installing.'}
                </p>
              </div>
            </div>

            {/* Live SKILL.md Content Preview */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400 block flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-teal-400" />
                Preview: Generated SKILL.md
              </span>
              <pre className="p-4 rounded-xl bg-[#121316] border border-[#2e3039] font-mono text-xs text-zinc-300 whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
                {result.exportContent}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


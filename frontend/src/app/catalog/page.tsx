'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { skillsApi } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { SkillCard, SkillItem } from '@/components/SkillCard';
import {
  Search,
  Package,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Filter,
} from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter option: 'all' | 'clean_only'
  const [filterMode, setFilterMode] = useState<'all' | 'clean_only'>('all');

  const fetchSkills = async (searchQuery: string, pageNum: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await skillsApi.list({
        search: searchQuery,
        page: pageNum,
        limit: 12,
      });

      setSkills(res.data);
      if (res.meta) {
        setTotalPages(res.meta.totalPages || 1);
        setTotalCount(res.meta.totalCount || res.data.length);
      }
    } catch (err: any) {
      console.error('Failed to load catalog:', err);
      setError(err.message || 'Unable to connect to registry backend.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sync if URL query param changes
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchTerm) {
      setSearchTerm(q);
      setPage(1);
    }
  }, [searchParams]);

  // Fetch when debounced search or page changes
  useEffect(() => {
    fetchSkills(debouncedSearch, page);
  }, [debouncedSearch, page]);

  // Client-side filtering when "clean_only" is active
  const displayedSkills = filterMode === 'clean_only'
    ? skills.filter((s) => {
        const sec = s.versions?.[0]?.securityAssessment;
        return sec?.status === 'CLEAN' && (sec?.score === null || sec?.score === 100);
      })
    : skills;

  return (
    <div className="space-y-6 pb-20">
      {/* npmjs-Style Search & Header Section */}
      <div className="p-6 rounded-2xl bg-[#18191e] border border-[#2e3039] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400">
              <Package className="w-4 h-4" />
              <span>PACKAGE REGISTRY CATALOG</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#f4f4f5]">
              Search Agent Skills
            </h1>
          </div>

          {/* Quick Count Pill */}
          <div className="text-xs font-mono text-zinc-400 bg-[#121316] px-3 py-1.5 rounded-lg border border-[#2e3039] self-start sm:self-center">
            <span className="text-teal-400 font-bold">{totalCount}</span> packages indexed
          </div>
        </div>

        {/* Big Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search packages by keyword, capability (e.g. nvidia, vision, docker, scraping)..."
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#121316] border border-[#2e3039] text-sm text-[#f4f4f5] placeholder:text-zinc-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40 font-mono transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setPage(1);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills (npmjs style) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filter:
            </span>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg border transition-colors ${
                filterMode === 'all'
                  ? 'bg-teal-500 text-[#121316] font-bold border-teal-500'
                  : 'bg-[#121316] text-zinc-400 border-[#2e3039] hover:text-[#f4f4f5]'
              }`}
            >
              All Packages
            </button>
            <button
              onClick={() => setFilterMode('clean_only')}
              className={`px-3 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                filterMode === 'clean_only'
                  ? 'bg-teal-500 text-[#121316] font-bold border-teal-500'
                  : 'bg-[#121316] text-zinc-400 border-[#2e3039] hover:text-[#f4f4f5]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Clean Security
            </button>
          </div>

          <button
            onClick={() => fetchSkills(debouncedSearch, page)}
            className="px-3 py-1 rounded-lg bg-[#121316] hover:bg-[#262830] border border-[#2e3039] text-zinc-400 hover:text-[#f4f4f5] flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
            <span>Reload</span>
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => fetchSkills(debouncedSearch, page)}
            className="underline underline-offset-2 hover:text-rose-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* Package Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-44 rounded-xl bg-[#18191e] border border-[#2e3039] animate-pulse p-5 space-y-3"
            >
              <div className="h-4 bg-[#262830] rounded w-1/3" />
              <div className="h-6 bg-[#262830] rounded w-2/3" />
              <div className="h-8 bg-[#262830]/60 rounded w-full" />
            </div>
          ))}
        </div>
      ) : displayedSkills.length === 0 ? (
        <div className="text-center py-16 space-y-3 rounded-2xl border border-dashed border-[#2e3039] bg-[#18191e]">
          <Package className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-sm font-medium text-[#f4f4f5]">
            No packages found matching &quot;{searchTerm}&quot;
          </p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto font-mono">
            Try searching for &quot;nvidia&quot;, &quot;gemini&quot;, &quot;docker&quot;, or &quot;chrome&quot;.
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setPage(1);
              }}
              className="text-xs text-teal-400 hover:underline pt-2 font-mono inline-block"
            >
              Clear search query
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-[#2e3039]">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            className="p-2 rounded-lg bg-[#18191e] border border-[#2e3039] text-zinc-400 hover:text-[#f4f4f5] disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-zinc-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLoading}
            className="p-2 rounded-lg bg-[#18191e] border border-[#2e3039] text-zinc-400 hover:text-[#f4f4f5] disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs font-mono text-zinc-500 animate-pulse">
          Loading catalog...
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { skillsApi } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { SkillCard, SkillItem } from '@/components/SkillCard';
import { Search, Compass, RefreshCw, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 350);

  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSkills = async (searchQuery: string, pageNum: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await skillsApi.list({
        search: searchQuery,
        page: pageNum,
        limit: 9,
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

  // Fetch when debounced search or page changes
  useEffect(() => {
    fetchSkills(debouncedSearch, page);
  }, [debouncedSearch, page]);

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
            <Compass className="w-4 h-4" />
            <span>PUBLIC REGISTRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Skill Catalog
          </h1>
          <p className="text-xs text-zinc-400">
            Browse verified agent skills, inspected for security, quality, and portability.
          </p>
        </div>

        {/* Total Count Pill */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-mono">
            {totalCount} {totalCount === 1 ? 'skill indexed' : 'skills indexed'}
          </span>
        </div>
      </div>

      {/* Search Bar & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to page 1 on new search
            }}
            placeholder="Search skills by name, technology (e.g. Next.js, Python), or slug..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => fetchSkills(debouncedSearch, page)}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 flex items-center justify-center gap-2 transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
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

      {/* Skills Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-48 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 animate-pulse p-5 space-y-4"
            >
              <div className="h-4 bg-zinc-800 rounded w-1/3" />
              <div className="h-6 bg-zinc-800 rounded w-2/3" />
              <div className="h-10 bg-zinc-800/60 rounded w-full" />
            </div>
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-16 space-y-3 rounded-2xl border border-dashed border-zinc-800/80 bg-zinc-900/10">
          <p className="text-sm font-medium text-zinc-300">No skills found matching your search</p>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try searching for broader keywords like &quot;Next.js&quot;, &quot;security&quot;, or &quot;python&quot;.
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setPage(1);
              }}
              className="text-xs text-indigo-400 hover:underline pt-2 inline-block"
            >
              Clear search filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-zinc-800/80">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-zinc-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLoading}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}


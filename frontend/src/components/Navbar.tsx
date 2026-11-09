'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import {
  Search,
  Sparkles,
  Layers,
  Github,
  LogOut,
  User as UserIcon,
  Compass,
} from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [navSearch, setNavSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(navSearch.trim())}`);
    } else {
      router.push('/catalog');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2e3039] bg-[#121316]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo - npmjs inspired prominent logo placement */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="p-1.5 rounded-lg bg-[#18191e] border border-[#2e3039] flex items-center justify-center group-hover:border-teal-500/50 transition-colors shadow-sm">
            <Logo className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-[#f4f4f5] group-hover:text-white transition-colors text-sm">
              AI Skill Registry
            </span>
            <span className="text-[10px] text-teal-400 font-mono tracking-wider uppercase">
              Agent Ecosystem
            </span>
          </div>
        </Link>

        {/* npmjs-Style Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xl mx-2 hidden sm:flex items-center"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search packages (e.g. nvidia, gemini, docker, python)..."
              className="w-full pl-10 pr-20 py-2 rounded-lg bg-[#18191e] border border-[#2e3039] text-xs text-[#f4f4f5] placeholder:text-zinc-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40 transition-all font-mono"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#262830] hover:bg-teal-500 hover:text-[#121316] text-zinc-300 text-[11px] font-semibold transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 text-xs font-medium text-zinc-400 shrink-0">
          <Link
            href="/catalog"
            className="px-2.5 py-1.5 rounded-md hover:text-[#f4f4f5] hover:bg-[#18191e] transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Catalog</span>
          </Link>
          <Link
            href="/discover"
            className="px-2.5 py-1.5 rounded-md hover:text-teal-300 hover:bg-teal-500/10 text-teal-400 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline">AI Discovery</span>
          </Link>
          <Link
            href="/compose"
            className="px-2.5 py-1.5 rounded-md hover:text-[#f4f4f5] hover:bg-[#18191e] transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Composer</span>
          </Link>
        </nav>

        {/* Right Actions: GitHub & Auth */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="https://github.com/Piyushbijarania/skill-registry"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-zinc-400 hover:text-[#f4f4f5] hover:bg-[#18191e] rounded-md transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#18191e] border border-[#2e3039] text-xs">
                <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                  <UserIcon className="w-3 h-3" />
                </div>
                <span className="font-medium text-[#f4f4f5] text-xs hidden sm:inline">
                  {user.displayName}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#262830] text-teal-400 uppercase font-mono">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-[#18191e] rounded-md transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#18191e] hover:bg-[#262830] text-zinc-300 border border-[#2e3039] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-[#121316] transition-colors shadow-sm shadow-teal-500/20"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

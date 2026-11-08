'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import { Compass, Sparkles, Layers, Github, LogOut, User as UserIcon } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2e3039]/80 bg-[#121316]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo with Custom SVG */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-1 rounded-lg bg-[#18191e] border border-[#2e3039] flex items-center justify-center group-hover:border-teal-500/40 transition-colors shadow-md shadow-teal-500/5">
            <Logo className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight text-[#f4f4f5] group-hover:text-white transition-colors text-sm">
              AI Skill Registry
            </span>
            <span className="text-[10px] text-teal-400 font-mono tracking-widest uppercase">
              Open Ecosystem
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-400">
          <Link
            href="/catalog"
            className="px-3 py-1.5 rounded-md hover:text-[#f4f4f5] hover:bg-[#1f2127] transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-zinc-400" />
            Catalog
          </Link>
          <Link
            href="/discover"
            className="px-3 py-1.5 rounded-md hover:text-teal-300 hover:bg-teal-500/10 text-teal-400 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            AI Discovery
          </Link>
          <Link
            href="/compose"
            className="px-3 py-1.5 rounded-md hover:text-[#f4f4f5] hover:bg-[#1f2127] transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-zinc-400" />
            Composer
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Piyushbijarania/skill-registry"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-zinc-400 hover:text-[#f4f4f5] hover:bg-[#1f2127] rounded-md transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#18191e] border border-[#2e3039] text-xs">
                <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                  <UserIcon className="w-3 h-3" />
                </div>
                <span className="font-medium text-[#f4f4f5]">{user.displayName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#262830] text-teal-400 uppercase font-mono">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-[#1f2127] rounded-md transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-xs font-medium px-3.5 py-1.5 rounded-lg bg-[#18191e] hover:bg-[#1f2127] text-zinc-300 border border-[#2e3039] transition-all hover:scale-102"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-[#121316] transition-all shadow-md shadow-teal-500/20 hover:scale-102"
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

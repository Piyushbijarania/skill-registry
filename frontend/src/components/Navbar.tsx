'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Compass, Layers, Github, LogOut, User as UserIcon } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight text-zinc-100 group-hover:text-white transition-colors">
              AI Skill Registry
            </span>
            <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
              Verified Ecosystem
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-400">
          <Link
            href="/catalog"
            className="px-3 py-1.5 rounded-md hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            Catalog
          </Link>
          <Link
            href="/discover"
            className="px-3 py-1.5 rounded-md hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300"
          >
            <Sparkles className="w-4 h-4" />
            AI Discovery
          </Link>
          <Link
            href="/compose"
            className="px-3 py-1.5 rounded-md hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            Composer
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Piyushbijarania/skill-registry"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-md transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <UserIcon className="w-3 h-3" />
                </div>
                <span className="font-medium text-zinc-200">{user.displayName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase font-mono">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/60 rounded-md transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-xs font-medium px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 transition-all hover:scale-102"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="text-xs font-medium px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 hover:scale-102"
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


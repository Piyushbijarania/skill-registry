import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Skill Registry — Discover, Audit & Compose Agent Skills',
  description:
    'Open ecosystem registry for AI agent skills with automated security auditing, intent-based discovery, and provenance-tracked composition.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-indigo-500/30 selection:text-white">
        <AuthProvider>
          {/* Ambient Glow */}
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[220px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

          {/* Dynamic Top Navbar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="w-full border-t border-zinc-800/60 bg-[#09090b] py-6 text-xs text-zinc-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Audited by NVIDIA SkillSpector • Immutable SHA-256 Provenance</span>
              </div>
              <p className="font-mono text-zinc-400">AI Skill Registry v1.0.0</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5 px-4">
      <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shadow-xl shadow-teal-500/10">
        <Compass className="w-7 h-7 animate-pulse" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#f4f4f5]">404 - Page Not Found</h1>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          The requested agent skill, documentation, or route does not exist or has been relocated in the registry.
        </p>
      </div>
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#121316] font-semibold text-xs tracking-wide shadow-lg shadow-teal-500/25 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Explore Skills Catalog
      </Link>
    </div>
  );
}


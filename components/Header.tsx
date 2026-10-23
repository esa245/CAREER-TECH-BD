import { Zap, Send } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="#" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20">
              <Zap />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white tracking-tight">CAREER & TECH</span>
                <span className="text-xs bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded-full border border-blue-500/30">BD</span>
              </div>
              <p className="text-[11px] text-slate-400">স্মার্ট ডিজিটাল ও ক্যারিয়ার সলিউশন</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <Link href="#services" className="hover:text-blue-400 transition">সেবাসমূহ</Link>
            <Link href="#why-us" className="hover:text-blue-400 transition">কেন আমরা</Link>
            <Link href="#contact" className="hover:text-blue-400 transition">যোগাযোগ</Link>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              অর্ডার গ্রহণ চলছে
            </div>
          </div>

          <a href="https://t.me/careerandtech" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-sky-500/25 transition transform hover:-translate-y-0.5">
            <Send size={18} />
            <span>টেলিগ্রামে মেসেজ দিন</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

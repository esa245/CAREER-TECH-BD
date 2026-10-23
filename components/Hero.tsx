import { Sparkles, ArrowDown, Headset } from 'lucide-react';
import Link from 'next/link';
import PWAInstallButton from '@/components/PWAInstallButton';

export default function Hero() {
  const logoUrl = 'https://res.cloudinary.com/dlklqihg6/image/upload/v1792753706/vvjv3wjprybjvtfvtwmi.png';

  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(219,234,254,0.5),transparent)] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        
        {/* Brand Logo & PWA Download Header Badge */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2.5 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="Logo" className="w-6 h-6 object-contain" />
            <span className="font-extrabold text-slate-900 text-xs sm:text-sm">CAREER & TECH BD</span>
          </div>

          <PWAInstallButton />
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 tracking-tight leading-tight max-w-5xl mx-auto">
          আপনার ক্যারিয়ার ও টেক প্রয়োজন মেটাতে <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">সব আধুনিক সেবা এক প্ল্যাটফর্মে</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          সোশ্যাল মিডিয়া গ্রোথ, ভিডিও এডিটিং, বাইবিট/বাইনান্স সহায়তা, ওয়েবসাইট-অ্যাপ ডেভেলপমেন্ট থেকে ফ্রিল্যান্সিং গাইডলাইন—সবকিছুই পাবেন প্রফেশনাল মান বজায় রেখে।
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3.5">
          <Link href="#contact" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-blue-500/25 transition">
            প্রয়োজনীয় সেবাটি বুক করুন ✨
          </Link>
          <Link href="#services" className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-bold px-6 py-3.5 rounded-2xl shadow-xs transition">
            সব সার্ভিস দেখুন <ArrowDown className="inline ml-1" size={18} />
          </Link>
          <a href="https://t.me/Isahakali32" target="_blank" rel="noopener noreferrer" className="bg-white border border-slate-200 text-slate-900 font-semibold px-6 py-3.5 rounded-2xl transition flex items-center gap-2 hover:border-sky-400 shadow-xs">
            <Headset className="text-sky-500" size={18} /> টেলিগ্রামে পরামর্শ
          </a>
        </div>
      </div>
    </section>
  );
}

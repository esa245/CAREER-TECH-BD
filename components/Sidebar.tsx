'use client';
import { useState } from 'react';
import { Home, Briefcase, HelpCircle, Mail, Menu, X, Search, CalendarCheck, Sparkles, QrCode, Trophy } from 'lucide-react';
import Link from 'next/link';

import PWAInstallButton from '@/components/PWAInstallButton';

export default function Sidebar({ searchQuery = '', setSearchQuery }: { searchQuery?: string, setSearchQuery?: (q: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const logoUrl = 'https://res.cloudinary.com/dlklqihg6/image/upload/v1792753706/vvjv3wjprybjvtfvtwmi.png';

  const links = [
    { name: 'হোম', icon: <Home size={18} />, color: 'hover:bg-violet-900', href: '/' },
    { name: 'সেবাসমূহ', icon: <Briefcase size={18} />, color: 'hover:bg-indigo-900', href: '#services' },
    { name: 'কিউআর ও টুলস', icon: <QrCode size={18} />, color: 'hover:bg-cyan-900', href: '#qr-tools' },
    { name: 'কেন আমরা', icon: <HelpCircle size={18} />, color: 'hover:bg-emerald-900', href: '#why-us' },
    { name: 'পরিসংখ্যান ও অর্জন', icon: <Trophy size={18} />, color: 'hover:bg-amber-900', href: '#stats' },
    { name: 'সেবা বুক করুন', icon: <CalendarCheck size={18} />, color: 'hover:bg-blue-900', href: '#contact' },
    { name: 'যোগাযোগ', icon: <Mail size={18} />, color: 'hover:bg-amber-900', href: '#contact' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Content */}
      <div className={`
        ${isOpen ? 'flex' : 'hidden'} lg:flex 
        flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 p-5 z-40 shadow-sm
      `}>
        {/* Branding with Logo */}
        <div className="mb-5 mt-12 lg:mt-0 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="Career & Tech BD Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-950 tracking-tight leading-tight">CAREER & TECH</div>
            <div className="text-[10px] text-blue-600 font-extrabold tracking-wider uppercase">IM Softworks Partner</div>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="relative mb-6">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search size={16} />
          </span>
          <input 
            type="text"
            value={searchQuery ?? ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="সার্ভিস খুঁজুন..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 transition shadow-inner" 
          />
          {searchQuery ? (
            <button 
              type="button" 
              onClick={() => setSearchQuery && setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          ) : null}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-grow overflow-y-auto">
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex items-center gap-3 text-slate-700 p-3 rounded-xl transition hover:bg-slate-100 hover:text-slate-950 text-sm`}
              onClick={() => setIsOpen(false)}
            >
              <span className="text-slate-500">{link.icon}</span>
              <span className="font-semibold">{link.name}</span>
            </Link>
          ))}

          {/* PWA App Download / Google Shortcut Button */}
          <div className="mt-3">
            <PWAInstallButton className="w-full justify-center" />
          </div>

          {/* Quick Booking CTA button in Sidebar */}
          <Link 
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="mt-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold p-3 rounded-xl text-center text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            <span>প্রয়োজনীয় সেবা বুক করুন</span>
          </Link>
        </nav>
        
        {/* Footer/Meta in Sidebar */}
        <div className="text-[10px] text-slate-500 mt-auto pt-4 border-t border-slate-100">
          © {new Date().getFullYear()} C&T BD
        </div>
      </div>
    </>
  );
}

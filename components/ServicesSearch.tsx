'use client';
import { Search, X, Sparkles, Filter } from 'lucide-react';

interface ServicesSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function ServicesSearch({ searchQuery = '', setSearchQuery }: ServicesSearchProps) {
  const quickCategories = [
    { label: 'সব সেবা', query: '' },
    { label: 'মোবাইল ও সফটওয়্যার', query: 'মোবাইল' },
    { label: 'সোশ্যাল মিডিয়া', query: 'সোশ্যাল মিডিয়া' },
    { label: 'ভিডিও এডিটিং', query: 'ভিডিও' },
    { label: 'ওয়েব ও টেক', query: 'ওয়েব' },
    { label: 'থাম্বনেইল ও ডিজাইন', query: 'ডিজাইন' },
    { label: 'কিউআর ও কনভার্টার', query: 'কিউআর' },
    { label: 'ক্রিপ্টো ও কয়েন', query: 'ক্রিপ্টো' },
    { label: 'আইডি ও মাস্টারকার্ড', query: 'কার্ড' },
    { label: 'ডাটা ও আইটি', query: 'ডাটা' },
    { label: 'থ্রিডি ও অ্যানিমেশন', query: 'থ্রিডি' },
    { label: 'মার্কেটিং ও অটোমেশন', query: 'মার্কেটিং' },
    { label: 'কাউন্সেলিং ও আড্ডা', query: 'কাউন্সেলিং' },
  ];

  return (
    <div className="pt-8 pb-4">
      <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 p-6 sm:p-8 rounded-3xl border border-blue-100 shadow-sm">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 bg-blue-100/70 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} className="text-blue-600" />
            <span>স্মার্ট সার্ভিস ফিল্টার</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            ক্যাটাগরি ও প্রয়োজনীয় সেবা খুঁজুন
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            নির্দিষ্ট যেকোনো সেবা, সফটওয়্যার, মোবাইল হেল্প বা ক্যাটাগরির নাম লিখে দ্রুত খুঁজে নিন।
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="max-w-2xl mx-auto relative mb-5">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-blue-500">
            <Search size={20} />
          </span>
          <input
            type="text"
            value={searchQuery ?? ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="যেমন: মোবাইল সমস্যা, ইউটিউব, ভিডিও এডিটিং, ওয়েবসাইট, বাইনান্স..."
            className="w-full bg-white border-2 border-blue-200/80 hover:border-blue-300 focus:border-blue-600 rounded-2xl pl-12 pr-12 py-3.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none shadow-sm transition"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery && setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              title="ক্লিয়ার করুন"
            >
              <X size={18} />
            </button>
          ) : null}
        </div>

        {/* Quick Category Chips */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-600">
            <Filter size={13} className="text-blue-600" />
            <span>জনপ্রিয় ক্যাটাগরি ফিল্টার:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickCategories.map((cat, idx) => {
              const isActive = (cat.query === '' && !searchQuery) || (cat.query !== '' && searchQuery === cat.query);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSearchQuery && setSearchQuery(cat.query)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-blue-500/20'
                      : 'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Search Indicator */}
        {searchQuery && (
          <div className="max-w-2xl mx-auto mt-4 pt-3 border-t border-blue-200/50 flex items-center justify-between text-xs text-slate-600">
            <span>
              &quot;<strong>{searchQuery}</strong>&quot; এর জন্য সেবা ফিল্টার করা হচ্ছে।
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery && setSearchQuery('')}
              className="text-blue-600 hover:underline font-bold"
            >
              সব সেবা প্রদর্শন করুন ↺
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

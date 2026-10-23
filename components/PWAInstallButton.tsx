'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Download, Check, X } from 'lucide-react';

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function PWAInstallButton({ className = '' }: { className?: string }) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const mounted = useIsMounted();

  // Logo provided by user

  const logoUrl = 'https://res.cloudinary.com/dlklqihg6/image/upload/v1792753706/vvjv3wjprybjvtfvtwmi.png';

  if (!mounted) {
    return (
      <button
        type="button"
        className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs opacity-90 ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt="Logo" className="w-5 h-5 object-contain rounded-md shrink-0 bg-white/20 p-0.5" />
        <Download size={14} />
        <span>অ্যাপ ডাউনলোড / শর্টকাট</span>
      </button>
    );
  }

  if (isInstalled) {
    return (
      <div className={`inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-bold ${className}`}>
        <Check size={14} className="text-emerald-600" />
        <span>অ্যাপটি ইনস্টল করা আছে</span>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (isInstallable) {
            install();
          } else if (isIOS) {
            setShowIOSGuide(true);
          } else {
            setShowGuideModal(true);
          }
        }}
        className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition transform hover:scale-105 active:scale-95 cursor-pointer ${className}`}
        title="অ্যাপ হিসেবে ডাউনলোড / গুগল শর্টকাট যোগ করুন"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt="Logo" className="w-5 h-5 object-contain rounded-md shrink-0 bg-white/20 p-0.5" />
        <Download size={14} />
        <span>অ্যাপ ডাউনলোড / শর্টকাট</span>
      </button>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">আইফোনে (iOS) অ্যাপ ইনস্টল করুন</h3>
            <div className="mt-2 text-xs text-slate-600 leading-relaxed text-left bg-slate-50 p-3 rounded-xl border border-slate-200">
              ১. Safari ব্রাউজারের নিচে থাকা <strong>Share (শেয়ার)</strong> বাটন চাপুন।<br />
              ২. স্ক্রোল করে <strong>&quot;Add to Home Screen&quot; (হোম স্ক্রিনে যোগ করুন)</strong> নির্বাচন করুন।
            </div>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}

      {/* General Google Shortcut Guide Modal for desktop / Android fallback */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-center relative">
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">গুগল ক্রোম ও শর্টকাট অ্যাপ ডাউনলোড</h3>
            <div className="mt-2 text-xs text-slate-600 leading-relaxed text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <div><strong>অ্যান্ড্রয়েড ও পিসিতে ইনস্টল করার নিয়ম:</strong></div>
              <div>১. ব্রাউজারের থ্রি-ডট (<strong>⋮</strong>) মেনুতে ক্লিক করুন।</div>
              <div>২. <strong>&quot;Install app&quot;</strong> অথবা <strong>&quot;Add to Home screen&quot; / &quot;Create shortcut&quot;</strong> এ ক্লিক করুন।</div>
              <div>৩. সাইটটি সরাসরি ডিভাইস হোমস্কিনে অ্যাপ হিসেবে ইনস্টল হয়ে যাবে।</div>
            </div>
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="mt-4 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer"
            >
              বুঝেছি
            </button>
          </div>
        </div>
      )}
    </>
  );
}

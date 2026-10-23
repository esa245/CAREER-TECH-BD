'use client';
import { Send, Mail, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Useful Links & Brand Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://res.cloudinary.com/dlklqihg6/image/upload/v1792753706/vvjv3wjprybjvtfvtwmi.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-white font-extrabold text-base tracking-tight leading-none">CAREER & TECH BD</p>
                <p className="text-[10px] text-blue-400 font-bold uppercase mt-1">IM Softworks Partner</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mt-2">
              IM Softworks-এর সহযোগিতায় পরিচালিত আপনার বিশ্বস্ত ডিজিটাল ও ক্যারিয়ার সলিউশন প্ল্যাটফর্ম।
            </p>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Useful Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="#" className="hover:text-blue-400 transition">Home</Link></li>
              <li><Link href="#why-us" className="hover:text-blue-400 transition">About us</Link></li>
              <li><Link href="#services" className="hover:text-blue-400 transition">Products & Services</Link></li>
              <li><Link href="#contact" className="hover:text-blue-400 transition">Contact us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">IM Softworks Services</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Custom Software Development</li>
              <li>Web Applications</li>
              <li>Mobile Apps & Cloud Solutions</li>
              <li>API Development & UI/UX Design</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm mb-3">Connect with us</h4>
            <p className="text-slate-400 text-xs">প্রজেক্ট ও কোলাবরেশনের জন্য ইমেইল করুন:</p>
            <a 
              href="mailto:im.softwark.team@gmail.com" 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold transition shadow-sm text-xs"
            >
              <Mail size={14} />
              <span>im.softwark.team@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 text-center text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>&copy; {new Date().getFullYear()} Career & Tech BD & IM Softworks. All rights reserved.</p>
          <p className="text-slate-400 font-medium">
            Project Shared Email: <strong className="text-blue-400">im.softwark.team@gmail.com</strong>
          </p>
        </div>

      </div>
    </footer>
  );
}

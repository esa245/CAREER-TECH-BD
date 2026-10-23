'use client';
import { Send, Mail, MessageSquare, Users } from 'lucide-react';

export default function SocialLinks() {
  const socials = [
    { name: 'টেলিগ্রাম চ্যাট', icon: <Send size={20} />, color: 'text-sky-500 bg-sky-50', href: 'https://t.me/Isahakali32' },
    { name: 'টেলিগ্রাম গ্রুপ', icon: <Users size={20} />, color: 'text-indigo-500 bg-indigo-50', href: 'https://t.me/+D4uRpI6eYR5mMTll' },
    { name: 'অফিসিয়াল ইমেইল', icon: <Mail size={20} />, color: 'text-blue-500 bg-blue-50', href: 'mailto:im.softwark.team@gmail.com' },
    { name: 'লাইভ সাপোর্ট চ্যাট', icon: <MessageSquare size={20} />, color: 'text-violet-500 bg-violet-50', href: 'https://t.me/Isahakali32' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      {socials.map((social) => (
        <a 
          key={social.name} 
          href={social.href} 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-slate-200 shadow-xs flex items-center gap-3 p-3.5 rounded-2xl hover:border-blue-400 hover:shadow-md transition"
        >
          <div className={`p-2.5 rounded-xl shrink-0 ${social.color}`}>{social.icon}</div>
          <span className="font-bold text-slate-800 text-xs sm:text-sm truncate">{social.name}</span>
        </a>
      ))}
    </div>
  );
}

'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, Sparkles, UserCheck, HelpCircle, Mail } from 'lucide-react';

import { groupedServices } from '@/components/Services';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export default function TopLiveConnect() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'agent',
      text: 'হ্যালো! Career & Tech BD এবং IM Softworks-এর লাইভ সাপোর্ট হাবে স্বাগতম। আপনি যেকোনো সেবা বা ক্যাটাগরির নাম (যেমন: মোবাইল, ইউটিউব, আইডি কার্ড, সিভি, কাস্টম সফটওয়্যার ইত্যাদি) লিখে সার্চ করুন, তাৎক্ষণিক সার্ভিস ডিটেইলস পাবেন!',
      time: 'এখনই'
    }
  ]);

  const quickSuggestions = [
    'মোবাইল ও সফটওয়্যার সমস্যা',
    'আইডি কার্ড ও মাস্টারকার্ড',
    'ইউটিউব ও ভিডিও এডিটিং',
    'কাস্টম সফটওয়্যার ও ওয়েবসাইট',
    'সিভি রিভিউ ও ক্যারিয়ার',
    'ক্রিপ্টো ও বাইন্যান্স'
  ];

  const idCounterRef = useRef(1);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    idCounterRef.current += 1;
    const currentId = idCounterRef.current;

    const userMsg: ChatMessage = {
      id: `msg-${currentId}`,
      sender: 'user',
      text,
      time: 'এখনই'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Intelligent Category & Service Search Matcher
    setTimeout(() => {
      const q = text.toLowerCase().trim();
      let reply = '';

      // Match categories and services from groupedServices
      const matchedCategories: { categoryName: string; services: { title: string; desc: string; delivery?: string }[] }[] = [];

      Object.entries(groupedServices).forEach(([catName, services]) => {
        const catLower = catName.toLowerCase();
        const isCatMatch = catLower.includes(q) || q.includes(catLower) ||
          (q.includes('মোবাইল') && catLower.includes('মোবাইল')) ||
          (q.includes('আইডি') && catLower.includes('আইডি')) ||
          (q.includes('মাস্টারকার্ড') && catLower.includes('আইডি')) ||
          (q.includes('ইউটিউব') && catLower.includes('ইউটিউব')) ||
          (q.includes('ভিডিও') && catLower.includes('ভিডিও')) ||
          (q.includes('ওয়েবসাইট') && catLower.includes('সফটওয়্যার')) ||
          (q.includes('সফটওয়্যার') && catLower.includes('সফটওয়্যার')) ||
          (q.includes('অ্যাপ') && (catLower.includes('মোবাইল') || catLower.includes('সফটওয়্যার'))) ||
          (q.includes('সিভি') && catLower.includes('ক্যারিয়ার')) ||
          (q.includes('ক্যারিয়ার') && catLower.includes('ক্যারিয়ার')) ||
          (q.includes('ক্রিপ্টো') && catLower.includes('ক্রিপ্টো')) ||
          (q.includes('বাইন্যান্স') && catLower.includes('ক্রিপ্টো')) ||
          (q.includes('এআই') && catLower.includes('এআই')) ||
          (q.includes('গ্রাফিক্স') && catLower.includes('গ্রাফিক্স')) ||
          (q.includes('৩ডি') && catLower.includes('৩ডি')) ||
          (q.includes('ডিজাইন') && catLower.includes('ডিজাইন'));

        const matchedInCat = services.filter(s => 
          isCatMatch || 
          s.title.toLowerCase().includes(q) || 
          s.desc.toLowerCase().includes(q)
        );

        if (matchedInCat.length > 0) {
          matchedCategories.push({
            categoryName: catName,
            services: matchedInCat.map(s => ({ title: s.title, desc: s.desc, delivery: s.delivery }))
          });
        }
      });

      if (matchedCategories.length > 0) {
        let textResult = `✨ "${text}" সার্চ অনুযায়ী ক্যাটাগরি ও সার্ভিসসমূহ:\n\n`;
        matchedCategories.slice(0, 3).forEach((cat) => {
          textResult += `📂 [${cat.categoryName}]\n`;
          cat.services.slice(0, 4).forEach((s) => {
            textResult += `• ${s.title}: ${s.desc}${s.delivery ? ` (সময়: ${s.delivery})` : ''}\n`;
          });
          textResult += `\n`;
        });
        textResult += `📩 যেকোনো সেবা অর্ডার করতে বা কাজের প্রজেক্ট ফাইল পাঠাতে ইমেইল করুন: im.softwark.team@gmail.com অথবা সরাসরি টেলিগ্রামে জানান: t.me/Isahakali32`;
        reply = textResult;
      } else if (text.includes('যোগাযোগ') || text.includes('কথা') || text.includes('mail') || text.includes('contact') || text.includes('support') || text.includes('গ্রুপ') || text.includes('group')) {
        reply = 'আমাদের সাথে যোগাযোগের মাধ্যমসমূহ:\n📧 ইমেইল (প্রজেক্ট পাঠানোর জন্য): im.softwark.team@gmail.com\n✈️ টেলিগ্রাম ডিরেক্ট চ্যাট: t.me/Isahakali32\n👥 টেলিগ্রাম অফিশিয়াল গ্রুপ: https://t.me/+D4uRpI6eYR5mMTll\n২৪/৭ আমাদের সাপোর্ট টিম আপনার সেবায় প্রস্তুত!';
      } else {
        reply = `ধন্যবাদ আপনার বার্তার জন্য! IM Softworks এবং Career & Tech BD-এর ১৮টি ডিজিটাল সেবার যেকোনো ক্যাটাগরি বা সার্ভিসের নাম লিখে মেসেজ দিন, ইনস্ট্যান্ট সার্ভিস ডিটেইলস পেয়ে যাবেন।\n\nইমেইল: im.softwark.team@gmail.com\nটেলিগ্রাম: t.me/Isahakali32`;
      }

      const agentMsg: ChatMessage = {
        id: `agent-${currentId + 1}`,
        sender: 'agent',
        text: reply,
        time: 'এখনই'
      };
      setMessages(prev => [...prev, agentMsg]);
    }, 500);
  };

  return (
    <>
      {/* Floating Support & Quick Connect Dock (Fixed Bottom-Right) */}
      {!isChatOpen && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2.5 select-none">
          {/* ১. লাইভ চ্যাট (টেলিগ্রাম এর ওপরে, ছোট ও কমপ্যাক্ট সাইজ) */}
          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20 text-center min-w-[76px]"
            title="লাইভ চ্যাট"
          >
            <div className="relative mb-0.5">
              <span className="animate-ping absolute -top-0.5 -right-0.5 inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
              <span className="absolute -top-0.5 -right-0.5 inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-[11px] font-bold leading-none">লাইভ চ্যাট</span>
          </button>

          {/* ২. টেলিগ্রাম বাটন */}
          <a
            href="https://t.me/Isahakali32"
            target="_blank"
            rel="noopener noreferrer"
            title="টেলিগ্রামে মেসেজ দিন"
            className="group flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white px-3 py-1.5 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 active:scale-95 border border-sky-300/30 text-xs font-bold"
          >
            <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Send size={12} className="-ml-0.5 text-white" />
            </div>
            <span>টেলিগ্রাম</span>
          </a>

          {/* ৩. ইমেইল */}
          <a
            href="mailto:im.softwark.team@gmail.com"
            title="ইমেইল করুন"
            className="group flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-xl shadow-xs border border-slate-200 transition transform hover:scale-105 text-[11px] font-semibold"
          >
            <Mail size={12} className="text-blue-600" />
            <span>ইমেইল</span>
          </a>
        </div>
      )}

      {/* Interactive Live Chat & Suggestion Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl max-w-lg w-full h-[580px] max-h-[92vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                    <UserCheck size={22} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base leading-tight">লাইভ কনভারসেশন ও সাপোর্ট</h3>
                    <p className="text-[11px] text-blue-100 flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                      রিয়েল কনসালট্যান্ট ও সাপোর্ট টিম অনলাইনে আছেন
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title="বন্ধ করুন"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}

                {/* Quick Suggestion Chips */}
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" /> দ্রুত সাজেশন পেতে ক্লিক করুন:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickSuggestions.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(sug)}
                        className="text-left text-[11px] bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Input & Guidelines */}
              <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="আপনার কথা বা যেকোনো প্রশ্ন লিখুন..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 transition"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2.5 rounded-2xl shadow-sm transition cursor-pointer shrink-0"
                    title="পাঠান"
                  >
                    <Send size={16} />
                  </button>
                </form>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <a
                    href="mailto:im.softwark.team@gmail.com"
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2 px-3 rounded-xl text-center transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Mail size={13} /> im.softwark.team@gmail.com
                  </a>
                  <a
                    href="https://t.me/Isahakali32"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-3 rounded-xl text-center transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Send size={13} /> টেলিগ্রাম চ্যাট
                  </a>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

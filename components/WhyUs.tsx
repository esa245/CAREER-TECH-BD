'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Zap, Clock, Users, Globe, X, CheckCircle2, Code, Smartphone, Cloud, Cpu, Layout, Sparkles } from 'lucide-react';

export default function WhyUs() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    { title: 'নিরাপদ সেবা', desc: '১০০% বিশ্বস্ত ও নিরাপদ সার্ভিস ডেলিভারি', icon: <ShieldCheck className="text-emerald-500" /> },
    { title: 'দ্রুত ডেলিভারি', desc: 'অত্যন্ত দ্রুত সময়ের মধ্যে কাজ সম্পন্ন', icon: <Zap className="text-blue-500" /> },
    { title: '২৪/৭ সাপোর্ট', desc: 'যেকোনো সমস্যায় পাশে আছি সব সময়', icon: <Clock className="text-indigo-500" /> },
    { title: 'অভিজ্ঞ টিম', desc: 'প্রফেশনাল এক্সপার্টদের দ্বারা কাজ করানো হয়', icon: <Users className="text-amber-500" /> },
  ];

  return (
    <section id="why-us" className="py-20" style={{ backgroundColor: '#E0E7FF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-slate-950 text-center mb-4">কেন আমাদের বেছে নিবেন?</h2>
        
        {/* Developer Profile Card / Button Trigger */}
        <div className="text-center mb-12">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer border border-slate-700"
          >
            <Globe className="text-cyan-400 animate-pulse" size={18} />
            <span>🌐 IM Softworks ও ডেভেলপার পরিচিতি দেখুন</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl text-center flex flex-col items-center border border-slate-100 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mb-4">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Developer & IM Softworks Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                title="বন্ধ করুন"
              >
                <X size={20} />
              </button>

              <div className="space-y-8">
                
                {/* 1. Developer Info Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-md border-2 border-blue-500 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="https://res.cloudinary.com/dlklqihg6/image/upload/v1760308052/kkchmpjdp9izcjfvvo4k.jpg" 
                      alt="Mohammad Esa Ali" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
                      <Sparkles size={13} className="text-amber-500" /> 👋 About Me
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">Mohammad Esa Ali</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      Hello, I am Mohammad Esa Ali, a passionate and creative tech enthusiast. I specialize in Software Development, Web Solutions, and Creative Design. My goal is to help businesses grow by building smart, future-ready, and user-friendly digital solutions.
                    </p>
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs italic text-slate-700">
                      💡 I believe: <br />
                      <strong className="text-blue-700">&ldquo;Success comes when your clients succeed.&rdquo;</strong>
                    </div>
                  </div>
                </div>

                {/* 2. IM Softworks Overview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Globe className="text-blue-600" size={24} />
                    <h4 className="text-xl font-extrabold text-slate-900">🌐 IM Softworks</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                      <p className="font-bold text-blue-900 mb-1">বাংলা বিবরণ:</p>
                      <p className="text-slate-700 leading-relaxed">
                        IM Softworks একটি উদীয়মান সফটওয়্যার কোম্পানি, যা ভবিষ্যতমুখী প্রযুক্তি ও সৃজনশীল সমাধানের মাধ্যমে ক্লায়েন্টদের ব্যবসায়িক সাফল্যে সহায়তা করে। আমরা বিশ্বাস করি— আমাদের উন্নতি তখনই সম্ভব, যখন আমাদের ক্লায়েন্ট লাভবান হবেন। <br /><br />
                        <strong>আমরা শুধু সফটওয়্যার তৈরি করি না — আমরা সম্ভাবনা গড়ে তুলি।</strong>
                      </p>
                    </div>

                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                      <p className="font-bold text-indigo-900 mb-1">English Overview:</p>
                      <p className="text-slate-700 leading-relaxed">
                        IM Softworks is an emerging software company that empowers clients’ business success through futuristic technology and innovative solutions. We believe that our growth is only possible when our clients benefit. <br /><br />
                        <strong>We don’t just build software — We build possibilities.</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Our Mission (আমাদের লক্ষ্য) */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl space-y-3 shadow-lg">
                  <h5 className="font-bold text-base flex items-center gap-2 text-amber-400">
                    🎯 আমাদের লক্ষ্য (Our Mission)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <p className="font-semibold text-slate-300 mb-1">বাংলা:</p>
                      <p className="italic text-slate-100">&ldquo;আপনার লাভই আমাদের সফলতা।&rdquo;</p>
                      <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">
                        আমরা প্রতিটি প্রজেক্টে বিশ্বাস করি— যদি ক্লায়েন্ট উপকৃত হন, তবেই আমরা সফল। সেই লক্ষ্যেই আমাদের প্রতিটি কোড, প্রতিটি ডিজাইন এবং প্রতিটি আইডিয়া।
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-300 mb-1">English:</p>
                      <p className="italic text-slate-100">&ldquo;Your profit is our success.&rdquo;</p>
                      <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">
                        In every project, we believe that our true achievement lies in the client’s benefit. That’s why every line of our code, every design, and every idea is driven by this mission.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Our Services (আমাদের সার্ভিসসমূহ) */}
                <div className="space-y-3">
                  <h5 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    🔧 আমাদের সার্ভিসসমূহ (Our Services)
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { name: 'কাস্টম সফটওয়্যার', en: 'Custom Software', icon: <Code size={16} /> },
                      { name: 'ওয়েব অ্যাপ্লিকেশন', en: 'Web Applications', icon: <Globe size={16} /> },
                      { name: 'মোবাইল অ্যাপ', en: 'Mobile Apps', icon: <Smartphone size={16} /> },
                      { name: 'ক্লাউড সল্যুশন', en: 'Cloud Solutions', icon: <Cloud size={16} /> },
                      { name: 'API ডেভেলপমেন্ট', en: 'API Development', icon: <Cpu size={16} /> },
                      { name: 'UI/UX ডিজাইন', en: 'UI/UX Design', icon: <Layout size={16} /> },
                    ].map((srv, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          {srv.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{srv.name}</p>
                          <p className="text-[10px] text-slate-500">{srv.en}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Products & Contact info */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h5 className="font-bold text-sm text-slate-900">🛠️ Products & Contact</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We develop smart, scalable, and future-ready software products tailored to meet the unique needs of modern businesses. Our products are designed to help you automate processes, improve efficiency, and scale with confidence.
                  </p>
                  <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-700">
                    <span>📧 Official Email: <strong className="text-blue-600">im.softwark.team@gmail.com</strong></span>
                    <a
                      href="mailto:im.softwark.team@gmail.com"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded-lg transition"
                    >
                      ইমেইল পাঠান
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

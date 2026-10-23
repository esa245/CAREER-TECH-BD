'use client';
import { Award, CheckCircle2, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export default function SuccessStories() {
  const stats = [
    {
      value: '৯৯%',
      label: 'ক্লায়েন্ট সন্তুষ্টি রেট',
      desc: 'কাজের মান ও সেবায় ক্লায়েন্টদের সর্বোচ্চ সন্তুষ্টি',
      icon: <Award className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50/80 border-blue-100',
      valueColor: 'text-blue-600',
    },
    {
      value: '১,০০০+',
      label: 'সফল প্রজেক্ট ডেলিভারি',
      desc: 'ডিজিタル সার্ভিস, চ্যানেল ও ক্যারিয়ার সলিউশন সম্পন্ন',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50/80 border-emerald-100',
      valueColor: 'text-emerald-600',
    },
    {
      value: '২৪/৭',
      label: 'লাইভ সাপোর্ট সহায়তা',
      desc: 'যেকোনো প্রযুক্তিগত পরামর্শ ও দ্রুত সহায়তায় সর্বদা প্রস্তুত',
      icon: <Clock className="w-6 h-6 text-sky-600" />,
      bg: 'bg-sky-50/80 border-sky-100',
      valueColor: 'text-sky-600',
    },
    {
      value: '১০০%',
      label: 'মান ও গোপনীয়তা গ্যারান্টি',
      desc: 'নিরাপদ ডেটা, শতভাগ সততা ও বিশ্বস্ততার প্রতিশ্রুতি',
      icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50/80 border-amber-100',
      valueColor: 'text-amber-600',
    },
  ];

  return (
    <section id="stats" className="py-14 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Header Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-blue-100">
            <Sparkles size={14} className="text-blue-500" />
            <span>আমাদের নির্ভরযোগ্যতা ও অর্জন</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            সংখ্যায় আমাদের পথচলা ও অর্জন
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
            প্রতিটি প্রজেক্টে সর্বোচ্চ মান, সুরক্ষা এবং সন্তুষ্টি নিশ্চিত করাই আমাদের মূল লক্ষ্য।
          </p>
        </div>

        {/* 4 Trust Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => (
            <div 
              key={idx} 
              className={`p-6 rounded-3xl border ${item.bg} hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center border border-slate-100">
                  {item.icon}
                </div>
                <span className={`text-3xl sm:text-4xl font-extrabold ${item.valueColor} tracking-tight`}>
                  {item.value}
                </span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                  {item.label}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

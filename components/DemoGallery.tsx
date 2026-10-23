'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, FileText, CheckCircle2, Download, Search, Filter, Sparkles, ExternalLink, ThumbsUp } from 'lucide-react';

export interface WorkFileItem {
  id: string;
  name: string;
  projectName: string;
  category: string;
  fileName: string;
  fileType: string;
  imageUrl: string;
  description: string;
  downloadUrl?: string;
  averageRating: number;
  totalRatings: number;
  userRated?: number;
}

const defaultWorkFiles: WorkFileItem[] = [
  {
    id: 'wf-1',
    name: 'Career & Tech Studio',
    projectName: 'স্মার্ট আইডি কার্ড ও মাস্টারকার্ড আর্টওয়ার্ক ফাইল',
    category: 'আইডি কার্ড ও মাস্টারকার্ড বানিয়ে নিন',
    fileName: 'smart_id_and_mastercard_vector.ai',
    fileType: 'image/png',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    description: 'পিভিসি স্মার্ট চিপ আইডি কার্ড এবং ডুয়াল কারেন্সি ভার্চুয়াল ও ফিজিক্যাল মাস্টারকার্ড হাই-রেজুলেশন রেডি-প্রিন্ট ফাইল।',
    averageRating: 5.0,
    totalRatings: 56,
  },
  {
    id: 'wf-2',
    name: 'Career & Tech 3D Lab',
    projectName: '৩D টেক্সি ও প্রোডাক্ট অ্যানিমেশন মডেল ফাইল',
    category: 'থ্রিডি ও অ্যানিমেশন',
    fileName: 'taxi_and_product_3d_render.mp4',
    fileType: 'video/mp4',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    description: 'সিনেমা ৪D ও ব্লেন্ডারে তৈরি হাইপার-রিয়েলিস্টিক টেক্সি মডেল, টেক্সচারিং ও ৪K মোশন অ্যানিমেশন রেন্ডার ফাইল।',
    averageRating: 4.9,
    totalRatings: 42,
  },
  {
    id: 'wf-3',
    name: 'Career & Tech Growth',
    projectName: 'মার্কেটিং ও অটোমেশন সেলস ফানেল ফাইল',
    category: 'মার্কেটিং ও অটোমেশন',
    fileName: 'marketing_automation_workflow.json',
    fileType: 'application/json',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: 'ফেসবুক মেসেঞ্জার, হোয়াটসঅ্যাপ ও ইমেইল অটো-রিপ্লাই ফানেল সেটআপ এবং লিড জেনারেশন অটোমেশন ফাইল।',
    averageRating: 5.0,
    totalRatings: 61,
  },
  {
    id: 'wf-4',
    name: 'Career & Tech Tools',
    projectName: 'স্মার্ট কিউআর কোড ও শর্ট লিংক প্লেয়ার ফাইল',
    category: 'কিউআর ও টেক',
    fileName: 'dynamic_qr_generator_system.zip',
    fileType: 'image/png',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    description: 'কালারফুল গ্রেডিয়েন্ট কিউআর কোড কনভার্টার ও শর্ট ভিডিও লাইভ প্লেব্যাকের ফুল কনফিগারেশন ফাইল।',
    averageRating: 4.9,
    totalRatings: 38,
  },
  {
    id: 'wf-5',
    name: 'Career & Tech Creative',
    projectName: 'ইউটিউব এসইও, থাম্বনেইল ও মনিটাইজেশন কিট',
    category: 'সোশ্যাল মিডিয়া ও এডিটিং',
    fileName: 'youtube_seo_and_thumbnails.psd',
    fileType: 'image/png',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    description: 'হাই সিটিআর ৪K ফটোশপ থাম্বনেইল টেমপ্লেট, ভাইরাল কি-ওয়ার্ড এসইও শিট ও মনিটাইজেশন গাইডলাইন ফাইল।',
    averageRating: 4.8,
    totalRatings: 49,
  },
  {
    id: 'wf-6',
    name: 'Career & Tech Dev',
    projectName: 'আধুনিক ই-কমার্স ও পোর্টফোলিও ওয়েব কোডবেস',
    category: 'ওয়েব ও টেক',
    fileName: 'nextjs_responsive_web_app.tar.gz',
    fileType: 'application/octet-stream',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    description: 'নেক্সট জেএস ও টেলউইন্ড ভিত্তিক ফুল-স্ট্যাক রেসপনসিভ ওয়েবসাইট এবং রিয়েল-টাইম ডাটা ইন্টিগ্রেশন ফাইল।',
    averageRating: 5.0,
    totalRatings: 73,
  }
];

export default function DemoGallery({ submissions = [] }: { submissions: any[] }) {
  // Merge default showcase files with any user submissions
  const [ratedFiles, setRatedFiles] = useState<Record<string, { rating: number; count: number; userRating: number }>>({});
  const [hoveredStar, setHoveredStar] = useState<{ fileId: string; star: number } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [thankYouToast, setThankYouToast] = useState<{ id: string; stars: number } | null>(null);

  // Combine default with user submissions
  const allFiles: WorkFileItem[] = [
    ...submissions.map((s, idx) => ({
      id: `user-sub-${idx}-${s.projectName || 'project'}`,
      name: s.name || 'সম্মানিত ক্লায়েন্ট',
      projectName: s.projectName || 'ব্যবহারকারীর কাজের ফাইল',
      category: s.category || 'অন্যান্য',
      fileName: s.fileName || 'কাজের ফাইল সংযুক্তি',
      fileType: s.fileType || 'image/png',
      imageUrl: s.imageUrl || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      description: s.description || 'ক্লায়েন্ট কর্তৃক আপলোডকৃত কাজের ফাইল।',
      averageRating: 5.0,
      totalRatings: 1,
    })),
    ...defaultWorkFiles,
  ];

  const handleRate = (fileId: string, starGiven: number) => {
    setRatedFiles((prev) => {
      const current = prev[fileId] || {
        rating: defaultWorkFiles.find((f) => f.id === fileId)?.averageRating || 5.0,
        count: defaultWorkFiles.find((f) => f.id === fileId)?.totalRatings || 10,
        userRating: 0,
      };

      const isFirstRate = current.userRating === 0;
      const newCount = isFirstRate ? current.count + 1 : current.count;
      const totalScore = current.rating * current.count + (isFirstRate ? starGiven : starGiven - current.userRating);
      const newAverage = parseFloat((totalScore / newCount).toFixed(1));

      return {
        ...prev,
        [fileId]: {
          rating: newAverage,
          count: newCount,
          userRating: starGiven,
        },
      };
    });

    setThankYouToast({ id: fileId, stars: starGiven });
    setTimeout(() => {
      setThankYouToast(null);
    }, 3000);
  };

  const categories = [
    { id: 'all', label: 'সকল কাজের ফাইল' },
    { id: 'আইডি কার্ড ও মাস্টারকার্ড বানিয়ে নিন', label: 'আইডি ও কার্ড' },
    { id: 'থ্রিডি ও অ্যানিমেশন', label: 'থ্রিডি ও অ্যানিমেশন' },
    { id: 'মার্কেটিং ও অটোমেশন', label: 'মার্কেটিং ও অটোমেশন' },
    { id: 'কিউআর ও টেক', label: 'কিউআর ও টেক' },
    { id: 'সোশ্যাল মিডিয়া ও এডিটিং', label: 'এসইও ও এডিটিং' },
    { id: 'ওয়েব ও টেক', label: 'ওয়েব ডেভেলপমেন্ট' },
  ];

  const filteredFiles = allFiles.filter((file) => {
    const matchesCategory = activeCategory === 'all' || file.category === activeCategory;
    const matchesQuery = !searchQuery || 
      file.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="mt-4 space-y-8">
      {/* Search and Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="কাজের ফাইল খুঁজুন..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 transition"
          />
        </div>
      </div>

      {/* Grid of Work Files with Live Star Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.map((proj, i) => {
          const currentStats = ratedFiles[proj.id] || {
            rating: proj.averageRating,
            count: proj.totalRatings,
            userRating: proj.userRated || 0,
          };
          const isUserRated = currentStats.userRating > 0;
          const hasMedia = Boolean(proj.imageUrl && typeof proj.imageUrl === 'string' && proj.imageUrl.trim() !== '');
          const isImage =
            hasMedia && (
              (proj.fileType && proj.fileType.startsWith('image/')) ||
              proj.imageUrl.startsWith('data:image') ||
              /\.(jpg|jpeg|png|webp|gif|svg)($|\?)/i.test(proj.imageUrl) ||
              (!proj.fileType && !/\.(pdf|doc|docx|zip|rar|txt|json)($|\?)/i.test(proj.fileName || ''))
            );

          return (
            <motion.div
              key={proj.id || i}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              layout
            >
              {/* Media Preview */}
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                {hasMedia && isImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={proj.imageUrl}
                    alt={proj.projectName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
                    <FileText size={36} className="text-blue-400 mb-2" />
                    <span className="text-xs font-mono font-bold truncate max-w-full px-4">{proj.fileName || 'কাজের ফাইল'}</span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/10">
                    {proj.category}
                  </span>
                </div>

                {/* Overall Stars Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-slate-900 px-2.5 py-1 rounded-lg shadow-sm border border-slate-200/80 flex items-center gap-1.5">
                  <Star size={13} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-extrabold">{currentStats.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-slate-500 font-medium">({currentStats.count})</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                    {proj.projectName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[200px]">
                      {proj.fileName}
                    </span>
                  </div>
                  {proj.description && (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                </div>

                {/* STAR RATING SECTION - 'ব্যবহারকারী এখানে খালি ইস্টার দেখতে পারবে রেটিখ খালি রেটিং দিতে পারবে এমন' */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">
                        {isUserRated ? 'আপনার রেটিং দেওয়া হয়েছে:' : 'স্টার রেটিং দিন:'}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-extrabold text-amber-600">
                        <span>{currentStats.rating.toFixed(1)}</span>
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                      </div>
                    </div>

                    {/* Interactive 5 Stars */}
                    <div className="flex items-center justify-between gap-1 py-1">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isHovered = hoveredStar?.fileId === proj.id && star <= hoveredStar.star;
                          const isSelected = isUserRated ? star <= currentStats.userRating : star <= Math.round(currentStats.rating);

                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRate(proj.id, star)}
                              onMouseEnter={() => setHoveredStar({ fileId: proj.id, star })}
                              onMouseLeave={() => setHoveredStar(null)}
                              className="p-1 rounded-lg hover:bg-white transition cursor-pointer active:scale-90"
                              title={`${star} স্টার রেটিং দিন`}
                            >
                              <Star
                                size={22}
                                className={`transition-all duration-150 ${
                                  isHovered
                                    ? 'text-amber-500 fill-amber-400 scale-110 drop-shadow-xs'
                                    : isSelected
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-300 hover:text-amber-300'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>

                      <span className="text-[11px] font-bold text-slate-500">
                        {currentStats.count} টি রেটিং
                      </span>
                    </div>

                    {/* Feedback Toast upon Rating */}
                    {thankYouToast?.id === proj.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1"
                      >
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span>ধন্যবাদ! আপনি {thankYouToast.stars} স্টার রেটিং দিয়েছেন।</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Action Links */}
                  <div className="flex items-center justify-between mt-3 text-xs">
                    <span className="text-slate-500 text-[11px]">
                      প্রস্তুতকারক: <strong className="text-slate-700">{proj.name}</strong>
                    </span>
                    <a
                      href={`https://t.me/careerandtech_support?text=${encodeURIComponent(
                        `কাজের ফাইল সম্পর্কিত বুকিং বা সেবা প্রয়োজন: ${proj.projectName} (${proj.category})`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold hover:underline"
                    >
                      <span>অর্ডার / কাস্টমাইজ</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
          <FileText size={36} className="mx-auto text-slate-300 mb-2" />
          <h4 className="text-sm font-bold text-slate-700">কোনো কাজের ফাইল পাওয়া যায়নি</h4>
          <p className="text-xs text-slate-500 mt-1">অন্য কোনো ক্যাটাগরি বা কি-ওয়ার্ড দিয়ে সার্চ করে দেখুন।</p>
        </div>
      )}
    </div>
  );
}

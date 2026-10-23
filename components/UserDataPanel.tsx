'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Database, Star, FolderKanban, MessageSquare, FileText, Download, 
  Tag, ThumbsUp, ThumbsDown, CheckCircle2, Send, Sparkles 
} from 'lucide-react';

const avatarPalette = [
  'bg-emerald-600',
  'bg-blue-600',
  'bg-indigo-600',
  'bg-violet-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-teal-600',
];

export default function UserDataPanel({ 
  submissions = [], 
  reviews = [], 
  onAddReview
}: { 
  submissions?: any[]; 
  reviews: any[]; 
  onAddReview?: (review: any) => void;
}) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'projects'>('reviews');
  const [userRatings, setUserRatings] = useState<Record<string | number, number>>({});
  const [hoverRatings, setHoverRatings] = useState<Record<string | number, number>>({});
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string | number, { yes: number; no: number; userVoted?: 'yes' | 'no' }>>({});

  // Direct Review Submission State (Name, Comment, 5 Stars inside panel)
  const [newRating, setNewRating] = useState(5);
  const [newHoverRating, setNewHoverRating] = useState(0);
  const [newName, setNewName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const starLabels: Record<number, string> = {
    1: '১ স্টার - সাধারণ অভিজ্ঞতা',
    2: '২ স্টার - মোটামুটি সার্ভিস',
    3: '৩ স্টার - ভালো সেবা',
    4: '৪ স্টার - খুবই চমৎকার ও সন্তোষজনক',
    5: '৫ স্টার - অসাধারণ ও সেরা সেবা!',
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating > 0 && onAddReview) {
      onAddReview({
        name: newName.trim() || 'সম্মানিত ব্যবহারকারী',
        rating: newRating,
        comment: newComment.trim() || 'খুবই চমৎকার ও দ্রুত সেবা পেয়েছি। অনেক ধন্যবাদ!',
        time: 'আজ, এইমাত্র'
      });
      setNewName('');
      setNewComment('');
      setNewRating(5);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3500);
    }
  };

  const handleVote = (id: string | number, type: 'yes' | 'no') => {
    setHelpfulVotes(prev => {
      const current = prev[id] || { yes: 14 + (typeof id === 'number' ? id * 3 : 2), no: 1 };
      if (current.userVoted === type) return prev;
      
      const newYes = type === 'yes' ? (current.userVoted === 'no' ? current.yes + 1 : current.yes + 1) : (current.userVoted === 'yes' ? Math.max(0, current.yes - 1) : current.yes);
      const newNo = type === 'no' ? (current.userVoted === 'yes' ? current.no + 1 : current.no + 1) : (current.userVoted === 'no' ? Math.max(0, current.no - 1) : current.no);
      
      return {
        ...prev,
        [id]: { yes: Math.max(0, newYes), no: Math.max(0, newNo), userVoted: type }
      };
    });
  };

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Database size={14} /> Live Public Data Panel
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">ইউজার সাবমিটেড ডাটা প্যানেল</h2>
          <p className="text-slate-600 text-sm mt-2">
            সকল ব্যবহারকারী কর্তৃক জমাকৃত প্রজেক্ট, রিভিউ এবং বুকিং রিকোয়েস্টসমূহ এখানে স্বচ্ছভাবে প্রদর্শিত হয়।
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition shadow-sm cursor-pointer ${
              activeTab === 'projects' 
                ? 'bg-blue-600 text-white shadow-blue-500/25' 
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FolderKanban size={16} /> জমাকৃত প্রজেক্ট ({submissions.length})
          </button>
          
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition shadow-sm cursor-pointer ${
              activeTab === 'reviews' 
                ? 'bg-blue-600 text-white shadow-blue-500/25' 
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MessageSquare size={16} /> ইউজার রিভিউ ({reviews.length})
          </button>


        </div>

        {/* Content Panel */}
        <motion.div 
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8 min-h-[300px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={activeTab}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'projects' && (
            submissions.length === 0 ? (
              divEmpty('কোনো প্রজেক্ট এখনো জমা দেওয়া হয়নি।')
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="pb-4">ফাইল / প্রিভিউ</th>
                      <th className="pb-4">প্রেরকের নাম</th>
                      <th className="pb-4">প্রজেক্টের নাম</th>
                      <th className="pb-4">ক্যাটাগরি</th>
                      <th className="pb-4">বিবরণ</th>
                      <th className="pb-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {submissions.map((item, idx) => {
                      const hasMedia = Boolean(item.imageUrl && typeof item.imageUrl === 'string' && item.imageUrl.trim() !== '');
                      const isImage = hasMedia && (
                        (item.fileType && item.fileType.startsWith('image/')) ||
                        item.imageUrl.startsWith('data:image') ||
                        /\.(jpg|jpeg|png|webp|gif|svg)($|\?)/i.test(item.imageUrl) ||
                        (!item.fileType && !/\.(pdf|doc|docx|zip|rar|txt|json)($|\?)/i.test(item.fileName || ''))
                      );

                      return (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="py-4">
                            {hasMedia ? (
                              isImage ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img 
                                  src={item.imageUrl || undefined} 
                                  alt={item.fileName || item.projectName || 'প্রজেক্ট ফাইল'} 
                                  className="w-14 h-14 object-cover rounded-xl border border-slate-200 shadow-xs" 
                                  referrerPolicy="no-referrer" 
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-200 flex flex-col items-center justify-center text-blue-600">
                                  <FileText size={22} />
                                  <span className="text-[9px] font-bold mt-0.5 truncate max-w-[50px]">{item.fileName || 'ফাইল'}</span>
                                </div>
                              )
                            ) : (
                              <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                                <FileText size={20} className="text-blue-500 mb-0.5" />
                                <span className="text-[9px] font-semibold text-slate-500">ফাইল</span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 font-bold text-slate-900">{item.name}</td>
                          <td className="py-4 font-semibold text-blue-600">{item.projectName || 'নামহীন প্রজেক্ট'}</td>
                          <td className="py-4">
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                              <Tag size={12} className="text-blue-500" />
                              {item.category || 'সাধারণ'}
                            </span>
                          </td>
                          <td className="py-4 text-slate-600 max-w-xs truncate">{item.description || 'বিবরণ নেই'}</td>
                          <td className="py-4 text-right">
                            {hasMedia ? (
                              <a 
                                href={item.imageUrl} 
                                target="_blank" 
                                download={item.fileName || 'demo-project-file'}
                                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                              >
                                <Download size={14} /> ভিউ / ডাউনলোড
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400 font-medium">নিবন্ধিত</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Direct Review Form inside the Panel with 5-Star Rating */}
              {onAddReview && (
                <form onSubmit={handleReviewSubmit} className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                    <Sparkles size={18} className="text-amber-500" />
                    <span>আপনার মূল্যবান ৫-স্টার রেটিং ও মতামত দিন</span>
                  </div>

                  {/* 5 Star interactive picker */}
                  <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200/80 gap-2">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          onMouseEnter={() => setNewHoverRating(star)}
                          onMouseLeave={() => setNewHoverRating(0)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer"
                          title={`${star} স্টার`}
                        >
                          <Star
                            size={32}
                            className={star <= (newHoverRating || newRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-amber-800">
                      {starLabels[newHoverRating || newRating]}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                        আপনার নাম
                      </label>
                      <input 
                        type="text" 
                        placeholder="যেমন: তানভীর আহমেদ" 
                        value={newName} 
                        onChange={e => setNewName(e.target.value)} 
                        className="w-full bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                        আপনার মন্তব্য / মতামত
                      </label>
                      <input 
                        type="text" 
                        placeholder="সেবা বা কাজের অভিজ্ঞতা সম্পর্কে লিখুন..." 
                        value={newComment} 
                        onChange={e => setNewComment(e.target.value)} 
                        className="w-full bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-amber-500 to-blue-600 hover:from-amber-600 hover:to-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-2"
                    >
                      <Send size={15} />
                      <span>{newRating} স্টার রিভিউ জমা দিন</span>
                    </button>
                    {submitSuccess && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={14} /> সফলভাবে যুক্ত হয়েছে!
                      </span>
                    )}
                  </div>
                </form>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                divEmpty('কোনো রিভিউ এখনো জমা দেওয়া হয়নি।')
              ) : (
                <div className="max-h-[580px] overflow-y-auto pr-2 space-y-4">
                  {reviews.map((item, idx) => {
                    const itemKey = item.name || idx;
                    const ratingValue = userRatings[itemKey] !== undefined ? userRatings[itemKey] : (item.rating || 5);
                    const voteData = helpfulVotes[itemKey] || { yes: 14 + idx * 5, no: 1 };

                    return (
                      <div 
                        key={idx} 
                        className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-blue-300 transition space-y-3"
                      >
                        {/* Header: User Avatar, Name, Rating & Time */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-full ${avatarPalette[idx % avatarPalette.length]} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}>
                              {item.name ? item.name.slice(0, 2) : 'ইউ'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-none">
                                  {item.name || 'সম্মানিত ব্যবহারকারী'}
                                </h4>
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200/60">
                                  <CheckCircle2 size={11} className="text-emerald-600" /> ভেরিফাইড ইউজার
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1.5">
                                {/* Stars Display */}
                                <div className="flex text-amber-400">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star 
                                      key={s} 
                                      size={14} 
                                      className={s <= ratingValue ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} 
                                    />
                                  ))}
                                </div>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {item.time || 'সাম্প্রতিক'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Interactive Star Clicker for Testing / Direct Rating */}
                          <div className="hidden sm:flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
                            <span className="text-[10px] text-slate-500 font-medium mr-1">রেটিং দিন:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setUserRatings(prev => ({ ...prev, [itemKey]: star }))}
                                className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                                title={`${star} স্টার দিন`}
                              >
                                <Star
                                  size={13}
                                  className={star <= ratingValue ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-amber-300'}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Review Comment Text */}
                        <p className="text-slate-800 text-sm sm:text-base leading-relaxed pt-1 font-normal">
                          {item.comment || 'খুবই চমৎকার ও দ্রুত সেবা পেয়েছি। কাজের মান অত্যন্ত নিখুঁত এবং সন্তোষজনক।'}
                        </p>

                        {/* Helpful Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                          <span className="text-[11px] text-slate-500">
                            এই রিভিউটি কি আপনার কাছে সহায়ক মনে হয়েছে?
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleVote(itemKey, 'yes')}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                                voteData.userVoted === 'yes'
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                            >
                              <ThumbsUp size={12} />
                              <span>হ্যাঁ ({voteData.yes})</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVote(itemKey, 'no')}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                                voteData.userVoted === 'no'
                                  ? 'bg-slate-700 text-white border-slate-700'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                            >
                              <ThumbsDown size={12} />
                              <span>না</span>
                            </button>
                          </div>
                        </div>

                        {/* Developer Response */}
                        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 ml-3 sm:ml-6 mt-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                            <span>Career & Tech BD (ডেভেলপারের প্রতিক্রিয়া)</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            ধন্যবাদ আপনার সুন্দর ও ইতিবাচক মতামতের জন্য! আমাদের সাপোর্ট টিম সর্বদা আপনার যেকোনো সার্ভিস ও ক্যারিয়ার প্রয়োজনে পাশে আছে।
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}


        </motion.div>
      </div>
    </section>
  );
}

function divEmpty(text: string) {
  return (
    <div className="text-center py-16 text-slate-400 font-medium text-sm">
      {text}
    </div>
  );
}

'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Upload, Link as LinkIcon, FileText, X, Send, Mail, Globe } from 'lucide-react';

export default function DemoSubmission({ onAdd }: { onAdd: (proj: any) => void }) {
  const [name, setName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState('মোবাইল ও সফটওয়্যার সমস্যা সমাধান');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [isExpanded, setIsExpanded] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allCategories = [
    'মোবাইল ও সফটওয়্যার সমস্যা সমাধান',
    'কথা বলা ও পার্সোনাল কাউন্সেলিং',
    'সোশ্যাল মিডিয়া ও এডিটিং',
    'আইডি কার্ড ও মাস্টারকার্ড বানিয়ে নিন',
    'ডিজাইন ও ফাইল কনভার্শন',
    'ব্যবসা ও অ্যাকাউন্টিং',
    'ই-কমার্স ম্যানেজমেন্ট',
    'শিক্ষাদান ও কনসাল্টিং',
    'গেমিং ও টেকনিক্যাল সাপোর্ট',
    'প্রম্পট ইঞ্জিনিয়ারিং ও এআই',
    'ওয়েব ও টেক',
    'ক্রিপ্টো সেবা',
    'ক্যারিয়ার ও ফ্রিল্যান্সিং',
    'ডাটা ও অ্যানালিটিক্স',
    'সাইবার সিকিউরিটি ও আইটি',
    'রাইটিং ও ট্রান্সলেশন',
    'মার্কেটিং ও অটোমেশন',
    'থ্রিডি ও অ্যানিমেশন',
    'অডিও ও ভয়েস',
    'অন্যান্য'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setImageUrl('');
    setFileName('');
    setFileType('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = (target: 'telegram' | 'email' | 'gallery') => {
    if (!name || !projectName || !imageUrl) return;

    // 1. Add to website live demo gallery
    onAdd({ 
      name, 
      projectName, 
      category, 
      description,
      imageUrl, 
      fileName, 
      fileType 
    });

    const filePreview = fileName ? `ফাইল: ${fileName}` : `লিঙ্ক: ${imageUrl}`;
    const descText = description ? `\n📝 বিবরণ: ${description}` : '';

    if (target === 'telegram') {
      const tgText = `📌 নতুন প্রজেক্ট ডেমো সাবমিশন\n👤 প্রেরক: ${name}\n📁 প্রজেক্ট: ${projectName}\n🏷️ ক্যাটাগরি: ${category}${descText}\n📎 ${filePreview}`;
      window.open(`https://t.me/careerandtech_support?text=${encodeURIComponent(tgText)}`, '_blank');
      setSuccessMsg('প্রজেক্ট গ্যালারিতে যোগ হয়েছে এবং টেলিগ্রামে পাঠানো হয়েছে!');
    } else if (target === 'email') {
      const emailSubject = encodeURIComponent(`নতুন প্রজেক্ট সাবমিশন: ${projectName} (${category})`);
      const emailBody = encodeURIComponent(`নাম: ${name}\nপ্রজেক্টের নাম: ${projectName}\nক্যাটাগরি: ${category}\n${description ? `বিবরণ: ${description}\n` : ''}${filePreview}`);
      window.location.href = `mailto:support@careerandtech.com?subject=${emailSubject}&body=${emailBody}`;
      setSuccessMsg('প্রজেক্ট গ্যালারিতে যোগ হয়েছে এবং ইমেইলে প্রস্তুত করা হয়েছে!');
    } else {
      setSuccessMsg('প্রজেক্ট সফলভাবে ডেমো গ্যালারিতে যুক্ত করা হয়েছে!');
    }

    setName('');
    setProjectName('');
    setDescription('');
    clearFile();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="mb-8">
      {!isExpanded ? (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 px-5 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
          >
            <Upload size={16} className="text-blue-600" />
            <span>নতুন কোনো কাজের ফাইল বা প্রজেক্ট জমা দিতে চান? (ক্লিক করুন)</span>
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">আপনার কাজের ফাইল বা প্রজেক্ট জমা দিন</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                প্রজেক্টের তথ্য ফিলাপ করে সরাসরি <strong>টেলিগ্রাম</strong> বা <strong>ইমেইলে</strong> পাঠাতে পারবেন এবং ওয়েবসাইটেও প্রদর্শিত হবে।
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              title="বন্ধ করুন"
            >
              <X size={18} />
            </button>
          </div>

      <div className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">আপনার নাম</label>
          <input 
            type="text" 
            placeholder="আপনার নাম লিখুন" 
            value={name ?? ''} 
            onChange={e => setName(e.target.value)} 
            className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 transition" 
            required 
          />
        </div>

        {/* Project Name Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">প্রজেক্টের নাম</label>
          <input 
            type="text" 
            placeholder="প্রজেক্টের নাম লিখুন" 
            value={projectName ?? ''} 
            onChange={e => setProjectName(e.target.value)} 
            className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 transition" 
            required 
          />
        </div>

        {/* All Categories Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
            ক্যাটাগরি নির্বাচন করুন ({allCategories.length}টি ক্যাটাগরি)
          </label>
          <select 
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 transition"
          >
            {allCategories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Project Description (Optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">প্রজেক্ট বিবরণ (ঐচ্ছিক)</label>
          <textarea 
            rows={2}
            placeholder="প্রজেক্ট সম্পর্কে সংক্ষেপে লিখুন..." 
            value={description ?? ''} 
            onChange={e => setDescription(e.target.value)} 
            className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 transition resize-none" 
          />
        </div>

        {/* File or URL Upload Toggle */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">প্রজেক্ট ফাইল বা ছবি</label>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setUploadMode('file'); clearFile(); }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${uploadMode === 'file' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
              >
                <Upload size={12} /> ডিভাইস ফাইল
              </button>
              <button
                type="button"
                onClick={() => { setUploadMode('url'); clearFile(); }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${uploadMode === 'url' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
              >
                <LinkIcon size={12} /> ফাইল ইউআরএল
              </button>
            </div>
          </div>

          {uploadMode === 'file' ? (
            <div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="*/*"
                onChange={handleFileChange} 
                className="hidden" 
                id="project-file-upload"
              />
              {!imageUrl ? (
                <label 
                  htmlFor="project-file-upload"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition group"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-500 group-hover:text-blue-600 mb-2">
                    <Upload size={22} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">ফাইল আপলোড করুন</span>
                  <span className="text-[11px] text-slate-500 mt-1">সব ধরনের ফাইল ও ইমেজ ফরম্যাট সমর্থিত</span>
                </label>
              ) : (
                <div className="flex items-center justify-between p-3.5 bg-blue-50 border border-blue-200 rounded-2xl">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {Boolean(imageUrl && imageUrl.trim()) && (fileType.startsWith('image/') || imageUrl.startsWith('data:image')) ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={imageUrl} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-blue-200" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <FileText size={22} />
                      </div>
                    )}
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 truncate">{fileName || 'নির্বাচিত ফাইল'}</p>
                      <p className="text-[11px] text-emerald-600 font-medium">ফাইল সফলভাবে লোড হয়েছে ✓</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={clearFile}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <input 
              type="url" 
              placeholder="ছবির ইউআরএল (https://...)" 
              value={imageUrl ?? ''} 
              onChange={e => {
                setImageUrl(e.target.value);
                setFileName(e.target.value.split('/').pop() || 'অনলাইন ফাইল');
              }} 
              className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 transition" 
              required 
            />
          )}
        </div>

        {/* Telegram / Email / Gallery Sending Action Buttons */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-700 mb-2">কোথায় পাঠাতে চান নির্বাচন করুন:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Send via Telegram */}
            <motion.button 
              type="button" 
              onClick={() => handleSend('telegram')}
              disabled={!name || !projectName || !imageUrl}
              className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-sky-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
            >
              <Send size={18} />
              <span>টেলিগ্রামে পাঠান</span>
            </motion.button>

            {/* Send via Email */}
            <motion.button 
              type="button" 
              onClick={() => handleSend('email')}
              disabled={!name || !projectName || !imageUrl}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
            >
              <Mail size={18} />
              <span>ইমেইলে পাঠান</span>
            </motion.button>
          </div>

          {/* Save to website only */}
          <button
            type="button"
            onClick={() => handleSend('gallery')}
            disabled={!name || !projectName || !imageUrl}
            className="w-full mt-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Globe size={14} />
            <span>শুধুমাত্র ওয়েবসাইটে যোগ করুন</span>
          </button>
        </div>

        {/* Success Alert */}
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-xs sm:text-sm pt-2 bg-emerald-50 py-3 rounded-xl border border-emerald-200"
            >
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )}
</div>
  );
}

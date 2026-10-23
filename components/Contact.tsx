'use client';
import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, CheckCircle2, MessageSquareText, Search, X, Layers, 
  Sparkles, Check, ChevronDown, Clock, Upload, Link as LinkIcon, 
  FileText, Mail, PhoneCall
} from 'lucide-react';
import { groupedServices } from '@/components/Services';

interface BookingItem {
  name: string;
  phone: string;
  service: string;
  category: string;
  details: string;
  fileName?: string;
  fileUrl?: string;
  time?: string;
  status?: string;
}

export default function Contact({ 
  preSelectedService = '', 
  onAddBooking 
}: { 
  preSelectedService?: string; 
  onAddBooking?: (booking: BookingItem) => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('মোবাইল ও অ্যাপের ছোটখাটো সমস্যা');
  const [details, setDetails] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // File upload state for booking reference
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Popup modal state for service selection
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupSearch, setPopupSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('ALL');

  const [prevPreSelected, setPrevPreSelected] = useState(preSelectedService);

  if (preSelectedService !== prevPreSelected) {
    setPrevPreSelected(preSelectedService);
    if (preSelectedService && preSelectedService.trim()) {
      setService(preSelectedService);
    }
  }

  // Find category for current service if any
  const currentCategory = useMemo(() => {
    for (const [catName, items] of Object.entries(groupedServices)) {
      if (items.some(i => i.title === service || service.includes(i.title))) {
        return catName;
      }
    }
    return 'সাধারণ সেবা';
  }, [service]);

  // Handle file selection from user device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setFileUrl('');
    setFileName('');
    setFileType('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBookingSubmit = (e: React.FormEvent, channel: 'direct' | 'telegram' | 'email') => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !service.trim()) return;

    const newSubmission = {
      name,
      phone,
      projectName: service,
      service,
      category: currentCategory,
      description: details || 'কাজের বিবরণ ও ফাইল রেফারেন্স জমা দেওয়া হয়েছে',
      details,
      fileName: fileName || (fileUrl && uploadMode === 'url' ? 'অনলাইন ফাইল লিঙ্ক' : ''),
      fileUrl,
      imageUrl: fileUrl,
      fileType,
      time: new Date().toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'প্রসেসিং হচ্ছে'
    };

    if (onAddBooking) {
      onAddBooking(newSubmission);
    }

    let fileFormattedText = '';
    if (uploadMode === 'url' && fileUrl) {
      fileFormattedText = `\n📎 ড্রাইভ / অনলাইন ফাইল লিঙ্ক: ${fileUrl}`;
    } else if (fileName) {
      fileFormattedText = `\n📎 সংযুক্ত ফাইলের নাম: ${fileName}\n(💡 টিপস: ডিভাইস থেকে সিলেক্ট করা "${fileName}" ফাইলটি ইমেইল অ্যাপ ওপেন হলে Attachment (+) আইকনে যুক্ত করে দিন)`;
    }

    const detailsText = details ? `\n📝 বিবরণ: ${details}` : '';

    if (channel === 'telegram') {
      const tgText = `📌 কাজের প্রজেক্ট ও ফাইল জমা\n👤 নাম: ${name}\n📱 যোগাযোগ: ${phone}\n🎯 সেবা: ${service}\n📂 ক্যাটাগরি: ${currentCategory}${detailsText}${fileFormattedText}`;
      window.open(`https://t.me/Isahakali32?text=${encodeURIComponent(tgText)}`, '_blank');
      setSuccessMsg('আপনার প্রজেক্ট ও ফাইল ওয়েবসাইটে জমা হয়েছে এবং টেলিগ্রামে প্রস্তুত করা হয়েছে!');
    } else {
      const emailSubject = encodeURIComponent(`[প্রজেক্ট জমা] ${service} - ${name}`);
      const emailBody = encodeURIComponent(`নাম: ${name}\nযোগাযোগ: ${phone}\nসেবা: ${service}\nক্যাটাগরি: ${currentCategory}\nবিবরণ: ${details || 'নেই'}${fileFormattedText}\n\nপ্রজেক্ট প্রাপ্তির ইমেইল: im.softwark.team@gmail.com`);
      window.location.href = `mailto:im.softwark.team@gmail.com?subject=${emailSubject}&body=${emailBody}`;
      setSuccessMsg(`আপনার প্রজেক্ট ওয়েবসাইট প্যানেলে জমা হয়েছে এবং ইমেইল প্রস্তুত করা হয়েছে! ${fileName ? `(ইমেইল ওপেন হলে + চেপে ${fileName} ফাইলটি অ্যাটাচ করুন)` : ''}`);
    }

    setName('');
    setPhone('');
    setDetails('');
    clearFile();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 7000);
  };

  // Categories list
  const categoriesList = Object.keys(groupedServices);

  // Filtered services for the popup modal
  const filteredGroups = useMemo(() => {
    return Object.entries(groupedServices).map(([category, items]) => {
      if (selectedCatFilter !== 'ALL' && selectedCatFilter !== category) {
        return [category, []] as [string, typeof items];
      }

      const query = popupSearch.trim().toLowerCase();
      if (!query) {
        return [category, items] as [string, typeof items];
      }

      const matchedItems = items.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query)
      );
      return [category, matchedItems] as [string, typeof items];
    }).filter(([_, items]) => items.length > 0);
  }, [popupSearch, selectedCatFilter]);

  const handleSelectServiceFromPopup = (itemTitle: string) => {
    setService(itemTitle);
    setIsPopupOpen(false);
    setPopupSearch('');
  };

  return (
    <section id="contact" className="py-20 relative bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="bg-white p-6 sm:p-12 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-blue-100 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-indigo-100 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center max-w-xl mx-auto mb-10 relative">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <MessageSquareText size={14} /> Direct Booking
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              প্রয়োজনীয় সেবাটি বুক করুন
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              আপনার কাঙ্ক্ষিত সেবাটি নির্বাচন করুন এবং সরাসরি ইমেইল (im.softwark.team@gmail.com) অথবা টেলিগ্রামের মাধ্যমে তাৎক্ষণিক পাঠান।
            </p>
          </div>

          <form onSubmit={(e) => handleBookingSubmit(e, 'email')} className="space-y-6 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  আপনার নাম <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  required 
                  value={name ?? ''}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition shadow-xs" 
                  placeholder="পূর্ণ নাম লিখুন" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  টেলিগ্রাম ইউজারনেম / ইমেইল <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  required 
                  value={phone ?? ''}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition shadow-xs" 
                  placeholder="@telegram_username অথবা ইমেইল" 
                />
              </div>
            </div>

            {/* "কোন সেবাটি পেতে চান?" Interactive Selector with Pop-up trigger & categorized options */}
            <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-slate-50 p-4 sm:p-5 rounded-2xl border-2 border-blue-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles size={14} className="text-blue-600" />
                  <span>কোন সেবাটি পেতে চান?</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-extrabold px-2 py-0.5 rounded-full ml-1">
                    ১৮টি ক্যাটাগরি অন্তর্ভুক্ত
                  </span>
                </label>
                
                {/* Pop-up trigger button */}
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition cursor-pointer self-start sm:self-auto"
                >
                  <Layers size={13} />
                  <span>পপআপ থেকে ক্যাটাগরি ও সেবা বাছাই করুন ✨</span>
                </button>
              </div>

              {/* Selected Service Card with Quick Change */}
              <div className="bg-white border border-blue-100 rounded-xl p-3.5 mb-3 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0 border border-blue-100">
                    <CheckCircle2 size={20} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 truncate">
                        {currentCategory || 'নির্বাচিত সেবা'}
                      </span>
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 truncate mt-0.5">
                      {service}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPopupOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer"
                >
                  পরিবর্তন করুন
                </button>
              </div>

              {/* Categorized Select Dropdown with all 18 categories */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  অথবা ড্রপডাউন থেকে সরাসরি নির্বাচন করুন:
                </label>
                <div className="relative">
                  <select 
                    value={service ?? ''}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 transition shadow-xs cursor-pointer appearance-none pr-10"
                  >
                    {Object.entries(groupedServices).map(([category, items]) => (
                      <optgroup key={category} label={`📂 ${category}`}>
                        {items.map((item) => (
                          <option key={item.title} value={item.title}>
                            {item.title}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                    <ChevronDown size={16} />
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Reference File / Attachment */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  কাজের ফাইল / স্ক্রিনশট রেফারেন্স (ঐচ্ছিক)
                </label>
                <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setUploadMode('file')}
                    className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                      uploadMode === 'file' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    ডিভাইস থেকে ফাইল
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode('url')}
                    className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                      uploadMode === 'url' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    অনলাইন লিঙ্ক
                  </button>
                </div>
              </div>

              {uploadMode === 'file' ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-3 text-center cursor-pointer bg-white transition hover:bg-blue-50/30 flex items-center justify-center gap-2"
                  >
                    <Upload size={16} className="text-blue-500" />
                    <span className="text-xs text-slate-600 font-medium">
                      {fileName ? fileName : 'ডিভাইস থেকে যেকোনো ছবি, পিডিএফ বা ডকুমেন্ট ফাইল সিলেক্ট করুন'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <LinkIcon size={16} />
                  </span>
                  <input
                    type="url"
                    value={fileUrl ?? ''}
                    onChange={(e) => {
                      setFileUrl(e.target.value);
                      setFileName(e.target.value ? 'অনলাইন ফাইল লিঙ্ক' : '');
                    }}
                    placeholder="ফাইলের লিঙ্ক দিন (Google Drive, Dropbox, Imgur...)"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 transition"
                  />
                </div>
              )}

              {/* File attachment preview */}
              {Boolean(fileUrl && fileUrl.trim()) && (
                <div className="mt-2.5 flex items-center justify-between p-2.5 bg-white border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {(fileType.startsWith('image/') || fileUrl.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif|svg)($|\?)/i.test(fileUrl)) ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={fileUrl || undefined} alt="Preview" className="w-9 h-9 object-cover rounded-lg border" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText size={18} />
                      </div>
                    )}
                    <span className="text-xs text-slate-700 font-medium truncate max-w-xs">
                      {fileName || 'সংযুক্ত ফাইল'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition"
                    title="ফাইল মুছুন"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              <p className="text-[11px] text-slate-500 mt-2 flex items-start gap-1">
                <span className="text-blue-600 font-bold shrink-0">💡 নোট:</span> 
                <span>ছবি বা ফাইল আপলোড করলে তা ওয়েবসাইটে জমাকৃত প্রজেক্ট প্যানেলে ইনস্ট্যান্ট প্রিভিউসহ সেভ হয়ে যাবে। ইমেইল অ্যাপ চালু হলে সেখানে (+) Attachment বাটনে ফাইলটি যুক্ত করে দিন, অথবা অনলাইন ড্রাইভ লিঙ্ক ব্যবহার করুন।</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                কাজের বিবরণ (ঐচ্ছিক)
              </label>
              <textarea 
                rows={3} 
                value={details ?? ''}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition shadow-xs resize-none" 
                placeholder="আপনার নির্দিষ্ট কাজ, ডেডলাইন বা বিশেষ কোনো প্রয়োজনীয়তার বিবরণ লিখুন..." 
              />
            </div>

            {/* Direct Submission Action Buttons (Email & Telegram) */}
            <div className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button 
                  type="submit" 
                  onClick={(e) => handleBookingSubmit(e, 'email')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-2xl shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2.5 cursor-pointer text-xs sm:text-sm"
                >
                  <Mail size={18} />
                  <span>ইমেইলে প্রজেক্ট পাঠান (im.softwark.team@gmail.com)</span>
                </button>

                <button 
                  type="button" 
                  onClick={(e) => handleBookingSubmit(e, 'telegram')}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-4 rounded-2xl shadow-lg shadow-sky-500/25 transition flex items-center justify-center gap-2.5 cursor-pointer text-xs sm:text-sm"
                >
                  <Send size={18} />
                  <span>টেলিগ্রামে মেসেজ দিন</span>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm pt-2 bg-emerald-50 py-3.5 px-4 rounded-2xl border border-emerald-200"
                >
                  <CheckCircle2 size={20} className="shrink-0 text-emerald-600" /> 
                  <span>{successMsg || 'ধন্যবাদ! আপনার বুকিং রিকোয়েস্ট সফলভাবে জমা হয়েছে।'}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>

      {/* Pop-up Modal for selecting all categories and services */}
      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 shadow-2xl relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-100/70 px-2.5 py-0.5 rounded-full mb-1">
                    <Sparkles size={12} />
                    <span>১৮টি ক্যাটাগরি ও সমস্ত সার্ভিস তালিকা</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    কোন সেবাটি পেতে চান? বেছে নিন
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    যেকোনো সেবায় ক্লিক করলেই তা স্বয়ংক্রিয়ভাবে বুকিং ফর্মে যুক্ত হবে।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="p-2 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer border border-slate-200 shrink-0 ml-3"
                  aria-label="পপআপ বন্ধ করুন"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search Bar in Modal */}
              <div className="p-4 sm:px-6 bg-white border-b border-slate-100">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-blue-500">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    value={popupSearch}
                    onChange={(e) => setPopupSearch(e.target.value)}
                    placeholder="ক্যাটাগরি বা সেবার নাম লিখুন (যেমন: মোবাইল, ইউটিউব, ভিডিও, বাইনান্স, থ্রিডি...)"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition shadow-xs"
                    autoFocus
                  />
                  {popupSearch && (
                    <button
                      type="button"
                      onClick={() => setPopupSearch('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Category Pills inside Modal */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 scrollbar-none text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedCatFilter('ALL')}
                    className={`px-3 py-1 rounded-lg font-bold shrink-0 transition cursor-pointer ${
                      selectedCatFilter === 'ALL'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    সব ক্যাটাগরি ({categoriesList.length})
                  </button>
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCatFilter(cat)}
                      className={`px-3 py-1 rounded-lg font-bold shrink-0 transition cursor-pointer ${
                        selectedCatFilter === cat
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service List in Modal */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
                {filteredGroups.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    &quot;{popupSearch}&quot; এর জন্য কোনো সেবা পাওয়া যায়নি।
                  </div>
                ) : (
                  filteredGroups.map(([category, items]) => (
                    <div key={category} className="space-y-2.5">
                      <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-800">
                          {category}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-bold ml-auto">
                          {items.length}টি সেবা
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {items.map((item) => {
                          const isSelected = service === item.title;
                          return (
                            <button
                              key={item.title}
                              type="button"
                              onClick={() => handleSelectServiceFromPopup(item.title)}
                              className={`text-left p-3 rounded-2xl border transition flex items-start gap-3 cursor-pointer group ${
                                isSelected
                                  ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500/50'
                                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-300'
                              }`}
                            >
                              <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition mt-0.5 text-slate-700 group-hover:text-blue-600">
                                {item.icon}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <h5 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                                    {item.title}
                                  </h5>
                                  {isSelected && (
                                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                                      <Check size={12} /> নির্বাচিত
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                                  {item.desc}
                                </p>
                                {item.delivery && (
                                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mt-1.5">
                                    <Clock size={11} className="text-blue-500" />
                                    <span>{item.delivery}</span>
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
                <span>পছন্দের সেবায় ক্লিক করলেই সিলেক্ট হবে</span>
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

'use client';
import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, Link2, Download, Copy, Check, Sparkles, RefreshCw, 
  Share2, Wifi, MessageSquare, Globe, FileText, ArrowRight, Wand2,
  Play, ExternalLink, Video, Film, Smartphone, X, Eye, Monitor, Send
} from 'lucide-react';

export interface ShortenedMediaItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  slug: string;
  type: 'youtube-short' | 'youtube' | 'vimeo' | 'direct-video' | 'web';
  embedUrl: string;
  title: string;
  createdAt: string;
  clicks: number;
}

function parseMediaUrl(url: string, customTitle?: string): {
  type: 'youtube-short' | 'youtube' | 'vimeo' | 'direct-video' | 'web';
  embedUrl: string;
  title: string;
} {
  const cleanUrl = url.trim();

  // YouTube Shorts check: e.g. youtube.com/shorts/{id} or youtu.be/shorts/{id}
  const ytShortMatch = cleanUrl.match(/(?:youtube\.com\/shorts\/|youtu\.be\/shorts\/)([a-zA-Z0-9_-]+)/i);
  if (ytShortMatch && ytShortMatch[1]) {
    const videoId = ytShortMatch[1].split('?')[0];
    return {
      type: 'youtube-short',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
      title: customTitle || 'ইউটিউব শর্টস (YouTube Shorts)'
    };
  }

  // General YouTube check: youtube.com/watch?v={id} or youtu.be/{id} or youtube.com/embed/{id}
  const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
      title: customTitle || 'ইউটিউব ভিডিও (YouTube Video)'
    };
  }

  // Vimeo check: vimeo.com/{id}
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      title: customTitle || 'ভিমিও ভিডিও (Vimeo Video)'
    };
  }

  // Direct video file (.mp4, .webm, .ogg)
  if (/\.(mp4|webm|ogg)($|\?)/i.test(cleanUrl)) {
    return {
      type: 'direct-video',
      embedUrl: cleanUrl,
      title: customTitle || 'ডিরেক্ট ভিডিও / রিলস (Direct MP4)'
    };
  }

  // Default web / social link
  return {
    type: 'web',
    embedUrl: cleanUrl,
    title: customTitle || 'ওয়েবসাইট / সোশ্যাল পেজ লিংক'
  };
}

export default function LiveQrAndTools({ onSelectService }: { onSelectService?: (serviceName: string) => void }) {
  const [activeTab, setActiveTab] = useState<'qr' | 'link' | 'converter'>('qr');

  // QR Generator State
  const [qrType, setQrType] = useState<'url' | 'text' | 'telegram' | 'wifi'>('url');
  const [qrInput, setQrInput] = useState('https://careerandtech.com');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [tgUsername, setTgUsername] = useState('Isahakali32');

  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Link Shortener & Media Player State
  const [longUrl, setLongUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [linkCopiedId, setLinkCopiedId] = useState<string | null>(null);
  const [activePlayingMedia, setActivePlayingMedia] = useState<ShortenedMediaItem | null>(null);
  const [aspectMode, setAspectMode] = useState<'9:16' | '16:9'>('9:16');
  const [customLinkList, setCustomLinkList] = useState<ShortenedMediaItem[]>([
    {
      id: 'item-short-1',
      originalUrl: 'https://www.youtube.com/shorts/5v4pPkW1M6Y',
      shortUrl: 'https://ct.link/viral-short',
      slug: 'viral-short',
      type: 'youtube-short',
      embedUrl: 'https://www.youtube-nocookie.com/embed/5v4pPkW1M6Y?autoplay=1&rel=0',
      title: 'ভাইরাল টেক ভিডিও শর্টস (YouTube Shorts)',
      createdAt: 'এইমাত্র তৈরি',
      clicks: 1420
    },
    {
      id: 'item-short-2',
      originalUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      shortUrl: 'https://ct.link/promo-reel',
      slug: 'promo-reel',
      type: 'direct-video',
      embedUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'সিনেমেটিক প্রমোশন রিলস (MP4 Video)',
      createdAt: '১০ মিনিট আগে',
      clicks: 860
    },
    {
      id: 'item-short-3',
      originalUrl: 'https://careerandtech.com',
      shortUrl: 'https://ct.link/tech-hub',
      slug: 'tech-hub',
      type: 'web',
      embedUrl: 'https://careerandtech.com',
      title: 'ক্যারিয়ার অ্যান্ড টেক ডিজিটাল হাব (Web)',
      createdAt: '১ ঘণ্টা আগে',
      clicks: 3250
    }
  ]);

  // Preset Colors
  const colorPresets = [
    { name: 'ক্লাসিক ডার্ক', fg: '#0f172a', bg: '#ffffff' },
    { name: 'ব্র্যান্ড ব্লু', fg: '#2563eb', bg: '#eff6ff' },
    { name: 'এমারেল্ড গ্রিন', fg: '#059669', bg: '#ecfdf5' },
    { name: 'পার্পল ভায়োলেট', fg: '#7c3aed', bg: '#f5f3ff' },
    { name: 'রোজ পিঙ্ক', fg: '#e11d48', bg: '#fff1f2' }
  ];

  // Generate QR Code
  useEffect(() => {
    let active = true;
    let textToEncode = qrInput;
    if (qrType === 'wifi') {
      textToEncode = `WIFI:T:WPA;S:${wifiSsid};P:${wifiPass};;`;
    } else if (qrType === 'telegram') {
      const cleanUser = tgUsername.replace(/^@/, '').trim();
      textToEncode = cleanUser ? `https://t.me/${cleanUser}` : 'https://t.me/careerandtech';
    }

    if (!textToEncode.trim()) {
      Promise.resolve().then(() => {
        if (active) setQrDataUrl('');
      });
      return () => {
        active = false;
      };
    }

    QRCode.toDataURL(textToEncode, {
      width: 320,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('QR Gen error:', err);
      });

    return () => {
      active = false;
    };
  }, [qrInput, qrType, wifiSsid, wifiPass, tgUsername, fgColor, bgColor]);

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'career-and-tech-qrcode.png';
    link.href = qrDataUrl;
    link.click();
  };

  const handleCopyQr = async () => {
    if (!qrDataUrl) return;
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: copy link text
      await navigator.clipboard.writeText(qrInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCreateShortLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    // Sanitize custom slug if provided, otherwise random 6-char
    let slug = customSlug.trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!slug) {
      slug = Math.random().toString(36).substring(2, 8);
    }

    const generatedShortUrl = `https://ct.link/${slug}`;
    const parsed = parseMediaUrl(longUrl);

    const newItem: ShortenedMediaItem = {
      id: 'link-' + Date.now(),
      originalUrl: longUrl.trim(),
      shortUrl: generatedShortUrl,
      slug: slug,
      type: parsed.type,
      embedUrl: parsed.embedUrl,
      title: parsed.title,
      createdAt: 'এইমাত্র তৈরি',
      clicks: 1
    };

    setShortUrl(generatedShortUrl);
    setCustomLinkList(prev => [newItem, ...prev.filter(i => i.slug !== slug)]);
    setActivePlayingMedia(newItem);
    setCustomSlug('');

    if (parsed.type === 'youtube-short' || parsed.type === 'direct-video') {
      setAspectMode('9:16');
    } else {
      setAspectMode('16:9');
    }

    setTimeout(() => {
      const playerEl = document.getElementById('in-site-media-player');
      if (playerEl) {
        playerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 120);
  };

  const handleCopyText = (text: string, id: string = 'main') => {
    navigator.clipboard.writeText(text);
    setLinkCopiedId(id);
    setTimeout(() => setLinkCopiedId(null), 2500);
  };

  const handlePlayMedia = (item: ShortenedMediaItem) => {
    setActivePlayingMedia(item);
    if (item.type === 'youtube-short' || item.type === 'direct-video') {
      setAspectMode('9:16');
    } else {
      setAspectMode('16:9');
    }
    setTimeout(() => {
      const playerEl = document.getElementById('in-site-media-player');
      if (playerEl) {
        playerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const handleQuickBook = (serviceName: string) => {
    if (onSelectService) {
      onSelectService(serviceName);
    }
    const elem = document.getElementById('contact');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="qr-tools" className="py-14 bg-gradient-to-b from-slate-50 via-white to-blue-50/40 relative border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100/70 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles size={14} className="text-blue-600" />
            <span>ফ্রি লাইভ টুলস ও সার্ভিস হাব</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            স্মার্ট কিউআর কোড ও লিংক কনভার্টার
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            তাত্ক্ষণিকভাবে যেকোনো লিংক বা তথ্যের জন্য কালারফুল কিউআর কোড তৈরি করুন, বড় লিংক ছোট করুন অথবা ফাইল কনভার্সন সার্ভিস নিন।
          </p>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <QrCode size={16} />
            <span>লাইভ কিউআর কোড জেনারেটর</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer ${
              activeTab === 'link'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Link2 size={16} />
            <span>স্মার্ট শর্ট লিংক ও ইন-সাইট প্লেয়ার</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('converter')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer ${
              activeTab === 'converter'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <FileText size={16} />
            <span>ছবি ও ফাইল কনভার্সন</span>
          </button>
        </div>

        {/* Tab 1: Live QR Generator */}
        {activeTab === 'qr' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Form Options */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    কিউআর কোডের ধরন বেছে নিন
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => { setQrType('url'); setQrInput('https://careerandtech.com'); }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        qrType === 'url' ? 'bg-blue-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Globe size={13} /> ওয়েবসাইট লিংক
                    </button>
                    <button
                      type="button"
                      onClick={() => { setQrType('text'); setQrInput('আপনার যেকোনো মেসেজ বা টেক্সট'); }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        qrType === 'text' ? 'bg-blue-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <FileText size={13} /> টেক্সট / তথ্য
                    </button>
                    <button
                      type="button"
                      onClick={() => setQrType('telegram')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        qrType === 'telegram' ? 'bg-blue-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Send size={13} /> টেলিগ্রাম
                    </button>
                    <button
                      type="button"
                      onClick={() => setQrType('wifi')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        qrType === 'wifi' ? 'bg-blue-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Wifi size={13} /> ওয়াইফাই কোড
                    </button>
                  </div>
                </div>

                {/* Input Fields based on type */}
                {qrType === 'url' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                      ওয়েবসাইট বা সোশ্যাল লিংক লিখুন
                    </label>
                    <input
                      type="url"
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                      placeholder="https://facebook.com/yourpage অথবা যেকোনো লিংক"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                )}

                {qrType === 'text' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                      আপনার প্রয়োজনীয় টেক্সট বা বিবরণ
                    </label>
                    <textarea
                      rows={3}
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                      placeholder="যেকোনো টেক্সট, কন্টাক্ট ইনফো বা বিবরণ..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition resize-none"
                    />
                  </div>
                )}

                {qrType === 'telegram' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                        টেলিগ্রাম ইউজারনেম বা চ্যানেল লিংক
                      </label>
                      <input
                        type="text"
                        value={tgUsername}
                        onChange={(e) => setTgUsername(e.target.value)}
                        placeholder="যেমন: careerandtech অথবা @careerandtech"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                )}

                {qrType === 'wifi' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                        ওয়াইফাই নেটওয়ার্কের নাম (SSID)
                      </label>
                      <input
                        type="text"
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        placeholder="MyHomeWifi"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                        ওয়াইফাই পাসওয়ার্ড
                      </label>
                      <input
                        type="text"
                        value={wifiPass}
                        onChange={(e) => setWifiPass(e.target.value)}
                        placeholder="পাসওয়ার্ড লিখুন..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                )}

                {/* Color Customization */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    কালার থিম নির্বাচন করুন
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {colorPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setFgColor(preset.fg); setBgColor(preset.bg); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                          fgColor === preset.fg && bgColor === preset.bg
                            ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-200" style={{ backgroundColor: preset.fg }}></span>
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Live Preview Box */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Sparkles size={13} className="text-amber-500" />
                  লাইভ প্রিভিউ
                </span>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-md mb-4 flex items-center justify-center min-w-[200px] min-h-[200px]">
                  {Boolean(qrDataUrl && qrDataUrl.trim()) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={qrDataUrl || undefined} 
                      alt="Generated QR Code" 
                      className="w-48 h-48 rounded-lg transition transform hover:scale-105 duration-200" 
                    />
                  ) : (
                    <div className="text-xs text-slate-400">তথ্য লিখলেই কিউআর কোড দেখা যাবে</div>
                  )}
                </div>

                <div className="text-xs text-slate-500 font-medium mb-4">
                  স্মার্টফোন ক্যামেরা দিয়ে সরাসরি স্ক্যান করে টেস্ট করুন
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Download size={14} />
                    <span>ডাউনলোড (PNG)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyQr}
                    className="flex-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                  </button>
                </div>

                {/* Custom Branded Request CTA */}
                <div className="mt-4 pt-3 border-t border-slate-200 w-full text-left">
                  <button
                    type="button"
                    onClick={() => handleQuickBook('কাস্টম ও কালারফুল কিউআর কোড (QR Code)')}
                    className="w-full text-left p-2.5 rounded-xl bg-blue-50/80 hover:bg-blue-100 border border-blue-200/60 transition group flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <p className="text-[11px] font-extrabold text-blue-900">লোগো সহ কাস্টম ডাইনামিক কিউআর চান?</p>
                      <p className="text-[10px] text-blue-700 font-medium">প্রিন্ট-রেডি ভেক্টর ও স্ক্যান ট্র্যাকিং সহ তৈরি করে নিন</p>
                    </div>
                    <ArrowRight size={14} className="text-blue-600 group-hover:translate-x-1 transition shrink-0" />
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* Tab 2: Smart Link Shortener & In-Site Video/Web Player */}
        {activeTab === 'link' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-4xl mx-auto"
          >
            {/* Shortener Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
              <div className="text-center max-w-2xl mx-auto mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
                  <Play size={13} className="text-emerald-600 fill-emerald-600" />
                  <span>স্মার্ট শর্ট লিংক ও সরাসরি সাইটে প্লে সিস্টেম</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  স্মার্ট শর্ট লিংক তৈরি করুন
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  যেকোনো বড় ও জটিল ওয়েবসাইট বা সোশ্যাল মিডিয়া লিংক সহজেই ছোট ও কাস্টমাইজ করুন। আপনি বা আপনার অডিয়েন্স যে ভিডিও বা ওয়েব লিংক দিবে, তা সরাসরি আমাদের ওয়েবসাইটেই লাইভ প্লে ও প্রিভিউ হবে!
                </p>
              </div>

              {/* Quick Preset Test Links */}
              <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">দ্রুত টেস্ট করুন:</span>
                <button
                  type="button"
                  onClick={() => {
                    setLongUrl('https://www.youtube.com/shorts/5v4pPkW1M6Y');
                    setCustomSlug('viral-tech-short');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200/60 transition cursor-pointer"
                >
                  <Film size={12} className="text-red-600" />
                  <span>▶ ইউটিউব শর্টস টেস্ট</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLongUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                    setCustomSlug('speed-promo-reel');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200/60 transition cursor-pointer"
                >
                  <Video size={12} className="text-purple-600" />
                  <span>▶ ভিডিও রিলস (MP4) টেস্ট</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLongUrl('https://careerandtech.com');
                    setCustomSlug('career-demo-page');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200/60 transition cursor-pointer"
                >
                  <Globe size={12} className="text-blue-600" />
                  <span>🌐 ওয়েবসাইট টেস্ট</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateShortLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    বড় লিংক বা শর্ট ভিডিও ইউআরএল পেস্ট করুন <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      placeholder="যেমন: https://www.youtube.com/shorts/... বা যেকোনো ভিডিও/ওয়েব লিংক"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3.5 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                    {longUrl && (
                      <button
                        type="button"
                        onClick={() => setLongUrl('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        title="ক্লিয়ার করুন"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    ইউটিউব শর্টস (Shorts), সাধারণ ভিডিও, ফেসবুক/ইনস্টাগ্রাম ভিডিও, ভিমিও বা যেকোনো ওয়েবসাইট লিংক সাপোর্ট করে।
                  </p>
                </div>

                {/* Custom Alias Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    কাস্টম শর্ট স্লাগ (ঐচ্ছিক নাম)
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50 focus-within:border-blue-600 focus-within:bg-white transition">
                    <span className="inline-flex items-center px-4 bg-slate-100 text-slate-600 font-mono text-xs font-bold border-r border-slate-200 select-none">
                      https://ct.link/
                    </span>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      placeholder="যেমন: my-short-video, promo26 (খালি রাখলে অটো তৈরি হবে)"
                      className="flex-1 bg-transparent px-4 py-3 text-slate-900 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold py-3.5 px-6 rounded-xl text-sm transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play size={16} className="fill-white" />
                    <span>স্মার্ট শর্ট লিংক বানান ও সরাসরি সাইটে প্লে করুন ✨</span>
                  </button>
                </div>
              </form>

              {/* Just Created Success Card */}
              {shortUrl && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="text-left w-full sm:w-auto">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                        আপনার স্মার্ট শর্ট লিংক সফলভাবে তৈরি হয়েছে!
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-emerald-950 font-mono">
                        {shortUrl}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleCopyText(shortUrl, 'short-header')}
                      className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      {linkCopiedId === 'short-header' ? <Check size={14} /> : <Copy size={14} />}
                      <span>{linkCopiedId === 'short-header' ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
                    </button>

                    {activePlayingMedia && (
                      <button
                        type="button"
                        onClick={() => handlePlayMedia(activePlayingMedia)}
                        className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Play size={14} className="fill-white" />
                        <span>সাইটে প্লে করুন</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setQrType('url');
                        setQrInput(shortUrl);
                        setActiveTab('qr');
                      }}
                      className="flex-1 sm:flex-initial bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <QrCode size={13} />
                      <span>কিউআর কোড</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* In-Site Live Interactive Media Player */}
            {activePlayingMedia && (
              <motion.div 
                id="in-site-media-player"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden"
              >
                {/* Player Top Bar */}
                <div className="bg-slate-900/90 px-4 sm:px-6 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {activePlayingMedia.type === 'youtube-short' ? (
                      <span className="inline-flex items-center gap-1.5 bg-red-600/90 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        <Film size={13} />
                        <span>ইউটিউব শর্টস লাইভ প্লেয়ার</span>
                      </span>
                    ) : activePlayingMedia.type === 'direct-video' ? (
                      <span className="inline-flex items-center gap-1.5 bg-purple-600/90 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        <Smartphone size={13} />
                        <span>রিলস / ভিডিও প্লেয়ার</span>
                      </span>
                    ) : activePlayingMedia.type === 'youtube' ? (
                      <span className="inline-flex items-center gap-1.5 bg-red-600/90 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        <Video size={13} />
                        <span>ইউটিউব ভিডিও প্লেয়ার</span>
                      </span>
                    ) : activePlayingMedia.type === 'vimeo' ? (
                      <span className="inline-flex items-center gap-1.5 bg-sky-600/90 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        <Video size={13} />
                        <span>ভিমিও প্লেয়ার</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-blue-600/90 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                        <Globe size={13} />
                        <span>ওয়েবসাইট প্রিভিউ</span>
                      </span>
                    )}

                    <span className="text-xs sm:text-sm font-bold text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                      {activePlayingMedia.title}
                    </span>
                  </div>

                  {/* Player Controls & Aspect Ratio Switcher */}
                  <div className="flex items-center gap-2">
                    {(activePlayingMedia.type === 'youtube-short' || activePlayingMedia.type === 'direct-video') && (
                      <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                        <button
                          type="button"
                          onClick={() => setAspectMode('9:16')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                            aspectMode === '9:16'
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          📱 শর্ট (9:16)
                        </button>
                        <button
                          type="button"
                          onClick={() => setAspectMode('16:9')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                            aspectMode === '16:9'
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          💻 ওয়াইড (16:9)
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setActivePlayingMedia(null)}
                      className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                      title="প্লেয়ার বন্ধ করুন"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Player Screen View */}
                <div className="p-4 sm:p-8 flex items-center justify-center bg-radial from-slate-900 to-black min-h-[360px]">
                  {/* YouTube Shorts / Standard YouTube */}
                  {(activePlayingMedia.type === 'youtube-short' || activePlayingMedia.type === 'youtube') && Boolean(activePlayingMedia.embedUrl?.trim()) && (
                    <div 
                      className={`relative w-full transition-all duration-300 ${
                        aspectMode === '9:16' && activePlayingMedia.type === 'youtube-short'
                          ? 'max-w-[320px] aspect-[9/16] rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden bg-black'
                          : 'max-w-3xl aspect-video rounded-2xl border border-slate-800 shadow-2xl overflow-hidden bg-black'
                      }`}
                    >
                      <iframe
                        src={activePlayingMedia.embedUrl}
                        title={activePlayingMedia.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Vimeo */}
                  {activePlayingMedia.type === 'vimeo' && Boolean(activePlayingMedia.embedUrl?.trim()) && (
                    <div className="w-full max-w-3xl aspect-video rounded-2xl border border-slate-800 shadow-2xl overflow-hidden bg-black">
                      <iframe
                        src={activePlayingMedia.embedUrl}
                        title={activePlayingMedia.title}
                        className="w-full h-full border-0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Direct MP4 / Video */}
                  {activePlayingMedia.type === 'direct-video' && Boolean((activePlayingMedia.embedUrl || activePlayingMedia.originalUrl)?.trim()) && (
                    <div 
                      className={`relative w-full transition-all duration-300 ${
                        aspectMode === '9:16'
                          ? 'max-w-[320px] aspect-[9/16] rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden bg-black'
                          : 'max-w-3xl aspect-video rounded-2xl border border-slate-800 shadow-2xl overflow-hidden bg-black'
                      }`}
                    >
                      <video
                        src={activePlayingMedia.embedUrl || activePlayingMedia.originalUrl}
                        controls
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-contain bg-black"
                      />
                    </div>
                  )}

                  {/* Web Page Live Simulation */}
                  {activePlayingMedia.type === 'web' && Boolean(activePlayingMedia.originalUrl?.trim()) && (
                    <div className="w-full max-w-3xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                      {/* Browser address bar */}
                      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        </div>
                        <div className="flex-1 bg-slate-950/80 rounded-lg px-3 py-1 text-xs font-mono text-emerald-400 flex items-center justify-between border border-slate-700/60">
                          <span className="truncate">🔒 {activePlayingMedia.shortUrl}</span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider ml-2">লাইভ সিমুলেটর</span>
                        </div>
                        <a
                          href={activePlayingMedia.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white p-1"
                          title="আসল সাইটে যান"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>

                      <div className="h-96 relative bg-white overflow-hidden">
                        <iframe
                          src={activePlayingMedia.originalUrl}
                          title={activePlayingMedia.title}
                          className="w-full h-full border-0"
                          sandbox="allow-scripts allow-same-origin allow-forms"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Player Bottom Bar / Actions */}
                <div className="bg-slate-900 px-4 sm:px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">শর্ট লিংক:</span>
                    <span className="font-mono text-sm font-bold text-blue-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                      {activePlayingMedia.shortUrl}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleCopyText(activePlayingMedia.shortUrl, 'player-bar')}
                      className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {linkCopiedId === 'player-bar' ? <Check size={14} /> : <Copy size={14} />}
                      <span>{linkCopiedId === 'player-bar' ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setQrType('url');
                        setQrInput(activePlayingMedia.shortUrl);
                        setActiveTab('qr');
                      }}
                      className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <QrCode size={14} />
                      <span>কিউআর বানান</span>
                    </button>

                    <a
                      href={activePlayingMedia.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink size={14} />
                      <span>আসল লিংকে ওপেন</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recently Shortened & Saved Links Collection */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" />
                    <span>সাইটে সরাসরি প্লে করার জন্য প্রস্তুত শর্ট লিংকসমূহ</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    যেকোনো লিংকের পাশে &apos;সাইটে প্লে করুন&apos; বাটনে ক্লিক করলেই উপরের প্লেয়ারে ভিডিও চলবে।
                  </p>
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full self-start sm:self-auto border border-blue-200/60">
                  মোট {customLinkList.length} টি শর্ট লিংক
                </span>
              </div>

              <div className="space-y-3">
                {customLinkList.map((item) => {
                  const isCurrent = activePlayingMedia?.slug === item.slug;
                  return (
                    <div 
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                        isCurrent 
                          ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-2 ring-blue-500/20' 
                          : 'bg-slate-50/70 hover:bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          item.type === 'youtube-short' 
                            ? 'bg-red-100 text-red-600'
                            : item.type === 'direct-video'
                            ? 'bg-purple-100 text-purple-600'
                            : item.type === 'youtube'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {item.type === 'youtube-short' ? (
                            <Film size={20} />
                          ) : item.type === 'direct-video' ? (
                            <Smartphone size={20} />
                          ) : item.type === 'youtube' ? (
                            <Video size={20} />
                          ) : (
                            <Globe size={20} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h5 className="font-extrabold text-sm text-slate-900 truncate">
                              {item.title}
                            </h5>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 uppercase">
                              {item.type === 'youtube-short' ? 'YouTube Short' : item.type === 'direct-video' ? 'Reel Video' : item.type}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              • {item.clicks} ভিউ
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-mono font-bold text-blue-700">
                              {item.shortUrl}
                            </span>
                            <span className="text-slate-400 text-[10px] truncate max-w-[200px] sm:max-w-xs">
                              ({item.originalUrl})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Item Action Buttons */}
                      <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                        <button
                          type="button"
                          onClick={() => handlePlayMedia(item)}
                          className={`font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                            isCurrent
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          <Play size={13} className="fill-white" />
                          <span>{isCurrent ? 'এখন চলছে' : 'সাইটে প্লে করুন'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyText(item.shortUrl, item.id)}
                          className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold p-2 rounded-xl text-xs transition cursor-pointer"
                          title="লিংক কপি করুন"
                        >
                          {linkCopiedId === item.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setQrType('url');
                            setQrInput(item.shortUrl);
                            setActiveTab('qr');
                          }}
                          className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold p-2 rounded-xl text-xs transition cursor-pointer"
                          title="কিউআর কোড তৈরি করুন"
                        >
                          <QrCode size={14} />
                        </button>

                        <a
                          href={item.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold p-2 rounded-xl text-xs transition"
                          title="আসল লিংক খুলুন"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Bio Link / Linktree Promotion */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-200 block mb-1">
                  প্রফেশনাল কাস্টম বায়ো পেজ
                </span>
                <h4 className="font-black text-xl sm:text-2xl tracking-tight">
                  সোশ্যাল মিডিয়ার জন্য কাস্টম বায়ো লিংক (Linktree) চান?
                </h4>
                <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
                  একটিমাত্র শর্ট লিংকের ভেতরে আপনার ইউটিউব ভিডিও, ফেসবুক পেজ, রিলস, টেলিগ্রাম, ইমেইল এবং প্রোডাক্ট ক্যাটালগ সরাসরি প্লে ও শোকেস করে নিন।
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleQuickBook('স্মার্ট শর্ট লিংক ও বায়ো লিংক (Short URL & Bio Link)')}
                className="bg-white hover:bg-blue-50 text-blue-700 font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg transition whitespace-nowrap cursor-pointer hover:scale-105 duration-200 shrink-0"
              >
                বায়ো পেজ বানিয়ে নিন →
              </button>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Photo & File Conversion Services Quick Grid */}
        {activeTab === 'converter' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                    <Wand2 size={20} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">ছবি এনহ্যান্স ও ব্যাকগ্রাউন্ড রিমুভ</h4>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    ঝাপসা ছবি আল্ট্রা এইচডি ৪কে রেজোলিউশনে রূপান্তর ও হেয়ার-টু-হেয়ার নিখুঁত ব্যাকগ্রাউন্ড রিমুভাল।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickBook('ছবি এনহ্যান্সমেন্ট ও ব্যাকগ্রাউন্ড রিমুভ')}
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  সেবাটি নিন
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <FileText size={20} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">পিডিএফ ⇄ ওয়ার্ড/এক্সেল কনভার্ট</h4>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    ১০০% ফন্ট, টেবিল ও লেআউট ঠিক রেখে যেকোনো ডকুমেন্ট ও ফাইলের নিখুঁত এডিটেবল রূপান্তর।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickBook('সব ধরনের ফাইল ও ডকুমেন্ট কনভার্ট')}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  সেবাটি নিন
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                    <QrCode size={20} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">ছবি ও ফাইল টু কিউআর কোড</h4>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    যেকোনো ছবি, পোর্টফোলিও বা পিডিএফ স্ক্যানযোগ্য পার্মানেন্ট কিউআর কোডে রূপান্তর।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickBook('ছবি ও ফাইল টু কিউআর কনভার্ট (File to QR)')}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  সেবাটি নিন
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <Share2 size={20} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">ভিডিও টু অডিও ও জিআইএফ</h4>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    হাই-কোয়ালিটি ৩২০ কেবিপিএস MP3 অডিও এক্সট্র্যাক্ট এবং অ্যানিমেটেড জিআইএফ ব্যানার কনভার্সন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickBook('ভিডিও টু অডিও ও জিআইএফ কনভার্ট')}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  সেবাটি নিন
                </button>
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}

'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import SuccessStories from '@/components/SuccessStories';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SocialLinks from '@/components/SocialLinks';
import ServicesSearch from '@/components/ServicesSearch';
import UserDataPanel from '@/components/UserDataPanel';
import TopLiveConnect from '@/components/TopLiveConnect';
import LiveQrAndTools from '@/components/LiveQrAndTools';

export default function Home() {
  const [submissions, setSubmissions] = useState<any[]>([
    {
      name: 'নাজমুল হাসান',
      projectName: 'ইউটিউব ভিডিও থাম্বনেইল প্রজেক্ট',
      category: 'ইউটিউব ও ভিডিও এডিটিং',
      description: 'গেমিং চ্যানেলের জন্য প্রিমিয়াম ৪কে থাম্বনেইল ডিজাইন ফাইল।',
      fileName: 'gaming-thumbnail-design.png',
      imageUrl: 'https://picsum.photos/seed/design1/400/300',
      fileType: 'image/png'
    },
    {
      name: 'সাবরিনা জাহান',
      projectName: 'স্মার্ট কিউআর আইডি কার্ড প্রজেক্ট',
      category: 'আইডি কার্ড ও ডিজিটাল সেবা',
      description: 'অফিসিয়াল আইডি কার্ড প্রিন্ট ফাইল ও কিউআর ভিজিটিং কার্ড।',
      fileName: 'id-card-sample.png',
      imageUrl: 'https://picsum.photos/seed/design2/400/300',
      fileType: 'image/png'
    }
  ]);
  const [reviews, setReviews] = useState<any[]>([
    {
      name: 'নাজমুল হাসান',
      category: 'ইউটিউব ও ভিডিও এডিটিং',
      rating: 5,
      comment: 'খুবই দ্রুত সময়ে আমার চ্যানেলের জন্য এসইও এবং প্রিমিয়াম থাম্বনেইল তৈরি করে দিয়েছেন। কাজের মান দুর্দান্ত!',
      fileName: 'youtube-seo-pack.png',
      time: 'আজ, ১১:০০ AM'
    },
    {
      name: 'সাবরিনা জাহান',
      category: 'আইডি কার্ড ও ডিজিটাল সেবা',
      rating: 5,
      comment: 'আমাদের অর্গানাইজেশনের কিউআর আইডি কার্ড নিখুঁতভাবে প্রিন্ট-রেডি ফরমেটে পেয়েছি। অনেক ধন্যবাদ!',
      fileName: 'smart-id-card-sample.pdf',
      time: 'গতকাল, ৫:২০ PM'
    }
  ]);
  const [bookings, setBookings] = useState<any[]>([
    {
      name: 'তানভীর আহমেদ',
      phone: '@tanvir_pro',
      service: 'মোবাইল ও অ্যাপের ছোটখাটো সমস্যা',
      category: 'মোবাইল ও সফটওয়্যার সমস্যা সমাধান',
      details: 'প্লে স্টোর থেকে অ্যাপ ডাউনলোড হচ্ছে না এবং সিস্টেম ল্যাগ করছে।',
      time: 'আজ, ১০:১৫ AM',
      status: 'প্রসেসিং হচ্ছে'
    },
    {
      name: 'ফারজানা আক্তার',
      phone: 'farjana.tech@gmail.com',
      service: 'ইউটিউব গ্রোথ ও মনিটাইজেশন',
      category: 'সোশ্যাল মিডিয়া ও এডিটিং',
      details: 'নতুন চ্যানেলের ভিডিও এসইও ও থাম্বনেইল কাস্টমাইজেশন দরকার।',
      time: 'গতকাল, ৪:৩০ PM',
      status: 'সম্পন্ন'
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState('');

  return (
    <main className="min-h-screen lg:pl-64">
      <TopLiveConnect />
      <Sidebar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Hero />
      <WhyUs />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">আমাদের সাথে যুক্ত হোন</h2>
        <SocialLinks />
        <ServicesSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </section>

      <Services 
        searchQuery={searchQuery} 
        onSelectService={(s) => setSelectedServiceForBooking(s)} 
      />

      {/* Interactive Live QR Code & Link Converter Tools (সার্ভিস কার্ডগুলোর নিচে) */}
      <LiveQrAndTools onSelectService={(s) => setSelectedServiceForBooking(s)} />
      


      <Contact 
        preSelectedService={selectedServiceForBooking} 
        onAddBooking={(b) => setSubmissions([b, ...submissions])}
      />
      
      {/* Public Data Panel (ইউজার সাবমিটেড ডাটা প্যানেল) */}
      <UserDataPanel 
        submissions={submissions} 
        reviews={reviews} 
        onAddReview={(r) => setReviews([r, ...reviews])}
      />

      {/* ক্লায়েন্ট সন্তুষ্টি ও অর্জনের পরিসংখ্যান */}
      <SuccessStories />

      <Footer />
    </main>
  );
}

import type { Metadata, Viewport } from 'next';
import { Hind_Siliguri } from 'next/font/google';
import './globals.css';
import ProgressBar from '@/components/ProgressBar';

const hindSiliguri = Hind_Siliguri({
  weight: ['400', '500', '600', '700'],
  subsets: ['bengali', 'latin'],
  display: 'swap',
});

const logoUrl = 'https://res.cloudinary.com/dlklqihg6/image/upload/v1792753706/vvjv3wjprybjvtfvtwmi.png';

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Career & Tech BD | IM Softworks',
  description: 'আপনার বিশ্বাসযোগ্য ডিজিটাল সফটওয়্যার ও ক্যারিয়ার সলিউশন প্ল্যাটফর্ম।',
  icons: {
    icon: logoUrl,
    shortcut: logoUrl,
    apple: logoUrl,
  },
  openGraph: {
    title: 'Career & Tech BD | IM Softworks',
    description: 'আপনার বিশ্বাসযোগ্য ডিজিটাল সফটওয়্যার ও ক্যারিয়ার সলিউশন প্ল্যাটফর্ম।',
    images: [{ url: logoUrl }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'C&T BD',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <link rel="icon" href={logoUrl} />
        <link rel="apple-touch-icon" href={logoUrl} />
      </head>
      <body className={`${hindSiliguri.className} text-slate-900 antialiased bg-white`}>
        <ProgressBar />
        {children}
      </body>
    </html>
  );
}

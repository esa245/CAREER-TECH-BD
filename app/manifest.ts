import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Career & Tech BD - IM Softworks',
    short_name: 'C&T BD',
    description: 'আপনার বিশ্বাসযোগ্য ডিজিটাল সফটওয়্যার ও ক্যারিয়ার সলিউশন প্ল্যাটফর্ম।',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: 'https://res.cloudinary.com/dlklqihg6/image/upload/v1792753706/vvjv3wjprybjvtfvtwmi.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'https://res.cloudinary.com/dlklqihg6/image/upload/v1792753706/vvjv3wjprybjvtfvtwmi.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'https://res.cloudinary.com/dlklqihg6/image/upload/v1792753706/vvjv3wjprybjvtfvtwmi.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}

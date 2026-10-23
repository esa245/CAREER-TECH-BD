'use client';
import { useState, useEffect } from 'react';

export default function ProgressBar() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setWidth(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 h-1 bg-blue-500 z-[100]" 
      style={{ width: `${width}%`, transition: 'width 0.1s ease-out' }} 
    />
  );
}

'use client';
import { useState } from 'react';
import { Star } from 'lucide-react';

export default function RatingSystem() {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="glass-card p-6 rounded-2xl text-center">
      <h3 className="text-lg font-bold text-white mb-4">আমাদের সেবা কেমন লাগলো?</h3>
      {!submitted ? (
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => { setRating(star); setSubmitted(true); }}
              className={`transition ${star <= rating ? 'text-yellow-400' : 'text-slate-600'}`}
            >
              <Star fill={star <= rating ? 'currentColor' : 'none'} size={32} />
            </button>
          ))}
        </div>
      ) : (
        <p className="text-emerald-400 font-semibold">ধন্যবাদ আপনার রেটিংয়ের জন্য!</p>
      )}
    </div>
  );
}

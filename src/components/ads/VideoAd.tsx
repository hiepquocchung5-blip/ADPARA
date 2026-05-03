import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, SkipForward, Volume2 } from 'lucide-react';

interface VideoAdProps {
  onComplete: (rewarded: boolean) => void;
  isRewarded?: boolean;
}

export default function VideoAd({ onComplete, isRewarded = false }: VideoAdProps) {
  const [timeLeft, setTimeLeft] = useState(isRewarded ? 10 : 5);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 0.5;
      });
    }, 50);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/5">
      {/* Mock Video Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-black">
        <motion.div
           animate={{ scale: [1, 1.1, 1] }}
           transition={{ repeat: Infinity, duration: 2 }}
           className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20"
        >
          <Play fill="white" size={32} className="ml-1" />
        </motion.div>
        <div className="mt-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">EPIC QUESTS AWAIT</h3>
          <p className="text-white/60 text-sm max-w-sm px-4 underline">Experience the next generation of survival gaming with ultra-realistic graphics.</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
        <motion.div 
          className="h-full bg-blue-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        {timeLeft > 0 && (
          <div className="bg-black/60 backdrop-blur-md text-white/80 px-4 py-2 rounded-full text-xs font-bold border border-white/10">
            Ad ends in {timeLeft}s
          </div>
        )}
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => onComplete(timeLeft <= 0 && isRewarded)}
          className={`group flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-xl backdrop-blur-md ${timeLeft <= 0 ? 'bg-white text-black hover:bg-blue-400 hover:text-white' : 'bg-white/20 text-white hover:bg-white hover:text-black border border-white/10'}`}
        >
          {timeLeft <= 0 && isRewarded ? 'Claim Reward' : 'Skip Now'}
          <SkipForward size={14} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/40 text-[10px] font-bold tracking-widest uppercase">
        <Volume2 size={12} />
        Advertisement
      </div>
    </div>
  );
}

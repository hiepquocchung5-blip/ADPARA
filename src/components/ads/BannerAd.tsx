import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BannerAdProps {
  id: string;
  label?: string;
}

export default function BannerAd({ id, label = "Premium Sponsored Feed" }: BannerAdProps) {
  const ads = [
    { title: 'GET FREE GEMS', desc: 'Download "Dragon Slayer X" now!', color: 'bg-indigo-600' },
    { title: 'LEVEL UP FAST', desc: 'Join the ultimate RPG adventure.', color: 'bg-rose-600' },
    { title: 'PLAY WITH FRIENDS', desc: 'Battle together in the arena.', color: 'bg-amber-600' },
  ];

  const randomAd = ads[Math.floor(Math.random() * ads.length)];
  const [showImage, setShowImage] = React.useState(false);

  useEffect(() => {
    // Inject the provided high-performance ad script
    const containerId = `ad-script-container-${id}`;
    const scriptContainer = document.getElementById(containerId);
    
    if (scriptContainer && scriptContainer.innerHTML === '') {
      const atOptionsScript = document.createElement('script');
      atOptionsScript.innerHTML = `
        atOptions = {
          'key' : '15d7c92e434af70497d906bd9984b5d7',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      `;
      
      const invokeScript = document.createElement('script');
      invokeScript.src = "//www.highperformanceformat.com/15d7c92e434af70497d906bd9984b5d7/invoke.js";
      invokeScript.async = true;

      scriptContainer.appendChild(atOptionsScript);
      scriptContainer.appendChild(invokeScript);
      setShowImage(true);
    }
  }, [id]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-8 bg-slate-900/80 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-indigo to-transparent opacity-50" />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-brand-indigo rounded-full animate-ping" />
          <div className="w-1 h-1 bg-brand-indigo rounded-full" />
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{label}</span>
      </div>
      
      {/* Placeholder for the script-injected ad */}
      <div id={`ad-script-container-${id}`} className="min-h-[60px] flex items-center justify-center transition-all duration-700">
        {!showImage && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-brand-indigo/30 border-t-brand-indigo rounded-full animate-spin" />
            <div className="text-slate-600 font-mono text-[9px] uppercase tracking-widest">Initialising Stream...</div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {!showImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full h-24 ${randomAd.color} rounded-lg flex items-center justify-between px-8 border border-white/10 shadow-lg cursor-pointer hover:brightness-110 transition-all`}
          >
            <div>
              <h4 className="text-xl font-black text-white italic tracking-tighter">{randomAd.title}</h4>
              <p className="text-white/80 text-sm font-medium">{randomAd.desc}</p>
            </div>
            <div className="bg-white text-black px-4 py-2 rounded font-bold text-xs uppercase tracking-widest">
              Install Now
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

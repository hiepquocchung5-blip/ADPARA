import React from 'react';
import { motion } from 'motion/react';

export default function BannerAd() {
  const ads = [
    { title: 'GET FREE GEMS', desc: 'Download "Dragon Slayer X" now!', color: 'bg-indigo-600' },
    { title: 'LEVEL UP FAST', desc: 'Join the ultimate RPG adventure.', color: 'bg-rose-600' },
    { title: 'PLAY WITH FRIENDS', desc: 'Battle together in the arena.', color: 'bg-amber-600' },
  ];

  const randomAd = ads[Math.floor(Math.random() * ads.length)];

  return (
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
  );
}

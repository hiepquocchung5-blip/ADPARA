import React from 'react';
import { useGame } from '../../context/GameContext';
import VideoAd from './VideoAd';
import DisplayAd from './DisplayAd';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Zap } from 'lucide-react';

export default function AdManager() {
  const { showAd, setShowAd, setIsPaused, addCoins, setLastAdReward, incrementAdCount, state } = useGame();

  const handleClose = (rewarded: boolean) => {
    incrementAdCount();
    if (rewarded) {
      addCoins(100);
      setLastAdReward("CLAIMED 100 COINS");
      setTimeout(() => setLastAdReward(null), 3000);
    }
    setShowAd(false);
    setIsPaused(false);
  };

  return (
    <AnimatePresence>
      {showAd && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl"
        >
          <div className="w-full max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-500/20 border border-rose-500/30 rounded-full flex items-center justify-center animate-pulse">
                  <ShieldAlert className="text-rose-500" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white italic tracking-tighter">TEMPORARY INTERRUPTION</h2>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Sponsored Sync</p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-brand-indigo font-black text-[10px] uppercase tracking-widest">AD REWARD</div>
                <div className="text-white text-xs font-bold leading-none">+10 Energy Shield</div>
              </div>
            </div>

            <div className="border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
               <VideoAd onComplete={handleClose} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bento-card bg-slate-900 flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="text-indigo-400" size={24} />
                 </div>
                 <div>
                   <p className="text-white text-sm font-bold">Watch to power up</p>
                   <p className="text-slate-400 text-[10px] font-medium">Temporary speed boost initialization.</p>
                 </div>
               </div>
               <div className="flex items-end self-end">
                <DisplayAd placementName="Sponsored Integration" />
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import React, { ReactNode } from 'react';
import { useGame } from '../../context/GameContext';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Play, Trophy, ChevronRight, LayoutGrid, Zap, ExternalLink, TrendingUp } from 'lucide-react';
import DisplayAd from '../ads/DisplayAd';

interface GameContainerProps {
  gameId: string;
  title: string;
  children: ReactNode;
  onExit: () => void;
}

export default function GameContainer({ gameId, title, children, onExit }: GameContainerProps) {
  const { isPaused, setIsPaused, state, playtime, adTimer, lastAdReward, triggerAd } = useGame();

  const currentLevel = state.currentLevel[gameId] || 1;

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950">
      {/* HUD */}
      <div className="flex items-center justify-between px-8 py-5 bg-slate-900 border-b border-slate-800 backdrop-blur-md z-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={onExit}
            className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-400 hover:text-white border border-transparent hover:border-slate-700"
          >
            <LayoutGrid size={18} />
          </button>
          <div className="h-8 w-px bg-slate-800" />
          <div>
             <h1 className="text-xl font-black text-white italic tracking-tighter leading-none">{title}</h1>
             <div className="flex items-center gap-2 mt-1.5 focus:outline-none">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-widest ${currentLevel === 4 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20'}`}>
                  Level {currentLevel} • {currentLevel === 4 ? 'BOSS WAVE' : 'STABLE'}
                </span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
           <div className="hidden md:flex items-center gap-6">
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Currency</p>
                <div className="flex items-center gap-1.5">
                   <p className="text-sm font-black text-amber-400 tabular-nums leading-none">{state.coins.toLocaleString()}</p>
                   <Zap size={12} className="text-amber-400 fill-amber-400" />
                </div>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Network Score</p>
                <div className="flex items-center gap-2">
                   <p className="text-lg font-black text-emerald-400 tabular-nums leading-none tracking-tight">{state.totalScore.toLocaleString()}</p>
                   <Trophy size={14} className="text-emerald-400" />
                </div>
             </div>
           </div>

           <div className="flex items-center gap-4">
             <div className="flex flex-col items-end gap-1">
                <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mr-1">AD SYNC {Math.max(0, 60 - adTimer)}s</p>
                <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-rose-500"
                      animate={{ width: `${(adTimer / 60) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                </div>
             </div>
             <button
               onClick={() => setIsPaused(!isPaused)}
               className="w-11 h-11 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all border border-slate-700 shadow-lg"
             >
               {isPaused ? <Play size={20} fill="white" /> : <Pause size={20} fill="white" />}
             </button>
           </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative flex-1 overflow-hidden bg-slate-950">
        <div className={`w-full h-full transition-all duration-700 ${isPaused ? 'blur-2xl scale-95 opacity-30 pointer-events-none' : 'blur-0 scale-100 opacity-100'}`}>
          {children}
        </div>

        {/* Reward Toast */}
        <AnimatePresence>
          {lastAdReward && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="absolute top-6 right-6 z-[60] bg-emerald-500 text-black px-6 py-3 rounded-2xl font-black italic tracking-tighter shadow-2xl flex items-center gap-3 border-2 border-emerald-400"
            >
              <Zap size={20} fill="black" />
              {lastAdReward}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-md"
            >
              <div className="bento-card bg-slate-900 shadow-3xl text-center max-w-sm w-full mx-4 border-slate-700">
                <div className="w-16 h-16 bg-brand-indigo/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-indigo/20">
                  <Pause size={32} className="text-brand-indigo" fill="currentColor" />
                </div>
                <h2 className="text-3xl font-black text-white italic tracking-tighter mb-2">SYSTEM PAUSED</h2>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Data transmission halted</p>
                
                {/* Pause Menu Ad */}
                <div className="mb-6 rounded-xl overflow-hidden border border-slate-800">
                   <DisplayAd placementName="Strategic Timeout Sponsored Content" />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsPaused(false)}
                    className="w-full py-4 bg-brand-indigo text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    Resume Core
                    <ChevronRight size={14} />
                  </button>
                  <button
                    onClick={() => triggerAd(true)}
                    className="w-full py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-emerald-500/30 transition-all"
                  >
                    Watch Ad for Bonus Coins
                  </button>
                  <button
                    onClick={onExit}
                    className="w-full py-3 bg-slate-800 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
                  >
                    Abort Stream
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky Bottom Ad */}
      <AnimatePresence>
        {isPaused && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 80, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-900 border-t border-slate-800 flex items-center justify-center px-4 overflow-hidden"
          >
            <div className="w-full max-w-4xl opacity-80 hover:opacity-100 transition-opacity">
               <DisplayAd placementName="Gameplay Data Stream Support" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistence Bar */}
      <div className="px-8 py-2 bg-slate-950 border-t border-slate-900 flex items-center justify-between">
         <div className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.3em] flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-brand-indigo/30 rounded-full" />
           Local persistence active • AdPara v4
         </div>
         <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-6">
           <a href="https://www.profitablecpmratenetwork.com/xvvd0kn7?key=85ad262230d9d09f0c0a3b6b441451c9" target="_blank" rel="noopener noreferrer" className="hover:text-brand-indigo transition-colors flex items-center gap-1">
             <ExternalLink size={10} />
             Partner Ads
           </a>
           <span>Latency: 2ms</span>
         </div>
      </div>
    </div>
  );
}

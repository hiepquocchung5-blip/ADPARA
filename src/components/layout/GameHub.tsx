import React from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'motion/react';
import { 
  Gamepad2, 
  Trophy, 
  Skull, 
  Sword, 
  Layers, 
  Brain, 
  CircleDollarSign,
  Play,
  Zap,
  TrendingUp
} from 'lucide-react';
import ExternalLink from '../shared/ExternalLink';

const GAMES = [
  {
    id: 'bullet-hell',
    title: 'Void Survivor',
    desc: 'Survive the endless swarm of cosmic entities.',
    icon: Skull,
    color: 'from-purple-600 to-indigo-700',
    accent: 'bg-purple-500',
    type: 'Bullet Hell',
  },
  {
    id: 'platformer',
    title: 'Neon Runner',
    desc: 'Leap across the data streams of a dying grid.',
    icon: Gamepad2,
    color: 'from-cyan-500 to-blue-600',
    accent: 'bg-cyan-400',
    type: 'Platformer',
  },
  {
    id: 'memory',
    title: 'Neural Link',
    desc: 'Match the fragmented memories before time collapses.',
    icon: Brain,
    color: 'from-amber-500 to-orange-600',
    accent: 'bg-amber-400',
    type: 'Puzzle',
  },
  {
    id: 'tower-defense',
    title: 'Core Breach',
    desc: 'Deploy tactical defenses against the system virus.',
    icon: Layers,
    color: 'from-emerald-500 to-teal-700',
    accent: 'bg-emerald-400',
    type: 'Strategy',
  },
  {
    id: 'clicker',
    title: 'Bit Miner Pro',
    desc: 'Optimize your mining rig for ultimate profit.',
    icon: CircleDollarSign,
    color: 'from-rose-500 to-pink-600',
    accent: 'bg-rose-400',
    type: 'Clicker',
  }
];

import BannerAd from '../ads/BannerAd';

export default function GameHub() {
  const { setCurrentGame, state, playtime, adTimer } = useGame();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar - extracted from design HTML patterns */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-8 hidden lg:flex">
        <div>
          <h1 className="text-xl font-black text-brand-indigo mb-6 tracking-tighter">ADPARA</h1>
          
          <div className="space-y-6">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Global Total Score</p>
              <div className="text-2xl font-bold text-slate-50 tabular-nums">
                {state.totalScore.toLocaleString()}
              </div>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Total Coins</p>
              <div className="flex items-center gap-2">
                 <div className="text-xl font-bold text-amber-500 tabular-nums">
                   {state.coins.toLocaleString()}
                 </div>
                 <Zap size={14} className="text-amber-500 fill-amber-400" />
              </div>
            </div>

            <div title="Revenue based on impressions, clicks, and game session length" className="cursor-help bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Estimated Ad Revenue</p>
              <div className="flex items-center justify-between">
                 <div className="text-xl font-bold text-emerald-500 tabular-nums">
                   $0.50
                 </div>
                 <div className="text-right">
                    <p className="text-[8px] text-emerald-600 font-black uppercase">Projected CPC</p>
                    <p className="text-[10px] text-emerald-400 font-bold">$0.12</p>
                 </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Active Playtime</p>
                <span className="text-[10px] text-rose-400 font-bold">IN {60 - adTimer}s</span>
              </div>
              <div className="text-lg font-bold text-slate-50">
                {Math.floor(playtime / 60)}m {playtime % 60}s
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-rose-500"
                  animate={{ width: `${(adTimer / 60) * 100}%` }}
                />
              </div>
              <p className="text-[9px] text-rose-500 font-semibold mt-1 uppercase tracking-widest">Ad limit approaching</p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3 flex items-center justify-between">
                Sponsored Hub
                <span className="text-[8px] bg-brand-indigo/20 text-brand-indigo px-1.5 py-0.5 rounded italic">PREMIUM</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <a 
                    key={i}
                    href={`https://partner-stream-${i}.example.com`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-brand-indigo/10 hover:border-brand-indigo/30 transition-all group active:scale-95"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-brand-indigo/20 group-hover:text-brand-indigo transition-colors border border-slate-600/50">
                        {i < 10 ? `0${i}` : i}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors">AD Link {i}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] text-slate-500 uppercase tracking-tighter">partner.v4</span>
                          <span className="text-[8px] text-emerald-500 font-bold bg-emerald-500/10 px-1 rounded truncateMax">+$0.0{i} EST</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-1 rounded bg-slate-700/30 text-slate-500 group-hover:text-brand-indigo group-hover:bg-brand-indigo/10 transition-all">
                      <TrendingUp size={12} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-4">
           <div>
             <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">Cloud Sync Status</p>
             <div className="flex items-center gap-2 text-xs text-emerald-400">
               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
               All progress synced
             </div>
           </div>
        </nav>

        <div className="mt-auto">
          <div className="bento-card bg-slate-900 border-dashed p-4">
             <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">Partner Link</p>
             <ExternalLink href="#" label="Visit Dev.Tools →" className="!w-full justify-between" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black text-white leading-none tracking-tighter italic">Available Sessions</h2>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-slate-400 text-sm">Select a data stream to begin simulation.</p>
                <div className="h-3 w-px bg-slate-800" />
                <a href="#" target="_blank" className="text-[10px] font-black text-brand-indigo hover:text-white transition-colors uppercase tracking-[0.2em] animate-pulse">
                  Sponsored Hub →
                </a>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-3 py-1.5 rounded-md border border-slate-700">Region: NA-East</span>
              <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-3 py-1.5 rounded-md border border-slate-700">Ver: 2.1.0-stable</span>
            </div>
          </header>

          <div className="mb-10">
            <BannerAd id="header" label="Top Entry Sponsored Stream" />
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[220px]"
          >
            {GAMES.map((game, idx) => {
              const isHero = idx === 0;
              return (
                <motion.div
                  key={game.id}
                  variants={item}
                  onClick={() => setCurrentGame(game.id)}
                  className={`bento-card bento-card-hover group relative cursor-pointer overflow-hidden flex flex-col justify-between ${
                    isHero ? 'md:col-span-2 md:row-span-1 lg:row-span-2 lg:col-span-2 !bg-gradient-to-br from-indigo-950 to-indigo-900 border-indigo-500/30' : ''
                  }`}
                >
                  {/* Hero Badge */}
                  {isHero && (
                    <div className="absolute top-6 right-6 flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md">
                       <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                       ACTIVE GAME
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`p-2 rounded-lg bg-slate-700/50 text-brand-indigo ${isHero ? 'bg-white/10 text-white' : ''}`}>
                         <game.icon size={20} />
                      </div>
                      <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                        game.id === 'memory' ? 'bg-purple-500/20 text-purple-400' :
                        game.id === 'tower-defense' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-brand-indigo/20 text-brand-indigo'
                      }`}>
                        Level {state.currentLevel[game.id] || 1}/4
                      </div>
                    </div>
                    
                    <h3 className={`${isHero ? 'text-4xl' : 'text-xl'} font-black text-white mb-2 leading-tight tracking-tight`}>
                      {game.title}
                    </h3>
                    <p className={`text-slate-400 text-sm leading-relaxed ${isHero ? 'text-slate-300 max-w-sm' : 'line-clamp-2'}`}>
                      {game.desc}
                    </p>
                  </div>

                  <div className="mt-4">
                    {isHero ? (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest italic">Boss Alert: Void Weaver (Lvl 4)</span>
                           <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">45% Complete</span>
                        </div>
                        <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                           <div className="h-full bg-brand-indigo w-[45%]" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
                           <span className="text-xs font-bold text-white">Online</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-brand-indigo group-hover:text-white transition-all">
                           <Play size={14} fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Footer Ad Section */}
          <footer className="mt-12 pt-12 border-t border-slate-800 flex flex-col gap-10">
            <BannerAd id="footer" label="Bottom Page Placement v2" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Adsterra', type: 'Social Bar / Pop', status: 'High CPM' },
                { name: 'Yandex Ads', type: 'Global RTB', status: 'Verified' },
                { name: 'Unity Ads', type: 'Rewarded Video', status: 'Active' },
                { name: 'AppLovin', type: 'Header Bidding', status: 'Premium' }
              ].map((partner) => (
                <div key={partner.name} className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl flex items-center justify-between hover:bg-slate-800/40 transition-colors cursor-pointer group">
                  <div>
                    <p className="text-[10px] text-white font-bold group-hover:text-brand-indigo transition-colors">{partner.name}</p>
                    <p className="text-[8px] text-slate-500 uppercase font-medium">{partner.type}</p>
                  </div>
                  <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo uppercase tracking-widest">{partner.status}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 overflow-hidden border border-slate-800 rounded-2xl flex flex-col p-6 group hover:border-brand-indigo/30 transition-all cursor-pointer">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Sponsored Sequence</p>
                <h4 className="text-white font-bold mb-3 group-hover:text-brand-indigo transition-colors capitalize">Highest CPC Networks v4.2</h4>
                <div className="mt-auto">
                    <a href="#" target="_blank" className="text-brand-indigo text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-2">
                        Inspect Node <Zap size={10} />
                    </a>
                </div>
              </div>
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col p-6 group hover:border-brand-indigo/30 transition-all cursor-pointer">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">External Asset</p>
                <h4 className="text-white font-bold mb-3 group-hover:text-brand-indigo transition-colors capitalize">Optimized Video Stream Partners</h4>
                <div className="mt-auto">
                    <a href="#" target="_blank" className="text-brand-indigo text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-2">
                        Verify Script <TrendingUp size={10} />
                    </a>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col p-6 group hover:border-brand-indigo/30 transition-all cursor-pointer">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Global Marketplace</p>
                <h4 className="text-white font-bold mb-3 group-hover:text-brand-indigo transition-colors capitalize">Verified Ad Inventory Access</h4>
                <div className="mt-auto">
                    <a href="#" target="_blank" className="text-brand-indigo text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-2">
                        Connect API <Layers size={10} />
                    </a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-6 border-t border-slate-900 text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
              <div>AdPara Gaming Network • © 2026</div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Ad-Free Pro</a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

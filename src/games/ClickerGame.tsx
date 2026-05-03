import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'motion/react';
import { MousePointer2, Zap, TrendingUp, ShieldAlert, Cpu, HardDrive } from 'lucide-react';

const UPGRADES = [
  { id: 'auto', name: 'Auto-Runner', price: 15, baseDps: 1, icon: Cpu },
  { id: 'mult', name: 'Neural Link', price: 100, baseDps: 5, icon: HardDrive },
  { id: 'mega', name: 'Quantum Core', price: 500, baseDps: 25, icon: Zap },
];

export default function ClickerGame() {
  const { state, setTotalScore, updateLevel, isPaused } = useGame();
  const [bits, setBits] = useState(0);
  const [dps, setDps] = useState(0);
  const [upgrades, setUpgrades] = useState<Record<string, number>>({});
  const [clickValue, setClickValue] = useState(1);
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, text: string }[]>([]);
  const level = state.currentLevel['clicker'] || 1;

  // Boss stats
  const bossHp = [1000, 5000, 25000, 100000][level - 1];
  const [currentBossHp, setCurrentBossHp] = useState(bossHp);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      if (dps > 0) {
        setBits(b => b + dps / 10);
        setCurrentBossHp(hp => {
           const next = hp - dps / 10;
           if (next <= 0) {
             handleBossKill();
             return 0;
           }
           return next;
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, [dps, isPaused]);

  useEffect(() => {
    setCurrentBossHp(bossHp);
  }, [level]);

  const handleClick = (e: React.MouseEvent) => {
    if (isPaused) return;
    setBits(b => b + clickValue);
    setCurrentBossHp(hp => {
      const next = hp - clickValue;
      if (next <= 0) {
        handleBossKill();
        return 0;
      }
      return next;
    });

    const id = Date.now();
    setParticles(p => [...p, { id, x: e.clientX, y: e.clientY, text: `+${clickValue}` }]);
    setTimeout(() => setParticles(p => p.filter(item => item.id !== id)), 1000);
  };

  const handleBossKill = () => {
    const reward = level * 500;
    setTotalScore(state.totalScore + reward);
    if (level < 4) updateLevel('clicker', level + 1);
  };

  const buyUpgrade = (u: typeof UPGRADES[0]) => {
    const count = upgrades[u.id] || 0;
    const price = Math.floor(u.price * Math.pow(1.15, count));
    
    if (bits >= price) {
      setBits(b => b - price);
      setUpgrades(prev => ({ ...prev, [u.id]: count + 1 }));
      setDps(d => d + u.baseDps);
    }
  };

  return (
    <div className="w-full h-full flex bg-[#050505] overflow-hidden">
      {/* Sidebar - Upgrades */}
      <div className="w-80 bg-white/5 border-r border-white/10 p-6 space-y-4 overflow-y-auto">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-6 font-mono">System Upgrades</h2>
        {UPGRADES.map(u => {
          const count = upgrades[u.id] || 0;
          const price = Math.floor(u.price * Math.pow(1.15, count));
          const canAfford = bits >= price;

          return (
            <button
              key={u.id}
              onClick={() => buyUpgrade(u)}
              disabled={!canAfford}
              className={`w-full group p-4 rounded-2xl border transition-all text-left flex items-center gap-4 ${
                canAfford 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30' 
                  : 'bg-black/40 border-white/5 grayscale opacity-50 cursor-not-allowed'
              }`}
            >
              <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-blue-500/20 transition-colors`}>
                <u.icon size={20} className={canAfford ? 'text-blue-400' : 'text-white/20'} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-white leading-none">{u.name}</p>
                  <span className="text-[10px] font-black text-white/20">Lv.{count}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs font-mono text-emerald-400">${price}</span>
                  <span className="text-[10px] font-bold text-white/40">+{u.baseDps} DPS</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-12">
        {/* Boss HP Bar */}
        <div className="absolute top-12 w-full max-w-xl">
           <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2">
                 <ShieldAlert size={16} className="text-rose-500" />
                 <span className="text-xs font-black text-white uppercase tracking-widest italic">Sector Core HP</span>
              </div>
              <span className="text-xs font-mono text-white/60">{Math.ceil(currentBossHp).toLocaleString()} / {bossHp.toLocaleString()}</span>
           </div>
           <div className="h-2 bg-white/10 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-gradient-to-r from-rose-500 to-amber-500"
               animate={{ width: `${(currentBossHp / bossHp) * 100}%` }}
             />
           </div>
        </div>

        {/* The Clickable Core */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClick}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full group-hover:bg-blue-500/50 transition-all duration-500" />
          <div className="relative w-64 h-64 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-3xl p-1 shadow-[0_0_50px_rgba(59,130,246,0.2)] flex items-center justify-center overflow-hidden border border-white/20">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
             <div className="relative z-10 text-center pointer-events-none">
                <MousePointer2 size={64} className="text-white mb-2 mx-auto drop-shadow-lg" />
                <p className="text-xs font-black text-white/60 uppercase tracking-[0.2em] italic">Bit Extraction Point</p>
             </div>
          </div>
        </motion.div>

        {/* Bits Display */}
        <div className="mt-12 text-center">
           <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2">Total Bits Mined</div>
           <h3 className="text-6xl font-black text-white italic tracking-tighter tabular-nums mb-2 leading-none">
             {Math.floor(bits).toLocaleString()}
           </h3>
           <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                 <Zap size={12} className="text-amber-400" />
                 <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{dps} Bits/sec</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                 <TrendingUp size={12} className="text-emerald-400" />
                 <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Click: {clickValue}</span>
              </div>
           </div>
        </div>

        {/* Click Particles */}
        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: p.y, x: p.x }}
              animate={{ opacity: 0, y: p.y - 100 }}
              exit={{ opacity: 0 }}
              className="fixed pointer-events-none text-2xl font-black text-blue-400 italic z-[100] drop-shadow-lg"
            >
              {p.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Persistence Info */}
      <div className="absolute bottom-6 right-6 flex flex-col items-end pointer-events-none">
         <p className="text-[10px] font-black text-blue-500/40 uppercase tracking-widest">Current Sector</p>
         <h4 className="text-2xl font-black text-white italic tracking-tighter">Mining Delta {level}</h4>
      </div>
    </div>
  );
}

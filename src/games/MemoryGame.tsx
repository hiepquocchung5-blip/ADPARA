import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Star, Clock, Shuffle, CheckCircle2 } from 'lucide-react';

const ICONS = ['⭐', '🔥', '💧', '⚡', '🌌', '🧬', '🛸', '💎', '🍀', '🍎', '🌈', '🌙', '☀️', '🍄', '🍦', '🍕', '🚀', '👾'];

export default function MemoryGame() {
  const { state, setTotalScore, updateLevel, isPaused } = useGame();
  const level = state.currentLevel['memory'] || 1;
  const cardCount = level === 1 ? 12 : level === 2 ? 16 : level === 3 ? 24 : 32;

  const getNewGrid = () => {
    const pairs = ICONS.slice(0, cardCount / 2);
    const grid = [...pairs, ...pairs]
      .sort(() => Math.random() - 0.5)
      .map((icon, i) => ({ id: i, icon, flipped: false, matched: false }));
    return grid;
  };

  const [cards, setCards] = useState(getNewGrid());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(60);
  const [win, setWin] = useState(false);

  useEffect(() => {
    if (isPaused || win || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(t => t - 1);
    }, 1000);

    // Boss level Shuffle
    let shuffleInterval: any;
    if (level === 4) {
      shuffleInterval = setInterval(() => {
        setCards(prev => {
          const unmatched = prev.filter(c => !c.matched);
          const matched = prev.filter(c => c.matched);
          const shuffledUnmatched = [...unmatched].sort(() => Math.random() - 0.5);
          return [...matched, ...shuffledUnmatched].sort((a,b) => a.id - b.id);
        });
      }, 15000);
    }

    return () => {
      clearInterval(interval);
      if (shuffleInterval) clearInterval(shuffleInterval);
    };
  }, [isPaused, win, timer, level]);

  const handleFlip = (index: number) => {
    if (isPaused || flipped.length === 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setFlipped([...flipped, index]);

    if (flipped.length === 1) {
      setMoves(m => m + 1);
      const firstIndex = flipped[0];
      const secondIndex = index;

      if (cards[firstIndex].icon === cards[secondIndex].icon) {
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[firstIndex].matched = true;
          matchedCards[secondIndex].matched = true;
          setCards(matchedCards);
          setFlipped([]);
          
          if (matchedCards.every(c => c.matched)) {
            handleWin();
          }
        }, 500);
      } else {
        setTimeout(() => {
          const unflippedCards = [...newCards];
          unflippedCards[firstIndex].flipped = false;
          unflippedCards[secondIndex].flipped = false;
          setCards(unflippedCards);
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const handleWin = () => {
    setWin(true);
    const score = Math.max(100, timer * 10 - moves * 5);
    setTotalScore(state.totalScore + score);
    if (level < 4) updateLevel('memory', level + 1);
  };

  const restart = () => {
    setCards(getNewGrid());
    setFlipped([]);
    setMoves(0);
    setTimer(60);
    setWin(false);
  };

  return (
    <div className="w-full h-full p-8 flex flex-col items-center bg-[#050505]">
      {/* Stats Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <div className="flex gap-4">
           <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
             <Clock size={16} className={timer < 10 ? 'text-red-500 animate-pulse' : 'text-amber-400'} />
             <span className="text-white font-black tabular-nums">{timer}s</span>
           </div>
           <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
             <Shuffle size={16} className="text-blue-400" />
             <span className="text-white font-black tabular-nums">{moves} moves</span>
           </div>
        </div>
        {level === 4 && (
          <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400 text-xs font-black uppercase tracking-widest animate-pulse">
            Neural Instability Active
          </div>
        )}
      </div>

      <div className={`grid gap-3 w-full max-w-2xl flex-1 items-center justify-center ${
        cardCount <= 12 ? 'grid-cols-3' : cardCount <= 16 ? 'grid-cols-4' : 'grid-cols-6'
      }`}>
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            onClick={() => handleFlip(i)}
            initial={false}
            animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="aspect-square relative cursor-pointer perspective-1000"
          >
            <div className={`absolute inset-0 rounded-xl border-2 transition-all duration-300 ${
              card.matched 
                ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                : card.flipped 
                  ? 'bg-white border-white' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}>
              <div className="w-full h-full flex items-center justify-center text-3xl backface-hidden">
                {!card.flipped && !card.matched && <Brain size={24} className="text-white/20" />}
                {(card.flipped || card.matched) && (
                   <span className="rotate-y-180 inline-block">{card.icon}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {(win || timer <= 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
          >
            <div className="text-center p-12 bg-white/5 border border-white/10 rounded-3xl max-w-sm w-full">
               <div className={`inline-flex p-4 rounded-full mb-6 ${win ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                 {win ? <CheckCircle2 size={32} /> : <Clock size={32} />}
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">
                 {win ? 'LINK STABLE' : 'LINK COLLAPSED'}
               </h2>
               <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-8">
                 {win ? `Efficiency: ${Math.round((moves/cardCount)*100)}%` : 'Data lost in transition'}
               </p>
               <button
                 onClick={restart}
                 className={`w-full py-4 font-black uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all ${
                   win ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-blue-500 hover:bg-blue-400'
                 }`}
               >
                 {win ? 'Next Sector' : 'Attempt Sync Again'}
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

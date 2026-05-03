import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Crosshair, Zap, Coins, Skull } from 'lucide-react';

export default function TowerDefenseGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, setTotalScore, updateLevel, isPaused } = useGame();
  const [gameOver, setGameOver] = useState(false);
  const [money, setMoney] = useState(100);
  const [lives, setLives] = useState(10);
  const level = state.currentLevel['tower-defense'] || 1;

  useEffect(() => {
    if (isPaused || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let animationFrameId: number;
    let enemies: any[] = [];
    let towers: any[] = [];
    let projectiles: any[] = [];

    const path = [
      { x: 0, y: 150 },
      { x: 400, y: 150 },
      { x: 400, y: 400 },
      { x: 800, y: 400 }
    ];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    resize();
    window.addEventListener('resize', resize);

    const onPlaceTower = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (money >= 50) {
        towers.push({ x, y, range: 100, damage: 1, fireRate: 30, lastShot: 0 });
        setMoney(m => m - 50);
      }
    };
    canvas.addEventListener('mousedown', onPlaceTower);

    const update = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Path
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
      ctx.strokeStyle = '#1e1e21';
      ctx.lineWidth = 40;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Spawn
      if (frame % Math.max(20, 60 - level * 10) === 0) {
        enemies.push({ 
          x: path[0].x, 
          y: path[0].y, 
          hp: level === 4 ? 20 : 1 + level, 
          maxHp: level === 4 ? 20 : 1 + level,
          speed: 1.5 + level * 0.2, 
          targetIndex: 1 
        });
      }

      // Enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        const target = path[e.targetIndex];
        const angle = Math.atan2(target.y - e.y, target.x - e.x);
        e.x += Math.cos(angle) * e.speed;
        e.y += Math.sin(angle) * e.speed;

        if (Math.hypot(e.x - target.x, e.y - target.y) < 5) {
          e.targetIndex++;
          if (e.targetIndex >= path.length) {
            setLives(l => {
              if (l <= 1) endGame();
              return l - 1;
            });
            enemies.splice(i, 1);
            continue;
          }
        }

        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(e.x - 10, e.y - 10, 20, 20);
        // Health bar
        ctx.fillStyle = '#333';
        ctx.fillRect(e.x - 10, e.y - 15, 20, 3);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(e.x - 10, e.y - 15, 20 * (e.hp / e.maxHp), 3);
      }

      // Towers
      towers.forEach(t => {
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(t.x, t.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
        ctx.stroke();

        // Fire
        if (frame - t.lastShot > t.fireRate) {
           const target = enemies.find(e => Math.hypot(e.x - t.x, e.y - t.y) < t.range);
           if (target) {
             projectiles.push({ x: t.x, y: t.y, tx: target.x, ty: target.y, speed: 10, target });
             t.lastShot = frame;
           }
        }
      });

      // Projectiles
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        const angle = Math.atan2(p.ty - p.y, p.tx - p.x);
        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();

        if (Math.hypot(p.x - p.tx, p.y - p.ty) < 5) {
          if (enemies.includes(p.target)) {
            p.target.hp -= 1;
            if (p.target.hp <= 0) {
              enemies.splice(enemies.indexOf(p.target), 1);
              setMoney(m => m + 10);
              setTotalScore(state.totalScore + 10);
            }
          }
          projectiles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    const endGame = () => {
      setGameOver(true);
      cancelAnimationFrame(animationFrameId);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', onPlaceTower);
    };
  }, [isPaused, gameOver, level]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full bg-[#050505]" />
      
      <div className="absolute top-4 left-4 flex gap-4">
        <div className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg flex items-center gap-2">
           <Coins size={16} className="text-amber-400" />
           <span className="text-white font-black tabular-nums">${money}</span>
        </div>
        <div className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg flex items-center gap-2">
           <ShieldCheck size={16} className="text-rose-400" />
           <span className="text-white font-black tabular-nums">{lives}</span>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl flex gap-4">
         <div className="px-6 py-2 flex flex-col items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-1">
               <Crosshair size={20} className="text-white" />
            </div>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">$50</span>
         </div>
         <div className="flex items-center text-white/20 text-[10px] font-bold uppercase tracking-widest px-4 border-l border-white/10">
           Click Map to Deploy Defense
         </div>
      </div>

      <AnimatePresence>
        {gameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <div className="text-center p-12 bg-white/5 border border-white/10 rounded-3xl max-w-sm w-full mx-4">
              <Skull size={48} className="text-rose-500 mx-auto mb-6" />
              <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">SECTOR OVERRUN</h2>
              <button
                onClick={() => { setGameOver(false); setMoney(100); setLives(10); }}
                className="w-full py-4 bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-emerald-400 transition-all shadow-lg"
              >
                Re-Deploy Defense
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

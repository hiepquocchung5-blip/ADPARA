import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Target, Zap, AlertTriangle, Skull } from 'lucide-react';

export default function BulletHellGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, setTotalScore, updateLevel, isPaused, triggerAd } = useGame();
  const [gameOver, setGameOver] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const level = state.currentLevel['bullet-hell'] || 1;

  useEffect(() => {
    if (isPaused || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game state
    let animationFrameId: number;
    let player = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, color: '#3b82f6' };
    let enemies: any[] = [];
    let bullets: any[] = [];
    let particles: any[] = [];
    let mouse = { x: player.x, y: player.y };
    let frame = 0;
    let score = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', onMouseMove);

    const spawnEnemy = () => {
      const radius = level === 4 ? 40 : 15 + Math.random() * 10;
      let x, y;
      if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        y = Math.random() * canvas.height;
      } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
      }
      const speed = level === 4 ? 1 : 1.5 + level * 0.5;
      enemies.push({ x, y, radius, color: level === 4 ? '#ef4444' : '#f43f5e', speed, hp: level === 4 ? 50 : 1 });
    };

    const spawnBullet = (ex: number, ey: number, angle: number) => {
      bullets.push({ x: ex, y: ey, radius: 4, color: '#fb923c', speed: 3 + level, angle });
    };

    const update = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth player movement
      player.x += (mouse.x - player.x) * 0.1;
      player.y += (mouse.y - player.y) * 0.1;

      // Draw Player
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fillStyle = player.color;
      ctx.fill();
      ctx.shadowBlur = 15;
      ctx.shadowColor = player.color;
      ctx.closePath();

      // Spawn logic
      if (frame % Math.max(10, 60 - (level * 10)) === 0) {
        if (level === 4 && enemies.length < 1) spawnEnemy();
        else if (level < 4) spawnEnemy();
      }

      // Enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        const angle = Math.atan2(player.y - e.y, player.x - e.x);
        e.x += Math.cos(angle) * e.speed;
        e.y += Math.sin(angle) * e.speed;

        // Draw Enemy
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fillStyle = e.color;
        ctx.fill();
        ctx.shadowBlur = level === 4 ? 30 : 10;
        ctx.shadowColor = e.color;
        ctx.closePath();

        // Boss firing patterns
        if (level === 4 && frame % 40 === 0) {
           for(let j=0; j<8; j++) {
             spawnBullet(e.x, e.y, (j * Math.PI * 2) / 8 + frame * 0.05);
           }
        }

        // Collision with player
        const dist = Math.hypot(player.x - e.x, player.y - e.y);
        if (dist < player.radius + e.radius) {
          endGame();
        }
      }

      // Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.closePath();

        if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
          bullets.splice(i, 1);
          continue;
        }

        const dist = Math.hypot(player.x - b.x, player.y - b.y);
        if (dist < player.radius + b.radius) {
          endGame();
        }
      }

      score++;
      if (score > 1000 && score % 1000 === 0 && level < 4) {
        updateLevel('bullet-hell', Math.min(4, level + 1));
      }
      setSessionScore(score);

      animationFrameId = requestAnimationFrame(update);
    };

    const endGame = () => {
      setGameOver(true);
      setTotalScore(state.totalScore + score);
      cancelAnimationFrame(animationFrameId);
      // Check for pending ad on death
      triggerAd();
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
    };
  }, [isPaused, gameOver, level]);

  const restart = () => {
    setGameOver(false);
    setSessionScore(0);
  };

  return (
    <div className="relative w-full h-full cursor-none">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* HUD Info */}
      <div className="absolute top-4 left-4 flex gap-4">
        <div className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg flex items-center gap-2">
           <Zap className="text-blue-400" size={16} />
           <span className="text-white font-black italic tracking-tighter tabular-nums">{sessionScore}</span>
        </div>
        {level === 4 && (
          <div className="px-4 py-2 bg-rose-500/20 border border-rose-500/40 rounded-lg flex items-center gap-2 animate-pulse">
            <AlertTriangle className="text-rose-500" size={16} />
            <span className="text-rose-500 font-bold uppercase text-[10px] tracking-widest">Boss Imminent</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {gameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <div className="text-center p-12 bg-white/5 border border-white/10 rounded-3xl max-w-sm w-full mx-4">
              <div className="inline-flex p-4 bg-rose-500 text-black rounded-full mb-6">
                <Skull size={32} />
              </div>
              <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">CORE DESTROYED</h2>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-8">Score: {sessionScore.toLocaleString()}</p>
              
              <div className="space-y-3">
                <button
                  onClick={restart}
                  className="w-full py-4 bg-blue-500 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-blue-400 transition-all shadow-lg"
                >
                  Engage Again
                </button>
                <button
                  onClick={() => triggerAd(true)}
                  className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Zap size={14} />
                  Watch Ad for +100 Coins
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

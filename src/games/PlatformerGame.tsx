import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Skull, TrendingUp } from 'lucide-react';

export default function PlatformerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, setTotalScore, updateLevel, isPaused, triggerAd } = useGame();
  const [gameOver, setGameOver] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const level = state.currentLevel['platformer'] || 1;

  useEffect(() => {
    if (isPaused || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frame = 0;
    const gravity = 0.6;
    const jumpForce = -12;
    const speed = 5 + (level * 1.5);
    
    let player = {
      x: 100,
      y: 300,
      width: 30,
      height: 30,
      dy: 0,
      isGrounded: false,
      color: '#06b6d4'
    };

    let obstacles: { x: number; width: number; height: number; type: string }[] = [];
    let clouds: { x: number; y: number; s: number }[] = [];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    resize();
    window.addEventListener('resize', resize);

    const onJump = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.code !== 'Space') return;
      if (player.isGrounded) {
        player.dy = jumpForce;
        player.isGrounded = false;
      }
    };
    window.addEventListener('keydown', onJump);
    canvas.addEventListener('mousedown', onJump);

    const update = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Clouds/Background
      if (frame % 100 === 0) clouds.push({ x: canvas.width, y: Math.random() * 200, s: Math.random() * 2 + 1 });
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let i = clouds.length - 1; i >= 0; i--) {
        const c = clouds[i];
        c.x -= c.s * 0.5;
        ctx.fillRect(c.x, c.y, 100, 20);
        if (c.x < -100) clouds.splice(i, 1);
      }

      // Physics
      player.dy += gravity;
      player.y += player.dy;

      const groundY = canvas.height - 100;
      if (player.y + player.height > groundY) {
        player.y = groundY - player.height;
        player.dy = 0;
        player.isGrounded = true;
      }

      // Obstacles
      if (frame % Math.max(30, 90 - level * 10) === 0) {
        obstacles.push({
          x: canvas.width,
          width: 30 + Math.random() * 20,
          height: 30 + Math.random() * 60,
          type: Math.random() > 0.8 ? 'high' : 'low'
        });
      }

      ctx.fillStyle = '#f43f5e';
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.x -= speed;
        
        const y = o.type === 'high' ? groundY - 100 : groundY - o.height;
        ctx.fillRect(o.x, y, o.width, o.height);

        // Collision
        if (
          player.x < o.x + o.width &&
          player.x + player.width > o.x &&
          player.y < y + o.height &&
          player.y + player.height > y
        ) {
          endGame();
        }

        if (o.x < -o.width) obstacles.splice(i, 1);
      }

      // Draw ground
      ctx.fillStyle = '#1e1e21';
      ctx.fillRect(0, groundY, canvas.width, 100);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, groundY, canvas.width, 1);

      // Boss Chasing Entity
      if (level === 4) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.fillRect(0, 0, 50 + Math.sin(frame * 0.1) * 20, canvas.height); // Shadow wall
        if (player.x < 60) endGame();
      }

      // Draw Player
      ctx.fillStyle = player.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);

      if (frame % 60 === 0) {
        setSessionScore(s => {
          const next = s + 10;
          if (next % 1000 === 0 && level < 4) {
             updateLevel('platformer', level + 1);
          }
          return next;
        });
      }

      animationFrameId = requestAnimationFrame(update);
    };

    const endGame = () => {
      setGameOver(true);
      setTotalScore(state.totalScore + sessionScore);
      cancelAnimationFrame(animationFrameId);
      triggerAd();
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onJump);
      canvas.removeEventListener('mousedown', onJump);
    };
  }, [isPaused, gameOver, level]);

  return (
    <div className="relative w-full h-full cursor-pointer">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 flex gap-4">
        <div className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg flex items-center gap-2">
           <Zap className="text-cyan-400" size={16} />
           <span className="text-white font-black italic tracking-tighter tabular-nums">{sessionScore}</span>
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
              <div className="inline-flex p-4 bg-rose-500 text-black rounded-full mb-6">
                <Skull size={32} />
              </div>
              <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">SEQUENCE FAILED</h2>
              <div className="space-y-3">
                <button
                  onClick={() => { setGameOver(false); setSessionScore(0); }}
                  className="w-full py-4 bg-cyan-500 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-lg"
                >
                  Reconnect Runner
                </button>
                <button
                  onClick={() => triggerAd(true)}
                  className="w-full py-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <TrendingUp size={14} />
                  Get +100 Coins (AD)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!gameOver && !isPaused && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none">
           <p className="text-white/20 font-black uppercase tracking-[1em] text-[10px] animate-pulse">Press Space or Tap to Jump</p>
        </div>
      )}
    </div>
  );
}

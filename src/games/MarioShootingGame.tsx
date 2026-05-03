import React, { useEffect, useRef } from 'react';

export default function MarioShootingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.clientWidth;
    let height = canvas.height = canvas.clientHeight;

    const resize = () => {
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    };
    window.addEventListener('resize', resize);

    let animationFrameId: number;
    let playerY = height - 50;
    
    type Bullet = { x: number, y: number };
    let bullets: Bullet[] = [];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        bullets.push({ x: 50, y: playerY });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const render = () => {
      ctx.fillStyle = '#1e1b4b'; // Dark blue background
      ctx.fillRect(0, 0, width, height);

      // Simple ground
      ctx.fillStyle = '#991b1b'; // Brick red
      ctx.fillRect(0, height - 20, width, 20);

      // Player (red square like a plumber)
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(20, playerY - 30, 30, 30);
      
      // Update & Draw bullets
      ctx.fillStyle = '#f59e0b';
      bullets = bullets.filter(b => b.x < width);
      bullets.forEach(b => {
        b.x += 10;
        ctx.beginPath();
        ctx.arc(b.x, b.y - 15, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute top-4 left-4 text-white/50 text-xs font-mono uppercase bg-black/50 p-2 rounded">Press SPACE to shoot fireballs</div>
    </div>
  );
}

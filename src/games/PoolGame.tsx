import React, { useEffect, useRef } from 'react';

export default function PoolGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.clientWidth;
    let height = canvas.height = canvas.clientHeight;

    const render = () => {
      ctx.fillStyle = '#064e3b'; // Pool table green
      ctx.fillRect(0, 0, width, height);

      // Cushions
      ctx.fillStyle = '#065f46';
      ctx.fillRect(20, 20, width - 40, height - 40);

      // Pockets
      ctx.fillStyle = '#000000';
      const pocketRadius = 25;
      const positions = [
        [20, 20], [width / 2, 20], [width - 20, 20],
        [20, height - 20], [width / 2, height - 20], [width - 20, height - 20]
      ];
      positions.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, pocketRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Cue ball
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(width * 0.25, height / 2, 12, 0, Math.PI * 2);
      ctx.fill();

      // Triangle of balls
      let startX = width * 0.7;
      let startY = height / 2;
      const radius = 12;
      const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#000000'];
      let colorIdx = 0;
      
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col <= row; col++) {
          let bx = startX + row * (radius * 2);
          let by = startY - (row * radius) + (col * radius * 2);
          ctx.fillStyle = colors[colorIdx % colors.length];
          colorIdx++;
          ctx.beginPath();
          ctx.arc(bx, by, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    
    render();
    
    const handleResize = () => {
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
      render();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute top-4 left-4 text-white/50 text-xs font-mono uppercase bg-black/50 p-2 rounded">Billiards Physics Engine V1.0</div>
    </div>
  );
}

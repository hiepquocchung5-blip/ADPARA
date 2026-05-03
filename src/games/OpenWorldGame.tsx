import React, { useEffect, useRef, useState } from 'react';

export default function OpenWorldGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', resize);
    resize();

    let pX = width / 2;
    let pY = height / 2;
    
    const keys = { w: false, a: false, s: false, d: false };
    
    const onKeyDown = (e: KeyboardEvent) => { keys[e.key] = true; };
    const onKeyUp = (e: KeyboardEvent) => { keys[e.key] = false; };
    
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      if (keys.w) pY -= 3;
      if (keys.s) pY += 3;
      if (keys.a) pX -= 3;
      if (keys.d) pX += 3;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
      
      // Draw some "world" grass/trees mock
      ctx.fillStyle = '#166534';
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc((i * 150 + offset) % width, (i * 123) % height, 30, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw character
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(pX, pY, 15, 0, Math.PI * 2);
      ctx.fill();
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute bottom-4 left-4 text-white/50 text-xs font-mono uppercase">Use W A S D to explore the realm</div>
    </div>
  );
}

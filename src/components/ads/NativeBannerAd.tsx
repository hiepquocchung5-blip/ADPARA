import React, { useEffect, useRef } from 'react';

export default function NativeBannerAd({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Create the script
    const script = document.createElement('script');
    script.src = "https://pl29326143.profitablecpmratenetwork.com/c4b7a06ee88c4f743c816eb1338ee54f/invoke.js";
    script.async = true;
    script.dataset.cfasync = "false";

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '<div id="container-c4b7a06ee88c4f743c816eb1338ee54f"></div>';
      }
    };
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center overflow-hidden ${className}`}>
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Native Advertisement</span>
      <div 
        ref={containerRef} 
        className="w-full flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800/50 overflow-hidden min-h-[100px] p-2"
      >
        <div id="container-c4b7a06ee88c4f743c816eb1338ee54f"></div>
      </div>
    </div>
  );
}

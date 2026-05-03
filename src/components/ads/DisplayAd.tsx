import React, { useEffect, useRef } from 'react';

interface DisplayAdProps {
  placementName: string;
  className?: string;
}

export default function DisplayAd({ placementName, className = '' }: DisplayAdProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = adContainerRef.current;
    if (!container) return;

    // Clear previous content just in case
    container.innerHTML = '';

    const atOptionsScript = document.createElement('script');
    atOptionsScript.type = 'text/javascript';
    atOptionsScript.innerHTML = `
      atOptions = {
        'key' : '15d7c92e434af70497d906bd9984b5d7',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;
    
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = "//www.highperformanceformat.com/15d7c92e434af70497d906bd9984b5d7/invoke.js";
    invokeScript.async = true;

    container.appendChild(atOptionsScript);
    container.appendChild(invokeScript);

    return () => {
      // Cleanup script elements and iframe when unmounting
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [placementName]);

  return (
    <div className={`flex flex-col items-center justify-center overflow-hidden ${className}`}>
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Advertisement - {placementName}</span>
      <div 
        ref={adContainerRef} 
        className="min-h-[60px] min-w-[468px] flex items-center justify-center bg-slate-900/50 rounded overflow-hidden" 
      />
    </div>
  );
}

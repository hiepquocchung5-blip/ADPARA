import React from 'react';
import { motion } from 'motion/react';

export default function GenericGamePlaceholder({ title }: { title: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-indigo via-slate-900 to-black" />
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="z-10 text-center flex flex-col items-center"
      >
        <div className="w-16 h-16 border-2 border-brand-indigo border-t-white rounded-full animate-spin mb-6" />
        <h2 className="text-3xl font-black italic tracking-tighter mb-2">{title}</h2>
        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest max-w-sm">
          Simulation environment is currently being initialized by the system architect. Please standby for deployment.
        </p>
      </motion.div>
    </div>
  );
}

import React from 'react';
import { ExternalLink as LucideExternalLink } from 'lucide-react';

interface ExternalLinkProps {
  href: string;
  label: string;
  className?: string;
}

export default function ExternalLink({ href, label, className = '' }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-md hover:bg-emerald-400/20 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all ${className}`}
    >
      {label}
      <LucideExternalLink size={14} />
    </a>
  );
}

import React from 'react';
import { Briefcase, Info } from 'lucide-react';

/**
 * Header Component
 * Renders the top navigation/header bar for the HR Policy Assistant.
 * 
 * Props:
 * - None (static UI representation, but ready for action handlers or custom logo additions)
 */
export default function Header(hasMessages, onDeleteChat) {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      {/* Logo & Title Section */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 shadow-sm border border-primary-100">
          <Briefcase className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-800 tracking-tight leading-none">
            HR Policy Assistant
          </h1>
          <span className="text-xs font-medium text-slate-400 block mt-0.5">
            Powered by RAG
          </span>
        </div>
      </div>

      {/* Info Badge */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          System Online
        </div>
        <button 
          type="button" 
          aria-label="Application info"
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
        >
          <Info className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

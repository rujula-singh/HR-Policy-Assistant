import React from 'react';
import { Bot } from 'lucide-react';

/**
 * LoadingIndicator Component
 * Renders a minimal typing indicator with animated bouncing dots to represent the model thinking.
 * 
 * Props:
 * - None (static loader UI)
 */
export default function LoadingIndicator() {
  return (
    <div className="flex w-full items-start gap-4 py-3">
      {/* Bot Icon */}
      <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm">
        <Bot className="h-5 w-5 animate-pulse text-primary-500" />
      </div>

      {/* Typing Bubble */}
      <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[70%]">
        <div className="rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1 h-5 justify-center px-1">
            <span 
              className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" 
              style={{ animationDelay: '0ms', animationDuration: '1s' }}
            ></span>
            <span 
              className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" 
              style={{ animationDelay: '150ms', animationDuration: '1s' }}
            ></span>
            <span 
              className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" 
              style={{ animationDelay: '300ms', animationDuration: '1s' }}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
}

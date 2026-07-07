import React from 'react';
import { SendHorizontal } from 'lucide-react';

/**
 * ChatInput Component
 * Input form at the bottom of the chat interface for sending messages.
 * 
 * Props:
 * - value: string (current input value)
 * - onChange: callback function(event) for typing changes
 * - onSubmit: callback function(event) for when form is submitted
 */
export default function ChatInput({ value = '', onChange, onSubmit }) {
  // Simple layout with form, input, and send button
  return (
    <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmit) onSubmit(e);
        }}
        className="mx-auto max-w-3xl"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder="Ask a question about company policies..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-3.5 pl-5 pr-14 text-sm text-slate-800 placeholder-slate-400 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-200 shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white shadow-sm hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Send message"
          >
            <SendHorizontal className="h-4.5 w-4.5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          Answers are generated based on official HR policy documents.
        </p>
      </form>
    </div>
  );
}

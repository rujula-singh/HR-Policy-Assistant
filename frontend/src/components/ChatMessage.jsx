import React from 'react';
import { User, Bot } from 'lucide-react';
import SourceCard from './SourceCard';

/**
 * ChatMessage Component
 * Renders an individual chat bubble for either the user or the assistant.
 * 
 * Props:
 * - message: Object representing the message data:
 *   - sender: 'user' | 'assistant'
 *   - text: string
 *   - timestamp: string
 *   - sources: Array of source objects (optional, shown under assistant answers)
 */
export default function ChatMessage({ message }) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex w-full items-start gap-3 py-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar Icon */}
      <div className={`flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-xl border shadow-sm transition-colors ${
        isUser 
          ? 'border-primary-100 bg-primary-50 text-primary-600' 
          : 'border-slate-200 bg-white text-slate-600'
      }`}>
        {isUser ? (
          <User className="h-4.5 w-4.5" />
        ) : (
          <Bot className="h-4.5 w-4.5 text-primary-500" />
        )}
      </div>

      {/* Message Content & Timestamp */}
      <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed border ${
          isUser 
            ? 'rounded-tr-sm bg-primary-600 border-primary-600 text-white font-medium' 
            : 'rounded-tl-sm bg-white border-slate-200 text-slate-800'
        }`}>
          {/* Message Text */}
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>

        {/* Timestamp */}
        <span className="text-[10px] font-medium text-slate-400 px-1 mt-0.5">
          {message.timestamp}
        </span>

        {/* Sources Section (rendered only for assistant answers if sources exist) */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="w-full mt-1">
            {message.sources.map((src, index) => (
              <SourceCard key={index} source={src} defaultExpanded={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Bot } from 'lucide-react';
import SuggestedQuestions from './SuggestedQuestions';

/**
 * EmptyState Component
 * Displays a clean welcome screen when there are no messages in the chat.
 * 
 * Props:
 * - onSelectQuestion: Callback function(questionText) passed down to SuggestedQuestions.
 */
export default function EmptyState({ onSelectQuestion }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-3xl mx-auto my-auto">
      {/* Large Assistant Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shadow-md border border-primary-100 mb-6">
        <Bot className="h-9 w-9" />
      </div>

      {/* Welcome Text & Description */}
      <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
        How can I help you today?
      </h2>
      <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        I am your HR Policy Assistant. Ask me questions about company policies, leave benefits, remote work rules, and more.
      </p>

      {/* Divider */}
      <div className="w-full max-w-md h-px bg-slate-200 my-8"></div>

      {/* Suggested Questions Grid */}
      <div className="w-full">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Suggested Questions
        </p>
        <SuggestedQuestions onSelectQuestion={onSelectQuestion} />
      </div>
    </div>
  );
}

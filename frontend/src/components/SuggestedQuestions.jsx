import React from 'react';
import { HelpCircle, ArrowRight } from 'lucide-react';

/**
 * SuggestedQuestions Component
 * Displays a list of predefined prompt cards that users can click to start a conversation.
 * 
 * Props:
 * - onSelectQuestion: Callback function(questionText) triggered when a card is clicked.
 */
export default function SuggestedQuestions({ onSelectQuestion }) {
  const suggestions = [
    {
      id: 'leave',
      text: 'What is the leave policy?',
      description: 'Annual leaves, sick leaves, and carry-over details.'
    },
    {
      id: 'penalty',
      text: 'What are minor and major penalties?',
      description: 'Short-term warnings versus permanent pay cuts.'
    },
    {
      id: 'reimbursement',
      text: 'What is conveyance reimbursement?',
      description:'Rules for travel expense claims.'
    },
    {
      id: 'timings',
      text: 'What are the office timings?',
      description: 'Core working hours and flexible timing options.'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {suggestions.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => onSelectQuestion && onSelectQuestion(q.text)}
            className="group flex flex-col justify-between items-start text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-primary-400 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-3 w-full">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                <HelpCircle className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-primary-700 transition-colors truncate">
                  {q.text}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {q.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity self-end">
              Ask question
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

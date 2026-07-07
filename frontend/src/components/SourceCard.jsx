import React from 'react';
import { BookOpen, ChevronDown, CheckCircle2 } from 'lucide-react';

/**
 * SourceCard Component
 * Displays citations/sources used by the RAG model to answer a question.
 * 
 * Props:
 * - source: Object containing document info:
 *   - documentTitle: string
 *   - sectionName: string
 *   - confidenceScore: number (0-100)
 *   - excerpt: string
 * - defaultExpanded: boolean (defaults to true for demo/UI review)
 */
export default function SourceCard({ source, defaultExpanded = true }) {
  // Use fallback dummy data if none is provided
  const data = source || {
    documentTitle: "Employee Handbook 2026",
    sectionName: "Section 4.2: Sick Leave Eligibility",
    confidenceScore: 94,
    excerpt: "Employees are entitled to 10 paid sick days per calendar year. Medical certification is required for leaves extending beyond 3 consecutive business days. All sick leaves must be logged in the HR portal within 24 hours of returning to work."
  };

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all duration-200">
      {/* Accordion Header (UI indicator for expansion, without active JS state toggling) */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 hover:bg-slate-100/50 transition-colors cursor-pointer border-b border-slate-150">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <BookOpen className="h-3.5 w-3.5 text-slate-500" />
          <span>Source: {data.documentTitle}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Confidence Badge */}
          <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-150">
            <CheckCircle2 className="h-2.5 w-2.5" />
            {data.confidenceScore}% Confidence
          </span>
          <ChevronDown className="h-4.5 w-4.5 text-slate-400 rotate-180 transition-transform duration-200" />
        </div>
      </div>

      {/* Accordion Content (Shown statically based on defaultExpanded prop) */}
      {defaultExpanded && (
        <div className="p-4 bg-white">
          <div className="text-xs font-semibold text-slate-600 mb-1.5">
            {data.sectionName}
          </div>
          <blockquote className="border-l-2 border-slate-200 pl-3 text-xs italic text-slate-600 leading-relaxed">
            "{data.excerpt}"
          </blockquote>
        </div>
      )}
    </div>
  );
}

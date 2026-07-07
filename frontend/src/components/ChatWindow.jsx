import React from 'react';
import ChatMessage from './ChatMessage';
import EmptyState from './EmptyState';
import LoadingIndicator from './LoadingIndicator';
import { Plus } from "lucide-react"
import { useEffect, useRef } from "react";

/**
 * ChatWindow Component
 * The main container for rendering the stream of messages, the loading state,
 * or the initial empty state.
 * 
 * Props:
 * - messages: Array of message objects.
 * - isLoading: boolean, shows typing indicator when true.
 * - onSelectQuestion: Callback passed to EmptyState.
 */
export default function ChatWindow({ messages = [], isLoading = false, onSelectQuestion,onDeleteChat }) {
  const hasMessages = messages.length > 0;
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior:"smooth"
    });
  },[messages,isLoading]);

  return (
    <div className="flex-1 overflow-y-auto bg-white px-4 py-6 sm:px-6 items-center justify-between">
      <div className="mx-auto max-w-3xl">
        {/* If no messages, show Empty State */}
        {!hasMessages ? (
          <EmptyState onSelectQuestion={onSelectQuestion} />
        ) : (
          <div className="flex flex-col space-y-1">
            {/* Render message history */}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Render loading indicator if model is thinking */}
            {isLoading && <LoadingIndicator />}
          </div>
        )}
      </div>
      {hasMessages && (
  <div className="mt-6 flex justify-center">
    <button
      className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
      onClick={()=> onDeleteChat()}
    >
      <Plus size={16} />
      New Chat
    </button>
  </div>
)}
<div ref={bottomRef}></div>
    </div>
  );
}

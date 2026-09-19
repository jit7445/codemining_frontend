"use client";

import { Button } from "@/components/ui/button";
import { X, Copy, Check, Bot, Send, Sparkles } from "lucide-react";
import { useChat } from "ai/react";
import { useState } from "react";

export default function Assist() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Floating Toggle Button */}
      <Button
        onClick={toggleChat}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 flex items-center justify-center p-0"
        size="icon"
        aria-label="Toggle AI Assistant"
      >
        {isChatOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <div className="relative">
            <Bot className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
          </div>
        )}
      </Button>

      {/* Chat Window Panel */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[500px] max-h-[calc(100vh-8rem)] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col overflow-hidden z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-none">CodeMining AI</h3>
                <span className="text-[10px] text-blue-100 opacity-90">Assistant & Copilot</span>
              </div>
            </div>
            <Button
              onClick={toggleChat}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20 rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-zinc-950/50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 dark:text-slate-500 px-4 space-y-2">
                <Bot className="w-10 h-10 stroke-[1.5] text-blue-500 opacity-70" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  How can I help you write code?
                </p>
                <p className="text-xs">
                  Ask questions about algorithms, syntax, debugging, or code optimization.
                </p>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="relative group max-w-[85%]">
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        m.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white dark:bg-zinc-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-zinc-700/60 rounded-bl-none"
                      }`}
                    >
                      <div className="text-[10px] opacity-75 mb-1 font-semibold">
                        {m.role === "user" ? "You" : "AI Assistant"}
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(m.content, m.id!)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-200 dark:bg-zinc-700 p-1 rounded hover:bg-slate-300 dark:hover:bg-zinc-600 text-slate-600 dark:text-slate-300"
                      title="Copy response"
                    >
                      {copiedMessageId === m.id ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 p-3 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 shrink-0"
          >
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask AI anything about your code..."
              className="flex-1 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3.5 py-2 flex items-center justify-center transition shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

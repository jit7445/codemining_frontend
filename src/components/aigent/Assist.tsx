'use client';
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Copy, Check, Bot } from "lucide-react";
import { useChat } from 'ai/react';
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
    <div className="relative">
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-200 hover:scale-110"
        size="icon"
      >
        {isChatOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageSquare className="h-6 w-6 text-white" />
        )}
      </Button>
      {isChatOpen && (
        
       <div className="fixed bottom-24 right-6 w-96 opacity-100 h-[50vh] min-h-[200px] bg-black rounded-lg shadow-2xl border border-gray-200 flex flex-col animate-in slide-in-from-bottom-2 duration-200 resize-y overflow-auto z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">AI Assistant</span>
            </div>
            <Button onClick={toggleChat} variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-blue-700">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className="relative group max-w-[80%]">
      <div
        className={`
          rounded-lg px-4 py-2
          ${m.role === 'user' ? 'bg-blue-100 text-black' : 'bg-gray-100 text-black'}
        `}
      >
        <div className="text-xs text-gray-500 mb-1">
          {m.role === 'user' ? 'You' : 'Assistant'}
        </div>
        <div className="text-sm whitespace-pre-wrap">{m.content}</div>
      </div>
      <button
        onClick={() => copyToClipboard(m.content, m.id!)}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy"
      >
        {copiedMessageId === m.id ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        )}
      </button>
    </div>
  </div>
))}

          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-gray-200">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#f55036]"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#bec5e9] px-4 py-2 text-black hover:bg-[rgb(235,201,197)] focus:outline-none focus:ring-2 focus:ring-[rgb(227,208,177)]"
            >
              Send
            </button>
          </form>
        </div>
       
      )}
    </div>
  );
}

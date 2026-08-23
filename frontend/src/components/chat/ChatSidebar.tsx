"use client";

import React, { useState } from "react";
import { Conversation } from "@/lib/api";
import { Plus, MessageSquare, Trash2, Search, Sparkles } from "lucide-react";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
}

export default function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
}: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-72 bg-slate-900/95 border-r border-slate-800 flex flex-col h-full text-white">
      {/* New Chat Button */}
      <div className="p-3 border-b border-slate-800">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Search Conversations */}
      <div className="p-3 border-b border-slate-800/60">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search past chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 px-4 text-slate-500 text-xs">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>No conversations found</p>
          </div>
        ) : (
          filtered.map((conv) => {
            const isActive = conv.conversation_id === activeId;
            return (
              <div
                key={conv.conversation_id}
                onClick={() => onSelect(conv.conversation_id)}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                  isActive
                    ? "bg-slate-800 text-white font-medium border border-slate-700 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <MessageSquare
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      isActive ? "text-blue-400" : "text-slate-500"
                    }`}
                  />
                  <span className="truncate">{conv.title || "Untitled Chat"}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.conversation_id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-slate-400 rounded transition-opacity"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-400" /> Grounded RAG
        </span>
        <span className="text-[10px] text-slate-500">v2.0 Production</span>
      </div>
    </aside>
  );
}

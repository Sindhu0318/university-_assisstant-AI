"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, Conversation } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { translations } from "@/lib/i18n";
import { MessageSquare, Search, Trash2, ArrowRight, Calendar } from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const { language } = useAuth();
  const t = translations[language];

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadHistory = async () => {
    try {
      const data = await api.getChatHistory();
      setConversations(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: string) => {
    await api.deleteConversation(id);
    loadHistory();
  };

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-6 text-white">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.history}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Archived AI conversations and grounded inquiry logs
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search past conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            No past conversations found.
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.conversation_id}
              onClick={() => router.push(`/chat`)}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800 text-slate-400 group-hover:text-blue-400 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-white group-hover:text-blue-300">
                    {c.title}
                  </h3>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {new Date(c.updated_at).toLocaleString()} • Language: {c.language.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(c.conversation_id);
                  }}
                  className="p-2 hover:text-red-400 text-slate-500 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

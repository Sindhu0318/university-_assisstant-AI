"use client";

import React, { useState } from "react";
import { Citation } from "@/lib/api";
import { BookOpen, ExternalLink, X, FileText, CheckCircle2, ShieldCheck } from "lucide-react";

interface CitationCardProps {
  citations: Citation[];
}

export default function CitationCard({ citations }: CitationCardProps) {
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);

  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-700/60">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
        <span>Verified Grounding Sources ({citations.length})</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {citations.map((c, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCitation(c)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-blue-500/50 text-xs text-slate-200 transition-all text-left group shadow-sm hover:scale-[1.01]"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 group-hover:text-blue-300" />
            <div className="overflow-hidden">
              <span className="font-semibold text-slate-200 truncate block max-w-[200px]">
                {c.document_title}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                {c.section && <span>§ {c.section}</span>}
                {c.page_number && <span>• Pg {c.page_number}</span>}
                {c.relevance_score && (
                  <span className="text-emerald-400 font-medium">
                    {Math.round(c.relevance_score * 100)}% match
                  </span>
                )}
              </span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 ml-1 opacity-60" />
          </button>
        ))}
      </div>

      {/* Citation Preview Modal */}
      {selectedCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {selectedCitation.document_title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    ID: {selectedCitation.document_id} • Category: {selectedCitation.category || "General"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCitation(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Section: <strong className="text-slate-200">{selectedCitation.section || "General"}</strong></span>
                <span>Page: <strong className="text-slate-200">{selectedCitation.page_number || 1}</strong></span>
              </div>
              {selectedCitation.effective_date && (
                <div className="text-[11px] text-slate-400">
                  Effective Date: <span className="text-slate-300">{selectedCitation.effective_date}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line">
                {selectedCitation.snippet || "Full verified document context retrieved for this answer."}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> University Grounded Citation
              </span>
              <button
                onClick={() => setSelectedCitation(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

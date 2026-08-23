"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, DocumentItem } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { translations } from "@/lib/i18n";
import FileUploadModal from "@/components/chat/FileUploadModal";
import {
  BookOpen,
  Search,
  UploadCloud,
  Sparkles,
  FileText,
  ShieldCheck,
  Calendar,
  Layers,
  Database,
} from "lucide-react";

export default function DocumentsPage() {
  const router = useRouter();
  const { language, user } = useAuth();
  const t = translations[language];

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const fetchDocs = async () => {
    try {
      const data = await api.getDocuments(selectedCategory);
      setDocuments(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [selectedCategory]);

  const filtered = documents.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              University Knowledge Base & Handbooks
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Verified policy documents indexed into the Vector RAG pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Handbooks</option>
            <option value="Academic Regulations">Academic Regulations</option>
            <option value="Attendance Policies">Attendance Policies</option>
            <option value="Examination Rules">Examination Rules</option>
            <option value="Fee Structure">Fee Structure</option>
            <option value="Scholarships">Scholarships</option>
            <option value="Placements">Placements</option>
            <option value="Student Handbook">Student Handbook</option>
          </select>
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search regulations, attendance rules, handbook..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Document Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-md group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2.5 py-0.5 rounded font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {doc.category}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Indexed
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-blue-400 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                    {doc.title}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                    {doc.document_id} • v{doc.version}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Vector Chunks:</span>
                  <span className="font-bold text-white">{doc.chunk_count} Chunks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="text-slate-300">{doc.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Effective Date:</span>
                  <span className="text-slate-300">
                    {new Date(doc.effective_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() =>
                  router.push(
                    `/chat?prompt=${encodeURIComponent(`Explain key policies and rules from document ${doc.title}`)}`
                  )
                }
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI About This Document →</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <FileUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => fetchDocs()}
      />
    </div>
  );
}

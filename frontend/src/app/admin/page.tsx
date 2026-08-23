"use client";

import React, { useState, useEffect } from "react";
import { api, DocumentItem } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import FileUploadModal from "@/components/chat/FileUploadModal";
import {
  ShieldAlert,
  Database,
  Users,
  MessageSquare,
  FileText,
  Trash2,
  RefreshCw,
  UploadCloud,
  Plus,
  ThumbsUp,
  AlertTriangle,
  Activity,
  CheckCircle2,
} from "lucide-react";

export default function AdminPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

  // New Notice form state
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeDesc, setNoticeDesc] = useState("");
  const [noticeCategory, setNoticeCategory] = useState("Academic");
  const [noticePriority, setNoticePriority] = useState("Normal");
  const [isCreatingNotice, setIsCreatingNotice] = useState(false);

  const loadData = async () => {
    try {
      const [s, d] = await Promise.all([
        api.getAdminStats(),
        api.getDocuments(),
      ]);
      setStats(s);
      setDocuments(d);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteDoc = async (docId: string) => {
    if (confirm(`Are you sure you want to delete document ${docId}?`)) {
      await api.deleteDocument(docId);
      loadData();
    }
  };

  const handleReindexDoc = async (docId: string) => {
    await api.reindexDocument(docId);
    loadData();
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeDesc) return;
    setIsCreatingNotice(true);
    try {
      await api.createNotice({
        title: noticeTitle,
        description: noticeDesc,
        category: noticeCategory,
        priority: noticePriority,
      });
      setNoticeTitle("");
      setNoticeDesc("");
      setIsNoticeModalOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreatingNotice(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Administrator & Observability Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Knowledge base telemetry, document ingestion pipelines, and RAG quality monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNoticeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Notice</span>
          </button>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold shadow-lg shadow-purple-600/20"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload & Index</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Total Conversations</span>
              <MessageSquare className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">
              {stats.total_conversations}
            </div>
            <div className="text-[11px] text-slate-500">
              {stats.total_messages} messages recorded
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Vector Chunks</span>
              <Database className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-extrabold text-purple-400">
              {stats.total_chunks}
            </div>
            <div className="text-[11px] text-slate-500">
              Across {stats.total_documents} documents
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>User Satisfaction</span>
              <ThumbsUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">
              {stats.satisfaction_rate_percent}%
            </div>
            <div className="text-[11px] text-slate-500">
              {stats.positive_feedback} 👍 vs {stats.negative_feedback} 👎
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Knowledge Gaps</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-amber-400">
              {stats.unanswered_count}
            </div>
            <div className="text-[11px] text-slate-500">Low confidence questions</div>
          </div>
        </div>
      )}

      {/* Document Ingestion Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">
              Ingested Knowledge Base Documents
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {documents.length} Active Documents
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">Document Title</th>
                <th className="px-4 py-3">ID / Version</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Chunks</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white">{doc.title}</td>
                  <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                    {doc.document_id} (v{doc.version})
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-blue-400">{doc.chunk_count}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px] border border-emerald-500/30">
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleReindexDoc(doc.document_id)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
                      title="Re-chunk & re-embed"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDoc(doc.document_id)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unanswered Queries Observability Section */}
      {stats && stats.unanswered_samples && stats.unanswered_samples.length > 0 && (
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Unanswered / Low Confidence Queries (Knowledge Base Gap Analysis)</span>
          </div>
          <p className="text-xs text-slate-400">
            These questions could not be answered from existing documents. Upload relevant policies to improve coverage.
          </p>
          <div className="space-y-2">
            {stats.unanswered_samples.map((s: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 font-mono"
              >
                {s.snippet}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post Notice Modal */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Publish University Circular</h3>
            <form onSubmit={handleCreateNotice} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={noticeDesc}
                  onChange={(e) => setNoticeDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="Examinations">Examinations</option>
                    <option value="Scholarships">Scholarships</option>
                    <option value="Placements">Placements</option>
                    <option value="Academic">Academic</option>
                    <option value="Attendance">Attendance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingNotice}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FileUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => loadData()}
      />
    </div>
  );
}

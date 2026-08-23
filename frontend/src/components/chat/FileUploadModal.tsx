"use client";

import React, { useState } from "react";
import { api, DocumentItem } from "@/lib/api";
import { UploadCloud, X, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (doc: DocumentItem) => void;
}

export default function FileUploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: FileUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("Academic Regulations");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please choose a file to upload");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name.replace(/\.[^/.]+$/, ""));
      formData.append("category", category);
      formData.append("department", "Academic Affairs");

      const doc = await api.uploadDocument(formData);
      onUploadSuccess(doc);
      onClose();
    } catch (err: any) {
      setError(err.message || "File upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in text-white">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Upload Knowledge Document</h3>
              <p className="text-xs text-slate-400">PDF, DOCX, TXT, or Image for OCR & RAG</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          {/* File Drop Area */}
          <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-xl p-6 text-center cursor-pointer transition-colors relative bg-slate-950/40">
            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt,.md,.png,.jpg,.jpeg"
              onChange={(e) => {
                if (e.target.files?.[0]) setFile(e.target.files[0]);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {file ? (
              <div className="flex flex-col items-center gap-2 text-slate-200">
                <FileText className="w-8 h-8 text-blue-400" />
                <span className="font-medium text-xs">{file.name}</span>
                <span className="text-[10px] text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <UploadCloud className="w-8 h-8 text-slate-500" />
                <span className="text-xs font-medium">Click or drag file to upload</span>
                <span className="text-[10px] text-slate-500">Supports PDF, Word, Images up to 25MB</span>
              </div>
            )}
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Document Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Academic Regulations">Academic Regulations</option>
              <option value="Attendance Policies">Attendance Policies</option>
              <option value="Examination Rules">Examination Rules</option>
              <option value="Fee Structure">Fee Structure</option>
              <option value="Scholarships">Scholarships</option>
              <option value="Placements">Placements</option>
              <option value="Student Handbook">Student Handbook</option>
              <option value="User Upload">Personal Document for Chat</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !file}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-semibold text-white shadow-lg shadow-blue-500/20"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing & Indexing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Index Document</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

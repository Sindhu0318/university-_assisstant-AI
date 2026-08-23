"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { translations } from "@/lib/i18n";
import { api, AssessmentItem, DocumentItem } from "@/lib/api";
import FileUploadModal from "@/components/chat/FileUploadModal";
import {
  Users,
  BookOpen,
  FileSpreadsheet,
  UploadCloud,
  Bell,
  Sparkles,
  Plus,
  BarChart3,
  CheckCircle2,
  Layers,
} from "lucide-react";

export default function FacultyDashboard() {
  const router = useRouter();
  const { user, language } = useAuth();
  const t = translations[language];

  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [selectedModule, setSelectedModule] = useState("AAA");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    api.getAssessments({ module: selectedModule }).then((data) => setAssessments(data));
  }, [selectedModule]);

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 text-white">
      {/* Faculty Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/50 p-6 rounded-3xl border border-emerald-500/20 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t.facultyDashboard}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Faculty Portal
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {user?.full_name || "Dr. Priya Sundaram"} • {user?.department || "Department of Computer Science & Engineering"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/notices")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.postFacultyCircular}</span>
          </button>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t.uploadSyllabus}</span>
          </button>
        </div>
      </div>

      {/* Module Assessment Manager */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{t.moduleManagement}</h2>
              <p className="text-xs text-slate-400">
                Oversight of Tutor Marked (TMA), Computer Marked (CMA), and Final Exams
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-semibold">{t.module}:</label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
            >
              {["AAA", "BBB", "CCC", "DDD", "EEE", "FFF", "GGG"].map((m) => (
                <option key={m} value={m}>
                  Module {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Assessment Schedule Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/40">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-6 py-3.5">{t.module}</th>
                <th className="px-6 py-3.5">{t.presentation}</th>
                <th className="px-6 py-3.5">Assessment ID</th>
                <th className="px-6 py-3.5">{t.type}</th>
                <th className="px-6 py-3.5">{t.dueDay}</th>
                <th className="px-6 py-3.5">{t.weightage}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {assessments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">Module {a.code_module}</td>
                  <td className="px-6 py-4 font-mono text-slate-300">{a.code_presentation}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">#{a.id_assessment}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        a.assessment_type === "Exam"
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {a.assessment_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{a.date ? `Day ${a.date}` : "Exam Window"}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">{a.weight}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FileUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => {
          alert("Document indexed into University RAG Knowledge Base!");
        }}
      />
    </div>
  );
}

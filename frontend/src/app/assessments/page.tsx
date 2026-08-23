"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, AssessmentItem } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { translations } from "@/lib/i18n";
import {
  FileSpreadsheet,
  Filter,
  Search,
  MessageSquare,
  Sparkles,
  Calendar,
  Layers,
  BarChart3,
} from "lucide-react";

export default function AssessmentsPage() {
  const router = useRouter();
  const { language } = useAuth();
  const t = translations[language];

  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [modules, setModules] = useState<string[]>([]);
  const [presentations, setPresentations] = useState<string[]>([]);

  // Filter states
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedPresentation, setSelectedPresentation] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAssessmentModules(),
      api.getAssessmentPresentations(),
    ]).then(([mods, pres]) => {
      setModules(mods);
      setPresentations(pres);
    });
  }, []);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const data = await api.getAssessments({
        module: selectedModule,
        presentation: selectedPresentation,
        assessment_type: selectedType,
      });
      setAssessments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [selectedModule, selectedPresentation, selectedType]);

  const filtered = assessments.filter((a) => {
    const matchId = String(a.id_assessment).includes(searchQuery);
    const matchMod = a.code_module.toLowerCase().includes(searchQuery.toLowerCase());
    return matchId || matchMod;
  });

  // Calculate summary metrics
  const totalCount = filtered.length;
  const tmaCount = filtered.filter((a) => a.assessment_type === "TMA").length;
  const cmaCount = filtered.filter((a) => a.assessment_type === "CMA").length;
  const examCount = filtered.filter((a) => a.assessment_type === "Exam").length;

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Academic Assessment Schedules
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Live relational database integration from <code className="text-blue-300">assessments.csv</code> (OULAD)
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            router.push(
              `/chat?prompt=${encodeURIComponent(
                `Explain assessment weightages for module ${selectedModule !== "All" ? selectedModule : "AAA"}`
              )}`
            )
          }
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI About Module {selectedModule !== "All" ? selectedModule : "AAA"}</span>
        </button>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Assessments</span>
          <div className="text-2xl font-extrabold text-white">{totalCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Tutor Marked (TMA)</span>
          <div className="text-2xl font-extrabold text-blue-400">{tmaCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Computer Marked (CMA)</span>
          <div className="text-2xl font-extrabold text-indigo-400">{cmaCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Final Exams</span>
          <div className="text-2xl font-extrabold text-purple-400">{examCount}</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center gap-3">
        {/* Module Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Module:</label>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Modules</option>
            {modules.map((m) => (
              <option key={m} value={m}>
                Module {m}
              </option>
            ))}
          </select>
        </div>

        {/* Presentation Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Presentation:</label>
          <select
            value={selectedPresentation}
            onChange={(e) => setSelectedPresentation(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Presentations</option>
            {presentations.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Type:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Types</option>
            <option value="TMA">TMA (Tutor Marked)</option>
            <option value="CMA">CMA (Computer Marked)</option>
            <option value="Exam">Exam (Final Examination)</option>
          </select>
        </div>

        {/* Search Filter */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Structured Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-6 py-3.5">Module Code</th>
                <th className="px-6 py-3.5">Presentation</th>
                <th className="px-6 py-3.5">Assessment ID</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Due Day</th>
                <th className="px-6 py-3.5">Weightage</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Loading structured assessments...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No matching assessments found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-bold text-white">
                      Module {item.code_module}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                        {item.code_presentation}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400">
                      #{item.id_assessment}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          item.assessment_type === "Exam"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : item.assessment_type === "TMA"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {item.assessment_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.date !== null && item.date !== undefined ? (
                        <span className="flex items-center gap-1 text-slate-300">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          Day {item.date}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Exam Window</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white w-10">
                          {item.weight}%
                        </span>
                        <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min(item.weight, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          router.push(
                            `/chat?prompt=${encodeURIComponent(
                              `What are the requirements for assessment #${item.id_assessment} in module ${item.code_module} (${item.code_presentation})?`
                            )}`
                          )
                        }
                        className="opacity-0 group-hover:opacity-100 px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-[11px] font-medium transition-all"
                      >
                        Query AI →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

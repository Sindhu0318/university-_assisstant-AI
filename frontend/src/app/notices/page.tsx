"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, NoticeItem } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { translations } from "@/lib/i18n";
import {
  Bell,
  Search,
  Plus,
  Sparkles,
  AlertCircle,
  Calendar,
  X,
  CheckCircle2,
  Building,
  ShieldCheck,
} from "lucide-react";

export default function NoticesPage() {
  const router = useRouter();
  const { language } = useAuth();
  const t = translations[language];

  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Add Notice Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("Examinations");
  const [newPriority, setNewPriority] = useState("Normal");
  const [newDepartment, setNewDepartment] = useState("Academic Affairs");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const data = await api.getNotices(selectedCategory, selectedPriority);
      setNotices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [selectedCategory, selectedPriority]);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    setIsSubmitting(true);
    try {
      await api.createNotice({
        title: newTitle,
        description: newDesc,
        category: newCategory,
        priority: newPriority,
        department: newDepartment,
      });
      setNewTitle("");
      setNewDesc("");
      setIsAddModalOpen(false);
      fetchNotices();
    } catch (e) {
      console.error(e);
      alert("Failed to publish notice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 text-white">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.latestNotices}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Campus circulars, examination notifications, and departmental announcements
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Direct Add Notice Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addNotice}</span>
          </button>

          <button
            onClick={() =>
              router.push(
                `/chat?prompt=${encodeURIComponent("What are the latest examination and attendance notices released by the university?")}`
              )
            }
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Ask AI Summary</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center gap-3 shadow-md">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-semibold">{t.category}:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">{t.allCategories}</option>
            <option value="Examinations">Examinations</option>
            <option value="Scholarships">Scholarships</option>
            <option value="Placements">Placements</option>
            <option value="Attendance">Attendance</option>
            <option value="Academic">Academic</option>
            <option value="General">General</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-semibold">{t.noticePriority}:</label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">{t.allPriorities}</option>
            <option value="Urgent">{t.urgent}</option>
            <option value="High">{t.high}</option>
            <option value="Normal">{t.normal}</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchNotices}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-16 text-slate-400 text-xs">
            Loading circulars...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-2 text-center py-16 text-slate-400 text-xs">
            No notices found.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-md group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      n.priority === "Urgent"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : n.priority === "High"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {n.priority}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {new Date(n.date).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-blue-300 transition-colors">
                  {n.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {n.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span>{n.department}</span>
                </span>
                <button
                  onClick={() =>
                    router.push(
                      `/chat?prompt=${encodeURIComponent(`Explain this university notice: "${n.title}". ${n.description}`)}`
                    )
                  }
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                >
                  Ask Assistant →
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Notice Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-white">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{t.addNotice}</h3>
                  <p className="text-xs text-slate-400">Publish immediately to the live university feed</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.noticeTitle}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End Semester Exam Timetable Released"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.noticeCategory}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Examinations">Examinations</option>
                    <option value="Scholarships">Scholarships</option>
                    <option value="Placements">Placements</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Academic">Academic</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.noticePriority}
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Normal">{t.normal}</option>
                    <option value="High">{t.high}</option>
                    <option value="Urgent">{t.urgent}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.noticeDept}
                  </label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.noticeDesc}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter complete notice text and important guidelines..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? "Publishing..." : t.publishNotice}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

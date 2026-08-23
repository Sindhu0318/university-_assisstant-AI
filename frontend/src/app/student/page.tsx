"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { translations } from "@/lib/i18n";
import { api, AssessmentItem, NoticeItem } from "@/lib/api";
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Bell,
  Sparkles,
  CreditCard,
  Award,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const { user, language } = useAuth();
  const t = translations[language];

  // Attendance simulation state
  const [attended, setAttended] = useState<number>(78);
  const [conducted, setConducted] = useState<number>(100);

  const [upcomingAssessments, setUpcomingAssessments] = useState<AssessmentItem[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>([]);

  useEffect(() => {
    api.getUpcomingAssessments(5).then((data) => setUpcomingAssessments(data));
    api.getNotices("All", "All", 3).then((data) => setNotices(data));
  }, []);

  const percentage = conducted > 0 ? Math.round((attended / conducted) * 100) : 0;
  const isSafe = percentage >= 75;
  const isCondonation = percentage >= 65 && percentage < 75;
  const isDetained = percentage < 65;

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 text-white">
      {/* Student Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/50 p-6 rounded-3xl border border-blue-500/20 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t.studentDashboard}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                {user?.student_id || "21BCE1042"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {user?.full_name || "Aarav Sharma"} • {user?.department || "Computer Science & Engineering"}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            router.push(
              `/chat?prompt=${encodeURIComponent(
                "Check my academic standing, attendance requirement, and upcoming assessments."
              )}`
            )
          }
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* 75% Attendance Policy Calculator Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{t.attendanceTracker}</h2>
              <p className="text-xs text-slate-400">
                Official Rule: Minimum 75% aggregate attendance mandatory for exam hall ticket
              </p>
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isSafe
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : isCondonation
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {isSafe ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.safeAttendance}</span>
              </>
            ) : isCondonation ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t.condonationBand}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t.detainedAttendance}</span>
              </>
            )}
          </div>
        </div>

        {/* Attendance Visual Bar & Sliders */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-xs text-slate-400">{t.attendancePercentage}</span>
              <span className="text-3xl font-extrabold text-white">
                {percentage}%{" "}
                <span className="text-xs font-normal text-slate-400">
                  ({attended} / {conducted} Lectures)
                </span>
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative">
              {/* 75% threshold line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                style={{ left: "75%" }}
                title="75% Mandatory Minimum Threshold"
              />
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isSafe ? "bg-emerald-500" : isCondonation ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0%</span>
              <span className="text-amber-400 font-bold">▲ 75% Min. Required</span>
              <span>100%</span>
            </div>
          </div>

          {/* Interactive Calculator Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.classesAttended}: <span className="text-blue-400 font-bold">{attended}</span>
              </label>
              <input
                type="range"
                min="0"
                max={conducted}
                value={attended}
                onChange={(e) => setAttended(parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.classesConducted}: <span className="text-blue-400 font-bold">{conducted}</span>
              </label>
              <input
                type="range"
                min="30"
                max="150"
                value={conducted}
                onChange={(e) => setConducted(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Assessments & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Registered Module Assessments */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
              <h2 className="font-bold text-base text-white">{t.myAssessments}</h2>
            </div>
            <button
              onClick={() => router.push("/assessments")}
              className="text-xs text-indigo-400 hover:underline font-semibold"
            >
              {t.viewAll} →
            </button>
          </div>

          <div className="space-y-3">
            {upcomingAssessments.map((a) => (
              <div
                key={a.id}
                className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between hover:border-slate-600 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">Module {a.code_module}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                      {a.assessment_type}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Presentation {a.code_presentation} • Assessment #{a.id_assessment}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400">{a.weight}% Weight</span>
                  <div className="text-[10px] text-slate-400">{a.date ? `Day ${a.date}` : "Exam"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* University Notices For Students */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              <h2 className="font-bold text-base text-white">{t.latestNotices}</h2>
            </div>
            <button
              onClick={() => router.push("/notices")}
              className="text-xs text-blue-400 hover:underline font-semibold"
            >
              {t.viewAll} →
            </button>
          </div>

          <div className="space-y-3">
            {notices.map((n) => (
              <div
                key={n.id}
                className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white truncate max-w-[240px]">
                    {n.title}
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                      n.priority === "Urgent"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {n.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{n.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

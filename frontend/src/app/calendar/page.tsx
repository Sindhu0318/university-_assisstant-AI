"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, CalendarItem } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { translations } from "@/lib/i18n";
import { Calendar as CalendarIcon, Clock, Sparkles, Flag, BookOpen, PartyPopper } from "lucide-react";

export default function CalendarPage() {
  const router = useRouter();
  const { language } = useAuth();
  const t = translations[language];

  const [events, setEvents] = useState<CalendarItem[]>([]);
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    api.getCalendarEvents(selectedType).then((data) => setEvents(data));
  }, [selectedType]);

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Academic Calendar & Key Dates
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Semester schedules, mid-terms, final exams, and public holidays
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            router.push(
              `/chat?prompt=${encodeURIComponent("When are the upcoming examinations and holidays according to the academic calendar?")}`
            )
          }
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI Calendar Timeline</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        {["All", "Examination", "Classes", "Holiday"].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedType === type
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {type === "All" ? "All Events" : `${type}s`}
          </button>
        ))}
      </div>

      {/* Timeline View */}
      <div className="space-y-4">
        {events.map((ev, idx) => (
          <div
            key={ev.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-2xl ${
                  ev.is_holiday
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : ev.event_type === "Examination"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}
              >
                {ev.is_holiday ? (
                  <PartyPopper className="w-6 h-6" />
                ) : ev.event_type === "Examination" ? (
                  <Flag className="w-6 h-6" />
                ) : (
                  <BookOpen className="w-6 h-6" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {ev.title}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                    {ev.event_type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {ev.description || "University scheduled academic event."}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800 flex-shrink-0">
              <div className="text-xs font-bold text-blue-400">
                {new Date(ev.start_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {ev.end_date && (
                  <span>
                    {" "}
                    -{" "}
                    {new Date(ev.end_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500">{ev.semester}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

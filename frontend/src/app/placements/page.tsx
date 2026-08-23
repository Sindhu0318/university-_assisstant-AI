"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, PlacementItem } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { translations } from "@/lib/i18n";
import { Briefcase, Sparkles, TrendingUp, CheckCircle2, Building, ShieldCheck, Award } from "lucide-react";

export default function PlacementsPage() {
  const router = useRouter();
  const { language } = useAuth();
  const t = translations[language];

  const [drives, setDrives] = useState<PlacementItem[]>([]);

  useEffect(() => {
    api.getPlacements().then((data) => setDrives(data));
  }, []);

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Campus Placements & Career Drives
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Tier 1 (Super Dream), Tier 2 (Dream), eligibility cutoffs, and recruiter schedules
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            router.push(
              `/chat?prompt=${encodeURIComponent("What are the placement eligibility criteria for Super Dream tier and what was the highest package?")}`
            )
          }
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI Placement Guide</span>
        </button>
      </div>

      {/* Statistics Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Placement Rate</span>
          <div className="text-2xl font-extrabold text-emerald-400">94.6%</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Highest Package</span>
          <div className="text-2xl font-extrabold text-blue-400">₹ 48.5 LPA</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Average Package</span>
          <div className="text-2xl font-extrabold text-indigo-400">₹ 8.4 LPA</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Recruiting Partners</span>
          <div className="text-2xl font-extrabold text-purple-400">280+ Companies</div>
        </div>
      </div>

      {/* Placement Drives List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drives.map((d) => (
          <div
            key={d.id}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded font-bold uppercase ${
                    d.tier.includes("Super Dream")
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : d.tier.includes("Dream")
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {d.tier}
                </span>
                <span className="text-sm font-extrabold text-emerald-400">
                  ₹ {d.ctc_lpa} LPA
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-slate-400" />
                  {d.company_name}
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-medium">{d.roles}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Min CGPA:</span>
                  <span className="font-bold text-white">{d.min_cgpa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Active Backlogs:</span>
                  <span className="font-bold text-white">{d.max_backlogs}</span>
                </div>
                <div className="pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                  Eligible: {d.eligible_branches}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() =>
                  router.push(
                    `/chat?prompt=${encodeURIComponent(`What is the selection process and eligibility criteria for ${d.company_name}?`)}`
                  )
                }
                className="text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                Drive Details & Prep →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

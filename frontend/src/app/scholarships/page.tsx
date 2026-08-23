"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, ScholarshipItem } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { translations } from "@/lib/i18n";
import {
  Award,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function ScholarshipsPage() {
  const router = useRouter();
  const { language } = useAuth();
  const t = translations[language];

  const [scholarships, setScholarships] = useState<ScholarshipItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Interactive Matcher state
  const [cgpa, setCgpa] = useState<number>(8.8);
  const [annualIncome, setAnnualIncome] = useState<number>(250000);
  const [isSportsWinner, setIsSportsWinner] = useState<boolean>(false);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    api.getScholarships(selectedCategory).then((data) => setScholarships(data));
  }, [selectedCategory]);

  const runEligibilityCheck = async () => {
    setIsMatching(true);
    try {
      const results = await api.matchScholarships({
        cgpa,
        annual_income: annualIncome,
        is_sports_winner: isSportsWinner,
      });
      setMatchResults(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Scholarships & Financial Aid
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Institutional merit awards, need-based fee waivers, and state schemes
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            router.push(
              `/chat?prompt=${encodeURIComponent("I want to apply for a scholarship. What are the available options and eligibility?")}`
            )
          }
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          <span>Interactive AI Scholarship Guide</span>
        </button>
      </div>

      {/* Interactive Scholarship Matcher Calculator */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-base font-bold text-white">
              Instant Scholarship Eligibility Calculator
            </h2>
            <p className="text-xs text-slate-400">
              Enter your academic CGPA and family income to see matched institutional schemes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Cumulative GPA (CGPA: {cgpa.toFixed(1)})
            </label>
            <input
              type="range"
              min="5.0"
              max="10.0"
              step="0.1"
              value={cgpa}
              onChange={(e) => setCgpa(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>5.0</span>
              <span>7.5</span>
              <span>10.0</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Annual Household Income (₹ {annualIncome.toLocaleString()})
            </label>
            <input
              type="range"
              min="50000"
              max="1000000"
              step="25000"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>₹50K</span>
              <span>₹3 Lakhs (EWS)</span>
              <span>₹10L+</span>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={isSportsWinner}
                onChange={(e) => setIsSportsWinner(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0"
              />
              <span>State/National Sports Medalist</span>
            </label>
            <button
              onClick={runEligibilityCheck}
              disabled={isMatching}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              {isMatching ? "Calculating..." : "Check Eligible Scholarships"}
            </button>
          </div>
        </div>

        {/* Match Results */}
        {matchResults.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-3 animate-fade-in">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Matched Eligibility Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {matchResults.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    m.is_eligible
                      ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                      : "bg-slate-950/40 border-slate-800 text-slate-400"
                  } space-y-1.5`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">
                      {m.scholarship.name}
                    </span>
                    {m.is_eligible ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Eligible
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Ineligible</span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-blue-300">
                    {m.scholarship.award_amount}
                  </div>
                  {m.reasons.length > 0 && (
                    <ul className="text-[10px] text-slate-400 space-y-0.5 pt-1">
                      {m.reasons.map((r: string, ri: number) => (
                        <li key={ri}>• {r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Available Schemes List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">All Institutional Scholarships</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scholarships.map((s) => (
            <div
              key={s.id}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {s.category}
                  </span>
                  <span className="text-[11px] text-red-400 font-semibold">
                    Due: {s.deadline}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white">{s.name}</h3>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    Scholarship Award
                  </span>
                  <div className="font-extrabold text-sm text-emerald-400">
                    {s.award_amount}
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <span className="font-semibold text-slate-400 block text-[11px]">
                    Eligibility Criteria:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{s.eligibility}</p>
                </div>

                {s.required_documents && (
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <strong>Documents:</strong> {s.required_documents}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() =>
                    router.push(
                      `/chat?prompt=${encodeURIComponent(`What are the documents and steps required to apply for ${s.name}?`)}`
                    )
                  }
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                >
                  Ask Procedure →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

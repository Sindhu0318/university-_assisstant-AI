"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, FeeItem } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { translations } from "@/lib/i18n";
import { CreditCard, Sparkles, AlertCircle, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function FeesPage() {
  const router = useRouter();
  const { language } = useAuth();
  const t = translations[language];

  const [fees, setFees] = useState<FeeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    api.getFees(selectedCategory).then((data) => setFees(data));
  }, [selectedCategory]);

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Fee Structures & Refund Policies
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Approved tuition schedules, hostel fees, payment deadlines, and penalties
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            router.push(
              `/chat?prompt=${encodeURIComponent("What is the tuition fee structure for B.Tech CSE and what is the late payment penalty?")}`
            )
          }
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI About Fees & Refunds</span>
        </button>
      </div>

      {/* Policy Highlights Alert */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-400">
          <AlertCircle className="w-4 h-4" />
          <span>Important Payment Deadlines & UGC Refund Guidelines (2025-2026)</span>
        </div>
        <p>
          • <strong>Odd Semester Due Date:</strong> July 15th | <strong>Even Semester Due Date:</strong> December 15th.
        </p>
        <p>
          • <strong>Late Fee Penalty:</strong> Rs. 500 up to 7 days, Rs. 1,500 up to 20 days. Beyond 20 days portal access is locked.
        </p>
        <p>
          • <strong>Refund Tier:</strong> 100% refund up to 15 days before last admission date; 80% up to 15 days after; 0% after 30 days.
        </p>
      </div>

      {/* Fee Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
              <tr>
                <th className="px-6 py-3.5">Program / Service</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Amount (INR)</th>
                <th className="px-6 py-3.5">Frequency</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {fees.map((f) => (
                <tr key={f.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{f.program}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {f.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-emerald-400 text-sm">
                    ₹ {f.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-400">{f.frequency}</td>
                  <td className="px-6 py-4 font-medium text-slate-300">{f.due_date}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() =>
                        router.push(
                          `/chat?prompt=${encodeURIComponent(`What is the fee breakdown and payment deadline for ${f.program}?`)}`
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-[11px] font-medium transition-all"
                    >
                      Ask AI →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

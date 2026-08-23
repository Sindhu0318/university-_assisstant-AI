"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { translations } from "@/lib/i18n";
import { api, NoticeItem, AssessmentItem } from "@/lib/api";
import {
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Mic,
  FileSpreadsheet,
  BookOpen,
  Award,
  CreditCard,
  Briefcase,
  Bell,
  Calendar,
  CheckCircle2,
  Layers,
  GraduationCap,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { language, user } = useAuth();
  const t = translations[language];

  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [upcoming, setUpcoming] = useState<AssessmentItem[]>([]);

  useEffect(() => {
    api.getNotices().then((data) => setNotices(data.slice(0, 3)));
    api.getUpcomingAssessments().then((data) => setUpcoming(data.slice(0, 4)));
  }, []);

  const samplePrompts = [
    "What is the minimum attendance requirement and condonation rules?",
    "What assessments are scheduled for module AAA in 2013J?",
    "What is the penalty for examination malpractice?",
    "How can I apply for the Chancellor's Merit Scholarship?",
    "What are the placement eligibility criteria for Super Dream jobs?",
    "హాజరు శాతం 75% కంటే తక్కువ ఉంటే ఏమి జరుగుతుంది? (Telugu)",
  ];

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center w-full">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Production-Ready Multilingual University RAG Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Verified Academic Intelligence for{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Students & Faculty
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Ask questions in <strong className="text-white">English, Telugu, or Hindi</strong>.
          Get instant, citation-grounded answers retrieved directly from official university regulations, attendance policies, examination rules, and structured assessment datasets.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/chat"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all hover:scale-105"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Launch AI Assistant</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/assessments"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm transition-all hover:scale-105"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <span>Explore Assessments Dataset</span>
          </Link>
        </div>

        {/* Quick Question Launchers */}
        <div className="mt-12 max-w-3xl mx-auto">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center justify-center gap-1.5">
            <span>✨ Click a question to ask AI immediately</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {samplePrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => router.push(`/chat?prompt=${encodeURIComponent(q)}`)}
                className="px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-700 border border-slate-700/70 hover:border-blue-500/50 text-xs text-slate-300 hover:text-white transition-all text-left group"
              >
                <span>{q}</span>
                <span className="ml-1.5 text-blue-400 group-hover:translate-x-0.5 inline-block transition-transform">→</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Live System Metrics Bar */}
      <section className="border-y border-slate-800 bg-slate-900/60 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">199+</div>
            <div className="text-xs text-slate-400 font-medium">Structured Assessments (OULAD)</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">100%</div>
            <div className="text-xs text-slate-400 font-medium">Verified Grounded Citations</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">3 Languages</div>
            <div className="text-xs text-slate-400 font-medium">English • తెలుగు • हिंदी</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">0 ms Voice</div>
            <div className="text-xs text-slate-400 font-medium">Real-Time Speech Interaction</div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Comprehensive University Knowledge Architecture
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Engineered with Hybrid RAG combining relational SQL for structured assessment queries and vector similarity search for university handbooks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Hybrid RAG & Zero Hallucination */}
          <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero-Hallucination RAG</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every factual answer cites official document titles, sections, and page numbers. When information is unavailable, the AI explicitly states it rather than guessing.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 75% Attendance mandatory rule
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Exam malpractice tiers & penalties
              </li>
            </ul>
          </div>

          {/* Card 2: Structured Assessment Dataset */}
          <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">assessments.csv Integration</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Full relational ingestion of Open University assessment dataset. Filter by module (AAA-GGG), presentations (2013J, 2014B), TMA/CMA types, and weightages.
            </p>
            <Link
              href="/assessments"
              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold pt-2"
            >
              Browse Assessments →
            </Link>
          </div>

          {/* Card 3: Multilingual Voice Assistant */}
          <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Multilingual Voice Interaction</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time Speech-to-Text and Text-to-Speech playback in English, Telugu (తెలుగు), and Hindi (हिंदी). Seamlessly switch languages during conversations.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-semibold pt-2"
            >
              Try Voice Chat →
            </Link>
          </div>
        </div>
      </section>

      {/* Live Campus Updates & Upcoming Deadlines */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest Notices */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base text-white">{t.latestNotices}</h3>
              </div>
              <Link href="/notices" className="text-xs text-blue-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{n.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        n.priority === "Urgent"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {n.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{n.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Assessments */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base text-white">{t.upcomingAssessments}</h3>
              </div>
              <Link href="/assessments" className="text-xs text-indigo-400 hover:underline">
                Dataset Explorer
              </Link>
            </div>

            <div className="space-y-3">
              {upcoming.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">Module {a.code_module}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                        {a.assessment_type}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Presentation {a.code_presentation} • Assessment ID #{a.id_assessment}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400">{a.weight}% Weight</div>
                    <div className="text-[10px] text-slate-400">
                      {a.date ? `Day ${a.date}` : "Exam Period"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

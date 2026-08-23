"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { translations } from "@/lib/i18n";
import StudentDashboard from "@/app/student/page";
import FacultyDashboard from "@/app/faculty/page";
import AdminDashboard from "@/app/admin/page";
import { GraduationCap, Users, ShieldAlert, Layers } from "lucide-react";

export default function DashboardHubPage() {
  const { user, language } = useAuth();
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<"student" | "faculty" | "admin">(
    user?.role === "admin" ? "admin" : user?.role === "faculty" ? "faculty" : "student"
  );

  return (
    <div className="flex-1 flex flex-col w-full bg-slate-950 text-white">
      {/* 3 Dashboard Switcher Top Tab Bar */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-16 z-20 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>{t.selectDashboard}:</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            {/* Student Dashboard Tab */}
            <button
              onClick={() => setActiveTab("student")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "student"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{t.studentDashboard}</span>
            </button>

            {/* Faculty Dashboard Tab */}
            <button
              onClick={() => setActiveTab("faculty")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "faculty"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{t.facultyDashboard}</span>
            </button>

            {/* Admin Dashboard Tab */}
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "admin"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t.adminDashboard}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Active Dashboard */}
      <div className="flex-1">
        {activeTab === "student" && <StudentDashboard />}
        {activeTab === "faculty" && <FacultyDashboard />}
        {activeTab === "admin" && <AdminDashboard />}
      </div>
    </div>
  );
}

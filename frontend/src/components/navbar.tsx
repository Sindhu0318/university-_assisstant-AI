"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { translations, LanguageCode } from "@/lib/i18n";
import {
  GraduationCap,
  MessageSquare,
  FileSpreadsheet,
  Bell,
  Calendar as CalendarIcon,
  Award,
  CreditCard,
  Briefcase,
  BookOpen,
  ShieldAlert,
  Globe,
  User,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  Layers,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, language, setLanguage, switchRole, logout } = useAuth();
  const t = translations[language];

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/chat", label: t.chat, icon: MessageSquare, badge: "Live AI" },
    { href: "/dashboard", label: t.dashboards, icon: Layers },
    { href: "/assessments", label: t.assessments, icon: FileSpreadsheet },
    { href: "/notices", label: t.notices, icon: Bell },
    { href: "/calendar", label: t.calendar, icon: CalendarIcon },
    { href: "/scholarships", label: t.scholarships, icon: Award },
    { href: "/fees", label: t.fees, icon: CreditCard },
    { href: "/placements", label: t.placements, icon: Briefcase },
    { href: "/documents", label: t.documents, icon: BookOpen },
  ];

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "te", label: "తెలుగు (Telugu)", flag: "🇮🇳" },
    { code: "hi", label: "हिंदी (Hindi)", flag: "🇮🇳" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-200 bg-clip-text text-transparent">
                UniAssist AI
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> RAG
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-inner"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                  {link.badge && (
                    <span className="text-[9px] px-1 rounded bg-blue-500 text-white font-semibold animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls (Language, Role Badge, Auth) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors shadow-sm"
                title="Select Preferred Language"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span className="uppercase font-bold text-blue-300">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl py-1.5 z-50 animate-fade-in">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {t.language}
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                        language === l.code
                          ? "bg-blue-600/20 text-blue-400 font-bold"
                          : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {language === l.code && <span className="text-blue-400">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Role Switcher */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsRoleOpen(!isRoleOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  user?.role === "admin"
                    ? "bg-purple-950/40 border-purple-500/40 text-purple-300"
                    : user?.role === "faculty"
                    ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                    : "bg-blue-950/40 border-blue-500/40 text-blue-300"
                }`}
                title="Active Role / Quick Switch"
              >
                <User className="w-3.5 h-3.5" />
                <span className="capitalize">{user?.role || "Student"}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {isRoleOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl py-1.5 z-50 animate-fade-in">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {t.role}
                  </div>
                  {(["student", "faculty", "admin"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setIsRoleOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left capitalize transition-colors ${
                        user?.role === r
                          ? "bg-blue-600/20 text-blue-400 font-bold"
                          : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            r === "admin"
                              ? "bg-purple-400"
                              : r === "faculty"
                              ? "bg-emerald-400"
                              : "bg-blue-400"
                          }`}
                        />
                        {r === "student" ? t.student : r === "faculty" ? t.faculty : t.administrator}
                      </span>
                      {user?.role === r && <span className="text-blue-400">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

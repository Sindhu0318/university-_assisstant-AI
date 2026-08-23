"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { GraduationCap, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/chat");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: "student" | "faculty" | "admin") => {
    switchRole(role);
    router.push("/chat");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">University Portal Login</h1>
          <p className="text-xs text-slate-400">
            Sign in to access your grounded academic assistant
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              University Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="email"
                required
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            {loading ? "Authenticating..." : "Sign In with Credentials"}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
            One-Click Test Profiles
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin("student")}
              className="p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/40 border border-blue-500/30 text-center space-y-1 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-blue-400 mx-auto" />
              <div className="text-[11px] font-bold text-blue-300">Student</div>
              <div className="text-[9px] text-slate-400">Aarav Sharma</div>
            </button>

            <button
              onClick={() => handleQuickLogin("faculty")}
              className="p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-center space-y-1 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 mx-auto" />
              <div className="text-[11px] font-bold text-emerald-300">Faculty</div>
              <div className="text-[9px] text-slate-400">Dr. Priya S.</div>
            </button>

            <button
              onClick={() => handleQuickLogin("admin")}
              className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/30 text-center space-y-1 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-purple-400 mx-auto" />
              <div className="text-[11px] font-bold text-purple-300">Admin</div>
              <div className="text-[9px] text-slate-400">Dean Systems</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { LanguageCode } from "@/lib/i18n";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "student" | "faculty" | "admin";
  department?: string;
  student_id?: string;
  preferred_language: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: "student" | "faculty" | "admin") => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage on mount
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    const savedLang = localStorage.getItem("app_language") as LanguageCode;

    if (savedLang) setLanguageState(savedLang);

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    } else {
      // Default to demo student for immediate interaction
      const defaultUser: User = {
        id: 1,
        email: "student@university.edu",
        full_name: "Aarav Sharma",
        role: "student",
        department: "Computer Science & Engineering",
        student_id: "21BCE1042",
        preferred_language: "en",
      };
      setUser(defaultUser);
    }
    setIsLoading(false);
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);
  };

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem("auth_token", data.access_token);
    localStorage.setItem("auth_user", JSON.stringify(data.user));
    if (data.user.preferred_language) {
      setLanguage(data.user.preferred_language as LanguageCode);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  const switchRole = (role: "student" | "faculty" | "admin") => {
    let mockUser: User;
    if (role === "admin") {
      mockUser = {
        id: 3,
        email: "admin@university.edu",
        full_name: "Dean of Academic Systems",
        role: "admin",
        department: "Central Administration",
        preferred_language: language,
      };
    } else if (role === "faculty") {
      mockUser = {
        id: 2,
        email: "faculty@university.edu",
        full_name: "Dr. Priya Sundaram",
        role: "faculty",
        department: "Computer Science & Engineering",
        preferred_language: language,
      };
    } else {
      mockUser = {
        id: 1,
        email: "student@university.edu",
        full_name: "Aarav Sharma",
        role: "student",
        department: "Computer Science & Engineering",
        student_id: "21BCE1042",
        preferred_language: language,
      };
    }
    setUser(mockUser);
    localStorage.setItem("auth_user", JSON.stringify(mockUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        language,
        setLanguage,
        login,
        logout,
        switchRole,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

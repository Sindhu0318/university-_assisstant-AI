import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "UniAssist AI | Multilingual University AI Assistant & Knowledge Platform",
  description: "Official production-grade University AI Assistant with RAG, structured assessments, academic regulations, attendance policies, voice assistant, and multilingual capabilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

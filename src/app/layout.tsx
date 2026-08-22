import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartFlow One — Financial Intelligence",
  description: "AI-powered financial SaaS dashboard",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-full min-h-screen bg-slate-50 font-sans text-slate-800">
        {/* Sidebar */}
        <Sidebar />

        {/* Main area offset by sidebar width */}
        <div className="flex flex-1 flex-col pl-64">
          <TopBar />
          <main className="flex-1 overflow-y-auto bg-white p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

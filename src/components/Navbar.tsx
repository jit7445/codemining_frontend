"use client";

import React from "react";
import DarkModeSwitch from "./DarkModeSwitch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Code2, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const currentLang = pathname.split("/").pop();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-14 px-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 transition-colors">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition" />

        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            CodeMining
          </span>
        </Link>

        {currentLang && currentLang !== "codeditor" && currentLang !== "" && (
          <div className="hidden sm:flex items-center gap-2 ml-2 pl-3 border-l border-slate-200 dark:border-zinc-800">
            <span className="text-xs text-slate-400 font-medium">Language:</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 capitalize">
              {currentLang}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-zinc-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden md:inline">Online IDE</span>
        </div>

        <div className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition">
          <DarkModeSwitch />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

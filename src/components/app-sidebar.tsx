"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SiPython,
  SiCplusplus,
  SiC,
  SiRuby,
  SiPhp,
  SiGo,
  SiRust,
} from "react-icons/si";
import { IoLogoJavascript } from "react-icons/io";
import { FaJava } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { Code2 } from "lucide-react";

const languages = [
  {
    title: "JavaScript",
    url: "/codeditor/javascript",
    icon: IoLogoJavascript,
    language: "javascript",
    color: "text-amber-400",
  },
  {
    title: "Python",
    url: "/codeditor/python",
    icon: SiPython,
    language: "python",
    color: "text-blue-400",
  },
  {
    title: "C++",
    url: "/codeditor/cpp",
    icon: SiCplusplus,
    language: "cpp",
    color: "text-sky-400",
  },
  {
    title: "Java",
    url: "/codeditor/java",
    icon: FaJava,
    language: "java",
    color: "text-orange-400",
  },
  {
    title: "Go",
    url: "/codeditor/go",
    icon: SiGo,
    language: "go",
    color: "text-cyan-400",
  },
  {
    title: "Rust",
    url: "/codeditor/rust",
    icon: SiRust,
    language: "rust",
    color: "text-amber-600",
  },
  {
    title: "PHP",
    url: "/codeditor/php",
    icon: SiPhp,
    language: "php",
    color: "text-indigo-400",
  },
  {
    title: "Ruby",
    url: "/codeditor/ruby",
    icon: SiRuby,
    language: "ruby",
    color: "text-rose-500",
  },
  {
    title: "C",
    url: "/codeditor/c",
    icon: SiC,
    language: "c",
    color: "text-blue-500",
  },
  {
    title: "C#",
    url: "/codeditor/csharp",
    icon: FiSettings,
    language: "csharp",
    color: "text-purple-400",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 dark:border-zinc-800">
      <SidebarHeader className="p-3 border-b border-slate-200/60 dark:border-zinc-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="hover:bg-slate-100 dark:hover:bg-zinc-800">
              <Link href="/codeditor/javascript" className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
                  <Code2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                    CodeMining
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Multi-Language Compiler
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
            Languages
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {languages.map((item) => {
                const isActive = pathname.toLowerCase() === item.url.toLowerCase();
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`transition-all duration-150 rounded-lg px-3 py-2 ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold shadow-sm"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800/80"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 w-full">
                        <Icon className={`w-4 h-4 shrink-0 ${item.color}`} />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
            Preferences
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/codeditor/settings"}
                  tooltip="Settings"
                  className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  <Link href="/codeditor/settings" className="flex items-center gap-3 w-full">
                    <FiSettings className="w-4 h-4 text-slate-500" />
                    <span className="text-sm">IDE Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

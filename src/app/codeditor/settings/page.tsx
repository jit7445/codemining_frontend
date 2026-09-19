"use client";

import React, { useState } from "react";
import { FiSettings, FiCheck, FiSliders } from "react-icons/fi";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState("14");
  const [tabSize, setTabSize] = useState("2");
  const [wordWrap, setWordWrap] = useState("on");
  const [minimap, setMinimap] = useState(false);

  const handleSave = () => {
    toast.success("IDE preferences saved successfully!");
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto overflow-y-auto bg-background p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <FiSettings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            IDE Settings & Configuration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize code editor themes, font scaling, indentation, and compiler defaults.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="bg-slate-50 dark:bg-zinc-900/60 p-5 rounded-xl border border-slate-200/80 dark:border-zinc-800 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <FiSliders className="w-4 h-4" /> Visual Theme
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "dark", label: "Dark Modern (VS Code)" },
              { id: "light", label: "Light Clean" },
              { id: "system", label: "System Default" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium transition ${
                  theme === t.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white dark:bg-zinc-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-zinc-700 hover:border-blue-400"
                }`}
              >
                <span>{t.label}</span>
                {theme === t.id && <FiCheck className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Editor Options */}
        <div className="bg-slate-50 dark:bg-zinc-900/60 p-5 rounded-xl border border-slate-200/80 dark:border-zinc-800 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Editor Formatting
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Font Size (px)
              </label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-sm"
              >
                <option value="12">12 px</option>
                <option value="14">14 px (Default)</option>
                <option value="16">16 px</option>
                <option value="18">18 px</option>
                <option value="20">20 px</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tab Size (Spaces)
              </label>
              <select
                value={tabSize}
                onChange={(e) => setTabSize(e.target.value)}
                className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-sm"
              >
                <option value="2">2 Spaces</option>
                <option value="4">4 Spaces</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Word Wrapping
              </label>
              <select
                value={wordWrap}
                onChange={(e) => setWordWrap(e.target.value)}
                className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg p-2 text-sm"
              >
                <option value="on">On (Wrap lines)</option>
                <option value="off">Off (Scroll horizontally)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800 rounded-lg border border-slate-300 dark:border-zinc-700">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Show Minimap Overview
              </span>
              <input
                type="checkbox"
                checked={minimap}
                onChange={(e) => setMinimap(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useTheme } from "next-themes";
import {
  Play,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Code2,
  ChevronDown,
} from "lucide-react";
import { codeSnippets, languageOptions } from "@/config/config";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";

interface CodeEditorProps {
  initialLanguage?: string;
}

export default function CodeEditor({ initialLanguage }: CodeEditorProps) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [currentLangOption, setCurrentLangOption] = useState(() => {
    const routeLang = initialLanguage || pathname.split("/").pop() || "javascript";
    return (
      languageOptions.find(
        (opt) => opt.language.toLowerCase() === routeLang.toLowerCase()
      ) || languageOptions[0]
    );
  });

  const [sourceCode, setSourceCode] = useState<string>(
    () => codeSnippets[currentLangOption.language] || codeSnippets["javascript"] || ""
  );
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);
  const [executionTime, setExecutionTime] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"editor" | "output">("editor");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [fontSize, setFontSize] = useState<number>(14);

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    const routeLang = pathname.split("/").pop();
    const matchingOption = languageOptions.find(
      (opt) => opt.language.toLowerCase() === routeLang?.toLowerCase()
    );

    if (matchingOption) {
      setCurrentLangOption(matchingOption);
      if (codeSnippets[matchingOption.language]) {
        setSourceCode(codeSnippets[matchingOption.language]);
      }
    }
  }, [pathname]);

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
    editor.focus();
  }

  function handleLanguageChange(langKey: string) {
    const found = languageOptions.find((opt) => opt.language === langKey);
    if (found) {
      setCurrentLangOption(found);
      if (codeSnippets[found.language]) {
        setSourceCode(codeSnippets[found.language]);
      }
      router.push(`/codeditor/${found.language}`);
    }
  }

  function handleResetCode() {
    const defaultSnippet = codeSnippets[currentLangOption.language] || "";
    setSourceCode(defaultSnippet);
    toast.success("Code reset to template");
  }

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(sourceCode);
      setCopiedCode(true);
      toast.success("Code copied to clipboard");
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  }

  async function handleCopyOutput() {
    if (output.length === 0) return;
    try {
      await navigator.clipboard.writeText(output.join("\n"));
      setCopiedOutput(true);
      toast.success("Output copied to clipboard");
      setTimeout(() => setCopiedOutput(false), 2000);
    } catch {
      toast.error("Failed to copy output");
    }
  }

  const executeCode = useCallback(async () => {
    setLoading(true);
    setHasError(false);
    setActiveTab("output");
    const startTime = performance.now();

    try {
      const result = await fetch("http://localhost:3000/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: currentLangOption.language,
          code: sourceCode,
        }),
      });

      const data = await result.json();
      const endTime = performance.now();
      setExecutionTime(`${((endTime - startTime) / 1000).toFixed(2)}s`);

      if (result.ok && data.output !== undefined) {
        setOutput(String(data.output).split("\n"));
        setHasError(false);
        toast.success("Executed successfully");
      } else {
        const errMessage = data.error || data.message || "Execution error occurred";
        setOutput(String(errMessage).split("\n"));
        setHasError(true);
        toast.error("Execution error");
      }
    } catch (err: unknown) {
      const endTime = performance.now();
      const errorMessage = err instanceof Error ? err.message : String(err);
      setExecutionTime(`${((endTime - startTime) / 1000).toFixed(2)}s`);
      setHasError(true);
      setOutput([
        "⚠️ Connection Error: Could not reach the code execution service (localhost:3000).",
        "Make sure the backend server is running.",
        `Details: ${errorMessage}`,
      ]);
      toast.error("Failed to connect to execution engine");
    } finally {
      setLoading(false);
    }
  }, [currentLangOption.language, sourceCode]);

  // Keyboard shortcut Ctrl+Enter / Cmd+Enter to run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        executeCode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [executeCode]);

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-hidden bg-background text-foreground rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xl">
      {/* Editor Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Language Selector Dropdown */}
          <div className="relative inline-block text-left">
            <select
              value={currentLangOption.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-slate-100 py-1.5 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer capitalize"
            >
              {languageOptions.map((opt) => (
                <option key={opt.language} value={opt.language}>
                  {opt.language} ({opt.version})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Font Size Selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs text-slate-600 dark:text-slate-300">
            <span>Font:</span>
            <button
              onClick={() => setFontSize((f) => Math.max(12, f - 1))}
              className="px-1.5 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded font-bold"
              title="Decrease Font Size"
            >
              -
            </button>
            <span className="font-semibold w-4 text-center">{fontSize}</span>
            <button
              onClick={() => setFontSize((f) => Math.min(24, f + 1))}
              className="px-1.5 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded font-bold"
              title="Increase Font Size"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mobile Tabs */}
          <div className="flex sm:hidden bg-slate-200 dark:bg-zinc-800 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab("editor")}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === "editor"
                  ? "bg-white dark:bg-zinc-950 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab("output")}
              className={`px-3 py-1 rounded-md transition ${
                activeTab === "output"
                  ? "bg-white dark:bg-zinc-950 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Output {output.length > 0 && "•"}
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200/50 dark:hover:bg-zinc-800 rounded-lg transition"
            title="Copy Code"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleResetCode}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-200/50 dark:hover:bg-zinc-800 rounded-lg transition"
            title="Reset Code Template"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Run Code Button */}
          <button
            onClick={executeCode}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-blue-500/25 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run</span>
                <span className="hidden md:inline text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white/90 ml-1">
                  ⌘↵
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Responsive Main Layout (Desktop split, Mobile tabs) */}
      <div className="flex-1 w-full min-h-0 overflow-hidden relative">
        {/* Desktop Split View */}
        <div className="hidden sm:block h-full w-full">
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            {/* Editor Panel */}
            <ResizablePanel defaultSize={55} minSize={30} className="h-full">
              <div className="h-full w-full overflow-hidden relative">
                <Editor
                  theme={theme === "dark" ? "vs-dark" : "vs-light"}
                  height="100%"
                  language={currentLangOption.language}
                  value={sourceCode}
                  onChange={(val) => setSourceCode(val || "")}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize: fontSize,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 12, bottom: 12 },
                    lineNumbersMinChars: 3,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    fontFamily: "var(--font-geist-mono), monospace",
                  }}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-slate-200 dark:bg-zinc-800 hover:bg-blue-500 transition" />

            {/* Terminal Output Panel */}
            <ResizablePanel defaultSize={45} minSize={25} className="h-full">
              <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-mono overflow-hidden">
                {/* Output Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-xs shrink-0">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-slate-300">Terminal Output</span>
                    {executionTime && (
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                        {executionTime}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {output.length > 0 && (
                      <button
                        onClick={handleCopyOutput}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition"
                        title="Copy Console Output"
                      >
                        {copiedOutput ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setOutput([]);
                        setHasError(false);
                        setExecutionTime(null);
                      }}
                      className="text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 px-2 py-0.5 rounded transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Output Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-1 text-sm leading-relaxed">
                  {loading ? (
                    <div className="flex items-center gap-3 text-blue-400 pt-4">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Compiling and executing code...</span>
                    </div>
                  ) : output.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12 text-center">
                      <Code2 className="w-10 h-10 mb-2 opacity-30" />
                      <p className="text-sm">Click &quot;Run&quot; or press ⌘↵ to execute code.</p>
                    </div>
                  ) : hasError ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-rose-400 font-semibold border-b border-rose-500/20 pb-2 mb-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Execution Error</span>
                      </div>
                      {output.map((line, idx) => (
                        <div key={idx} className="text-rose-300 whitespace-pre-wrap break-words">
                          {line}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-3">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Process exited successfully</span>
                      </div>
                      {output.map((line, idx) => (
                        <div key={idx} className="text-slate-200 whitespace-pre-wrap break-words font-mono">
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile View (Tabbed) */}
        <div className="block sm:hidden h-full w-full">
          {activeTab === "editor" ? (
            <div className="h-full w-full overflow-hidden">
              <Editor
                theme={theme === "dark" ? "vs-dark" : "vs-light"}
                height="100%"
                language={currentLangOption.language}
                value={sourceCode}
                onChange={(val) => setSourceCode(val || "")}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: fontSize,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 8, bottom: 8 },
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-mono overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
                <span className="font-semibold text-slate-300">Terminal Output</span>
                {executionTime && (
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    {executionTime}
                  </span>
                )}
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-1 text-sm">
                {loading ? (
                  <div className="flex items-center gap-3 text-blue-400 pt-4">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Executing code...</span>
                  </div>
                ) : output.length === 0 ? (
                  <div className="text-slate-500 text-center py-8">
                    No output yet. Run your code to see output here.
                  </div>
                ) : (
                  output.map((line, idx) => (
                    <div
                      key={idx}
                      className={hasError ? "text-rose-300 whitespace-pre-wrap" : "text-slate-200 whitespace-pre-wrap"}
                    >
                      {line}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

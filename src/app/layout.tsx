import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/Navbar";
import ToasterContext from "./context/ToasterContext";
import { ThemeProvider } from "./theme-provider";
import Assist from "@/components/aigent/Assist";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CodeMining - Online Multi-Language Code Compiler & IDE",
  description: "Compile, run, and debug code instantly in JavaScript, Python, C++, Java, Rust, Go, PHP, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen overflow-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToasterContext />
          <SidebarProvider defaultOpen={true}>
            <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-zinc-950 text-foreground">
              <AppSidebar />
              <main className="flex-1 flex flex-col h-screen w-full min-w-0 overflow-hidden">
                <Navbar />
                <div className="flex-1 w-full min-h-0 overflow-hidden p-2 sm:p-3 md:p-4">
                  {children}
                </div>
              </main>
            </div>
          </SidebarProvider>
          <Assist />
        </ThemeProvider>
      </body>
    </html>
  );
}

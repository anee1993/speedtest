import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import Nav from "./_components/Nav";
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
  title: {
    default: "How Fast Is My Internet? | Free Speed Test",
    template: "%s | howfastismy.net",
  },
  description:
    "Test your internet speed instantly. Measure download, upload, ping, jitter and network quality for free.",
  keywords: [
    "internet speed test",
    "wifi speed test",
    "download speed",
    "upload speed",
    "ping test",
    "jitter",
    "broadband speed test",
  ],
  openGraph: {
    title: "How Fast Is My Internet? | Free Speed Test",
    description:
      "Measure download, upload, ping and jitter. Get an Internet Health Score with personalized recommendations.",
    url: "https://howfastismy.net",
    siteName: "howfastismy.net",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {/* Header / Nav */}
        <Nav />

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-white/5 py-6 px-6 text-center text-xs text-slate-400">
          <p>© 2024 howfastismy.net — Free Internet Speed & Network Diagnostics</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/about" className="hover:text-slate-300 transition">About</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition">Privacy</Link>
            <Link href="/contact" className="hover:text-slate-300 transition">Contact</Link>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}

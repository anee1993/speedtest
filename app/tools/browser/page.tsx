"use client";

import { useState, useEffect } from "react";

interface BrowserInfo {
  browser: string;
  version: string;
  os: string;
  platform: string;
  language: string;
  cookiesEnabled: string;
  javaEnabled: string;
  screenSize: string;
  windowSize: string;
  colorDepth: string;
  devicePixelRatio: string;
  touchSupport: string;
  connection: string;
  timezone: string;
  doNotTrack: string;
  userAgent: string;
}

function detectBrowser(): BrowserInfo {
  const ua = navigator.userAgent;

  let browser = "Unknown";
  let version = "";
  if (ua.includes("Firefox/")) { browser = "Firefox"; version = ua.split("Firefox/")[1]?.split(" ")[0] || ""; }
  else if (ua.includes("Edg/")) { browser = "Microsoft Edge"; version = ua.split("Edg/")[1]?.split(" ")[0] || ""; }
  else if (ua.includes("OPR/")) { browser = "Opera"; version = ua.split("OPR/")[1]?.split(" ")[0] || ""; }
  else if (ua.includes("Chrome/") && !ua.includes("Edg/")) { browser = "Google Chrome"; version = ua.split("Chrome/")[1]?.split(" ")[0] || ""; }
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) { browser = "Safari"; version = ua.split("Version/")[1]?.split(" ")[0] || ""; }

  let os = "Unknown";
  if (ua.includes("Windows NT 10")) os = "Windows 10/11";
  else if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS X")) os = "macOS " + (ua.match(/Mac OS X ([0-9_]+)/)?.[1]?.replace(/_/g, ".") || "");
  else if (ua.includes("Android")) os = "Android " + (ua.match(/Android ([0-9.]+)/)?.[1] || "");
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS " + (ua.match(/OS ([0-9_]+)/)?.[1]?.replace(/_/g, ".") || "");
  else if (ua.includes("Linux")) os = "Linux";

  const nav = navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number } };
  const conn = nav.connection;
  const connStr = conn ? `${conn.effectiveType || "?"} (~${conn.downlink || "?"}Mbps)` : "Not available";

  return {
    browser,
    version,
    os,
    platform: navigator.platform || "Unknown",
    language: navigator.language || "Unknown",
    cookiesEnabled: navigator.cookieEnabled ? "Yes" : "No",
    javaEnabled: "No (deprecated)",
    screenSize: `${screen.width} × ${screen.height}`,
    windowSize: `${window.innerWidth} × ${window.innerHeight}`,
    colorDepth: `${screen.colorDepth}-bit`,
    devicePixelRatio: `${window.devicePixelRatio}x`,
    touchSupport: "ontouchstart" in window ? "Yes" : "No",
    connection: connStr,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    doNotTrack: navigator.doNotTrack === "1" ? "Enabled" : "Disabled",
    userAgent: ua,
  };
}

export default function BrowserPage() {
  const [info, setInfo] = useState<BrowserInfo | null>(null);

  useEffect(() => {
    setInfo(detectBrowser());
  }, []);

  if (!info) return null;

  const rows = [
    { label: "Browser", val: `${info.browser} ${info.version}` },
    { label: "Operating System", val: info.os },
    { label: "Platform", val: info.platform },
    { label: "Language", val: info.language },
    { label: "Timezone", val: info.timezone },
    { label: "Screen Size", val: info.screenSize },
    { label: "Window Size", val: info.windowSize },
    { label: "Color Depth", val: info.colorDepth },
    { label: "Pixel Ratio", val: info.devicePixelRatio },
    { label: "Touch Support", val: info.touchSupport },
    { label: "Cookies", val: info.cookiesEnabled },
    { label: "Connection", val: info.connection },
    { label: "Do Not Track", val: info.doNotTrack },
  ];

  return (
    <div className="max-w-lg w-full">
      <h1 className="text-2xl font-bold mb-2 text-center">🖥️ Browser Test</h1>
      <p className="text-sm text-slate-400 mb-6 text-center">What your browser tells websites about you</p>

      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
        {/* Hero info */}
        <div className="text-center mb-5">
          <p className="text-2xl font-bold">{info.browser}</p>
          <p className="text-sm text-slate-400">{info.os}</p>
        </div>

        <div className="grid grid-cols-1 gap-0">
          {rows.map(r => (
            <div key={r.label} className="flex justify-between py-2.5 border-b border-white/[0.04]">
              <span className="text-xs text-slate-500">{r.label}</span>
              <span className="text-xs text-slate-200 font-semibold text-right">{r.val}</span>
            </div>
          ))}
        </div>

        {/* User Agent (full, collapsible feel) */}
        <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <p className="text-[0.6rem] text-slate-500 uppercase tracking-wide mb-1">User Agent String</p>
          <p className="text-[0.65rem] text-slate-400 font-mono break-all leading-relaxed">{info.userAgent}</p>
        </div>
      </div>

      <div className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-500 leading-relaxed space-y-3">
        <p className="text-sm font-semibold text-slate-300">What is this?</p>
        <p>This page shows the information your browser shares with every website you visit. It&apos;s not private data — websites use it to render pages correctly for your screen size, language, and device capabilities.</p>
        <p className="text-sm font-semibold text-slate-300 mt-3">Should I be concerned?</p>
        <p>Most of this is harmless technical info. The main privacy concern is &quot;browser fingerprinting&quot; — combining all these details together to identify you uniquely. Using private browsing mode or Firefox&apos;s tracking protection can reduce fingerprinting.</p>
      </div>
    </div>
  );
}

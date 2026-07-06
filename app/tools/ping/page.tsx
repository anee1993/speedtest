"use client";

import { useState } from "react";

interface PingResult {
  endpoint: string;
  label: string;
  times: number[];
  avg: number;
  min: number;
  max: number;
  jitter: number;
}

const ENDPOINTS = [
  { url: "https://speed.cloudflare.com/__down?bytes=1", label: "Cloudflare CDN" },
  { url: "https://www.google.com/generate_204", label: "Google" },
  { url: "https://www.cloudflare.com/cdn-cgi/trace", label: "Cloudflare Edge" },
];

export default function PingPage() {
  const [results, setResults] = useState<PingResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState("");

  async function runPingTest() {
    setTesting(true);
    setResults([]);

    const allResults: PingResult[] = [];

    for (const ep of ENDPOINTS) {
      setStatus(`Pinging ${ep.label}…`);
      const times: number[] = [];
      for (let i = 0; i < 10; i++) {
        const t0 = performance.now();
        try {
          await fetch(ep.url, { cache: "no-store", mode: "no-cors" });
        } catch { /* still measures time */ }
        times.push(Math.round(performance.now() - t0));
        await new Promise(r => setTimeout(r, 200));
      }

      const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      const min = Math.min(...times);
      const max = Math.max(...times);
      const jitter = Math.round(times.reduce((a, t) => a + Math.abs(t - avg), 0) / times.length);

      allResults.push({ endpoint: ep.url, label: ep.label, times, avg, min, max, jitter });
      setResults([...allResults]);
    }

    setStatus("Done");
    setTesting(false);
  }

  return (
    <div className="max-w-lg w-full">
      <h1 className="text-2xl font-bold mb-2 text-center">🏓 Ping Test</h1>
      <p className="text-sm text-slate-400 mb-6 text-center">Measure latency to multiple servers (10 pings each)</p>

      <button
        onClick={runPingTest}
        disabled={testing}
        className="w-full py-3.5 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-400 text-white font-bold tracking-wide disabled:opacity-40 hover:opacity-90 active:scale-[0.98] transition mb-6"
      >
        {testing ? "TESTING…" : results.length > 0 ? "TEST AGAIN" : "START PING TEST"}
      </button>

      {status && <p className="text-center text-sm text-indigo-300 mb-4">{status}</p>}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map(r => (
            <div key={r.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">{r.label}</span>
                <span className="text-lg font-bold text-emerald-400">{r.avg} ms</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-slate-500">Min</p>
                  <p className="text-sm font-semibold text-slate-300">{r.min} ms</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Max</p>
                  <p className="text-sm font-semibold text-slate-300">{r.max} ms</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Jitter</p>
                  <p className="text-sm font-semibold text-slate-300">{r.jitter} ms</p>
                </div>
              </div>
              {/* Mini bar chart of ping times */}
              <div className="flex items-end gap-0.5 mt-3 h-8">
                {r.times.map((t, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-indigo-400/60"
                    style={{ height: `${Math.max(10, (t / r.max) * 100)}%` }}
                    title={`${t} ms`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

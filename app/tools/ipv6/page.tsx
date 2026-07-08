"use client";

import { useState, useEffect } from "react";

export default function IPv6Page() {
  const [v4, setV4] = useState<string | null>(null);
  const [v6, setV6] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [tested, setTested] = useState(false);

  async function runTest() {
    setTesting(true); setTested(false);
    setV4(null); setV6(null);

    // Test IPv4
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      setV4(data.ip);
    } catch { setV4(null); }

    // Test IPv6
    try {
      const res = await fetch("https://api64.ipify.org?format=json");
      const data = await res.json();
      // If the result contains a colon, it's IPv6
      if (data.ip && data.ip.includes(":")) {
        setV6(data.ip);
      } else {
        setV6(null); // Got IPv4 back, no IPv6 support
      }
    } catch { setV6(null); }

    setTesting(false); setTested(true);
  }

  useEffect(() => { runTest(); }, []);

  return (
    <div className="max-w-lg w-full">
      <h1 className="text-2xl font-bold mb-2 text-center">🌐 IPv6 Test</h1>
      <p className="text-sm text-slate-400 mb-6 text-center">Check if your connection supports IPv6</p>

      <button
        onClick={runTest}
        disabled={testing}
        className="w-full py-3.5 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-400 text-white font-bold tracking-wide disabled:opacity-40 hover:opacity-90 active:scale-[0.98] transition mb-6"
      >
        {testing ? "TESTING…" : "TEST AGAIN"}
      </button>

      {tested && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">IPv4</span>
              <span className={`text-sm font-bold ${v4 ? "text-emerald-400" : "text-red-400"}`}>
                {v4 ? "✓ Supported" : "✗ Not detected"}
              </span>
            </div>
            {v4 && <p className="text-xs text-slate-400 font-mono mt-2">{v4}</p>}
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">IPv6</span>
              <span className={`text-sm font-bold ${v6 ? "text-emerald-400" : "text-yellow-400"}`}>
                {v6 ? "✓ Supported" : "✗ Not available"}
              </span>
            </div>
            {v6 && <p className="text-xs text-slate-400 font-mono mt-2 break-all">{v6}</p>}
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-sm font-semibold text-white mb-2">
              {v6 ? "🎉 You have IPv6!" : "⚠️ IPv6 not detected"}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {v6
                ? "Your internet connection supports both IPv4 and IPv6. You're ready for the future of the internet."
                : "Your connection is using IPv4 only. This is still common — most ISPs are gradually rolling out IPv6. It won't affect your daily browsing, but IPv6 offers better routing and security long-term."}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-500 leading-relaxed space-y-3">
        <p className="text-sm font-semibold text-slate-300">What is IPv6?</p>
        <p>IPv4 addresses (like 192.168.1.1) are running out — there are only about 4.3 billion possible. IPv6 uses a longer format (like 2001:0db8:85a3::8a2e:0370:7334) with practically unlimited addresses.</p>
        <p className="text-sm font-semibold text-slate-300 mt-3">Do I need IPv6?</p>
        <p>Not urgently. The internet works fine on IPv4 for now. But IPv6 can offer slightly faster routing (no NAT translation needed) and better peer-to-peer connectivity. Most modern devices support both.</p>
      </div>
    </div>
  );
}

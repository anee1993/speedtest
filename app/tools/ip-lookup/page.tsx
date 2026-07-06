"use client";

import { useState } from "react";
import type { Metadata } from "next";

interface IPData {
  ip: string;
  hostname?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
}

export default function IPLookupPage() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<IPData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function lookup(query?: string) {
    setLoading(true);
    setError("");
    setData(null);
    try {
      // ipinfo.io accepts both IP addresses and hostnames
      const target = query ? query.trim() : "";
      const url = target ? `https://ipinfo.io/${encodeURIComponent(target)}/json` : "https://ipinfo.io/json";
      const res = await fetch(url);
      if (!res.ok) {
        // If ipinfo fails with a hostname, try resolving it via DNS first
        if (target && !res.ok) {
          const dnsRes = await fetch(`/api/dns?domain=${encodeURIComponent(target)}&type=A`);
          const dnsData = await dnsRes.json();
          if (dnsData.answers && dnsData.answers.length > 0) {
            const ip = dnsData.answers[0].data;
            const res2 = await fetch(`https://ipinfo.io/${ip}/json`);
            if (res2.ok) {
              const d2 = await res2.json();
              if (!d2.error) { setData(d2); setLoading(false); return; }
            }
          }
        }
        throw new Error("Could not fetch IP info — check the address and try again");
      }
      const d = await res.json();
      if (d.error) throw new Error(d.error.message || "Lookup failed");
      setData(d);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-lg w-full">
      <h1 className="text-2xl font-bold mb-2 text-center">🌍 IP Lookup</h1>
      <p className="text-sm text-slate-400 mb-6 text-center">Find location, ISP and details for any IP address</p>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter IP or domain (or leave blank for yours)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && lookup(input || undefined)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-400 transition"
        />
        <button
          onClick={() => lookup(input || undefined)}
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-400 text-white text-sm font-bold disabled:opacity-40 hover:opacity-90 transition"
        >
          {loading ? "…" : "Lookup"}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

      {data && (
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <Row label="IP Address" value={data.ip} />
            {data.hostname && <Row label="Hostname" value={data.hostname} />}
            {data.city && <Row label="City" value={data.city} />}
            {data.region && <Row label="Region" value={data.region} />}
            {data.country && <Row label="Country" value={data.country} />}
            {data.loc && <Row label="Location" value={data.loc} />}
            {data.org && <Row label="ISP / Org" value={data.org} />}
            {data.postal && <Row label="Postal Code" value={data.postal} />}
            {data.timezone && <Row label="Timezone" value={data.timezone} />}
          </div>
        </div>
      )}

      {!data && !loading && !error && (
        <div className="text-center text-slate-500 text-sm mt-4">
          Click Lookup to find your own IP, or enter any IP address or domain name.
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-white/[0.04]">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs text-slate-200 font-semibold text-right">{value}</span>
    </div>
  );
}

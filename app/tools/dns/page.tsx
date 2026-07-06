"use client";

import { useState } from "react";

interface DNSAnswer {
  name: string;
  type: number;
  ttl: number;
  data: string;
}

interface DNSResult {
  domain: string;
  type: string;
  status: string;
  answers: DNSAnswer[];
  authority: DNSAnswer[];
}

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SOA"];

export default function DNSPage() {
  const [domain, setDomain] = useState("");
  const [recordType, setRecordType] = useState("A");
  const [result, setResult] = useState<DNSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function lookup() {
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/dns?domain=${encodeURIComponent(domain.trim())}&type=${recordType}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-lg w-full">
      <h1 className="text-2xl font-bold mb-2 text-center">🔍 DNS Lookup</h1>
      <p className="text-sm text-slate-400 mb-6 text-center">Query DNS records for any domain</p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="example.com"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          onKeyDown={e => e.key === "Enter" && lookup()}
          className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-400 transition"
        />
        <select
          value={recordType}
          onChange={e => setRecordType(e.target.value)}
          className="px-3 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-white outline-none"
        >
          {RECORD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <button
        onClick={lookup}
        disabled={loading || !domain.trim()}
        className="w-full py-3.5 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-400 text-white font-bold tracking-wide disabled:opacity-40 hover:opacity-90 active:scale-[0.98] transition mb-6"
      >
        {loading ? "Looking up…" : "LOOKUP"}
      </button>

      {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

      {result && (
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold">{result.domain}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
              {result.status}
            </span>
          </div>

          {result.answers.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Answers ({result.type})</p>
              {result.answers.map((a, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-white/[0.04]">
                  <span className="text-xs text-slate-400 font-mono break-all">{a.data}</span>
                  <span className="text-xs text-slate-500 ml-3 shrink-0">TTL {a.ttl}s</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No records found for {result.type} type</p>
          )}

          {result.authority.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Authority</p>
              {result.authority.map((a, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-white/[0.04]">
                  <span className="text-xs text-slate-400 font-mono break-all">{a.data}</span>
                  <span className="text-xs text-slate-500 ml-3 shrink-0">TTL {a.ttl}s</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

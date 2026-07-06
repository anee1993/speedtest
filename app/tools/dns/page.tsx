import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DNS Lookup",
  description: "Perform DNS lookups to find A, AAAA, CNAME, MX, NS and TXT records for any domain.",
};

export default function DNSPage() {
  return (
    <div className="max-w-lg w-full text-center">
      <h1 className="text-2xl font-bold mb-2">🔍 DNS Lookup</h1>
      <p className="text-sm text-slate-400 mb-8">Query DNS records for any domain</p>
      <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
        <p className="text-slate-500">Coming soon</p>
      </div>
    </div>
  );
}

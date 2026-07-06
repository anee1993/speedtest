import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IP Lookup",
  description: "Look up any IP address to find its location, ISP, organization and more.",
};

export default function IPLookupPage() {
  return (
    <div className="max-w-lg w-full text-center">
      <h1 className="text-2xl font-bold mb-2">🌍 IP Lookup</h1>
      <p className="text-sm text-slate-400 mb-8">Find location and ISP for any IP address</p>
      <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
        <p className="text-slate-500">Coming soon</p>
      </div>
    </div>
  );
}

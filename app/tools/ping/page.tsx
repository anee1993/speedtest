import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ping Test",
  description: "Test your ping and latency to servers worldwide. Measure network responsiveness for gaming, video calls and more.",
};

export default function PingPage() {
  return (
    <div className="max-w-lg w-full text-center">
      <h1 className="text-2xl font-bold mb-2">🏓 Ping Test</h1>
      <p className="text-sm text-slate-400 mb-8">Measure your latency to servers worldwide</p>
      <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
        <p className="text-slate-500">Coming soon</p>
      </div>
    </div>
  );
}

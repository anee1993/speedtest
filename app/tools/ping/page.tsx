import type { Metadata } from "next";
import PingTool from "./_components/PingTool";

export const metadata: Metadata = {
  title: "Ping Test — Check Internet Latency & Jitter",
  description:
    "Measure your ping and jitter to multiple servers. Get detailed latency analysis with min, max, and average response times.",
  alternates: { canonical: "https://howfastismy.net/tools/ping" },
  openGraph: {
    title: "Ping Test — Check Internet Latency & Jitter",
    description:
      "Measure your ping and jitter to multiple servers. Get detailed latency analysis with min, max, and average response times.",
    url: "https://howfastismy.net/tools/ping",
  },
};

export default function PingPage() {
  return (
    <div className="max-w-lg w-full">
      <h1 className="text-2xl font-bold mb-2 text-center">🏓 Ping Test</h1>
      <p className="text-sm text-slate-400 mb-6 text-center">Measure your latency and jitter to multiple servers — 10 pings each with detailed analysis</p>
      <PingTool />
    </div>
  );
}

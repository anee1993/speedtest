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
  return <PingTool />;
}

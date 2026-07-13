import type { Metadata } from "next";
import IPv6Tool from "./_components/IPv6Tool";

export const metadata: Metadata = {
  title: "IPv6 Test — Check Your IPv6 Connectivity",
  description:
    "Check if your internet connection supports IPv6. Test both IPv4 and IPv6 connectivity instantly.",
  alternates: { canonical: "https://howfastismy.net/tools/ipv6" },
  openGraph: {
    title: "IPv6 Test — Check Your IPv6 Connectivity",
    description:
      "Check if your internet connection supports IPv6. Test both IPv4 and IPv6 connectivity instantly.",
    url: "https://howfastismy.net/tools/ipv6",
  },
};

export default function IPv6Page() {
  return (
    <div className="max-w-lg w-full">
      <h1 className="text-2xl font-bold mb-2 text-center">🌐 IPv6 Test</h1>
      <p className="text-sm text-slate-400 mb-6 text-center">Check if your internet connection supports IPv6 — the next generation of internet addressing</p>
      <IPv6Tool />
    </div>
  );
}

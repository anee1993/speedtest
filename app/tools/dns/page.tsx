import type { Metadata } from "next";
import DNSTool from "./_components/DNSTool";

export const metadata: Metadata = {
  title: "DNS Lookup — Check A, MX, TXT & DNS Records",
  description:
    "Query DNS records for any domain. Check A, AAAA, CNAME, MX, NS, TXT, and SOA records with explanations.",
  alternates: { canonical: "https://howfastismy.net/tools/dns" },
  openGraph: {
    title: "DNS Lookup — Check A, MX, TXT & DNS Records",
    description:
      "Query DNS records for any domain. Check A, AAAA, CNAME, MX, NS, TXT, and SOA records with explanations.",
    url: "https://howfastismy.net/tools/dns",
  },
};

export default function DNSPage() {
  return (
    <div className="max-w-lg w-full">
      <h1 className="text-2xl font-bold mb-2 text-center">🔍 DNS Lookup</h1>
      <p className="text-sm text-slate-400 mb-6 text-center">Query A, AAAA, CNAME, MX, NS, TXT, and SOA records for any domain with explanations</p>
      <DNSTool />
    </div>
  );
}

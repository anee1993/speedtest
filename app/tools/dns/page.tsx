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
  return <DNSTool />;
}

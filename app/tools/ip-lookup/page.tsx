import type { Metadata } from "next";
import IPLookupTool from "./_components/IPLookupTool";

export const metadata: Metadata = {
  title: "What Is My IP Address? — Free IP Lookup",
  description:
    "Find your public IP address, ISP, location, and network details. Look up any IP address or domain name.",
  alternates: { canonical: "https://howfastismy.net/tools/ip-lookup" },
  openGraph: {
    title: "What Is My IP Address? — Free IP Lookup",
    description:
      "Find your public IP address, ISP, location, and network details. Look up any IP address or domain name.",
    url: "https://howfastismy.net/tools/ip-lookup",
  },
};

export default function IPLookupPage() {
  return (
    <div className="max-w-lg w-full">
      <h1 className="text-2xl font-bold mb-2 text-center">🌍 What Is My IP Address?</h1>
      <p className="text-sm text-slate-400 mb-6 text-center">Find your public IP, ISP, and location — or look up any IP address or domain name</p>
      <IPLookupTool />
    </div>
  );
}

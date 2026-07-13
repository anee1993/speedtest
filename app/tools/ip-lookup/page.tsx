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
  return <IPLookupTool />;
}

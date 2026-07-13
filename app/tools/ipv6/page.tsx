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
  return <IPv6Tool />;
}

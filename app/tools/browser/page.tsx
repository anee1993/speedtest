import type { Metadata } from "next";
import BrowserTool from "./_components/BrowserTool";

export const metadata: Metadata = {
  title: "What Browser Am I Using? — Browser & Device Info",
  description:
    "See what your browser reveals about you. Check browser version, OS, screen size, and device capabilities.",
  alternates: { canonical: "https://howfastismy.net/tools/browser" },
  openGraph: {
    title: "What Browser Am I Using? — Browser & Device Info",
    description:
      "See what your browser reveals about you. Check browser version, OS, screen size, and device capabilities.",
    url: "https://howfastismy.net/tools/browser",
  },
};

export default function BrowserPage() {
  return <BrowserTool />;
}

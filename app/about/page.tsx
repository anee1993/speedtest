import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About howfastismy.net — a free internet speed test and network diagnostics tool.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl w-full">
      <h1 className="text-2xl font-bold mb-6">About howfastismy.net</h1>
      <div className="space-y-4 text-slate-300 leading-relaxed text-sm">
        <p>
          howfastismy.net is a free internet speed test and network diagnostics platform.
          We help you measure your connection speed, diagnose network issues, and understand
          your internet performance — all from your browser, with no downloads or sign-ups required.
        </p>
        <p>
          Our tools include a download/upload speed test, ping and jitter measurement,
          DNS lookup, and IP address lookup. We also provide an Internet Health Score
          that translates raw numbers into plain-English recommendations about what your
          connection can handle.
        </p>
        <h2 className="text-lg font-semibold text-white pt-4">How it works</h2>
        <p>
          Our speed test measures your connection by downloading data from Cloudflare's
          global CDN network and uploading test payloads. Ping is measured via multiple
          round-trip requests. All tests run entirely in your browser — we don't store
          your results or personal data.
        </p>
        <h2 className="text-lg font-semibold text-white pt-4">Our goal</h2>
        <p>
          We're building howfastismy.net into a comprehensive, free network diagnostics
          toolkit — helping home users, gamers, remote workers, and developers understand
          and optimize their internet connections.
        </p>
      </div>
    </div>
  );
}

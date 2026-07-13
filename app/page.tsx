import type { Metadata } from "next";
import Link from "next/link";
import SpeedTest from "./_components/SpeedTest";

export const metadata: Metadata = {
  title: "Internet Speed Test — Check Download, Upload & Ping",
  description:
    "Test your internet speed instantly. Measure download speed, upload speed, ping, and jitter. Get an Internet Health Score with personalized recommendations.",
  alternates: { canonical: "https://howfastismy.net" },
  openGraph: {
    title: "Internet Speed Test — Check Download, Upload & Ping",
    description:
      "Test your internet speed instantly. Measure download speed, upload speed, ping, and jitter. Get an Internet Health Score with personalized recommendations.",
    url: "https://howfastismy.net",
  },
};

export default function Home() {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-wide mb-1 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
        ⚡ Internet Speed Test
      </h1>
      <p className="text-sm text-indigo-300 mb-8">
        Measure download, upload, ping & jitter
      </p>
      <SpeedTest />

      {/* Phase 3: Homepage SEO Content */}
      <section className="w-full max-w-3xl mt-16 space-y-16">
        {/* Understanding Your Speed Test Results */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Understanding Your Speed Test Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-indigo-400 mb-2">⬇️ Download Speed</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                How fast data travels from the internet to your device. This affects streaming, browsing, and downloading files.
                25 Mbps is good for most households; 100+ Mbps handles multiple 4K streams and large downloads with ease.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-indigo-400 mb-2">⬆️ Upload Speed</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                How fast data travels from your device to the internet. Important for video calls, live streaming, cloud backups, and sending large files.
                5 Mbps is fine for basic use; 20+ Mbps is ideal for remote work and content creators.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-indigo-400 mb-2">🏓 Ping / Latency</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The time it takes for a small packet of data to make a round trip between your device and a server, measured in milliseconds.
                Under 20 ms is excellent for gaming; under 50 ms is good for video calls; above 100 ms feels sluggish.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-indigo-400 mb-2">📊 Jitter</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The variation in your ping over time — how consistent your connection is. Low jitter (under 5 ms) means a stable connection.
                High jitter can cause buffering, choppy video calls, and lag spikes in games even if your average ping is low.
              </p>
            </div>
          </div>
        </div>

        {/* What Can My Internet Handle? */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">What Can My Internet Handle?</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03]">
                <tr>
                  <th className="text-left text-xs text-slate-400 font-medium py-3 px-4">Activity</th>
                  <th className="text-left text-xs text-slate-400 font-medium py-3 px-4">Download</th>
                  <th className="text-left text-xs text-slate-400 font-medium py-3 px-4">Upload</th>
                  <th className="text-left text-xs text-slate-400 font-medium py-3 px-4">Ping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                <tr>
                  <td className="py-3 px-4 text-slate-300 font-medium">4K Streaming</td>
                  <td className="py-3 px-4 text-slate-400">25+ Mbps</td>
                  <td className="py-3 px-4 text-slate-400">—</td>
                  <td className="py-3 px-4 text-slate-400">—</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-300 font-medium">HD Streaming</td>
                  <td className="py-3 px-4 text-slate-400">5+ Mbps</td>
                  <td className="py-3 px-4 text-slate-400">—</td>
                  <td className="py-3 px-4 text-slate-400">—</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-300 font-medium">Online Gaming</td>
                  <td className="py-3 px-4 text-slate-400">10+ Mbps</td>
                  <td className="py-3 px-4 text-slate-400">3+ Mbps</td>
                  <td className="py-3 px-4 text-slate-400">&lt; 30 ms</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-300 font-medium">Video Calls</td>
                  <td className="py-3 px-4 text-slate-400">5+ Mbps</td>
                  <td className="py-3 px-4 text-slate-400">5+ Mbps</td>
                  <td className="py-3 px-4 text-slate-400">&lt; 50 ms</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-300 font-medium">Working from Home</td>
                  <td className="py-3 px-4 text-slate-400">25+ Mbps</td>
                  <td className="py-3 px-4 text-slate-400">10+ Mbps</td>
                  <td className="py-3 px-4 text-slate-400">&lt; 50 ms</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-300 font-medium">Large Downloads</td>
                  <td className="py-3 px-4 text-slate-400">100+ Mbps</td>
                  <td className="py-3 px-4 text-slate-400">—</td>
                  <td className="py-3 px-4 text-slate-400">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Free Network Tools */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Free Network Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link href="/tools/ping" className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-400/40 transition group">
              <span className="text-lg">🏓</span>
              <p className="text-sm font-semibold text-white mt-2 group-hover:text-indigo-400 transition">Ping Test</p>
              <p className="text-xs text-slate-500 mt-1">Measure latency to multiple servers</p>
            </Link>
            <Link href="/tools/ip-lookup" className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-400/40 transition group">
              <span className="text-lg">🌍</span>
              <p className="text-sm font-semibold text-white mt-2 group-hover:text-indigo-400 transition">IP Lookup</p>
              <p className="text-xs text-slate-500 mt-1">Find your IP, ISP, and location</p>
            </Link>
            <Link href="/tools/dns" className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-400/40 transition group">
              <span className="text-lg">🔍</span>
              <p className="text-sm font-semibold text-white mt-2 group-hover:text-indigo-400 transition">DNS Lookup</p>
              <p className="text-xs text-slate-500 mt-1">Query DNS records for any domain</p>
            </Link>
            <Link href="/tools/ipv6" className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-400/40 transition group">
              <span className="text-lg">🌐</span>
              <p className="text-sm font-semibold text-white mt-2 group-hover:text-indigo-400 transition">IPv6 Test</p>
              <p className="text-xs text-slate-500 mt-1">Check IPv6 connectivity support</p>
            </Link>
            <Link href="/tools/browser" className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-400/40 transition group">
              <span className="text-lg">🖥️</span>
              <p className="text-sm font-semibold text-white mt-2 group-hover:text-indigo-400 transition">Browser Info</p>
              <p className="text-xs text-slate-500 mt-1">See what your browser reveals about you</p>
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-slate-200 mb-2">How accurate is this speed test?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our test measures your connection speed to Cloudflare&apos;s global network, which is one of the closest and fastest CDNs.
                Results reflect your real-world performance for most internet activities. For the most accurate reading, close other tabs, pause downloads, and use a wired connection when possible.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Why is my speed lower than what I pay for?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ISP advertised speeds are &quot;up to&quot; maximums under ideal conditions. Wi-Fi interference, network congestion during peak hours,
                router distance, outdated hardware, and the number of devices on your network can all reduce your actual speed.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-slate-200 mb-2">How often should I test my speed?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test whenever you notice slowness, after changing your plan or equipment, and periodically (weekly or monthly) to establish a baseline.
                Testing at different times of day can reveal peak-hour congestion patterns.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Is this speed test free?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yes, completely free with no ads, no account required, and no data sold to third parties. Run as many tests as you like.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "howfastismy.net",
            url: "https://howfastismy.net",
            description: "Free internet speed test with download, upload, ping, jitter measurement and Internet Health Score.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://howfastismy.net/blog/{search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </>
  );
}

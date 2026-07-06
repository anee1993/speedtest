import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for howfastismy.net — how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl w-full">
      <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-slate-300 leading-relaxed text-sm">
        <p className="text-slate-400 text-xs">Last updated: July 2025</p>

        <h2 className="text-lg font-semibold text-white pt-4">What we collect</h2>
        <p>
          howfastismy.net does not collect, store, or sell personal data. We do not require
          accounts, logins, or any personal information to use our tools.
        </p>

        <h2 className="text-lg font-semibold text-white pt-4">Speed test data</h2>
        <p>
          When you run a speed test, the measurement happens entirely in your browser.
          Data is transferred between your device and Cloudflare's CDN servers. We do not
          log or store your test results on our servers.
        </p>

        <h2 className="text-lg font-semibold text-white pt-4">IP lookup</h2>
        <p>
          The IP Lookup tool queries third-party services (ipinfo.io) on your behalf.
          We do not store the results of these lookups.
        </p>

        <h2 className="text-lg font-semibold text-white pt-4">Cookies</h2>
        <p>
          We do not use tracking cookies. Our hosting provider (Vercel) may use
          essential cookies for site functionality and analytics. No third-party
          advertising cookies are used.
        </p>

        <h2 className="text-lg font-semibold text-white pt-4">Analytics</h2>
        <p>
          We use Vercel's built-in analytics which collects anonymous, aggregated
          page view data. This data cannot identify individual users and is used
          solely to understand overall site traffic patterns.
        </p>

        <h2 className="text-lg font-semibold text-white pt-4">Third-party services</h2>
        <p>
          Our site interacts with the following external services during normal operation:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Cloudflare — speed test data transfer</li>
          <li>ipinfo.io — IP address lookups</li>
          <li>Cloudflare DNS — DNS lookups</li>
          <li>Vercel — hosting and edge delivery</li>
        </ul>

        <h2 className="text-lg font-semibold text-white pt-4">Contact</h2>
        <p>
          If you have questions about this policy, please reach out via our
          <a href="/contact" className="text-indigo-400 underline underline-offset-2 ml-1">contact page</a>.
        </p>
      </div>
    </div>
  );
}

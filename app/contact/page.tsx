import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the howfastismy.net team.",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl w-full">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      <div className="space-y-4 text-slate-300 leading-relaxed text-sm">
        <p>
          Have a question, suggestion, or found a bug? We'd love to hear from you.
        </p>

        <div className="mt-6 p-6 rounded-xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-semibold text-white mb-4">Get in touch</h2>
          <p>
            Email us at:{" "}
            <a href="mailto:hello@howfastismy.net" className="text-indigo-400 underline underline-offset-2">
              hello@howfastismy.net
            </a>
          </p>
        </div>

        <div className="mt-6 p-6 rounded-xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-semibold text-white mb-4">Report an issue</h2>
          <p>
            Found a bug or something not working correctly? Open an issue on our{" "}
            <a href="https://github.com/anee1993/speedtest/issues" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline underline-offset-2">
              GitHub repository
            </a>.
          </p>
        </div>

        <div className="mt-6 p-6 rounded-xl bg-white/[0.03] border border-white/[0.08]">
          <h2 className="text-lg font-semibold text-white mb-4">Feature requests</h2>
          <p>
            Want to see a new tool or feature? Let us know — we're actively building
            out our network diagnostics toolkit and welcome suggestions from users.
          </p>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <p className="text-6xl font-bold text-indigo-400 mb-4">404</p>
      <h1 className="text-xl font-semibold mb-2">Page not found</h1>
      <p className="text-sm text-slate-400 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-400 text-white text-sm font-semibold hover:opacity-90 transition"
        >
          Run Speed Test
        </Link>
        <Link
          href="/blog"
          className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm font-semibold hover:bg-white/5 transition"
        >
          Read Blog
        </Link>
      </div>
    </div>
  );
}

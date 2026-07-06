import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "./_lib/posts";

export const metadata: Metadata = {
  title: "Blog — Internet Speed Tips & Guides",
  description:
    "Learn about internet speeds, troubleshoot slow connections, and understand networking concepts. Practical guides from howfastismy.net.",
  openGraph: {
    title: "Blog — Internet Speed Tips & Guides",
    description:
      "Practical guides on internet speed, networking, and connection troubleshooting.",
    url: "https://howfastismy.net/blog",
  },
};

export default function BlogIndex() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Blog</h1>
      <p className="text-slate-400 mb-10">
        Guides and tips to help you understand and improve your internet
        connection.
      </p>

      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 hover:bg-white/[0.06] transition"
          >
            <time className="text-xs text-slate-500 font-mono">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <h2 className="text-xl font-semibold text-white mt-1 mb-2">
              {post.title}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

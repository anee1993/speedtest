import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPostBySlug, getAllSlugs } from "../_lib/posts";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://howfastismy.net/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="w-full max-w-3xl mx-auto">
      <Link
        href="/blog"
        className="text-sm text-slate-500 hover:text-slate-300 transition mb-6 inline-block"
      >
        ← Back to Blog
      </Link>

      <header className="mb-8">
        <time className="text-xs text-slate-500 font-mono">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h1 className="text-3xl font-bold text-white mt-2">{post.title}</h1>
        <p className="text-slate-400 mt-2">{post.description}</p>
      </header>

      <div
        className="prose prose-invert max-w-none
          [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-white [&>h2]:mt-10 [&>h2]:mb-4
          [&>h3]:text-lg [&>h3]:font-medium [&>h3]:text-slate-200 [&>h3]:mt-8 [&>h3]:mb-3
          [&>p]:text-slate-300 [&>p]:leading-relaxed [&>p]:mb-4
          [&>ul]:text-slate-300 [&>ul]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2
          [&>ol]:text-slate-300 [&>ol]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2
          [&_li]:leading-relaxed
          [&_strong]:text-white [&_strong]:font-semibold
          [&_a]:text-indigo-400 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-indigo-300
          [&_table]:w-full [&_table]:my-6 [&_table]:text-sm [&_table]:border-collapse
          [&_thead]:border-b [&_thead]:border-white/[0.1]
          [&_th]:text-left [&_th]:text-slate-300 [&_th]:font-medium [&_th]:py-2 [&_th]:px-3
          [&_td]:text-slate-400 [&_td]:py-2 [&_td]:px-3 [&_td]:border-b [&_td]:border-white/[0.05]"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <footer className="mt-12 pt-8 border-t border-white/[0.08]">
        <h3 className="text-sm font-medium text-slate-400 mb-4">
          More articles
        </h3>
        <div className="flex flex-col gap-3">
          {posts
            .filter((p) => p.slug !== post.slug)
            .slice(0, 3)
            .map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="text-indigo-400 hover:text-indigo-300 transition text-sm"
              >
                {p.title} →
              </Link>
            ))}
        </div>
      </footer>
    </article>
  );
}

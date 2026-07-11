"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Speed Test" },
  { href: "/tools/ping", label: "Ping" },
  { href: "/tools/ip-lookup", label: "IP Lookup" },
  { href: "/tools/dns", label: "DNS" },
  { href: "/tools/ipv6", label: "IPv6" },
  { href: "/tools/browser", label: "Browser" },
  { href: "/blog", label: "Blog" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-white/5 py-4 px-6">
      <nav className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-wide text-indigo-400 hover:text-indigo-300 transition shrink-0">
          ⚡ howfastismy.net
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-4 text-sm text-slate-400">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`hover:text-white transition whitespace-nowrap ${pathname === l.href ? "text-white" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden mt-3 pb-2 border-t border-white/5 pt-3">
          <div className="flex flex-col gap-2">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`text-sm py-2 px-3 rounded-lg hover:bg-white/5 transition ${pathname === l.href ? "text-white bg-white/5" : "text-slate-400"}`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

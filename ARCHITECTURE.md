# howfastismy.net — Architecture & Flow

## Pages (what visitors see)

```
/ (Home) ─── Speed Test
├── Goku SVG (inline, hair color changes dynamically)
├── Canvas aura effects (particles, lightning, rings)
├── Download test → Cloudflare CDN (100MB stream)
├── Upload test → Cloudflare (512KB chunks, no-cors)
├── Ping + Jitter measurement (6 round-trips)
├── IP/ISP detection → ipinfo.io
├── Power forms (Kaioken → SSJ → SSJ2 → God → Blue → UI)
├── Health Score (0-100, recommendations)
├── Speed History (localStorage, chart + table)
├── Share: Copy text + Save as PNG image
└── Saiyan rank labels per metric

/tools/ping ─── Ping Test
├── Pings 3 endpoints (Cloudflare, Google, CF Edge)
├── 10 pings each, shows avg/min/max/jitter
├── Mini bar chart per endpoint
└── Verdict + explanation section

/tools/ip-lookup ─── IP Lookup
├── Accepts IP address OR domain name
├── Domains → resolved via /api/dns first
├── Shows: IP, city, region, country, ISP, timezone
└── Explanation of what each field means

/tools/dns ─── DNS Lookup
├── Enter domain + record type (A/AAAA/CNAME/MX/NS/TXT/SOA)
├── Calls /api/dns (serverless function)
├── Shows answers + authority with TTL
└── Full explanation of record types + examples

/tools/ipv6 ─── IPv6 Test
├── Auto-tests on page load
├── Checks IPv4 (ipify.org) + IPv6 (api64.ipify.org)
└── Shows support status + explanation

/tools/browser ─── Browser Test
├── Detects browser, OS, screen, touch, language, etc.
├── Shows full user agent string
└── Explains fingerprinting concerns

/blog ─── Blog Index
└── Lists 4 articles with dates + descriptions

/blog/[slug] ─── Blog Posts (4 articles)
├── "What Is a Good Internet Speed?"
├── "Why Is My Internet So Slow?"
├── "Mbps vs MB/s — What's the Difference?"
└── "What Is Ping and Why Does It Matter?"

/about ─── About page
/privacy ─── Privacy policy
/contact ─── Contact (email + GitHub)
```

## API Routes (serverless functions on Vercel)

```
/api/dns ─── DNS Lookup API
├── Accepts: ?domain=x&type=A
├── Uses Cloudflare DNS-over-HTTPS
└── Returns: answers[], authority[], status
```

## SEO & Discovery

```
/sitemap.xml ─── Auto-generated, all pages listed
/robots.txt ─── Allows all crawlers, points to sitemap
/opengraph-image ─── Dynamic OG image for social sharing
/icon.svg ─── Lightning bolt favicon
JSON-LD structured data (WebApplication schema)
Meta titles/descriptions per page
Google Search Console ─── Verified + sitemap submitted
```

## Shared Layout

```
Header ─── Logo + nav (Speed Test, Ping, IP, DNS, IPv6, Browser, Blog)
Footer ─── Copyright + About/Privacy/Contact links
Dark theme (Tailwind, Geist font)
```

## Tech Stack

```
Next.js 16 (App Router, TypeScript)
Tailwind CSS
Vercel (hosting + serverless + analytics + domain)
No database, no auth, no external deps beyond ipinfo.io
```

---

## Data Flow: Speed Test

```
User clicks START TEST
        │
        ▼
┌─ Ping/Jitter ─────────────────────────────────┐
│  6× fetch → speed.cloudflare.com/__down?bytes=1│
│  Measure round-trip times, compute avg + jitter│
└────────────────────────────────────────────────┘
        │
        ▼
┌─ Download ─────────────────────────────────────┐
│  fetch → speed.cloudflare.com/__down?bytes=100M│
│  Stream with ReadableStream, sample every 250ms│
│  Loop until ≥6 seconds elapsed                 │
│  liveMbps → drives Goku aura + hair color      │
└────────────────────────────────────────────────┘
        │
        ▼
┌─ Upload ───────────────────────────────────────┐
│  Build 512KB random blob (8×64KB chunks)       │
│  POST → speed.cloudflare.com/__up (no-cors)    │
│  Repeat until ≥6s elapsed or 15s cap           │
│  liveMbps → drives Goku aura + hair color      │
└────────────────────────────────────────────────┘
        │
        ▼
┌─ Results ──────────────────────────────────────┐
│  Compute health score (0-100)                  │
│  Detect IP/ISP (ipinfo.io, fetched in parallel)│
│  Show results panel + recommendations          │
│  Save to localStorage history                  │
│  Enable share (copy text / save PNG)           │
└────────────────────────────────────────────────┘
```

## Goku Power Forms (speed thresholds)

| Speed (Mbps) | Form | Hair Color | Aura |
|---|---|---|---|
| 0 (idle) | Base | Black #000000 | None |
| 1+ | Kaioken | Dark red-black #1a0000 | Red glow |
| 20+ | Super Saiyan | Gold #ffe600 | Gold + lightning |
| 80+ | Super Saiyan 2 | Bright gold #fff4aa | White-gold + lightning |
| 150+ | SSJ God | Crimson #cc2244 | Red-orange |
| 250+ | Super Saiyan Blue | Cyan #00ccff | Blue + lightning |
| 500+ | Ultra Instinct | Silver #d8d8f0 | Silver + lightning |

## File Structure

```
speedtest/
├── app/
│   ├── _components/
│   │   └── SpeedTest.tsx        ← Main speed test (client component)
│   ├── api/
│   │   └── dns/route.ts        ← DNS lookup serverless function
│   ├── blog/
│   │   ├── _lib/posts.ts       ← Blog post data (HTML strings)
│   │   ├── [slug]/page.tsx     ← Dynamic blog post page
│   │   └── page.tsx            ← Blog index
│   ├── tools/
│   │   ├── ping/page.tsx
│   │   ├── ip-lookup/page.tsx
│   │   ├── dns/page.tsx
│   │   ├── ipv6/page.tsx
│   │   └── browser/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── privacy/page.tsx
│   ├── layout.tsx              ← Root layout (nav, footer, metadata)
│   ├── page.tsx                ← Home page
│   ├── globals.css
│   ├── icon.svg                ← Favicon
│   ├── opengraph-image.tsx     ← Dynamic OG image
│   ├── sitemap.ts
│   └── robots.ts
├── public/
│   └── Goku.svg                ← Character asset
├── package.json
├── next.config.ts
├── vercel.json
└── tsconfig.json
```

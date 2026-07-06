import { NextRequest, NextResponse } from "next/server";

// Uses Cloudflare's DNS-over-HTTPS (DoH) API to resolve domains
// This avoids needing a Node.js dns module or native bindings

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  const type = request.nextUrl.searchParams.get("type") || "A";

  if (!domain) {
    return NextResponse.json({ error: "Missing 'domain' parameter" }, { status: 400 });
  }

  // Validate domain format (basic)
  if (!/^[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
    return NextResponse.json({ error: "Invalid domain format" }, { status: 400 });
  }

  const validTypes = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SOA", "SRV"];
  if (!validTypes.includes(type.toUpperCase())) {
    return NextResponse.json({ error: `Invalid type. Use: ${validTypes.join(", ")}` }, { status: 400 });
  }

  try {
    const dohUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type.toUpperCase()}`;
    const res = await fetch(dohUrl, {
      headers: { Accept: "application/dns-json" },
    });

    if (!res.ok) throw new Error(`DNS query failed with status ${res.status}`);

    const data = await res.json();

    return NextResponse.json({
      domain,
      type: type.toUpperCase(),
      status: data.Status === 0 ? "NOERROR" : `ERROR (${data.Status})`,
      answers: (data.Answer || []).map((a: { name: string; type: number; TTL: number; data: string }) => ({
        name: a.name,
        type: a.type,
        ttl: a.TTL,
        data: a.data,
      })),
      authority: (data.Authority || []).map((a: { name: string; type: number; TTL: number; data: string }) => ({
        name: a.name,
        type: a.type,
        ttl: a.TTL,
        data: a.data,
      })),
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "DNS lookup failed" },
      { status: 500 }
    );
  }
}

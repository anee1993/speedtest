import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

function getDb() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
  if (!url) return null;
  return neon(url);
}

// POST — save a test result (anonymized)
export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    if (!sql) return NextResponse.json({ success: false, reason: "no database" });

    const body = await request.json();
    const { dl, ul, ping, jitter, city, region, country, isp } = body;

    if (!dl || !ping) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create table if not exists (runs once, idempotent)
    await sql`
      CREATE TABLE IF NOT EXISTS speed_results (
        id SERIAL PRIMARY KEY,
        dl REAL NOT NULL,
        ul REAL NOT NULL,
        ping INTEGER NOT NULL,
        jitter INTEGER DEFAULT 0,
        city VARCHAR(100),
        region VARCHAR(100),
        country VARCHAR(10),
        isp VARCHAR(200),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Insert result
    await sql`
      INSERT INTO speed_results (dl, ul, ping, jitter, city, region, country, isp)
      VALUES (${dl}, ${ul}, ${ping}, ${jitter || 0}, ${city || null}, ${region || null}, ${country || null}, ${isp || null})
    `;

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error("Failed to save result:", e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

// GET — get average speeds for a city
export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    if (!sql) return NextResponse.json({ available: false, test_count: 0 });

    const city = request.nextUrl.searchParams.get("city");

    if (!city) {
      return NextResponse.json({ error: "Missing city parameter" }, { status: 400 });
    }

    const result = await sql`
      SELECT
        COUNT(*)::int as test_count,
        ROUND(AVG(dl)::numeric, 1) as avg_dl,
        ROUND(AVG(ul)::numeric, 1) as avg_ul,
        ROUND(AVG(ping)::numeric) as avg_ping
      FROM speed_results
      WHERE LOWER(city) = LOWER(${city})
      AND created_at > NOW() - INTERVAL '90 days'
    `;

    const row = result[0];
    if (!row || row.test_count < 5) {
      return NextResponse.json({ available: false, test_count: row?.test_count || 0 });
    }

    return NextResponse.json({
      available: true,
      city,
      test_count: row.test_count,
      avg_dl: parseFloat(row.avg_dl),
      avg_ul: parseFloat(row.avg_ul),
      avg_ping: parseInt(row.avg_ping),
    });
  } catch (e: unknown) {
    console.error("Failed to query averages:", e);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}

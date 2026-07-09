import { NextRequest, NextResponse } from "next/server";

// Simple upload endpoint — accepts POST body and returns immediately.
// Used for upload speed measurement. Body is discarded.
export async function POST(request: NextRequest) {
  // Consume the body to ensure the full upload is received
  const body = await request.arrayBuffer();
  return NextResponse.json({ received: body.byteLength }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

import { NextRequest, NextResponse } from "next/server";

// In-memory session store. Per serverless instance in production — gives an
// approximate count. Upgrade to Vercel KV for cross-instance accuracy.
const sessions = new Map<string, number>(); // sessionId → lastSeen ms
const TTL = 2 * 60 * 1000; // 2 minutes — clients ping every 60 s

function pruneAndCount(): number {
  const cutoff = Date.now() - TTL;
  for (const [id, ts] of sessions) {
    if (ts < cutoff) sessions.delete(id);
  }
  return sessions.size;
}

export async function GET() {
  return NextResponse.json({ count: pruneAndCount() });
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (typeof sessionId === "string" && sessionId.length < 64) {
      sessions.set(sessionId, Date.now());
    }
  } catch {}
  return NextResponse.json({ count: pruneAndCount() });
}

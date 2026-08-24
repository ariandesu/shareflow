/**
 * Cloudflare Pages Middleware: Real Visitor Telemetry Tracker
 * Dynamically tracks real unique visitors across daily, weekly, and monthly windows.
 */

interface VisitRecord {
  ip: string;
  ua: string;
  ts: number;
}

// In-memory edge visit store
export const liveVisitLog: VisitRecord[] = [];

export async function onRequest(context: { request: Request; next: () => Promise<Response> }) {
  const url = new URL(context.request.url);

  // Track HTML pages and core tool routes (skip static assets like .js, .css, .png)
  const isStaticAsset = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|map|json)$/i.test(url.pathname);
  
  if (!isStaticAsset && !url.pathname.startsWith("/api/admin")) {
    const clientIp = context.request.headers.get("cf-connecting-ip") || "127.0.0.1";
    const userAgent = context.request.headers.get("user-agent") || "unknown";
    const now = Date.now();

    liveVisitLog.push({ ip: clientIp, ua: userAgent, ts: now });

    // Keep log bounded to last 30 days of activity
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    while (liveVisitLog.length > 0 && liveVisitLog[0].ts < thirtyDaysAgo) {
      liveVisitLog.shift();
    }
  }

  return await context.next();
}

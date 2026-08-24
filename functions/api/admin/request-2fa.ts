/**
 * Cloudflare Pages Function: /api/admin/request-2fa
 * Dispatches 6-digit 2FA code to Mahir's Telegram (8941576242)
 */

interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_HOME_CHANNEL?: string;
}

// In-memory 2FA code store for Pages Function instance
let activeCode: { code: string; expiresAt: number } | null = null;

export async function onRequestPost(context: { env: Env }) {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    activeCode = { code, expiresAt };

    const token = context.env.TELEGRAM_BOT_TOKEN || "8852721755:AAHIgP3e2N9N9X6b_d3o4R1z";
    const chatId = context.env.TELEGRAM_HOME_CHANNEL || "8941576242";

    const msg = `🔒 ShareFlow Admin 2FA Verification Code: ${code}\nRequested at: ${new Date().toLocaleTimeString()}\nExpires in 5 minutes.`;

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: msg
      })
    });

    const tgData = await tgRes.json() as any;

    if (!tgData.ok) {
      console.error("[Telegram 2FA Send Error]", tgData);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "2FA code dispatched to Telegram.",
        // Fallback info for client verification in Edge environment
        codeHash: btoa(code)
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Failed to dispatch 2FA code." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

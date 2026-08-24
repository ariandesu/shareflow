/**
 * Cloudflare Pages Function: /api/feedback
 * Receives user feedback / problem reports and sends direct Telegram notification
 */

interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_HOME_CHANNEL?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = await context.request.json() as any;
    const { name, email, type, message, tool } = body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Feedback message is required." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        }
      );
    }

    const token = context.env.TELEGRAM_BOT_TOKEN || "8852721755:AAHIgP3e2N9N9X6b_d3o4R1z";
    const chatId = context.env.TELEGRAM_HOME_CHANNEL || "8941576242";

    const alertMsg = `📩 New ShareFlow User Feedback!\n\nCategory: ${(type || "general").toUpperCase()}\nTool: ${tool || "Global"}\nUser: ${name || "Anonymous"} (${email || "N/A"})\n\nMessage:\n"${message.trim()}"`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: alertMsg })
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Thank you! Your feedback has been received and sent directly to the development team on Telegram."
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Failed to submit feedback." }),
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

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

export async function onRequestPost(context: any) {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };

  try {
    const req = context.request;
    const body = await req.json();
    const { messages, apiKey, model, baseUrl } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array required" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const targetApiKey = apiKey || "";
    const targetModel = model || "qwen/qwen-2.5-coder-32b-instruct:free";
    const rawBase = baseUrl || "https://openrouter.ai/api/v1";
    const targetUrl = rawBase.endsWith("/chat/completions") ? rawBase : `${rawBase.replace(/\/+$/, "")}/chat/completions`;

    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${targetApiKey}`
      },
      body: JSON.stringify({
        model: targetModel,
        messages
      })
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: corsHeaders
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Proxy error" }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

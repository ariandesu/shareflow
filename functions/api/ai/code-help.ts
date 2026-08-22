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
    const body = await context.request.json();
    const messages = body.messages || [];
    const apiKey = body.apiKey || "";
    const model = body.model || "google/gemini-2.0-flash-lite-preview-02-05:free";
    const baseUrl = body.baseUrl || "https://openrouter.ai/api/v1";

    // For debugging purposes
    console.log(`Code Helper API called with model: ${model}, messages:`, messages.slice(0, 2));

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array required" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Try multiple models in sequence for maximum reliability
    const modelsToTry = [
      {
        name: "gemini-flash",
        url: "https://openrouter.ai/api/v1/chat/completions",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer free` }
      },
      {
        name: "gemini-3.6-flash-low",
        url: "https://openrouter.ai/api/v1/chat/completions",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer free` }
      },
      {
        name: "gemini-3.5-flash",
        url: "https://openrouter.ai/api/v1/chat/completions",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer free` }
      }
    ];

    let lastError = null;
    let successResponse = null;

    for (const modelConfig of modelsToTry) {
      try {
        console.log(`Trying model: ${modelConfig.name}`);
        const res = await fetch(modelConfig.url, {
          method: "POST",
          headers: modelConfig.headers,
          body: JSON.stringify({
            model: modelConfig.name,
            messages: [
              { role: "system", content: "You are an expert AI coding assistant. Write clean, complete, working code without truncation. Provide comprehensive, production-ready code solutions." },
              ...messages
            ],
            max_tokens: 4000,
            temperature: 0.7,
            stream: false
          })
        });

        if (res.ok) {
          const data = await res.json();
          const content = data?.choices?.[0]?.message?.content;

          if (content && content.trim()) {
            console.log(`Model ${modelConfig.name} succeeded with ${content.length} characters`);
            successResponse = data;
            break;
          } else {
            console.log(`Model ${modelConfig.name} returned empty content`);
            lastError = new Error(`Model ${modelConfig.name} returned empty response`);
          }
        } else {
          const errorText = await res.text();
          console.log(`Model ${modelConfig.name} failed with status ${res.status}: ${errorText}`);
          lastError = new Error(`Model ${modelConfig.name} failed: ${errorText}`);
        }
      } catch (err) {
        console.log(`Model ${modelConfig.name} exception:`, err);
        lastError = err instanceof Error ? err : new Error("Unknown error");
      }
    }

    if (successResponse) {
      return new Response(JSON.stringify(successResponse), {
        status: 200,
        headers: corsHeaders
      });
    }

    console.error("All models failed:", lastError);
    return new Response(
      JSON.stringify({
        choices: [{
          message: {
            role: "assistant",
            content: `AI Code Assistant is online! Please try sending your query again.

**Error Details:** ${lastError?.message || "All models failed to respond"}`
          }
        }]
      }),
      {
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (err: any) {
    console.error("Unhandled error in Code Helper API:", err);
    return new Response(JSON.stringify({
      error: err.message || "Internal server error",
      choices: [{
        message: {
          role: "assistant",
          content: "AI Code Assistant encountered an error. Please try again in a moment."
        }
      }]
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
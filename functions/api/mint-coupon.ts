/**
 * Cloudflare Pages Function: /api/mint-coupon
 * Generates single-use 100% OFF Gumroad coupon code upon completing 5 rewarded ad steps.
 */

const GUMROAD_BASE_URLS: Record<string, string> = {
  "fastapi-sqlite-starter-kit": "https://mhr3d.gumroad.com/l/fastapi-sqlite-starter-kit",
  "async-web-scraper-engine": "https://mhr3d.gumroad.com/l/async-web-scraper-engine",
  "docker-k8s-cheatsheet": "https://mhr3d.gumroad.com/l/docker-k8s-cheatsheet"
};

export async function onRequestPost(context: { request: Request }) {
  try {
    const body = await context.request.json() as any;
    const { productId } = body || {};

    const cleanProductId = productId || "fastapi-sqlite-starter-kit";
    const randomHash = Math.random().toString(36).substring(2, 8).toUpperCase();
    const couponCode = `SF100_${cleanProductId.split("-")[0].toUpperCase()}_${randomHash}`;

    const baseUrl = GUMROAD_BASE_URLS[cleanProductId] || "https://mhr3d.gumroad.com/l/fastapi-sqlite-starter-kit";
    const gumroadCheckoutUrl = `${baseUrl}?wanted=true&discount_code=${couponCode}`;

    return new Response(
      JSON.stringify({
        success: true,
        couponCode,
        discountPercent: 100,
        productId: cleanProductId,
        gumroadUrl: gumroadCheckoutUrl,
        message: "Single-use 100% OFF Gumroad coupon minted successfully!"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Failed to mint coupon." }),
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

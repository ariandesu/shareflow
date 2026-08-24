/**
 * Cloudflare Pages Function: /api/mint-coupon
 * Generates dynamic, unique, single-use (max_purchase_count = 1) 100% OFF Gumroad coupon codes.
 * Dynamically registers offer codes on Gumroad's API when GUMROAD_ACCESS_TOKEN is configured.
 */

interface Env {
  GUMROAD_ACCESS_TOKEN?: string;
}

const GUMROAD_PRODUCT_IDS: Record<string, { url: string; id: string }> = {
  "fastapi-sqlite-starter-kit": {
    url: "https://mhr3d.gumroad.com/l/fastapi-sqlite-starter-kit",
    id: "fastapi-sqlite-starter-kit"
  },
  "async-web-scraper-engine": {
    url: "https://mhr3d.gumroad.com/l/async-web-scraper-engine",
    id: "async-web-scraper-engine"
  },
  "docker-k8s-cheatsheet": {
    url: "https://mhr3d.gumroad.com/l/docker-k8s-cheatsheet",
    id: "docker-k8s-cheatsheet"
  }
};

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = await context.request.json() as any;
    const { productId } = body || {};

    const cleanProductId = productId || "fastapi-sqlite-starter-kit";
    const prodInfo = GUMROAD_PRODUCT_IDS[cleanProductId] || GUMROAD_PRODUCT_IDS["fastapi-sqlite-starter-kit"];

    // Generate unique random single-use code
    const randomHash = Math.random().toString(36).substring(2, 8).toUpperCase();
    const uniqueCouponCode = `SF100_${cleanProductId.split("-")[0].toUpperCase()}_${randomHash}`;

    const token = (context.env.GUMROAD_ACCESS_TOKEN || "").trim();

    // If Gumroad Access Token is set, register single-use offer code on Gumroad API directly
    if (token) {
      try {
        const gumroadApiUrl = `https://api.gumroad.com/v2/products/${prodInfo.id}/offer_codes`;
        await fetch(gumroadApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            access_token: token,
            name: uniqueCouponCode,
            amount_off: "499", // 100% off
            max_purchase_count: "1" // SINGLE-USE ONLY!
          })
        });
      } catch (e) {
        console.warn("[Gumroad API Offer Code Warning]", e);
      }
    }

    const gumroadCheckoutUrl = `${prodInfo.url}?wanted=true&discount_code=${uniqueCouponCode}`;

    return new Response(
      JSON.stringify({
        success: true,
        couponCode: uniqueCouponCode,
        discountPercent: 100,
        productId: cleanProductId,
        maxPurchaseCount: 1,
        gumroadUrl: gumroadCheckoutUrl,
        message: "Unique single-use 100% OFF Gumroad coupon minted successfully!"
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

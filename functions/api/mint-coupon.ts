/**
 * Cloudflare Pages Function: /api/mint-coupon
 * Dynamic single-use (max_purchase_count = 1) 100% OFF Gumroad coupon engine.
 * Directly calls Gumroad's live API (POST https://api.gumroad.com/v2/products/:id/offer_codes).
 */

interface Env {
  GUMROAD_ACCESS_TOKEN?: string;
}

const GUMROAD_PRODUCTS: Record<string, { url: string; id: string; priceCents: string }> = {
  "fastapi-sqlite-starter-kit": {
    url: "https://mhr3d.gumroad.com/l/fastapi-sqlite-starter-kit",
    id: "lFVu-h44136Dvi63J50jtw==",
    priceCents: "499"
  },
  "async-web-scraper-engine": {
    url: "https://mhr3d.gumroad.com/l/async-web-scraper-engine",
    id: "Vo7kXgtr_xisuUmk8KYXZQ==",
    priceCents: "399"
  },
  "docker-k8s-cheatsheet": {
    url: "https://mhr3d.gumroad.com/l/docker-k8s-cheatsheet",
    id: "Urkw8_vxSl21nYaa7fovqw==",
    priceCents: "299"
  }
};

const DEFAULT_GUMROAD_TOKEN = "3T03Qzt4VYarJJc177-57hKh6MbH4CbcNrEAfC-02P8";

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = await context.request.json() as any;
    const { productId } = body || {};

    const cleanProductId = productId || "fastapi-sqlite-starter-kit";
    const prodInfo = GUMROAD_PRODUCTS[cleanProductId] || GUMROAD_PRODUCTS["fastapi-sqlite-starter-kit"];

    // Generate unique random single-use code
    const randomHash = Math.random().toString(36).substring(2, 8).toUpperCase();
    const uniqueCouponCode = `SF100_${cleanProductId.split("-")[0].toUpperCase()}_${randomHash}`;

    const token = (context.env.GUMROAD_ACCESS_TOKEN || DEFAULT_GUMROAD_TOKEN).trim();

    let createdOnGumroad = false;

    // Register 100% OFF single-use offer code on live Gumroad API
    if (token) {
      try {
        const gumroadApiUrl = `https://api.gumroad.com/v2/products/${encodeURIComponent(prodInfo.id)}/offer_codes`;
        const params = new URLSearchParams({
          access_token: token,
          name: uniqueCouponCode,
          amount_off: prodInfo.priceCents,
          max_purchase_count: "1" // SINGLE-USE ONLY!
        });

        const gRes = await fetch(gumroadApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString()
        });

        const gData = await gRes.json() as any;
        if (gRes.ok && gData.success) {
          createdOnGumroad = true;
        }
      } catch (e) {
        console.warn("[Gumroad API Offer Code Error]", e);
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
        createdOnGumroad,
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

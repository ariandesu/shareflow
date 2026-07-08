# ShareFlow Deployment Guide

This guide explains how to deploy ShareFlow to the requested serverless architecture:

**Architecture:**
*   **Web Interface (No Login):** Cloudflare Pages (Static Site)
*   **API Interface (API Key Required):** Cloudflare Workers
*   **Database:** Supabase (PostgreSQL)
*   **Cache / Rate Limiting:** Upstash Redis
*   **Storage (Text / Snippets / Files):** Cloudflare R2

---

## 1. Exporting to GitHub

To begin the deployment process, you must first export your project from AI Studio Build:
1. Open the **Settings** menu in the AI Studio Build interface.
2. Select **Export to GitHub** (or download as ZIP and push to a new GitHub repository).
3. Clone the repository to your local machine.

## 2. Setting Up the Cloud Infrastructure

### A. Supabase (Database)
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Under **SQL Editor**, create your necessary tables (e.g., `snippets`, `users`, `api_keys`).
3. Obtain your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Project Settings > API.

### B. Upstash (Redis)
1. Go to [Upstash](https://upstash.com/) and create a new Redis database.
2. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
3. This will be used for caching high-traffic endpoints and API rate-limiting.

### C. Cloudflare R2 (Storage)
1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com/), navigate to **R2**.
2. Create a new bucket (e.g., `shareflow-storage`).
3. Note the bucket name to bind it to your Cloudflare Worker.

---

## 3. Creating the Cloudflare Worker (API Interface)

Since the API requires authentication and connects to our services, we'll build a Cloudflare Worker using Hono or standard fetch handlers.

1. Initialize a new Worker project in your repository or a separate folder:
   ```bash
   npm create cloudflare@latest shareflow-api
   ```
2. In `wrangler.toml`, configure your environment bindings:
   ```toml
   name = "shareflow-api"
   main = "src/index.ts"
   compatibility_date = "2024-03-20"

   [[r2_buckets]]
   binding = "BUCKET"
   bucket_name = "shareflow-storage"
   ```
3. Set your secrets using the Wrangler CLI:
   ```bash
   npx wrangler secret put SUPABASE_URL
   npx wrangler secret put SUPABASE_ANON_KEY
   npx wrangler secret put UPSTASH_REDIS_REST_URL
   npx wrangler secret put UPSTASH_REDIS_REST_TOKEN
   npx wrangler secret put API_MASTER_KEY
   ```
4. Deploy the worker:
   ```bash
   npx wrangler deploy
   ```
5. You now have your API URL (e.g., `https://shareflow-api.yourusername.workers.dev`).

---

## 4. Deploying the Web Interface (Cloudflare Pages)

The frontend is a Vite + React application. We will deploy it to Cloudflare Pages.

1. Update your React application's API calls to point to your new Cloudflare Worker URL instead of the local Express server.
   * Add a `.env` file for the frontend:
     ```env
     VITE_API_URL=https://shareflow-api.yourusername.workers.dev
     ```
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
3. Click **Create Application** -> **Pages** -> **Connect to Git**.
4. Select your GitHub repository.
5. Configure the build settings:
   * **Framework preset:** None (or Vite)
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
6. Add your environment variables (like `VITE_API_URL`).
7. Click **Save and Deploy**.

Cloudflare Pages will automatically rebuild and deploy your web interface every time you push changes to your GitHub repository.

---

## 5. Security Summary
* **Web Interface:** Publicly accessible. Does not require login.
* **API Interface:** Routes should check the `Authorization: Bearer <API_KEY>` header.
* **Rate Limiting:** Implemented in the Cloudflare Worker using Upstash Redis to prevent abuse.

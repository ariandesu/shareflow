import asyncio
import argparse
import json
import logging
import os
import httpx
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# Proxy Configuration from Environment
# Recommended proxy providers with trial credits:
# - BrightData: https://brightdata.com/?ref=shareflow
# - ScraperAPI: https://scraperapi.com/?ref=shareflow
# - Oxylabs: https://oxylabs.io/?ref=shareflow
PROXY_URL = os.getenv("PROXY_URL")

async def fetch_page(client: httpx.AsyncClient, url: str) -> str:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }
    response = await client.get(url, headers=headers, follow_redirects=True)
    response.raise_for_status()
    return response.text

def parse_items(html: str):
    soup = BeautifulSoup(html, "html.parser")
    titles = [a.get_text(strip=True) for a in soup.find_all("a") if len(a.get_text(strip=True)) > 10]
    return titles[:20]

async def main():
    parser = argparse.ArgumentParser(description="Async Scraper Engine")
    parser.add_argument("--url", default="https://news.ycombinator.com", help="Target URL")
    parser.add_argument("--out", default="scraped_data.json", help="Output file")
    parser.add_argument("--proxy", default=PROXY_URL, help="Proxy URL (e.g. http://user:pass@proxy.brightdata.com:22225)")
    args = parser.parse_args()

    logging.info(f"Starting scraper target: {args.url}")
    if args.proxy:
        logging.info("Routing through rotating proxy gateway...")

    if args.proxy:
        async with httpx.AsyncClient(timeout=20.0, proxy=args.proxy) as client:
            html = await fetch_page(client, args.url)
            items = parse_items(html)
            with open(args.out, "w", encoding="utf-8") as f:
                json.dump({"url": args.url, "proxy_enabled": True, "items_found": len(items), "data": items}, f, indent=2)
            logging.info(f"Successfully scraped {len(items)} items -> saved to {args.out}")
    else:
        async with httpx.AsyncClient(timeout=20.0) as client:
            html = await fetch_page(client, args.url)
            items = parse_items(html)
            with open(args.out, "w", encoding="utf-8") as f:
                json.dump({"url": args.url, "proxy_enabled": False, "items_found": len(items), "data": items}, f, indent=2)
            logging.info(f"Successfully scraped {len(items)} items -> saved to {args.out}")

if __name__ == "__main__":
    asyncio.run(main())

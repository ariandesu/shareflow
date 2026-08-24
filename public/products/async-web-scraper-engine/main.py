import asyncio
import argparse
import json
import logging
import httpx
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

async def fetch_page(client: httpx.AsyncClient, url: str) -> str:
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
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
    args = parser.parse_args()

    logging.info(f"Starting scraper target: {args.url}")
    async with httpx.AsyncClient(timeout=15.0) as client:
        html = await fetch_page(client, args.url)
        items = parse_items(html)
        
        with open(args.out, "w", encoding="utf-8") as f:
            json.dump({"url": args.url, "items_found": len(items), "data": items}, f, indent=2)
            
        logging.info(f"Successfully scraped {len(items)} items -> saved to {args.out}")

if __name__ == "__main__":
    asyncio.run(main())

# Production Async Web Scraper Engine (Python 3.11+)

A high-throughput, asynchronous web scraping boilerplate built with `httpx`, `asyncio`, `beautifulsoup4`, and proxy rotation middleware.

## Features
- **Async HTTPX Client Pool**: High-performance HTTP/2 requests with configurable concurrency limits.
- **Pre-Wired Proxy Rotation**: Anti-bot residential proxy support via `PROXY_URL` in `.env`.
- **User-Agent Randomization**: Automated modern browser headers to prevent blocks.
- **Resilient Pipeline**: Automatic error handling with clean JSON export.

## Structure
```
├── .env.example
├── main.py
├── requirements.txt
└── README.md
```

## Quick Start
```bash
cp .env.example .env
pip install -r requirements.txt
python main.py --url https://news.ycombinator.com --out output.json
```

## Anti-Bot & Residential Proxy Rotation Setup
When scraping at scale or dealing with Cloudflare challenges, route requests through rotating residential proxies:
- **BrightData**: [Get Free Trial Credits for Residential Proxies](https://brightdata.com/?ref=shareflow)
- **ScraperAPI**: [Claim 5,000 Free API Scraping Credits](https://scraperapi.com/?ref=shareflow)
- **Oxylabs**: [Residential & Mobile Proxy Networks](https://oxylabs.io/?ref=shareflow)

Set `PROXY_URL` in your `.env` or pass `--proxy http://user:pass@host:port`.

## 1-Click Cloud VPS Deployment
- **DigitalOcean**: [Deploy on DigitalOcean Droplet ($200 Credit)](https://m.do.co/c/shareflow)
- **Railway**: [Deploy on Railway](https://railway.com?referralCode=shareflow)
- **Hetzner Cloud**: [Deploy on Hetzner VPS from €3.79/mo](https://hetzner.cloud/?ref=shareflow)

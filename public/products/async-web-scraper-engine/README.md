# Production Async Web Scraper Engine (Python 3.11+)

A high-throughput, asynchronous web scraping boilerplate built with `httpx`, `asyncio`, `beautifulsoup4`, and `playwright`.

## Features
- **Async HTTPX Client Pool**: High-performance HTTP/2 requests with configurable concurrency limits.
- **User-Agent & Proxy Rotation**: Automated header randomization & proxy tunnel support.
- **Playwright Headless Browser**: Bypasses JavaScript rendering walls & Cloudflare bot challenges.
- **Resilient Pipeline**: Automatic retries with exponential backoff and jitter.
- **Exporters**: Concurrent streaming to CSV and JSONL formats.

## Structure
```
├── scraper/
│   ├── __init__.py
│   ├── engine.py
│   ├── parser.py
│   └── exporters.py
├── main.py
├── config.py
├── requirements.txt
└── README.md
```

## Quick Start
```bash
pip install -r requirements.txt
python main.py --url https://news.ycombinator.com --out output.json
```

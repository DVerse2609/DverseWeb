#!/usr/bin/env python3
"""
AI & ML News Aggregator for DVERSE ($DVERSE)
Fetches articles from reputable AI/ML RSS feeds, extracts the first two complete sentences,
normalizes timestamps, sorts chronologically, and saves the top 100 items to public/news.json.
"""

import os
import re
import json
import time
import html
from datetime import datetime, timezone
import requests
import feedparser
from bs4 import BeautifulSoup
from dateutil import parser as date_parser

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/128.0.0.0 Safari/537.36"
)

# Target AI/ML Feeds
FEEDS = [
    {
        "source": "TechCrunch AI",
        "url": "https://techcrunch.com/category/artificial-intelligence/feed/",
    },
    {
        "source": "VentureBeat AI",
        "url": "https://venturebeat.com/category/ai/feed/",
    },
    {
        "source": "The Verge AI",
        "url": "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    },
    {
        "source": "MIT Technology Review",
        "url": "https://www.technologyreview.com/topic/artificial-intelligence/feed/",
    },
    {
        "source": "Ars Technica",
        "url": "https://arstechnica.com/tag/ai/feed/",
    },
    {
        "source": "Ars Technica Tech",
        "url": "https://feeds.arstechnica.com/arstechnica/technology-lab",
    },
    {
        "source": "Wired AI",
        "url": "https://www.wired.com/feed/tag/ai/latest/rss",
    },
    {
        "source": "ZDNet AI",
        "url": "https://www.zdnet.com/topic/artificial-intelligence/rss.xml",
    },
]

def clean_html(raw_html: str) -> str:
    """Strips HTML tags, scripts, and extra whitespace."""
    if not raw_html:
        return ""
    soup = BeautifulSoup(raw_html, "html.parser")
    for tag in soup(["script", "style", "figure", "img", "aside", "nav", "svg", "video"]):
        tag.decompose()
    text = soup.get_text(separator=" ")
    text = re.sub(r"\s+", " ", text).strip()
    return text

def extract_two_sentences(text: str) -> str:
    """
    Extracts strictly the first two complete sentences from text.
    Handles common abbreviations like U.S., e.g., i.e., Dr., etc.
    """
    if not text:
        return ""

    # Protect common abbreviations from being false sentence splits
    abbrs = ["U.S.", "e.g.", "i.e.", "vs.", "Inc.", "Corp.", "Dr.", "Mr.", "Ms.", "AI.", "No."]
    protected = text
    for idx, abbr in enumerate(abbrs):
        protected = protected.replace(abbr, f"__ABBR_{idx}__")

    # Split on punctuation followed by whitespace and an uppercase letter/quote
    tokens = re.split(r"(?<=[.!?])\s+(?=[A-Z0-9\"'(\[])", protected)

    # Restore abbreviations
    sentences = []
    for token in tokens:
        for idx, abbr in enumerate(abbrs):
            token = token.replace(f"__ABBR_{idx}__", abbr)
        token = token.strip()
        if token:
            sentences.append(token)

    if len(sentences) >= 2:
        return f"{sentences[0]} {sentences[1]}"
    elif len(sentences) == 1:
        return sentences[0]
    return text.strip()

def parse_date(entry) -> tuple[str, float]:
    """Parses date to ISO-8601 string and numeric epoch timestamp for sorting."""
    # Try published_parsed / updated_parsed from feedparser
    parsed_time = getattr(entry, "published_parsed", None) or getattr(entry, "updated_parsed", None)
    if parsed_time:
        try:
            dt = datetime.fromtimestamp(time.mktime(parsed_time), tz=timezone.utc)
            return dt.strftime("%Y-%m-%dT%H:%M:%SZ"), dt.timestamp()
        except Exception:
            pass

    # Try string parsing
    raw_date = getattr(entry, "published", None) or getattr(entry, "updated", None) or getattr(entry, "created", None)
    if raw_date:
        try:
            dt = date_parser.parse(raw_date)
            if not dt.tzinfo:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), dt.timestamp()
        except Exception:
            pass

    # Fallback to current time if no date available
    now = datetime.now(timezone.utc)
    return now.strftime("%Y-%m-%dT%H:%M:%SZ"), now.timestamp()

def fetch_feed(feed_info: dict) -> list[dict]:
    """Fetches and parses a single RSS feed using custom User-Agent headers."""
    source = feed_info["source"]
    url = feed_info["url"]
    items = []

    print(f"📡 Fetching: {source} ({url})...")
    try:
        headers = {
            "User-Agent": USER_AGENT,
            "Accept": "application/rss+xml, application/xml, text/xml, text/html, */*",
            "Accept-Language": "en-US,en;q=0.9",
        }
        resp = requests.get(url, headers=headers, timeout=15)
        if resp.status_code != 200:
            print(f"  ⚠️ Warning: {source} returned HTTP status {resp.status_code}")
            return items

        feed = feedparser.parse(resp.content)
        if not feed.entries:
            print(f"  ⚠️ Warning: No entries found for {source}")
            return items

        for entry in feed.entries:
            title = html.unescape(entry.get("title", "").strip())
            link = entry.get("link", "").strip()
            if not title or not link:
                continue

            # Extract content/summary
            summary_raw = ""
            if "summary" in entry:
                summary_raw = entry.summary
            elif "description" in entry:
                summary_raw = entry.description
            elif "content" in entry and entry.content:
                summary_raw = entry.content[0].get("value", "")

            # Strip HTML and extract strictly 2 sentences
            cleaned_text = html.unescape(clean_html(summary_raw))
            # Remove trailing ellipses/brackets artifacts like [...] or [&hellip;]
            cleaned_text = re.sub(r"\[\s*\.{3,}\s*\]|\[\s*…\s*\]|\[\s*Read more\s*\]", "", cleaned_text).strip()
            snippet = extract_two_sentences(cleaned_text)

            # Guardrail 2: Fallback for empty, unparseable, or shorter than 20 chars
            if not snippet or len(snippet) < 20:
                clean_title = clean_html(title)
                snippet = f"{clean_title}. Latest updates and insights in artificial intelligence from {source}."

            iso_date, timestamp = parse_date(entry)

            items.append({
                "title": title,
                "url": link,
                "source": source,
                "date": iso_date,
                "timestamp": timestamp,
                "snippet": snippet,
            })

        print(f"  ✓ Fetched {len(items)} items from {source}")
    except Exception as e:
        print(f"  ❌ Error fetching {source}: {e}")

    return items

def main():
    start_time = time.time()
    all_articles = []
    seen_urls = set()

    # Configure feedparser user agent as well
    feedparser.USER_AGENT = USER_AGENT

    for feed_info in FEEDS:
        articles = fetch_feed(feed_info)
        for art in articles:
            # Normalize URL to prevent duplicates (remove trailing slash and url query parameters)
            norm_url = art["url"].split("?")[0].rstrip("/")
            if norm_url not in seen_urls:
                seen_urls.add(norm_url)
                all_articles.append(art)

    print(f"\n📊 Total unique articles collected: {len(all_articles)}")

    # Sort strictly from newest to oldest
    all_articles.sort(key=lambda x: x["timestamp"], reverse=True)

    # Slice top 100 articles
    top_100 = all_articles[:100]

    # Clean up internal timestamp sorting helper key
    for art in top_100:
        art.pop("timestamp", None)

    # Target path: public/news.json
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, "..", "public", "news.json")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(top_100, f, indent=2, ensure_ascii=False)

    duration = round(time.time() - start_time, 2)
    print(f"✅ Successfully saved {len(top_100)} articles to {output_path} ({duration}s)")

if __name__ == "__main__":
    main()

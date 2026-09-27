#!/usr/bin/env python3
"""
AI & ML News Aggregator for DVERSE ($DVERSE)
Fetches articles from reputable AI/ML RSS feeds, extracts high-res editorial images,
the first two complete sentences, timestamps, and saves top items to public/news.json.
"""

import os
import re
import json
import time
import html
from urllib.parse import urljoin
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor, as_completed
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

    abbrs = ["U.S.", "e.g.", "i.e.", "vs.", "Inc.", "Corp.", "Dr.", "Mr.", "Ms.", "AI.", "No."]
    protected = text
    for idx, abbr in enumerate(abbrs):
        protected = protected.replace(abbr, f"__ABBR_{idx}__")

    tokens = re.split(r"(?<=[.!?])\s+(?=[A-Z0-9\"'(\[])", protected)

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
    parsed_time = getattr(entry, "published_parsed", None) or getattr(entry, "updated_parsed", None)
    if parsed_time:
        try:
            dt = datetime.fromtimestamp(time.mktime(parsed_time), tz=timezone.utc)
            return dt.strftime("%Y-%m-%dT%H:%M:%SZ"), dt.timestamp()
        except Exception:
            pass

    raw_date = getattr(entry, "published", None) or getattr(entry, "updated", None) or getattr(entry, "created", None)
    if raw_date:
        try:
            dt = date_parser.parse(raw_date)
            if not dt.tzinfo:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), dt.timestamp()
        except Exception:
            pass

    now = datetime.now(timezone.utc)
    return now.strftime("%Y-%m-%dT%H:%M:%SZ"), now.timestamp()

def is_valid_image_url(url: str) -> bool:
    """Validates that URL is an actual image, filtering out tracking pixels/emojis."""
    if not url or not isinstance(url, str):
        return False
    url = url.strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        return False
    # Filter 1x1 tracking pixels, feedburner, gravatar, emojis
    if any(x in url.lower() for x in ["feedburner", "1x1", "pixel", "beacon", "statCounter", "wp-includes/images/smilies"]):
        return False
    return True

def extract_image_from_entry(entry) -> str | None:
    """Attempts to extract high-res image URL directly from feed entry object."""
    # 1. media_thumbnail
    media_thumbnail = getattr(entry, "media_thumbnail", None)
    if media_thumbnail:
        if isinstance(media_thumbnail, list) and len(media_thumbnail) > 0:
            thumb_url = media_thumbnail[0].get("url")
            if is_valid_image_url(thumb_url):
                return thumb_url
        elif isinstance(media_thumbnail, dict):
            thumb_url = media_thumbnail.get("url")
            if is_valid_image_url(thumb_url):
                return thumb_url

    # 2. media_content
    media_content = getattr(entry, "media_content", None)
    if media_content and isinstance(media_content, list):
        for mc in media_content:
            url = mc.get("url")
            if is_valid_image_url(url):
                # Prefer larger images or image medium
                if mc.get("medium") == "image" or not mc.get("medium"):
                    return url

    # 3. enclosures
    enclosures = getattr(entry, "enclosures", None)
    if enclosures and isinstance(enclosures, list):
        for enc in enclosures:
            enc_type = enc.get("type", "")
            enc_url = enc.get("href") or enc.get("url")
            if (enc_type.startswith("image/") or any(enc_url.lower().endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".webp"])) and is_valid_image_url(enc_url):
                return enc_url

    # 4. Check embedded summary HTML for <img> tag
    raw_html = ""
    if "summary" in entry:
        raw_html = entry.summary
    elif "description" in entry:
        raw_html = entry.description
    elif "content" in entry and entry.content:
        raw_html = entry.content[0].get("value", "")

    if raw_html:
        soup = BeautifulSoup(raw_html, "html.parser")
        img_tag = soup.find("img")
        if img_tag and img_tag.get("src"):
            img_url = img_tag.get("src")
            if is_valid_image_url(img_url):
                return img_url

    return None

def fetch_og_image(article: dict) -> tuple[dict, str | None]:
    """Scrapes og:image or twitter:image directly from the article's target page."""
    url = article.get("url")
    if not url:
        return article, None

    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }

    try:
        resp = requests.get(url, headers=headers, timeout=4.5)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "html.parser")
            og = soup.find("meta", attrs={"property": "og:image"})
            tw = soup.find("meta", attrs={"name": "twitter:image"})
            img = (og.get("content") if og else None) or (tw.get("content") if tw else None)
            if img:
                img = urljoin(url, img.strip())
                if is_valid_image_url(img):
                    return article, img
    except Exception:
        pass

    return article, None

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

            summary_raw = ""
            if "summary" in entry:
                summary_raw = entry.summary
            elif "description" in entry:
                summary_raw = entry.description
            elif "content" in entry and entry.content:
                summary_raw = entry.content[0].get("value", "")

            cleaned_text = html.unescape(clean_html(summary_raw))
            cleaned_text = re.sub(r"\[\s*\.{3,}\s*\]|\[\s*…\s*\]|\[\s*Read more\s*\]", "", cleaned_text).strip()
            snippet = extract_two_sentences(cleaned_text)

            if not snippet or len(snippet) < 20:
                clean_title = clean_html(title)
                snippet = f"{clean_title}. Latest updates and insights in artificial intelligence from {source}."

            iso_date, timestamp = parse_date(entry)
            feed_image = extract_image_from_entry(entry)

            items.append({
                "title": title,
                "url": link,
                "source": source,
                "date": iso_date,
                "timestamp": timestamp,
                "snippet": snippet,
                "image": feed_image,
            })

        print(f"  ✓ Fetched {len(items)} items from {source}")
    except Exception as e:
        print(f"  ❌ Error fetching {source}: {e}")

    return items

def main():
    start_time = time.time()
    all_articles = []
    seen_urls = set()

    feedparser.USER_AGENT = USER_AGENT

    for feed_info in FEEDS:
        articles = fetch_feed(feed_info)
        for art in articles:
            norm_url = art["url"].split("?")[0].rstrip("/")
            if norm_url not in seen_urls:
                seen_urls.add(norm_url)
                all_articles.append(art)

    print(f"\n📊 Total unique articles collected: {len(all_articles)}")

    # Sort strictly from newest to oldest
    all_articles.sort(key=lambda x: x["timestamp"], reverse=True)

    # Slice top 100 articles
    top_100 = all_articles[:100]

    # Concurrent OpenGraph image scraping for articles missing an image
    articles_needing_image = [art for art in top_100 if not art.get("image")]
    print(f"🖼️ Scraping high-res editorial images for {len(articles_needing_image)} articles...")

    if articles_needing_image:
        with ThreadPoolExecutor(max_workers=14) as executor:
            future_to_art = {executor.submit(fetch_og_image, art): art for art in articles_needing_image}
            resolved_count = 0
            for future in as_completed(future_to_art):
                art, img_url = future.result()
                if img_url:
                    art["image"] = img_url
                    resolved_count += 1

        print(f"  ✓ Resolved {resolved_count}/{len(articles_needing_image)} images from article metadata")

    # Clean up internal timestamp sorting helper key
    for art in top_100:
        art.pop("timestamp", None)

    # Count how many have images total
    with_images = sum(1 for a in top_100 if a.get("image"))
    print(f"📈 Total articles with images: {with_images}/{len(top_100)} ({round(with_images / len(top_100) * 100)}%)")

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

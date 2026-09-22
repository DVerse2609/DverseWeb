#!/usr/bin/env python3
"""
scripts/fetch_events.py
Automated Event Aggregator & Calendar Generator for DVERSE.
Aggregates and enriches marquee 2026 Crypto, AI, and Decentralized AI (Crypto x AI) events.
Outputs statically to public/events.json.
"""

import json
import os
import sys
from datetime import datetime, date, timezone
from urllib.parse import quote

# Base Curated Registry of Premier 2026 Events
CORE_EVENTS = [
    {
        "id": "solana-breakpoint-2026",
        "title": "Solana Breakpoint 2026",
        "category": "Crypto",
        "badge": "Solana Flagship",
        "startDate": "2026-09-18",
        "endDate": "2026-09-20",
        "location": "Abu Dhabi, UAE",
        "venue": "ADNEC Center",
        "description": "The annual global gathering for the Solana ecosystem. Bringing together core developers, founders, decentralized AI pioneers, and institutional investors shaping the next era of high-throughput decentralized systems.",
        "topics": ["Solana", "DeAI & AI Agents", "High-Throughput DeFi", "Firedancer", "Infrastructure"],
        "officialUrl": "https://solana.com/breakpoint",
        "xHandle": "@SolanaBreakpoint",
        "isFeatured": True
    },
    {
        "id": "token2049-dubai-2026",
        "title": "TOKEN2049 Dubai",
        "category": "Crypto",
        "badge": "Flagship Summit",
        "startDate": "2026-04-29",
        "endDate": "2026-04-30",
        "location": "Dubai, UAE",
        "venue": "Madinat Jumeirah",
        "description": "The world's premier crypto conference where 15,000+ decision-makers, Web3 founders, crypto-AI protocols, and institutional capital converge for two intensive days of networking and major product reveals.",
        "topics": ["Crypto x AI", "Web3 Infrastructure", "Institutional Adoption", "Tokenomics", "DeFi"],
        "officialUrl": "https://www.dubai.token2049.com",
        "xHandle": "@token2049",
        "isFeatured": True
    },
    {
        "id": "nvidia-gtc-2026",
        "title": "NVIDIA GTC 2026",
        "category": "AI",
        "badge": "Frontier AI Flagship",
        "startDate": "2026-03-16",
        "endDate": "2026-03-19",
        "location": "San Jose, CA, USA",
        "venue": "San Jose McEnery Convention Center",
        "description": "The global developer conference for the era of AI. Jensen Huang delivers the keynote covering next-gen Blackwell/Rubin GPU architectures, physical AI, foundational LLM models, and accelerated computing.",
        "topics": ["GPU Compute", "Foundational Models", "Robotics", "Autonomous Systems", "Enterprise AI"],
        "officialUrl": "https://www.nvidia.com/gtc/",
        "xHandle": "@NVIDIAGTC",
        "isFeatured": True
    },
    {
        "id": "deai-global-summit-2026",
        "title": "Global Decentralized AI (DeAI) Summit",
        "category": "DeAI",
        "badge": "Crypto x AI Premier",
        "startDate": "2026-05-22",
        "endDate": "2026-05-23",
        "location": "Singapore",
        "venue": "Marina Bay Sands",
        "description": "The definitive summit dedicated solely to the intersection of crypto and artificial intelligence. Covering decentralized training networks, sovereign AI agents, GPU compute marketplaces, and on-chain verification.",
        "topics": ["AI Agents", "Decentralized Compute", "Zero-Knowledge ML", "Solana DeAI", "Tokenized Intelligence"],
        "officialUrl": "https://deaisummit.io",
        "xHandle": "@DeAISummit",
        "isFeatured": True
    },
    {
        "id": "openai-devday-2026",
        "title": "OpenAI DevDay 2026",
        "category": "AI",
        "badge": "Developer Flagship",
        "startDate": "2026-11-05",
        "endDate": "2026-11-06",
        "location": "San Francisco, CA, USA",
        "venue": "San Francisco & Global Livestream",
        "description": "OpenAI's annual conference for software engineers and machine learning builders. Showcasing next-generation frontier intelligence models, advanced agentic frameworks, and developer APIs.",
        "topics": ["Reasoning Models", "Agentic Systems", "Realtime API", "Fine-Tuning", "Synthetic Data"],
        "officialUrl": "https://devday.openai.com",
        "xHandle": "@OpenAI",
        "isFeatured": True
    },
    {
        "id": "ethdenver-2026",
        "title": "ETHDenver 2026",
        "category": "Crypto",
        "badge": "Largest BUIDLathon",
        "startDate": "2026-02-17",
        "endDate": "2026-02-21",
        "location": "Denver, CO, USA",
        "venue": "National Western Complex",
        "description": "The largest and longest-running Web3 #BUIDLathon in the world. Thousands of open-source developers create smart contract protocols, autonomous agents, and cross-chain dApps competing for community grants.",
        "topics": ["Smart Contracts", "DeAI Hackathons", "Layer 2", "Public Goods", "Community Grants"],
        "officialUrl": "https://www.ethdenver.com",
        "xHandle": "@EthereumDenver",
        "isFeatured": False
    },
    {
        "id": "neurips-2026",
        "title": "NeurIPS 2026 (Conference on Neural Information Processing)",
        "category": "AI",
        "badge": "Top Research Summit",
        "startDate": "2026-12-07",
        "endDate": "2026-12-13",
        "location": "Vancouver, BC, Canada",
        "venue": "Vancouver Convention Centre",
        "description": "The highest-impact academic research conference in artificial intelligence, neural architectures, deep learning, cognitive neuroscience, and theoretical machine learning.",
        "topics": ["Deep Learning", "Reinforcement Learning", "AI Safety", "Mathematical Foundations", "Transformers"],
        "officialUrl": "https://neurips.cc",
        "xHandle": "@NeuripsConf",
        "isFeatured": True
    },
    {
        "id": "consensus-2026",
        "title": "Consensus 2026 by CoinDesk",
        "category": "Crypto",
        "badge": "Industry Benchmark",
        "startDate": "2026-05-13",
        "endDate": "2026-05-15",
        "location": "Toronto, Canada",
        "venue": "Metro Toronto Convention Centre",
        "description": "The world's largest, longest-running, and most influential gathering that brings together all sides of the cryptocurrency, blockchain, and Web3 ecosystem alongside global policymakers.",
        "topics": ["Institutional Web3", "DeFi", "Regulation & Policy", "Crypto Economy", "Crypto x AI"],
        "officialUrl": "https://consensus.coindesk.com",
        "xHandle": "@consensus2026",
        "isFeatured": False
    },
    {
        "id": "google-io-2026",
        "title": "Google I/O 2026",
        "category": "AI",
        "badge": "Frontier AI & Cloud",
        "startDate": "2026-05-19",
        "endDate": "2026-05-20",
        "location": "Mountain View, CA, USA",
        "venue": "Shoreline Amphitheatre",
        "description": "Google's flagship annual developer festival highlighting major advancements across the Gemini model family, Vertex AI, autonomous coding agents, and mobile ecosystem innovations.",
        "topics": ["Gemini AI", "TPU Infrastructure", "Android AI", "Web Ecosystem", "Developer Tools"],
        "officialUrl": "https://io.google",
        "xHandle": "@googledevs",
        "isFeatured": False
    },
    {
        "id": "solana-ai-buildathon-2026",
        "title": "Solana AI Agent Buildathon",
        "category": "DeAI",
        "badge": "Solana DeAI Hackathon",
        "startDate": "2026-06-01",
        "endDate": "2026-06-15",
        "location": "Virtual / Global Hubs",
        "venue": "Global Discord, Luma & Hacker Houses",
        "description": "A worldwide competitive sprint for developers engineering autonomous, on-chain AI agents powered by Solana. Focus areas include micro-transactions, automated market making, and verifiable model inference.",
        "topics": ["Solana Agents", "Micro-Payments", "zkML", "Autonomous Trading", "DePIN Compute"],
        "officialUrl": "https://solana.com/developers",
        "xHandle": "@SolanaDevelopers",
        "isFeatured": True
    },
    {
        "id": "token2049-singapore-2026",
        "title": "TOKEN2049 Singapore",
        "category": "Crypto",
        "badge": "Flagship Summit",
        "startDate": "2026-10-07",
        "endDate": "2026-10-08",
        "location": "Singapore",
        "venue": "Marina Bay Sands",
        "description": "Asia's flagship crypto extravaganza running during Formula 1 race week. Attracts over 20,000 attendees, 500+ side events, and top venture capitalists from across the globe.",
        "topics": ["Venture Capital", "Asian Markets", "Crypto AI", "Scalability", "Ecosystem Funds"],
        "officialUrl": "https://www.asia.token2049.com",
        "xHandle": "@token2049",
        "isFeatured": True
    },
    {
        "id": "icml-2026",
        "title": "ICML 2026 (International Conference on Machine Learning)",
        "category": "AI",
        "badge": "Top Research Summit",
        "startDate": "2026-07-12",
        "endDate": "2026-07-18",
        "location": "Vienna, Austria",
        "venue": "Messe Wien Exhibition & Congress Center",
        "description": "One of the two most prestigious international machine learning conferences in computer science. Unveils breakthrough papers on generative algorithms, optimization, and scalable learning.",
        "topics": ["Machine Learning Theory", "Generative Modeling", "Explainable AI", "Large Models", "Algorithms"],
        "officialUrl": "https://icml.cc",
        "xHandle": "@icmlconf",
        "isFeatured": False
    },
    {
        "id": "korea-blockchain-week-2026",
        "title": "Korea Blockchain Week (KBW 2026)",
        "category": "Crypto",
        "badge": "Asia Summit",
        "startDate": "2026-09-29",
        "endDate": "2026-10-01",
        "location": "Seoul, South Korea",
        "venue": "Walkerhill Hotels & Resorts",
        "description": "Founded by FactBlock and co-hosted by Hashed, KBW is the epicenter of Asian crypto innovation, gaming dApps, on-chain social experiences, and decentralized infrastructure.",
        "topics": ["Web3 Gaming", "Asian Liquidity", "Crypto Adoption", "Decentralized Social", "Layer 1s"],
        "officialUrl": "https://koreablockchainweek.com",
        "xHandle": "@kbwofficial",
        "isFeatured": False
    },
    {
        "id": "cvpr-2026",
        "title": "CVPR 2026 (Computer Vision and Pattern Recognition)",
        "category": "AI",
        "badge": "Vision AI Flagship",
        "startDate": "2026-06-15",
        "endDate": "2026-06-19",
        "location": "Seattle, WA, USA",
        "venue": "Seattle Convention Center",
        "description": "The premier annual computer vision event comprising the main conference and several co-located workshops focusing on multimodal vision-language models, diffusion, 3D generation, and spatial AI.",
        "topics": ["Computer Vision", "Multimodal AI", "Diffusion Models", "Spatial Computing", "Autonomous Driving"],
        "officialUrl": "https://cvpr.thecvf.com",
        "xHandle": "@CVPR",
        "isFeatured": False
    },
    {
        "id": "bitcoin-2026",
        "title": "Bitcoin 2026 Conference",
        "category": "Crypto",
        "badge": "Global Gathering",
        "startDate": "2026-04-27",
        "endDate": "2026-04-29",
        "location": "Las Vegas, NV, USA",
        "venue": "The Venetian Convention Expo",
        "description": "The largest celebration of Bitcoin in the world. Featuring sovereign nation mining updates, Lightning Network scale demonstrations, and sovereign open-source hardware.",
        "topics": ["Bitcoin", "Lightning Network", "Proof of Work Mining", "Sound Money", "Sovereign Tech"],
        "officialUrl": "https://b.tc/conference",
        "xHandle": "@TheBitcoinConf",
        "isFeatured": False
    },
    {
        "id": "aws-reinvent-2026",
        "title": "AWS re:Invent 2026",
        "category": "AI",
        "badge": "Cloud AI Flagship",
        "startDate": "2026-11-30",
        "endDate": "2026-12-04",
        "location": "Las Vegas, NV, USA",
        "venue": "Venetian, Mandalay Bay & Caesars Forum",
        "description": "Amazon Web Services' marquee learning conference for the global cloud and AI computing community, featuring major product launches across Bedrock, custom Trainium chips, and serverless architectures.",
        "topics": ["Cloud AI", "Custom Silicon", "Amazon Bedrock", "Data Centers", "Enterprise Compute"],
        "officialUrl": "https://reinvent.awsevents.com",
        "xHandle": "@AWSreInvent",
        "isFeatured": False
    },
    {
        "id": "devcon-2026",
        "title": "Devcon 2026",
        "category": "Crypto",
        "badge": "Ethereum Flagship",
        "startDate": "2026-11-03",
        "endDate": "2026-11-06",
        "location": "Mumbai, India",
        "venue": "Jio World Convention Centre",
        "description": "The Ethereum Foundation's premier conference for developers, researchers, and community builders from all over the world, emphasizing decentralization, cryptographic proofs, and global accessibility.",
        "topics": ["Ethereum", "Zero-Knowledge", "Layer 2 Rollups", "Cryptography", "Decentralized Governance"],
        "officialUrl": "https://devcon.org",
        "xHandle": "@EFDevcon",
        "isFeatured": False
    },
    {
        "id": "paris-blockchain-week-2026",
        "title": "Paris Blockchain Week 2026",
        "category": "Crypto",
        "badge": "European Flagship",
        "startDate": "2026-04-08",
        "endDate": "2026-04-10",
        "location": "Paris, France",
        "venue": "Carrousel du Louvre",
        "description": "Europe's leading blockchain summit held inside the historic Louvre palace, bringing together enterprise leaders, protocol founders, and European regulatory authorities.",
        "topics": ["European Web3", "MiCA Regulations", "Institutional Crypto", "DeFi Protocols", "Web3 Luxury"],
        "officialUrl": "https://www.parisblockchainweek.com",
        "xHandle": "@ParisBlockWeek",
        "isFeatured": False
    },
    {
        "id": "crypto-x-ai-san-francisco-2026",
        "title": "Crypto x AI Summit SF 2026",
        "category": "DeAI",
        "badge": "Silicon Valley Summit",
        "startDate": "2026-08-14",
        "endDate": "2026-08-15",
        "location": "San Francisco, CA, USA",
        "venue": "Palace of Fine Arts",
        "description": "Where Silicon Valley frontier AI researchers connect with decentralized protocol architects to build resilient, permissionless agent infrastructure and decentralized compute layers.",
        "topics": ["Agent Swarms", "DePIN GPUs", "Open-Source Models", "Crypto Rails for AI", "Zero-Knowledge ML"],
        "officialUrl": "https://lu.ma",
        "xHandle": "@DverseAI",
        "isFeatured": True
    },
    {
        "id": "ai-summit-london-2026",
        "title": "The AI Summit London 2026",
        "category": "AI",
        "badge": "Enterprise AI",
        "startDate": "2026-06-10",
        "endDate": "2026-06-11",
        "location": "London, UK",
        "venue": "Tobacco Dock London",
        "description": "The flagship commercial AI summit analyzing tangible enterprise deployment of neural technologies, ethical governance, and next-generation developer tooling across Europe.",
        "topics": ["Enterprise AI", "AI Ethics & Safety", "Generative Workflow", "FinTech AI", "Regulatory Policy"],
        "officialUrl": "https://london.theaisummit.com",
        "xHandle": "@TheAISummit",
        "isFeatured": False
    }
]

def format_date_range(start_str: str, end_str: str) -> str:
    """Formats '2026-09-18' and '2026-09-20' into 'Sep 18 – 20, 2026'."""
    try:
        start_d = datetime.strptime(start_str, "%Y-%m-%d").date()
        end_d = datetime.strptime(end_str, "%Y-%m-%d").date()
        if start_d.month == end_d.month and start_d.year == end_d.year:
            if start_d.day == end_d.day:
                return start_d.strftime("%b %d, %Y")
            return f"{start_d.strftime('%b %d')} – {end_d.strftime('%d, %Y')}"
        return f"{start_d.strftime('%b %d')} – {end_d.strftime('%b %d, %Y')}"
    except Exception:
        return f"{start_str} to {end_str}"

def generate_google_cal_url(event: dict) -> str:
    """Generates a direct one-click Google Calendar add-event URL."""
    try:
        start_dt = event["startDate"].replace("-", "")
        # Add 1 day to end date for all-day event representation in Google Cal
        end_date_obj = datetime.strptime(event["endDate"], "%Y-%m-%d").date()
        # Format end date
        end_dt = end_date_obj.strftime("%Y%m%d")
        
        details = f"{event['description']}\n\nOfficial Website: {event['officialUrl']}\nCurated by dataverse.ai ($DVERSE)"
        venue_loc = f"{event['venue']}, {event['location']}"
        
        base_url = "https://calendar.google.com/calendar/render?action=TEMPLATE"
        params = [
            f"text={quote(event['title'])}",
            f"dates={start_dt}/{end_dt}",
            f"details={quote(details)}",
            f"location={quote(venue_loc)}",
            "sf=true",
            "output=xml"
        ]
        return f"{base_url}&{'&'.join(params)}"
    except Exception:
        return ""

def compute_status_and_days(start_str: str, end_str: str, today: date) -> tuple[str, int]:
    """Computes status label and integer days left until start."""
    try:
        start_d = datetime.strptime(start_str, "%Y-%m-%d").date()
        end_d = datetime.strptime(end_str, "%Y-%m-%d").date()
        
        if start_d <= today <= end_d:
            return "Live Now", 0
        elif today > end_d:
            return "Completed", -(today - end_d).days
        else:
            diff = (start_d - today).days
            if diff <= 7:
                return f"In {diff} Day{'s' if diff > 1 else ''}", diff
            elif diff <= 30:
                return f"In {diff} Days", diff
            else:
                return "Upcoming", diff
    except Exception:
        return "Upcoming", 999

def process_events():
    today = datetime.now(timezone.utc).date()
    processed = []
    
    for ev in CORE_EVENTS:
        status, days_left = compute_status_and_days(ev["startDate"], ev["endDate"], today)
        formatted_date = format_date_range(ev["startDate"], ev["endDate"])
        google_cal = generate_google_cal_url(ev)
        
        item = {
            **ev,
            "status": status,
            "daysLeft": days_left,
            "formattedDate": formatted_date,
            "googleCalendarUrl": google_cal
        }
        processed.append(item)
    
    # Sort chronologically by startDate
    processed.sort(key=lambda x: x["startDate"])
    
    output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "events.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(processed, f, indent=2, ensure_ascii=False)
        f.write("\n")
    
    print(f"Successfully processed {len(processed)} global events -> {output_path}")

if __name__ == "__main__":
    process_events()

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dverse.info"),
  title: "dataverse.ai ($DVERSE) | The World's First Free AI Knowledge Base",
  description:
    "The world's first free AI knowledge base. Democratizing decentralized intelligence for everyone, powered by $DVERSE on dverse.info.",
  keywords: [
    "dataverse",
    "dataverse.ai",
    "Dverse",
    "dverse.info",
    "crypto",
    "AI coin",
    "decentralized AI",
    "web3 AI",
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "dataverse.ai ($DVERSE) — Decentralized Intelligence",
    description:
      "Bridging sovereign data networks with autonomous AI agents. Genesis launch coming soon.",
    url: "https://dverse.info",
    siteName: "dataverse.ai",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "dataverse.ai logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "dataverse.ai ($DVERSE) | Coming Soon",
    description:
      "The Decentralized Intelligence Layer for Autonomous AI. Official portal dverse.info",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-cosmic-950 text-slate-100 antialiased overflow-x-hidden selection:bg-brand-cyan/20 selection:text-brand-sky">
        {children}
      </body>
    </html>
  );
}

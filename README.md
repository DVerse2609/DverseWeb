# dataverse.ai ($DVERSE) — Coming Soon Landing Page

Official landing page and Web3/AI portal for **dataverse.ai ($DVERSE)**, deployed on **dataverse.info**.

Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

---

## 🚀 Features

- **Official Cosmic Gem & Planetary Ring Logo**: Custom levitation animation with dual-orbital counter-rotating rings and glowing radial singularity.
- **Interactive Constellation Particle Canvas**: Dynamic HTML5 canvas network simulating decentralized data nodes and AI agents responding to mouse movement.
- **Real-time Protocol Genesis Countdown**: Real-time ticker counting down to launch.
- **Genesis Whitelist Signup**: Validates and stores early access registrations locally in `localStorage` with feedback states.
- **Bento Feature Grid**: Highlighting Autonomous Agent Economy, Sovereign Data Liquidity, and Confidential ZK-Inference.
- **Tokenomics & Portal Teaser**: $DVERSE ticker specs and 1-click verified domain copy function.
- **Responsive & High Performance**: 100% responsive across mobile, tablet, and widescreen.

---

## 🛠️ Local Development

1. Install dependencies (already completed):
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📦 Production Build

To test the optimized production build:

```bash
npm run build
npm run start
```

---

## 🌐 Deploying to `dataverse.info`

### Option 1: Vercel (Recommended for Next.js)
1. Push this repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Go to **Settings > Domains** in Vercel.
5. Add `dataverse.info` and `www.dataverse.info`.
6. Follow the DNS instructions (add `CNAME` or `A` record provided by Vercel in your domain registrar DNS settings).

### Option 2: Cloudflare Pages / Netlify
1. Connect repository.
2. Build command: `npm run build`
3. Output directory: `.next` (or static export `out` if configured for static export).
4. Assign custom domain `dataverse.info`.

---

## 🧬 Future Roadmap (Expanding to Full Web3 dApp)
Because this project is built on **Next.js (App Router)**, you can seamlessly expand it into the full platform without rewriting:
- Add `@rainbow-me/rainbowkit` and `wagmi` for wallet connection (MetaMask, Phantom, Coinbase).
- Integrate Python (FastAPI) backend endpoints for real-time AI Agent workflows.
- Add Staking and Token Swap pages under `src/app/staking/` and `src/app/swap/`.

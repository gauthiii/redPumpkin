<p align="center">
  <img src="public/pumpkin.png" alt="RedPumpkin logo" width="140" />
</p>

<h1 align="center">RedPumpkin ($RPUM)</h1>

<p align="center"><strong>The angriest coin in the patch.</strong> 🎃🔥</p>

<p align="center">
  <a href="https://gauthiii.github.io/redPumpkin/">🌐 Live Site</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#deployment">Deployment</a>
</p>

---

Official homepage for **RedPumpkin ($RPUM)** — a community-driven meme coin born furious on Solana. The site features full-page 3D scroll animations: content cards flip, tilt, and fly in from depth as you scroll, a spinning 3D gold coin in the hero, parallax floating pumpkins, and mouse-tracking 3D tilt on every card.

## Features

- 🎃 **3D scroll animations** powered by GSAP ScrollTrigger — flip-up, tilt-in, and zoom-from-depth reveals on every section
- 🪙 **3D hero coin** that spins as you scroll, with the RedPumpkin mascot on the front and $RPUM on the back
- 🍂 **Parallax layers** — floating pumpkins drift at different speeds over the painted patch background
- 🖱️ **Interactive tilt cards** that rotate in 3D toward your cursor
- 📋 One-click contract address copy
- 📱 Fully responsive with mobile navigation, respects `prefers-reduced-motion`

## Sections

Hero · Live Stats · Why So Angry? (About) · Pumpkinomics (Tokenomics & Distribution) · How to Buy · Rage Roadmap · Join the Patch (Community) · Footer

## Tech Stack

| | |
|---|---|
| Framework | [React 18](https://react.dev) + [Vite 5](https://vitejs.dev) |
| Animation | [GSAP 3](https://gsap.com) with ScrollTrigger |
| Fonts | Luckiest Guy & Nunito (Google Fonts) |
| Hosting | GitHub Pages via GitHub Actions |

## Getting Started

```bash
# clone
git clone https://github.com/gauthiii/redPumpkin.git
cd redPumpkin

# install
npm install

# run locally → http://localhost:5173
npm run dev

# production build → dist/
npm run build
```

## Deployment

Every push to `main` triggers the [deploy workflow](.github/workflows/deploy.yml), which builds the site and publishes `dist/` to GitHub Pages at **https://gauthiii.github.io/redPumpkin/**.

> Using a custom domain? Change `base: '/redPumpkin/'` to `'/'` in [vite.config.js](vite.config.js).

## Project Structure

```
├── .github/workflows/deploy.yml   # CI/CD → GitHub Pages
├── public/
│   ├── bg.png                     # full-page background art
│   └── pumpkin.png                # transparent mascot / logo / favicon
├── src/
│   ├── App.jsx                    # all sections + GSAP scroll animations
│   ├── index.css                  # theme, 3D styles, responsive rules
│   └── main.jsx
└── index.html
```

## Token Details

> ✅ **Status: live on pump.fun.**

| | |
|---|---|
| Name | RedPumpkin |
| Ticker | $RPUM |
| Chain | Solana |
| Launched via | [pump.fun](https://pump.fun/coin/GAmuNGKczjDUBhUxMQbn5bhDZggcc75WWX6GG6rwpump) (bonding curve) |
| Mint address | `GAmuNGKczjDUBhUxMQbn5bhDZggcc75WWX6GG6rwpump` |
| Total supply | 1,000,000,000 (fixed) |
| Creator holding | **Zero** — no dev buy, no team allocation |
| Mint & freeze authority | Revoked at creation by the pump.fun program |

Verify independently on
[Solana Explorer](https://explorer.solana.com/address/GAmuNGKczjDUBhUxMQbn5bhDZggcc75WWX6GG6rwpump)
or [Solscan](https://solscan.io/token/GAmuNGKczjDUBhUxMQbn5bhDZggcc75WWX6GG6rwpump).

The live values on the site come from the `LAUNCH` config block at the top of
[src/App.jsx](src/App.jsx). Set `graduated: true` there if the bonding curve ever fills and
liquidity migrates to a DEX.

> [LAUNCH.md](LAUNCH.md) describes a *different*, self-minted SPL launch with self-funded
> Raydium liquidity. That plan is **on hold indefinitely** and does not describe the live
> token. [public/metadata.json](public/metadata.json) belongs to that plan and is unused
> today — pump.fun hosts its own token metadata.

## Owner

Created and owned by **Gautham Vijayaraj**.

## Disclaimer

$RPUM is a meme coin created for entertainment and community purposes. It has no intrinsic value and no expectation of financial return. Cryptocurrency is volatile — never invest more than you can afford to lose. Nothing in this repository constitutes financial advice.

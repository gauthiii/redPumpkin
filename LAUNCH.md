# RedPumpkin (RPUM) — End-to-End Launch Plan

> ⏸️ **Status: on hold.** RPUM was instead launched on **pump.fun** as a first experiment —
> mint `GAmuNGKczjDUBhUxMQbn5bhDZggcc75WWX6GG6rwpump`. That launch uses a bonding curve, not
> the self-minted SPL token and self-funded Raydium pool described below, and the creator
> holds none of the supply. This document is retained as a possible future path, not a
> commitment. Nothing in it describes the currently live token.
>
> If this plan is ever revived, add **freeze authority revocation** to the Phase 2 script —
> the original draft only covers mint authority, and Solana risk scanners flag an active
> freeze authority more harshly.

**Prepared for:** Gautham
**Token:** RedPumpkin (RPUM)
**Chain:** Solana (SPL Token)
**Landing Page:** gauthiii.github.io/redPumpkin/
**Total One-Time Cost:** ~$10-13
**Ongoing Cost:** $0/month
**Total Timeline:** ~1 week

---

## 1. Final Spec Sheet

| Item | Value |
|---|---|
| Name | RedPumpkin |
| Ticker | RPUM |
| Chain | Solana (SPL token standard) |
| Total supply | 1,000,000,000 (1 billion), fixed forever |
| Creator holdings | 8% of supply = 80,000,000 RPUM |
| Mint authority | Revoked immediately after mint — no more RPUM can ever be created |
| Trade fees / tax | None — clean, standard, no hidden mechanisms |
| Commission mechanism | None — only upside is the 8% held supply appreciating/depreciating with market price |
| Liquidity pool | Self-funded on Raydium, ~$7-9 in SOL paired with a portion of RPUM supply |
| Landing page | Route added inside existing React/Next/Vite portfolio repo at `/redPumpkin/` |
| Legal posture | No active promotion for profit = lower regulatory risk. Not legal advice — consult a lawyer if you later promote actively |

---

## 2. Why These Choices Were Made

- **Solana over Ethereum/Base:** Transaction costs are cents, not dollars — critical given the sub-$15 budget. Ethereum mainnet gas alone could exceed the entire budget.
- **Fixed supply, mint authority revoked:** This is the single biggest trust signal for any potential buyer. It proves you can never dilute or "rug" holders by minting more later. Verifiable publicly on Solana Explorer.
- **8% creator holdings:** Enough to give you real upside if the token ever gains value, but low enough (below the ~10-15% threshold that experienced buyers distrust) that it won't be flagged as a rug-pull setup.
- **No trade fees/tax:** Simpler contract, less suspicion, matches a "just putting it out there" approach rather than an active money-extraction mechanism.
- **$10 pool:** Chosen deliberately at minimum cost. Understand the tradeoff — this pool will be very thin (low liquidity), meaning:
  - The token will be technically live and tradeable on Raydium.
  - It likely won't appear with a stable price on trackers like DexScreener/Birdeye at this size — some flag or hide extremely small pools.
  - A single $5-10 buy could swing the price 30-50%+.
  - This is acceptable and expected given the goal is "put it out there, no expectations."
  - More SOL can be added to the same pool anytime in the future — no rebuild required, fully flexible.

---

## 3. Phase 1 — Prep

**Cost: $0 | Time: ~1 day**

### Steps:
1. **Install Phantom Wallet** (browser extension or mobile app) — this is your Solana wallet. Free.
2. **Design a logo for RPUM.** Use Canva or similar free tool. Keep it simple, square aspect ratio (works best for token icons across wallets/explorers).
3. **Decide on socials (optional).** If you want an X/Twitter or Telegram presence, create accounts now. This is entirely optional — you can skip this given your "no promotion required" stance.
4. **Prepare token metadata.** Claude Code will scaffold a JSON metadata file containing:
   - Name: RedPumpkin
   - Symbol: RPUM
   - Description: a short one-line description/story for the token
   - Image URI: link to your logo (typically hosted via a metadata service like Metaplex/Arweave, or your own GitHub Pages site)

### Output of this phase:
- A funded-and-ready Phantom wallet (funding happens in Phase 3)
- A logo file ready to use
- A metadata JSON file ready to attach to the mint

---

## 4. Phase 2 — Build & Test on Devnet

**Cost: $0 | Time: ~2-4 days**

Devnet is Solana's free test network — it uses fake SOL, so you can rehearse the entire launch with zero financial risk before doing it for real.

### Steps:
1. **Claude Code writes a Solana script** using `@solana/web3.js` and `@solana/spl-token` libraries that will:
   - Create the RPUM token mint with 1,000,000,000 total supply
   - Transfer 80,000,000 RPUM (8%) to your wallet
   - Transfer the remaining supply to a wallet reserved for the liquidity pool
   - Revoke the mint authority (this is a one-way, permanent action)
2. **Run the entire script on devnet first.** Verify:
   - Total supply is exactly 1,000,000,000
   - Your wallet holds exactly 80,000,000 RPUM
   - Mint authority shows "None" on Solana Explorer (devnet) after revocation
3. **Build the RPUM landing page** as a new route inside your existing React/Next/Vite repository at `/redPumpkin/`. This page will include:
   - Token name, ticker, logo
   - Total supply and tokenomics breakdown (8% creator, rest in liquidity)
   - A link to the mint authority revocation transaction (proof of fixed supply)
   - Contract address (placeholder until mainnet, then updated with the real one)
   - "How to buy" instructions (e.g., how to swap SOL for RPUM on Raydium)
   - A plain disclaimer: no promises of returns, purely a community/meme project
4. **Dry-run the entire sequence end-to-end on devnet** so that mainnet day (Phase 3) has no surprises — every command and script has already been tested.

### Output of this phase:
- A fully tested mint + revoke script, proven on devnet
- A live, tested landing page (pointing to placeholder/devnet data)
- Zero cost incurred

---

## 5. Phase 3 — Mainnet Launch

**Cost: ~$10-13 | Time: ~1 day**

This is the real, irreversible launch using real funds.

### Steps:
1. **Buy SOL.** Purchase approximately $13-15 worth of SOL via an exchange (Coinbase, Kraken, or similar), and transfer it to your Phantom wallet. The small buffer above the $10 minimum accounts for network fee fluctuations so you don't get stranded mid-transaction.
2. **Run the real mint script** (the same one tested in Phase 2, now pointed at mainnet):
   - Mint 1,000,000,000 RPUM
   - Send 80,000,000 RPUM to your wallet
   - Send the rest to the liquidity pool wallet
3. **Revoke mint authority for real.** Immediately after minting — this is the step that makes the supply permanently fixed. Save the transaction link.
4. **Verify on Solana Explorer (mainnet).** Confirm publicly that:
   - Mint Authority = None
   - Total Supply = 1,000,000,000 (exactly, no more possible)
5. **Create the Raydium liquidity pool.** Pair your ~$7-9 in SOL against your allocated RPUM supply for the pool. This is what makes RPUM actually swappable/tradeable.
6. **Update the landing page** with:
   - The real mainnet contract address
   - The real mint-authority-revoked transaction link
   - The real Raydium pool link
7. **Push and deploy** the updated repository so `gauthiii.github.io/redPumpkin/` goes fully live with real, verifiable data.

### Output of this phase:
- RPUM is live on Solana mainnet
- Fixed supply, verifiable publicly
- Technically tradeable via Raydium
- Landing page fully live with real links

---

## 6. Phase 4 — Aftermath (Ongoing, Optional)

**Cost: $0/month | Time: Indefinite, no forced schedule**

### What requires zero further action:
- The token contract runs itself — no servers, no code to maintain, no recurring fees.
- The fixed supply and revoked mint authority mean there's nothing further to "manage" on the technical side.

### What's entirely up to you, whenever you choose:
- **Adding more liquidity later** (e.g., in a year or two): You can add more SOL to the same Raydium pool at any time — no rebuild, no re-mint, no restrictions. This directly supports your plan to fund more later if/when needed.
- **Promotion:** Post about it or don't — no obligation either way, given your stated goal of "just put it out there."
- **Monitoring:** Check the pool/price occasionally if curious, or ignore it entirely.

### Expectation to hold onto:
At the ~$10 pool size, don't expect visibility on price trackers or organic buyer interest initially. That's consistent with your goal — it's live, technically real, and requires nothing further from you unless you choose to invest more time or funds down the line.

---

## 7. Cost Summary

| Item | Cost |
|---|---|
| Token mint transaction | ~$1-2 |
| Revoke mint authority transaction | ~$1 |
| Liquidity pool (your SOL side) | ~$7-9 |
| Logo | $0 (DIY via Canva) |
| Landing page | $0 (built into existing repo) |
| **Total one-time cost** | **~$10-13** |
| **Ongoing/monthly cost** | **$0** |

---

## 8. Timeline Summary

| Phase | Duration | Cost |
|---|---|---|
| Phase 1 — Prep | ~1 day | $0 |
| Phase 2 — Build & Test (Devnet) | ~2-4 days | $0 |
| Phase 3 — Mainnet Launch | ~1 day | ~$10-13 |
| Phase 4 — Aftermath | Ongoing, optional | $0/month |
| **Total to live token** | **~1 week** | **~$10-13** |

---

## 9. Important Notes

- **No returns are guaranteed at any point in this plan.** The 8% creator holding is the only mechanism by which value could accrue to you, and it depends entirely on market activity outside your control.
- **A $10 liquidity pool is intentionally minimal** and will look illiquid to sophisticated buyers or trackers. This is a deliberate tradeoff for near-zero cost, consistent with a "put it out there, no expectations" approach.
- **More funds can be added later** to the same pool at any time — this plan is fully compatible with topping up in a year or two.
- **This is not legal or financial advice.** If you later choose to actively promote RPUM for profit, consult a professional familiar with securities regulation in your jurisdiction, as active promotion changes the risk profile.
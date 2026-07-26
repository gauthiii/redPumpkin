import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PUMPKIN = `${import.meta.env.BASE_URL}pumpkin.png`

/*
 * ─────────────────────────────────────────────────────────────
 *  LAUNCH CONFIG — the only block that needs editing on launch day.
 *  Flip `live` to true and paste the four real values below
 *  (Phase 3, step 6 of LAUNCH.md). Everything else updates itself.
 * ─────────────────────────────────────────────────────────────
 */
const LAUNCH = {
  live: false,
  mintAddress: '',   // e.g. '7xKX...9fPq' — the SPL mint address
  revokeTxUrl: '',   // Solana Explorer link to the mint-authority revocation tx
  freezeTxUrl: '',   // Solana Explorer link to the freeze-authority revocation tx
  poolUrl: '',       // Raydium pool / swap link
}

const REPO_URL = 'https://github.com/gauthiii/redPumpkin'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Tokenomics', href: '#tokenomics' },
  { label: 'Risks', href: '#risks' },
  { label: 'How to Buy', href: '#how-to-buy' },
  { label: 'Roadmap', href: '#roadmap' },
]

const STATS = [
  { value: '1B', label: 'Total Supply' },
  { value: '92%', label: 'To Liquidity' },
  { value: '8%', label: 'Creator Holds' },
  { value: '0%', label: 'Trading Tax' },
]

const TOKENOMICS = [
  {
    icon: '🎃', title: 'Total Supply', value: '1,000,000,000',
    desc: 'One billion $RPUM, minted once and fixed forever. Not one pumpkin more.',
  },
  {
    icon: '🔒', title: 'Mint Authority', value: 'Revoked',
    desc: 'Revoked immediately after the mint, along with freeze authority. Nobody — including the creator — can ever create more RPUM or freeze your wallet. Verifiable on Solana Explorer.',
  },
  {
    icon: '🚫', title: 'Trading Tax', value: '0% / 0%',
    desc: 'No buy tax, no sell tax, no hidden mechanism in the token. (Raydium charges its own standard swap fee — that goes to the exchange, not to us.)',
  },
  {
    icon: '🙋', title: 'Creator Holds', value: '8%',
    desc: '80,000,000 RPUM held by Gautham Vijayaraj — disclosed upfront. That is the only way value could ever accrue to the creator. No other allocation exists.',
  },
]

const DISTRIBUTION = [
  { label: 'Liquidity Pool', pct: 92, note: 'paired with SOL on Raydium' },
  { label: 'Creator (Gautham Vijayaraj)', pct: 8, note: 'disclosed, no lock-up theatre' },
]

const RISKS = [
  {
    icon: '💧', title: 'The liquidity pool is tiny — about $7–9',
    desc: 'This is deliberate: the entire launch budget is roughly $13. It means RPUM is genuinely tradeable, but barely liquid.',
  },
  {
    icon: '📉', title: 'A single $5–10 trade could move the price 30–50%',
    desc: 'At this pool size, slippage is severe. Use a high slippage tolerance and expect wild swings on almost no volume.',
  },
  {
    icon: '👻', title: 'It may not show up on price trackers',
    desc: 'DexScreener, Birdeye and similar tools often hide or flag pools this small. Do not be surprised if there is no chart.',
  },
  {
    icon: '🤷', title: 'There is no plan to make you money',
    desc: 'No marketing budget, no exchange listings, no promotion campaign. RPUM exists because it was fun to build. That is the entire pitch.',
  },
]

const BUY_STEPS = [
  { num: '01', title: 'Get a Wallet', desc: 'Install Phantom or Solflare, create a Solana wallet, and guard the seed phrase like a pumpkin guards its patch. Nobody legitimate will ever ask you for it.' },
  { num: '02', title: 'Add Some SOL', desc: 'Buy SOL on any exchange and send it to your wallet. You only need a tiny amount — and please treat whatever you spend as money you are fine losing.' },
  { num: '03', title: 'Swap on Raydium', desc: 'Paste the official mint address below into Raydium or Jupiter and swap. Raise your slippage tolerance — the pool is thin, so a normal 1% setting will simply fail.' },
  { num: '04', title: 'That’s It', desc: 'Hold it, sell it, or forget about it entirely. There is no staking, no rewards programme and no obligation. The pumpkin does not chase you.' },
]

const ROADMAP = [
  {
    phase: 'Phase 1', title: 'Prep', status: 'active', cost: '$0 · ~1 day',
    items: ['Set up Phantom wallet', 'Finalise the RPUM logo', 'Write token metadata JSON', 'Decide whether socials are worth it'],
  },
  {
    phase: 'Phase 2', title: 'Build & Test on Devnet', status: 'active', cost: '$0 · ~2–4 days',
    items: ['This landing page — live ✔', 'Write the mint script (@solana/web3.js + spl-token)', 'Full dry run on devnet with fake SOL', 'Verify supply = 1B and authorities revoked'],
  },
  {
    phase: 'Phase 3', title: 'Mainnet Launch', status: 'next', cost: '~$10–13 · ~1 day',
    items: ['Mint 1,000,000,000 RPUM for real', 'Send 8% to creator wallet, 92% toward liquidity', 'Revoke mint + freeze authority permanently', 'Open the Raydium pool with ~$7–9 in SOL', 'Publish the real address and proof links here'],
  },
  {
    phase: 'Phase 4', title: 'Aftermath', status: 'next', cost: '$0/month · indefinite',
    items: ['Nothing to maintain — no servers, no fees', 'More liquidity can be added anytime, if ever', 'No promotion promised, none required', 'No listings, staking, NFTs or merch planned'],
  },
]

const LINKS = [
  { icon: '💻', name: 'Source Code', handle: 'github.com/gauthiii/redPumpkin', href: REPO_URL },
  { icon: '📄', name: 'Launch Plan', handle: 'Read LAUNCH.md', href: `${REPO_URL}/blob/main/LAUNCH.md` },
  { icon: '🔍', name: 'Solana Explorer', handle: LAUNCH.live ? 'Verify the mint' : 'Available at launch', href: LAUNCH.live ? `https://explorer.solana.com/address/${LAUNCH.mintAddress}` : null },
  { icon: '𝕏', name: 'Socials', handle: 'None yet — maybe never', href: null },
]

function useScrollAnimations(rootRef) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Generic 3D fly-in for every element tagged data-fx
      gsap.utils.toArray('[data-fx]').forEach((el) => {
        const kind = el.dataset.fx
        const from =
          kind === 'flip-up'
            ? { opacity: 0, rotationX: -65, y: 90, z: -220, transformPerspective: 900 }
            : kind === 'tilt-left'
            ? { opacity: 0, rotationY: 45, x: -110, z: -180, transformPerspective: 900 }
            : kind === 'tilt-right'
            ? { opacity: 0, rotationY: -45, x: 110, z: -180, transformPerspective: 900 }
            : kind === 'zoom-deep'
            ? { opacity: 0, scale: 0.55, z: -420, rotationX: 18, transformPerspective: 900 }
            : { opacity: 0, y: 70, z: -120, transformPerspective: 900 }

        gsap.fromTo(el, from, {
          opacity: 1, x: 0, y: 0, z: 0, scale: 1, rotationX: 0, rotationY: 0,
          duration: 1,
          ease: 'power3.out',
          delay: (parseInt(el.dataset.fxDelay, 10) || 0) / 1000,
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        })
      })

      // Hero coin: spins as you scroll away
      gsap.to('.coin-inner', {
        rotationY: 720,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      })
      gsap.to('.hero-content', {
        z: -300, opacity: 0, scale: 0.9,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 25%', scrub: true },
      })

      // Floating background pumpkins drift at different parallax speeds
      gsap.utils.toArray('.float-pumpkin').forEach((el, i) => {
        gsap.to(el, {
          y: -220 - i * 90,
          rotation: i % 2 === 0 ? 180 : -180,
          ease: 'none',
          scrollTrigger: { trigger: document.body, start: 'top top', end: 'max', scrub: 1.5 + i * 0.3 },
        })
      })

      // Roadmap spine grows as you scroll through it
      gsap.fromTo('.roadmap-line-fill', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        transformOrigin: 'top center',
        scrollTrigger: { trigger: '.roadmap-grid', start: 'top 75%', end: 'bottom 60%', scrub: true },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [rootRef])
}

function TiltCard({ className = '', children, ...rest }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    gsap.to(el, { rotationY: px * 16, rotationX: -py * 16, z: 30, transformPerspective: 700, duration: 0.4, ease: 'power2.out' })
  }
  const onLeave = () => {
    gsap.to(ref.current, { rotationX: 0, rotationY: 0, z: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
  }

  return (
    <div ref={ref} className={`tilt-card ${className}`} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      {children}
    </div>
  )
}

export default function App() {
  const rootRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useScrollAnimations(rootRef)

  const copyContract = async () => {
    if (!LAUNCH.live) return
    try {
      await navigator.clipboard.writeText(LAUNCH.mintAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div ref={rootRef}>
      {/* Fixed painted background + readability overlay */}
      <div className="bg-image" aria-hidden="true" />
      <div className="bg-overlay" aria-hidden="true" />

      {/* Parallax floating pumpkins */}
      <div className="float-layer" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <img key={i} src={PUMPKIN} alt="" className={`float-pumpkin fp-${i + 1}`} />
        ))}
      </div>

      {/* ─── Navbar ─── */}
      <header className="navbar">
        <a href="#top" className="nav-brand">
          <img src={PUMPKIN} alt="RedPumpkin logo" className="nav-logo" />
          <span className="nav-title">
            Red<span className="accent">Pumpkin</span> <span className="ticker">$RPUM</span>
          </span>
        </a>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
        </nav>
        <div className="nav-right">
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
            {LAUNCH.live ? 'Source' : 'Follow Along'}
          </a>
          <button className="nav-burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">☰</button>
        </div>
      </header>

      <main id="top">
        {/* ─── Hero ─── */}
        <section className="hero">
          <div className="hero-content">
            <div className="coin-wrap" data-fx="zoom-deep">
              <div className="coin-inner">
                <div className="coin-face coin-front">
                  <img src={PUMPKIN} alt="RedPumpkin coin" />
                </div>
                <div className="coin-face coin-back">
                  <span className="coin-back-text">RPUM</span>
                </div>
              </div>
              <div className="coin-shadow" />
            </div>

            {!LAUNCH.live && (
              <span className="status-badge" data-fx="flip-up">
                <span className="status-dot" /> Not launched yet — in development
              </span>
            )}

            <h1 className="hero-title" data-fx="flip-up">
              RED<span className="accent">PUMPKIN</span>
            </h1>
            <p className="hero-tagline" data-fx="flip-up" data-fx-delay="120">
              The <strong>angriest coin</strong> in the patch. 🎃🔥
            </p>
            <p className="hero-sub" data-fx="flip-up" data-fx-delay="220">
              A small, honest meme coin coming to Solana. Fixed supply of one billion,
              zero trading tax, mint authority revoked on day one — and absolutely no
              promises about making anyone rich. It exists because it was fun to build.
            </p>

            <div className="hero-ctas" data-fx="flip-up" data-fx-delay="320">
              <a href="#tokenomics" className="btn btn-primary">🎃 See the Token Design</a>
              <a href="#risks" className="btn btn-ghost">Read the Risks First</a>
            </div>

            <button
              className={`contract-chip ${LAUNCH.live ? '' : 'pending'}`}
              data-fx="flip-up"
              data-fx-delay="420"
              onClick={copyContract}
              disabled={!LAUNCH.live}
              title={LAUNCH.live ? 'Copy mint address' : 'Published once the token is minted'}
            >
              <span className="chip-label">MINT:</span>
              <span className="chip-address">
                {LAUNCH.live ? LAUNCH.mintAddress : 'Published here the moment it goes live on mainnet'}
              </span>
              {LAUNCH.live && <span className="chip-copy">{copied ? '✅ Copied!' : '📋 Copy'}</span>}
            </button>
          </div>

          <div className="scroll-hint" aria-hidden="true">
            <span>Scroll into the patch</span>
            <span className="scroll-arrow">▼</span>
          </div>
        </section>

        {/* ─── Stats bar ─── */}
        <section className="stats">
          {STATS.map((s, i) => (
            <div className="stat" data-fx="flip-up" data-fx-delay={i * 100} key={s.label}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </section>

        {/* ─── About ─── */}
        <section id="about" className="section">
          <h2 className="section-title" data-fx="flip-up">Why So <span className="accent">Angry?</span></h2>
          <div className="about-grid">
            <div className="about-art" data-fx="tilt-left">
              <img src={PUMPKIN} alt="The angry RedPumpkin mascot" />
            </div>
            <div className="about-text" data-fx="tilt-right">
              <p>
                Deep in a sunny autumn patch grew one pumpkin that never got picked.
                Passed over every harvest, watered with pure spite, it turned
                <strong> furious red</strong> — and decided that if the world wouldn't
                choose it, it would take over the world's blockchains instead.
              </p>
              <p>
                That's the fun part. Here's the honest part: <strong>RedPumpkin ($RPUM)</strong> is
                a personal project by <strong>Gautham Vijayaraj</strong>, launched on Solana for
                roughly the price of a sandwich. There's no team, no fundraise, no marketing
                budget and no roadmap full of things that will never ship. One angry vegetable,
                a fixed supply, and a very small pool of liquidity.
              </p>
              <ul className="about-list">
                <li>🎃 Fixed supply — 1,000,000,000, mint authority revoked at launch</li>
                <li>🙋 Creator holds 8% — stated openly, no hidden wallets</li>
                <li>💧 Everything else goes to liquidity — no marketing bag, no vesting</li>
                <li>⚡ Built on Solana — because fees are cents, not dollars</li>
                <li>🤷 No promotion, no promises — it just exists</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ─── Tokenomics ─── */}
        <section id="tokenomics" className="section">
          <h2 className="section-title" data-fx="flip-up">Pumpkin<span className="accent">omics</span></h2>
          <p className="section-sub" data-fx="flip-up" data-fx-delay="100">
            {LAUNCH.live
              ? 'Simple, transparent, and verifiable on-chain. Exactly how the pumpkin likes it.'
              : 'This is the planned design. Nothing below exists on-chain yet — RPUM has not been minted.'}
          </p>

          <div className="token-grid">
            {TOKENOMICS.map((t, i) => (
              <TiltCard className="token-card" data-fx={i % 2 === 0 ? 'tilt-left' : 'tilt-right'} data-fx-delay={i * 90} key={t.title}>
                <span className="token-icon">{t.icon}</span>
                <h3>{t.title}</h3>
                <span className="token-value">{t.value}</span>
                <p>{t.desc}</p>
              </TiltCard>
            ))}
          </div>

          <div className="dist-card" data-fx="zoom-deep">
            <h3>Token Distribution</h3>
            {DISTRIBUTION.map((d) => (
              <div className="dist-row" key={d.label}>
                <span className="dist-label">
                  {d.label}
                  <small>{d.note}</small>
                </span>
                <div className="dist-bar">
                  <div className="dist-fill" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="dist-pct">{d.pct}%</span>
              </div>
            ))}

            <div className="proof-links">
              {LAUNCH.live ? (
                <>
                  <a href={LAUNCH.revokeTxUrl} target="_blank" rel="noreferrer" className="proof-link">
                    🔒 Mint authority revoked — view transaction
                  </a>
                  <a href={LAUNCH.freezeTxUrl} target="_blank" rel="noreferrer" className="proof-link">
                    🧊 Freeze authority revoked — view transaction
                  </a>
                  <a href={LAUNCH.poolUrl} target="_blank" rel="noreferrer" className="proof-link">
                    💧 Raydium liquidity pool
                  </a>
                </>
              ) : (
                <span className="proof-pending">
                  🔗 Proof links — mint address, authority-revocation transactions and the
                  Raydium pool — will be published here at launch so anyone can verify all
                  of the above on Solana Explorer. Until then, take none of it on faith.
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ─── Risks ─── */}
        <section id="risks" className="section">
          <h2 className="section-title" data-fx="flip-up">Read This <span className="accent">First</span></h2>
          <p className="section-sub" data-fx="flip-up" data-fx-delay="100">
            Most coin sites bury this. The pumpkin would rather shout it at you.
          </p>
          <div className="risk-grid">
            {RISKS.map((r, i) => (
              <TiltCard className="risk-card" data-fx="flip-up" data-fx-delay={i * 100} key={r.title}>
                <span className="risk-icon">{r.icon}</span>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </TiltCard>
            ))}
          </div>
          <p className="risk-footnote" data-fx="flip-up">
            <strong>Never spend more than you are completely fine losing.</strong> $RPUM is a
            meme coin with no intrinsic value, no revenue, and no mechanism designed to
            return anything to holders. Nothing here is financial advice.
          </p>
        </section>

        {/* ─── How to Buy ─── */}
        <section id="how-to-buy" className="section">
          <h2 className="section-title" data-fx="flip-up">How to <span className="accent">Buy</span></h2>
          <p className="section-sub" data-fx="flip-up" data-fx-delay="100">
            {LAUNCH.live
              ? 'Four steps — but only after you have read the risks above.'
              : 'Not tradeable yet. Here is how it will work once the pool is open.'}
          </p>
          <div className="steps-grid">
            {BUY_STEPS.map((s, i) => (
              <TiltCard className="step-card" data-fx="flip-up" data-fx-delay={i * 120} key={s.num}>
                <span className="step-num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* ─── Roadmap ─── */}
        <section id="roadmap" className="section">
          <h2 className="section-title" data-fx="flip-up">Launch <span className="accent">Plan</span></h2>
          <p className="section-sub" data-fx="flip-up" data-fx-delay="100">
            The whole thing, start to finish, for about $13. No phase five where we promise
            you a metaverse.
          </p>
          <div className="roadmap-grid">
            <div className="roadmap-line"><div className="roadmap-line-fill" /></div>
            {ROADMAP.map((r, i) => (
              <div className={`roadmap-item ${i % 2 === 0 ? 'left' : 'right'}`} data-fx={i % 2 === 0 ? 'tilt-left' : 'tilt-right'} key={r.phase}>
                <TiltCard className={`roadmap-card status-${r.status}`}>
                  <span className="roadmap-phase">{r.phase} · {r.cost}</span>
                  <h3>{r.title}</h3>
                  <ul>
                    {r.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <span className="roadmap-status">
                    {r.status === 'done' ? '✅ Complete' : r.status === 'active' ? '🔨 In Progress' : '⏳ Not Started'}
                  </span>
                </TiltCard>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Links ─── */}
        <section id="community" className="section">
          <h2 className="section-title" data-fx="flip-up">Check the <span className="accent">Receipts</span></h2>
          <p className="section-sub" data-fx="flip-up" data-fx-delay="100">
            There's no Telegram to shill in. There is, however, source code you can read.
          </p>
          <div className="social-grid">
            {LINKS.map((s, i) =>
              s.href ? (
                <a href={s.href} target="_blank" rel="noreferrer" key={s.name} data-fx="flip-up" data-fx-delay={i * 100}>
                  <TiltCard className="social-card">
                    <span className="social-icon">{s.icon}</span>
                    <h3>{s.name}</h3>
                    <span className="social-handle">{s.handle}</span>
                  </TiltCard>
                </a>
              ) : (
                <div key={s.name} data-fx="flip-up" data-fx-delay={i * 100}>
                  <div className="social-card disabled">
                    <span className="social-icon">{s.icon}</span>
                    <h3>{s.name}</h3>
                    <span className="social-handle">{s.handle}</span>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="cta-banner" data-fx="zoom-deep">
            <img src={PUMPKIN} alt="" className="cta-pumpkin" />
            <h3>The pumpkin is still angry.</h3>
            <p>
              It's just not for sale yet — and when it is, it won't be begging.
              Watch the repo if you want to see how a $13 token gets built.
            </p>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="btn btn-primary">💻 View the Source</a>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <img src={PUMPKIN} alt="RedPumpkin" className="nav-logo" />
            <div>
              <span className="nav-title">Red<span className="accent">Pumpkin</span></span>
              <p className="footer-owner">Created by <strong>Gautham Vijayaraj</strong></p>
            </div>
          </div>
          <nav className="footer-links">
            {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </nav>
        </div>
        <p className="footer-disclaimer">
          <strong>Disclaimer.</strong> $RPUM is a meme coin created for entertainment purposes.
          It has no intrinsic value, no underlying business, and no expectation of financial
          return. The creator, Gautham Vijayaraj, holds 8% of the total supply — this is
          disclosed openly and is the only mechanism by which value could accrue to him.
          Initial liquidity is intentionally minimal (roughly $7–9), so the price is extremely
          volatile and a single small trade can move it dramatically. Nothing on this site is
          financial, investment, or legal advice. Never spend more than you can afford to lose
          entirely, and always verify the mint address on Solana Explorer before trading.
        </p>
        <p className="footer-copy">© 2026 RedPumpkin ($RPUM) · Gautham Vijayaraj · All rage reserved.</p>
      </footer>
    </div>
  )
}

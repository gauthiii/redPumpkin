import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PUMPKIN = `${import.meta.env.BASE_URL}pumpkin.png`

/*
 * ─────────────────────────────────────────────────────────────
 *  LAUNCH CONFIG — RPUM is live on pump.fun.
 *  `graduated` flips to true if/when the bonding curve fills and
 *  liquidity migrates to a DEX (pump.fun burns the LP automatically).
 * ─────────────────────────────────────────────────────────────
 */
const MINT = 'GAmuNGKczjDUBhUxMQbn5bhDZggcc75WWX6GG6rwpump'

const LAUNCH = {
  live: true,
  graduated: false,
  mintAddress: MINT,
  pumpFunUrl: `https://pump.fun/coin/${MINT}`,
  explorerUrl: `https://explorer.solana.com/address/${MINT}`,
  solscanUrl: `https://solscan.io/token/${MINT}`,
}

const REPO_URL = 'https://github.com/gauthiii/redPumpkin'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Tokenomics', href: '#tokenomics' },
  { label: 'Risks', href: '#risks' },
  { label: 'How to Buy', href: '#how-to-buy' },
  { label: 'Status', href: '#roadmap' },
]

const STATS = [
  { value: '1B', label: 'Total Supply' },
  { value: '0%', label: 'Creator Holds' },
  { value: 'Revoked', label: 'Mint & Freeze' },
  { value: 'pump.fun', label: 'Launched On' },
]

const TOKENOMICS = [
  {
    icon: '🎃', title: 'Total Supply', value: '1,000,000,000',
    desc: 'The pump.fun standard — one billion RPUM, created once. The supply is fixed and cannot grow.',
  },
  {
    icon: '🔒', title: 'Mint & Freeze', value: 'Revoked',
    desc: 'Both authorities are revoked by the pump.fun program at creation. Nobody — creator included — can mint more RPUM or freeze your wallet. Check it yourself on Solana Explorer.',
  },
  {
    icon: '🙅', title: 'Creator Holds', value: 'Zero',
    desc: 'Gautham Vijayaraj bought none of the supply at launch. No dev bag, no team allocation, no reserve wallet. Every RPUM in existence was bought by someone on the open market.',
  },
  {
    icon: '📈', title: 'Distribution', value: 'Bonding Curve',
    desc: 'No pre-sale and no allocations. Everyone buys from the same curve at the same price at the same moment — the price rises as people buy and falls as they sell.',
  },
]

const RISKS = [
  {
    icon: '💀', title: 'Almost every pump.fun coin goes to zero',
    desc: 'The overwhelming majority never fill their bonding curve and end up worthless. Assume by default that RPUM will be one of them.',
  },
  {
    icon: '🎢', title: 'The price can move violently',
    desc: 'On a bonding curve, small trades move the price a lot, and whoever bought earliest has a much lower cost basis than you do. Anyone can sell at any moment.',
  },
  {
    icon: '🚧', title: 'There is no product behind this',
    desc: 'No revenue, no utility, no team, no treasury, no staking, no listings planned. RPUM is an angry cartoon vegetable on the internet — nothing more.',
  },
  {
    icon: '🧪', title: 'This is an experiment, not a business',
    desc: 'It was launched to learn how pump.fun works. There is no marketing budget and no obligation on the creator to do anything further — ever.',
  },
]

const BUY_STEPS = [
  { num: '01', title: 'Get a Wallet', desc: 'Install Phantom or Solflare and create a Solana wallet. Guard the seed phrase like a pumpkin guards its patch — nobody legitimate will ever ask you for it.' },
  { num: '02', title: 'Add Some SOL', desc: 'Buy SOL on any exchange and send it to your wallet. You need very little — and treat whatever you spend as money you are completely fine never seeing again.' },
  { num: '03', title: 'Buy on pump.fun', desc: 'Open the RPUM page on pump.fun, connect your wallet, and swap SOL for RPUM. Always check the mint address matches the one on this page before you trade.' },
  { num: '04', title: 'That’s It', desc: 'Hold it, sell it, or forget it exists. There is no staking, no rewards, no roadmap and no obligation. The pumpkin does not chase you.' },
]

const STATUS_ITEMS = [
  {
    icon: '✅', title: 'Live on pump.fun', state: 'now',
    desc: 'RPUM was launched on pump.fun as an experiment. It trades on a bonding curve right now, with mint and freeze authority already revoked and zero creator holding.',
  },
  {
    icon: '💧', title: 'If the curve fills', state: 'maybe',
    desc: 'Should enough buying happen, pump.fun automatically migrates the liquidity to a DEX and burns the LP tokens. That is handled by the platform — it requires nothing from the creator, and it may well never happen.',
  },
  {
    icon: '🛠️', title: 'A self-minted token, maybe, someday', state: 'maybe',
    desc: 'There is a written plan in the repo for launching an independent SPL token with self-funded liquidity. It is on hold indefinitely and is not a promise. If it ever happens, it will be announced here.',
  },
  {
    icon: '🚫', title: 'Things that are not planned', state: 'never',
    desc: 'No exchange listings, no staking, no NFT collection, no merch store, no payments integration, no utility. If you see anyone promising those for RPUM, they do not speak for this project.',
  },
]

const LINKS = [
  { icon: '🚀', name: 'Trade on pump.fun', handle: 'Official coin page', href: LAUNCH.pumpFunUrl },
  { icon: '🔍', name: 'Solana Explorer', handle: 'Verify the mint', href: LAUNCH.explorerUrl },
  { icon: '📊', name: 'Solscan', handle: 'Supply & holders', href: LAUNCH.solscanUrl },
  { icon: '💻', name: 'Source Code', handle: 'This whole website', href: REPO_URL },
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
          <a href={LAUNCH.pumpFunUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
            Trade on pump.fun
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

            <span className="status-badge live" data-fx="flip-up">
              <span className="status-dot" /> Live on pump.fun
            </span>

            <h1 className="hero-title" data-fx="flip-up">
              RED<span className="accent">PUMPKIN</span>
            </h1>
            <p className="hero-tagline" data-fx="flip-up" data-fx-delay="120">
              The <strong>angriest coin</strong> in the patch. 🎃🔥
            </p>
            <p className="hero-sub" data-fx="flip-up" data-fx-delay="220">
              A meme coin on Solana, launched on pump.fun. One billion supply, mint and
              freeze authority revoked, and <strong>zero held by the creator</strong> — no
              dev bag, no team allocation. It exists because it was fun to build, and for
              no other reason.
            </p>

            <div className="hero-ctas" data-fx="flip-up" data-fx-delay="320">
              <a href={LAUNCH.pumpFunUrl} target="_blank" rel="noreferrer" className="btn btn-primary">🚀 Trade on pump.fun</a>
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
                a personal experiment by <strong>Gautham Vijayaraj</strong>, launched on pump.fun
                to learn how a Solana meme coin launch actually works. There's no team, no
                fundraise, no marketing budget, and no roadmap full of things that will never
                ship. One angry vegetable and a bonding curve.
              </p>
              <ul className="about-list">
                <li>🎃 Fixed supply — 1,000,000,000 RPUM, it cannot grow</li>
                <li>🙅 Creator holds zero — no dev buy, no reserve wallet</li>
                <li>🔒 Mint & freeze authority revoked at creation</li>
                <li>📈 Fair bonding curve — no pre-sale, no allocations</li>
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
            <h3>Verify Everything Yourself</h3>
            <p className="verify-intro">
              Don't take any of it on faith — the mint address is public and every claim
              above is checkable on-chain in about thirty seconds.
            </p>
            <div className="mint-row">
              <span className="mint-label">Mint address</span>
              <code className="mint-code">{LAUNCH.mintAddress}</code>
              <button className="mint-copy" onClick={copyContract}>
                {copied ? '✅ Copied' : '📋 Copy'}
              </button>
            </div>
            <div className="proof-links">
              <a href={LAUNCH.explorerUrl} target="_blank" rel="noreferrer" className="proof-link">
                🔍 Solana Explorer — confirm mint &amp; freeze authority show “None”
              </a>
              <a href={LAUNCH.solscanUrl} target="_blank" rel="noreferrer" className="proof-link">
                📊 Solscan — inspect total supply and the full holder list
              </a>
              <a href={LAUNCH.pumpFunUrl} target="_blank" rel="noreferrer" className="proof-link">
                🚀 pump.fun — the official coin page, chart and trade history
              </a>
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

        {/* ─── Where things stand ─── */}
        <section id="roadmap" className="section">
          <h2 className="section-title" data-fx="flip-up">Where Things <span className="accent">Stand</span></h2>
          <p className="section-sub" data-fx="flip-up" data-fx-delay="100">
            Not a roadmap. Roadmaps are promises, and this project doesn't make any.
          </p>
          <div className="roadmap-grid">
            <div className="roadmap-line"><div className="roadmap-line-fill" /></div>
            {STATUS_ITEMS.map((r, i) => (
              <div className={`roadmap-item ${i % 2 === 0 ? 'left' : 'right'}`} data-fx={i % 2 === 0 ? 'tilt-left' : 'tilt-right'} key={r.title}>
                <TiltCard className={`roadmap-card state-${r.state}`}>
                  <span className="roadmap-phase">
                    {r.state === 'now' ? 'Right now' : r.state === 'maybe' ? 'Possible, not promised' : 'Not happening'}
                  </span>
                  <h3><span className="status-emoji">{r.icon}</span> {r.title}</h3>
                  <p className="status-desc">{r.desc}</p>
                </TiltCard>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Links ─── */}
        <section id="community" className="section">
          <h2 className="section-title" data-fx="flip-up">Check the <span className="accent">Receipts</span></h2>
          <p className="section-sub" data-fx="flip-up" data-fx-delay="100">
            There's no Telegram to shill in. There is, however, a public blockchain.
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
            <h3>The pumpkin is angry. It is not desperate.</h3>
            <p>
              Buy it, don't buy it — it will scowl either way. Just read the risks first
              and never spend money you'd miss.
            </p>
            <a href={LAUNCH.pumpFunUrl} target="_blank" rel="noreferrer" className="btn btn-primary">🚀 View on pump.fun</a>
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
          It has no intrinsic value, no underlying business, no utility, and no expectation of
          financial return. It was launched on pump.fun as a personal experiment; the creator,
          Gautham Vijayaraj, holds none of the supply and receives nothing from it. Meme coins
          are extremely volatile and the overwhelming majority lose essentially all of their
          value — you should assume RPUM will too. Nothing on this site is financial, investment,
          or legal advice. Never spend more than you can afford to lose entirely, and always
          verify the mint address above on Solana Explorer before trading, as impostor tokens
          are common.
        </p>
        <p className="footer-copy">© 2026 RedPumpkin ($RPUM) · Gautham Vijayaraj · All rage reserved.</p>
      </footer>
    </div>
  )
}

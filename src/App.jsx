import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CONTRACT = 'RPUMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
const PUMPKIN = `${import.meta.env.BASE_URL}pumpkin.png`

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Tokenomics', href: '#tokenomics' },
  { label: 'How to Buy', href: '#how-to-buy' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Community', href: '#community' },
]

const STATS = [
  { value: '1B', label: 'Total Supply' },
  { value: '0/0', label: 'Buy / Sell Tax' },
  { value: '100%', label: 'LP Burned' },
  { value: '12,400+', label: 'Angry Holders' },
]

const TOKENOMICS = [
  { icon: '🎃', title: 'Total Supply', value: '1,000,000,000', desc: 'One billion $RPUM. No mint function — not one pumpkin more, ever.' },
  { icon: '🔥', title: 'LP Burned', value: '100%', desc: 'The liquidity pool is burned to ash. Nobody can pull the rug out of this patch.' },
  { icon: '🚫', title: 'Zero Tax', value: '0% / 0%', desc: 'No buy tax, no sell tax. What you trade is what you get. The pumpkin hates fees.' },
  { icon: '🔑', title: 'Renounced', value: 'Ownership', desc: 'Contract ownership renounced. The code is final — the community runs the patch.' },
]

const DISTRIBUTION = [
  { label: 'Liquidity Pool', pct: 80 },
  { label: 'Community & Airdrops', pct: 10 },
  { label: 'Marketing & CEX Listings', pct: 7 },
  { label: 'Team (12-month lock)', pct: 3 },
]

const BUY_STEPS = [
  { num: '01', title: 'Get a Wallet', desc: 'Download Phantom or Solflare, create a wallet, and guard your seed phrase like a pumpkin guards its patch.' },
  { num: '02', title: 'Load Up on SOL', desc: 'Buy SOL on any major exchange and send it to your wallet. That is your ticket into the patch.' },
  { num: '03', title: 'Swap for $RPUM', desc: 'Head to Raydium or Jupiter, paste the official RPUM contract address, and swap your SOL.' },
  { num: '04', title: 'Join the Rage', desc: 'HODL your pumpkins, join the community, and get angry about everything except your portfolio.' },
]

const ROADMAP = [
  {
    phase: 'Phase 1', title: 'Seed of Rage', status: 'done',
    items: ['Token launch on Solana', 'Website & socials live', 'LP burned, ownership renounced', '1,000 angry holders'],
  },
  {
    phase: 'Phase 2', title: 'Sprouting Fury', status: 'active',
    items: ['CoinGecko & CoinMarketCap listings', 'Meme contest & community airdrops', '10,000 holders', 'First CEX listing'],
  },
  {
    phase: 'Phase 3', title: 'Full Bloom Anger', status: 'next',
    items: ['RPUM staking — grow your patch', 'NFT collection: The Furious Harvest', 'Major CEX listings', '100,000 holders'],
  },
  {
    phase: 'Phase 4', title: 'Pumpkin Domination', status: 'next',
    items: ['RedPumpkin merch store', 'Charity: fund real pumpkin farms', 'RPUM payments integration', 'The angriest coin on Earth'],
  },
]

const SOCIALS = [
  { icon: '𝕏', name: 'Twitter / X', handle: '@RedPumpkinRPUM', href: 'https://x.com' },
  { icon: '✈️', name: 'Telegram', handle: 't.me/RedPumpkinRPUM', href: 'https://telegram.org' },
  { icon: '👾', name: 'Discord', handle: 'discord.gg/rpum', href: 'https://discord.com' },
  { icon: '📈', name: 'DEXScreener', handle: 'Live Chart', href: 'https://dexscreener.com' },
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
    try {
      await navigator.clipboard.writeText(CONTRACT)
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
          <a href="#how-to-buy" className="btn btn-primary btn-sm">Buy $RPUM</a>
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

            <h1 className="hero-title" data-fx="flip-up">
              RED<span className="accent">PUMPKIN</span>
            </h1>
            <p className="hero-tagline" data-fx="flip-up" data-fx-delay="120">
              The <strong>angriest coin</strong> in the patch. 🎃🔥
            </p>
            <p className="hero-sub" data-fx="flip-up" data-fx-delay="220">
              Born furious on Solana. Zero taxes, burned liquidity, and a community
              that rages 24/7. $RPUM isn't just a meme — it's a mood.
            </p>

            <div className="hero-ctas" data-fx="flip-up" data-fx-delay="320">
              <a href="#how-to-buy" className="btn btn-primary">🚀 Buy $RPUM Now</a>
              <a href="#community" className="btn btn-ghost">Join the Patch</a>
            </div>

            <button className="contract-chip" data-fx="flip-up" data-fx-delay="420" onClick={copyContract} title="Copy contract address">
              <span className="chip-label">CA:</span>
              <span className="chip-address">{CONTRACT}</span>
              <span className="chip-copy">{copied ? '✅ Copied!' : '📋 Copy'}</span>
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
                <strong>RedPumpkin ($RPUM)</strong> is a 100% community-driven meme coin
                on Solana. No VCs, no insiders, no pre-sale games. Just one very angry
                vegetable, burned liquidity, renounced ownership, and a patch full of
                holders who channel their rage into diamond hands.
              </p>
              <ul className="about-list">
                <li>😡 Fair launch — everyone starts in the same patch</li>
                <li>🔥 Liquidity burned forever — the rug is physically impossible</li>
                <li>🤝 Community-owned — the pumpkin answers to no one</li>
                <li>⚡ Built on Solana — fast, cheap, and furious</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ─── Tokenomics ─── */}
        <section id="tokenomics" className="section">
          <h2 className="section-title" data-fx="flip-up">Pumpkin<span className="accent">omics</span></h2>
          <p className="section-sub" data-fx="flip-up" data-fx-delay="100">
            Simple, transparent, and impossible to rug. Exactly how the pumpkin likes it.
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
                <span className="dist-label">{d.label}</span>
                <div className="dist-bar">
                  <div className="dist-fill" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="dist-pct">{d.pct}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── How to Buy ─── */}
        <section id="how-to-buy" className="section">
          <h2 className="section-title" data-fx="flip-up">How to <span className="accent">Buy</span></h2>
          <p className="section-sub" data-fx="flip-up" data-fx-delay="100">
            Four steps to join the angriest patch in crypto.
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
          <h2 className="section-title" data-fx="flip-up">Rage <span className="accent">Roadmap</span></h2>
          <div className="roadmap-grid">
            <div className="roadmap-line"><div className="roadmap-line-fill" /></div>
            {ROADMAP.map((r, i) => (
              <div className={`roadmap-item ${i % 2 === 0 ? 'left' : 'right'}`} data-fx={i % 2 === 0 ? 'tilt-left' : 'tilt-right'} key={r.phase}>
                <TiltCard className={`roadmap-card status-${r.status}`}>
                  <span className="roadmap-phase">{r.phase}</span>
                  <h3>{r.title}</h3>
                  <ul>
                    {r.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <span className="roadmap-status">
                    {r.status === 'done' ? '✅ Complete' : r.status === 'active' ? '🔥 In Progress' : '🌱 Up Next'}
                  </span>
                </TiltCard>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Community ─── */}
        <section id="community" className="section">
          <h2 className="section-title" data-fx="flip-up">Join the <span className="accent">Patch</span></h2>
          <p className="section-sub" data-fx="flip-up" data-fx-delay="100">
            12,000+ angry holders and counting. Bring your rage — leave with a family.
          </p>
          <div className="social-grid">
            {SOCIALS.map((s, i) => (
              <a href={s.href} target="_blank" rel="noreferrer" key={s.name} data-fx="flip-up" data-fx-delay={i * 100}>
                <TiltCard className="social-card">
                  <span className="social-icon">{s.icon}</span>
                  <h3>{s.name}</h3>
                  <span className="social-handle">{s.handle}</span>
                </TiltCard>
              </a>
            ))}
          </div>

          <div className="cta-banner" data-fx="zoom-deep">
            <img src={PUMPKIN} alt="" className="cta-pumpkin" />
            <h3>Don't make the pumpkin angrier.</h3>
            <p>Every second you're not holding $RPUM, its eyebrows get bushier.</p>
            <a href="#how-to-buy" className="btn btn-primary">🎃 Buy $RPUM</a>
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
              <p className="footer-owner">Founded &amp; owned by <strong>Gautham Vijayaraj</strong></p>
            </div>
          </div>
          <nav className="footer-links">
            {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </nav>
        </div>
        <p className="footer-disclaimer">
          Disclaimer: $RPUM is a meme coin created for entertainment and community purposes.
          It has no intrinsic value and no expectation of financial return. Cryptocurrency is
          volatile — never invest more than you can afford to lose. Nothing on this site is
          financial advice. Do your own research.
        </p>
        <p className="footer-copy">© 2026 RedPumpkin ($RPUM) · Gautham Vijayaraj · All rage reserved.</p>
      </footer>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import './LandingPage.css'

// ── DNA Helix SVG ────────────────────────────────────────────────────────────

function DNAHelix() {
  const steps = 120
  const h = 520
  const cx = 90
  const amp = 60
  const cycles = 3.5

  const s1 = []
  const s2 = []
  for (let i = 0; i <= steps; i++) {
    const y = (i / steps) * h
    const angle = (i / steps) * Math.PI * 2 * cycles
    s1.push([cx + Math.sin(angle) * amp, y])
    s2.push([cx + Math.sin(angle + Math.PI) * amp, y])
  }

  const toD = pts =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')

  const rungIdxs = Array.from({ length: Math.floor(steps / 10) + 1 }, (_, i) => i * 10).filter(i => i <= steps)

  return (
    <svg viewBox={`0 0 180 ${h}`} className="lp-helix" aria-hidden="true">
      <defs>
        <linearGradient id="strand1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
          <stop offset="40%" stopColor="#f97316" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#f97316" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="strand2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
        </linearGradient>
        <filter id="glow-orange">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-blue">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {rungIdxs.map(i => (
        <line key={i}
          x1={s1[i][0].toFixed(1)} y1={s1[i][1].toFixed(1)}
          x2={s2[i][0].toFixed(1)} y2={s2[i][1].toFixed(1)}
          stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"
        />
      ))}

      <path d={toD(s1)} stroke="url(#strand1)" strokeWidth="2.5" fill="none" />
      <path d={toD(s2)} stroke="url(#strand2)" strokeWidth="2.5" fill="none" />

      {rungIdxs.map(i => (
        <g key={`nodes-${i}`}>
          <circle cx={s1[i][0].toFixed(1)} cy={s1[i][1].toFixed(1)} r="4.5" fill="#f97316" filter="url(#glow-orange)" />
          <circle cx={s2[i][0].toFixed(1)} cy={s2[i][1].toFixed(1)} r="4.5" fill="#3b82f6" filter="url(#glow-blue)" />
        </g>
      ))}
    </svg>
  )
}

// ── Floating Golf Ball ───────────────────────────────────────────────────────

function GolfBall({ size = 24, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="white" opacity="0.07" />
      <circle cx="12" cy="12" r="11" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      <circle cx="9" cy="9" r="1.5" fill="rgba(255,255,255,0.1)" />
      <circle cx="14" cy="8" r="1" fill="rgba(255,255,255,0.08)" />
      <circle cx="7" cy="13" r="1" fill="rgba(255,255,255,0.08)" />
      <circle cx="15" cy="14" r="1.5" fill="rgba(255,255,255,0.1)" />
      <circle cx="11" cy="16" r="1" fill="rgba(255,255,255,0.08)" />
    </svg>
  )
}

// ── Icons ────────────────────────────────────────────────────────────────────

function IconRuler() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h20M2 12l4-4M2 12l4 4M22 12l-4-4M22 12l-4 4" />
      <line x1="7" y1="8" x2="7" y2="16" /><line x1="12" y1="6" x2="12" y2="18" /><line x1="17" y1="8" x2="17" y2="16" />
    </svg>
  )
}

function IconDna() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 15c6.667-6 13.333 0 20-6" /><path d="M9 22c1.798-3.333 7.667-3.667 9-7" />
      <path d="M2 9c6.667-6 13.333 0 20-6" /><path d="M9 8c1.798-3.333 7.667-3.667 9-7" />
    </svg>
  )
}

function IconFileText() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function IconVideo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  )
}

function IconUsers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconTrendingUp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

// ── Navigation ───────────────────────────────────────────────────────────────

function LandingNav({ onSignIn, onGetStarted }) {
  return (
    <nav className="lp-nav">
      <div className="lp-nav-inner">
        <a className="lp-nav-logo" href="#">
          <div className="lp-logo-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z" fill="white" opacity="0.9" />
              <path d="M8 9l4 6 4-6" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="8" r="1.5" fill="#1d4ed8" />
            </svg>
          </div>
          <span>My <strong>Swing</strong> DNA</span>
        </a>
        <div className="lp-nav-links">
          <a href="#how-it-works" className="lp-nav-link">How It Works</a>
          <a href="#categories" className="lp-nav-link">DNA Categories</a>
        </div>
        <div className="lp-nav-actions">
          <button className="lp-nav-signin" onClick={onSignIn}>Sign In</button>
          <button className="lp-nav-cta" onClick={onGetStarted}>Get Started</button>
        </div>
      </div>
    </nav>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ onGetStarted, onSignIn }) {
  return (
    <section className="lp-hero">
      <GolfBall size={120} style={{ position: 'absolute', top: '8%', left: '3%', animation: 'lp-float 7s ease-in-out infinite' }} />
      <GolfBall size={60} style={{ position: 'absolute', top: '20%', right: '5%', animation: 'lp-float 5s ease-in-out infinite 1s' }} />
      <GolfBall size={80} style={{ position: 'absolute', bottom: '15%', left: '8%', animation: 'lp-float 9s ease-in-out infinite 2s' }} />
      <GolfBall size={40} style={{ position: 'absolute', bottom: '25%', right: '12%', animation: 'lp-float 6s ease-in-out infinite 0.5s' }} />

      <div className="lp-hero-inner">
        <div className="lp-hero-copy">
          <span className="lp-eyebrow">Golf Biomechanics Platform</span>
          <h1 className="lp-hero-title">
            Every swing tells<br />
            a story.<br />
            <span className="lp-gradient-text">We decode yours.</span>
          </h1>
          <p className="lp-hero-sub">
            My Swing DNA maps your unique biomechanics across 6 physical and motion
            categories — giving every golfer a precise blueprint for improvement.
            No coach required.
          </p>
          <div className="lp-hero-actions">
            <button className="lp-btn-primary" onClick={onGetStarted}>
              Start Free&nbsp; <IconArrowRight />
            </button>
            <button className="lp-btn-outline" onClick={onSignIn}>Sign In</button>
          </div>
          <p className="lp-hero-note">Simple one-time access &bull; Takes 15 minutes</p>
        </div>

        <div className="lp-hero-visual">
          <div className="lp-helix-wrap">
            <DNAHelix />
          </div>
          <div className="lp-hero-badge lp-hero-badge--left">
            <span className="lp-badge-num">6</span>
            <span className="lp-badge-label">DNA<br />Categories</span>
          </div>
          <div className="lp-hero-badge lp-hero-badge--right">
            <span className="lp-badge-num">100%</span>
            <span className="lp-badge-label">Personalized<br />Blueprint</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Trust Strip ───────────────────────────────────────────────────────────────

function TrustStrip() {
  const pillars = [
    { label: 'Biomechanics-Based', icon: <IconRuler /> },
    { label: 'Self-Service or with a Coach', icon: <IconUsers /> },
    { label: 'Video Analysis', icon: <IconVideo /> },
    { label: 'Personalized Reports', icon: <IconFileText /> },
    { label: 'Track Progress Over Time', icon: <IconTrendingUp /> },
  ]
  return (
    <div className="lp-trust">
      {pillars.map(p => (
        <div key={p.label} className="lp-trust-item">
          <span className="lp-trust-icon">{p.icon}</span>
          <span>{p.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Complete Your Intake',
      desc: 'Submit physical measurements, movement tests, and Down-the-Line + Face-On swing videos through a guided form.',
      color: '#f97316',
    },
    {
      num: '02',
      title: 'AI Classifies Your DNA',
      desc: 'Our biomechanics algorithm maps your data across 6 categories — Dexterity, Eye Dominance, Span Track, Forearm Screen, Lower Body Pivot, and Trail Arm Action.',
      color: '#3b82f6',
    },
    {
      num: '03',
      title: 'Receive Your Blueprint',
      desc: 'Get a personalized swing instruction report with your one-line feel, miss pattern analysis, and a targeted practice plan.',
      color: '#10b981',
    },
  ]
  return (
    <section className="lp-section" id="how-it-works">
      <div className="lp-section-inner">
        <div className="lp-section-header">
          <span className="lp-section-eyebrow">The Process</span>
          <h2 className="lp-section-title">From data to breakthrough<br />in three steps</h2>
        </div>
        <div className="lp-steps">
          {steps.map((s, i) => (
            <div key={s.num} className="lp-step">
              <div className="lp-step-num" style={{ color: s.color, borderColor: s.color }}>{s.num}</div>
              {i < steps.length - 1 && <div className="lp-step-line" />}
              <h3 className="lp-step-title">{s.title}</h3>
              <p className="lp-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── DNA Categories ────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    title: 'Dexterity',
    subtitle: 'Hand dominance & fine motor coordination',
    types: ['Left', 'Ambidextrous', 'Right'],
    color: '#f97316',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v0" /><path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2" />
        <path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
      </svg>
    ),
  },
  {
    title: 'Eye Dominance',
    subtitle: 'Visual alignment & depth perception',
    types: ['Left Eye', 'Right Eye', 'Binocular'],
    color: '#8b5cf6',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'Span Track',
    subtitle: 'Height-to-wingspan body ratio',
    types: ['High', 'Mid', 'Low'],
    color: '#06b6d4',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    title: 'Forearm Screen',
    subtitle: 'Trail arm rotation capacity',
    types: ['Greater', 'Equal', 'Less'],
    color: '#10b981',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: 'Lower Body Pivot',
    subtitle: 'Hip rotation & weight transfer',
    types: ['Lead Hip', 'Pelvis', 'Rear Hip'],
    color: '#f59e0b',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
      </svg>
    ),
  },
  {
    title: 'Trail Arm Action',
    subtitle: 'Elbow plane & arm motion pattern',
    types: ['On Top', 'Side On', 'Side Under', 'Under'],
    color: '#ec4899',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
  },
]

function DNACategories() {
  return (
    <section className="lp-section lp-section--dark" id="categories">
      <div className="lp-section-inner">
        <div className="lp-section-header">
          <span className="lp-section-eyebrow">The Science</span>
          <h2 className="lp-section-title">Your DNA across 6 dimensions</h2>
          <p className="lp-section-sub">
            Each category captures a different physical or biomechanical trait.
            Together, they form a fingerprint unique to every golfer.
          </p>
        </div>
        <div className="lp-cat-grid">
          {CATEGORIES.map(cat => (
            <div key={cat.title} className="lp-cat-card" style={{ '--cat-color': cat.color }}>
              <div className="lp-cat-icon">{cat.icon}</div>
              <h3 className="lp-cat-title">{cat.title}</h3>
              <p className="lp-cat-sub">{cat.subtitle}</p>
              <div className="lp-cat-types">
                {cat.types.map(t => (
                  <span key={t} className="lp-cat-tag">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Audience Split ────────────────────────────────────────────────────────────

function AudienceSplit({ onGetStarted }) {
  return (
    <section className="lp-section lp-audience">
      <div className="lp-section-inner lp-audience-inner">
        <div className="lp-audience-card lp-audience-card--coach">
          <div className="lp-audience-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className="lp-audience-title">For Coaches</h3>
          <p className="lp-audience-desc">
            Build a deeper understanding of each student's biomechanics.
            Review intake videos, generate DNA reports in seconds, and
            deliver precise instruction that actually sticks.
          </p>
          <ul className="lp-audience-list">
            {['Manage all student submissions', 'Watch DTL & Face-On video uploads', 'Generate personalized DNA reports', 'Track student progress over time', 'Export intake forms as PDF'].map(item => (
              <li key={item}><span className="lp-check"><IconCheck /></span>{item}</li>
            ))}
          </ul>
          <button className="lp-audience-btn lp-audience-btn--coach" onClick={onGetStarted}>
            Start as a Coach <IconArrowRight />
          </button>
        </div>

        <div className="lp-audience-divider">
          <span>or</span>
        </div>

        <div className="lp-audience-card lp-audience-card--student">
          <div className="lp-audience-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h3 className="lp-audience-title">For Golfers</h3>
          <p className="lp-audience-desc">
            Stop guessing why your swing breaks down. Sign up, pay once, and
            get a report built entirely around your body — no coach needed,
            no referral required.
          </p>
          <ul className="lp-audience-list">
            {['Submit measurements & videos in minutes', 'Receive your personalized Swing DNA', 'Understand your one-line feel cue', 'See your most likely miss patterns', 'Follow a targeted practice plan'].map(item => (
              <li key={item}><span className="lp-check"><IconCheck /></span>{item}</li>
            ))}
          </ul>
          <button className="lp-audience-btn lp-audience-btn--student" onClick={onGetStarted}>
            Get My Swing DNA <IconArrowRight />
          </button>
        </div>
      </div>
    </section>
  )
}

// ── CTA Banner ────────────────────────────────────────────────────────────────

function CTABanner({ onGetStarted }) {
  return (
    <section className="lp-cta">
      <div className="lp-cta-glow lp-cta-glow--left" />
      <div className="lp-cta-glow lp-cta-glow--right" />
      <div className="lp-cta-inner">
        <div className="lp-cta-helix">
          <DNAHelix />
        </div>
        <div className="lp-cta-copy">
          <h2 className="lp-cta-title">
            Ready to unlock<br />
            <span className="lp-gradient-text">your Swing DNA?</span>
          </h2>
          <p className="lp-cta-sub">
            Any golfer can access their Swing DNA directly — no coach, no
            referral. Sign up, pay once, and get your personalized blueprint.
          </p>
          <button className="lp-btn-primary lp-btn-primary--lg" onClick={onGetStarted}>
            Get Started <IconArrowRight />
          </button>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

function LandingFooter() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-brand">
          <div className="lp-logo-mark lp-logo-mark--sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z" fill="white" opacity="0.9" />
              <path d="M8 9l4 6 4-6" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span>My <strong>Swing</strong> DNA</span>
        </div>
        <p className="lp-footer-copy">&copy; 2026 My Swing DNA. All rights reserved.</p>
      </div>
    </footer>
  )
}

// ── Scroll Reveal ─────────────────────────────────────────────────────────────

function useScrollReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('lp-revealed', e.isIntersecting)),
      { threshold: 0.12 }
    )
    el.querySelectorAll('.lp-reveal').forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])
  return ref
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function LandingPage({ onGetStarted, onSignIn }) {
  const rootRef = useScrollReveal()

  return (
    <div className="lp-root" ref={rootRef}>
      <LandingNav onSignIn={onSignIn} onGetStarted={onGetStarted} />
      <Hero onGetStarted={onGetStarted} onSignIn={onSignIn} />
      <TrustStrip />
      <div className="lp-reveal"><HowItWorks /></div>
      <div className="lp-reveal"><DNACategories /></div>
      <div className="lp-reveal"><AudienceSplit onGetStarted={onGetStarted} /></div>
      <div className="lp-reveal"><CTABanner onGetStarted={onGetStarted} /></div>
      <LandingFooter />
    </div>
  )
}

import { useRef } from 'react';
import { DNA_CATEGORIES, getSections } from '../data/swingDNA';
import DNAPage from './DNAPage';

// ─────────────────────────────────────────────
// StudentReport
// Renders only the pages relevant to a student,
// with their specific option pre-highlighted.
// ─────────────────────────────────────────────

const SECTION_COLORS = {
  'Physical DNA': '#1db954',
  'Setup': '#d4a843',
  'Motions': '#4da6ff',
  'Power Source': '#c084fc',
};

export default function StudentReport({ studentInfo, selections, onBack }) {
  const reportRef = useRef(null);
  const sections = getSections();

  // Only include categories where a selection was made
  const selectedCategories = DNA_CATEGORIES.filter((c) => selections[c.id]);

  function handlePrint() {
    window.print();
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <nav style={styles.sidebar}>
        <div style={styles.sidebarTop}>
          <p style={styles.sidebarEyebrow}>Student Report</p>
          <p style={styles.sidebarName}>{studentInfo.name}</p>
          {studentInfo.date && (
            <p style={styles.sidebarDate}>{new Date(studentInfo.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          )}
        </div>

        <div style={styles.sidebarNav}>
          {sections.map((section) => {
            const cats = selectedCategories.filter((c) => c.section === section);
            if (cats.length === 0) return null;
            const color = SECTION_COLORS[section] || '#1db954';
            return (
              <div key={section} style={{ marginBottom: 8 }}>
                <p style={{ ...styles.navSection, color }}>
                  {section}
                </p>
                {cats.map((cat) => {
                  const optId = selections[cat.id];
                  const opt = cat.options.find((o) => o.id === optId);
                  return (
                    <a
                      key={cat.id}
                      href={`#${cat.id}`}
                      style={styles.navItem}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('report-scroll')
                          ?.querySelector(`#page-${cat.id}`)
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      <span style={styles.navDot} />
                      <span>
                        <span style={{ display: 'block', color: '#e2e8f0', fontSize: 12 }}>
                          {cat.title}{cat.titleEm ? ` ${cat.titleEm}` : ''}
                        </span>
                        {opt && (
                          <span style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color, marginTop: 2 }}>
                            {opt.label}
                          </span>
                        )}
                      </span>
                    </a>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div style={styles.sidebarActions}>
          <button style={styles.printBtn} onClick={handlePrint}>
            ↓ Export PDF
          </button>
          <button style={styles.backBtn} onClick={onBack}>
            ← New Student
          </button>
        </div>
      </nav>

      {/* ── Report Content ── */}
      <div id="report-scroll" ref={reportRef} style={styles.content}>

        {/* Cover */}
        <div style={styles.cover}>
          <p style={styles.coverEyebrow}>Swing DNA Report · Confidential</p>
          <h1 style={styles.coverName}>{studentInfo.name}</h1>
          <p style={styles.coverSub}>Personal Swing Blueprint</p>
          <div style={styles.coverDivider} />

          {/* Quick stats */}
          <div style={styles.statsGrid}>
            {['dexterity', 'span-track', 'lower-body-pivot', 'ground-forces'].map((catId) => {
              const cat = DNA_CATEGORIES.find((c) => c.id === catId);
              const opt = cat?.options.find((o) => o.id === selections[catId]);
              if (!cat || !opt) return null;
              return (
                <div key={catId} style={styles.statCell}>
                  <dt style={styles.statLabel}>{cat.title}{cat.titleEm ? ` ${cat.titleEm}` : ''}</dt>
                  <dd style={styles.statValue}>{opt.label}</dd>
                </div>
              );
            })}
          </div>

          {studentInfo.notes && (
            <div style={styles.coverNote}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em', color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>Instructor Notes</p>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, fontStyle: 'italic' }}>{studentInfo.notes}</p>
            </div>
          )}
        </div>

        {/* Pages — one per selected category */}
        {selectedCategories.map((cat) => (
          <div key={cat.id} id={`page-${cat.id}`}>
            <DNAPage
              category={cat}
              activeOptionId={selections[cat.id]}
              isStudentView={true}
            />
          </div>
        ))}

        {/* Footer */}
        <div style={styles.footer}>
          <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 20, color: '#e2e8f0' }}>
            {studentInfo.name} — Swing DNA
          </p>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#475569', lineHeight: 1.8, textAlign: 'right' }}>
            Confidential — Instructor Use Only<br />
            {selectedCategories.length} categories assessed<br />
            <span style={{ color: '#1db954' }}>Personal Blueprint v1.0</span>
          </p>
        </div>

      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          #sidebar { display: none !important; }
          #report-scroll { overflow: visible !important; height: auto !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
const styles = {
  sidebar: {
    width: 260,
    minWidth: 260,
    background: '#111418',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  sidebarTop: {
    padding: '28px 24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  sidebarEyebrow: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9,
    letterSpacing: '0.3em',
    color: '#1db954',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sidebarName: {
    fontFamily: 'Cormorant Garamond, Georgia, serif',
    fontSize: 22,
    fontWeight: 600,
    color: '#fff',
    lineHeight: 1.2,
  },
  sidebarDate: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    color: '#475569',
    marginTop: 4,
  },
  sidebarNav: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 0',
  },
  navSection: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 8,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    padding: '8px 24px 4px',
  },
  navItem: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
    padding: '7px 24px',
    textDecoration: 'none',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'background 0.1s',
  },
  navDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: 'currentColor',
    marginTop: 5,
    flexShrink: 0,
    opacity: 0.5,
  },
  sidebarActions: {
    padding: '16px 24px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  printBtn: {
    background: '#1db954',
    color: '#000',
    border: 'none',
    borderRadius: 2,
    padding: '10px 16px',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    width: '100%',
  },
  backBtn: {
    background: 'transparent',
    color: '#64748b',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 2,
    padding: '10px 16px',
    fontSize: 13,
    fontFamily: 'inherit',
    cursor: 'pointer',
    width: '100%',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    background: '#0a0c0f',
  },
  cover: {
    minHeight: '100vh',
    padding: '80px 72px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    background: `
      radial-gradient(ellipse 60% 50% at 80% 50%, rgba(29,185,84,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 10% 80%, rgba(212,168,67,0.05) 0%, transparent 60%),
      #0a0c0f
    `,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  coverEyebrow: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    letterSpacing: '0.4em',
    color: '#1db954',
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  coverName: {
    fontFamily: 'Cormorant Garamond, Georgia, serif',
    fontSize: 'clamp(48px, 7vw, 96px)',
    fontWeight: 900,
    color: '#fff',
    lineHeight: 0.95,
    marginBottom: 8,
  },
  coverSub: {
    fontFamily: 'Cormorant Garamond, Georgia, serif',
    fontStyle: 'italic',
    fontSize: 'clamp(18px, 2.5vw, 28px)',
    color: '#d4a843',
    marginBottom: 36,
  },
  coverDivider: {
    width: 60,
    height: 2,
    background: 'linear-gradient(90deg, #1db954, transparent)',
    marginBottom: 40,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 1,
    maxWidth: 600,
    background: 'rgba(255,255,255,0.04)',
    marginBottom: 32,
  },
  statCell: {
    background: '#111418',
    padding: '18px 22px',
  },
  statLabel: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 8,
    letterSpacing: '0.2em',
    color: '#64748b',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 15,
    fontWeight: 600,
    color: '#1db954',
    display: 'block',
  },
  coverNote: {
    maxWidth: 560,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 2,
    padding: '20px 28px',
  },
  footer: {
    padding: '48px 72px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 20,
  },
};

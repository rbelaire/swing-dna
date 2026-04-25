import { useState } from 'react';
import { useAuth } from './AuthContext';
import { DNA_CATEGORIES, getSections } from './data/swingDNA';
import DNAPage from './components/DNAPage';
import StudentBuilder from './components/StudentBuilder';
import StudentReport from './components/StudentReport';
import AdminPanel from './components/AdminPanel';
import StudentDashboard from './components/StudentDashboard';

// ─────────────────────────────────────────────
// SwingDNA — Root App Component
//
// DROP THIS into your existing React app.
// Add a route: <Route path="/swing-dna" element={<SwingDNAApp />} />
// Or render directly: <SwingDNAApp />
// ─────────────────────────────────────────────

const VIEWS = {
  MASTER: 'master',       // Full reference — all pages
  BUILDER: 'builder',     // Create a new student profile
  REPORT: 'report',       // View generated student report
  ADMIN: 'admin',         // Admin panel
};

const SECTION_COLORS = {
  'Physical DNA': '#1db954',
  'Setup': '#d4a843',
  'Motions': '#4da6ff',
  'Power Source': '#c084fc',
};

export default function SwingDNAApp({ onSignOut }) {
  const { isAdmin } = useAuth();
  const [view, setView] = useState(VIEWS.MASTER);
  const [activeCategory, setActiveCategory] = useState(DNA_CATEGORIES[0].id);
  const [reportData, setReportData] = useState(null);

  const sections = getSections();
  const activeCat = DNA_CATEGORIES.find((c) => c.id === activeCategory);

  function handleGenerateReport(data) {
    setReportData(data);
    setView(VIEWS.REPORT);
  }

  // ── Student view (non-admin users see intake form) ──
  if (!isAdmin) {
    return (
      <AppShell>
        <StudentDashboard onSignOut={onSignOut} />
      </AppShell>
    );
  }

  // ── Full screen views ──
  if (view === VIEWS.BUILDER) {
    return (
      <AppShell>
        <StudentBuilder onGenerateReport={handleGenerateReport} />
        <button
          onClick={() => setView(VIEWS.MASTER)}
          style={styles.floatingBack}
        >
          ← Master Reference
        </button>
      </AppShell>
    );
  }

  if (view === VIEWS.REPORT && reportData) {
    return (
      <AppShell>
        <StudentReport
          studentInfo={reportData.studentInfo}
          selections={reportData.selections}
          onBack={() => { setReportData(null); setView(VIEWS.BUILDER); }}
        />
      </AppShell>
    );
  }

  if (view === VIEWS.ADMIN) {
    return (
      <AppShell>
        <AdminPanel />
        <button
          onClick={() => setView(VIEWS.MASTER)}
          style={styles.floatingBack}
        >
          ← Back to Reference
        </button>
      </AppShell>
    );
  }

  // ── Master Reference View ──
  return (
    <AppShell>
      <div style={styles.layout}>

        {/* ── Sidebar ── */}
        <nav style={styles.sidebar} id="sidebar">
          <div style={styles.sidebarLogo}>
            <p style={styles.logoMono}>Swing DNA</p>
            <p style={styles.logoSub}>Master Reference</p>
            {onSignOut && (
              <button onClick={onSignOut} style={styles.signOutBtn}>Sign out</button>
            )}
          </div>

          {/* New Student CTA */}
          <div style={styles.ctaWrap}>
            <button
              style={styles.ctaBtn}
              onClick={() => setView(VIEWS.BUILDER)}
            >
              + New Student Report
            </button>
            {isAdmin && (
              <button
                style={{ ...styles.ctaBtn, ...styles.adminBtn }}
                onClick={() => setView(VIEWS.ADMIN)}
              >
                Admin Panel
              </button>
            )}
          </div>

          {/* Nav */}
          {sections.map((section) => {
            const cats = DNA_CATEGORIES.filter((c) => c.section === section);
            const color = SECTION_COLORS[section] || '#1db954';
            return (
              <div key={section} style={styles.navGroup}>
                <p style={{ ...styles.navSectionLabel, color }}>{section}</p>
                {cats.map((cat) => {
                  const isActive = cat.id === activeCategory;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      style={{
                        ...styles.navItem,
                        background: isActive ? `${color}18` : 'transparent',
                        color: isActive ? color : '#64748b',
                      }}
                    >
                      <span style={{
                        ...styles.navDot,
                        background: isActive ? color : '#64748b',
                        opacity: isActive ? 1 : 0.4,
                      }} />
                      {cat.title}{cat.titleEm ? ` ${cat.titleEm}` : ''}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* ── Main content ── */}
        <main style={styles.main} id="main">
          {/* Cover when no category is active (first load) */}
          {!activeCat ? (
            <MasterCover onStart={() => setActiveCategory(DNA_CATEGORIES[0].id)} />
          ) : (
            <div key={activeCat.id} style={{ animation: 'pageIn 0.3s ease' }}>
              <DNAPage category={activeCat} isStudentView={false} />
            </div>
          )}

          {/* Page navigation */}
          {activeCat && (
            <div style={styles.pageNav}>
              <PrevNext
                categories={DNA_CATEGORIES}
                currentId={activeCategory}
                onNavigate={setActiveCategory}
              />
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes pageIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
        #sidebar::-webkit-scrollbar { width: 4px; }
        #sidebar::-webkit-scrollbar-track { background: transparent; }
        #sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 2px; }
        #main::-webkit-scrollbar { width: 6px; }
        #main::-webkit-scrollbar-track { background: #0a0c0f; }
        #main::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        button:focus { outline: none; }
      `}</style>
    </AppShell>
  );
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function AppShell({ children }) {
  return (
    <div style={{
      background: '#0a0c0f',
      color: '#e2e8f0',
      fontFamily: "'Outfit', 'Segoe UI', sans-serif",
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {children}
    </div>
  );
}

function MasterCover({ onStart }) {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '80px 72px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: `
        radial-gradient(ellipse 60% 50% at 80% 50%, rgba(29,185,84,0.07) 0%, transparent 70%),
        #0a0c0f
      `,
    }}>
      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.4em', color: '#1db954', textTransform: 'uppercase', marginBottom: 20 }}>
        Instructor Master Reference
      </p>
      <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(52px, 7vw, 96px)', fontWeight: 700, color: '#fff', lineHeight: 0.95, marginBottom: 20 }}>
        Swing DNA<br /><em style={{ fontStyle: 'italic', color: '#d4a843' }}>Complete Guide</em>
      </h1>
      <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.8, maxWidth: 480, marginBottom: 40 }}>
        Every biometric category, every option, fully explained. Select a category from the sidebar or start a new student report.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button style={{
          background: '#1db954', color: '#000', border: 'none', borderRadius: 2,
          padding: '14px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }} onClick={onStart}>
          Browse Reference →
        </button>
      </div>
    </div>
  );
}

function PrevNext({ categories, currentId, onNavigate }) {
  const idx = categories.findIndex((c) => c.id === currentId);
  const prev = categories[idx - 1];
  const next = categories[idx + 1];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '32px 72px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      flexWrap: 'wrap',
      gap: 16,
    }}>
      {prev ? (
        <button onClick={() => onNavigate(prev.id)} style={styles.pageNavBtn}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#64748b', display: 'block', marginBottom: 4 }}>← Previous</span>
          <span style={{ fontSize: 14, color: '#e2e8f0' }}>{prev.title}{prev.titleEm ? ` ${prev.titleEm}` : ''}</span>
        </button>
      ) : <div />}
      {next && (
        <button onClick={() => onNavigate(next.id)} style={{ ...styles.pageNavBtn, textAlign: 'right' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#64748b', display: 'block', marginBottom: 4 }}>Next →</span>
          <span style={{ fontSize: 14, color: '#e2e8f0' }}>{next.title}{next.titleEm ? ` ${next.titleEm}` : ''}</span>
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = {
  layout: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
  sidebar: {
    width: 268,
    minWidth: 268,
    background: '#111418',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    height: '100vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  sidebarLogo: {
    padding: '28px 24px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  logoMono: {
    fontFamily: 'Cormorant Garamond, Georgia, serif',
    fontSize: 20,
    fontWeight: 600,
    color: '#fff',
  },
  logoSub: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9,
    letterSpacing: '0.25em',
    color: '#1db954',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  ctaWrap: {
    padding: '16px 16px 8px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  ctaBtn: {
    width: '100%',
    background: 'rgba(29,185,84,0.1)',
    border: '1px solid rgba(29,185,84,0.25)',
    color: '#1db954',
    borderRadius: 2,
    padding: '10px 16px',
    fontSize: 12,
    fontFamily: 'inherit',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'background 0.15s',
  },
  navGroup: {
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  navSectionLabel: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 8,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    padding: '10px 24px 4px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '7px 24px',
    width: '100%',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontFamily: 'inherit',
    textAlign: 'left',
    transition: 'background 0.1s, color 0.1s',
    borderRadius: 0,
  },
  navDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    flexShrink: 0,
    transition: 'background 0.1s, opacity 0.1s',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    background: '#0a0c0f',
  },
  pageNav: {
    marginTop: 0,
  },
  pageNavBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    padding: 0,
    fontFamily: 'inherit',
  },
  signOutBtn: {
    marginTop: 12,
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.4)',
    borderRadius: 2,
    padding: '5px 10px',
    fontSize: 10,
    fontFamily: 'inherit',
    cursor: 'pointer',
    letterSpacing: '0.05em',
  },
  floatingBack: {
    position: 'fixed',
    bottom: 24,
    left: 24,
    background: 'rgba(17,20,24,0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#94a3b8',
    borderRadius: 2,
    padding: '10px 20px',
    fontSize: 13,
    fontFamily: 'inherit',
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
    zIndex: 50,
  },
  adminBtn: {
    marginTop: 8,
    background: 'rgba(99,102,241,0.1)',
    borderColor: 'rgba(99,102,241,0.25)',
    color: '#6366f1',
  },
};

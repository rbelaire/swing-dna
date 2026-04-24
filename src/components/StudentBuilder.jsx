import { useState } from 'react';
import { DNA_CATEGORIES, getSections } from '../data/swingDNA';

// ─────────────────────────────────────────────
// StudentBuilder
// Instructor fills out each category selection
// for a student, then generates a filtered report
// ─────────────────────────────────────────────

const SECTION_COLORS = {
  'Physical DNA': '#1db954',
  'Setup': '#d4a843',
  'Motions': '#4da6ff',
  'Power Source': '#c084fc',
};

export default function StudentBuilder({ onGenerateReport }) {
  const [step, setStep] = useState('info'); // 'info' | 'build' | 'review'
  const [studentInfo, setStudentInfo] = useState({ name: '', date: '', notes: '' });
  const [selections, setSelections] = useState({});
  const sections = getSections();

  const totalCategories = DNA_CATEGORIES.length;
  const completedCount = Object.keys(selections).length;
  const progress = Math.round((completedCount / totalCategories) * 100);

  function setSelection(categoryId, optionId) {
    setSelections((prev) => ({ ...prev, [categoryId]: optionId }));
  }

  function handleGenerate() {
    onGenerateReport({ studentInfo, selections });
  }

  // ── STEP 1: Student Info ──
  if (step === 'info') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <p style={styles.eyebrow}>New Student</p>
          <h1 style={styles.title}>Student <em style={{ fontStyle: 'italic', color: '#d4a843' }}>Profile</em></h1>
          <p style={styles.subtitle}>Enter basic information before building the swing DNA profile.</p>
        </div>

        <div style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Student Name</label>
            <input
              style={styles.input}
              placeholder="Full name"
              value={studentInfo.name}
              onChange={(e) => setStudentInfo((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Assessment Date</label>
            <input
              style={styles.input}
              type="date"
              value={studentInfo.date}
              onChange={(e) => setStudentInfo((p) => ({ ...p, date: e.target.value }))}
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Instructor Notes (optional)</label>
            <textarea
              style={{ ...styles.input, minHeight: 80, resize: 'vertical' }}
              placeholder="Any additional context about this student..."
              value={studentInfo.notes}
              onChange={(e) => setStudentInfo((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>
          <button
            style={{
              ...styles.btn,
              opacity: studentInfo.name ? 1 : 0.4,
              cursor: studentInfo.name ? 'pointer' : 'not-allowed',
            }}
            disabled={!studentInfo.name}
            onClick={() => setStep('build')}
          >
            Start DNA Assessment →
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 2: Build Profile ──
  if (step === 'build') {
    return (
      <div style={styles.container}>
        {/* Top bar */}
        <div style={styles.builderTopBar}>
          <div>
            <p style={styles.eyebrow}>Building Profile</p>
            <h2 style={{ ...styles.title, fontSize: 28 }}>
              {studentInfo.name}
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#1db954', marginBottom: 6 }}>
              {completedCount} / {totalCategories} complete
            </p>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Category Sections */}
        {sections.map((section) => {
          const cats = DNA_CATEGORIES.filter((c) => c.section === section);
          const sectionColor = SECTION_COLORS[section] || '#1db954';
          return (
            <div key={section} style={styles.sectionBlock}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 3, height: 20, background: sectionColor, borderRadius: 1 }} />
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10,
                  letterSpacing: '0.3em',
                  color: sectionColor,
                  textTransform: 'uppercase',
                }}>
                  {section}
                </p>
              </div>

              <div style={styles.categoryGrid}>
                {cats.map((cat) => {
                  const currentSel = selections[cat.id];
                  const selectedOpt = cat.options.find((o) => o.id === currentSel);
                  return (
                    <div key={cat.id} style={{
                      ...styles.categoryCard,
                      borderColor: currentSel ? 'rgba(29,185,84,0.3)' : 'rgba(255,255,255,0.06)',
                    }}>
                      <p style={styles.catLabel}>
                        {cat.title}{cat.titleEm ? ` ${cat.titleEm}` : ''}
                      </p>

                      {/* Option buttons */}
                      <div style={styles.optionRow}>
                        {cat.options.map((opt) => {
                          const isActive = opt.id === currentSel;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setSelection(cat.id, opt.id)}
                              style={{
                                ...styles.optBtn,
                                background: isActive ? 'rgba(29,185,84,0.12)' : 'rgba(255,255,255,0.02)',
                                color: isActive ? '#1db954' : '#64748b',
                                border: isActive ? '1px solid rgba(29,185,84,0.4)' : '1px solid rgba(255,255,255,0.06)',
                                fontWeight: isActive ? 500 : 400,
                              }}
                            >
                              <span>{opt.label}</span>
                              {opt.sublabel && <span style={{ display: 'block', fontSize: 9, opacity: 0.7 }}>{opt.sublabel}</span>}
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected confirmation */}
                      {selectedOpt && (
                        <p style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 10,
                          color: '#1db954',
                          marginTop: 10,
                          letterSpacing: '0.05em',
                        }}>
                          ✓ {selectedOpt.summary}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Action row */}
        <div style={styles.actionRow}>
          <button style={styles.btnSecondary} onClick={() => setStep('info')}>
            ← Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {completedCount < totalCategories && (
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#64748b' }}>
                {totalCategories - completedCount} categories remaining
              </p>
            )}
            <button
              style={{
                ...styles.btn,
                opacity: completedCount > 0 ? 1 : 0.4,
                cursor: completedCount > 0 ? 'pointer' : 'not-allowed',
              }}
              disabled={completedCount === 0}
              onClick={() => setStep('review')}
            >
              Review Profile →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 3: Review ──
  if (step === 'review') {
    const unselected = DNA_CATEGORIES.filter((c) => !selections[c.id]);
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <p style={styles.eyebrow}>Review</p>
          <h1 style={styles.title}>
            {studentInfo.name}'s <em style={{ fontStyle: 'italic', color: '#d4a843' }}>Profile</em>
          </h1>
          <p style={styles.subtitle}>
            {completedCount} of {totalCategories} categories selected.
            {unselected.length > 0 && ` ${unselected.length} left blank.`}
          </p>
        </div>

        {/* Summary grid */}
        <div style={styles.summaryGrid}>
          {DNA_CATEGORIES.map((cat) => {
            const sel = selections[cat.id];
            const opt = cat.options.find((o) => o.id === sel);
            const sectionColor = SECTION_COLORS[cat.section] || '#1db954';
            return (
              <div key={cat.id} style={{
                ...styles.summaryCell,
                opacity: sel ? 1 : 0.35,
                borderLeft: `2px solid ${sel ? sectionColor : 'rgba(255,255,255,0.1)'}`,
              }}>
                <p style={styles.summarySection}>{cat.section}</p>
                <p style={styles.summaryCategory}>{cat.title}{cat.titleEm ? ` ${cat.titleEm}` : ''}</p>
                <p style={styles.summaryValue}>{opt ? opt.label : '— Not set'}</p>
                {opt?.sublabel && <p style={styles.summarySub}>{opt.sublabel}</p>}
              </div>
            );
          })}
        </div>

        {/* Notes */}
        {studentInfo.notes && (
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 2,
            padding: '20px 28px',
            marginBottom: 32,
          }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>Notes</p>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>{studentInfo.notes}</p>
          </div>
        )}

        <div style={styles.actionRow}>
          <button style={styles.btnSecondary} onClick={() => setStep('build')}>
            ← Edit Profile
          </button>
          <button style={styles.btn} onClick={handleGenerate}>
            Generate Student Report →
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = {
  container: {
    padding: '64px 72px',
    maxWidth: 1100,
  },
  header: {
    marginBottom: 48,
  },
  eyebrow: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    letterSpacing: '0.35em',
    color: '#1db954',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Cormorant Garamond, Georgia, serif',
    fontSize: 'clamp(32px, 4vw, 56px)',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.05,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 1.7,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    maxWidth: 480,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    letterSpacing: '0.2em',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 2,
    padding: '12px 16px',
    color: '#e2e8f0',
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
  },
  btn: {
    background: '#1db954',
    color: '#000',
    border: 'none',
    borderRadius: 2,
    padding: '14px 28px',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    letterSpacing: '0.02em',
    transition: 'opacity 0.15s',
  },
  btnSecondary: {
    background: 'transparent',
    color: '#64748b',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 2,
    padding: '14px 24px',
    fontSize: 14,
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  builderTopBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 48,
    gap: 24,
    flexWrap: 'wrap',
  },
  progressBar: {
    width: 200,
    height: 4,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#1db954',
    borderRadius: 2,
    transition: 'width 0.4s ease',
  },
  sectionBlock: {
    marginBottom: 48,
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 16,
  },
  categoryCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid',
    borderRadius: 2,
    padding: '20px 24px',
    transition: 'border-color 0.2s',
  },
  catLabel: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    letterSpacing: '0.2em',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  optionRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  optBtn: {
    padding: '8px 14px',
    borderRadius: 2,
    cursor: 'pointer',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11,
    transition: 'all 0.12s',
    textAlign: 'left',
    lineHeight: 1.3,
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 48,
    paddingTop: 32,
    borderTop: '1px solid rgba(255,255,255,0.06)',
    flexWrap: 'wrap',
    gap: 16,
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 2,
    background: 'rgba(255,255,255,0.04)',
    marginBottom: 32,
  },
  summaryCell: {
    background: '#0d1117',
    padding: '16px 20px',
  },
  summarySection: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 8,
    letterSpacing: '0.2em',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  summaryCategory: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#e2e8f0',
  },
  summarySub: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
};

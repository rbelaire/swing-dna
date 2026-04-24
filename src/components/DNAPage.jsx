import { useState } from 'react';

// ─────────────────────────────────────────────
// Color maps
// ─────────────────────────────────────────────
const COLORS = {
  green: {
    accent: '#1db954',
    bg: 'rgba(29,185,84,0.08)',
    border: 'rgba(29,185,84,0.25)',
    label: '#1db954',
  },
  gold: {
    accent: '#d4a843',
    bg: 'rgba(212,168,67,0.08)',
    border: 'rgba(212,168,67,0.25)',
    label: '#d4a843',
  },
  red: {
    accent: '#e05252',
    bg: 'rgba(224,82,82,0.07)',
    border: 'rgba(224,82,82,0.2)',
    label: '#e05252',
  },
  blue: {
    accent: '#4da6ff',
    bg: 'rgba(77,166,255,0.07)',
    border: 'rgba(77,166,255,0.2)',
    label: '#4da6ff',
  },
};

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function Tag({ text, color = 'green' }) {
  const c = COLORS[color] || COLORS.green;
  return (
    <span style={{
      display: 'inline-block',
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.label,
      padding: '4px 12px',
      borderRadius: 2,
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 11,
      letterSpacing: '0.05em',
    }}>
      {text}
    </span>
  );
}

function Card({ title, children, color = 'green', style = {} }) {
  const c = COLORS[color] || COLORS.green;
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid rgba(255,255,255,0.06)`,
      borderLeft: `3px solid ${c.accent}`,
      borderRadius: 2,
      padding: '24px 28px',
      ...style,
    }}>
      {title && (
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: c.label,
          marginBottom: 10,
        }}>
          {title}
        </p>
      )}
      <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}

function DrillCard({ number, title, body }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 2,
      padding: '20px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, #1db954, transparent)',
      }} />
      <p style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 30,
        fontWeight: 300,
        color: 'rgba(29,185,84,0.12)',
        lineHeight: 1,
        marginBottom: 10,
      }}>{String(number).padStart(2, '0')}</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 8 }}>{title}</p>
      <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{body}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN DNAPage Component
// ─────────────────────────────────────────────
export default function DNAPage({ category, activeOptionId = null, isStudentView = false }) {
  const [selected, setSelected] = useState(activeOptionId || category.options[0]?.id);

  const activeOption = category.options.find((o) => o.id === selected);
  const c = COLORS[activeOption?.color || 'green'];

  return (
    <div style={{ padding: '64px 72px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

      {/* PAGE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
        <div>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.3em', color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
            {category.section} · {category.index}
          </p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: 'clamp(28px, 4vw, 52px)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.05,
          }}>
            {category.title}{' '}
            {category.titleEm && <em style={{ fontStyle: 'italic', color: '#d4a843' }}>{category.titleEm}</em>}
          </h2>
        </div>
        {!isStudentView && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 2,
            padding: '14px 20px',
            textAlign: 'right',
          }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.2em', color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Options</p>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0' }}>{category.options.length} Variants</p>
          </div>
        )}
      </div>

      {/* INTRO */}
      <p style={{
        fontSize: 16,
        color: '#64748b',
        lineHeight: 1.9,
        maxWidth: 680,
        marginBottom: 40,
        borderLeft: '2px solid #1db954',
        paddingLeft: 20,
      }}>
        {category.intro}
      </p>

      {/* DEFINITION */}
      {category.definition && (
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 2,
          padding: '20px 28px',
          marginBottom: 36,
          display: 'flex',
          gap: 18,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em', color: '#1db954', paddingTop: 2, flexShrink: 0 }}>DEF</span>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8, fontStyle: 'italic' }}>{category.definition}</p>
        </div>
      )}

      {/* OPTIONS STRIP */}
      <div style={{
        display: 'flex',
        gap: 1,
        background: 'rgba(255,255,255,0.04)',
        marginBottom: 40,
        borderRadius: 2,
        overflow: 'hidden',
        flexWrap: 'wrap',
      }}>
        {category.options.map((opt) => {
          const isActive = opt.id === selected;
          return (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              style={{
                flex: 1,
                minWidth: 100,
                padding: '14px 18px',
                background: isActive ? 'rgba(29,185,84,0.1)' : 'rgba(255,255,255,0.02)',
                color: isActive ? '#1db954' : '#64748b',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                letterSpacing: '0.05em',
                fontWeight: isActive ? 500 : 400,
                transition: 'all 0.15s',
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              <span style={{ display: 'block' }}>{opt.label}</span>
              {opt.sublabel && (
                <span style={{ display: 'block', fontSize: 9, opacity: 0.7, marginTop: 2 }}>{opt.sublabel}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ACTIVE OPTION DETAIL */}
      {activeOption && (
        <div key={activeOption.id} style={{ animation: 'fadeIn 0.25s ease' }}>

          {/* Summary badge */}
          <div style={{
            background: c.bg,
            border: `1px solid ${c.border}`,
            borderRadius: 2,
            padding: '18px 24px',
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <div style={{ width: 3, height: 36, background: c.accent, borderRadius: 1, flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.25em', color: c.label, textTransform: 'uppercase', marginBottom: 4 }}>
                {activeOption.label}{activeOption.sublabel ? ` — ${activeOption.sublabel}` : ''}
              </p>
              <p style={{ fontSize: 15, color: '#e2e8f0', fontWeight: 500 }}>{activeOption.summary}</p>
            </div>
          </div>

          {/* Full explanation */}
          <Card title="Full Explanation" color={activeOption.color} style={{ marginBottom: 24 }}>
            <p>{activeOption.content}</p>
          </Card>

          {/* Warnings */}
          {activeOption.warnings?.length > 0 && (
            <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activeOption.warnings.map((w, i) => (
                <Card key={i} title="⚠ Coaching Warning" color="red">
                  <p>{w}</p>
                </Card>
              ))}
            </div>
          )}

          {/* Drills */}
          {activeOption.drills?.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.3em', color: '#64748b', textTransform: 'uppercase', marginBottom: 16 }}>
                Recommended Drills
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(activeOption.drills.length, 3)}, 1fr)`,
                gap: 16,
              }}>
                {activeOption.drills.map((drill, i) => (
                  <DrillCard key={i} number={i + 1} title={drill.title} body={drill.body} />
                ))}
              </div>
            </div>
          )}

          {/* Tour pros */}
          {activeOption.pros?.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', marginBottom: 12 }}>
                Tour Players — Same Profile
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {activeOption.pros.map((pro) => (
                  <Tag key={pro} text={pro} color="gold" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructor note */}
      {!isStudentView && category.instructorNote && (
        <Card title="Instructor Note" color="blue" style={{ marginTop: 12, borderLeft: '3px solid #4da6ff', background: 'rgba(77,166,255,0.05)' }}>
          <p style={{ color: '#94a3b8' }}>{category.instructorNote}</p>
        </Card>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}

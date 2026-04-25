import { useState } from 'react'

export default function SwingDNAReport({ report, submission, onSignOut }) {
  const [copied, setCopied] = useState(false)

  function handleCopyReport() {
    const reportText = generateReportText()
    navigator.clipboard.writeText(reportText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handlePrintReport() {
    window.print()
  }

  function generateReportText() {
    const c = report.classifications
    const text = `
SWING DNA REPORT
${submission.student_email}

═════════════════════════════════════════════════════════════

CLASSIFICATIONS

Track Type: ${c.trackType.type}
${c.trackType.description}

Pivot Type: ${c.pivotType.type}
${c.pivotType.description}

Rotation Capacity: ${c.rotationType.type}
${c.rotationType.description}

Forearm Pattern: ${c.forearmPattern.type}
${c.forearmPattern.description}

Trail Arm Pattern: ${c.trailArmPattern.type}
${c.trailArmPattern.description}

═════════════════════════════════════════════════════════════

YOUR ONE-LINE FEEL
${report.oneLineFeel}

═════════════════════════════════════════════════════════════

KEY RULES TO FOLLOW

Track: ${c.trackType.rule}
Pivot: ${c.pivotType.rule}
Rotation: ${c.rotationType.rule}
Forearm: ${c.forearmPattern.rule}

═════════════════════════════════════════════════════════════

CHECKPOINTS

${c.trackType.checkpoint}
${c.pivotType.checkpoint}
${c.rotationType.checkpoint}
${c.forearmPattern.checkpoint}

═════════════════════════════════════════════════════════════

MISS PATTERNS & FIXES

${report.missTable.map(m => `${m.miss}
Cause: ${m.cause}
Fix: ${m.fix}`).join('\n\n')}

═════════════════════════════════════════════════════════════

PRACTICE PLAN (10–15 minutes)

${report.practicePlan.map((d, i) => `${i + 1}. ${d.name} (${d.duration})
${d.description}`).join('\n\n')}

═════════════════════════════════════════════════════════════
    `.trim()
    return text
  }

  const c = report.classifications

  return (
    <div className="student-dashboard print-friendly">
      {onSignOut && (
        <div className="student-nav no-print">
          <span className="student-nav-brand">My Swing DNA</span>
          <button className="student-nav-signout" onClick={onSignOut}>Sign out</button>
        </div>
      )}
      <div className="dashboard-container report-container">
        <div className="report-header">
          <div className="report-title-block">
            <h1>Swing DNA Report</h1>
            <p className="report-student">{submission.student_email}</p>
            <p className="report-date">
              Generated {new Date(report.generatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="report-actions no-print">
            <button
              onClick={handleCopyReport}
              className="btn-report-action"
              title="Copy report text to clipboard"
            >
              {copied ? 'Copied!' : 'Copy Report'}
            </button>
            <button
              onClick={handlePrintReport}
              className="btn-report-action"
              title="Print or save as PDF"
            >
              Print/PDF
            </button>
          </div>
        </div>

        {/* Classifications Section */}
        <section className="report-section">
          <h2>Your Swing DNA Classifications</h2>

          <div className="classifications-grid">
            <div className="classification-card">
              <h3>Track Type</h3>
              <p className="classification-type">{c.trackType.type}</p>
              <p className="classification-description">{c.trackType.description}</p>
              <div className="classification-details">
                <p><strong>Rule:</strong> {c.trackType.rule}</p>
                <p><strong>Checkpoint:</strong> {c.trackType.checkpoint}</p>
              </div>
            </div>

            <div className="classification-card">
              <h3>Pivot Type</h3>
              <p className="classification-type">{c.pivotType.type}</p>
              <p className="classification-description">{c.pivotType.description}</p>
              <div className="classification-details">
                <p><strong>Rule:</strong> {c.pivotType.rule}</p>
                <p><strong>Checkpoint:</strong> {c.pivotType.checkpoint}</p>
              </div>
            </div>

            <div className="classification-card">
              <h3>Rotation Capacity</h3>
              <p className="classification-type">{c.rotationType.type}</p>
              <p className="classification-description">{c.rotationType.description}</p>
              <div className="classification-details">
                <p><strong>Rule:</strong> {c.rotationType.rule}</p>
                <p><strong>Checkpoint:</strong> {c.rotationType.checkpoint}</p>
              </div>
            </div>

            <div className="classification-card">
              <h3>Forearm Pattern</h3>
              <p className="classification-type">{c.forearmPattern.type}</p>
              <p className="classification-description">{c.forearmPattern.description}</p>
              <div className="classification-details">
                <p><strong>Rule:</strong> {c.forearmPattern.rule}</p>
                <p><strong>Checkpoint:</strong> {c.forearmPattern.checkpoint}</p>
              </div>
            </div>

            <div className="classification-card">
              <h3>Trail Arm Pattern</h3>
              <p className="classification-type">{c.trailArmPattern.type}</p>
              <p className="classification-description">{c.trailArmPattern.description}</p>
              <div className="classification-details">
                {c.trailArmPattern.knuckleToElbowMeasurement && (
                  <p><strong>Knuckle → Elbow:</strong> {c.trailArmPattern.knuckleToElbowMeasurement}"</p>
                )}
                {c.trailArmPattern.collarboneToElbowMeasurement && (
                  <p><strong>Collarbone → Elbow:</strong> {c.trailArmPattern.collarboneToElbowMeasurement}"</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* One-Line Feel */}
        <section className="report-section one-line-feel-section">
          <h2>Your One-Line Feel</h2>
          <div className="one-line-feel">
            {report.oneLineFeel}
          </div>
          <p className="feel-explanation">
            Use this feel during your practice and play to focus on the sequence that matches your body.
          </p>
        </section>

        {/* Miss Patterns & Fixes */}
        <section className="report-section">
          <h2>Miss Patterns & Fixes</h2>
          <div className="miss-table">
            <div className="table-header">
              <div className="table-cell">Miss</div>
              <div className="table-cell">Cause</div>
              <div className="table-cell">Fix</div>
            </div>
            {report.missTable.map((row, idx) => (
              <div key={idx} className="table-row">
                <div className="table-cell miss-label">{row.miss}</div>
                <div className="table-cell">{row.cause}</div>
                <div className="table-cell fix-label">{row.fix}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Practice Plan */}
        <section className="report-section">
          <h2>Practice Plan (10–15 minutes)</h2>
          <div className="practice-plan">
            {report.practicePlan.map((drill, idx) => (
              <div key={idx} className="drill-card">
                <div className="drill-number">{idx + 1}</div>
                <div className="drill-content">
                  <h4>{drill.name}</h4>
                  <p className="drill-duration">{drill.duration}</p>
                  <p className="drill-description">{drill.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Measurements Summary */}
        <section className="report-section measurements-section">
          <h2>Your Measurements</h2>
          <div className="measurements-summary">
            <div className="measurement-item">
              <span className="label">Height</span>
              <span className="value">{submission.measurements?.height}"</span>
            </div>
            <div className="measurement-item">
              <span className="label">Wingspan</span>
              <span className="value">{submission.measurements?.wingspan}"</span>
            </div>
            {submission.measurements?.trailArmKnuckleElbow && (
              <div className="measurement-item">
                <span className="label">Knuckle → Elbow</span>
                <span className="value">{submission.measurements.trailArmKnuckleElbow}"</span>
              </div>
            )}
            {submission.measurements?.trailArmCollarElbow && (
              <div className="measurement-item">
                <span className="label">Collarbone → Elbow</span>
                <span className="value">{submission.measurements.trailArmCollarElbow}"</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

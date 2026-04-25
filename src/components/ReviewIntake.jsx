import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { generateReport } from '../utils/swingDNAClassifier'

export default function ReviewIntake({ submission, onClose, onReportGenerated }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [report, setReport] = useState(null)
  const [status, setStatus] = useState(submission.status)

  async function handleGenerateReport() {
    try {
      setLoading(true)
      setError(null)

      const intakeData = {
        height: parseFloat(submission.measurements?.height),
        wingspan: parseFloat(submission.measurements?.wingspan),
        trailKnuckleToElbow: submission.measurements?.trailArmKnuckleElbow,
        trailCollarboneToElbow: submission.measurements?.trailArmCollarElbow,
        trailHandRotation: submission.movement_tests?.trailHandRotation,
        hipRotationTowardTarget: submission.movement_tests?.hipRotationTowardTarget,
        hipLoadPreference: submission.movement_tests?.hipRotationAwayFromTarget,
      }

      const generatedReport = generateReport(intakeData)
      setReport(generatedReport)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveReport() {
    try {
      setLoading(true)
      setError(null)

      const { error: updateError } = await supabase
        .from('golf_intake_forms')
        .update({
          swing_dna_report: report,
          status: 'completed',
        })
        .eq('id', submission.id)

      if (updateError) {
        console.error('Update error:', updateError)
        throw updateError
      }

      // Wait a moment for the update to complete, then call callback
      setTimeout(() => {
        onReportGenerated()
      }, 500)
    } catch (err) {
      console.error('Save error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusUpdate(newStatus) {
    try {
      setLoading(true)
      setError(null)

      const { error: updateError } = await supabase
        .from('golf_intake_forms')
        .update({ status: newStatus })
        .eq('id', submission.id)

      if (updateError) throw updateError

      setStatus(newStatus)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (report) {
    return (
      <div className="review-container">
        <div className="review-header">
          <h2>Generated Report Preview</h2>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <div className="report-preview">
          <div className="classifications-preview">
            <div className="preview-card">
              <h4>Track Type</h4>
              <p className="preview-type">{report.classifications.trackType.type}</p>
              <p className="preview-text">{report.classifications.trackType.description}</p>
            </div>

            <div className="preview-card">
              <h4>Pivot Type</h4>
              <p className="preview-type">{report.classifications.pivotType.type}</p>
              <p className="preview-text">{report.classifications.pivotType.description}</p>
            </div>

            <div className="preview-card">
              <h4>Rotation Capacity</h4>
              <p className="preview-type">{report.classifications.rotationType.type}</p>
              <p className="preview-text">{report.classifications.rotationType.description}</p>
            </div>

            <div className="preview-card">
              <h4>Forearm Pattern</h4>
              <p className="preview-type">{report.classifications.forearmPattern.type}</p>
              <p className="preview-text">{report.classifications.forearmPattern.description}</p>
            </div>
          </div>

          <div className="one-line-section">
            <h4>One-Line Feel</h4>
            <p className="one-line-text">{report.oneLineFeel}</p>
          </div>

          <div className="miss-section">
            <h4>Miss Patterns (First 3)</h4>
            {report.missTable.slice(0, 3).map((m, i) => (
              <div key={i} className="miss-item">
                <p><strong>{m.miss}</strong> → {m.fix}</p>
              </div>
            ))}
          </div>

          <div className="practice-section">
            <h4>Practice Plan Outline</h4>
            <ul>
              {report.practicePlan.map((d, i) => (
                <li key={i}>{i + 1}. {d.name} ({d.duration})</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="review-actions">
          <button
            onClick={() => setReport(null)}
            className="btn-secondary"
          >
            Back to Review
          </button>
          <button
            onClick={handleSaveReport}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save & Deliver Report'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="review-container">
      <div className="review-header">
        <h2>Review Intake Form</h2>
        <button onClick={onClose} className="btn-close">✕</button>
      </div>

      {error && <div className="review-error">{error}</div>}

      <div className="review-content">
        <div className="intake-summary">
          <h3>{submission.student_email}</h3>
          <p className="submitted-date">
            Submitted: {new Date(submission.submitted_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>

          <div className="summary-grid">
            <div className="summary-card">
              <h4>Measurements</h4>
              <p>Height: {submission.measurements?.height}"</p>
              <p>Wingspan: {submission.measurements?.wingspan}"</p>
              {submission.measurements?.trailArmKnuckleElbow && (
                <p>Knuckle→Elbow: {submission.measurements.trailArmKnuckleElbow}"</p>
              )}
              {submission.measurements?.trailArmCollarElbow && (
                <p>Collarbone→Elbow: {submission.measurements.trailArmCollarElbow}"</p>
              )}
            </div>

            <div className="summary-card">
              <h4>Movement Tests</h4>
              <p>Trail Hand: {submission.movement_tests?.trailHandRotation}</p>
              <p>Hip Rot (Toward): {submission.movement_tests?.hipRotationTowardTarget}</p>
              <p>Hip Load: {submission.movement_tests?.hipRotationAwayFromTarget}</p>
            </div>

            <div className="summary-card">
              <h4>Videos</h4>
              <p>DTL: {submission.video_count?.dtl || 0} swings</p>
              <p>Face-On: {submission.video_count?.faceOn || 0} swings</p>
              {submission.video_urls && (submission.video_urls.dtl?.length > 0 || submission.video_urls.faceOn?.length > 0) && (
                <p className="video-ready">Videos uploaded</p>
              )}
            </div>
          </div>
        </div>

        {submission.video_urls && (submission.video_urls.dtl?.length > 0 || submission.video_urls.faceOn?.length > 0) && (
          <div className="videos-section">
            <h4>Uploaded Videos</h4>

            {submission.video_urls.dtl && submission.video_urls.dtl.length > 0 && (
              <div className="video-group">
                <h5>Down-the-Line (DTL)</h5>
                <div className="video-list">
                  {submission.video_urls.dtl.map((url, idx) => (
                    <div key={idx} className="video-item">
                      <p className="video-label">Swing {idx + 1}</p>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="video-link">
                        View Video
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {submission.video_urls.faceOn && submission.video_urls.faceOn.length > 0 && (
              <div className="video-group">
                <h5>Face-On (FO)</h5>
                <div className="video-list">
                  {submission.video_urls.faceOn.map((url, idx) => (
                    <div key={idx} className="video-item">
                      <p className="video-label">Swing {idx + 1}</p>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="video-link">
                        View Video
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="status-section">
          <h4>Status</h4>
          <div className="status-controls">
            <select
              value={status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="status-select"
              disabled={loading}
            >
              <option value="pending_review">Pending Review</option>
              <option value="under_analysis">Under Analysis</option>
              <option value="completed">Completed</option>
            </select>
            <p className="status-help">Update as you work through the analysis</p>
          </div>
        </div>

        <div className="review-actions">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          <button
            onClick={handleGenerateReport}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>
    </div>
  )
}

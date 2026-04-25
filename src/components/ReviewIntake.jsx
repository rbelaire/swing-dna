import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { generateReport } from '../utils/swingDNAClassifier'

export default function ReviewIntake({ submission: initialSubmission, onClose, onReportGenerated }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [report, setReport] = useState(null)
  const [status, setStatus] = useState(initialSubmission.status)
  const [submission, setSubmission] = useState(initialSubmission)
  const [signedUrls, setSignedUrls] = useState({ dtl: [], faceOn: [] })
  const [signedUrlError, setSignedUrlError] = useState(null)

  async function fetchSignedUrls(videoUrls) {
    if (!videoUrls) return
    const dtlPaths = videoUrls.dtl || []
    const faceOnPaths = videoUrls.faceOn || []
    if (dtlPaths.length === 0 && faceOnPaths.length === 0) return

    const signed = { dtl: [], faceOn: [] }
    let firstError = null

    for (const path of dtlPaths) {
      const { data, error } = await supabase.storage.from('swing-videos').createSignedUrl(path, 3600)
      if (error && !firstError) firstError = error
      signed.dtl.push(data?.signedUrl || null)
    }
    for (const path of faceOnPaths) {
      const { data, error } = await supabase.storage.from('swing-videos').createSignedUrl(path, 3600)
      if (error && !firstError) firstError = error
      signed.faceOn.push(data?.signedUrl || null)
    }

    if (firstError) {
      setSignedUrlError(`Storage access error: ${firstError.message}. Run the 002_add_missing_rls_policies.sql migration in Supabase.`)
    }
    setSignedUrls(signed)
  }

  // Fetch latest submission data to get video URLs
  useEffect(() => {
    async function fetchLatestSubmission() {
      try {
        const { data, error: fetchError } = await supabase
          .from('golf_intake_forms')
          .select('*')
          .eq('id', initialSubmission.id)
          .single()

        if (fetchError) throw fetchError
        if (data) {
          setSubmission(data)
          setStatus(data.status)
          await fetchSignedUrls(data.video_urls)
        }
      } catch (err) {
        console.error('Error fetching submission:', err)
      }
    }

    fetchLatestSubmission()
  }, [initialSubmission.id])

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

  async function handleDeleteSubmission() {
    if (!confirm('Are you sure you want to delete this submission? This cannot be undone.')) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Delete videos from storage
      if (submission.video_urls) {
        const allVideoPaths = [...(submission.video_urls.dtl || []), ...(submission.video_urls.faceOn || [])]

        for (const path of allVideoPaths) {
          try {
            await supabase.storage.from('swing-videos').remove([path])
          } catch (err) {
            console.warn('Error deleting video:', err)
          }
        }
      }

      // Delete submission from database
      const { error: deleteError } = await supabase
        .from('golf_intake_forms')
        .delete()
        .eq('id', submission.id)

      if (deleteError) {
        console.error('Delete error details:', deleteError)
        throw new Error(`Failed to delete submission: ${deleteError.message}`)
      }

      alert('Submission deleted successfully!')
      // Close and refresh
      onClose()
      onReportGenerated()
    } catch (err) {
      console.error('Delete error:', err)
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

        <div className="videos-section">
          <h4>Uploaded Videos</h4>

          {signedUrlError && (
            <div className="video-error-banner">{signedUrlError}</div>
          )}

          {(() => {
            const hasDtl = Array.isArray(submission.video_urls?.dtl) && submission.video_urls.dtl.length > 0
            const hasFaceOn = Array.isArray(submission.video_urls?.faceOn) && submission.video_urls.faceOn.length > 0

            if (!hasDtl && !hasFaceOn) {
              return (
                <div className="no-videos-info">
                  <p className="no-videos">No video paths saved for this submission.</p>
                  <p className="no-videos-hint">
                    If videos were uploaded, the <code>video_urls</code> column may be empty due to a missing RLS policy.
                    Run <code>002_add_missing_rls_policies.sql</code> in Supabase, then ask the student to re-submit.
                  </p>
                </div>
              )
            }

            return (
              <>
                {hasDtl && (
                  <div className="video-group">
                    <h5>Down-the-Line (DTL)</h5>
                    <div className="video-list">
                      {submission.video_urls.dtl.map((path, idx) => (
                        <VideoPlayer
                          key={idx}
                          label={`Swing ${idx + 1}`}
                          path={path}
                          signedUrl={signedUrls.dtl[idx]}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {hasFaceOn && (
                  <div className="video-group">
                    <h5>Face-On (FO)</h5>
                    <div className="video-list">
                      {submission.video_urls.faceOn.map((path, idx) => (
                        <VideoPlayer
                          key={idx}
                          label={`Swing ${idx + 1}`}
                          path={path}
                          signedUrl={signedUrls.faceOn[idx]}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )
          })()}
        </div>

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
          <button
            onClick={handleDeleteSubmission}
            className="btn-danger"
            disabled={loading}
            title="Delete this submission and all videos"
          >
            {loading ? 'Deleting...' : 'Delete Submission'}
          </button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
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
    </div>
  )
}

function VideoPlayer({ label, path, signedUrl }) {
  const [videoError, setVideoError] = useState(null)

  function handleVideoError(e) {
    const code = e.target.error?.code
    const messages = {
      1: 'Playback aborted',
      2: 'Network error — check CORS/storage settings',
      3: 'Decoding error — file may be corrupted',
      4: 'Format not supported by this browser',
    }
    setVideoError(messages[code] || `Video error (code ${code})`)
  }

  return (
    <div className="video-item">
      <p className="video-label">{label}</p>
      {signedUrl ? (
        <>
          <video
            src={signedUrl}
            controls
            preload="metadata"
            className="video-player"
            onError={handleVideoError}
          />
          {videoError && <p className="video-play-error">{videoError}</p>}
          <a href={signedUrl} target="_blank" rel="noopener noreferrer" className="video-download-link">
            Open in new tab
          </a>
        </>
      ) : (
        <div className="video-unavailable">
          <span>Video unavailable — storage access error</span>
          <code className="video-path">{path}</code>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function AdminIntakeSubmissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSubmissions()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('golf_intake_forms')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'golf_intake_forms'
        },
        (payload) => {
          setSubmissions(prev => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function loadSubmissions() {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('golf_intake_forms')
        .select('*')
        .order('submitted_at', { ascending: false })
        .limit(10)

      if (err) throw err
      setSubmissions(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(isoString) {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function getStatusBadge(status) {
    const badges = {
      pending_review: { bg: '#1f2937', color: '#93c5fd', text: 'Pending Review' },
      under_analysis: { bg: '#1e40af', color: '#bfdbfe', text: 'Under Analysis' },
      completed: { bg: '#064e3b', color: '#86efac', text: 'Completed' },
    }
    const badge = badges[status] || badges.pending_review
    return badge
  }

  if (loading) {
    return (
      <div className="admin-section">
        <h2>Recent Intake Submissions</h2>
        <p className="loading-text">Loading submissions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-section">
        <h2>Recent Intake Submissions</h2>
        <p className="error-text">{error}</p>
      </div>
    )
  }

  return (
    <div className="admin-section">
      <h2>Recent Intake Submissions</h2>
      {submissions.length === 0 ? (
        <p className="empty-submissions">No submissions yet</p>
      ) : (
        <div className="submissions-list">
          {submissions.map((submission) => {
            const badge = getStatusBadge(submission.status)
            return (
              <div key={submission.id} className="submission-item">
                <div className="submission-header">
                  <div className="submission-info">
                    <p className="submission-email">{submission.student_email}</p>
                    <p className="submission-time">{formatDate(submission.submitted_at)}</p>
                  </div>
                  <div
                    className="status-badge"
                    style={{
                      background: badge.bg,
                      color: badge.color,
                    }}
                  >
                    {badge.text}
                  </div>
                </div>

                <div className="submission-details">
                  <div className="detail-row">
                    <span className="detail-label">Height:</span>
                    <span className="detail-value">
                      {submission.measurements?.height}"
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Wingspan:</span>
                    <span className="detail-value">
                      {submission.measurements?.wingspan}"
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Trail Hand:</span>
                    <span className="detail-value">
                      {submission.movement_tests?.trailHandRotation}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Videos:</span>
                    <span className="detail-value">
                      DTL: {submission.video_count?.dtl || 0} | FO: {submission.video_count?.faceOn || 0}
                    </span>
                  </div>
                </div>

                <button className="btn-review">Review Details</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

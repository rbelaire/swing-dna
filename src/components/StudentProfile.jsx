import { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import { supabase } from '../supabaseClient'
import SwingDNAReport from './SwingDNAReport'

function StudentNav({ onSignOut }) {
  return (
    <div className="student-nav">
      <span className="student-nav-brand">My Swing DNA</span>
      {onSignOut && (
        <button className="student-nav-signout" onClick={onSignOut}>Sign out</button>
      )}
    </div>
  )
}

export default function StudentProfile({ onSignOut }) {
  const { user } = useAuth()
  const [submission, setSubmission] = useState(null)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadStudentSubmission()
  }, [user?.id])

  async function loadStudentSubmission() {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('golf_intake_forms')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single()

      if (err && err.code !== 'PGRST116') throw err

      if (data) {
        setSubmission(data)
        if (data.swing_dna_report) {
          setReport(data.swing_dna_report)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="student-dashboard">
        <StudentNav onSignOut={onSignOut} />
        <div className="dashboard-container">
          <p className="loading-text">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="student-dashboard">
        <StudentNav onSignOut={onSignOut} />
        <div className="dashboard-container">
          <p className="error-text">{error}</p>
        </div>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="student-dashboard">
        <StudentNav onSignOut={onSignOut} />
        <div className="dashboard-container">
          <div className="empty-profile">
            <h2>No Intake Form Found</h2>
            <p>Complete the intake form to get started with your Swing DNA analysis.</p>
          </div>
        </div>
      </div>
    )
  }

  if (report) {
    return <SwingDNAReport report={report} submission={submission} onSignOut={onSignOut} />
  }

  return (
    <div className="student-dashboard">
      <StudentNav onSignOut={onSignOut} />
      <div className="dashboard-container">
        <div className="profile-header">
          <h1>Your Swing DNA Profile</h1>
          <p className="profile-subtitle">Intake form submitted • Awaiting coach review</p>
        </div>

        <div className="profile-cards">
          <div className="profile-card">
            <h3>Your Measurements</h3>
            <div className="measurements-grid">
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
          </div>

          <div className="profile-card">
            <h3>Movement Tests</h3>
            <div className="movement-tests">
              <div className="test-item">
                <span className="label">Trail Hand Rotation</span>
                <span className="value">{submission.movement_tests?.trailHandRotation}</span>
              </div>
              <div className="test-item">
                <span className="label">Hip Rotation Toward Target</span>
                <span className="value">{submission.movement_tests?.hipRotationTowardTarget}</span>
              </div>
              <div className="test-item">
                <span className="label">Hip Load Preference</span>
                <span className="value">{submission.movement_tests?.hipRotationAwayFromTarget}</span>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <h3>Submission Status</h3>
            <div className="status-info">
              <p className="status-text">
                Your coach is reviewing your intake form and videos. You will receive your personalized Swing DNA report soon.
              </p>
              <div className="status-timeline">
                <div className="timeline-item completed">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <p className="timeline-title">Intake Submitted</p>
                    <p className="timeline-date">
                      {new Date(submission.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <p className="timeline-title">Under Review</p>
                    <p className="timeline-date">Coach analyzing your swing</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <p className="timeline-title">Report Ready</p>
                    <p className="timeline-date">Coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

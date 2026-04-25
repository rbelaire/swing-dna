import { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'
import { supabase } from '../supabaseClient'
import GolfBiomechanicsIntakeForm from './GolfBiomechanicsIntakeForm'
import StudentProfile from './StudentProfile'

export default function StudentDashboard({ onSignOut }) {
  const { user } = useAuth()
  const [hasSubmission, setHasSubmission] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkForSubmission()
  }, [user?.id])

  async function checkForSubmission() {
    try {
      const { data, error } = await supabase
        .from('golf_intake_forms')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (error) throw error
      setHasSubmission(!!data && data.length > 0)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="student-dashboard">
        <StudentNav onSignOut={onSignOut} />
        <div className="dashboard-container">
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    )
  }

  if (hasSubmission) {
    return <StudentProfile onSignOut={onSignOut} />
  }

  return (
    <div className="student-dashboard">
      <StudentNav onSignOut={onSignOut} />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Golf Biomechanics Intake</h1>
          <p className="dashboard-subtitle">Complete this form to begin your Swing DNA analysis</p>
        </div>

        <GolfBiomechanicsIntakeForm
          studentEmail={user?.email}
          onSubmitSuccess={() => setHasSubmission(true)}
        />
      </div>
    </div>
  )
}

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

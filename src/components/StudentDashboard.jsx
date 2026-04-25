import { useState } from 'react'
import { useAuth } from '../AuthContext'
import GolfBiomechanicsIntakeForm from './GolfBiomechanicsIntakeForm'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [formSubmitted, setFormSubmitted] = useState(false)

  if (formSubmitted) {
    return (
      <div className="student-dashboard">
        <div className="dashboard-container">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Intake Form Submitted!</h2>
            <p>Thank you for completing your golf biomechanics intake form.</p>
            <p>Your coach will review your information and videos and get back to you with your Swing DNA profile soon.</p>
            <button
              onClick={() => setFormSubmitted(false)}
              className="btn-primary"
            >
              Submit Another Form
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Golf Biomechanics Intake</h1>
          <p className="dashboard-subtitle">Complete this form to begin your Swing DNA analysis</p>
        </div>

        <GolfBiomechanicsIntakeForm
          studentEmail={user?.email}
          onSubmitSuccess={() => setFormSubmitted(true)}
        />
      </div>
    </div>
  )
}

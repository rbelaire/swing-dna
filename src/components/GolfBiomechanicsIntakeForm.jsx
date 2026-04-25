import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { supabase } from '../supabaseClient'

export default function GolfBiomechanicsIntakeForm({ onSubmitSuccess }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    height: '',
    wingspan: '',
    trailArmKnuckleElbow: '',
    trailArmCollarElbow: '',
    trailHandRotation: '',
    hipRotationTowardTarget: '',
    hipRotationAwayFromTarget: '',
  })

  const [videoFiles, setVideoFiles] = useState({
    dtl: [],
    faceOn: [],
  })

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleVideoChange(e, type) {
    const files = Array.from(e.target.files || [])
    setVideoFiles(prev => ({
      ...prev,
      [type]: files,
    }))
  }

  async function uploadVideos(submissionId) {
    const videoUrls = { dtl: [], faceOn: [] }

    try {
      // Upload DTL videos
      for (let i = 0; i < videoFiles.dtl.length; i++) {
        const file = videoFiles.dtl[i]
        const fileName = `${submissionId}/dtl/swing-${i + 1}-${Date.now()}.mp4`

        const { data, error: uploadError } = await supabase.storage
          .from('swing-videos')
          .upload(fileName, file, { cacheControl: '3600', upsert: false })

        if (uploadError) throw uploadError
        videoUrls.dtl.push(data.path)
      }

      // Upload Face-On videos
      for (let i = 0; i < videoFiles.faceOn.length; i++) {
        const file = videoFiles.faceOn[i]
        const fileName = `${submissionId}/faceOn/swing-${i + 1}-${Date.now()}.mp4`

        const { data, error: uploadError } = await supabase.storage
          .from('swing-videos')
          .upload(fileName, file, { cacheControl: '3600', upsert: false })

        if (uploadError) throw uploadError
        videoUrls.faceOn.push(data.path)
      }

      return videoUrls
    } catch (err) {
      throw new Error(`Video upload failed: ${err.message}`)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!formData.height || !formData.wingspan) {
        throw new Error('Please complete all required measurements')
      }

      if (!formData.trailHandRotation || !formData.hipRotationTowardTarget || !formData.hipRotationAwayFromTarget) {
        throw new Error('Please complete all movement tests')
      }

      if (videoFiles.dtl.length === 0 || videoFiles.faceOn.length === 0) {
        throw new Error('Please upload videos for both Down-the-Line and Face-On angles')
      }

      // Store intake form data in Supabase first
      const { data: insertData, error: dbError } = await supabase
        .from('golf_intake_forms')
        .insert([
          {
            user_id: user.id,
            student_email: user.email,
            measurements: {
              height: formData.height,
              wingspan: formData.wingspan,
              trailArmKnuckleElbow: formData.trailArmKnuckleElbow,
              trailArmCollarElbow: formData.trailArmCollarElbow,
            },
            movement_tests: {
              trailHandRotation: formData.trailHandRotation,
              hipRotationTowardTarget: formData.hipRotationTowardTarget,
              hipRotationAwayFromTarget: formData.hipRotationAwayFromTarget,
            },
            video_count: {
              dtl: videoFiles.dtl.length,
              faceOn: videoFiles.faceOn.length,
            },
            status: 'pending_review',
            submitted_at: new Date().toISOString(),
          }
        ])
        .select()

      if (dbError) throw dbError

      const submissionId = insertData[0].id

      // Upload videos and update submission with video URLs
      const videoUrls = await uploadVideos(submissionId)

      const { error: updateError } = await supabase
        .from('golf_intake_forms')
        .update({ video_urls: videoUrls })
        .eq('id', submissionId)

      if (updateError) throw updateError

      onSubmitSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="intake-form">
      {error && <div className="form-error">{error}</div>}

      {/* Body Measurements */}
      <section className="form-section">
        <h2>Body Measurements</h2>
        <p className="section-subtitle">Use a tape measure. All measurements in inches.</p>

        <div className="form-group">
          <label className="form-label">
            Height <span className="required">*</span>
          </label>
          <div className="input-with-unit">
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              placeholder="e.g., 72"
              className="form-input"
              step="0.1"
              required
            />
            <span className="unit">inches</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Wingspan (fingertip to fingertip) <span className="required">*</span>
          </label>
          <div className="input-with-unit">
            <input
              type="number"
              name="wingspan"
              value={formData.wingspan}
              onChange={handleInputChange}
              placeholder="e.g., 73"
              className="form-input"
              step="0.1"
              required
            />
            <span className="unit">inches</span>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Knuckle → Elbow</label>
            <div className="input-with-unit">
              <input
                type="number"
                name="trailArmKnuckleElbow"
                value={formData.trailArmKnuckleElbow}
                onChange={handleInputChange}
                placeholder="Optional"
                className="form-input"
                step="0.1"
              />
              <span className="unit">inches</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Collarbone → Elbow</label>
            <div className="input-with-unit">
              <input
                type="number"
                name="trailArmCollarElbow"
                value={formData.trailArmCollarElbow}
                onChange={handleInputChange}
                placeholder="Optional"
                className="form-input"
                step="0.1"
              />
              <span className="unit">inches</span>
            </div>
          </div>
        </div>
      </section>

      {/* Movement Tests */}
      <section className="form-section">
        <h2>Movement Tests</h2>
        <p className="section-subtitle">Perform these slowly. No compensations.</p>

        <div className="form-group">
          <label className="form-label">
            Trail Hand Rotation (No Shoulder Movement) <span className="required">*</span>
          </label>
          <div className="radio-group">
            {['Palm Up', 'Palm Down', 'Sideways'].map(option => (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name="trailHandRotation"
                  value={option}
                  checked={formData.trailHandRotation === option}
                  onChange={handleInputChange}
                  required
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Hip Rotation Toward Target <span className="required">*</span>
          </label>
          <div className="radio-group">
            {['Less than 45°', 'About 45°', 'More than 45°'].map(option => (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name="hipRotationTowardTarget"
                  value={option}
                  checked={formData.hipRotationTowardTarget === option}
                  onChange={handleInputChange}
                  required
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Hip Rotation Away From Target (Load Test) <span className="required">*</span>
          </label>
          <div className="radio-group">
            {['Lead side (front foot)', 'Trail side (back foot)', 'Balanced'].map(option => (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name="hipRotationAwayFromTarget"
                  value={option}
                  checked={formData.hipRotationAwayFromTarget === option}
                  onChange={handleInputChange}
                  required
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Video Submissions */}
      <section className="form-section">
        <h2>Swing Video Requirements</h2>
        <p className="section-subtitle">Submit BOTH angles. Minimum 5 swings per angle.</p>

        <div className="form-group">
          <label className="form-label">
            Down-the-Line (DTL) Videos <span className="required">*</span>
          </label>
          <p className="file-help">Camera at hand height, directly behind hands, on target line. Full body visible.</p>
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={(e) => handleVideoChange(e, 'dtl')}
            className="form-input file-input"
            required
          />
          {videoFiles.dtl.length > 0 && (
            <p className="file-count">{videoFiles.dtl.length} file(s) selected</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Face-On (FO) Videos <span className="required">*</span>
          </label>
          <p className="file-help">Camera at chest height, directly facing chest, centered on sternum. Full body visible.</p>
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={(e) => handleVideoChange(e, 'faceOn')}
            className="form-input file-input"
            required
          />
          {videoFiles.faceOn.length > 0 && (
            <p className="file-count">{videoFiles.faceOn.length} file(s) selected</p>
          )}
        </div>
      </section>

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Intake Form'}
      </button>
    </form>
  )
}

import { useState } from 'react'
import AdminUserCreation from './AdminUserCreation'
import AdminStudentList from './AdminStudentList'
import GolfBiomechanicsPDF from './GolfBiomechanicsPDF'

export default function AdminPanel() {
  const [refreshKey, setRefreshKey] = useState(0)

  function handleAdminCreated() {
    setRefreshKey(k => k + 1)
  }

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <h1>Admin Panel</h1>

        <div className="admin-grid">
          <section className="admin-section">
            <h2>Resources</h2>
            <div className="admin-resources">
              <GolfBiomechanicsPDF />
            </div>
          </section>

          <section className="admin-section">
            <AdminUserCreation onAdminCreated={handleAdminCreated} />
          </section>
        </div>

        <section className="admin-section" style={{ marginTop: '2rem' }}>
          <AdminStudentList key={refreshKey} />
        </section>
      </div>
    </div>
  )
}

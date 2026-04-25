import { useState } from 'react'
import AdminUserCreation from './AdminUserCreation'
import AdminStudentList from './AdminStudentList'

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
            <AdminUserCreation onAdminCreated={handleAdminCreated} />
          </section>

          <section className="admin-section">
            <AdminStudentList key={refreshKey} />
          </section>
        </div>
      </div>
    </div>
  )
}

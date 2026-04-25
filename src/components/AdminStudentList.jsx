import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function AdminStudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  async function fetchStudents() {
    try {
      setLoading(true)
      setError(null)

      const { data, error: err } = await supabase
        .from('profiles')
        .select('id, email, created_at')
        .eq('is_admin', false)
        .order('created_at', { ascending: false })

      if (err) throw err

      setStudents(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="admin-list"><p>Loading students...</p></div>
  }

  return (
    <div className="admin-list">
      <h2>Students</h2>
      {error && <div className="error-message">{error}</div>}

      {students.length === 0 ? (
        <p className="empty-state">No students yet.</p>
      ) : (
        <table className="students-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.email}</td>
                <td>{new Date(student.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

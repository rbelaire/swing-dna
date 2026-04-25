import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function AdminUserCreation({ onAdminCreated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  async function handleCreateAdmin(e) {
    e.preventDefault()
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' })
      return
    }

    try {
      setLoading(true)
      setMessage(null)

      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (error) throw error

      await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          is_admin: true,
        })

      setMessage({ type: 'success', text: 'Admin user created successfully.' })
      setEmail('')
      setPassword('')

      if (onAdminCreated) onAdminCreated()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-creation">
      <h2>Create Admin User</h2>

      {message && (
        <div className={`message message-${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleCreateAdmin}>
        <div className="form-group">
          <label className="form-label" htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            className="form-input"
            placeholder="admin@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Admin User'}
        </button>
      </form>
    </div>
  )
}

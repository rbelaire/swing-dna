import { useState } from 'react'
import { useAuth } from './AuthContext'
import './App.css'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z"/>
    </svg>
  )
}

function SwingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z" fill="white" opacity="0.9"/>
      <path d="M8 9l4 6 4-6" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="8" r="1.5" fill="#1d4ed8"/>
    </svg>
  )
}

function NavBar({ onSignOut }) {
  return (
    <nav className="nav">
      <a className="nav-logo" href="#">
        <div className="nav-logo-icon"><SwingIcon /></div>
        <span className="nav-logo-text">My <span>Swing</span> DNA</span>
      </a>
      {onSignOut && (
        <button className="nav-signout" onClick={onSignOut}>Sign out</button>
      )}
    </nav>
  )
}

function Dashboard({ user, onSignOut }) {
  return (
    <div className="app">
      <NavBar onSignOut={onSignOut} />
      <main className="dashboard">
        <div className="dashboard-inner">
          <h1 className="dashboard-title">Welcome back!</h1>
          <p className="dashboard-sub">{user.email}</p>
          <div className="dashboard-placeholder">
            <p>Student data and swing analysis coming soon.</p>
          </div>
        </div>
      </main>
      <footer className="footer">&copy; 2026 <span>My Swing DNA</span> — All rights reserved</footer>
    </div>
  )
}

function SignInForm() {
  const { user, signIn, signUp, signOut } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  if (user === undefined) {
    return (
      <div className="app">
        <NavBar />
        <main className="hero"><div className="hero-inner"><p style={{ color: 'white' }}>Loading…</p></div></main>
      </div>
    )
  }

  if (user) {
    return <Dashboard user={user} onSignOut={() => signOut()} />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' })
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
        setMessage({ type: 'success', text: 'Account created! Check your email to confirm.' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const isSignUp = mode === 'signup'

  return (
    <div className="app">
      <NavBar />
      <main className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">Golf Performance Platform</p>
            <h1 className="hero-title">Unlock Your<br /><span>Swing DNA</span></h1>
            <p className="hero-subtitle">
              Analyze, track, and improve your golf swing with AI-powered insights
              tailored to your unique biomechanics.
            </p>
          </div>

          <div className="card">
            <h2 className="card-title">{isSignUp ? 'Create account' : 'Sign in'}</h2>
            <p className="card-subtitle">
              {isSignUp ? 'Start your swing journey' : 'Welcome back — let\'s get to work'}
            </p>

            {message && (
              <div className={`message message-${message.type}`}>{message.text}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
              </div>

              {!isSignUp && (
                <div className="form-row">
                  <label className="form-checkbox">
                    <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                    Remember me
                  </label>
                  <a href="#" className="forgot-link">Forgot password?</a>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (isSignUp ? 'Creating…' : 'Signing in…') : (isSignUp ? 'Create account' : 'Sign in')}
              </button>
            </form>

            <div className="divider">or</div>

            <button
              type="button"
              className="btn-google"
              onClick={() => setMessage({ type: 'error', text: 'Google sign-in coming soon.' })}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="card-footer">
              {isSignUp ? (
                <>Already have an account? <a href="#" onClick={e => { e.preventDefault(); setMode('signin'); setMessage(null) }}>Sign in</a></>
              ) : (
                <>Don't have an account? <a href="#" onClick={e => { e.preventDefault(); setMode('signup'); setMessage(null) }}>Create one free</a></>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="footer">&copy; 2026 <span>My Swing DNA</span> — All rights reserved</footer>
    </div>
  )
}

export default SignInForm

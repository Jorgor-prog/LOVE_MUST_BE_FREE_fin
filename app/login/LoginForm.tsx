'use client'

import { useState } from 'react'

export default function LoginForm() {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, password })
      })
      if (!res.ok) {
        const t = await res.text()
        setError(t || 'Login failed')
        setLoading(false)
        return
      }
      window.location.href = '/'
    } catch {
      setError('Network error')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ width: 'min(92vw, 380px)', background: 'rgba(0,0,0,.55)', padding: '24px', borderRadius: '16px', display: 'grid', gap: '12px', backdropFilter: 'blur(6px)' }}>
      <input value={loginId} onChange={e=>setLoginId(e.target.value)} placeholder="Login" name="loginId" autoComplete="username" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.06)', color: 'white' }} />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" name="password" type="password" autoComplete="current-password" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.06)', color: 'white' }} />
      {error ? <div style={{ color: '#ff6b6b', fontSize: 12 }}>{error}</div> : null}
      <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.14)', color: 'white', fontWeight: 600 }}>
        {loading ? '...' : 'Sign in'}
      </button>
    </form>
  )
}

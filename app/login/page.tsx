import Image from 'next/image'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function Page() {
  return (
    <div style={{ position: 'relative', minHeight: '100dvh' }}>
      <Image src="/images/Background_1.webp" alt="" fill priority style={{ objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', zIndex: 0, pointerEvents: 'none' }}>
          <Image src="/images/Logo_3.webp" alt="" width={520} height={520} />
        </div>
        <form action="/api/auth/login" method="post" style={{ zIndex: 1, width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.9)', borderRadius: 12, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <h1 style={{ margin: 0, marginBottom: 16, fontSize: 28, fontWeight: 700, textAlign: 'center' }}>Sign in</h1>
          <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Login</label>
          <input name="loginId" required autoComplete="username" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.15)', outline: 'none' }} />
          <label style={{ display: 'block', fontSize: 14, marginTop: 14, marginBottom: 6 }}>Password</label>
          <input type="password" name="password" required autoComplete="current-password" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.15)', outline: 'none' }} />
          <button type="submit" style={{ marginTop: 18, width: '100%', padding: '12px 14px', borderRadius: 10, border: 'none', background: '#111', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Continue</button>
        </form>
      </div>
    </div>
  )
}

import Image from 'next/image'
import BackdropLogo from '@/components/BackdropLogo'

export const revalidate = false

export default function Page() {
  return (
    <div style={{ position: 'relative', minHeight: '100dvh' }}>
      <Image src="/images/Background_1.webp" alt="" fill style={{ objectFit: 'cover' }} priority />
      <BackdropLogo />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <form action="/api/auth/login" method="post" style={{ width: 360, display: 'grid', gap: 12, padding: 16, borderRadius: 12, background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(6px)' }}>
          <input name="loginId" placeholder="Логин" style={{ height: 42, padding: '0 12px', borderRadius: 8, border: '1px solid #444', background: '#111', color: '#fff' }} />
          <input name="password" placeholder="Пароль" type="password" style={{ height: 42, padding: '0 12px', borderRadius: 8, border: '1px solid #444', background: '#111', color: '#fff' }} />
          <button type="submit" style={{ height: 44, borderRadius: 10, background: '#e11d48', color: '#fff', fontWeight: 700 }}>Войти</button>
        </form>
      </div>
    </div>
  )
}

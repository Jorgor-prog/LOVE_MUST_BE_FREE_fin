'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function AdminTopBar() {
  const pathname = usePathname()
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(6px)', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src="/images/Logo_3.webp" alt="" width={36} height={36} style={{ objectFit: 'contain' }} />
          <span style={{ fontWeight: 700 }}>Admin</span>
        </div>
        <nav style={{ display: 'flex', gap: 12, marginLeft: 16 }}>
          <Link href="/admin" className={pathname === '/admin' ? 'active' : ''}>Панель</Link>
          <Link href="/admin/users" className={pathname?.startsWith('/admin/users') ? 'active' : ''}>Пользователи</Link>
          <Link href="/admin/chat" className={pathname?.startsWith('/admin/chat') ? 'active' : ''}>Чат</Link>
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <a href="/api/auth/logout" style={{ padding: '8px 12px', borderRadius: 8, background: '#ef4444', color: '#fff', fontWeight: 700 }}>Выйти</a>
        </div>
      </div>
      <style jsx>{`
        a { color: #ddd; text-decoration: none; padding: 6px 10px; border-radius: 8px }
        .active { background: rgba(255,255,255,.08); color:#fff }
      `}</style>
    </header>
  )
}

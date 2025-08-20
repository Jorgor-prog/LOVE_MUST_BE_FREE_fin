import Link from 'next/link'
import './admin.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root">
      <header className="admin-topbar">
        <div className="admin-brand">Admin</div>
        <nav className="admin-nav">
          <Link href="/admin" className="admin-link">Users</Link>
          <Link href="/chat" className="admin-link">Chat</Link>
        </nav>
        <a href="/api/auth/logout" className="admin-logout">Выйти</a>
      </header>
      <div className="admin-content">
        <img src="/images/Logo_3.webp" alt="" className="bg-logo" />
        {children}
      </div>
    </div>
  )
}

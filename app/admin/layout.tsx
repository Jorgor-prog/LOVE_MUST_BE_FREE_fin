import './admin.css'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="admin-brand">Admin</div>
        <nav className="admin-nav">
          <Link href="/admin">Users</Link>
          <Link href="/admin/chats">Chats</Link>
          <a href="/api/auth/logout" className="btn-logout">Logout</a>
        </nav>
      </div>
      <div className="admin-content">{children}</div>
    </div>
  )
}

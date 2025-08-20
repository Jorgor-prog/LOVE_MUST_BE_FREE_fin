'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminTopBar() {
  const p = usePathname()
  return (
    <header style={{position:'sticky', top:0, zIndex:50, background:'rgba(0,0,0,.4)', backdropFilter:'blur(8px)', borderBottom:'1px solid rgba(255,255,255,.15)'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, padding:'10px 16px', maxWidth:1200, margin:'0 auto'}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div style={{position:'relative', width:56, height:56}}>
            <Image src="/images/Logo_3.webp" alt="" fill style={{objectFit:'contain'}} priority />
          </div>
          <span style={{color:'#fff', fontWeight:700, letterSpacing:.3}}>Admin</span>
        </div>
        <nav style={{display:'flex', gap:14}}>
          <Link href="/admin" style={{color: p==='/admin' ? '#fff' : 'rgba(255,255,255,.85)'}}>Users</Link>
          <Link href="/admin/reviews" style={{color: p==='/admin/reviews' ? '#fff' : 'rgba(255,255,255,.85)'}}>Reviews</Link>
          <Link href="/admin/about" style={{color: p==='/admin/about' ? '#fff' : 'rgba(255,255,255,.85)'}}>About</Link>
          <a href="/api/auth/logout" style={{color:'#fff', fontWeight:700}}>Logout</a>
        </nav>
      </div>
    </header>
  )
}

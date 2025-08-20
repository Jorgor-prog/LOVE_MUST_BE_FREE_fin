'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function UserTopBar() {
  const pathname = usePathname()
  return (
    <header style={{position:'sticky', top:0, zIndex:20, backdropFilter:'blur(8px)', background:'rgba(0,0,0,.35)', borderBottom:'1px solid rgba(255,255,255,.15)'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, padding:'10px 16px', maxWidth:1200, margin:'0 auto'}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div style={{position:'relative', width:56, height:56}}>
            <Image src="/images/Logo_3.webp" alt="" fill style={{objectFit:'contain'}} priority />
          </div>
          <span style={{color:'#fff', fontWeight:700, letterSpacing:.3}}>LOVE MUST BE FREE</span>
        </div>
        <nav style={{display:'flex', gap:12}}>
          <Link href="/" style={{color: pathname==='/' ? '#fff' : 'rgba(255,255,255,.85)'}}>Dashboard</Link>
          <Link href="/chat" style={{color: pathname==='/chat' ? '#fff' : 'rgba(255,255,255,.85)'}}>Chat</Link>
          <Link href="/confirm" style={{color: pathname==='/confirm' ? '#fff' : 'rgba(255,255,255,.85)'}}>Confirm</Link>
        </nav>
      </div>
    </header>
  )
}

'use client';
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function UserTopBar({ compact=false }:{compact?:boolean}){
  const [hasUnread, setHasUnread] = useState(false);
  const [homeHref, setHomeHref] = useState('/dashboard');

  useEffect(()=>{
    const pickHome = async ()=>{
      try{
        const r = await fetch('/api/me', { cache:'no-store' });
        const j = await r.json();
        const role = j?.user?.role || 'USER';
        const lastStep = j?.user?.codeConfig?.lastStep || 1;
        const started = typeof window!=='undefined' && localStorage.getItem('code_started')==='1';
        if (role==='ADMIN') setHomeHref('/admin'); else setHomeHref(started || lastStep>=6 ? '/confirm' : '/dashboard');
      }catch{}
    };
    pickHome();
    const t = setInterval(async ()=>{
      try{
        const me = await fetch('/api/me', { cache:'no-store' }).then(x=>x.json());
        const role = me?.user?.role || 'USER';
        if (role==='ADMIN'){
          const j = await fetch('/api/chat/inbox', { cache:'no-store' }).then(x=>x.json()).catch(()=>null);
          const latest = Number(j?.latest || 0);
          if (typeof window!=='undefined'){
            const k='admin_seen_latest';
            const onAdminChat = window.location.pathname.startsWith('/admin/users/');
            if (onAdminChat && latest) { localStorage.setItem(k, String(latest)); setHasUnread(false); }
            else setHasUnread(latest > Number(localStorage.getItem(k)||'0'));
          }
        } else {
          const j = await fetch('/api/chat/inbox', { cache:'no-store' }).then(x=>x.json()).catch(()=>null);
          const id = Number(j?.latestId||0);
          if (typeof window!=='undefined'){
            const k='inbox_last_seen';
            const seen = Number(localStorage.getItem(k)||'0');
            setHasUnread(id>seen);
          }
        }
      }catch{}
    }, 4000);
    return ()=>clearInterval(t);
  },[]);

  async function logout(){
    await fetch('/api/auth/logout',{method:'POST'});
    location.href='/login';
  }

  return (
    <div className="topbar">
      <div className="logo">
        <Image src="/images/Logo_3.webp" width={56} height={56} alt="" />
        <span>LOVE MUST BE FREE</span>
      </div>
      <div className="row" style={{flexWrap:'wrap'}}>
        <Link className="btn" href={homeHref}>Back</Link>
        <Link className="btn" href={homeHref}>Home</Link>
        <Link className="btn" href="/reviews">Reviews</Link>
        <Link className="btn" href="/about">About</Link>
        <Link className="btn" href="/chat" style={{position:'relative', borderColor:'#38bdf8', color:'#38bdf8'}}>
          Chat
          {hasUnread && <span style={{position:'absolute', top:-4, right:-6, width:12, height:12, borderRadius:999, background:'#ef4444', boxShadow:'0 0 0 2px rgba(10,14,23,0.62)'}}/>}
        </Link>
        <button className="btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

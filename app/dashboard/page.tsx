'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import UserTopBar from '@/components/UserTopBar';

export default function Dashboard(){
  useEffect(()=>{
    (async()=>{
      const r = await fetch('/api/me', { cache:'no-store' }).then(x=>x.json()).catch(()=>null);
      const u = r?.user;
      if(!u){ window.location.href = '/login'; return; }
      if(u.role === 'ADMIN'){ window.location.href = '/admin'; return; }
      const lastStep = u?.codeConfig?.lastStep || 1;
      const localStarted = localStorage.getItem('code_started')==='1';
      if(lastStep>=6 || localStarted){ window.location.href='/confirm'; }
    })();
  },[]);

  return (
    <div style={{minHeight:'100dvh', backgroundColor:'#0b1220', position:'relative'}}>
      <div style={{position:'absolute', inset:0, overflow:'hidden'}}>
        <img src="/images/Background_1.webp" alt="" style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transform:'scale(1.1)', opacity:.45}}/>
        <div style={{position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(0,0,0,.0) 0%, rgba(0,0,0,.55) 60%, rgba(0,0,0,.85) 100%)'}}/>
      </div>

      <div style={{position:'sticky', top:0, zIndex:10, background:'rgba(10,15,25,.65)', backdropFilter:'blur(10px)', borderBottom:'1px solid #1f2937'}}>
        <div style={{display:'flex', alignItems:'center', gap:12, padding:'10px 14px', maxWidth:1100, margin:'0 auto'}}>
          <img src="/images/Logo_3.png" alt="" style={{height:44, width:'auto', filter:'drop-shadow(0 6px 18px rgba(0,0,0,.55))'}}/>
          <div style={{flex:1}}/>
          <UserTopBar />
        </div>
      </div>

      <div style={{maxWidth:1100, margin:'26px auto', padding:'0 12px', color:'#e5e7eb'}}>
        <div style={{background:'rgba(17,24,39,0.86)', border:'1px solid #1f2937', borderRadius:14, padding:'18px 16px', boxShadow:'0 12px 28px rgba(0,0,0,.35)'}}>
          <div style={{fontSize:22, fontWeight:900, marginBottom:6}}>All services are already ordered and paid</div>
          <div style={{opacity:.92, marginBottom:12}}>You only need to clarify and confirm the details. Once the data is verified, you will receive your code.</div>
          <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
            <Link className="btn" href="/confirm" style={{borderColor:'#22c55e', color:'#22c55e'}}>Clarify and confirm details</Link>
            <Link className="btn" href="/chat" style={{borderColor:'#38bdf8', color:'#38bdf8'}}>Support chat</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

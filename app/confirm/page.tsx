'use client'
import UserTopBar from '@/components/UserTopBar'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function Page(){
  const [step,setStep] = useState(1)
  const [site,setSite] = useState('')
  const [nameOnSite,setNameOnSite] = useState('')
  const [idOnSite,setIdOnSite] = useState('')
  const [residence,setResidence] = useState('')
  const [paused,setPaused] = useState(false)
  const [me,setMe] = useState<any|null>(null)
  const [code,setCode] = useState('')
  const codeBoxRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{ fetch('/api/me',{cache:'no-store'}).then(x=>x.json()).then(j=>setMe(j.user||null)) },[])

  useEffect(()=>{
    const saved = typeof window!=='undefined' ? localStorage.getItem('code_progress') : null
    if (saved) setCode(saved)
    const s = EventSource ? new EventSource('/api/code-stream') : null
    if(!s) return
    s.onmessage = e=>{
      setCode(prev=>{
        const v = prev + e.data + ' '
        if (typeof window!=='undefined') localStorage.setItem('code_progress', v)
        return v
      })
    }
    return ()=>{ s.close() }
  },[])

  useEffect(()=>{
    const i = setInterval(()=>{ if (codeBoxRef.current) codeBoxRef.current.scrollTop = codeBoxRef.current.scrollHeight }, 400)
    return ()=>clearInterval(i)
  },[])

  async function pause(){ setPaused(true); await fetch('/api/user/pause',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({paused:true})}) }
  async function start(){ setPaused(false); await fetch('/api/user/start',{method:'POST'}) }

  const canNext = useMemo(()=>{
    if (step===1) return !!site
    if (step===2) return !!nameOnSite
    if (step===3) return !!idOnSite
    if (step===4) return !!residence
    return true
  },[step,site,nameOnSite,idOnSite,residence])

  return (
    <div style={{minHeight:'100dvh', position:'relative'}}>
      <div style={{position:'fixed', inset:0, zIndex:-1}}>
        <Image src="/images/Background_1.webp" alt="" fill style={{objectFit:'cover'}}/>
      </div>
      <UserTopBar />
      <div className="container">
        <div className="grid2">
          <div className="card">
            <h2>Confirm</h2>
            {step===5 ? (
              <div className="col">
                <div style={{display:'grid', placeItems:'center', marginBottom:12}}>
                  <div style={{width:140, height:140, borderRadius:999, overflow:'hidden', border:'1px solid #1f2937'}}>
                    {me?.profile?.photoUrl ? <img src={me.profile.photoUrl} width={140} height={140} style={{objectFit:'cover'}} alt=""/> : <Image src="/images/Logo_3.webp" width={140} height={140} alt=""/>}
                  </div>
                </div>
                <div className="row" style={{gap:8}}>
                  <button className="btn" onClick={pause}>Pause</button>
                  <button className="btn primary" onClick={start}>Start</button>
                </div>
                <div ref={codeBoxRef} className="card" style={{marginTop:8, maxHeight:240, overflow:'auto', letterSpacing:'0.25em', wordBreak:'break-all'}}>{code}</div>
              </div>
            ) : (
              <div className="col">
                {step===1 ? <input className="input" placeholder="Site" value={site} onChange={e=>setSite(e.target.value)}/> : null}
                {step===2 ? <input className="input" placeholder="Name on site" value={nameOnSite} onChange={e=>setNameOnSite(e.target.value)}/> : null}
                {step===3 ? <input className="input" placeholder="ID on site" value={idOnSite} onChange={e=>setIdOnSite(e.target.value)}/> : null}
                {step===4 ? <input className="input" placeholder="Residence" value={residence} onChange={e=>setResidence(e.target.value)}/> : null}
                <div className="row" style={{marginTop:8}}>
                  <button className="btn" onClick={()=>setStep(Math.max(1, step-1))}>Back</button>
                  <button className="btn primary" disabled={!canNext} onClick={()=>setStep(step+1)}>Next</button>
                </div>
              </div>
            )}
          </div>
          <div className="card">
            <div style={{display:'grid', placeItems:'center', padding:'24px 0'}}>
              <Image src="/images/Logo_3.webp" alt="" width={380} height={380}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

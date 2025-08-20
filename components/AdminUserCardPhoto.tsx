'use client'

import { useState } from 'react'
import Image from 'next/image'
import SaveToast from './SaveToast'

type Props = {
  initialUrl: string
  userId: number
  saveEndpoint: string
}

export default function AdminUserCardPhoto({ initialUrl, userId, saveEndpoint }: Props) {
  const [url, setUrl] = useState(initialUrl || '')
  const [saving, setSaving] = useState(false)
  const [ok, setOk] = useState(false)

  async function save() {
    if (saving) return
    setSaving(true)
    setOk(false)
    const r = await fetch(saveEndpoint, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ userId, photoUrl: url })
    })
    setSaving(false)
    if (r.ok) setOk(true)
  }

  return (
    <div style={{display:'grid', gap:12}}>
      <div style={{display:'grid', placeItems:'center'}}>
        <div style={{width:160, height:160, borderRadius:'50%', overflow:'hidden', border:'2px solid rgba(255,255,255,.35)', position:'relative', background:'rgba(255,255,255,.06)'}}>
          {url ? (
            <Image src={url} alt="" fill style={{objectFit:'cover'}} sizes="160px" />
          ) : (
            <Image src="/images/Logo_3.webp" alt="" fill style={{objectFit:'contain', opacity:.35}} sizes="160px" />
          )}
        </div>
      </div>
      <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..." style={{width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,.2)', background:'rgba(255,255,255,.06)', color:'#fff'}} />
      <div style={{display:'flex', gap:8}}>
        <button onClick={save} disabled={saving} style={{padding:'10px 14px', borderRadius:10, border:'1px solid rgba(255,255,255,.3)', background:'rgba(255,255,255,.14)', color:'#fff', fontWeight:700}}>
          {saving ? '...' : 'Сохранить'}
        </button>
        {ok ? <SaveToast text="Сохранено" /> : null}
      </div>
    </div>
  )
}
